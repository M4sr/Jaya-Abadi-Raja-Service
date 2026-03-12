import prisma from "@/lib/prisma"
import WhatsAppTemplatesClient from "@/components/admin/WhatsAppTemplatesClient"

export const dynamic = "force-dynamic"

export default async function WhatsAppSettingsPage() {
    const rawSettings = await prisma.setting.findMany({
        where: {
            key: {
                startsWith: 'wa_template_'
            }
        }
    })

    // Group settings
    const settingsObj = rawSettings.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {})

    return (
        <WhatsAppTemplatesClient initialSettings={settingsObj} />
    )
}
