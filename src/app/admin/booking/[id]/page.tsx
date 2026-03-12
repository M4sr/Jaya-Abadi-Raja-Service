import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import BookingDetailView from "@/components/admin/BookingDetailView"


export const dynamic = "force-dynamic"

export default async function BookingDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const booking = await prisma.booking.findUnique({
        where: { id },
        include: {
            layanan: true,
            teknisi: {
                include: {
                    user: { select: { name: true, phone: true } }
                }
            },
            pelanggan: {
                select: { name: true, phone: true, email: true }
            },
            statusLogs: {
                orderBy: { createdAt: 'desc' }
            }
        }
    })

    if (!booking) {
        notFound()
    }

    // Fetch all technicians for assignment dropdown
    const teknisiList = await prisma.teknisiProfile.findMany({
        where: {
            user: { isActive: true }
        },
        include: {
            user: {
                select: { id: true, name: true }
            }
        }
    })

    return <BookingDetailView booking={booking} teknisiList={teknisiList} />
}
