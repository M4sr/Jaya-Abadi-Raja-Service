import prisma from "@/lib/prisma"
import GalleryClient from "@/components/frontend/GalleryClient"
import { GalleryHero } from "@/components/frontend"

export const metadata = {
    title: 'Galeri Foto | Jaya Abadi Raja Service AC',
    description: 'Lihat koleksi dokumentasi pekerjaan servis, instalasi, dan perawatan AC profesional kami di Pekanbaru.',
}

export default async function GalleryPage() {
    const photos = await prisma.galeriFoto.findMany({
        orderBy: { createdAt: 'desc' }
    }) as any[]

    // Get unique categories for filter
    const categories = ['Semua', ...Array.from(new Set(photos.map(p => p.kategori || 'Umum')))] as string[]

    return (
        <main className="min-h-screen">
            <GalleryHero />

            {/* Gallery Grid Section */}
            <section className="relative mt-2 md:mt-10 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <GalleryClient photos={photos} categories={categories} />
                </div>
            </section>
        </main>
    )
}
