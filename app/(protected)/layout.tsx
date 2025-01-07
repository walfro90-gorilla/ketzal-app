import { Dashboard } from "@/components/dashboard/page";

// IMPORTING AUTH
import { auth } from "@/auth"
import LogoutButton from "@/components/logout-button"
import { Button } from "@/components/ui/button";
import HomeButton from "@/components/home-button";
import { AlertDialogProvider } from "@/components/alert-dialog"

import {useUser } from "@/context/UserContext"

const ProtectedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  // AUTHENTICATION
  const session = await auth()
  // const values = useUser()

  // IF USER IS NOT AUTHENTICATED
  if (session?.user?.role === "user") {
    return <div>
      You are not an admin authenticated
      <div className="flex space-x-4">
        <LogoutButton />
        <HomeButton />
      </div>
    </div>
  }

  return (
    <AlertDialogProvider>
      <div className="container flex justify-center items-center min-h-screen">
        <Dashboard session={session}>{children}</Dashboard>
      </div>
    </AlertDialogProvider>
  )
}

export default ProtectedLayout
