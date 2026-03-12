import { Home, Star } from "lucide-react"
import prisma from "@/lib/prisma"
import LayananClient from "@/components/frontend/LayananClient"
import { LayananHero } from "@/components/frontend"
import Link from "next/link"

export default async function LayananArchivePage() {
    const services = await prisma.layanan.findMany({
        where: { isActive: true },
        include: { kategori: true },
        orderBy: { urutan: 'asc' }
    })

    const categories = await prisma.kategoriLayanan.findMany({
        where: { isActive: true },
        orderBy: { urutan: 'asc' }
    })

    return (
        <main className="min-h-screen">
            <LayananHero />

            {/* Dynamic Content Section - Lowered for better spacing */}
            <section className="relative z-20 -mt-4 md:-mt-8 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <LayananClient initialServices={services} categories={categories} />
                </div>
            </section>

            {/* Newsletter / CTA Section with Modern Design - Optimized for Mobile */}
            <section className="py-16 md:py-24 px-4 md:px-6">
                <div className="max-w-7xl mx-auto relative rounded-[32px] md:rounded-[64px] overflow-hidden bg-blue-600">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-indigo-700 skew-x-12 translate-x-32" />
                    
                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 p-8 md:p-16 lg:p-24 items-center">
                        <div>
                            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter mb-6 md:mb-8 leading-none uppercase">
                                SIAP UNTUK <br />
                                <span className="opacity-80">UDARA YANG</span> <br />
                                LEBIH BAIK?
                            </h2>
                            <p className="text-blue-100 text-sm md:text-lg mb-8 md:mb-10 max-w-md leading-relaxed">
                                Bergabunglah dengan ratusan pelanggan puas kami di Pekanbaru. Kami memberikan layanan yang melampaui ekspektasi Anda.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/booking" className="px-8 md:px-10 py-4 md:py-5 bg-white text-blue-700 font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl md:rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all text-center">
                                    Booking Sekarang
                                </Link>
                                <Link href="https://wa.me/628123456789" className="px-8 md:px-10 py-4 md:py-5 bg-blue-800/30 text-white font-black uppercase tracking-widest text-[10px] md:text-xs rounded-xl md:rounded-2xl backdrop-blur-md hover:bg-blue-800/50 transition-all text-center flex items-center justify-center gap-2">
                                    <svg 
                                        viewBox="0 0 24 24" 
                                        className="w-4 h-4 md:w-5 md:h-5 fill-current"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                    </svg>
                                    <span>WhatsApp Chat</span>
                                </Link>
                            </div>
                        </div>
                        
                        <div className="flex flex-col gap-4 md:gap-6 lg:pl-12">
                            {[
                                { title: "Fast Delivery", desc: "Ketepatan waktu adalah prioritas kami." },
                                { title: "Clear Pricing", desc: "Harga transparan tanpa biaya tersembunyi." },
                                { title: "Support 24/7", desc: "Layanan darurat kapanpun AC Anda bermasalah." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 md:gap-6 items-start p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-blue-700 font-black shrink-0 text-sm md:text-base">
                                        0{i+1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase tracking-widest text-[10px] md:text-sm mb-1">{item.title}</h4>
                                        <p className="text-blue-100 text-[9px] md:text-xs leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
