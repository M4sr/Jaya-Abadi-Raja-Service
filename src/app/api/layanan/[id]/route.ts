import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"


export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const layanan = await prisma.layanan.findUnique({
            where: { id }
        })

        if (!layanan) {
            return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 404 })
        }

        return NextResponse.json(layanan)
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data layanan" }, { status: 500 })
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const data = await request.json()

        // Jika nama berubah tapi slug kosong, otomatis update slug
        if (data.nama && !data.slug) {
            data.slug = data.nama.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }

        const updatedLayanan = await prisma.layanan.update({
            where: { id },
            data: {
                kategoriId: data.kategoriId || null,
                nama: data.nama,
                slug: data.slug,
                deskripsi: data.deskripsi,
                deskripsiLengkap: data.deskripsiLengkap,
                hargaMulai: data.hargaMulai ? parseInt(data.hargaMulai) : undefined,
                estimasiMenit: data.estimasiMenit ? parseInt(data.estimasiMenit) : undefined,
                foto: data.foto,
                isActive: data.isActive,
                urutan: data.urutan ? parseInt(data.urutan) : undefined,
            }
        })

        return NextResponse.json(updatedLayanan)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal mengupdate layanan", details: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        await prisma.layanan.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: "Layanan berhasil dihapus" })
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal menghapus layanan", details: error.message }, { status: 500 })
    }
}
