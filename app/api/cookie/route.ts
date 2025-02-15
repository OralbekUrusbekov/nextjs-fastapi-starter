import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    const C = cookies()

    try {
        const { token } = await req.json()

        if (!token) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 })
        }

        C.set("session", token, {
            path: "/",
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 күн
        })

        return NextResponse.json({ message: "Cookie set successfully" })
    } catch (error) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
}
