import prisma from "@/lib/prisma"
import { deleteLayanan } from "./actions"
import LayananClient from "@/components/admin/LayananClient"


// Note: Next.js 15 App router fetch automatically caches unless dynamic is forced
export const dynamic = "force-dynamic"

export default async function LayananPage({
    searchParams,
}: {
    searchParams: Promise<{
        page?: string;
        limit?: string;
        sort?: string;
        order?: string;
        q?: string;
        kategori?: string;
    }>
}) {
    const params = await searchParams
    const page = parseInt(params.page || '1')
    const limit = parseInt(params.limit || '10')
    const sort = params.sort || 'urutan'
    const order = (params.order as 'asc' | 'desc') || 'asc'
    const searchCondition = params.q ? params.q : ''
    const kategoriFilter = params.kategori && params.kategori !== 'all' ? params.kategori : undefined

    const skip = (page - 1) * limit
    const take = limit

    const whereClause: any = {}
    if (searchCondition) {
        whereClause.nama = { contains: searchCondition }
    }
    if (kategoriFilter) {
        whereClause.kategoriId = kategoriFilter
    }

    const [layanans, totalItems, categories] = await Promise.all([
        prisma.layanan.findMany({
            where: whereClause,
            include: { kategori: true },
            orderBy: { [sort]: order },
            skip,
            take,
        }),
        prisma.layanan.count({ where: whereClause }),
        prisma.kategoriLayanan.findMany({
            where: { isActive: true },
            orderBy: { urutan: 'asc' }
        })
    ])

    const totalPages = Math.ceil(totalItems / limit)

    return (
        <LayananClient
            layanans={layanans}
            totalItems={totalItems}
            page={page}
            limit={limit}
            sort={sort}
            order={order}
            totalPages={totalPages}
            categories={categories}
            q={searchCondition}
            kategori={kategoriFilter}
            onDelete={deleteLayanan}
        />
    )
}
