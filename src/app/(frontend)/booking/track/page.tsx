'use client'

import React, { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import Pusher from 'pusher-js'
import { 
    Search, 
    ArrowLeft, 
    Package, 
    CheckCircle2, 
    Clock, 
    Truck, 
    UserCheck, 
    User,
    MapPin,
    Phone,
    Zap,
    ChevronRight,
    Loader2,
    Calendar,
    Settings,
    ShieldCheck,
    MessageSquare,
    Navigation2,
    Info
} from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getBookingStatus } from "@/app/(frontend)/booking/booking-actions"
import { toast } from "sonner"
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'

// Dynamic import for Leaflet to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false })

// Helper to fix Leaflet marker icons in Next.js
import 'leaflet/dist/leaflet.css'

const statusSteps = [
    { status: 'PENDING_WA', label: 'Menunggu Konfirmasi', icon: MessageSquare, desc: 'Pesanan Anda telah diterima dan menunggu konfirmasi via WhatsApp.' },
    { status: 'CONFIRMED', label: 'Terkonfirmasi', icon: CheckCircle2, desc: 'Pesanan telah dikonfirmasi oleh admin kami.' },
    { status: 'ASSIGNED', label: 'Teknisi Ditugaskan', icon: UserCheck, desc: 'Teknisi ahli telah ditugaskan untuk pesanan Anda.' },
    { status: 'ON_THE_WAY', label: 'Sedang Menuju Lokasi', icon: Truck, desc: 'Teknisi sedang dalam perjalanan ke lokasi Anda.' },
    { status: 'ARRIVED', label: 'Tiba di Lokasi', icon: MapPin, desc: 'Teknisi telah sampai di lokasi tujuan.' },
    { status: 'IN_PROGRESS', label: 'Dalam Pengerjaan', icon: Settings, desc: 'Teknisi sedang melakukan pengerjaan unit AC Anda.' },
    { status: 'DONE', label: 'Selesai', icon: Package, desc: 'Pengerjaan telah selesai dilakukan.' },
]

