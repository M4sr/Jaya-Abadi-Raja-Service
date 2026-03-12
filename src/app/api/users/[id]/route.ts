import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const data = await request.json()

        const currentUser = await prisma.user.findUnique({ where: { id } })
        if (!currentUser) return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 })

        // Validasi Izin (Admin jangan hapus/Edit Developer/Owner)
        if ((currentUser.role === 'DEVELOPER' || currentUser.role === 'OWNER') && session.user.role === 'ADMIN') {
            return NextResponse.json({ error: "Terbatas! Admin tidak dapat mengedit Owner/Developer." }, { status: 403 })
        }

        const updateData: any = {
            name: data.name,
            email: data.email || null,
            phone: data.phone || null,
            username: data.username || null,
            role: data.role,
            isActive: data.isActive
        }

        // Jika ganti password
        if (data.password && data.password.length >= 6) {
            updateData.password = await bcrypt.hash(data.password, 10)
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedUser = await tx.user.update({
                where: { id },
                data: updateData
            })

            // Jika merubah atau update role TEKNISI
            if (data.role === 'TEKNISI') {
                const tk = await tx.teknisiProfile.findUnique({ where: { userId: id } })
                if (!tk) {
                    await tx.teknisiProfile.create({
                        data: {
                            userId: id,
                            status: updatedUser.isActive ? 'ACTIVE' : 'INACTIVE',
                            areaCoverage: data.areaCoverageArray || []
                        }
                    })
                } else {
                    const statusUpdate: any = {}
                    if (data.areaCoverageArray !== undefined) statusUpdate.areaCoverage = data.areaCoverageArray

                    // Sync status based on user isActive
                    if (!updatedUser.isActive) {
                        statusUpdate.status = 'INACTIVE'
                    } else if (tk.status === 'INACTIVE') {
                        statusUpdate.status = 'ACTIVE'
                    }

                    await tx.teknisiProfile.update({
                        where: { userId: id },
                        data: statusUpdate
                    })
                }
            }

            return updatedUser
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
        return NextResponse.json({ error: "Gagal mengupdate pengguna", details: error.message }, { status: 500 })
    }
}

// PATCH — quick toggle isActive only
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const { isActive } = await request.json()

        // Cegah toggle akun sendiri
        if (session.user.id === id) {
            return NextResponse.json({ error: "Tidak bisa menonaktifkan akun sendiri" }, { status: 400 })
        }

        const currentUser = await prisma.user.findUnique({ where: { id } })
        if (!currentUser) return NextResponse.json({ error: "Pengguna tidak ditemukan" }, { status: 404 })

        if ((currentUser.role === 'DEVELOPER' || currentUser.role === 'OWNER') && session.user.role === 'ADMIN') {
            return NextResponse.json({ error: "Admin tidak dapat mengubah status Owner/Developer." }, { status: 403 })
        }

        const updated = await prisma.$transaction(async (tx) => {
            const user = await tx.user.update({
                where: { id },
                data: { isActive },
                select: { id: true, isActive: true, role: true }
            })

            if (user.role === 'TEKNISI') {
                const tk = await tx.teknisiProfile.findUnique({ where: { userId: id } })
                if (tk) {
                    await tx.teknisiProfile.update({
                        where: { userId: id },
                        data: {
                            status: isActive ? (tk.status === 'INACTIVE' ? 'ACTIVE' : tk.status) : 'INACTIVE'
                        }
                    })
                }
            }

            return user
        })

        return NextResponse.json(updated)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal mengubah status akun", details: error.message }, { status: 500 })
    }
}
