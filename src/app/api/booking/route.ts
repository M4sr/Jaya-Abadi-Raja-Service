import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"


export async function GET(request: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const status = searchParams.get('status')

        // Build query conditions
        const whereCondition: any = {}
        if (status && status !== 'ALL') {
            whereCondition.status = status
        }

        const bookings = await prisma.booking.findMany({
            where: whereCondition,
            orderBy: { createdAt: 'desc' },
            include: {
                layanan: {
                    select: { nama: true }
                },
                teknisi: {
                    include: {
                        user: {
                            select: { name: true, phone: true }
                        }
                    }
                }
            }
        })

        return NextResponse.json(bookings)
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data booking" }, { status: 500 })
    }
}
