import { Badge } from "@/components/ui/badge"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import ServiceDetailHero from "@/components/frontend/ServiceDetailHero"
import { 
    ShieldCheck, 
    CheckCircle2, 
    ArrowRight, 
    MessageCircle,
    Calendar,
    Star,
    ArrowUpRight,
    MapPin,
    Smartphone
} from "lucide-react"
import { Metadata } from "next"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const service = await prisma.layanan.findUnique({
        where: { slug }
    })

    if (!service) return {}

    const title = `${service.nama} | PT. Jaya Abadi Raja Service`
    const description = service.deskripsi || `Layanan ${service.nama} profesional di Pekanbaru. Hubungi Jaya Abadi Raja Service untuk kualitas terbaik.`

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            images: service.foto ? [{ url: service.foto }] : [],
        }
    }
}

import JsonLd from "@/components/seo/JsonLd"

export default async function ServiceDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params

    const service = await prisma.layanan.findUnique({
        where: { slug, isActive: true }
    })

    if (!service) {
        notFound()
    }

    const otherServices = await prisma.layanan.findMany({
        where: { 
            isActive: true,
            NOT: { id: service.id }
        },
        take: 3,
        orderBy: { urutan: 'asc' }
    })

    return (
        <main className="flex flex-col w-full min-h-screen">
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "Service",
                "name": service.nama,
                "description": service.deskripsi,
                "provider": {
                    "@type": "LocalBusiness",
                    "name": "PT. Jaya Abadi Raja Service",
                    "image": "/images/hero.png",
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": "Pekanbaru",
                        "addressRegion": "Riau",
                        "addressCountry": "ID"
                    }
                },
                "areaServed": {
                    "@type": "City",
                    "name": "Pekanbaru"
                },
                "hasOfferCatalog": {
                    "@type": "OfferCatalog",
                    "name": "Service AC",
                    "itemListElement": [
                        {
                            "@type": "Offer",
                            "itemOffered": {
                                "@type": "Service",
                                "name": service.nama
                            },
                            "priceCurrency": "IDR",
                            "price": service.hargaMulai
                        }
                    ]
                }
            }} />
            {/* Header / Hero Section (Cinematic & Immersive) */}
            <ServiceDetailHero service={service} />

            {/* Split Content Section */}
            <section className="relative z-30 -mt-16 md:-mt-24 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                        
                        {/* Main Content Column */}
                        <div className="lg:col-span-8 flex flex-col gap-10">
                            
                            {/* Summary Card */}
                            <div className="bg-white rounded-[32px] sm:rounded-[48px] shadow-2xl p-6 sm:p-10 md:p-16 border border-slate-100 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full -mr-32 -mt-32 -z-0" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-8 sm:mb-10">
                                        <div className="w-14 h-1.5 bg-blue-600 rounded-full" />
                                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter uppercase">RINGKASAN LAYANAN</h2>
                                    </div>

                                    <div className="border-l-4 border-blue-600 pl-6 sm:pl-8 py-4 mb-10 sm:mb-12">
                                        <p className="text-slate-600 text-xl sm:text-2xl font-medium leading-relaxed italic">
                                            "{service.deskripsi}"
                                        </p>
                                    </div>

                                    <div className="prose prose-slate prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-p:text-slate-600 prose-p:leading-relaxed prose-img:rounded-[32px] prose-a:text-blue-600 prose-strong:text-slate-900">
                                        {service.deskripsiLengkap ? (
                                            <div dangerouslySetInnerHTML={{ __html: service.deskripsiLengkap }} />
                                        ) : (
                                            <>
                                                <p>
                                                    Kami menyediakan layanan {service.nama} profesional yang dirancang khusus untuk memenuhi standar kenyamanan maksimal bagi hunian atau bisnis Anda. 
                                                    Proses pengerjaan dilakukan oleh tim teknisi Jaya Abadi Raja Service yang sudah sangat berpengalaman.
                                                </p>
                                                <h3>Mengapa Memilih Kami?</h3>
                                                <ul>
                                                    <li>Teknisi Tersertifikasi & Berpengalaman.</li>
                                                    <li>Peralatan digital modern untuk akurasi pengecekan.</li>
                                                    <li>Layanan cepat dan tepat waktu (On-time Guaranteed).</li>
                                                    <li>Laporan pengerjaan digital dikirim langsung ke WhatsApp Anda.</li>
                                                </ul>
                                            </>
                                        )}
                                    </div>

                                    {/* Action Points */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 sm:mt-16 pt-12 sm:pt-16 border-t border-slate-100">
                                        <div className="p-6 sm:p-8 rounded-[32px] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                                <ShieldCheck className="w-6 h-6 sm:w-7 sm:h-7" />
                                            </div>
                                            <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tight">Perlindungan Garansi</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">Kami memberikan jaminan garansi sparepart dan pengerjaan selama 30 hari penuh.</p>
                                        </div>
                                        <div className="p-6 sm:p-8 rounded-[32px] bg-slate-50 border border-slate-100 group hover:bg-white hover:shadow-xl transition-all duration-500">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="w-6 h-6 sm:w-7 sm:h-7" />
                                            </div>
                                            <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tight">Teknisi Standar</h4>
                                            <p className="text-slate-500 text-sm leading-relaxed">Setiap teknisi kami bekerja sesuai SOP ketat untuk menjamin keamanan & hasil kerja.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sticky Action Sidebar Column */}
                        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                            <div className="flex flex-col gap-6">
                                {/* Booking Card */}
                                <div className="bg-slate-950 rounded-[32px] sm:rounded-[48px] p-8 sm:p-10 shadow-3xl overflow-hidden relative group">
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full -mr-24 -mt-24 blur-3xl animate-pulse" />
                                    
                                    <div className="relative z-10">
                                        <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 uppercase tracking-tighter leading-tight">BUTUH <br /> LAYANAN INI?</h3>
                                        <p className="text-slate-400 text-xs sm:text-sm mb-8 sm:mb-10 leading-relaxed">Jadwalkan kunjungan teknisi kami sekarang dan nikmati udara dingin seketika.</p>
                                        
                                        <div className="space-y-4">
                                            <Link href={`/booking?service=${service.slug}`} className="block">
                                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.97]">
                                                    <Calendar className="w-4 h-4" /> Pesan Sekarang
                                                </button>
                                            </Link>
                                            
                                            <div className="flex items-center gap-2 text-slate-700 my-4">
                                                <div className="h-px flex-1 bg-slate-800" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Quick Support</span>
                                                <div className="h-px flex-1 bg-slate-800" />
                                            </div>
                                            
                                            <Link href="https://wa.me/628123456789" className="block">
                                                <button className="w-full bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl border border-white/10 flex items-center justify-center gap-3 transition-all hover:scale-[1.03] active:scale-[0.97]">
                                                    <MessageCircle className="w-4 h-4 text-green-400" /> WhatsApp
                                                </button>
                                            </Link>
                                        </div>

                                        <div className="mt-10 pt-8 border-t border-slate-800 space-y-4">
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <MapPin className="w-5 h-5 text-blue-500" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Area Pekanbaru</span>
                                            </div>
                                            <div className="flex items-center gap-4 text-slate-500">
                                                <Smartphone className="w-5 h-5 text-blue-500" />
                                                <span className="text-xs font-bold uppercase tracking-widest">Digital Report</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Promo / Mini Banner */}
                                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[40px] p-8 text-white relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    <Star className="absolute top-4 right-4 w-12 h-12 text-white/10 rotate-12" />
                                    
                                    <h4 className="text-xl font-black mb-2 uppercase tracking-tight leading-tight">Member Prioritas</h4>
                                    <p className="text-blue-100 text-xs leading-relaxed mb-6">Dapatkan diskon 10% untuk maintenance periodik setiap 3 bulan.</p>
                                    
                                    <Link href="/kontak" className="flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-white hover:gap-3 transition-all">
                                        Pelajari Paket Kontrak <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Exploration */}
            {otherServices.length > 0 && (
                <section className="py-16 md:py-32">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 md:mb-16">
                            <div className="max-w-2xl">
                                <Badge className="bg-slate-900 text-white border-0 px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                                    Exploration
                                </Badge>
                                <h2 className="text-3xl sm:text-4xl md:text-7xl font-black text-slate-900 tracking-tighter leading-none">LAYANAN <br /> <span className="text-blue-600">TERKAIT</span></h2>
                            </div>
                            <Link href="/layanan" className="group flex items-center gap-3 font-black text-[10px] md:text-xs uppercase tracking-[0.3em] text-slate-400 hover:text-blue-600 transition-all w-full md:w-auto mt-2 md:mt-0 justify-end md:justify-start">
                                <span>Lihat Koleksi</span> <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all"><ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" /></div>
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                            {otherServices.map((item) => (
                                <Link key={item.id} href={`/layanan/${item.slug}`} className="group">
                                    <div className="h-[200px] sm:h-[280px] md:h-[400px] relative rounded-[24px] md:rounded-[48px] overflow-hidden bg-white shadow-lg hover:-translate-y-2 md:hover:-translate-y-4 transition-all duration-700">
                                        <Image
                                            src={item.foto || "https://images.unsplash.com/photo-1599933333333-333333333333?q=80&w=1000&auto=format&fit=crop"}
                                            alt={item.nama}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            unoptimized={!item.foto}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent z-10" />
                                        <div className="absolute inset-0 p-4 sm:p-6 md:p-10 flex flex-col justify-end z-20">
                                            <h3 className="text-[14px] sm:text-xl md:text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-tight">{item.nama}</h3>
                                            <p className="text-white/60 text-[8px] sm:text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1 md:mt-2">Rp {item.hargaMulai.toLocaleString('id-ID')}</p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </main>
    )
}
