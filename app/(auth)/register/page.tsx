import { SupabaseRegisterForm } from "@/components/supabase-register-form"

// /register es ahora canonico Supabase. /registro-sb queda como alias historico.
export default function RegisterPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <SupabaseRegisterForm />
    </div>
  )
}
