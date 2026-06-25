import { SupabaseLoginForm } from "@/components/supabase-login-form"

// /login es ahora canonico Supabase. /login-sb queda como alias historico.
export default function LoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <SupabaseLoginForm />
    </div>
  )
}
