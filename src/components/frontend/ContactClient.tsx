'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock, 
    FileText, 
    ExternalLink, 
    X, 
    MessagesSquare,
    ChevronRight,
    Navigation,
    LocateFixed
} from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ContactClientProps {
    settings: Record<string, string>
    legalitas: any[]
}

export default function ContactClient({ settings, legalitas }: ContactClientProps) {
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null)

    const contactMethods = [
        {
            icon: Phone,
            title: "Telepon",
            value: settings.phone || "0852-1943-0485",
            action: `tel:${settings.phone || "6285219430485"}`,
            label: "Hubungi Sekarang",
            color: "bg-blue-600"
        },
        {
            icon: MessagesSquare,
            title: "WhatsApp",
            value: "62852-1943-0485",
            action: `https://wa.me/6285219430485`,
            label: "Chat Sekarang",
            color: "bg-green-500"
        },
        {
            icon: Mail,
            title: "Email",
            value: settings.email || "jayaabadirajaservice@gmail.com",
            action: `mailto:${settings.email || "jayaabadirajaservice@gmail.com"}`,
            label: "Kirim Email",
            color: "bg-indigo-600"
        },
        {
            icon: MapPin,
            title: "Alamat",
            value: settings.address || "Jl. Karya Labersa Perumahan Griya Tika Utama Blok G2 No. 17, Pekanbaru",
            action: "https://www.google.com/maps/place/PT.+Jaya+Abadi+Raja+Service/@0.4479363,101.4742188,21z",
            label: "Buka Google Maps",
            color: "bg-slate-800"
        }
    ]

    return (
        <div className="space-y-16 md:space-y-24">
            
            {/* 1. Optimized Contact Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                {contactMethods.map((method, idx) => (
                    <motion.div
                        key={method.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="group p-5 md:p-8 rounded-[32px] md:rounded-[40px] bg-white shadow-xl shadow-slate-200/50 border border-slate-100 hover:border-blue-200 transition-all hover:-translate-y-2"
                    >
                        <div className={`w-10 h-10 md:w-14 md:h-14 rounded-[14px] md:rounded-[20px] ${method.color} flex items-center justify-center text-white mb-4 md:mb-6 shadow-lg shadow-current/20`}>
                            <method.icon className="w-5 h-5 md:w-7 md:h-7" />
                        </div>
                        <h3 className="text-slate-900 font-black uppercase tracking-[0.2em] text-[8px] md:text-xs mb-1 md:mb-2">{method.title}</h3>
                        <p className="text-slate-500 text-[10px] md:text-sm font-bold mb-4 md:mb-8 leading-tight break-words line-clamp-2 md:line-clamp-none">
                            {method.value}
                        </p>
                        
                        <a 
                            href={method.action}
                            target={method.action.startsWith('http') ? "_blank" : undefined}
                            className="flex items-center gap-1.5 md:gap-2 text-blue-600 font-black text-[9px] md:text-[11px] uppercase tracking-widest hover:gap-3 transition-all"
                        >
                            {method.label} 
                            <ChevronRight className="w-3 md:w-4 h-3 md:h-4" />
                        </a>
                    </motion.div>
                ))}
            </div>

            {/* 2. Main Interface: Information & Map */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                
                {/* Left: Info Widgets */}
                <div className="lg:col-span-4 space-y-8 order-2 lg:order-1">
                    {/* Operating Hours */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-900 rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 mb-6">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase mb-2">Jam Kerja</h3>
                        <p className="text-slate-400 text-xs mb-8 font-medium italic">Teknisi kami siap meluncur tepat waktu.</p>
                        
                        <div className="space-y-1">
                            <div className="flex justify-between items-center py-4 border-b border-white/10">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Senin - Sabtu</span>
                                <span className="text-white font-black text-sm">08:00 - 18:00</span>
                            </div>
                            <div className="flex justify-between items-center py-4">
                                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Minggu</span>
                                <span className="text-green-400 font-black text-sm flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    Emergency
                                </span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Legalitas Mini Widget */}
                    {legalitas.length > 0 && (
                        <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-lg font-black tracking-tighter uppercase text-slate-900">Legalitas</h3>
                                <FileText className="w-5 h-5 text-slate-400" />
                            </div>
                            <div className="space-y-3">
                                {legalitas.slice(0, 4).map((doc) => (
                                    <button
                                        key={doc.id}
                                        onClick={() => setSelectedPdf(doc.fileUrl)}
                                        className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-blue-50 transition-colors group"
                                    >
                                        <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest truncate">{doc.namaDokumen}</span>
                                        <ExternalLink className="w-3 h-3 text-slate-300 group-hover:text-blue-600 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                {/* Right: Large Premium Map Card */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="lg:col-span-8 bg-white rounded-[48px] overflow-hidden shadow-2xl border border-slate-100 flex flex-col order-1 lg:order-2"
                >
                    {/* Map Header */}
                    <div className="p-6 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600">
                                    <LocateFixed className="w-5 h-5" />
                                </div>
                                <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Lokasi Kami</h3>
                            </div>
                            <p className="text-slate-500 font-medium text-sm pl-12">
                                PT. Jaya Abadi Raja Service - Pekanbaru
                            </p>
                        </div>
                        
                        <Button 
                            variant="secondary"
                            className="rounded-full bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 flex items-center gap-2 transition-all shadow-none border-0"
                            onClick={() => window.open('https://www.google.com/maps/dir//PT.+Jaya+Abadi+Raja+Service/@0.4479363,101.4742188,21z/', '_blank')}
                        >
                            <Navigation className="w-4 h-4" /> Petunjuk Arah
                        </Button>
                    </div>

                    {/* Integrated Map Area */}
                    <div className="relative aspect-[4/3] md:aspect-video w-full group">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d249.35602443872492!2d101.4742188!3d0.4479363!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d5af00696ecae3%3A0x2698ad23a3c4c9a5!2sPT.%20Jaya%20Abadi%20Raja%20Service!5e0!3m2!1sid!2sid!4v1773180498866!5m2!1sid!2sid" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy" 
                            className="grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                        />
                        
                        {/* Hover Overlay Info */}
                        <div className="absolute inset-x-6 bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden md:block">
                            <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[28px] shadow-2xl border border-white max-w-sm">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Alamat Kantor</p>
                                <p className="text-slate-900 font-black text-sm leading-snug">
                                    Griya Tika Utama Blok G2 No. 17 RT 0044 RW 14 Kel. Air Dingin Kec. Bukit Raya Pekanbaru
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Map Footer CTA */}
                    <div className="p-6 md:p-8 bg-slate-50/50">
                        <Button 
                            className="w-full h-16 rounded-3xl bg-blue-600 hover:bg-slate-900 text-white font-black uppercase tracking-widest text-[11px] md:text-xs shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-3"
                            onClick={() => window.open('https://www.google.com/maps/place/PT.+Jaya+Abadi+Raja+Service/@0.4479363,101.4742188,21z/', '_blank')}
                        >
                            <MapPin className="w-4 h-4" /> Buka di Google Maps
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* PDF Viewer Modal */}
            <AnimatePresence>
                {selectedPdf && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-10"
                        onClick={() => setSelectedPdf(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-5xl h-full max-h-[85vh] bg-white rounded-[32px] sm:rounded-[48px] shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-6 sm:p-8 flex items-center justify-between border-b border-slate-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <h4 className="text-slate-900 font-black tracking-tighter uppercase">Dokumen Legalitas</h4>
                                </div>
                                <button 
                                    onClick={() => setSelectedPdf(null)}
                                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex-1 bg-slate-100">
                                <iframe 
                                    src={selectedPdf} 
                                    className="w-full h-full border-0"
                                    title="PDF Viewer"
                                />
                            </div>

                            <div className="p-6 bg-slate-50 flex justify-center">
                                <Button 
                                    variant="outline" 
                                    onClick={() => window.open(selectedPdf, '_blank')}
                                    className="rounded-full px-8 py-6 font-bold uppercase tracking-widest text-xs gap-2 border-slate-200"
                                >
                                    Open in New Tab <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
