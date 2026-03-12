import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"


export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const article = await prisma.article.findUnique({
            where: { id }
        })

        if (!article) return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 })

        return NextResponse.json(article)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal mengambil data artikel", details: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const data = await request.json()

        if (!data.judul || !data.konten) {
            return NextResponse.json({ error: "Judul dan konten wajib diisi" }, { status: 400 })
        }

        const currentArticle = await prisma.article.findUnique({ where: { id } })
        if (!currentArticle) return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 })

        const slug = data.slug || data.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

        const wordCount = data.konten.replace(/<[^>]*>?/gm, '').split(/\s+/).length
        const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200))

        // Handle Publish Date: IF it wasn't published and now is, set date.
        let publishedAt = currentArticle.publishedAt;
        if (!currentArticle.isPublished && data.isPublished) {
            publishedAt = new Date()
        } else if (!data.isPublished) {
            publishedAt = null
        }

        const updatedArticle = await prisma.article.update({
            where: { id },
            data: {
                kategori: data.kategori || "Umum",
                judul: data.judul,
                slug: slug,
                konten: data.konten,
                excerpt: data.excerpt,
                foto: data.foto,
                tags: data.tags || [],
                isPublished: data.isPublished,
                publishedAt: publishedAt,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                metaKeywords: data.metaKeywords,
                readingTimeMin: readingTimeMin
            }
        })

        return NextResponse.json(updatedArticle)
    } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json({ error: "Slug sudah digunakan, gunakan judul atau slug lain." }, { status: 400 })
        }
        return NextResponse.json({ error: "Gagal mengupdate artikel", details: error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        await prisma.article.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: "Artikel berhasil dihapus" })
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal menghapus artikel", details: error.message }, { status: 500 })
    }
}
