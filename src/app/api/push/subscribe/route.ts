import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
    try {
        const { bookingId, subscription } = await request.json()

        if (!subscription || !subscription.endpoint) {
            return NextResponse.json({ error: "Invalid subscription" }, { status: 400 })
        }

        // Simpan atau update subscription
        // Karena endpoint adalah Text dan tidak lagi @unique di database MySQL, kita gunakan findFirst manual
        const existingSub = await (prisma as any).pushSubscription.findFirst({
            where: { endpoint: subscription.endpoint }
        })

        if (existingSub) {
            await (prisma as any).pushSubscription.update({
                where: { id: existingSub.id },
                data: {
                    bookingId: bookingId || null,
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                }
            })
        } else {
            await (prisma as any).pushSubscription.create({
                data: {
                    bookingId: bookingId || null,
                    endpoint: subscription.endpoint,
                    p256dh: subscription.keys.p256dh,
                    auth: subscription.keys.auth,
                }
            })
        }

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error("Push subscribe error:", error)
        return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
    }
}
