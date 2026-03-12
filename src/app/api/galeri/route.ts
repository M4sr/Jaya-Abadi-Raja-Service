import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"


export async function GET() {
    try {
        const galeries = await prisma.galeriFoto.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(galeries)
    } catch {
        return NextResponse.json({ error: "Gagal mengambil data galeri" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const contentType = request.headers.get("content-type") || ""

        // Handle file upload via FormData
        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData()
            const file = formData.get("file") as File | null
            const judul = formData.get("judul") as string | null

            if (!file) {
                return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
            }

            const uploadDir = join(process.cwd(), "public", "uploads")
            await mkdir(uploadDir, { recursive: true })

            const bytes = await file.arrayBuffer()
            const buffer = Buffer.from(bytes)

            const ext = file.name.split(".").pop()
            const filename = `galeri-${Date.now()}-${Math.round(Math.random() * 1000)}.${ext}`
            const filepath = join(uploadDir, filename)

            await writeFile(filepath, buffer)

            const fotoUrl = `/uploads/${filename}`
            const newGaleri = await prisma.galeriFoto.create({
                data: { judul: judul || null, fotoUrl }
            })
            return NextResponse.json(newGaleri)
        }

        // JSON fallback
        const data = await request.json()
        if (!data.fotoUrl) {
            return NextResponse.json({ error: "Foto URL wajib diisi" }, { status: 400 })
        }

        const newGaleri = await prisma.galeriFoto.create({
            data: { judul: data.judul, fotoUrl: data.fotoUrl }
        })
        return NextResponse.json(newGaleri)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal menambah foto galeri", details: error.message }, { status: 500 })
    }
}
