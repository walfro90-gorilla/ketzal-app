import { Dashboard } from "@/components/dashboard/page";

// IMPORTING AUTH
import { auth } from "@/auth"
import LogoutButton from "@/components/logout-button"


const ProtectedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) => {

  // AUTHENTICATION
  const session = await auth()
  if (!session) {
    return <div> Not authenticated </div>
  }


  return (
    <div className="container flex justify-center items-center min-h-screen">
      <div className="container">
        <pre>{JSON.stringify(session, null, 2)}</pre>
        <LogoutButton />
      </div>
      <Dashboard>{children}</Dashboard>
    </div>
  )
}

export default ProtectedLayout
