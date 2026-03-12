import prisma from "@/lib/prisma"
import BookingClient from "@/components/admin/BookingClient"


export const dynamic = "force-dynamic"

export default async function BookingPage({
    searchParams,
}: {
    searchParams: Promise<{
        status?: string;
        page?: string;
        limit?: string;
        sort?: string;
        order?: string
    }>
}) {
    const params = await searchParams
    const currentTab = params.status || 'ALL'
    const page = parseInt(params.page || '1')
    const limit = parseInt(params.limit || '10')
    const sort = params.sort || 'createdAt'
    const order = (params.order as 'asc' | 'desc') || 'desc'

    const skip = (page - 1) * limit
    const take = limit

    // Build query condition based on tab
    const whereCondition: any = {}
    if (currentTab === 'PENDING') whereCondition.status = { in: ['PENDING_WA', 'CONFIRMED'] }
    else if (currentTab === 'PROSES') whereCondition.status = { in: ['ASSIGNED', 'ON_THE_WAY', 'ARRIVED', 'IN_PROGRESS'] }
    else if (currentTab === 'SELESAI') whereCondition.status = 'DONE'
    else if (currentTab === 'BATAL') whereCondition.status = 'CANCELLED'

    const [bookings, totalItems] = await Promise.all([
        prisma.booking.findMany({
            where: whereCondition,
            orderBy: { [sort]: order },
            skip,
            take,
            include: {
                layanan: { select: { nama: true } },
                teknisi: {
                    include: { user: { select: { name: true } } }
                }
            }
        }),
        prisma.booking.count({ where: whereCondition })
    ])

    const totalPages = Math.ceil(totalItems / limit)

    const tabs = [
        { id: 'ALL', label: 'Semua' },
        { id: 'PENDING', label: 'Menunggu (Pending)' },
        { id: 'PROSES', label: 'Dalam Proses' },
        { id: 'SELESAI', label: 'Selesai' },
        { id: 'BATAL', label: 'Dibatalkan' },
    ]

    return (
        <BookingClient
            bookings={bookings}
            totalItems={totalItems}
            page={page}
            limit={limit}
            sort={sort}
            order={order}
            totalPages={totalPages}
            currentTab={currentTab}
            tabs={tabs}
        />
    )
}
