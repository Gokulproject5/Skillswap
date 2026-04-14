"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const ProtectRoute = ({ children }) => {
    const navigate = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        const loginAuth = sessionStorage.getItem("Login")
        // const token = sessionStorage.getItem("token")

        if (!loginAuth ) {
            navigate.replace("/auth/login")
        } else {
            setIsAuthenticated(true)
        }
    }, [navigate])


    if (!isAuthenticated) {
        return( 
            <div className="flex space-x-2 min-h-screen justify-center text-center items-center">
              <div className="w-5 h-5  border-blue-500 border-2  border-t-0 animate-spin rounded-full"></div> <p>Loading...</p> 
                </div>)
    }

    return <>{children}</>
}

export default ProtectRoute
