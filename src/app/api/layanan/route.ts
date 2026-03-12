import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"


export async function GET(request: Request) {
    try {
        const layanan = await prisma.layanan.findMany({
            orderBy: { urutan: 'asc' }
        })
        return NextResponse.json(layanan)
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data layanan" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await request.json()

        // Auto-generate slug if not provided
        if (!data.slug) {
            data.slug = data.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }

        const newLayanan = await prisma.layanan.create({
            data: {
                kategoriId: data.kategoriId || null,
                nama: data.nama,
                slug: data.slug,
                deskripsi: data.deskripsi,
                deskripsiLengkap: data.deskripsiLengkap,
                hargaMulai: parseInt(data.hargaMulai) || 0,
                estimasiMenit: parseInt(data.estimasiMenit) || 60,
                foto: data.foto,
                isActive: data.isActive !== undefined ? data.isActive : true,
                urutan: parseInt(data.urutan) || 0,
            }
        })

        return NextResponse.json(newLayanan)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal membuat layanan", details: error.message }, { status: 500 })
    }
}
