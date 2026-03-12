import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File | null

        if (!file) {
            return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json({ error: "Hanya file gambar yang diizinkan" }, { status: 400 })
        }

        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: "Ukuran maksimal 5MB" }, { status: 400 })
        }

        const uploadDir = join(process.cwd(), "public", "uploads", "artikel")
        await mkdir(uploadDir, { recursive: true })

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const ext = file.name.split(".").pop()
        const filename = `artikel-${Date.now()}-${Math.round(Math.random() * 1000)}.${ext}`
        const filepath = join(uploadDir, filename)

        await writeFile(filepath, buffer)

        return NextResponse.json({ url: `/uploads/artikel/${filename}` })
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal upload gambar", details: error.message }, { status: 500 })
    }
}
