"use client"

import * as React from "react"
import { Camera } from "lucide-react"
import { DynamicHeroWrapper } from "./DynamicHeroWrapper"

export function GalleryHero() {
    return (
        <DynamicHeroWrapper className="pt-32 pb-24 md:pt-48 md:pb-40 bg-slate-950">
            {/* Background Decor */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center">
                    <div className="p-4 bg-blue-500/10 backdrop-blur-xl rounded-3xl border border-white/10 mb-8 animate-in fade-in zoom-in duration-700">
                        <Camera className="w-8 h-8 text-blue-400" />
                    </div>
                    
                    <h1 className="text-4xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase leading-none">
                        GALERI <br />
                        <span className="text-blue-500">PEKERJAAN</span>
                    </h1>
                    
                    <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium">
                        Dokumentasi nyata hasil kerja keras tim teknisi profesional kami dalam melayani pelanggan di Pekanbaru.
                    </p>
                </div>
            </div>
        </DynamicHeroWrapper>
    )
}
