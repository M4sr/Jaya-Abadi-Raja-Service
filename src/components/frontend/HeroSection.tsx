"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { Play, Snowflake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "./MagneticButton"
import { DynamicHeroWrapper } from "./DynamicHeroWrapper"

export function HeroSection() {
    const sectionRef = React.useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start start", "end start"]
    })

    // Cinematic Parallax Transforms
    const y1 = useTransform(scrollYProgress, [0, 1], [0, 400])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1])

    const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
    const smoothedY1 = useSpring(y1, springConfig)
    const smoothedY2 = useSpring(y2, springConfig)

    return (
        <DynamicHeroWrapper 
            containerRef={sectionRef} 
            className="min-h-[85vh] sm:min-h-screen flex items-center pt-28 sm:pt-32 bg-slate-950"
        >
            {/* Background Layer - Fixed Position with Clipping */}
            <div className="absolute inset-0 z-0 overflow-hidden" style={{ clipPath: 'inset(0)' }}>
                <motion.div
                    style={{ scale, opacity }}
                    className="fixed inset-0 w-full h-full"
                >
                    <Image
                        src="/images/hero.png"
                        alt="Hero background"
                        fill
                        className="object-cover object-center opacity-40 mix-blend-overlay"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />
                </motion.div>
            </div>

            {/* Floating Decorative Elements */}
            <motion.div
                style={{ y: smoothedY2 }}
                className="absolute inset-0 z-10 pointer-events-none"
            >
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] right-[15%] w-48 h-48 sm:w-64 sm:h-64 bg-primary-blue/10 rounded-full blur-3xl opacity-50 sm:opacity-100"
                />
            </motion.div>

            <div className="max-w-7xl mx-auto px-6 relative z-20 w-full mb-12 sm:mb-20 mt-10 sm:mt-8">
                <div className="max-w-4xl">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md w-max mb-6 sm:mb-8 shadow-xl">
                            <Snowflake className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400 animate-spin-slow" />
                            <span className="text-[7px] sm:text-[10px] font-black text-white uppercase tracking-[0.3em]">No. 1 Pekanbaru</span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="text-[2.5rem] sm:text-6xl md:text-8xl font-black text-white leading-[0.9] sm:leading-[0.95] mb-6 sm:mb-8 tracking-tighter">
                            KESEMPURNAAN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-300 italic font-medium sm:font-black tracking-tight drop-shadow-sm">
                                UDARA DINGIN
                            </span>
                        </h1>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-sm sm:text-xl md:text-2xl text-slate-400 mb-8 sm:mb-12 max-w-2xl leading-relaxed font-medium"
                    >
                        Teknologi mutakhir & ketelitian teknisi ahli untuk kenyamanan maksimal hunian Anda.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
                    >
                        <div className="w-full sm:w-auto">
                            <MagneticButton>
                                <Link href="/booking" className="block w-full">
                                    <Button size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-2xl px-8 sm:px-12 py-5 sm:py-8 text-sm sm:text-xl bg-primary-blue hover:bg-blue-600 shadow-2xl shadow-blue-500/20 text-white font-black uppercase tracking-widest transition-all">
                                        Pesan Sekarang
                                    </Button>
                                </Link>
                            </MagneticButton>
                        </div>

                        <div className="w-full sm:w-auto">
                            <MagneticButton>
                                <button
                                    className="flex items-center justify-center sm:justify-start gap-3 sm:gap-4 group px-4 py-2 rounded-full text-white/80 hover:text-white transition-colors w-full sm:w-auto"
                                >
                                    <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/10 transition-all">
                                        <Play className="w-4 h-4 sm:w-6 sm:h-6 text-blue-400 fill-blue-400/20" />
                                    </div>
                                    <span className="font-bold text-sm sm:text-lg">Lihat Cara Kerja</span>
                                </button>
                            </MagneticButton>
                        </div>
                    </motion.div>

                    {/* Quality Badges */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="mt-6 sm:mt-8 flex flex-nowrap items-center gap-x-6 sm:gap-x-12 gap-y-4 border-t border-white/5 pt-6 sm:pt-8 overflow-x-auto no-scrollbar pb-16 sm:pb-24"
                    >
                        <div className="flex flex-col gap-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-3xl font-black text-white tracking-tighter uppercase italic text-blue-500">10+ Thn</span>
                                <div className="text-[7px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">PENGALAMAN<br />PROFESIONAL</div>
                            </div>
                        </div>
                        <div className="w-[1px] h-6 bg-white/10 shrink-0" />
                        <div className="flex flex-col gap-1 shrink-0">
                            <div className="flex items-center gap-2">
                                <span className="text-xl sm:text-3xl font-black text-white tracking-tighter">1.2K+</span>
                                <div className="text-[7px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">PELANGGAN<br />PUAS</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Scroller Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute bottom-28 sm:bottom-36 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <div className="w-[1px] h-12 bg-gradient-to-b from-blue-400 to-transparent" />
                <span className="text-[8px] font-black text-blue-400 uppercase tracking-[0.3em] rotate-90 mt-8 whitespace-nowrap">JELAJAHI</span>
            </motion.div>
        </DynamicHeroWrapper>
    )
}
