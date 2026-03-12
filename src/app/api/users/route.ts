import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function GET(request: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const roleOpt = searchParams.get('role')

        const whereCondition: any = {}
        if (roleOpt && roleOpt !== 'ALL') {
            whereCondition.role = roleOpt
        }

        const users = await prisma.user.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                username: true,
                role: true,
                isActive: true,
                createdAt: true,
                lastLoginAt: true,
                teknisiProfile: {
                    select: { status: true, totalJobs: true, ratingAvg: true }
                }
            }
        })

        return NextResponse.json(users)
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data pengguna" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await request.json()

        if (!data.name || !data.password || !data.role) {
            return NextResponse.json({ error: "Nama, Password, dan Role wajib diisi" }, { status: 400 })
        }

        // Only OWNER or DEVELOPER can create new ADMIN/OWNER
        if ((data.role === 'ADMIN' || data.role === 'OWNER') && session.user.role !== 'OWNER' && session.user.role !== 'DEVELOPER') {
            return NextResponse.json({ error: "Hanya Owner/Developer yang dapat membuat Admin/Owner baru" }, { status: 403 })
        }

        const hashedPassword = await bcrypt.hash(data.password, 10)

        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name: data.name,
                    email: data.email || null,
                    phone: data.phone || null,
                    username: data.username || null,
                    password: hashedPassword,
                    role: data.role,
                    isActive: data.isActive ?? true,
                }
            })

            // Jika role adalah TEKNISI, otomatis buatkan record TeknisiProfile
            if (data.role === 'TEKNISI') {
                await tx.teknisiProfile.create({
                    data: {
                        userId: newUser.id,
                        status: newUser.isActive ? 'ACTIVE' : 'INACTIVE',
                        areaCoverage: data.areaCoverageArray || []
                    }
                })
            }

            return newUser
        })

        const { password, ...userWithoutPassword } = result
        return NextResponse.json(userWithoutPassword)
    } catch (error: any) {
        if (error.code === 'P2002') {
            const target = error.meta?.target as string | string[]
            let field = "Email, Username, atau No HP"
            let fieldCode = "unknown"
            if (target && target.includes('email')) { field = "Email"; fieldCode = "email" }
            else if (target && target.includes('username')) { field = "Username"; fieldCode = "username" }
            else if (target && target.includes('phone')) { field = "Nomor Ponsel"; fieldCode = "phone" }
            return NextResponse.json({ error: `${field} sudah digunakan oleh pengguna lain`, field: fieldCode }, { status: 400 })
        }
        return NextResponse.json({ error: "Gagal menambah pengguna", details: error.message }, { status: 500 })
    }
}
