// Wallet API sobre Supabase (schema `ketzal`).
// Lecturas: directo con RLS (dueno solo puede ver lo suyo).
// Escrituras: RPCs SECURITY DEFINER (wallet_add_funds, wallet_transfer,
// wallet_purchase, wallet_convert) que serializan con SELECT FOR UPDATE.
import { Wallet, WalletTransaction, AddFundsRequest, TransferRequest, ConvertCurrencyRequest } from "@/types/wallet"
import { createClient } from "@/lib/supabase/client"

type WalletResult = { success: boolean; wallet?: Wallet; message?: string }
type TxPagination = { total: number; limit: number; offset: number; hasMore: boolean }
type TxResult = {
  success: boolean
  transactions?: WalletTransaction[]
  pagination?: TxPagination
  message?: string
}

const WALLET_SELECT =
  "id, userId:user_id, balanceMXN:balance_mxn, balanceAxo:balance_axo, createdAt:created_at, updatedAt:updated_at"

const TXN_SELECT =
  "id, walletId:wallet_id, type, amountMXN:amount_mxn, amountAxo:amount_axo, description, reference, createdAt:created_at"

// ponytail: las RPCs wallet_* viven en el DB pero database.types.ts solo conoce
// is_superadmin/my_supplier_id. Cast del nombre al narrowtype para puentear.
type RpcName = "is_superadmin" | "my_supplier_id"
type RpcWalletResp = { success: boolean; wallet?: Wallet; message?: string; transactionId?: string }

// Tasa por defecto MXN <-> AXO (10 AXO = 1 MXN). Configurable luego via env/config.
const DEFAULT_RATE_MXN_TO_AXO = 10
const DEFAULT_RATE_AXO_TO_MXN = 0.1

// ----------------------------------------------------------------------------
// READ
// ----------------------------------------------------------------------------
export const getWallet = async (_userId: string): Promise<WalletResult> => {
  void _userId
  const sb = createClient()
  await sb.rpc("wallet_ensure" as RpcName)
  const { data, error } = await sb
    .from("wallets")
    .select(WALLET_SELECT)
    .maybeSingle()
    .returns<Wallet>()
  if (error) return { success: false, message: error.message }
  if (!data) return { success: false, message: "Wallet no encontrada" }
  return { success: true, wallet: data }
}

export const getTransactions = async (
  _userId: string,
  limit: number = 20,
  offset: number = 0
): Promise<TxResult> => {
  void _userId
  const sb = createClient()
  const { data, error, count } = await sb
    .from("wallet_transactions")
    .select(TXN_SELECT, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1)
    .returns<WalletTransaction[]>()
  if (error) return { success: false, message: error.message }
  const total = count ?? 0
  return {
    success: true,
    transactions: data ?? [],
    pagination: { total, limit, offset, hasMore: offset + limit < total },
  }
}

// ----------------------------------------------------------------------------
// WRITE — RPCs SECURITY DEFINER (auth.uid() determina el dueno).
// ----------------------------------------------------------------------------
export const addFunds = async (_userId: string, request: AddFundsRequest): Promise<WalletResult> => {
  void _userId
  const sb = createClient()
  const { data, error } = await sb.rpc("wallet_add_funds" as RpcName, {
    p_amount_mxn: request.amountMXN ?? 0,
    p_amount_axo: request.amountAxo ?? 0,
    p_description: request.description ?? "Deposito",
    p_reference: request.paymentMethod ?? null,
    p_type: "DEPOSIT",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
  if (error) return { success: false, message: error.message }
  const r = data as unknown as RpcWalletResp
  return { success: r.success, wallet: r.wallet, message: r.message }
}

export const transferFunds = async (
  _userId: string,
  request: TransferRequest
): Promise<WalletResult> => {
  void _userId
  const sb = createClient()
  // Resolver recipientEmail -> user_id via ketzal.profiles.
  const { data: dest, error: destErr } = await sb
    .from("profiles")
    .select("id")
    .eq("email", request.recipientEmail)
    .maybeSingle()
    .returns<{ id: string }>()
  if (destErr) return { success: false, message: destErr.message }
  if (!dest) return { success: false, message: "Destinatario no encontrado" }

  const { data, error } = await sb.rpc("wallet_transfer" as RpcName, {
    p_to_user_id: dest.id,
    p_amount_mxn: request.amountMXN ?? 0,
    p_amount_axo: request.amountAxo ?? 0,
    p_description: request.description ?? "Transferencia",
    p_reference: null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
  if (error) return { success: false, message: error.message }
  const r = data as unknown as RpcWalletResp
  return { success: r.success, wallet: r.wallet, message: r.message }
}

export const convertCurrency = async (
  _userId: string,
  request: ConvertCurrencyRequest
): Promise<WalletResult> => {
  void _userId
  const sb = createClient()
  if (request.fromCurrency === request.toCurrency) {
    return { success: false, message: "Origen y destino iguales" }
  }
  const rate =
    request.fromCurrency === "MXN" ? DEFAULT_RATE_MXN_TO_AXO : DEFAULT_RATE_AXO_TO_MXN
  const { data, error } = await sb.rpc("wallet_convert" as RpcName, {
    p_from_currency: request.fromCurrency,
    p_amount: request.amount,
    p_rate: rate,
    p_description: `Conversion ${request.fromCurrency} -> ${request.toCurrency}`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
  if (error) return { success: false, message: error.message }
  const r = data as unknown as RpcWalletResp
  return { success: r.success, wallet: r.wallet, message: r.message }
}

// purchase: utility para el checkout (consume saldo). No estaba expuesto antes.
export const purchase = async (
  amountMxn: number,
  amountAxo: number = 0,
  description: string = "Compra",
  reference?: string
): Promise<WalletResult> => {
  const sb = createClient()
  const { data, error } = await sb.rpc("wallet_purchase" as RpcName, {
    p_amount_mxn: amountMxn,
    p_amount_axo: amountAxo,
    p_description: description,
    p_reference: reference ?? null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
  if (error) return { success: false, message: error.message }
  const r = data as unknown as RpcWalletResp
  return { success: r.success, wallet: r.wallet, message: r.message }
}
