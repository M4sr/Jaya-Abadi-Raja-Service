'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText, ShieldCheck, ExternalLink, X, Eye, FileSearch } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface LegalitasDocument {
    id: string
    namaDokumen: string
    fileUrl: string
    coverUrl: string | null
    urutan: number
}

interface LegalitasSectionProps {
    documents: LegalitasDocument[]
}

export function LegalitasSection({ documents }: LegalitasSectionProps) {
    const [selectedPdf, setSelectedPdf] = useState<string | null>(null)
    const [selectedTitle, setSelectedTitle] = useState<string>("")

    if (documents.length === 0) return null

    return (
        <section id="legalitas" className="relative py-24 sm:py-32 bg-slate-50 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[120px] -z-10 -translate-x-1/2 translate-y-1/2" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 sm:mb-20">
                    <div className="max-w-2xl space-y-4">
                        <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100 border-0 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                            Transparansi & Legalitas
                        </Badge>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] tracking-tighter uppercase">
                            Kepercayaan <span className="text-blue-600">Berakar</span> Dari Legalitas.
                        </h2>
                        <p className="text-slate-500 text-lg sm:text-xl font-medium leading-relaxed">
                            Kami beroperasi dengan izin resmi dan standar operasional yang telah tersertifikasi untuk menjamin keamanan & kenyamanan Anda.
                        </p>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
                    {documents.map((doc, idx) => (
                        <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1, duration: 0.6 }}
                            className="group cursor-pointer"
                            onClick={() => {
                                setSelectedPdf(doc.fileUrl)
                                setSelectedTitle(doc.namaDokumen)
                            }}
                        >
                            <div className="relative aspect-[3/4] rounded-[32px] md:rounded-[48px] overflow-hidden bg-white shadow-2xl shadow-slate-200/50 border border-slate-100 transition-all duration-700 group-hover:-translate-y-4 group-hover:shadow-[0_40px_80px_-20px_rgba(2,132,199,0.25)] border-transparent group-hover:border-blue-200">
                                {/* Cover Image */}
                                {doc.coverUrl ? (
                                    <img 
                                        src={doc.coverUrl} 
                                        alt={doc.namaDokumen} 
                                        className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center p-8 text-center text-slate-300">
                                        <FileText className="w-16 h-16 md:w-24 md:h-24 mb-4 opacity-20" />
                                        <p className="text-xs font-black uppercase tracking-widest opacity-40">Dokumen Resmi</p>
                                    </div>
                                )}

                                {/* Hover Overlay */}
                                <div className="absolute inset-0 bg-blue-600/60 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
                                    <div className="w-16 h-16 rounded-full bg-white text-blue-600 flex items-center justify-center mb-6 scale-75 group-hover:scale-100 transition-transform duration-500 shadow-2xl">
                                        <Eye className="w-8 h-8" />
                                    </div>
                                    <p className="text-white font-black uppercase tracking-[0.2em] text-[10px] md:text-xs">Buka Dokumen</p>
                                </div>

                                {/* Bottom Badge (Always Visible or Floating) */}
                                <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                                    <div className="bg-white/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl">
                                        <h4 className="text-slate-900 font-black text-[10px] md:text-xs uppercase truncate leading-none mb-1">
                                            {doc.namaDokumen}
                                        </h4>
                                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tight">Verified Official</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Title Label Below Card */}
                            <div className="mt-6 text-center group-hover:opacity-0 transition-opacity">
                                <h3 className="text-slate-900 font-black text-xs md:text-sm uppercase tracking-tight mb-1">
                                    {doc.namaDokumen}
                                </h3>
                                <div className="flex items-center justify-center gap-1.5 text-blue-600">
                                    <ShieldCheck className="w-4 h-4" />
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Tersertifikasi</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Document Viewer Modal */}
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
                            <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-100 bg-white">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                        <FileSearch className="w-5 h-5 md:w-6 md:h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-900 font-black tracking-tighter uppercase leading-none mb-1">{selectedTitle}</h4>
                                        <p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Official Legal Document Preview</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setSelectedPdf(null)}
                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors flex items-center justify-center"
                                >
                                    <X className="w-5 h-5 md:w-6 md:h-6" />
                                </button>
                            </div>
                            
                            <div className="flex-1 bg-slate-100">
                                <iframe 
                                    src={selectedPdf} 
                                    className="w-full h-full border-0"
                                    title="Legalitas Viewer"
                                />
                            </div>

                            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-slate-500 italic text-xs">
                                    <ShieldCheck className="w-4 h-4 text-green-500" />
                                    Dokumen ini asli dan diterbitkan oleh instansi terkait.
                                </div>
                                <Button 
                                    variant="outline" 
                                    onClick={() => window.open(selectedPdf, '_blank')}
                                    className="rounded-full px-8 h-14 font-black uppercase tracking-widest text-[11px] gap-2 border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all w-full sm:w-auto"
                                >
                                    Open in New Tab <ExternalLink className="w-4 h-4" />
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}
