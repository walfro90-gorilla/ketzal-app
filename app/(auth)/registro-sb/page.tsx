import { SupabaseRegisterForm } from "@/components/supabase-register-form"

// Registro vía Supabase Auth (nuevo flujo). Convive con /register (NextAuth)
// hasta validar y hacer el swap.
export default function RegistroSupabasePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <SupabaseRegisterForm />
    </div>
  )
}
