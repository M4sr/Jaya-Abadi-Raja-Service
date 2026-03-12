import prisma from "@/lib/prisma"
import ContactClient from "@/components/frontend/ContactClient"
import { ContactHero } from "@/components/frontend"

export const metadata = {
    title: 'Kontak & Lokasi | Jaya Abadi Raja Service AC',
    description: 'Hubungi Jaya Abadi Raja Service AC di Pekanbaru. Kami siap membantu perbaikan, cuci, dan instalasi AC Anda dengan respon cepat dan teknisi ahli.',
}

export default async function ContactPage() {
    // Fetch Settings
    const allSettings = await prisma.setting.findMany()
    const settingsMap: Record<string, string> = {}
    allSettings.forEach(s => {
        if (s.value) settingsMap[s.key] = s.value
    })

    // Fetch Legalitas
    const legalitas = await prisma.legalitas.findMany({
        orderBy: { urutan: 'asc' }
    })

    return (
        <main className="min-h-screen bg-[#F8FAFC]">
            <ContactHero />

            {/* Content Section */}
            <section className="relative z-20 -mt-10 md:-mt-16 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <ContactClient settings={settingsMap} legalitas={legalitas} />
                </div>
            </section>
        </main>
    )
}
