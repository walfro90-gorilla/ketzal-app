import { redirect } from "next/navigation"
import { getKetzalUser, ketzalSignOut } from "@/lib/supabase/auth-actions"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

// Página de validación E2E: muestra el usuario de Supabase Auth + su perfil
// Ketzal (rol, AXO coins). Si no hay sesión, manda a /login-sb.
export default async function CuentaSupabasePage() {
  const result = await getKetzalUser()
  if (!result) redirect("/login-sb")

  const { user, profile } = result

  async function signOutAction() {
    "use server"
    await ketzalSignOut()
    redirect("/login-sb")
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            ✅ Sesión Supabase activa
          </CardTitle>
          <CardDescription className="text-gray-600">
            Autenticado contra <code>auth.users</code> + perfil en <code>ketzal.profiles</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="text-sm divide-y divide-gray-100">
            <div className="flex justify-between py-2">
              <dt className="text-gray-500">Email</dt>
              <dd className="font-medium text-gray-800">{user.email}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-500">Nombre</dt>
              <dd className="font-medium text-gray-800">{profile?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-500">Rol</dt>
              <dd className="font-medium text-gray-800">{profile?.role ?? "—"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-500">AXO Coins</dt>
              <dd className="font-medium text-gray-800">{profile?.axo_coins_earned ?? "—"}</dd>
            </div>
            <div className="flex justify-between py-2">
              <dt className="text-gray-500">User ID</dt>
              <dd className="font-mono text-xs text-gray-600">{user.id}</dd>
            </div>
          </dl>

          {!profile && (
            <div className="text-amber-700 text-sm p-3 bg-amber-50 border border-amber-200 rounded-lg">
              No se encontró perfil en <code>ketzal.profiles</code>. Si te registraste
              fuera del flujo Ketzal (sin <code>app:&apos;ketzal&apos;</code>), el trigger no lo creó.
            </div>
          )}

          <form action={signOutAction}>
            <Button type="submit" variant="outline" className="w-full">
              Cerrar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
