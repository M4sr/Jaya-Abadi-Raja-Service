import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const formData = await request.formData()
        const namaDokumen = formData.get("namaDokumen") as string
        const urutan = parseInt(formData.get("urutan") as string)
        const file = formData.get("file") as File | null
        const cover = formData.get("cover") as File | null

        const existing = await prisma.legalitas.findUnique({
            where: { id }
        })

        if (!existing) {
            return NextResponse.json({ error: "Dokumen tidak ditemukan" }, { status: 404 })
        }

        const updateData: any = {}
        if (namaDokumen) updateData.namaDokumen = namaDokumen
        if (!isNaN(urutan)) updateData.urutan = urutan

        const uploadDir = join(process.cwd(), "public", "uploads", "legalitas")
        await mkdir(uploadDir, { recursive: true })

        // 1. Handle Main File Update
        if (file && file.size > 0) {
            const fileBytes = await file.arrayBuffer()
            const fileBuffer = Buffer.from(fileBytes)
            const fileExt = file.name.split(".").pop()
            const fileFilename = `legalitas-${Date.now()}.${fileExt}`
            const filePath = join(uploadDir, fileFilename)
            await writeFile(filePath, fileBuffer)
            updateData.fileUrl = `/uploads/legalitas/${fileFilename}`
        }

        // 2. Handle Cover Update
        if (cover && cover.size > 0) {
            const coverBytes = await cover.arrayBuffer()
            const coverBuffer = Buffer.from(coverBytes)
            const coverExt = cover.name.split(".").pop()
            const coverFilename = `cover-${Date.now()}.${coverExt}`
            const coverPath = join(uploadDir, coverFilename)
            await writeFile(coverPath, coverBuffer)
            updateData.coverUrl = `/uploads/legalitas/${coverFilename}`
        }

        const updatedLegalitas = await prisma.legalitas.update({
            where: { id },
            data: updateData
        })

        return NextResponse.json(updatedLegalitas)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal memperbarui data legalitas", details: error.message }, { status: 500 })
    }
}
