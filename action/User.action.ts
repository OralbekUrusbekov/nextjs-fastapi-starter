import { POST } from "@/app/api/cookie/route"
import React from "react"

export const useSignIn = () => {
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const signIn = async (email: string, password: string) => {
        setIsLoading(true)
        setError("")

        try {
            const res = await fetch("http://127.0.0.1:8080", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: email,
                    password: password
                })
            })

            const data = await res.json()

            POST(data)
            
            
            if (!res.ok) {
                throw new Error(data.error || "Invalid credentials")
            }

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return {
        isLoading,
        error,
        signIn
    } as const
}
