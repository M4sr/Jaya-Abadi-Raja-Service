import React from 'react'
import prisma from "@/lib/prisma"
import BookingClient from "@/components/frontend/BookingClient"
import { CalendarCheck } from "lucide-react"

export const metadata = {
    title: 'Booking Service AC | Jaya Abadi Raja Service AC',
    description: 'Pesan jasa servis AC professional di Pekanbaru dengan mudah melalui sistem booking online kami. Pilih jadwal, tentukan alamat, dan tim ahli kami akan segera meluncur.',
}

export default async function BookingPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams
    const serviceSlug = params.service as string | undefined

    let initialServiceId: string | undefined = undefined

    if (serviceSlug) {
        const selectedService = await prisma.layanan.findUnique({
            where: { slug: serviceSlug }
        })
        if (selectedService) {
            initialServiceId = selectedService.id
        }
    }

    // Fetch active services
    const activeLayananData = await prisma.layanan.findMany({
        where: { isActive: true },
        orderBy: { urutan: 'asc' },
        select: {
            id: true,
            nama: true,
            hargaMulai: true,
            foto: true
        }
    })

    const activeLayanan = activeLayananData.map(s => ({
        id: s.id,
        nama: s.nama,
        hargaMulai: s.hargaMulai,
        gambar: s.foto
    }))

    // Fetch WA Number from settings
    const settingWA = await prisma.setting.findUnique({
        where: { key: 'wa_number' }
    })
    const waNumber = settingWA?.value || '6281234567890'

    return (
        <main className="min-h-screen">
            {/* Premium Rounded Header */}
            <header className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
                <div className="absolute inset-0 bg-slate-950 rounded-b-[48px] sm:rounded-b-[64px] shadow-2xl shadow-black/20 overflow-hidden">
                    {/* Decorative Elements - Moved inside for proper clipping */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <div className="p-4 bg-blue-500/10 backdrop-blur-xl rounded-3xl border border-white/10 mb-8 w-max mx-auto animate-in fade-in zoom-in duration-700">
                        <CalendarCheck className="w-8 h-8 text-blue-400" />
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                        PESAN <br />
                        <span className="text-blue-500">LAYANAN</span>
                    </h1>
                    
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
                        Tentukan jadwal Anda hanya dalam beberapa menit. Kami hadirkan teknisi ahli untuk udara yang lebih berkualitas.
                    </p>
                </div>
            </header>

            {/* Booking Form Section */}
            <section className="relative z-20 -mt-10 md:-mt-16 pb-32">
                <BookingClient 
                    layanan={activeLayanan} 
                    waNumber={waNumber} 
                    initialServiceId={initialServiceId} 
                />
            </section>
        </main>
    )
}
