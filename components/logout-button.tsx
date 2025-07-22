"use client"

import { signOut } from "next-auth/react"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

const LogoutButton = () => {
    const [isLoading, setIsLoading] = useState(false)

    const handleClick = async () => {
        try {
            setIsLoading(true)
            // Logout sin redirección automática
            await signOut({
                redirect: false
            })
            // Redirección forzada al home usando window.location
            window.location.href = '/'
        } catch (error) {
            console.error('Error during logout:', error)
            // En caso de error, también redirigir al home
            window.location.href = '/'
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
            {isLoading ? 'Cerrando sesión...' : 'Cerrar sesión'}
        </Button>      
    </div>
  )
}

export default LogoutButton
