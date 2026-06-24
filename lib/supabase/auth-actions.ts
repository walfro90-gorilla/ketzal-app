"use server"

/**
 * Server Actions de autenticación con Supabase Auth para Ketzal.
 *
 * Reutiliza `auth.users` (Supabase Auth) del proyecto compartido. El metadata
 * `app: 'ketzal'` enruta el trigger `handle_new_user` para crear `ketzal.profiles`
 * (y NO un workspace de agencia). El perfil arranca con role 'user'.
 *
 * Convive con NextAuth durante la migración; no lo reemplaza todavía.
 */
import { createClient } from "@/lib/supabase/server"

export type AuthResult =
  | { success: true; needsEmailConfirmation: boolean }
  | { success: false; error: string }

export async function ketzalSignUp(input: {
  email: string
  password: string
  fullName: string
}): Promise<AuthResult> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { app: "ketzal", full_name: input.fullName },
    },
  })
  if (error) return { success: false, error: error.message }
  // Si la confirmación de email está activa, no hay sesión hasta confirmar.
  const needsEmailConfirmation = !data.session
  return { success: true, needsEmailConfirmation }
}

export async function ketzalSignIn(input: {
  email: string
  password: string
}): Promise<AuthResult> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: input.email,
    password: input.password,
  })
  if (error) return { success: false, error: error.message }
  return { success: true, needsEmailConfirmation: false }
}

export async function ketzalSignOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

/** Usuario auth actual + su perfil Ketzal (rol, axo coins, etc.), o null. */
export async function getKetzalUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return { user, profile }
}
