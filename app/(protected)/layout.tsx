import { Dashboard } from "@/components/dashboard/page";

// IMPORTING AUTH
import { auth } from "@/auth"
import LogoutButton from "@/components/logout-button"
import HomeButton from "@/components/home-button";
import { AlertDialogProvider } from "@/components/alert-dialog"

const ProtectedLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {

  // AUTHENTICATION
  const session = await auth()
  // const values = useUser()

  // IF USER IS NOT AUTHENTICATED
  if (!session) {
    return <div>
      No session found. Please log in.
      <div className="flex space-x-4">
        <LogoutButton />
        <HomeButton />
      </div>
    </div>
  }

  // Adapt session to match SessionType
  const sessionForDashboard = {
    calendars: [],
    user: {
      ...session.user,
      id: session.user?.id || "",
      name: session.user?.name || "",
      email: session.user?.email || "",
      avatar: (session.user as { avatar?: string }).avatar || "", // explicitly define the type for avatar
      supplierId: session.user?.supplierId || "",
      role: (session.user?.role as "superadmin" | "admin" | "adminsup") || "admin",
    },
  };

  if (session.user?.role === "user") {
    return <div>
      You are not an admin authenticated
      <div className="flex space-x-4">
        <LogoutButton />
        <HomeButton />
      </div>
    </div>
  }

  return (
    <main className="flex-grow w-full flex flex-col">
      <AlertDialogProvider>
        <div >
          <Dashboard session={sessionForDashboard}>{children}</Dashboard>
        </div>
      </AlertDialogProvider>
    </main>
  )
}

export default ProtectedLayout
