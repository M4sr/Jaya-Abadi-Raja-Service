"use client"

import { motion } from "framer-motion"

interface Stat {
    label: string
    value: number
    suffix: string
}

export function StatsSection({ stats }: { stats: Stat[] }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 30, scale: 0.9 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 100 } }
    }

    return (
        <section className="relative z-30 px-6 bg-transparent">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid grid-cols-4 gap-2 md:gap-10"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={item}
                            whileHover={{
                                y: -10,
                                rotateX: 10,
                                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.2)"
                            }}
                            className="bg-white/80 backdrop-blur-2xl rounded-2xl sm:rounded-[40px] p-3 sm:p-10 border border-white shadow-[0_15px_60px_rgba(0,0,0,0.03)] text-center flex flex-col items-center group transition-all duration-500 perspective-1000"
                        >
                            <motion.div
                                initial={{ scale: 0.5 }}
                                whileInView={{ scale: 1 }}
                                transition={{ duration: 1, delay: 0.2 + (index * 0.1) }}
                                className="text-xl sm:text-5xl md:text-7xl font-black text-slate-900 mb-1 tracking-tighter leading-none"
                            >
                                {stat.value}{stat.suffix}
                            </motion.div>
                            <div className="text-[6px] sm:text-[10px] font-black text-blue-600/60 uppercase tracking-[0.1em] sm:tracking-[0.3em] mb-1 sm:mb-4 leading-tight">
                                {stat.label}
                            </div>
                            <div className="w-4 sm:w-10 h-[2px] sm:h-1 bg-blue-100 rounded-full group-hover:bg-blue-600 transition-all duration-500" />
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
