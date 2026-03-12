import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function GET() {
    try {
        const legalitas = await prisma.legalitas.findMany({
            orderBy: { urutan: 'asc' }
        })
        return NextResponse.json(legalitas)
    } catch {
        return NextResponse.json({ error: "Gagal mengambil data legalitas" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const contentType = request.headers.get("content-type") || ""

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData()
            const file = formData.get("file") as File | null
            const cover = formData.get("cover") as File | null
            const namaDokumen = formData.get("namaDokumen") as string
            const urutan = parseInt(formData.get("urutan") as string) || 0

            if (!file || !namaDokumen) {
                return NextResponse.json({ error: "File dan nama dokumen wajib diisi" }, { status: 400 })
            }

            const uploadDir = join(process.cwd(), "public", "uploads", "legalitas")
            await mkdir(uploadDir, { recursive: true })

            // 1. Process Main File
            const fileBytes = await file.arrayBuffer()
            const fileBuffer = Buffer.from(fileBytes)
            const fileExt = file.name.split(".").pop()
            const fileFilename = `legalitas-${Date.now()}.${fileExt}`
            const filePath = join(uploadDir, fileFilename)
            await writeFile(filePath, fileBuffer)
            const fileUrl = `/uploads/legalitas/${fileFilename}`

            // 2. Process Cover Image
            let coverUrl = null
            if (cover) {
                const coverBytes = await cover.arrayBuffer()
                const coverBuffer = Buffer.from(coverBytes)
                const coverExt = cover.name.split(".").pop()
                const coverFilename = `cover-${Date.now()}.${coverExt}`
                const coverPath = join(uploadDir, coverFilename)
                await writeFile(coverPath, coverBuffer)
                coverUrl = `/uploads/legalitas/${coverFilename}`
            }

            const newLegalitas = await prisma.legalitas.create({
                data: { 
                    namaDokumen, 
                    fileUrl, 
                    coverUrl, 
                    urutan 
                }
            })
            return NextResponse.json(newLegalitas)
        }

        return NextResponse.json({ error: "Method not allowed for JSON" }, { status: 405 })
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal menambah data legalitas", details: error.message }, { status: 500 })
    }
}
