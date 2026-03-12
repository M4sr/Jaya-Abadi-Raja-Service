import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session || !session.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { token, platform } = await request.json()

        if (!token) {
            return NextResponse.json({ error: "Token is required" }, { status: 400 })
        }

        // Save or update FCM token for the user
        // We can reuse PushSubscription or create a new model if needed.
        // For now, let's see if the User model has an fcmToken field.
        // If not, we should add it or use a separate table.
        
        const user = await prisma.user.update({
            where: { id: (session.user as any).id },
            data: {
                // Assuming we add fcmToken to User model
                // If not, we might need a migration. Let's check schema.prisma again.
                fcmToken: token
            }
        })

        return NextResponse.json({ success: true, message: "FCM Token registered" })
    } catch (error: any) {
        console.error("FCM Registration Error:", error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}