function TrackContent() {
    const searchParams = useSearchParams()
    const [kodeBooking, setKodeBooking] = useState(searchParams.get('code') || '')
    const [phone, setPhone] = useState(searchParams.get('phone') || '')
    const [booking, setBooking] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)
    const [location, setLocation] = useState<any>(null)
    const [isLeafletReady, setIsLeafletReady] = useState(false)

    useEffect(() => {
        setIsLeafletReady(true)
        // Register Service Worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js').then(reg => {
                console.log('SW Registered', reg)
            }).catch(err => {
                console.error('SW Registration failed', err)
            })
        }
    }, [])

    // Real-time Status Update via Pusher
    useEffect(() => {
        if (!booking?.id) return

        const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
            cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
        })

        const channel = pusher.subscribe(`booking-${booking.id}`)
        channel.bind('status-updated', (data: any) => {
            console.log("Real-time status updated:", data)
            setBooking((prev: any) => ({
                ...prev,
                status: data.status
            }))
            
            // Play notification sound
            const audio = new Audio('/sounds/notification.mp3')
            audio.play().catch(e => console.log("Sound play error (interaction required):", e))
            
            toast.success(`Status Pesanan #${data.kodeBooking} diperbarui menjadi ${data.status.replace('_', ' ')}!`)
        })

        return () => {
            channel.unbind_all()
            channel.unsubscribe()
        }
    }, [booking?.id])

    // Push Notification Registration Helper
    const subscribeToPush = async (bookingId: string) => {
        if (!('serviceWorker' in navigator)) return
        
        try {
            const registration = await navigator.serviceWorker.ready
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            })

            // Kirim subscription ke backend
            const subscriptionData = JSON.parse(JSON.stringify(subscription))
            await fetch('/api/push/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bookingId,
                    subscription: subscriptionData
                })
            })
            
            return true
        } catch (e) {
            console.error("Push subscribe error:", e)
            return false
        }
    }

    // Poll for location if technician is on the way
    useEffect(() => {
        let interval: NodeJS.Timeout
        if (booking?.status === 'ON_THE_WAY') {
            const fetchLocation = async () => {
                try {
                    const res = await fetch(`/api/teknisi/location/${booking.id}`)
                    if (res.ok) {
                        const data = await res.json()
                        setLocation(data)
                    }
                } catch (e) {
                    console.error("Poller error:", e)
                }
            }
            fetchLocation()
            interval = setInterval(fetchLocation, 10000) // Poll every 10 seconds
        }
        return () => clearInterval(interval)
    }, [booking])

    const performSearch = async (c: string, p: string) => {
        if (!c.trim() || !p.trim()) return

        setLoading(true)
        const res = await getBookingStatus(c, p)
        setLoading(false)
        setHasSearched(true)

        if (res.success) {
            setBooking(res.booking)
            if ("Notification" in window && res.booking) {
                const bookingId = res.booking.id
                if (Notification.permission === "default") {
                    Notification.requestPermission().then(permission => {
                        if (permission === 'granted') {
                            subscribeToPush(bookingId)
                            toast.success("Notifikasi aktif! Anda akan dikabari jika status berubah.")
                        }
                    })
                } else if (Notification.permission === "granted") {
                    subscribeToPush(bookingId)
                }
            }
        } else {
            setBooking(null)
            toast.error(res.error)
        }
    }

    // Auto-search if params provided
    useEffect(() => {
        const codeParam = searchParams.get('code')
        const phoneParam = searchParams.get('phone')
        if (codeParam && phoneParam && !hasSearched) {
            performSearch(codeParam, phoneParam)
        }
    }, [searchParams])

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!kodeBooking.trim() || !phone.trim()) {
            return toast.error("Lengkapi Kode Booking dan Nomor HP")
        }
        performSearch(kodeBooking, phone)
    }

    const currentStatusIndex = booking ? statusSteps.findIndex(s => s.status === booking.status) : -1

    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4 sm:px-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-400/5 blur-[120px] rounded-full -translate-x-1/2 translate-y-1/2 pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 relative z-50">
                    <div className="space-y-4">
                        <Link href="/booking" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase tracking-widest text-[10px] transition-colors group relative z-50 py-2">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Booking
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase leading-none text-slate-900 mt-2">
                            Lacak <span className="text-blue-600">Pesanan</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg max-w-lg">Cek status pengerjaan AC Anda secara real-time dengan praktis.</p>
                    </div>
                </div>

                {/* Search Box */}
                <div className="bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 mb-12 translate-y-0 group hover:-translate-y-1 transition-all duration-500">
                    <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6">
                        <div className="lg:col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                <Package className="w-3.5 h-3.5" /> Kode Booking
                            </label>
                            <Input 
                                placeholder="CONTOH: JA-20240311-0001" 
                                value={kodeBooking}
                                onChange={(e) => setKodeBooking(e.target.value)}
                                className="rounded-2xl h-14 border-slate-100 bg-white shadow-sm focus:ring-blue-600/20 font-black uppercase tracking-wider"
                            />
                        </div>
                        <div className="lg:col-span-3 space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 px-1">
                                <Phone className="w-3.5 h-3.5" /> Nomor HP Terdaftar
                            </label>
                            <Input 
                                placeholder="08XXXXXXXXXX" 
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="rounded-2xl h-14 border-slate-100 bg-white shadow-sm focus:ring-blue-600/20 font-bold"
                            />
                        </div>
                        <div className="lg:col-span-1 flex items-end">
                            <Button 
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 transition-all font-black uppercase tracking-widest text-xs"
                            >
                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Results Section */}
                <AnimatePresence mode="wait">
                    {booking ? (
                        <motion.div 
                            key="status-result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            {/* Summary Card */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="md:col-span-2 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-6 transition-transform">
                                        <ShieldCheck className="w-48 h-48" />
                                    </div>
                                    <div className="relative z-10 grid grid-cols-2 gap-8">
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Kode Booking</p>
                                            <h3 className="text-2xl font-black tracking-tight">{booking.kodeBooking}</h3>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Status Saat Ini</p>
                                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 font-black uppercase tracking-widest text-[9px] px-3 py-1">
                                                {statusSteps.find(s => s.status === booking.status)?.label || booking.status}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Layanan</p>
                                            <h4 className="text-sm font-bold uppercase">{booking.layanan?.nama || 'Servis AC'}</h4>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Jadwal Visit</p>
                                            <h4 className="text-sm font-bold uppercase">
                                                {format(new Date(booking.jadwalTanggal), 'dd MMMM yyyy', { locale: id })}
                                                <span className="block text-[10px] opacity-60 italic mt-0.5">{booking.jadwalWaktu}</span>
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-white rounded-[40px] p-10 border border-slate-100 shadow-xl flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
                                        <Zap className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Unit AC</p>
                                        <h4 className="text-sm font-black text-slate-900 uppercase">{booking.merekAc || '-'} {booking.kapasitasAc || '-'}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">{booking.jumlahUnit} Unit Terdaftar</p>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Page */}
                            <div className="bg-white rounded-[48px] p-8 md:p-14 border border-slate-100 shadow-2xl shadow-slate-200/50">
                                <div className="mb-12">
                                    <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Timeline <span className="text-blue-600">Progress</span></h3>
                                    <p className="text-slate-400 text-sm font-medium uppercase tracking-tight mt-1">Pantau perjalanan teknisi kami</p>
                                </div>

                                <div className="relative">
                                    <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-0.5 bg-slate-100 hidden md:block" />
                                    
                                    <div className="space-y-12">
                                        {statusSteps.map((s, idx) => {
                                            const isCompleted = idx < currentStatusIndex || booking.status === s.status
                                            const isCurrent = booking.status === s.status
                                            const Icon = s.icon

                                            return (
                                                <div key={idx} className={`relative flex items-center md:justify-center ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                                                    <div className="md:absolute md:left-1/2 md:-translate-x-1/2 z-10 flex flex-col items-center">
                                                        <motion.div 
                                                            initial={false}
                                                            animate={{ 
                                                                scale: isCurrent ? 1.2 : 1,
                                                                backgroundColor: isCompleted ? '#2563eb' : '#f1f5f9',
                                                                color: isCompleted ? '#fff' : '#94a3b8'
                                                            }}
                                                            className={`w-12 h-12 rounded-[18px] flex items-center justify-center shadow-lg border-4 border-white shrink-0`}
                                                        >
                                                            <Icon className="w-5 h-5" />
                                                        </motion.div>
                                                        {isCurrent && (
                                                            <motion.div 
                                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                                                transition={{ repeat: Infinity, duration: 2 }}
                                                                className="absolute w-12 h-12 bg-blue-600/30 rounded-[18px] -z-10"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className={`ml-8 md:ml-0 md:w-[45%] ${idx % 2 === 0 ? 'md:pr-16 text-left md:text-right' : 'md:pl-16 text-left'}`}>
                                                        <div className={`p-6 rounded-[32px] transition-all border-2 ${isCurrent ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-200' : isCompleted ? 'bg-white border-slate-50 text-slate-900 shadow-sm' : 'bg-slate-50 border-slate-50 text-slate-300 opacity-50'}`}>
                                                            <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isCurrent ? 'text-blue-100' : isCompleted ? 'text-blue-600' : 'text-slate-400'}`}>
                                                                Tahap 0{idx + 1}
                                                            </p>
                                                            <h4 className="text-sm font-black uppercase tracking-tight leading-tight">{s.label}</h4>
                                                            <p className={`text-[10px] font-medium leading-relaxed mt-2 uppercase italic ${isCurrent ? 'text-blue-50' : 'text-slate-400'}`}>
                                                                {s.desc}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="hidden md:block w-[45%]" />
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Live Tracking Map Section */}
                            {(booking.status === 'ON_THE_WAY' || booking.status === 'ARRIVED') && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-[48px] overflow-hidden border border-slate-100 shadow-2xl shadow-slate-200/50"
                                >
                                    <div className="p-8 md:p-12 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="space-y-1">
                                            <Badge className="bg-blue-600 text-white border-0 px-3 py-1 rounded-full font-bold uppercase tracking-widest text-[8px] mb-2">Live Tracking</Badge>
                                            <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Lokasi <span className="text-blue-600">Teknisi</span></h3>
                                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight italic">Diperbarui setiap 10 detik</p>
                                        </div>
                                        {location && (
                                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-3xl border border-slate-100">
                                                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm overflow-hidden border border-slate-50">
                                                    {location.teknisi?.user?.avatar ? (
                                                        <img src={location.teknisi.user.avatar} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <User className="w-6 h-6 text-slate-300" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teknisi Sesuai Jadwal</p>
                                                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{location.teknisi?.user?.name || 'Tim Teknisi'}</h4>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="h-[450px] w-full bg-slate-100 relative">
                                        {isLeafletReady && (
                                            <MapContainer 
                                                center={location ? [location.latitude, location.longitude] : [-6.200000, 106.816666]} 
                                                zoom={15} 
                                                scrollWheelZoom={false}
                                                className="h-full w-full z-0"
                                            >
                                                <TileLayer
                                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                />
                                                {location && (
                                                    <Marker position={[location.latitude, location.longitude]}>
                                                        <Popup>
                                                            <div className="text-center font-bold font-syne">
                                                                <p className="text-blue-600 uppercase text-[10px]">Posisi Teknisi</p>
                                                                <p className="text-slate-900 text-xs">Sedang Menuju Lokasi</p>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                )}
                                                {/* Customer Location Placeholder if coordinates available in booking */}
                                                {booking.latitude && booking.longitude && (
                                                    <Marker position={[booking.latitude, booking.longitude]}>
                                                        <Popup>
                                                            <div className="text-center font-bold">
                                                                <p className="text-red-500 uppercase text-[10px]">Lokasi Anda</p>
                                                            </div>
                                                        </Popup>
                                                    </Marker>
                                                )}
                                            </MapContainer>
                                        )}
                                        
                                        {!location && (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/10 backdrop-blur-sm z-10 px-10 text-center">
                                                <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-blue-600 shadow-xl mb-4 animate-pulse">
                                                    <Navigation2 className="w-8 h-8 rotate-45" />
                                                </div>
                                                <h4 className="text-lg font-black uppercase text-slate-900">Menyambungkan Sinyal GPS...</h4>
                                                <p className="text-xs font-medium text-slate-500 max-w-xs mt-2">Pastikan koneksi internet Anda stabil untuk melihat posisi real-time teknisi.</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 bg-slate-900 text-white flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                            <Info className="w-5 h-5 text-white" />
                                        </div>
                                        <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase tracking-tight">
                                            Teknisi akan segera sampai. Mohon siapkan unit AC yang akan dikerjakan agar proses servis berjalan lancar.
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : hasSearched && !loading ? (
                        <motion.div 
                            key="not-found"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-[48px] p-20 border border-slate-100 flex flex-col items-center justify-center text-center space-y-6"
                        >
                            <div className="w-24 h-24 rounded-[32px] bg-red-50 text-red-500 flex items-center justify-center shadow-inner">
                                <Search className="w-10 h-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black tracking-tighter uppercase text-slate-900">Data Tidak Ditemukan</h3>
                                <p className="text-slate-400 font-medium text-sm">Pastikan Kode Booking dan Nomor HP yang Anda masukkan benar.</p>
                            </div>
                            <Button 
                                variant="outline" 
                                onClick={() => {setHasSearched(false); setBooking(null)}}
                                className="rounded-2xl px-10 h-12 uppercase font-black tracking-widest text-[10px] border-slate-100"
                            >
                                Coba Lagi
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="initial-state"
                            className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        >
                            <div className="bg-white p-10 rounded-[40px] border border-slate-100 space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                    <Info className="w-7 h-7" />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tight text-slate-900">Gunakan Kode Booking</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed italic uppercase tracking-tight">Kode booking dapat Anda temukan pada pesan WhatsApp konfirmasi pertama saat Anda melakukan pemesanan.</p>
                            </div>
                            <div className="bg-white p-10 rounded-[40px] border border-slate-100 space-y-6">
                                <div className="w-14 h-14 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center">
                                    <ShieldCheck className="w-7 h-7" />
                                </div>
                                <h4 className="text-xl font-black uppercase tracking-tight text-slate-900">Privasi Terjaga</h4>
                                <p className="text-slate-500 text-xs font-medium leading-relaxed italic uppercase tracking-tight">Kami memvalidasi pesanan dengan Nomor HP Anda untuk memastikan data teknisi dan alamat hanya dilihat oleh Anda.</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default function TrackBookingPage() {
    return (
        <React.Suspense fallback={
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        }>
            <TrackContent />
        </React.Suspense>
    )
}
