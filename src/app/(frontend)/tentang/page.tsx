import prisma from "@/lib/prisma"
import { AboutClient } from "@/components/frontend/AboutClient"

export const metadata = {
    title: 'Tentang Kami | Jaya Abadi Raja Service AC',
    description: 'Kenali lebih dekat Jaya Abadi Raja Service AC, penyedia layanan pendingin ruangan terpercaya di Pekanbaru dengan visi menghadirkan kenyamanan bagi setiap pelanggan.',
}

export default async function AboutPage() {
    // Fetch settings for dynamic content
    const settings = await prisma.setting.findMany()
    const aboutText = settings.find(s => s.key === 'about_text')?.value || 'Kami adalah penyedia layanan AC terbaik di Pekanbaru.'
    const siteName = settings.find(s => s.key === 'site_name')?.value || 'PT. Jaya Abadi Raja Service'

    return (
        <AboutClient aboutText={aboutText} siteName={siteName} />
    )
}
