import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: Request) {
    try {
        const { username, password } = await request.json()

        if (!username || !password) {
            return NextResponse.json({ error: "Username dan password diperlukan" }, { status: 400 })
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { username: username },
                    { email: username },
                ],
                role: "TEKNISI",
                isActive: true
            },
            include: {
                teknisiProfile: true
            }
        })

        if (!user || !user.password) {
            return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            return NextResponse.json({ error: "Username atau password salah" }, { status: 401 })
        }

        // Prepare response (exclude password)
        const responseData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
            teknisiProfile: user.teknisiProfile
        }

        return NextResponse.json({
            success: true,
            message: "Login berhasil",
            user: responseData
        })
    } catch (error: any) {
        console.error("Login Technical Error:", error)
        return NextResponse.json({ error: "Gagal login", details: error.message }, { status: 500 })
    }
}
