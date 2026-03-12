"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useSidebar } from "@/components/ui/sidebar"
import { Loader2, Save, MessageSquare, Info, RotateCcw, MousePointer2, GripVertical, Check, ChevronDown, Plus, LayoutGrid, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface WhatsAppTemplatesFormProps {
    initialSettings: Record<string, string | null>
}

const DEFAULT_TEMPLATES = {
    wa_template_confirmed: `*KONFIRMASI PESANAN - JAYA ABADI RAJA SERVICE* ❄️\n\nHalo *[NAMA_PELANGGAN]*,\n\nPesanan Anda dengan kode *#[KODE_BOOKING]* telah kami *DIKONFIRMASI*. Terima kasih telah mempercayakan layanan AC Anda kepada kami.\n\n*Detail Pesanan:*\n- Layanan: [LAYANAN]\n- Jadwal: [JADWAL]\n- Jam: [JAM]\n- Alamat: [ALAMAT]\n\n[INFO_TEKNISI]\n\nPantau status pesanan Anda secara real-time di sini:\n🔗 [LINK_TRACKING]\n\nTerima kasih.`,
    wa_template_assigned: `*TEKNISI DITUGASKAN - JAYA ABADI RAJA SERVICE* 🔧\n\nHalo *[NAMA_PELANGGAN]*,\n\nKabar baik! Teknisi *[NAMA_TEKNISI]* telah kami tugaskan untuk menangani pesanan *#[KODE_BOOKING]* Anda. Selanjutnya teknisi kami akan menghubungi Anda untuk konfirmasi waktu kedatangan.\n\n*Kontak Teknisi:*\n📱 [PHONE_TEKNISI][LINK_CHAT_WA]\n\n*Jadwal Kunjungan:*\n- Hari: [JADWAL]\n- Jam: [JAM]\n\nCek profil teknisi & status terbaru di sini:\n🔗 [LINK_TRACKING]\n\nSampai jumpa di lokasi.`,
    wa_template_on_the_way: `*TEKNISI MENUJU LOKASI - JAYA ABADI RAJA SERVICE* 🛵\n\nHalo *[NAMA_PELANGGAN]*,\n\nTeknisi kami sedang dalam perjalanan menuju lokasi Anda untuk pesanan *#[KODE_BOOKING]*. Mohon pastikan ada orang di lokasi saat teknisi tiba.\n\nLacak lokasi teknisi secara real-time di sini:\n🔗 [LINK_TRACKING]\n\nTetap sejuk bersama Jaya Abadi!`,
    wa_template_arrived: `*TEKNISI TELAH TIBA - JAYA ABADI RAJA SERVICE* 📍\n\nHalo *[NAMA_PELANGGAN]*,\n\nTeknisi kami telah sampai di lokasi tujuan untuk pesanan *#[KODE_BOOKING]*. Proses pengerjaan akan segera dimulai.\n\nCek progress pengerjaan di sini:\n🔗 [LINK_TRACKING]\n\nTerima kasih.`,
    wa_template_done: `*PESANAN SELESAI - JAYA ABADI RAJA SERVICE* ✅\n\nHalo *[NAMA_PELANGGAN]*,\n\nSelamat! Pekerjaan untuk pesanan *#[KODE_BOOKING]* telah *SELESAI* dikerjakan. Semoga udara di ruangan Anda kembali sejuk dan nyaman.\n\n*Detail Selesai:*\n- Layanan: [LAYANAN]\n- Tanggal: [TANGGAL_SELESAI]\n\nKami sangat menghargai feedback Anda. Silakan isi ulasan melalui link berikut:\n🔗 [LINK_TRACKING]\n\nTerima kasih telah berlangganan!`,
    wa_template_cancelled: `*PESANAN DIBATALKAN - JAYA ABADI RAJA SERVICE* ❌\n\nHalo *[NAMA_PELANGGAN]*,\n\nKami menginformasikan bahwa pesanan *#[KODE_BOOKING]* Anda telah *DIBATALKAN*.\n\nJika ini adalah kekeliruan atau Anda ingin menjadwalkan ulang, silakan hubungi admin kami atau buat pesanan baru di website.\n\nDetail lengkap:\n🔗 [LINK_TRACKING]\n\nSalam, Jaya Abadi Raja Service.`
}

const PLACEHOLDERS = [
    { code: "[NAMA_PELANGGAN]", desc: "Nama pemesan" },
    { code: "[KODE_BOOKING]", desc: "Kode pesanan" },
    { code: "[LAYANAN]", desc: "Nama jasa/servis" },
    { code: "[JADWAL]", desc: "Hari & Tanggal" },
    { code: "[JAM]", desc: "Waktu/Jam" },
    { code: "[ALAMAT]", desc: "Alamat lengkap" },
    { code: "[LINK_TRACKING]", desc: "Link pelacakan" },
    { code: "[NAMA_TEKNISI]", desc: "Nama teknisi" },
    { code: "[PHONE_TEKNISI]", desc: "No HP teknisi" },
    { code: "[LINK_CHAT_WA]", desc: "Link wa.me teknisi" },
    { code: "[INFO_TEKNISI]", desc: "Detail penugasan" },
    { code: "[TANGGAL_SELESAI]", desc: "Tanggal pengerjaan" },
]

export default function WhatsAppTemplatesForm({ initialSettings }: WhatsAppTemplatesFormProps) {
    const router = useRouter()
    const { isMobile } = useSidebar()
    const [isSaving, setIsSaving] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const lastFocusedRef = useRef<{ name: string; element: HTMLTextAreaElement } | null>(null)
    const [isOpen, setIsOpen] = useState(true)

    useEffect(() => {
        // In this admin layout, the scrollable element is the 'main' tag
        const scrollContainer = document.querySelector('main')
        
        const handleScroll = () => {
            if (scrollContainer) {
                setIsScrolled(scrollContainer.scrollTop > 100)
            }
        }

        if (scrollContainer) {
            scrollContainer.addEventListener("scroll", handleScroll)
        } else {
            // Fallback to window just in case
            window.addEventListener("scroll", handleScroll)
        }

        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener("scroll", handleScroll)
            }
            window.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const { register, handleSubmit, setValue, getValues } = useForm({
        defaultValues: {
            wa_template_confirmed: initialSettings.wa_template_confirmed || DEFAULT_TEMPLATES.wa_template_confirmed,
            wa_template_assigned: initialSettings.wa_template_assigned || DEFAULT_TEMPLATES.wa_template_assigned,
            wa_template_on_the_way: initialSettings.wa_template_on_the_way || DEFAULT_TEMPLATES.wa_template_on_the_way,
            wa_template_arrived: initialSettings.wa_template_arrived || DEFAULT_TEMPLATES.wa_template_arrived,
            wa_template_done: initialSettings.wa_template_done || DEFAULT_TEMPLATES.wa_template_done,
            wa_template_cancelled: initialSettings.wa_template_cancelled || DEFAULT_TEMPLATES.wa_template_cancelled,
        }
    })

    async function onSubmit(data: any) {
        setIsSaving(true)
        try {
            const payload = Object.entries(data).map(([key, value]) => ({
                key,
                value: value as string
            }))

            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) throw new Error("Gagal menyimpan template")

            toast.success("Template chat berhasil diperbarui")
            router.refresh()
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    const resetToDefault = (key: keyof typeof DEFAULT_TEMPLATES) => {
        setValue(key, DEFAULT_TEMPLATES[key])
        toast.info("Template dikembalikan ke default")
    }

    const insertTextAtCursor = (name?: string, text?: string, element?: HTMLTextAreaElement) => {
        const target = element || lastFocusedRef.current?.element
        const targetName = name || lastFocusedRef.current?.name

        if (target && targetName && text) {
            const start = target.selectionStart
            const end = target.selectionEnd
            const currentVal = getValues(targetName as any)
            const newVal = currentVal.substring(0, start) + text + currentVal.substring(end)
            
            setValue(targetName as any, newVal)
            
            // Refocus and set cursor position
            setTimeout(() => {
                target.focus()
                target.setSelectionRange(start + text.length, start + text.length)
            }, 0)
        } else if (!target) {
            toast.error("Klik pada kotak pesan terlebih dahulu")
        }
    }

    const handleDragStart = (e: React.DragEvent, code: string) => {
        e.dataTransfer.setData("text/plain", code)
    }

    const handleDrop = (e: React.DragEvent, name: string) => {
        e.preventDefault()
        const code = e.dataTransfer.getData("text/plain")
        if (code) {
            insertTextAtCursor(name, code, e.currentTarget as HTMLTextAreaElement)
        }
    }

    const renderTextarea = (name: string, label: string, color: string, defaultKey: keyof typeof DEFAULT_TEMPLATES) => (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${color}`} />
                    Status: {label}
                </label>
                <Button type="button" variant="ghost" size="sm" onClick={() => resetToDefault(defaultKey)} className="h-8 text-[10px] text-slate-400 hover:text-blue-500">
                    <RotateCcw className="w-3 h-3 mr-1" /> Reset ke Default
                </Button>
            </div>
            <div className="relative group/textarea">
                <Textarea 
                    {...register(name as any)}
                    onFocus={(e) => {
                        lastFocusedRef.current = { name, element: e.currentTarget }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => handleDrop(e, name)}
                    className="rounded-2xl bg-slate-50 min-h-[160px] font-mono text-xs leading-relaxed focus:bg-white transition-all border-slate-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-500/5 selection:bg-blue-100" 
                    placeholder="Tulis template pesan di sini..."
                />
                <div className="absolute bottom-3 right-3 opacity-0 group-focus-within/textarea:opacity-100 transition-opacity pointer-events-none">
                    <MousePointer2 className="w-4 h-4 text-blue-400/50" />
                </div>
            </div>
        </div>
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-10 relative">
            <div className={`sticky top-[-1rem] z-20 -mx-6 px-6 py-4 mb-6 transition-all duration-500 ease-in-out ${isMobile && isScrolled ? "opacity-0 invisible h-0 overflow-hidden pointer-events-none -translate-y-10" : "opacity-100 visible h-auto translate-y-0"}`}>
                <div className="bg-white/80 backdrop-blur-md border-b border-slate-100 p-1 rounded-2xl">
                <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-xl shadow-blue-500/20 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <motion.div 
                                    animate={{ rotate: isOpen ? [0, -10, 10, 0] : 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center"
                                >
                                    <MessageSquare className="w-5 h-5 text-white" />
                                </motion.div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-lg text-white">Placeholder Dinamis</h3>
                                        <Sparkles className="w-4 h-4 text-blue-300 animate-pulse" />
                                    </div>
                                    <p className="text-blue-100 text-xs">Klik / Drag kodenya ke kotak pesan</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden lg:flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-[10px] border border-white/10">
                                    <Info className="w-3.5 h-3.5" />
                                    <span>Memudahkan penulisan template otomatis</span>
                                </div>
                                <CollapsibleTrigger
                                    render={
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20 rounded-lg transition-all duration-300">
                                            <motion.div
                                                animate={{ rotate: isOpen ? 0 : 180 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                            >
                                                <ChevronDown className="w-5 h-5" />
                                            </motion.div>
                                        </Button>
                                    }
                                />
                            </div>
                        </div>

                        <CollapsibleContent
                            render={
                                <motion.div
                                    initial={false}
                                    animate={isOpen ? "open" : "closed"}
                                    variants={{
                                        open: { height: "auto", opacity: 1, marginBottom: 0 },
                                        closed: { height: 0, opacity: 0, marginBottom: -10 }
                                    }}
                                    transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <motion.div 
                                        variants={{
                                            open: { 
                                                transition: { staggerChildren: 0.05, delayChildren: 0.1 }
                                            },
                                            closed: { 
                                                transition: { staggerChildren: 0.03, staggerDirection: -1 }
                                            }
                                        }}
                                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 pt-2"
                                    >
                                        {PLACEHOLDERS.map(p => (
                                            <motion.div 
                                                key={p.code} 
                                                variants={{
                                                    open: { y: 0, opacity: 1, scale: 1 },
                                                    closed: { y: 20, opacity: 0, scale: 0.95 }
                                                }}
                                                whileHover={{ scale: 1.05, y: -2 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="group cursor-primary bg-white/10 hover:bg-white border border-white/10 hover:border-white rounded-xl shadow-sm overflow-hidden"
                                            >
                                                <div 
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, p.code)}
                                                    onClick={() => insertTextAtCursor(undefined, p.code)}
                                                    className="p-2.5 transition-colors duration-200 w-full h-full"
                                                >
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <GripVertical className="w-3 h-3 text-white/50 group-hover:text-blue-500" />
                                                        <code className="text-white font-bold text-[11px] group-hover:text-blue-600 truncate">{p.code}</code>
                                                    </div>
                                                    <span className="text-[10px] text-blue-100 group-hover:text-slate-500 px-5 block truncate">{p.desc}</span>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            }
                        />
                    </div>
                </Collapsible>
                </div>
            </div>

            {/* Mobile Sidebar Trigger (Right Edge Floating) */}
            {isMobile && (
                <div className={`fixed top-1/2 right-0 z-50 transition-all duration-500 transform -translate-y-1/2 ${isScrolled ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}>
                    <Sheet>
                        <SheetTrigger
                            render={
                                <Button className="h-16 w-10 rounded-l-2xl rounded-r-none bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/50 flex flex-col items-center justify-center border-y border-l border-white/20 px-0">
                                    <LayoutGrid className="w-5 h-5 mb-1" />
                                    <span className="text-[8px] font-bold uppercase tracking-tighter [writing-mode:vertical-lr]">Codes</span>
                                </Button>
                            }
                        />
                        <SheetContent side="right" className="w-[85%] sm:max-w-xs p-0 bg-slate-50 border-none shadow-2xl flex flex-col">
                            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white shrink-0">
                                <SheetHeader className="p-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <SheetTitle className="text-lg font-bold text-white">Placeholder</SheetTitle>
                                            <p className="text-[10px] text-blue-100 italic">Tap to insert at cursor</p>
                                        </div>
                                    </div>
                                </SheetHeader>
                            </div>

                                <div className="flex-1 overflow-y-auto p-4">
                                    <motion.div 
                                        initial="hidden"
                                        animate="visible"
                                        variants={{
                                            visible: { transition: { staggerChildren: 0.05 } }
                                        }}
                                        className="grid grid-cols-1 gap-2.5"
                                    >
                                        {PLACEHOLDERS.map(p => (
                                            <motion.button
                                                key={p.code}
                                                variants={{
                                                    hidden: { x: 20, opacity: 0 },
                                                    visible: { x: 0, opacity: 1 }
                                                }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={() => insertTextAtCursor(undefined, p.code)}
                                                className="group flex flex-col items-start p-3 bg-white border border-slate-100 rounded-xl text-left transition-all shadow-sm active:bg-blue-600 active:border-blue-600"
                                            >
                                                <code className="text-blue-600 font-bold text-xs mb-0.5 group-active:text-white">{p.code}</code>
                                                <span className="text-[10px] text-slate-400 group-active:text-blue-50">{p.desc}</span>
                                            </motion.button>
                                        ))}
                                    </motion.div>
                                </div>
                            
                            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
                                <p className="text-[10px] text-slate-400 text-center">Tarik atau klik kode untuk otomatis masuk ke pesan</p>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            )}

            <div className="grid grid-cols-1 gap-8">
                {renderTextarea("wa_template_confirmed", "DIKONFIRMASI (CONFIRMED)", "bg-blue-500", "wa_template_confirmed")}
                {renderTextarea("wa_template_assigned", "TEKNISI DITUGASKAN (ASSIGNED)", "bg-orange-500", "wa_template_assigned")}
                {renderTextarea("wa_template_on_the_way", "MENUJU LOKASI (ON_THE_WAY)", "bg-purple-500", "wa_template_on_the_way")}
                {renderTextarea("wa_template_arrived", "SAMPAI DI TUJUAN (ARRIVED)", "bg-cyan-500", "wa_template_arrived")}
                {renderTextarea("wa_template_done", "SELESAI (DONE)", "bg-green-500", "wa_template_done")}
                {renderTextarea("wa_template_cancelled", "DIBATALKAN (CANCELLED)", "bg-red-500", "wa_template_cancelled")}
            </div>

            <div className="pt-8 border-t border-slate-100 flex justify-end">
                <Button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 rounded-2xl shadow-xl shadow-blue-500/30 font-bold text-base transition-all hover:scale-[1.02] active:scale-95 group"
                >
                    {isSaving ? (
                        <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    ) : (
                        <div className="flex items-center">
                            <Save className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                            Simpan Semua Template
                        </div>
                    )}
                </Button>
            </div>
        </form>
    )
}
