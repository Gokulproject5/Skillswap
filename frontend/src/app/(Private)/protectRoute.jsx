"use client"
import { useAuth } from "@/Context/authContext"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const ProtectRoute = ({ children }) => {
    const navigate = useRouter()
    const { user, isAuthenticated, loading } = useAuth();

    useEffect(() => {

        if (loading) return

        if (!isAuthenticated) {
            navigate.replace("/auth/login");

        }

    }, [navigate, loading, isAuthenticated])


    if (loading || !isAuthenticated) {
        return (
            <div className="flex space-x-2 min-h-screen justify-center text-center items-center">
                <div className="w-5 h-5  border-blue-500 border-2  border-t-0 animate-spin rounded-full"></div> <p>Loading...</p>
            </div>)
    }

    return <>{children}</>
}

export default ProtectRoute
