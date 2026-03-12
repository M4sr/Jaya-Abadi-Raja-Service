import Link from "next/link"
import Image from "next/image"
import prisma from "@/lib/prisma"
import {
    ArrowRight,
    CheckCircle2,
    Snowflake,
    Star,
    Users,
    ShieldCheck,
    Clock,
    Zap,
    Play,
    Calendar,
    ChevronRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

// We'll create specialized client components for animations to keep this server component clean
import {
    HeroSection,
    StatsSection,
    ServicesSection,
    FeaturesSection,
    BlogSection,
    LegalitasSection,
    CTASection
} from "../../components/frontend"
import { Metadata } from "next"

export async function generateMetadata(): Promise<Metadata> {
    const settings = await prisma.setting.findMany({
        where: {
            key: { in: ["site_title", "site_description"] }
        }
    })

    const title = settings.find(s => s.key === "site_title")?.value || "PT. Jaya Abadi Raja Service"
    const description = settings.find(s => s.key === "site_description")?.value || "Service AC Pekanbaru Terpercaya"

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
        }
    }
}

import JsonLd from "../../components/seo/JsonLd"

export default async function HomePage() {
    // Fetch data
    const settings = await prisma.setting.findMany({
        where: { key: { in: ["whatsapp_number"] } }
    })
    const waNumber = settings.find(s => s.key === "whatsapp_number")?.value || "628123456789"

    const services = await prisma.layanan.findMany({
        where: { isActive: true },
        orderBy: { urutan: 'asc' },
        take: 6
    })

    const articles = await prisma.article.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        include: { author: true }
    })

    const legalitas = await prisma.legalitas.findMany({
        orderBy: { urutan: 'asc' }
    })

    // Mock stats (since DB might be empty in some dev envs, but we use real counts where possible)
    const bookingCount = await prisma.booking.count()
    const techCount = await prisma.teknisiProfile.count()

    const stats = [
        { label: "Pesanan Selesai", value: Math.max(bookingCount, 1250), suffix: "+" },
        { label: "Teknisi Ahli", value: Math.max(techCount, 15), suffix: "+" },
        { label: "Tahun Pengalaman", value: 10, suffix: "+" },
        { label: "Kepuasan Pelanggan", value: 99, suffix: "%" },
    ]

    return (
        <div className="flex flex-col w-full overflow-x-hidden">
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": "PT. Jaya Abadi Raja Service",
                "image": "/images/hero.png",
                "@id": "https://jayarepair.com",
                "url": "https://jayarepair.com",
                "telephone": `+${waNumber}`,
                "address": {
                    "@type": "PostalAddress",
                    "streetAddress": "Jl. Utama No. 123",
                    "addressLocality": "Pekanbaru",
                    "addressRegion": "Riau",
                    "postalCode": "28282",
                    "addressCountry": "ID"
                },
                "geo": {
                    "@type": "GeoCoordinates",
                    "latitude": 0.507068,
                    "longitude": 101.447779
                },
                "openingHoursSpecification": {
                    "@type": "OpeningHoursSpecification",
                    "dayOfWeek": [
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                        "Sunday"
                    ],
                    "opens": "00:00",
                    "closes": "23:59"
                },
                "sameAs": [
                    "https://facebook.com/jayarepair",
                    "https://instagram.com/jayarepair"
                ]
            }} />
            {/* Hero Section */}
            <HeroSection />

            {/* === SECTION BOUNDARY === */}
            {/* Zero-height anchor: sits exactly at Hero/About dividing line */}
            <div className="relative h-0 z-30">
                {/* Gradient blending both sides of the boundary — above AND below */}
                <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 w-[200%] sm:w-[150%] h-[240px] sm:h-[320px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-950 via-slate-800/30 to-transparent pointer-events-none" />

                {/* Cards centered EXACTLY on the boundary using translateY(-50%) */}
                <div className="-translate-y-1/2 w-full">
                    <StatsSection stats={stats} />
                </div>
            </div>

            {/* About Section */}
            <section className="relative pt-16 sm:pt-24 pb-24 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1 relative">
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/teknisi.png"
                                    alt="Teknisi Professional"
                                    width={600}
                                    height={700}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Decorative elements */}
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-600 rounded-3xl -z-10 rotate-12" />
                            <div className="absolute -top-10 -right-10 w-40 h-40 border-4 border-blue-100 rounded-full -z-10" />

                            <div className="absolute bottom-10 right-10 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 max-w-[200px] animate-bounce-slow">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                        <ShieldCheck className="w-6 h-6 text-green-600" />
                                    </div>
                                    <span className="font-bold text-slate-800">Terpercaya</span>
                                </div>
                                <p className="text-xs text-slate-500">Berpengalaman sejak 2014 di Pekanbaru.</p>
                            </div>
                        </div>

                        <div className="flex-1 flex flex-col gap-6">
                            <Badge className="w-max bg-blue-100 text-primary-blue hover:bg-blue-100 border-0 px-4 py-1">Tentang Kami</Badge>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
                                Kami Menghadirkan Sejuk <span className="text-primary-blue">Kenyamanan</span> ke Rumah Anda
                            </h2>
                            <p className="text-slate-600 text-lg leading-relaxed">
                                PT. Jaya Abadi Raja Service adalah mitra solusi pendingin ruangan (AC) terkemuka di Pekanbaru. Kami percaya bahwa setiap rumah layak mendapatkan udara bersih dan sejuk.
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                                {[
                                    "Teknisi Bersertifikat",
                                    "Garansi Pekerjaan 30 Hari",
                                    "Harga Transparan",
                                    "Respon Cepat 24/7",
                                    "Peralatan Modern",
                                    "Layanan Ramah & Sopan"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-primary-blue-medium shrink-0" />
                                        <span className="font-medium text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 flex items-center gap-6">
                                <Link href="/tentang">
                                    <Button className="rounded-full px-8 py-6 text-lg bg-primary-blue hover:bg-blue-900">
                                        Selengkapnya
                                    </Button>
                                </Link>
                                <Link href="/kontak" className="flex items-center gap-2 font-bold text-primary-blue hover:gap-3 transition-all">
                                    Hubungi Kami <ArrowRight className="w-5 h-5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Section */}
            <ServicesSection services={services} />

            {/* Why Choose Us / Features */}
            <FeaturesSection />

            {/* Legalitas Section */}
            <LegalitasSection documents={legalitas} />

            {/* CTA Section */}
            <CTASection />
        </div>
    )
}
