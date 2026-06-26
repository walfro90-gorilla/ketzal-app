-- ============================================================================
-- KETZAL · FASE 6 — RPCs Wallet (operaciones transaccionales sobre saldos)
-- ============================================================================
-- Patron senior:
-- - SECURITY DEFINER + SET search_path (anti search_path attack)
-- - SELECT FOR UPDATE en wallets para serializar concurrent ops
-- - Locks determinista por user_id en transfer (anti-deadlock)
-- - Validaciones de inputs (positivos, no-cero, mismo-user, saldo suficiente)
-- - Retorno jsonb friendly al cliente: {success, wallet?, message?, transactionId?}
-- - RLS de wallets sigue bloqueando writes desde cliente; estas funciones son
--   la unica via que muta saldos (corren como definer => bypass RLS).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- wallet_ensure: get-or-create wallet del usuario.
-- ---------------------------------------------------------------------------
create or replace function ketzal.wallet_ensure(p_user_id uuid default null)
returns ketzal.wallets
language plpgsql
security definer
set search_path = ketzal, public
as $$
declare
  v_user_id uuid := coalesce(p_user_id, auth.uid());
  v_wallet ketzal.wallets;
begin
  if v_user_id is null then
    raise exception 'wallet_ensure: sin user_id ni auth.uid';
  end if;
  select * into v_wallet from ketzal.wallets where user_id = v_user_id;
  if not found then
    insert into ketzal.wallets (user_id, balance_mxn, balance_axo)
    values (v_user_id, 0, 0)
    returning * into v_wallet;
  end if;
  return v_wallet;
end;
$$;

