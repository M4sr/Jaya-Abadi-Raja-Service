"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Snowflake, Phone, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const mainNavLinks = [
    { name: "Beranda", href: "/" },
    { name: "Layanan", href: "/layanan" },
    { name: "Legalitas", href: "/#legalitas" },
    { name: "Tentang", href: "/tentang" },
    { name: "Kontak", href: "/kontak" },
]

const extraNavLinks = [
    { name: "Tracking Pesanan", href: "/booking/track" },
    { name: "Galeri", href: "/galeri" },
    { name: "Blog", href: "/blog" },
]

export function Navbar() {
    const [isOpen, setIsOpen] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [isLainnyaOpen, setIsLainnyaOpen] = React.useState(false)
    const [isMobileLainnyaOpen, setIsMobileLainnyaOpen] = React.useState(false)
    const pathname = usePathname()
    const isExtraActive = extraNavLinks.some(l => pathname === l.href)

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    React.useEffect(() => {
        setIsOpen(false)
        setIsLainnyaOpen(false)
        setIsMobileLainnyaOpen(false)
    }, [pathname])

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
                isScrolled ? "py-4" : "py-8"
            )}
        >
            <nav
                className={cn(
                    "max-w-7xl mx-auto rounded-[32px] transition-all duration-700 px-8 py-4 border relative",
                    isScrolled
                        ? "bg-white/80 backdrop-blur-2xl border-white shadow-[0_20px_80px_rgba(0,0,0,0.06)] scale-95"
                        : "bg-transparent border-transparent"
                )}
            >
                {/* Scroll Progress line at the bottom of nav */}
                {isScrolled && (
                    <motion.div
                        layoutId="nav-border"
                        className="absolute bottom-0 left-0 h-[2px] bg-blue-600 w-full opacity-20"
                    />
                )}

                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <motion.div
                            whileHover={{ rotate: 180, scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 200 }}
                            className={cn(
                                "p-2.5 rounded-2xl transition-colors duration-500",
                                isScrolled ? "bg-blue-600 text-white" : "bg-white/10 text-white backdrop-blur-md border border-white/20"
                            )}
                        >
                            <Snowflake className="w-6 h-6" />
                        </motion.div>
                        <div className="flex flex-col">
                            <span className={cn(
                                "font-black text-xl tracking-tighter leading-none transition-colors duration-500",
                                isScrolled ? "text-slate-900" : "text-white"
                            )}>
                                JAYA ABADI
                            </span>
                            <span className={cn(
                                "text-[10px] font-black tracking-[0.3em] transition-colors duration-500",
                                isScrolled ? "text-blue-600/60" : "text-blue-400"
                            )}>
                                RAJA SERVICE
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center gap-8 xl:gap-10">
                        {mainNavLinks.map((link) => {
                            const isActive = pathname === link.href
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={cn(
                                        "relative py-1 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 hover:scale-110",
                                        isActive
                                            ? "text-blue-600"
                                            : isScrolled ? "text-slate-500 hover:text-slate-900" : "text-white/60 hover:text-white"
                                    )}
                                >
                                    {link.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="nav-active-line"
                                            className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </Link>
                            )
                        })}

                        {/* Dropdown "Lainnya" at the end */}
                        <div 
                            className="relative group"
                            onMouseEnter={() => setIsLainnyaOpen(true)}
                            onMouseLeave={() => setIsLainnyaOpen(false)}
                        >
                            <button
                                className={cn(
                                    "relative py-1 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.2em] transition-all duration-500",
                                    isLainnyaOpen || isExtraActive
                                        ? "text-blue-600"
                                        : isScrolled ? "text-slate-500 hover:text-slate-900" : "text-white/60 hover:text-white"
                                )}
                            >
                                Lainnya
                                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-300", isLainnyaOpen && "rotate-180")} />
                                {isExtraActive && (
                                    <motion.div
                                        layoutId="nav-active-line"
                                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 rounded-full"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>

                            <AnimatePresence>
                                {isLainnyaOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full right-0 pt-4 min-w-[180px]"
                                    >
                                        <div className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-2 overflow-hidden">
                                            {extraNavLinks.map((link) => (
                                                <Link
                                                    key={link.name}
                                                    href={link.href}
                                                    className={cn(
                                                        "flex items-center justify-between px-5 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                                        pathname === link.href
                                                            ? "bg-blue-50 text-blue-600"
                                                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                                                    )}
                                                >
                                                    {link.name}
                                                    {pathname === link.href && <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                                                </Link>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="hidden lg:flex items-center gap-6">
                        <Link href="/booking">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Button className={cn(
                                    "rounded-2xl px-8 py-6 font-black uppercase tracking-widest text-xs transition-all duration-500",
                                    isScrolled
                                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200"
                                        : "bg-white text-slate-950 hover:bg-blue-50 shadow-2xl shadow-black/20"
                                )}>
                                    Pesan Sekarang
                                </Button>
                            </motion.div>
                        </Link>
                    </div>

                    {/* Mobile Menu Trigger */}
                    <motion.button
                        whileTap={{ scale: 0.9 }}
                        className={cn(
                            "lg:hidden p-3 rounded-2xl transition-all duration-500",
                            isScrolled ? "bg-slate-100 text-slate-900" : "bg-white/10 text-white backdrop-blur-md border border-white/20"
                        )}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </motion.button>
                </div>
            </nav>

            {/* Mobile Navigation Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm lg:hidden z-[90]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[80vw] max-w-sm bg-white/95 backdrop-blur-3xl rounded-l-[40px] border-l border-white shadow-[-20px_0_80px_rgba(0,0,0,0.1)] p-8 sm:p-12 lg:hidden flex flex-col z-[100] overflow-hidden"
                        >
                            {/* Decorative Sidebar Glow */}
                            <div className="absolute -top-[10%] -right-[10%] w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="absolute -bottom-[10%] -left-[10%] w-48 h-48 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

                            <div className="relative z-10 flex items-center justify-between mb-12 sm:mb-16">
                                <Link href="/" className="flex items-center gap-3">
                                    <div className="bg-blue-600 p-2.5 rounded-2xl shadow-lg shadow-blue-600/30">
                                        <Snowflake className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-black text-xl tracking-tighter text-slate-900 leading-none">JAYA ABADI</span>
                                        <span className="text-[9px] font-black tracking-[0.3em] text-blue-600 uppercase mt-0.5">RAJA SERVICE</span>
                                    </div>
                                </Link>
                                <motion.button
                                    whileTap={{ scale: 0.8 }}
                                    className="p-2.5 bg-slate-100/80 rounded-xl text-slate-500 hover:bg-slate-200 transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <X className="w-5 h-5" />
                                </motion.button>
                            </div>

                            <div className="relative z-10 flex flex-col gap-6 sm:gap-8 overflow-y-auto pr-2 custom-scrollbar">
                                {mainNavLinks.map((link, i) => (
                                    <motion.div
                                        key={link.name}
                                        initial={{ x: 20, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: 0.1 + i * 0.05 }}
                                    >
                                        <Link
                                            href={link.href}
                                            className={cn(
                                                "text-2xl sm:text-3xl font-black transition-all tracking-tight block w-full",
                                                pathname === link.href ? "text-blue-600 translate-x-2" : "text-slate-400 hover:text-slate-900"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                {pathname === link.href && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                                                {link.name}
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}

                                {/* Mobile "Lainnya" Accordion at the end */}
                                <motion.div
                                    initial={{ x: 20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 + mainNavLinks.length * 0.05 }}
                                    className="space-y-4"
                                >
                                    <button
                                        onClick={() => setIsMobileLainnyaOpen(!isMobileLainnyaOpen)}
                                        className={cn(
                                            "flex items-center justify-between w-full text-2xl sm:text-3xl font-black transition-all tracking-tight",
                                            isMobileLainnyaOpen || extraNavLinks.some(l => pathname === l.href) ? "text-blue-600" : "text-slate-400"
                                        )}
                                    >
                                        <span>Lainnya</span>
                                        <ChevronDown className={cn("w-6 h-6 transition-transform", isMobileLainnyaOpen && "rotate-180")} />
                                    </button>
                                    
                                    <AnimatePresence>
                                        {isMobileLainnyaOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden flex flex-col gap-4 pl-4 border-l-2 border-slate-100"
                                            >
                                                {extraNavLinks.map((subLink) => (
                                                    <Link
                                                        key={subLink.name}
                                                        href={subLink.href}
                                                        className={cn(
                                                            "text-xl sm:text-2xl font-black transition-all tracking-tight",
                                                            pathname === subLink.href ? "text-blue-600" : "text-slate-300 hover:text-slate-600"
                                                        )}
                                                    >
                                                        {subLink.name}
                                                    </Link>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </div>

                            <div className="relative z-10 mt-auto pt-8 border-t border-slate-100 flex flex-col gap-4 sm:gap-6">
                                <Link href="/booking">
                                    <Button className="w-full rounded-2xl py-6 sm:py-7 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-[10px] sm:text-xs shadow-xl shadow-blue-200 transition-all active:scale-95">
                                        Booking Sekarang <ChevronRight className="w-4 h-4 ml-1" />
                                    </Button>
                                </Link>
                                <div className="flex items-center gap-3 p-4 sm:p-5 rounded-[24px] bg-slate-50/50 border border-slate-100/80 backdrop-blur-sm">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white shadow-sm flex items-center justify-center shrink-0">
                                        <Phone className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5 truncate">Emergency?</p>
                                        <p className="text-base sm:text-lg font-black text-slate-900 tracking-tight whitespace-nowrap">0812-3456-7890</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </header>
    )
}
