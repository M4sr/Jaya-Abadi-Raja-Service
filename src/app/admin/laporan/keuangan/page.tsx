import { Metadata } from "next"
import prisma from "@/lib/prisma"
import KeuanganClient from "@/components/admin/KeuanganClient"
import AddKeuanganDialog from "./AddKeuanganDialog"

export const metadata: Metadata = {
    title: "Laporan Keuangan",
    description: "Rekap data pemasukan dan pengeluaran sistem.",
}


export default async function KeuanganPage({
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
    const sort = params.sort || 'tanggal'
    const order = (params.order as 'asc' | 'desc') || 'desc'

    const skip = (page - 1) * limit
    const take = limit

    // Calculate date ranges for Prisma
    const [yearStr, monthStr] = activeMonthStr.split("-")
    const yearNum = parseInt(yearStr)
    const monthNum = parseInt(monthStr) - 1 // JS Date month index (0-11)

    const startDate = new Date(yearNum, monthNum, 1)
    const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999)

    // Fetch transactions and totals
    const [transaksi, totalItems, totals] = await Promise.all([
        prisma.keuangan.findMany({
            where: {
                tanggal: {
                    gte: startDate,
                    lte: endDate
                }
            },
            orderBy: { [sort]: order },
            skip,
            take,
            include: {
                booking: {
                    select: {
                        kodeBooking: true,
                        namaPelanggan: true,
                    }
                }
            }
        }),
        prisma.keuangan.count({
            where: {
                tanggal: {
                    gte: startDate,
                    lte: endDate
                }
            }
        }),
        prisma.keuangan.groupBy({
            by: ['tipe'],
            where: {
                tanggal: {
                    gte: startDate,
                    lte: endDate
                }
            },
            _sum: {
                nominal: true
            }
        })
    ])

    const totalPages = Math.ceil(totalItems / limit)

    const totalPemasukan = totals.find(t => t.tipe === 'PEMASUKAN')?._sum.nominal || 0
    const totalPengeluaran = totals.find(t => t.tipe === 'PENGELUARAN')?._sum.nominal || 0
    const saldoBersih = totalPemasukan - totalPengeluaran

    return (
        <KeuanganClient
            transaksi={transaksi}
            totalItems={totalItems}
            page={page}
            limit={limit}
            sort={sort}
            order={order}
            totalPages={totalPages}
            activeMonthStr={activeMonthStr}
            startDate={startDate}
            totalPemasukan={totalPemasukan}
            totalPengeluaran={totalPengeluaran}
            saldoBersih={saldoBersih}
            addKeuanganDialog={<AddKeuanganDialog />}
        />
    )
}
