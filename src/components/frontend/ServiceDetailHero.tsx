"use client"

import { useScroll, useTransform, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Zap, Clock, ShieldCheck, Home, Star } from "lucide-react"

export default function ServiceDetailHero({ service }: { service: any }) {
    const { scrollY } = useScroll()
    
    // Transform scroll position to border radius
    const borderRadius = useTransform(scrollY, [0, 200], [0, 64])
    
    // Parallax effects
    const yBackground = useTransform(scrollY, [0, 500], [0, 150])
    const scaleBackground = useTransform(scrollY, [0, 500], [1.05, 1.2])
    const yContent = useTransform(scrollY, [0, 500], [0, -50])
    const opacityContent = useTransform(scrollY, [0, 300], [1, 0.3])
    
    return (
        <motion.section 
            style={{ 
                borderBottomLeftRadius: borderRadius,
                borderBottomRightRadius: borderRadius 
            }}
            className="relative h-[85vh] md:h-[80vh] min-h-[600px] md:min-h-[700px] w-full overflow-hidden bg-slate-950 will-change-[border-radius]"
        >
            {/* Background Image with Parallax Effect */}
            <motion.div 
                style={{ y: yBackground, scale: scaleBackground }}
                className="absolute inset-0 z-0 will-change-transform"
            >
                <Image
                    src={service.foto || "https://images.unsplash.com/photo-1599933333333-333333333333?q=80&w=1000&auto=format&fit=crop"}
                    alt={service.nama}
                    fill
                    className="object-cover opacity-60"
                    priority
                    unoptimized={!service.foto}
                />
                {/* Gradients to blend and ensure readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-10" />
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-slate-950/80 to-transparent z-10" />
            </motion.div>
            
            {/* Hero Content with Subtle Parallax */}
            <motion.div 
                style={{ y: yContent, opacity: opacityContent }}
                className="max-w-7xl mx-auto px-6 h-full w-full flex flex-col justify-center pt-20 pb-44 md:pt-44 md:pb-40 relative z-20 will-change-[transform,opacity]"
            >
                <div className="flex flex-col gap-6 md:gap-8 max-w-4xl text-left">
                    {/* Elegant Breadcrumbs */}
                    <div className="flex items-center flex-wrap gap-x-3.5 md:gap-x-4.5 gap-y-2 text-white/30 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Link href="/" className="hover:text-blue-400 transition-colors flex items-center gap-1.5">
                            <Home className="w-3 h-3" /> Home
                        </Link>
                        <span className="text-white/10">/</span>
                        <Link href="/layanan" className="hover:text-blue-400 transition-colors">Layanan</Link>
                        <span className="text-white/10">/</span>
                        <span className="text-white tracking-widest">{service.nama}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                        <Badge className="bg-blue-600 text-white border-0 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-blue-600/30">
                            Layanan Terlaris
                        </Badge>
                        <Badge className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em]">
                            Premium Quality
                        </Badge>
                    </div>
                    
                    <h1 className="text-4xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.9] md:leading-[0.8] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 uppercase">
                        {service.nama}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 md:gap-12 mt-4 md:mt-6 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
                        <div className="flex items-center gap-3 md:gap-4">
                            <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-[24px] bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/30 shrink-0">
                                <Zap className="w-5 h-5 md:w-8 md:h-8" />
                            </div>
                            <div className="text-left">
                                <p className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-0.5 md:mb-1 whitespace-nowrap">Estimasi Biaya</p>
                                <p className="text-xl md:text-3xl font-black text-white whitespace-nowrap">Rp {service.hargaMulai.toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 md:gap-4 md:border-l border-white/10 md:pl-12">
                            <div className="w-10 h-10 md:w-16 md:h-16 rounded-2xl md:rounded-[24px] bg-white/10 backdrop-blur-md border border-white/20 text-blue-400 flex items-center justify-center shrink-0">
                                <Clock className="w-5 h-5 md:w-8 md:h-8" />
                            </div>
                            <div className="text-left">
                                <p className="text-white/40 text-[8px] md:text-[10px] font-black uppercase tracking-widest mb-0.5 md:mb-1 whitespace-nowrap">Durasi Pengerjaan</p>
                                <p className="text-xl md:text-3xl font-black text-white whitespace-nowrap">{service.estimasiMenit} <span className="text-white/40 text-[10px] md:text-sm">Menit</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Floating Decoration - Now Responsive */}
            <div className="absolute bottom-20 left-6 right-6 md:left-auto md:right-24 md:bottom-32 z-30 animate-in fade-in zoom-in duration-1000 delay-500">
                <div className="p-5 md:p-10 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] md:rounded-[48px] shadow-3xl">
                    <div className="flex flex-row md:flex-col gap-6 md:gap-6 justify-around md:justify-start">
                        <div className="flex items-center gap-3 md:gap-4 text-left">
                            <div className="p-2.5 md:p-3 bg-green-500/20 rounded-xl md:rounded-2xl text-green-400 shrink-0">
                                <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase tracking-widest text-[9px] md:text-xs">GARANSI FULL 100%</p>
                                <p className="text-white/50 text-[8px] md:text-[10px]">30 Hari Penuh</p>
                            </div>
                        </div>
                        <div className="w-px h-10 bg-white/10 md:hidden" />
                        <div className="flex items-center gap-3 md:gap-4 text-left">
                            <div className="p-2.5 md:p-3 bg-blue-500/20 rounded-xl md:rounded-2xl text-blue-400 shrink-0">
                                <Star className="w-5 h-5 md:w-6 md:h-6 fill-current" />
                            </div>
                            <div>
                                <p className="text-white font-black uppercase tracking-widest text-[9px] md:text-xs">Teknisi Ahli</p>
                                <p className="text-white/50 text-[8px] md:text-[10px]">Lulus Sertifikasi</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    )
}
