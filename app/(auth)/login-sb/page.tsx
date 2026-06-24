import { SupabaseLoginForm } from "@/components/supabase-login-form"

// Login vía Supabase Auth (nuevo flujo). Convive con /login (NextAuth) hasta
// validar y hacer el swap.
export default function LoginSupabasePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <SupabaseLoginForm />
    </div>
  )
}
