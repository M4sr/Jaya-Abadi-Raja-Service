import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request, context: { params: Promise<{ bookingId: string }> }) {
    try {
        const { bookingId } = await context.params

        // Find the technicians's location linked to this booking
        // The tracking page polls this to show on the map
        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: {
                teknisi: {
                    include: {
                        user: { select: { name: true, avatar: true } },
                        locations: {
                            orderBy: { createdAt: 'desc' },
                            take: 1
                        }
                    }
                }
            }
        })

        if (!booking || !booking.teknisi) {
            return NextResponse.json({ error: "Teknisi atau lokasi tidak ditemukan" }, { status: 404 })
        }

        const latestLocation = booking.teknisi.locations[0]
        
        if (!latestLocation) {
            return NextResponse.json({ error: "Lokasi belum tersedia" }, { status: 404 })
        }

        return NextResponse.json({
            latitude: latestLocation.latitude,
            longitude: latestLocation.longitude,
            accuracy: latestLocation.accuracy,
            heading: latestLocation.heading,
            updatedAt: latestLocation.createdAt,
            teknisi: {
                user: {
                    name: booking.teknisi.user.name,
                    avatar: booking.teknisi.user.avatar
                }
            }
        })
    } catch (error: any) {
        console.error("Location tracking error:", error)
        return NextResponse.json({ error: "Gagal mengambil lokasi teknisi" }, { status: 500 })
    }
}
