'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { X, Maximize2, ChevronLeft, ChevronRight } from 'lucide-react'
import CategorySelector from "@/components/frontend/CategorySelector"

interface Photo {
    id: string
    judul: string | null
    fotoUrl: string
    kategori: string | null
}

interface GalleryClientProps {
    photos: Photo[]
    categories: string[]
}

export default function GalleryClient({ photos, categories }: GalleryClientProps) {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
    const [activeCategory, setActiveCategory] = useState('Semua')

    const filteredPhotos = photos.filter(photo => {
        if (activeCategory === 'Semua') return true
        return photo.kategori === activeCategory
    })

    const openLightbox = (idx: number) => {
        // Find the index in the original photos list for the lightbox
        const photoId = filteredPhotos[idx].id
        const originalIdx = photos.findIndex(p => p.id === photoId)
        setSelectedIdx(originalIdx)
    }
    
    const closeLightbox = () => setSelectedIdx(null)

    const nextPhoto = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (selectedIdx !== null) {
            setSelectedIdx((selectedIdx + 1) % photos.length)
        }
    }

    const prevPhoto = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (selectedIdx !== null) {
            setSelectedIdx((selectedIdx - 1 + photos.length) % photos.length)
        }
    }

    if (photos.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-slate-400">Belum ada foto di galeri.</p>
            </div>
        )
    }

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        show: { 
            opacity: 1, 
            y: 0, 
            scale: 1,
            transition: {
                duration: 0.6,
                ease: [0.21, 1, 0.36, 1]
            }
        }
    }

    return (
        <>
            <CategorySelector 
                categories={categories} 
                activeCategory={activeCategory} 
                onCategoryChange={setActiveCategory} 
            />

            {/* Gallery Grid */}
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-8"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredPhotos.map((photo, idx) => (
                        <motion.div
                            key={photo.id}
                            layout
                            variants={itemVariants}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="group relative aspect-square rounded-2xl md:rounded-[48px] overflow-hidden bg-white cursor-pointer shadow-xl shadow-slate-200/50"
                            onClick={() => openLightbox(idx)}
                        >
                            <Image
                                src={photo.fotoUrl}
                                alt={photo.judul || "Galeri Foto"}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110"
                            />
                            
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4 md:p-10">
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] md:text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">
                                            {photo.kategori || "Umum"}
                                        </span>
                                        <span className="text-white font-black uppercase tracking-tighter text-xs md:text-xl leading-none">
                                            {photo.judul || "Dokumentasi"}
                                        </span>
                                    </div>
                                    <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-blue-600 flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform duration-500 delay-100 shadow-lg shadow-blue-500/40">
                                        <Maximize2 className="w-4 h-4 md:w-6 md:h-6" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Custom Lightbox */}
            <AnimatePresence>
                {selectedIdx !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-10"
                    >
                        {/* Dynamic Blurred Background */}
                        <div className="absolute inset-0 bg-slate-950 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={photos[selectedIdx].fotoUrl}
                                    initial={{ opacity: 0, scale: 1.2 }}
                                    animate={{ opacity: 0.5, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.2 }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="absolute inset-0"
                                >
                                    <Image
                                        src={photos[selectedIdx].fotoUrl}
                                        alt="Background Blur"
                                        fill
                                        className="object-cover blur-[12px] scale-110"
                                        priority
                                    />
                                </motion.div>
                            </AnimatePresence>
                            {/* Overlay to darken slightly and add vignette */}
                            <div className="absolute inset-0 bg-slate-950/40" />
                            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-transparent to-slate-950/80" />
                        </div>

                        <motion.button
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-6 right-6 sm:top-10 sm:right-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors z-[110]"
                            onClick={closeLightbox}
                        >
                            <X className="w-6 h-6" />
                        </motion.button>

                        <div className="relative w-full max-w-5xl aspect-[4/3] sm:aspect-video">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedIdx}
                                    initial={{ opacity: 0, x: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: -20, scale: 0.95 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full rounded-[32px] overflow-hidden shadow-2xl"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Image
                                        src={photos[selectedIdx].fotoUrl}
                                        alt={photos[selectedIdx].judul || "Lightbox Photo"}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                    
                                    {/* Caption */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 bg-gradient-to-t from-black/80 to-transparent">
                                        <h3 className="text-white text-lg sm:text-2xl font-black uppercase tracking-tighter">
                                            {photos[selectedIdx].judul || "Galeri Foto"}
                                        </h3>
                                        <p className="text-white/60 text-xs sm:text-sm uppercase tracking-widest mt-1">
                                            Photo {selectedIdx + 1} of {photos.length}
                                        </p>
                                    </div>
                                </motion.div>
                            </AnimatePresence>

                            {/* Navigation */}
                            <button
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-sm transition-all z-[110]"
                                onClick={prevPhoto}
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-20 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center backdrop-blur-sm transition-all z-[110]"
                                onClick={nextPhoto}
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