-- ---------------------------------------------------------------------------
-- wallet_add_funds: deposita amounts + registra txn.
-- ---------------------------------------------------------------------------
create or replace function ketzal.wallet_add_funds(
  p_amount_mxn numeric default 0,
  p_amount_axo numeric default 0,
  p_description text default 'Deposito',
  p_reference text default null,
  p_type ketzal.wallet_txn_type default 'DEPOSIT'
)
returns jsonb
language plpgsql
security definer
set search_path = ketzal, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_wallet ketzal.wallets;
  v_txn_id uuid;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'No autenticado');
  end if;
  if p_amount_mxn < 0 or p_amount_axo < 0 then
    return jsonb_build_object('success', false, 'message', 'Montos deben ser positivos');
  end if;
  if p_amount_mxn = 0 and p_amount_axo = 0 then
    return jsonb_build_object('success', false, 'message', 'Monto cero');
  end if;

  perform ketzal.wallet_ensure(v_user_id);
  select * into v_wallet from ketzal.wallets where user_id = v_user_id for update;

  update ketzal.wallets
  set balance_mxn = balance_mxn + p_amount_mxn,
      balance_axo = balance_axo + p_amount_axo,
      updated_at = now()
  where id = v_wallet.id
  returning * into v_wallet;

  insert into ketzal.wallet_transactions (wallet_id, type, amount_mxn, amount_axo, description, reference)
  values (v_wallet.id, p_type, nullif(p_amount_mxn, 0), nullif(p_amount_axo, 0), p_description, p_reference)
  returning id into v_txn_id;

  return jsonb_build_object(
    'success', true,
    'wallet', row_to_json(v_wallet),
    'transactionId', v_txn_id
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- wallet_purchase: descuenta amounts del wallet (valida saldo).
-- ---------------------------------------------------------------------------
create or replace function ketzal.wallet_purchase(
  p_amount_mxn numeric default 0,
  p_amount_axo numeric default 0,
  p_description text default 'Compra',
  p_reference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ketzal, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_wallet ketzal.wallets;
  v_txn_id uuid;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'No autenticado');
  end if;
  if p_amount_mxn < 0 or p_amount_axo < 0 then
    return jsonb_build_object('success', false, 'message', 'Montos deben ser positivos');
  end if;
  if p_amount_mxn = 0 and p_amount_axo = 0 then
    return jsonb_build_object('success', false, 'message', 'Monto cero');
  end if;

  perform ketzal.wallet_ensure(v_user_id);
  select * into v_wallet from ketzal.wallets where user_id = v_user_id for update;

  if v_wallet.balance_mxn < p_amount_mxn or v_wallet.balance_axo < p_amount_axo then
    return jsonb_build_object('success', false, 'message', 'Saldo insuficiente');
  end if;

  update ketzal.wallets
  set balance_mxn = balance_mxn - p_amount_mxn,
      balance_axo = balance_axo - p_amount_axo,
      updated_at = now()
  where id = v_wallet.id
  returning * into v_wallet;

  insert into ketzal.wallet_transactions (wallet_id, type, amount_mxn, amount_axo, description, reference)
  values (v_wallet.id, 'PURCHASE', nullif(p_amount_mxn, 0), nullif(p_amount_axo, 0), p_description, p_reference)
  returning id into v_txn_id;

  return jsonb_build_object(
    'success', true,
    'wallet', row_to_json(v_wallet),
    'transactionId', v_txn_id
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- wallet_transfer: mueve amounts entre dos wallets.
-- Lock determinista por user_id::text para prevenir deadlocks (clasico
-- problema de "philosopher's dining" si dos transfers cruzados se ejecutan en
-- paralelo).
-- ---------------------------------------------------------------------------
create or replace function ketzal.wallet_transfer(
  p_to_user_id uuid,
  p_amount_mxn numeric default 0,
  p_amount_axo numeric default 0,
  p_description text default 'Transferencia',
  p_reference text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ketzal, public
as $$
declare
  v_from_user uuid := auth.uid();
  v_from_wallet ketzal.wallets;
  v_to_wallet ketzal.wallets;
  v_first uuid;
  v_second uuid;
begin
  if v_from_user is null then
    return jsonb_build_object('success', false, 'message', 'No autenticado');
  end if;
  if p_to_user_id is null then
    return jsonb_build_object('success', false, 'message', 'Destino requerido');
  end if;
  if p_to_user_id = v_from_user then
    return jsonb_build_object('success', false, 'message', 'No se puede transferir a si mismo');
  end if;
  if p_amount_mxn < 0 or p_amount_axo < 0 then
    return jsonb_build_object('success', false, 'message', 'Montos deben ser positivos');
  end if;
  if p_amount_mxn = 0 and p_amount_axo = 0 then
    return jsonb_build_object('success', false, 'message', 'Monto cero');
  end if;

  perform ketzal.wallet_ensure(v_from_user);
  perform ketzal.wallet_ensure(p_to_user_id);

  -- Lock en orden determinista por user_id::text (anti-deadlock).
  if v_from_user::text < p_to_user_id::text then
    v_first := v_from_user;
    v_second := p_to_user_id;
  else
    v_first := p_to_user_id;
    v_second := v_from_user;
  end if;
  perform 1 from ketzal.wallets where user_id = v_first for update;
  perform 1 from ketzal.wallets where user_id = v_second for update;

  select * into v_from_wallet from ketzal.wallets where user_id = v_from_user;
  select * into v_to_wallet from ketzal.wallets where user_id = p_to_user_id;

  if v_from_wallet.balance_mxn < p_amount_mxn or v_from_wallet.balance_axo < p_amount_axo then
    return jsonb_build_object('success', false, 'message', 'Saldo insuficiente');
  end if;

  update ketzal.wallets
  set balance_mxn = balance_mxn - p_amount_mxn,
      balance_axo = balance_axo - p_amount_axo,
      updated_at = now()
  where id = v_from_wallet.id
  returning * into v_from_wallet;

  update ketzal.wallets
  set balance_mxn = balance_mxn + p_amount_mxn,
      balance_axo = balance_axo + p_amount_axo,
      updated_at = now()
  where id = v_to_wallet.id
  returning * into v_to_wallet;

  insert into ketzal.wallet_transactions (wallet_id, type, amount_mxn, amount_axo, description, reference)
  values
    (v_from_wallet.id, 'TRANSFER_SENT',     nullif(p_amount_mxn, 0), nullif(p_amount_axo, 0), p_description, p_reference),
    (v_to_wallet.id,   'TRANSFER_RECEIVED', nullif(p_amount_mxn, 0), nullif(p_amount_axo, 0), p_description, p_reference);

  return jsonb_build_object('success', true, 'wallet', row_to_json(v_from_wallet));
end;
$$;

-- ---------------------------------------------------------------------------
-- wallet_convert: convierte saldo entre MXN <-> AXO a tasa dada.
-- p_from_currency: 'MXN' o 'AXO'. p_rate: cuantos del destino por 1 del origen.
-- Registra UN txn tipo PURCHASE con amounts signados (- en origen, + en destino).
-- ---------------------------------------------------------------------------
create or replace function ketzal.wallet_convert(
  p_from_currency text,
  p_amount numeric,
  p_rate numeric,
  p_description text default null
)
returns jsonb
language plpgsql
security definer
set search_path = ketzal, public
as $$
declare
  v_user_id uuid := auth.uid();
  v_wallet ketzal.wallets;
  v_desc text := coalesce(p_description, 'Conversion ' || p_from_currency || ' -> ' || (case when p_from_currency='MXN' then 'AXO' else 'MXN' end));
  v_txn_id uuid;
  v_amt_mxn numeric;
  v_amt_axo numeric;
begin
  if v_user_id is null then
    return jsonb_build_object('success', false, 'message', 'No autenticado');
  end if;
  if p_amount <= 0 then
    return jsonb_build_object('success', false, 'message', 'Monto debe ser positivo');
  end if;
  if p_rate <= 0 then
    return jsonb_build_object('success', false, 'message', 'Tasa debe ser positiva');
  end if;
  if p_from_currency not in ('MXN', 'AXO') then
    return jsonb_build_object('success', false, 'message', 'p_from_currency debe ser MXN o AXO');
  end if;

  perform ketzal.wallet_ensure(v_user_id);
  select * into v_wallet from ketzal.wallets where user_id = v_user_id for update;

  if p_from_currency = 'MXN' then
    if v_wallet.balance_mxn < p_amount then
      return jsonb_build_object('success', false, 'message', 'Saldo MXN insuficiente');
    end if;
    v_amt_mxn := -p_amount;
    v_amt_axo := p_amount * p_rate;
    update ketzal.wallets
    set balance_mxn = balance_mxn - p_amount,
        balance_axo = balance_axo + (p_amount * p_rate),
        updated_at = now()
    where id = v_wallet.id
    returning * into v_wallet;
  else -- AXO
    if v_wallet.balance_axo < p_amount then
      return jsonb_build_object('success', false, 'message', 'Saldo AXO insuficiente');
    end if;
    v_amt_axo := -p_amount;
    v_amt_mxn := p_amount * p_rate;
    update ketzal.wallets
    set balance_axo = balance_axo - p_amount,
        balance_mxn = balance_mxn + (p_amount * p_rate),
        updated_at = now()
    where id = v_wallet.id
    returning * into v_wallet;
  end if;

  insert into ketzal.wallet_transactions (wallet_id, type, amount_mxn, amount_axo, description)
  values (v_wallet.id, 'PURCHASE', v_amt_mxn, v_amt_axo, v_desc)
  returning id into v_txn_id;

  return jsonb_build_object(
    'success', true,
    'wallet', row_to_json(v_wallet),
    'transactionId', v_txn_id
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Grants
-- ---------------------------------------------------------------------------
grant execute on function ketzal.wallet_ensure(uuid)                                     to authenticated, service_role;
grant execute on function ketzal.wallet_add_funds(numeric, numeric, text, text, ketzal.wallet_txn_type) to authenticated, service_role;
grant execute on function ketzal.wallet_purchase(numeric, numeric, text, text)           to authenticated, service_role;
grant execute on function ketzal.wallet_transfer(uuid, numeric, numeric, text, text)     to authenticated, service_role;
grant execute on function ketzal.wallet_convert(text, numeric, numeric, text)            to authenticated, service_role;
