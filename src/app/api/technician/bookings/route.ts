import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const teknisiId = searchParams.get("teknisiId")
        const status = searchParams.get("status")

        if (!teknisiId) {
            return NextResponse.json({ error: "Teknisi ID diperlukan" }, { status: 400 })
        }

        const where: any = {
            teknisiId: teknisiId
        }

        if (status) {
            where.status = status
        } else {
            // Default filter to exclude cancelled and very old ones if needed
            // For mobile app, we usually want all active ones
            where.status = {
                in: ["CONFIRMED", "ASSIGNED", "ON_THE_WAY", "ARRIVED", "IN_PROGRESS", "DONE"]
            }
        }

        const bookings = await prisma.booking.findMany({
            where,
            include: {
                layanan: true,
                pelanggan: true
            },
            orderBy: {
                jadwalTanggal: "asc"
            }
        })

        return NextResponse.json(bookings)
    } catch (error: any) {
        console.error("Fetch Bookings Technical Error:", error)
        return NextResponse.json({ error: "Gagal mengambil data booking", details: error.message }, { status: 500 })
    }
}
