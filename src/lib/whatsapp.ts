import prisma from "./prisma"

export async function sendWhatsAppMessage(to: string, message: string) {
    try {
        // Priority: process.env > DB settings
        let token = process.env.FONNTE_TOKEN

        if (!token) {
            // Fetch settings from DB
            const settings = await prisma.setting.findMany({
                where: {
                    key: {
                        in: ['fonnte_token']
                    }
                }
            })

            const settingsMap = settings.reduce((acc: any, curr) => {
                acc[curr.key] = curr.value
                return acc
            }, {})

            token = settingsMap.fonnte_token
        }

        if (!token) {
            console.warn("Fonnte token not found. Skipping WhatsApp message.")
            return { success: false, error: "Token not configured" }
        }

        const response = await fetch('https://api.fonnte.com/send', {
            method: 'POST',
            headers: {
                'Authorization': token
            },
            body: new URLSearchParams({
                target: to,
                message: message,
            })
        })

        const result = await response.json()
        
        if (!response.ok || !result.status) {
            console.error("Fonnte API error:", result)
            return { success: false, error: result.reason || "Unknown error" }
        }

        return { success: true, result }
    } catch (error) {
        console.error("WhatsApp broadcast error:", error)
        return { success: false, error }
    }
}
