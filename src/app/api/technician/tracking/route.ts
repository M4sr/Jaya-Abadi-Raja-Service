import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"

export async function POST(request: Request) {
    try {
        const { teknisiId, bookingId, latitude, longitude, accuracy, heading } = await request.json()

        if (!teknisiId || !latitude || !longitude) {
            return NextResponse.json({ error: "Data lokasi tidak lengkap" }, { status: 400 })
        }

        // Save to database (optional, for history)
        const location = await prisma.teknisiLocation.create({
            data: {
                teknisiId,
                bookingId,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                accuracy: accuracy ? parseFloat(accuracy) : null,
                heading: heading ? parseFloat(heading) : null,
            }
        })

        // Broadcast to Pusher for real-time customer tracking
        // We use the bookingId as the channel if provided
        if (bookingId) {
            await pusherServer.trigger(`booking-${bookingId}`, 'location-updated', {
                latitude,
                longitude,
                accuracy,
                heading,
                timestamp: new Date().toISOString()
            })
        }

        return NextResponse.json({ success: true, id: location.id })
    } catch (error: any) {
        console.error("GPS Tracking Error:", error)
        return NextResponse.json({ error: "Gagal memproses lokasi", details: error.message }, { status: 500 })
    }
}
