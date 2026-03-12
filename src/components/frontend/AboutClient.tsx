"use client"

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
    Info, 
    Target, 
    Eye, 
    ShieldCheck, 
    Users, 
    Zap, 
    Award,
    CheckCircle2
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { DynamicHeroWrapper } from './DynamicHeroWrapper'

interface AboutClientProps {
    aboutText: string;
    siteName: string;
}

export function AboutClient({ aboutText, siteName }: AboutClientProps) {
    const values = [
        {
            icon: ShieldCheck,
            title: "Terpercaya",
            desc: "Kepercayaan pelanggan adalah aset utama kami dalam setiap pengerjaan."
        },
        {
            icon: Users,
            title: "Teknisi Ahli",
            desc: "Tim teknisi kami telah melewati pelatihan ketat and bersertifikat."
        },
        {
            icon: Zap,
            title: "Respon Cepat",
            desc: "Kami memahami urgensi masalah AC Anda, respon cepat adalah janji kami."
        },
        {
            icon: Award,
            title: "Garansi Nyata",
            desc: "Setiap pekerjaan kami lengkapi dengan garansi sebagai jaminan kualitas."
        }
    ]

    return (
        <main className="min-h-screen bg-[#ffffff] overflow-x-hidden">
            {/* Split-Hero Header */}
            <DynamicHeroWrapper className="pt-32 pb-20 md:pt-48 md:pb-32 bg-slate-950">
                {/* Background Decor */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
                </div>
                
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
                        {/* Left Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 backdrop-blur-md rounded-2xl border border-white/10 mb-8"
                            >
                                <Info className="w-4 h-4 text-blue-400" />
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">Discover Our Story</span>
                            </motion.div>
                            
                            <motion.h1 
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-[0.85]"
                            >
                                KEAHLIAN <br />
                                <span className="text-blue-500 italic">&</span> DEDIKASI
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="text-slate-400 text-lg md:text-xl max-w-xl font-medium leading-relaxed"
                            >
                                Kami bukan sekadar teknisi. Kami adalah mitra kenyamanan Anda di Pekanbaru, membawa standar baru dalam layanan pendingin ruangan sejak 2014.
                            </motion.p>
                        </div>

                        {/* Right Visual (Asymmetrical) */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            className="flex-1 relative w-full aspect-[4/3] lg:aspect-square"
                        >
                            <div className="absolute inset-0 bg-blue-600/20 blur-[80px] rounded-full scale-75" />
                            <div className="relative h-full w-full rounded-[40px] md:rounded-[80px] overflow-hidden border border-white/10 shadow-2xl">
                                <Image 
                                    src="/images/teknisi.png"
                                    alt="Professional Technician"
                                    fill
                                    className="object-cover transition-transform duration-1000 hover:scale-110"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                                
                                <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-xl rounded-[32px] border border-white/20">
                                    <p className="text-white font-black uppercase tracking-widest text-[10px] mb-1">Established</p>
                                    <p className="text-3xl font-black text-white tracking-tighter uppercase leading-none">Pekanbaru, Riau</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </DynamicHeroWrapper>

            {/* Asymmetrical Vision & Mission Section */}
            <section className="relative z-20 -mt-10 md:-mt-20 pb-32">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                        
                        {/* Misi (Floating Over) */}
                        <motion.div 
                            whileInView={{ opacity: 1, y: 0 }}
                            initial={{ opacity: 0, y: 50 }}
                            viewport={{ once: true }}
                            className="lg:col-span-5 bg-white p-12 md:p-16 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col justify-between"
                        >
                            <div>
                                <div className="w-16 h-16 rounded-3xl bg-blue-600 flex items-center justify-center text-white mb-10 shadow-xl shadow-blue-200">
                                    <Target className="w-8 h-8" />
                                </div>
                                <h2 className="text-3xl font-black tracking-tighter uppercase mb-6 text-slate-900 leading-none">Misi Kami</h2>
                                <p className="text-slate-500 text-lg leading-relaxed font-medium">
                                    Menyediakan solusi servis and perawatan AC yang transparan, menggunakan peralatan modern, and memberikan edukasi kepada pelanggan untuk efisiensi energi yang lebih baik.
                                </p>
                            </div>
                            <div className="mt-10 pt-10 border-t border-slate-100 flex items-center justify-between">
                                <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">Action Driven</span>
                                <Badge className="bg-slate-100 text-slate-400 rounded-full text-[9px] uppercase font-bold tracking-widest border-0">Primary</Badge>
                            </div>
                        </motion.div>

                        {/* Visi (Large Dark Card) */}
                        <motion.div 
                            whileInView={{ opacity: 1, x: 0 }}
                            initial={{ opacity: 0, x: 50 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="lg:col-span-7 bg-slate-900 p-12 md:p-20 rounded-[48px] shadow-2xl shadow-slate-900/40 text-white relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 h-full flex flex-col justify-center">
                                <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white mb-10">
                                    <Eye className="w-8 h-8" />
                                </div>
                                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase mb-8 leading-[0.9]">
                                    VISI <br />
                                    <span className="text-blue-500">MASA DEPAN</span>
                                </h2>
                                <p className="text-slate-400 text-xl leading-relaxed font-medium max-w-md">
                                    Menjadi perusahaan jasa HVAC nomor satu di Riau yang dikenal karena integritas tim and kualitas hasil pengerjaan yang tak tertandingi.
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Cerita Kami - Premium Stacked Composition */}
                    <div className="mt-24 md:mt-56 flex flex-col lg:flex-row gap-16 lg:gap-32 items-center scroll-mt-32">
                        {/* Images Block */}
                        <div className="flex-1 order-1 lg:order-1 relative w-full max-w-xl mx-auto">
                            {/* Decorative Background Glow */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[140%] bg-blue-600/5 blur-[80px] md:blur-[120px] -z-10" />
                            
                            <div className="relative h-[400px] md:h-[650px] w-full">
                                {/* Main Larger Image */}
                                <motion.div 
                                    whileInView={{ y: 0, opacity: 1, rotate: -2 }}
                                    initial={{ y: 40, opacity: 0, rotate: 0 }}
                                    viewport={{ once: true }}
                                    className="absolute top-0 left-0 w-[85%] h-[85%] md:w-[80%] md:h-[80%] rounded-[40px] md:rounded-[80px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.15)] border-[6px] md:border-[12px] border-white z-10"
                                >
                                    <Image 
                                        src="https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop"
                                        alt="Kerjasama Tim"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>

                                {/* Secondary Overlapping Image */}
                                <motion.div 
                                    whileInView={{ y: 0, opacity: 1, rotate: 3 }}
                                    initial={{ y: 80, opacity: 0, rotate: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    className="absolute bottom-0 right-0 w-[55%] h-[55%] md:w-[60%] md:h-[60%] rounded-[32px] md:rounded-[60px] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.2)] border-[6px] md:border-[12px] border-white z-20"
                                >
                                    <Image 
                                        src="/images/teknisi.png"
                                        alt="Teknisi Professional"
                                        fill
                                        className="object-cover"
                                    />
                                </motion.div>

                                {/* Floating Since Badge */}
                                <motion.div
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5, type: "spring" }}
                                    className="absolute top-1/2 -left-2 md:-left-12 -translate-y-1/2 z-30 w-20 h-20 md:w-32 md:h-32 bg-blue-600 rounded-full flex flex-col items-center justify-center text-white shadow-2xl shadow-blue-500/40 border-4 border-white"
                                >
                                    <span className="text-[8px] md:text-xs font-black uppercase tracking-widest opacity-80 leading-none">Since</span>
                                    <span className="text-xl md:text-3xl font-black">2014</span>
                                </motion.div>
                            </div>
                        </div>

                        {/* Text Block */}
                        <div className="flex-1 order-2 lg:order-2 space-y-10 md:space-y-16">
                            <div className="space-y-6 md:space-y-8">
                                <Badge className="bg-blue-600 text-white hover:bg-blue-700 px-6 md:px-8 py-2 md:py-2.5 rounded-full border-0 font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px] shadow-lg shadow-blue-200">Cerita Kami</Badge>
                                <h2 className="text-5xl md:text-[110px] font-black text-slate-900 tracking-tighter uppercase leading-[0.8] md:leading-[0.75]">
                                    MEMBANGUN <br />
                                    <span className="text-blue-500">KEPERCAYAAN</span>
                                </h2>
                            </div>
                            
                            <div className="space-y-6 md:space-y-8">
                                <p className="text-slate-600 text-lg md:text-xl leading-relaxed font-black uppercase tracking-tight">
                                    Dedikasi Sepenuh Hati Sejak 2014.
                                </p>
                                <p className="text-slate-500 text-base md:text-lg leading-relaxed font-medium">
                                    Di balik nama {siteName}, terdapat perjalanan panjang dalam memahami kebutuhan udara sejuk bagi masyarakat Pekanbaru. Kami memulai dari tim kecil yang percaya bahwa setiap unit AC memiliki peran krusial bagi kenyamanan beraktivitas.
                                </p>
                                <p className="text-slate-400 text-base md:text-lg leading-relaxed italic border-l-4 border-blue-600 pl-6 py-2 bg-slate-50/50 rounded-r-2xl">
                                    "{aboutText}"
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-8 md:pt-10 border-t border-slate-100">
                                <div className="flex items-center gap-6">
                                    <div className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">10<span className="text-blue-600">+</span></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Years</span>
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">Of Expertise</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">1K<span className="text-blue-600">+</span></div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Clients</span>
                                        <span className="text-xs font-black text-slate-900 uppercase tracking-tighter">Happy & Cool</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Nilai-Nilai Kami - Premium Layout */}
                    <div className="mt-48 space-y-20">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                            <div className="max-w-xl space-y-4">
                                <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-[0.85]">
                                    NILAI-NILAI <br />
                                    <span className="text-blue-600">UTAMA</span>
                                </h2>
                                <p className="text-slate-500 text-lg font-medium">Fondasi yang membuat kami tetap berdiri tegak melayani Anda di setiap musim.</p>
                            </div>
                            <div className="pb-2">
                                <Badge className="bg-slate-950 text-white rounded-full px-6 py-2 uppercase font-black tracking-widest text-[10px]">Our Philosophy</Badge>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((v, i) => (
                                <motion.div 
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className="group bg-white p-10 rounded-[48px] shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-600 transition-all duration-500"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 group-hover:rotate-[15deg]">
                                        <v.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-4">{v.title}</h3>
                                    <p className="text-slate-500 text-sm leading-relaxed font-medium">{v.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </div>
            </section>
        </main>
    )
}
