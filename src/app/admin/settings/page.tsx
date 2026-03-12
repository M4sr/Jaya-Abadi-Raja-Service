import prisma from "@/lib/prisma"
import SettingsClient from "@/components/admin/SettingsClient"


export const dynamic = "force-dynamic"

export default async function SettingsPage() {
    const rawSettings = await prisma.setting.findMany({
        orderBy: { key: 'asc' }
    })

    // Group settings for easier form building
    const settingsObj = rawSettings.reduce((acc: any, curr) => {
        acc[curr.key] = curr.value
        return acc
    }, {})

    return (
        <SettingsClient initialSettings={settingsObj} />
    )
}
