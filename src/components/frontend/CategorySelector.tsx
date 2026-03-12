'use client'

import React, { useRef, useState, useEffect } from 'react'
import { ChevronsLeft, ChevronsRight } from "lucide-react"

interface CategorySelectorProps {
    categories: string[]
    activeCategory: string
    onCategoryChange: (category: string) => void
}

export default function CategorySelector({ categories, activeCategory, onCategoryChange }: CategorySelectorProps) {
    const scrollRef = useRef<HTMLDivElement>(null)
    const [showLeftArrow, setShowLeftArrow] = useState(false)
    const [showRightArrow, setShowRightArrow] = useState(true)

    const checkScroll = () => {
        if (!scrollRef.current) return
        
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
        setShowLeftArrow(scrollLeft > 20)
        setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 20)
    }

    useEffect(() => {
        const el = scrollRef.current
        if (!el) return

        // Check scroll for arrow visibility
        checkScroll()
        el.addEventListener('scroll', checkScroll)
        window.addEventListener('resize', checkScroll)

        // Intersection Observer for auto-active on mobile
        const observerOptions = {
            root: el,
            threshold: 1.0, // Full visibility for better accuracy
            rootMargin: '0px -40% 0px -40%' // Narrow focus area to the exact center
        }

        const observer = new IntersectionObserver((entries) => {
            // Only auto-trigger on touch devices/mobile
            if (window.innerWidth >= 768) return

            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const category = entry.target.getAttribute('data-category')
                    if (category && category !== activeCategory) {
                        onCategoryChange(category)
                    }
                }
            })
        }, observerOptions)

        // Observe all category buttons
        const buttons = el.querySelectorAll('[data-category]')
        buttons.forEach(btn => observer.observe(btn))

        return () => {
            el.removeEventListener('scroll', checkScroll)
            window.removeEventListener('resize', checkScroll)
            observer.disconnect()
        }
    }, [categories.join(','), activeCategory, onCategoryChange])

    return (
        <div className="flex justify-center mb-10 md:mb-16 px-10 relative w-full -mt-12 md:-mt-20">
            {/* Mobile Side Indicators (Double Chevrons) - No Background */}
            <div 
                className={`md:hidden absolute left-1 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 pointer-events-none ${showLeftArrow ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
                <ChevronsLeft className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)] animate-bounce-horizontal-slow" />
            </div>
            
            <div 
                className={`md:hidden absolute right-1 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 pointer-events-none ${showRightArrow ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
            >
                <ChevronsRight className="w-6 h-6 text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.4)] animate-bounce-horizontal-slow" />
            </div>

            {/* Main Container */}
            <div className="w-full max-w-[300px] md:max-w-none md:w-max bg-white/95 backdrop-blur-xl rounded-full shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white/60 relative z-10">
                <div 
                    ref={scrollRef}
                    className="flex items-center overflow-x-auto no-scrollbar snap-x snap-mandatory p-1.5 md:p-1.5"
                >
                    {categories.map((cat, i) => {
                        const isActive = cat === activeCategory
                        return (
                            <button 
                                key={cat} 
                                    onClick={() => onCategoryChange(cat)}
                                    data-category={cat}
                                    className={`
                                        flex-none snap-center w-full md:w-auto
                                        px-8 md:px-10 py-4.5 md:py-3.5 rounded-full transition-all duration-500 font-black text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-widest relative
                                        ${isActive 
                                            ? 'text-white' 
                                            : 'text-slate-500 hover:bg-slate-50'
                                        }
                                    `}
                            >
                                <span className="relative z-10">{cat}</span>
                                {isActive && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-600/30 -z-0 animate-in fade-in scale-in-95 duration-500" />
                                )}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
