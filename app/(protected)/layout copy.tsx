"use client"
// IMPORTING AUTH
import { auth } from "@/auth"
import LogoutButton from "@/components/logout-button"

import { useUser } from "@/context/UserContext";
import { useEffect, useState } from "react";

import { Dashboard } from "@/components/dashboard/page";


// PROTECTED LAYOUT
const ProtectedLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>
) => {

  // using the 'useUser' hook
  const values = useUser()


  // states to handle auth  
  const [isAuth, setIsAuth] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchSession = async () => {
      try {
        // AUTHENTICATION
        const session = await auth()
        if (session && session.user?.role === "admin") {
          setIsAdmin(true)
          setIsAuth(true)
        } else {
          setIsAuth(false)
          setIsAdmin(false)
        }
      } catch (error) {
        console.error("Auth error", error)
        setIsAuth(false)
      } finally {
        setLoading(false)
      }
    }
    fetchSession()
  }, [])

  // LOADING  -  if loading
  if (loading) {
    return <div>Loading...</div>
  }

  if (!isAuth || !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p>You are not an admin or authenticated.</p>
        <LogoutButton />
      </div>
    )
  }


  return (
    <div className="container flex justify-center items-center min-h-screen">

      <Dashboard  >{children}</Dashboard>

    </div>
  )
}

export default ProtectedLayout
