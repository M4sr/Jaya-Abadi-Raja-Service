"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Clock, Users, Zap, Award, BadgeCheck, Snowflake } from "lucide-react"

const features = [
    {
        icon: ShieldCheck,
        title: "Garansi Resmi",
        description: "Kami memberikan garansi pekerjaan selama 30 hari untuk memastikan kepuasan Anda tetap terjaga.",
        color: "bg-blue-600 text-white",
        iconBg: "bg-blue-50"
    },
    {
        icon: Clock,
        title: "Respon Cepat",
        description: "Hubungi kami dan teknisi kami akan segera menjadwalkan kunjungan di hari yang sama jika tersedia.",
        color: "bg-indigo-600 text-white",
        iconBg: "bg-indigo-50"
    },
    {
        icon: Users,
        title: "Teknisi Ahli",
        description: "Tim kami terdiri dari teknisi profesional yang telah berpengalaman bertahun-tahun menangani berbagai merk AC.",
        color: "bg-blue-500 text-white",
        iconBg: "bg-blue-50"
    },
    {
        icon: Zap,
        title: "Harga Transparan",
        description: "Tidak ada biaya tersembunyi. Semua harga diinformasikan di awal sebelum pekerjaan dimulai.",
        color: "bg-cyan-600 text-white",
        iconBg: "bg-cyan-50"
    },
    {
        icon: Award,
        title: "Peralatan Modern",
        description: "Kami menggunakan peralatan terbaru untuk hasil pembersihan dan perbaikan yang lebih maksimal secara efisien.",
        color: "bg-blue-700 text-white",
        iconBg: "bg-blue-50"
    },
    {
        icon: BadgeCheck,
        title: "Terpercaya",
        description: "Telah dipercaya oleh ribuan pelanggan rumah tangga dan perusahaan di seluruh area Pekanbaru.",
        color: "bg-indigo-500 text-white",
        iconBg: "bg-indigo-50"
    }
]

export function FeaturesSection() {
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
        <section className="py-20 sm:py-32 relative overflow-hidden">
            {/* Background Ornaments */}
            <div className="absolute left-0 bottom-0 p-20 opacity-[0.02] pointer-events-none">
                <Snowflake className="w-[400px] h-[400px] text-slate-950" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="w-12 h-12 sm:w-20 sm:h-20 bg-blue-50 text-blue-600 rounded-[20px] sm:rounded-[30px] flex items-center justify-center mx-auto mb-6 sm:mb-8 shadow-2xl shadow-blue-100/50"
                    >
                        <BadgeCheck className="w-6 h-6 sm:w-10 sm:h-10" />
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-4 sm:mb-8 tracking-tighter leading-tight"
                    >
                        MENGAPA MEMILIH <span className="text-blue-600">LAYANAN KAMI?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 text-sm sm:text-xl font-medium leading-relaxed"
                    >
                        Kami berkomitmen memberikan layanan terbaik dengan standar kualitas tinggi untuk setiap pelanggan Jaya Abadi Raja Service.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{ y: -10, scale: 1.02 }}
                            className="p-6 sm:p-12 rounded-[30px] sm:rounded-[50px] border border-slate-50 bg-slate-50/30 hover:bg-white hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] hover:border-slate-100 transition-all duration-500 group relative overflow-hidden flex flex-col items-center text-center sm:items-start sm:text-left"
                        >
                            {/* Inner Glow */}
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-[15px] sm:rounded-[24px] flex items-center justify-center mb-6 sm:mb-10 group-hover:rotate-12 transition-transform duration-500 shadow-xl ${feature.color}`}>
                                <feature.icon className="w-6 h-6 sm:w-10 sm:h-10" />
                            </div>
                            <h3 className="text-lg sm:text-3xl font-black text-slate-900 mb-3 sm:mb-6 tracking-tight group-hover:text-blue-600 transition-colors leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed text-[10px] sm:text-lg font-medium group-hover:text-slate-600 transition-colors line-clamp-3">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
