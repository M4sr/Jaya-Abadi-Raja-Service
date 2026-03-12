"use client"

import Link from "next/link"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"
import { ChevronRight, Snowflake, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MagneticButton } from "./MagneticButton"

export function ServicesSection({ services }: { services: any[] }) {
    const sectionRef = useRef(null)
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })

    const y = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"])

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 50, rotateX: 15 },
        show: {
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: { type: "spring" as const, stiffness: 80, damping: 20 }
        }
    }

    return (
        <section ref={sectionRef} className="py-24 relative overflow-hidden bg-slate-950">
            {/* Simple Background Gradient */}
            <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_50%,rgba(30,58,138,0.1),transparent)]" />

            <div className="max-w-7xl mx-auto px-6 relative z-20">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-2 mb-6"
                        >
                            <div className="w-12 h-1.5 bg-blue-600 rounded-full" />
                            <span className="text-xs font-black text-blue-600 uppercase tracking-[0.3em]">Layanan Eksklusif</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter"
                        >
                            SOLUSI <span className="text-blue-500">PREMIUM</span> UNTUK KENYAMANAN ANDA
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/layanan">
                            <MagneticButton>
                                <Button variant="outline" className="rounded-2xl px-10 py-8 border-white/10 bg-white/5 text-white hover:bg-white hover:text-slate-900 shadow-xl shadow-black/50 font-bold uppercase tracking-widest text-xs">
                                    Eksplorasi Layanan <ChevronRight className="w-5 h-5 ml-2" />
                                </Button>
                            </MagneticButton>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
                >
                    {services.map((service) => (
                        <motion.div
                            key={service.id}
                            variants={item}
                        >
                            <Card className="group relative h-[210px] sm:h-[450px] overflow-hidden border border-white/5 bg-slate-950 shadow-[0_10px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_40px_100px_rgba(59,130,246,0.15)] transition-all duration-700 rounded-[20px] sm:rounded-[40px]">
                                <div className="relative h-full w-full rounded-[inherit] overflow-hidden">
                                    <Image
                                        src={service.foto || `https://images.unsplash.com/photo-1599933333333-333333333333?q=80&w=1000&auto=format&fit=crop`}
                                        alt={service.nama}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                        unoptimized={!service.foto}
                                    />

                                    {/* Dark Overlay — Guaranteed full coverage at bottom */}
                                    <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="absolute inset-0 p-4 sm:p-10 flex flex-col justify-end">
                                        {/* Animated content wrapper */}
                                        <div className="translate-y-4 sm:translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                                            <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                                <BadgeCheck className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-blue-400" />
                                                <span className="text-[7px] sm:text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">Kualitas Terjamin</span>
                                            </div>

                                            <h3 className="text-base sm:text-3xl font-black text-white mb-1.5 sm:mb-4 leading-tight group-hover:text-white transition-colors duration-300 line-clamp-2">
                                                {service.nama}
                                            </h3>
                                        </div>

                                        <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700 delay-200">
                                            <p className="text-slate-300 text-[10px] sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-2 hidden sm:block">
                                                {service.deskripsi || "Layanan profesional dengan teknisi berpengalaman untuk memberikan hasil terbaik bagi AC Anda."}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between mt-1 sm:mt-4">
                                            <div>
                                                <p className="text-slate-400 text-[6px] sm:text-[10px] font-black uppercase tracking-widest mb-0.5">Mulai Dari</p>
                                                <p className="text-white text-xs sm:text-2xl font-black">Rp {service.hargaMulai.toLocaleString('id-ID')}</p>
                                            </div>

                                            <Link href={`/layanan/${service.slug}`}>
                                                <MagneticButton strength={20}>
                                                    <div className="w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-2xl shadow-blue-600/40">
                                                        <ChevronRight className="w-5 h-5 sm:w-8 sm:h-8" />
                                                    </div>
                                                </MagneticButton>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
