'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    Calendar,
    User,
    MapPin,
    ChevronRight,
    ChevronLeft,
    Clock,
    Zap,
    Settings,
    Thermometer,
    MessageSquare,
    Check,
    ShieldCheck,
    Phone,
    Info,
    ArrowRight,
    Search,
    Navigation2,
    Loader2
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createBooking } from "@/app/(frontend)/booking/booking-actions"
import Link from 'next/link'

interface Service {
    id: string
    nama: string
    hargaMulai: number
    gambar: string | null
}

interface BookingClientProps {
    layanan: Service[]
    waNumber: string
    initialServiceId?: string
}

const steps = [
    { id: 1, title: 'Layanan', icon: Settings, desc: 'Pilih jenis jasa' },
    { id: 2, title: 'Informasi', icon: User, desc: 'Data diri & alamat' },
    { id: 3, title: 'Jadwal', icon: Calendar, desc: 'Kapan kami datang?' },
    { id: 4, title: 'Selesai', icon: CheckCircle2, desc: 'Konfirmasi akhir' },
]

export default function BookingClient({ layanan, waNumber, initialServiceId }: BookingClientProps) {
    const [step, setStep] = useState(initialServiceId ? 2 : 1)
    const [loading, setLoading] = useState(false)
    const [detecting, setDetecting] = useState(false)
    const [formData, setFormData] = useState({
        layananId: initialServiceId || '',
        name: '',
        phone: '',
        address: '',
        latitude: null as number | null,
        longitude: null as number | null,
        mapsLink: '',
        merekAc: '',
        kapasitasAc: '',
        jumlahUnit: '1',
        keluhan: '',
        tanggal: '',
        waktu: ''
    })

    const selectedService = layanan.find(l => l.id === formData.layananId)

    const updateFormData = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const detectLocation = () => {
        if (!navigator.geolocation) {
            return toast.error("Browser Anda tidak mendukung deteksi lokasi")
        }

        setDetecting(true)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords
                
                // Generate Maps Link
                const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`
                
                setFormData(prev => ({
                    ...prev,
                    latitude,
                    longitude,
                    mapsLink
                }))

                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18`)
                    const data = await res.json()
                    if (data && data.display_name) {
                        updateFormData('address', data.display_name)
                        toast.success("Lokasi & Koordinat berhasil dideteksi!")
                    } else {
                        toast.warning("Koordinat didapat, tapi gagal mendapatkan nama alamat jalan.")
                    }
                } catch (error) {
                    console.error("Geocoding error:", error)
                    toast.warning("Koordinat didapat (GPS), tapi gagal menghubungi server alamat.")
                } finally {
                    setDetecting(false)
                }
            },
            (error) => {
                setDetecting(false)
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error("Izin lokasi ditolak. Aktifkan GPS di browser Anda.")
                        break
                    case error.POSITION_UNAVAILABLE:
                        toast.error("Informasi lokasi tidak tersedia")
                        break
                    case error.TIMEOUT:
                        toast.error("Waktu deteksi lokasi habis")
                        break
                    default:
                        toast.error("Terjadi kesalahan mendeteksi lokasi")
                }
            },
            { enableHighAccuracy: true, timeout: 10000 }
        )
    }

    const nextStep = () => {
        if (step === 1 && !formData.layananId) return toast.error("Pilih layanan terlebih dahulu")
        if (step === 2 && (!formData.name || !formData.phone || !formData.address)) return toast.error("Lengkapi data diri Anda")
        if (step === 3 && (!formData.tanggal || !formData.waktu)) return toast.error("Tentukan jadwal kunjungan")
        setStep(prev => prev + 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const prevStep = () => {
        setStep(prev => prev - 1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleSubmit = async () => {
        setLoading(true)
        const res = await createBooking(formData)
        if (res.success && res.booking) {
            toast.success("Booking berhasil dibuat!")
            const bookingCode = res.booking.kodeBooking
            const serviceName = res.booking.layanan?.nama || selectedService?.nama || "Servis AC"
            const msg = `Halo Jaya Abadi Raja Service,%0A%0ASaya ingin konfirmasi booking service AC:%0A%0A*Kode Booking:* ${bookingCode}%0A*Layanan:* ${serviceName}%0A*Atas Nama:* ${formData.name}%0A*Jadwal:* ${formData.tanggal} pukul ${formData.waktu}%0A*Alamat:* ${formData.address}%0A%0A_Mohon bantuan tindak lanjutnya, terima kasih._`
            window.location.href = `https://wa.me/${waNumber}?text=${msg}`
        }
    }

    const DesktopProgress = (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="space-y-8">
                {steps.map((s, idx) => {
                    const Icon = s.icon
                    const isActive = step === s.id
                    const isDone = step > s.id
                    return (
                        <div key={s.id} className="flex gap-5 relative">
                            {idx !== steps.length - 1 && (
                                <div className={`absolute left-6 top-12 bottom-[-20px] w-0.5 ${isDone ? 'bg-blue-600' : 'bg-slate-100'}`} />
                            )}
                            <motion.div 
                                animate={{ 
                                    scale: isActive ? 1.1 : 1,
                                    backgroundColor: isDone || isActive ? '#2563eb' : '#f8fafc',
                                    color: isDone || isActive ? '#fff' : '#94a3b8'
                                }}
                                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm border ${isDone || isActive ? 'border-blue-600' : 'border-slate-100'}`}
                            >
                                {isDone ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                            </motion.div>
                            <div className="flex flex-col justify-center">
                                <p className={`text-[10px] font-black uppercase tracking-widest ${isActive ? 'text-blue-600' : 'text-slate-400'}`}>Step 0{s.id}</p>
                                <h4 className={`text-sm font-black uppercase tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-400'}`}>{s.title}</h4>
                                <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{s.desc}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

    const MobileProgress = (
        <div className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                    {React.createElement(steps[step-1]?.icon || steps[0].icon, { className: "w-5 h-5 flex-shrink-0" })}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Step 0{step} / 04</p>
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none mt-0.5">{steps[step-1]?.title || ''}</h4>
                </div>
            </div>
            
            <div className="flex gap-1 pr-2">
                {steps.map(s => (
                    <div key={s.id} className={`h-1.5 rounded-full transition-all duration-500 ${step === s.id ? 'w-6 bg-blue-600' : step > s.id ? 'w-3 bg-blue-600/40' : 'w-3 bg-slate-100'}`} />
                ))}
            </div>
        </div>
    )

    const SelectedServiceCardProps = initialServiceId && selectedService ? (
        <div className="bg-blue-600 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
                <Badge className="bg-white/20 text-white border-0 hover:bg-white/20 px-3 py-1 font-black uppercase tracking-widest text-[9px] mb-1">Layanan Terpilih</Badge>
                <h4 className="text-xl font-black uppercase tracking-tighter leading-none">{selectedService.nama}</h4>
                <p className="text-blue-100 text-[11px] sm:text-xs font-medium">Mulai Dari Rp {selectedService.hargaMulai.toLocaleString('id-ID')}</p>
            </div>
        </div>
    ) : null

    const TrackingCardProps = (
        <Link href="/booking/track" className="block group">
            <div className="bg-slate-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] text-white overflow-hidden relative shadow-2xl shadow-slate-900/40">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                    <Search className="w-24 h-24" />
                </div>
                <div className="relative z-10 space-y-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter leading-none">Sudah Booking?</h4>
                    <p className="text-slate-400 text-[11px] sm:text-xs font-medium leading-relaxed">Lacak status pesanan Anda secara real-time di sini.</p>
                    <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px] pt-2">
                        Lacak Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    )

    const HelpCardProps = (
        <div className="p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-blue-50 border border-blue-100 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Phone className="w-5 h-5" />
                </div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Butuh Bantuan Cepat?</p>
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
                CS Kami siap membantu via telepon atau WhatsApp selama jam operasional (08:00 - 17:00).
            </p>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-6">
            
            {/* MOBILE ONLY: Top Content */}
            <div className="block lg:hidden w-full mb-6 space-y-3 px-2 sm:px-0">
                {MobileProgress}
                {SelectedServiceCardProps}
            </div>

            <div className="flex flex-col lg:flex-row gap-0 sm:gap-12">
                {/* DESKTOP ONLY: Left Sidebar */}
                <div className="hidden lg:block lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-8 order-2 lg:order-1">
                    {DesktopProgress}
                    {SelectedServiceCardProps}
                    {TrackingCardProps}
                    {HelpCardProps}
                </div>

                {/* Right Side - Form Content */}
                <div className="lg:w-2/3 order-1 lg:order-2">
                    <div className="bg-white p-5 sm:p-14 rounded-[32px] sm:rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[600px] flex flex-col relative overflow-hidden">
                        {/* Glassmorphism Accents */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />

                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-10 flex-1 relative z-10"
                                >
                                    <div className="space-y-4">
                                        <Badge className="bg-blue-600 text-white border-0 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[9px]">Layanan</Badge>
                                        <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Pilih <span className="text-blue-600">Layanan</span> Anda</h2>
                                        <p className="text-slate-500 text-base font-medium">Solusi perawatan AC profesional untuk kenyamanan maksimal Anda.</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 sm:gap-5">
                                        {layanan.map((l) => (
                                            <button
                                                key={l.id}
                                                onClick={() => updateFormData('layananId', l.id)}
                                                className={`rounded-[24px] sm:rounded-[32px] text-left transition-all border-2 overflow-hidden flex flex-col group h-full relative ${formData.layananId === l.id
                                                        ? 'border-blue-600 bg-blue-50/30 shadow-lg shadow-blue-600/10'
                                                        : 'border-slate-50 bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-slate-200/50'
                                                    }`}
                                            >
                                                {/* Card Image Area */}
                                                <div className="h-28 sm:h-40 w-full relative overflow-hidden bg-slate-100">
                                                    {l.gambar ? (
                                                        <img
                                                            src={l.gambar}
                                                            alt={l.nama}
                                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                                                            <Zap className="w-8 h-8 sm:w-10 sm:h-10 text-slate-300" />
                                                        </div>
                                                    )}

                                                    {/* Gradient Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />

                                                    {/* Top Right Indicator */}
                                                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                                                        <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all bg-white/90 backdrop-blur-sm ${formData.layananId === l.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-300'
                                                            }`}>
                                                            {formData.layananId === l.id && <Check className="w-3 h-3 sm:w-4 sm:h-4" />}
                                                        </div>
                                                    </div>

                                                    {/* Badge Overlay */}
                                                    <div className="absolute left-3 bottom-3 sm:left-4 sm:bottom-4 z-10">
                                                        <Badge className="bg-white/90 text-slate-900 border-0 uppercase tracking-widest text-[7px] sm:text-[8px] font-black pointer-events-none hover:bg-white/90 backdrop-blur-sm shadow-sm px-2 py-0.5">
                                                            Tersedia
                                                        </Badge>
                                                    </div>
                                                </div>

                                                {/* Content Area */}
                                                <div className="p-4 sm:p-6 md:p-8 flex flex-col justify-between flex-1">
                                                    <div>
                                                        <h4 className={`font-black uppercase tracking-tight text-[11px] sm:text-lg leading-tight mb-1 sm:mb-2 transition-colors ${formData.layananId === l.id ? 'text-blue-600' : 'text-slate-800 group-hover:text-blue-600'}`}>
                                                            {l.nama}
                                                        </h4>
                                                    </div>

                                                    <div className="mt-4 sm:mt-8 flex justify-between items-end">
                                                        <div>
                                                            <p className="text-[8px] sm:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5 sm:mb-1">Mulai Dari</p>
                                                            <p className="text-sm sm:text-xl font-black text-slate-900 tracking-tighter">Rp {l.hargaMulai.toLocaleString('id-ID')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-10 flex-1 relative z-10"
                                >
                                    <div className="space-y-4">
                                        <Badge className="bg-blue-600 text-white border-0 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[9px]">Informasi</Badge>
                                        <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Detail <span className="text-blue-600">Pelanggan</span></h2>
                                        <p className="text-slate-500 text-base font-medium">Bantu kami mengenal Anda dan menemukan lokasi dengan tepat.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                                    <User className="w-3.5 h-3.5" /> Nama Lengkap <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    placeholder="Tulis nama lengkap Anda..."
                                                    value={formData.name}
                                                    onChange={(e) => updateFormData('name', e.target.value)}
                                                    className="rounded-2xl h-14 border-slate-100 bg-slate-50 focus:bg-white focus:ring-blue-600/20 px-6 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                                    <Zap className="w-3.5 h-3.5" /> WhatsApp / HP <span className="text-red-500">*</span>
                                                </label>
                                                <Input
                                                    placeholder="08XXXXXXXXXX"
                                                    value={formData.phone}
                                                    onChange={(e) => updateFormData('phone', e.target.value)}
                                                    className="rounded-2xl h-14 border-slate-100 bg-slate-50 focus:bg-white px-6 font-bold"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1 mb-2">
                                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                                                        <MapPin className="w-3.5 h-3.5" /> Alamat Lengkap <span className="text-red-500">*</span>
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={detectLocation}
                                                        disabled={detecting}
                                                        className="group flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-full transition-all duration-300 disabled:opacity-50 active:scale-95 border border-blue-100/50 self-end sm:self-auto"
                                                    >
                                                        {detecting ? (
                                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                        ) : (
                                                            <div className="bg-blue-600 text-white rounded-full p-1 shadow-sm group-hover:scale-110 transition-transform">
                                                                <Navigation2 className="w-2.5 h-2.5" />
                                                            </div>
                                                        )}
                                                        <span className="text-[9px] font-black uppercase tracking-widest leading-none mt-[1px]">
                                                            {detecting ? "Mencari GPS..." : "Dapatkan Lokasi"}
                                                        </span>
                                                    </button>
                                                </div>
                                                <Textarea
                                                    placeholder="Tulis alamat, perumahan, nomor rumah, dan patokan..."
                                                    value={formData.address}
                                                    onChange={(e) => updateFormData('address', e.target.value)}
                                                    className="rounded-2xl min-h-[140px] border-slate-100 bg-slate-50 focus:bg-white px-6 py-4 font-bold"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="p-8 rounded-[40px] bg-slate-900 text-white space-y-6 shadow-xl relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-6 transition-transform">
                                                    <ShieldCheck className="w-32 h-32" />
                                                </div>
                                                <div className="relative z-10 space-y-6">
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 flex items-center gap-2">
                                                        <Thermometer className="w-4 h-4" /> Spesifikasi Unit
                                                    </p>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase opacity-50">Merek AC</label>
                                                            <Input
                                                                placeholder="Daikin.."
                                                                value={formData.merekAc}
                                                                onChange={(e) => updateFormData('merekAc', e.target.value)}
                                                                className="rounded-xl border-white/10 bg-white/5 text-white placeholder:text-white/20 h-12"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[9px] font-bold uppercase opacity-50">Kapasitas</label>
                                                            <Input
                                                                placeholder="1/2 PK.."
                                                                value={formData.kapasitasAc}
                                                                onChange={(e) => updateFormData('kapasitasAc', e.target.value)}
                                                                className="rounded-xl border-white/10 bg-white/5 text-white h-12"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-bold uppercase opacity-50">Jumlah Unit</label>
                                                        <Input
                                                            type="number"
                                                            placeholder="1"
                                                            value={formData.jumlahUnit}
                                                            onChange={(e) => updateFormData('jumlahUnit', e.target.value)}
                                                            className="rounded-xl border-white/10 bg-white/5 text-white h-12"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-bold uppercase opacity-50">Keluhan</label>
                                                        <Textarea
                                                            placeholder="Misal: AC Kurang Dingin.."
                                                            value={formData.keluhan}
                                                            onChange={(e) => updateFormData('keluhan', e.target.value)}
                                                            className="rounded-xl border-white/10 bg-white/5 text-white h-24 text-xs"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-10 flex-1 relative z-10"
                                >
                                    <div className="space-y-4">
                                        <Badge className="bg-blue-600 text-white border-0 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[9px]">Waktu</Badge>
                                        <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Pilih <span className="text-blue-600">Jadwal</span></h2>
                                        <p className="text-slate-500 text-base font-medium">Tentukan waktu yang paling sesuai untuk Anda agar kami dapat mengatur tim teknisi.</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">1. Pilih Tanggal Kedatangan</label>
                                            <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                                                <Calendar className="w-8 h-8 text-blue-600 mb-6" />
                                                <input
                                                    type="date"
                                                    min={new Date().toISOString().split('T')[0]}
                                                    value={formData.tanggal}
                                                    onChange={(e) => updateFormData('tanggal', e.target.value)}
                                                    className="w-full h-16 rounded-2xl bg-white border-2 border-slate-100 px-6 font-black text-lg text-slate-800 focus:border-blue-600 outline-none transition-all shadow-sm"
                                                />
                                                <p className="text-[10px] text-slate-400 font-bold uppercase mt-4 italic">* Hari Libur Tetap Melayani</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block px-2">2. Pilih Sesi Waktu</label>
                                            <div className="grid grid-cols-1 gap-3">
                                                {[
                                                    { time: '08:00 - 10:00', label: 'Pagi Hari' },
                                                    { time: '10:00 - 12:00', label: 'Siang Hari' },
                                                    { time: '13:00 - 15:00', label: 'Siang Hari' },
                                                    { time: '15:00 - 17:00', label: 'Sore Hari' }
                                                ].map((s) => (
                                                    <button
                                                        key={s.time}
                                                        onClick={() => updateFormData('waktu', s.time)}
                                                        className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between group shadow-sm ${formData.waktu === s.time
                                                                ? 'bg-blue-600 border-blue-600 text-white shadow-blue-200'
                                                                : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'
                                                            }`}
                                                    >
                                                        <div className="text-left font-black tracking-tight">
                                                            <p className={`text-base leading-none ${formData.waktu === s.time ? 'text-white' : 'text-slate-900'}`}>{s.time}</p>
                                                            <p className={`text-[10px] uppercase mt-1 ${formData.waktu === s.time ? 'text-blue-100' : 'text-slate-400'}`}>{s.label}</p>
                                                        </div>
                                                        <Clock className={`w-5 h-5 ${formData.waktu === s.time ? 'text-white' : 'text-slate-100 group-hover:text-blue-200'}`} />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-10 flex-1 relative z-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto"
                                >
                                    <div className="w-24 h-24 rounded-[32px] bg-green-100 text-green-600 flex items-center justify-center shadow-xl mb-6">
                                        <CheckCircle2 className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-4xl font-black tracking-tighter uppercase leading-none">Semua <span className="text-blue-600">Selesai!</span></h2>
                                        <p className="text-slate-500 text-base font-medium">Mohon periksa kembali detail pesanan Anda sebelum kami proses.</p>
                                    </div>

                                    <div className="w-full bg-slate-50 rounded-[40px] p-8 space-y-6 mt-6 text-left border border-slate-100">
                                        <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Layanan</span>
                                            <span className="text-xs font-black text-blue-600 uppercase italic">{selectedService?.nama}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-3 border-b border-slate-200/50">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pelanggan</span>
                                            <span className="text-xs font-black text-slate-900 uppercase">{formData.name}</span>
                                        </div>
                                        <div className="flex justify-between items-start py-3 border-b border-slate-200/50">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Jadwal</span>
                                            <div className="text-right">
                                                <span className="block text-xs font-black text-slate-900 uppercase">
                                                    {formData.tanggal ? new Date(formData.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                                                </span>
                                                <span className="text-[10px] font-bold text-blue-600 block mt-0.5">{formData.waktu}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-start py-3">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alamat</span>
                                            <span className="text-xs font-medium text-slate-600 text-right max-w-[200px] italic">{formData.address}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl text-left border border-blue-100/50">
                                        <Info className="w-5 h-5 text-blue-600 shrink-0" />
                                        <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed">
                                            Kami akan mengirimkan rincian ini via <span className="text-blue-600 font-black">WHATSAPP</span> agar admin kami dapat segera mengkonfirmasi ketersediaan armada.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Footer - Control Buttons */}
                        <div className="mt-16 pt-10 border-t border-slate-100 flex justify-between items-center relative z-10">
                            {step > (initialServiceId ? 2 : 1) ? (
                                <Button
                                    variant="ghost"
                                    onClick={prevStep}
                                    disabled={loading}
                                    className="rounded-[20px] px-8 h-12 uppercase font-black tracking-widest text-[10px] text-slate-400 hover:text-slate-900 hover:bg-slate-50"
                                >
                                    <ChevronLeft className="w-4 h-4 mr-2" /> Kembali
                                </Button>
                            ) : <div />}

                            <div className="flex gap-4">
                                {step < 4 ? (
                                    <Button
                                        onClick={nextStep}
                                        className="rounded-[20px] px-12 h-14 bg-slate-900 text-white hover:bg-black uppercase font-black tracking-widest text-[11px] shadow-2xl shadow-slate-200"
                                    >
                                        Langkah Selanjutnya <ChevronRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="rounded-[24px] px-16 h-16 bg-blue-600 text-white hover:bg-blue-700 uppercase font-black tracking-[0.1em] text-xs shadow-2xl shadow-blue-300 transition-all hover:-translate-y-1 hover:shadow-blue-400/50"
                                    >
                                        {loading ? "Sedang Memproses..." : "Konfirmasi & Kirim"}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* MOBILE ONLY: Bottom Content */}
                    <div className="block lg:hidden w-full mt-6 space-y-3 px-2 sm:px-0">
                        {TrackingCardProps}
                        {HelpCardProps}
                    </div>

                    {/* Footer Info Box */}
                    <div className="mt-8 flex flex-wrap justify-center gap-10">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pasti Dingin</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Teknisi Ahli</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="w-5 h-5 text-blue-600" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Harga Jujur</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
