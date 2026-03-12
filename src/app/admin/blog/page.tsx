import prisma from "@/lib/prisma"
import BlogClient from "@/components/admin/BlogClient"
import { deleteArticle } from "./actions"


export const dynamic = "force-dynamic"

export default async function ArtikelPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        sort?: string;
        order?: string
    }>
}) {
    const params = await searchParams
    const page = parseInt(params.page || '1')
    const limit = parseInt(params.limit || '10')
    const sort = params.sort || 'createdAt'
    const order = (params.order as 'asc' | 'desc') || 'desc'

    const skip = (page - 1) * limit
    const take = limit

    const [articles, totalItems] = await Promise.all([
        prisma.article.findMany({
            orderBy: { [sort]: order },
            skip,
            take,
            include: {
                author: { select: { name: true } }
            }
        }),
        prisma.article.count()
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return (
        <BlogClient
            articles={articles}
            totalItems={totalItems}
            page={page}
            limit={limit}
            sort={sort}
            order={order}
            totalPages={totalPages}
            onDelete={async (id) => {
                "use server"
                await deleteArticle(id)
            }}
        />
    )
}
