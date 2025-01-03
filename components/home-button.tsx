"use client"

import { Button } from "./ui/button"

const HomeButton = () => {

    const handleClick = async () => {
        window.location.href = "/"
    }

  return (
    <div>
        <Button onClick={handleClick} >Home</Button>      
    </div>
  )
}

export default HomeButton
