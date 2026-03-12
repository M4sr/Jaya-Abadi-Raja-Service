"use client"

import * as React from "react"
import { Home, Star } from "lucide-react"
import { DynamicHeroWrapper } from "./DynamicHeroWrapper"

export function LayananHero() {
    return (
        <DynamicHeroWrapper className="pt-32 pb-32 md:pb-48 bg-slate-950">
            {/* Background Pattern & Gradients */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[60%] aspect-square bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] aspect-square bg-indigo-600/10 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.4em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Home className="w-3 h-3" /> 
                        <span>/</span>
                        <span>Layanan Eksklusif</span>
                    </div>
                    
                    <h1 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black text-white leading-[0.85] tracking-tighter mb-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        EKSPLORASI <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">SOLUSI DINGIN</span>
                    </h1>
                    
                    <p className="text-slate-400 text-base md:text-xl max-w-2xl leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                        Wujudkan kenyamanan udara terbaik dengan layanan profesional berskala industri dan residensial. 
                        Teknisi tersertifikasi, peralatan mutakhir, dan garansi penuh.
                    </p>
                </div>
            </div>
            
            {/* Floating Stats Decor */}
            <div className="hidden lg:block absolute bottom-12 left-12 animate-bounce duration-[3000ms]">
                <div className="p-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                            <Star className="w-5 h-5 fill-current" />
                        </div>
                        <div>
                            <p className="text-white font-black text-xl leading-tight">4.9/5</p>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Rating Layanan</p>
                        </div>
                    </div>
                </div>
            </div>
        </DynamicHeroWrapper>
    )
}
