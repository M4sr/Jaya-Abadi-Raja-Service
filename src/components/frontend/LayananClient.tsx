'use client'

import React, { useState } from 'react'
import Link from "next/link"
import Image from "next/image"
import { Zap, Clock, ShieldCheck, ArrowUpRight } from "lucide-react"
import CategorySelector from "@/components/frontend/CategorySelector"

interface LayananClientProps {
    initialServices: any[]
    categories: any[]
}

export default function LayananClient({ initialServices, categories }: LayananClientProps) {
    const [activeCategory, setActiveCategory] = useState('Semua Layanan')
    
    // Create dynamic tabs based on active categories from DB
    const tabCategories = ['Semua Layanan', ...categories.map(c => c.nama)]

    const filteredServices = initialServices.filter(service => {
        if (activeCategory === 'Semua Layanan') return true
        
        // Find the selected category object
        const selectedCat = categories.find(c => c.nama === activeCategory)
        
        if (!selectedCat) return false
        return service.kategoriId === selectedCat.id
    })

    return (
        <>
            <CategorySelector 
                categories={tabCategories} 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
            />

            {/* Services Feature Grid */}
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                {filteredServices.map((service, index) => (
                    <Link key={service.id} href={`/layanan/${service.slug}`} className="group">
                        <div className="h-[280px] md:h-[500px] relative rounded-[24px] md:rounded-[48px] overflow-hidden bg-white shadow-2xl shadow-slate-200/50 hover:shadow-blue-600/10 transition-all duration-700 hover:-translate-y-2 md:hover:-translate-y-4">
                            {/* Image Container with Zoom effect */}
                            <div className="absolute inset-0 z-0">
                                <Image
                                    src={service.foto || `https://images.unsplash.com/photo-1599933333333-333333333333?q=80&w=1000&auto=format&fit=crop`}
                                    alt={service.nama}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute inset-0 p-4 md:p-10 flex flex-col justify-between z-10">
                                <div className="flex justify-between items-start">
                                    <div className="p-2 md:p-4 bg-white/10 backdrop-blur-md rounded-xl md:rounded-2xl border border-white/20 text-white">
                                        <Zap className="w-3 h-3 md:w-5 md:h-5 text-blue-400" />
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[6px] md:text-[10px] font-black text-white/50 uppercase tracking-[0.2em] mb-0.5 md:mb-1">Mulai</span>
                                        <span className="text-sm md:text-xl font-black text-white whitespace-nowrap">Rp{Math.floor(service.hargaMulai/1000)}k</span>
                                    </div>
                                </div>

                                <div className="space-y-1.5 md:space-y-4">
                                    <h3 className="text-sm md:text-3xl font-black text-white leading-tight tracking-tighter group-hover:text-blue-400 transition-colors uppercase">
                                        {service.nama}
                                    </h3>
                                    
                                    {/* Description - Hidden on Mobile 2-cols for cleanliness */}
                                    <p className="hidden md:block text-slate-400 text-sm leading-relaxed line-clamp-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                        {service.deskripsi}
                                    </p>
                                    
                                    <div className="flex items-center gap-3 md:gap-6 pt-2 md:pt-4 border-t border-white/10 flex-wrap">
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <Clock className="w-3 h-3 text-blue-500" />
                                            <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">{service.estimasiMenit}m</span>
                                        </div>
                                        <div className="flex items-center gap-1 md:gap-2">
                                            <ShieldCheck className="w-3 h-3 text-blue-500" />
                                            <span className="text-[8px] md:text-[10px] font-bold text-white uppercase tracking-widest">Garansi</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 md:pt-6">
                                        <span className="text-[7px] md:text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] md:tracking-[0.3em]">Detail</span>
                                        <div className="w-7 h-7 md:w-10 md:h-10 rounded-full bg-blue-600 flex items-center justify-center text-white -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                                            <ArrowUpRight className="w-3.5 h-3.5 md:w-5 md:h-5" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </>
    )
}
