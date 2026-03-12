import { Metadata } from "next"
import prisma from "@/lib/prisma"
import FeedbackReportClient from "@/components/admin/FeedbackReportClient"

export const metadata: Metadata = {
    title: "Ulasan & Komplain",
    description: "Rekap ulasan, rating, dan masukan dari pelanggan.",
}


export default async function FeedbackReportPage({
    searchParams,
}: {
    searchParams: Promise<{
        month?: string;
        page?: string;
        limit?: string;
        sort?: string;
        order?: string
    }>
}) {
    // Determine the active month filter
    const today = new Date()
    const params = await searchParams
    const activeMonthStr = params.month || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

    const page = parseInt(params.page || '1')
    const limit = parseInt(params.limit || '10')
    const sort = params.sort || 'doneAt'
    const order = (params.order as 'asc' | 'desc') || 'desc'

    const skip = (page - 1) * limit
    const take = limit

    // Calculate date ranges for Prisma
    const [yearStr, monthStr] = activeMonthStr.split("-")
    const yearNum = parseInt(yearStr)
    const monthNum = parseInt(monthStr) - 1 // JS Date month index (0-11)

    const startDate = new Date(yearNum, monthNum, 1)
    const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999)

    const whereCondition = {
        status: "DONE" as const,
        doneAt: {
            gte: startDate,
            lte: endDate
        },
        OR: [
            { rating: { not: null } },
            { reviewKomentar: { not: null } }
        ]
    }

    // Fetch data with pagination and summaries
    const [feedbackList, totalItems, summaryStats, positiveCount, criticalCount] = await Promise.all([
        prisma.booking.findMany({
            where: whereCondition,
            orderBy: { [sort]: order },
            skip,
            take,
            include: {
                teknisi: {
                    include: {
                        user: { select: { name: true } }
                    }
                },
                layanan: { select: { nama: true } }
            }
        }),
        prisma.booking.count({ where: whereCondition }),
        prisma.booking.aggregate({
            where: whereCondition,
            _avg: { rating: true },
            _count: { id: true }
        }),
        prisma.booking.count({
            where: {
                ...whereCondition,
                rating: { gte: 4 }
            }
        }),
        prisma.booking.count({
            where: {
                ...whereCondition,
                rating: { lte: 3, not: null }
            }
        })
    ])

    const totalPages = Math.ceil(totalItems / limit)
    const totalReviews = summaryStats._count.id
    const avgRating = summaryStats._avg.rating ? summaryStats._avg.rating.toFixed(1) : "0.0"
    const positiveReviews = positiveCount
    const criticalReviews = criticalCount


    return (
        <FeedbackReportClient
            feedbackList={feedbackList}
            totalItems={totalItems}
            page={page}
            limit={limit}
            sort={sort}
            order={order}
            totalPages={totalPages}
            activeMonthStr={activeMonthStr}
            startDate={startDate}
            totalReviews={totalReviews}
            avgRating={avgRating}
            positiveReviews={positiveReviews}
            criticalReviews={criticalReviews}
        />
    )
}
