import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const { name, email, phone } = await request.json()

        if (!name || !email || !phone) {
            return NextResponse.json({ error: "Data tidak lengkap" }, { status: 400 })
        }

        // Note: For simplicity, we search by email since the technician is logged in.
        // In a real scenario, you'd use a session token to get the user ID.
        const user = await prisma.user.update({
            where: { email: email },
            data: {
                name: name,
                phone: phone,
                // Add email update logic if needed, but email is often the unique key.
            },
            include: {
                teknisiProfile: true
            }
        })

        if (!user) {
            return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 })
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
            message: "Profil berhasil diperbarui",
            user: responseData
        })
    } catch (error: any) {
        console.error("Update Profile Technical Error:", error)
        return NextResponse.json({ error: "Gagal memperbarui profil", details: error.message }, { status: 500 })
    }
}
