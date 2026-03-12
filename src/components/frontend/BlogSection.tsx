"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Calendar, User, ArrowRight, ChevronRight, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BlogSection({ articles }: { articles: any[] }) {
    if (!articles || articles.length === 0) return null

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
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
    }

    return (
        <section className="py-24 bg-slate-950 relative overflow-hidden">
            {/* Dark Mode Ornaments */}
            <div className="absolute top-0 left-0 w-full h-full opacity-[0.05] pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-blue-600 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 sm:gap-10 mb-10 sm:mb-16">
                    <div className="max-w-3xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="flex items-center gap-3 mb-4 sm:mb-8"
                        >
                            <span className="text-[8px] sm:text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Wawasan & Tips</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl sm:text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter"
                        >
                            WAWASAN <span className="text-blue-500">TERBARU</span> DARI PARA AHLI
                        </motion.h2>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                    >
                        <Link href="/blog">
                            <Button variant="outline" className="rounded-2xl px-8 py-6 bg-white/5 border-white/10 text-white hover:bg-white hover:text-slate-950 shadow-2xl shadow-black/50 font-black uppercase tracking-widest text-xs">
                                Lihat Semua Artikel <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-10"
                >
                    {articles.slice(0, 3).map((article, index) => (
                        <motion.div
                            key={article.id}
                            variants={item}
                        >
                            <Link href={`/blog/${article.slug}`} className="group block h-full">
                                <div className="bg-white/5 backdrop-blur-3xl rounded-[24px] sm:rounded-[40px] overflow-hidden border border-white/10 shadow-2xl hover:bg-white shadow-black/30 hover:shadow-[0_40px_100px_rgba(59,130,246,0.15)] transition-all duration-700 h-full flex flex-col group relative">

                                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity duration-700 blur" />

                                    <div className="relative h-32 sm:h-60 overflow-hidden m-1.5 sm:m-3 rounded-[18px] sm:rounded-[32px]">
                                        <Image
                                            src={article.foto || `https://images.unsplash.com/photo-1599933333333-333333333333?q=80&w=1000&auto=format&fit=crop`}
                                            alt={article.judul}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                            unoptimized={!article.foto}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="absolute top-2 left-2 sm:top-6 sm:left-6">
                                            <span className="bg-blue-600 text-white text-[7px] sm:text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 sm:px-5 sm:py-2 rounded-full shadow-2xl">
                                                {article.kategori}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 sm:p-8 pt-1 sm:pt-2 flex flex-col flex-grow relative z-10">
                                        <div className="flex items-center gap-2 sm:gap-4 text-[7px] sm:text-[10px] text-slate-400 mb-2 sm:mb-6 font-black uppercase tracking-[0.2em]">
                                            <div className="flex items-center gap-1 sm:gap-2 group-hover:text-blue-600 transition-colors">
                                                <Calendar className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                                                {new Date(article.publishedAt || article.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </div>
                                            <div className="flex items-center gap-1 sm:gap-2 group-hover:text-blue-600 transition-colors">
                                                <User className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                                                {article.author?.name?.split(' ')[0] || "Admin"}
                                            </div>
                                        </div>

                                        <h3 className="text-sm sm:text-2xl font-black text-white group-hover:text-slate-900 mb-2 sm:mb-6 transition-colors line-clamp-2 leading-tight tracking-tighter">
                                            {article.judul}
                                        </h3>

                                        <p className="text-slate-400 text-xs sm:text-base font-medium leading-relaxed mb-4 sm:mb-8 line-clamp-2 group-hover:text-slate-600 transition-colors hidden sm:block">
                                            {article.excerpt || "Optimalkan kenyamanan hunian Anda melalui tips perawatan AC yang tepat dan berkala."}
                                        </p>

                                        <div className="mt-auto flex items-center justify-between gap-2">
                                            <div className="flex items-center font-black text-blue-500 group-hover:text-blue-600 transition-colors gap-1.5 sm:gap-3 text-[8px] sm:text-sm uppercase tracking-widest">
                                                <span className="hidden sm:inline">Baca Selengkapnya</span>
                                                <span className="sm:hidden">Baca</span>
                                                <div className="w-5 h-5 sm:w-10 sm:h-10 rounded-full border border-blue-500/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all">
                                                    <ArrowRight className="w-2 h-2 sm:w-4 sm:h-4" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 text-slate-500 group-hover:text-slate-400">
                                                <MessageSquare className="w-2.5 h-2.5 sm:w-4 sm:h-4" />
                                                <span className="text-[7px] sm:text-[10px] font-black uppercase tracking-widest">
                                                    {(article.judul.length % 5) + 1}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
