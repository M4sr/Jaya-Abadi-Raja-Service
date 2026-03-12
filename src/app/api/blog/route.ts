import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"


export async function GET(request: Request) {
    try {
        const articles = await prisma.article.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { name: true } }
            }
        })
        return NextResponse.json(articles)
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data artikel" }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || !session.user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await request.json()

        if (!data.judul || !data.konten) {
            return NextResponse.json({ error: "Judul dan konten wajib diisi" }, { status: 400 })
        }

        // Auto generate slug if not provided
        const slug = data.slug || data.judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

        // Hitung estimasi waktu baca (200 kata per menit)
        const wordCount = data.konten.replace(/<[^>]*>?/gm, '').split(/\s+/).length
        const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200))

        const newArticle = await prisma.article.create({
            data: {
                userId: session.user.id,
                kategori: data.kategori || "Umum",
                judul: data.judul,
                slug: slug,
                konten: data.konten,
                excerpt: data.excerpt,
                foto: data.foto,
                tags: data.tags || [],
                isPublished: data.isPublished || false,
                publishedAt: data.isPublished ? new Date() : null,
                metaTitle: data.metaTitle,
                metaDescription: data.metaDescription,
                metaKeywords: data.metaKeywords,
                readingTimeMin: readingTimeMin
            }
        })

        return NextResponse.json(newArticle)
    } catch (error: any) {
        // Unique constraint on Slug
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
            return NextResponse.json({ error: "Slug sudah digunakan, gunakan judul atau slug lain." }, { status: 400 })
        }
        return NextResponse.json({ error: "Gagal menambah data artikel", details: error.message }, { status: 500 })
    }
}
