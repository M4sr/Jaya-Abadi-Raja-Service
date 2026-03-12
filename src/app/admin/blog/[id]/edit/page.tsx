import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import ArticleForm from "@/components/admin/ArticleForm"


export const dynamic = "force-dynamic"

export default async function EditArtikelPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const article = await prisma.article.findUnique({
        where: { id }
    })

    if (!article) {
        notFound()
    }

    // Pass down the parsed data
    const initialData = {
        ...article,
        tags: Array.isArray(article.tags) ? article.tags : [],
    }

    return <ArticleForm initialData={initialData} />
}
