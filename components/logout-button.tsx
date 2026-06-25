"use client"

import { signOut } from "@/lib/auth/client"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        try {
            setIsLoading(true)
            // Logout con redirecciÃ³n a login
            await signOut({
                callbackUrl: '/login',
                redirect: true
            })
        } catch (error) {
            console.error('Error during logout:', error)
            // En caso de error, tambiÃ©n redirigir al login
            window.location.href = '/login'
        } finally {
            setIsLoading(false)
        }
    }

  return (
    <div>
        <Button 
            onClick={handleClick} 
            variant="outline"
            disabled={isLoading}
            className="flex items-center gap-2"
        >
            <LogOut size={16} />
            {isLoading ? 'Cerrando sesiÃ³n...' : 'Cerrar sesiÃ³n'}
        </Button>      
    </div>
  )
}

export default LogoutButton
