"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Snowflake } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MagneticButton } from "./MagneticButton"

export function CTASection() {
    return (
        <section className="py-16 sm:py-32 bg-slate-950 relative overflow-hidden">
            {/* Dynamic Background Elements */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1/4 -right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white/[0.02] backdrop-blur-3xl rounded-[32px] sm:rounded-[60px] border border-white/5 p-6 sm:p-20 text-center relative overflow-hidden group shadow-2xl shadow-black/50"
                >
                    {/* Sleek Crystal Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.05] via-transparent to-indigo-500/[0.05] opacity-50" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.5 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="w-12 h-12 sm:w-20 sm:h-20 bg-blue-600/90 rounded-[15px] sm:rounded-[30px] flex items-center justify-center mx-auto mb-6 sm:mb-10 shadow-2xl shadow-blue-600/30"
                        >
                            <Snowflake className="w-6 h-6 sm:w-10 sm:h-10 text-white animate-spin-slow" />
                        </motion.div>

                        <h2 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-black text-white mb-4 sm:mb-8 leading-[1.2] sm:leading-[1.1] tracking-tighter uppercase">
                            SUDAH WAKTUNYA AC <br className="hidden sm:block" />
                            <span className="text-blue-500">ANDA DISERVIS?</span>
                        </h2>

                        <p className="text-slate-400 text-[10px] sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-12 leading-relaxed font-medium max-w-2xl mx-auto">
                            Jangan tunggu rusak! Perawatan rutin sekarang menghemat biaya listrik dan memperpanjang umur AC Anda.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
                            <div className="w-full sm:w-auto">
                                <MagneticButton>
                                    <Link href="/booking" className="block w-full">
                                        <Button size="lg" className="w-full sm:w-auto rounded-xl sm:rounded-2xl px-6 sm:px-12 py-5 sm:py-8 text-[10px] sm:text-lg bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 text-white font-black uppercase tracking-widest transition-all">
                                            Pesan Sekarang
                                        </Button>
                                    </Link>
                                </MagneticButton>
                            </div>

                            <div className="w-full sm:w-auto">
                                <MagneticButton>
                                    <Link href="https://wa.me/6281234567890" className="block w-full">
                                        <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-xl sm:rounded-2xl px-6 sm:px-12 py-5 sm:py-8 text-[10px] sm:text-lg border-white/10 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest backdrop-blur-md transition-all flex items-center justify-center gap-2 sm:gap-3">
                                            <svg 
                                                viewBox="0 0 24 24" 
                                                className="w-4 h-4 sm:w-6 sm:h-6 fill-current text-white/90"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                            </svg>
                                            <span>Chat WhatsApp</span>
                                        </Button>
                                    </Link>
                                </MagneticButton>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
