import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import DashboardContent from "@/components/admin/DashboardContent"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
    const session = await auth()
    const userName = session?.user?.name || "Admin"

    // Fetch real-time data
    const [
        totalBookings,
        pendingBookings,
        prosesBookings,
        selesaiBookings,
        recentBookings,
        totalUsers,
        totalArticles
    ] = await Promise.all([
        prisma.booking.count(),
        prisma.booking.count({ where: { status: { in: ['PENDING_WA', 'CONFIRMED'] } } }),
        prisma.booking.count({ where: { status: { in: ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'] } } }),
        prisma.booking.count({ where: { status: 'DONE' } }),
        prisma.booking.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { layanan: { select: { nama: true } } }
        }),
        prisma.user.count(),
        prisma.article.count()
    ])

    // Fetch chart data (Last 7 Days)
    const chartData = []
    const now = new Date()
    for (let i = 6; i >= 0; i--) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        d.setHours(0, 0, 0, 0)

        const nextD = new Date(d)
        nextD.setDate(nextD.getDate() + 1)

        const count = await prisma.booking.count({
            where: {
                createdAt: {
                    gte: d,
                    lt: nextD
                }
            }
        })

        chartData.push({
            name: d.toLocaleDateString('id-ID', { weekday: 'short' }),
            bookings: count
        })
    }

    const percentDone = totalBookings > 0
        ? Math.round((selesaiBookings / totalBookings) * 100)
        : 0

    const stats = {
        total: totalBookings,
        pending: pendingBookings,
        proses: prosesBookings,
        selesai: selesaiBookings,
        percentDone
    }

    const counts = {
        users: totalUsers,
        articles: totalArticles
    }

    return (
        <DashboardContent
            userName={userName}
            stats={stats}
            recentBookings={recentBookings}
            counts={counts}
            chartData={chartData}
        />
    )
}
