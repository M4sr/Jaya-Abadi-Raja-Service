import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"


export async function GET(req: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const month = searchParams.get("month") // format: YYYY-MM

        let dateFilter = {}
        if (month) {
            const [yearStr, monthStr] = month.split("-")
            const yearNum = parseInt(yearStr)
            const monthNum = parseInt(monthStr) - 1 // 0-indexed for JS Date

            const startDate = new Date(yearNum, monthNum, 1)
            const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999)

            dateFilter = {
                tanggal: {
                    gte: startDate,
                    lte: endDate
                }
            }
        }

        // Fetch Keuangan records
        const transaksi = await prisma.keuangan.findMany({
            where: dateFilter,
            orderBy: { tanggal: "desc" },
            include: {
                booking: {
                    select: {
                        kodeBooking: true,
                        namaPelanggan: true,
                    }
                }
            }
        })

        // Calculate summary
        const summary = transaksi.reduce(
            (acc: { pemasukan: number; pengeluaran: number; saldoBersih: number }, curr: any) => {
                if (curr.tipe === "PEMASUKAN") {
                    acc.pemasukan += curr.nominal
                } else {
                    acc.pengeluaran += curr.nominal
                }
                return acc
            },
            { pemasukan: 0, pengeluaran: 0, saldoBersih: 0 }
        )
        summary.saldoBersih = summary.pemasukan - summary.pengeluaran

        return NextResponse.json({ summary, transaksi })
    } catch (error) {
        console.error("[LAPORAN_KEUANGAN_GET]", error)
        return new NextResponse("Internal server error", { status: 500 })
    }
}
