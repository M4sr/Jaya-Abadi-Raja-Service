"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Clock, User, Phone, CheckCircle2, Wrench, XCircle, ChevronDown, Save, Loader2, FileText, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import Link from "next/link"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

const STATUS_OPTIONS = [
    { value: "PENDING_WA", label: "Pending (WA)" },
    { value: "CONFIRMED", label: "Confirmed" },
    { value: "ASSIGNED", label: "Assigned ke Teknisi" },
    { value: "ON_THE_WAY", label: "Teknisi Menuju Lokasi" },
    { value: "ARRIVED", label: "Teknisi Tiba" },
    { value: "IN_PROGRESS", label: "Sedang Dikerjakan" },
    { value: "DONE", label: "Selesai" },
    { value: "CANCELLED", label: "Dibatalkan" },
]

export default function BookingDetailView({ booking, teknisiList }: { booking: any, teknisiList: any[] }) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)

    const [status, setStatus] = useState(booking.status)
    const [teknisiId, setTeknisiId] = useState(booking.teknisiId || "")
    const [catatan, setCatatan] = useState(booking.catatanTeknisi || "")

    const formatDate = (date: string | Date | null) => {
        if (!date) return "-"
        return new Intl.DateTimeFormat('id-ID', {
            day: '2-digit', month: 'long', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        }).format(new Date(date))
    }

    const handleUpdate = async () => {
        setIsSaving(true)
        try {
            const response = await fetch(`/api/booking/${booking.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status,
                    teknisiId: teknisiId || null,
                    catatanTeknisi: catatan,
                }),
            })

            if (!response.ok) throw new Error("Gagal menyimpan perubahan")

            toast.success("Data booking berhasil diupdate")
            router.refresh()
        } catch (error) {
            toast.error("Terjadi kesalahan saat menyimpan data")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    // Status color helper
    const getStatusColor = (s: string) => {
        if (s === 'DONE') return "bg-green-100 text-green-800"
        if (s === 'CANCELLED') return "bg-red-100 text-red-800"
        if (['PENDING_WA', 'CONFIRMED'].includes(s)) return "bg-yellow-100 text-yellow-800"
        return "bg-blue-100 text-blue-800"
    }

    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/booking">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200 shadow-sm">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800 flex items-center gap-3">
                            Detail Booking
                            <span className="text-primary-blue-medium font-mono text-xl bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                                #{booking.kodeBooking}
                            </span>
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Dibuat pada {formatDate(booking.createdAt)}</p>
                    </div>
                </div>
                <Badge className={`px-4 py-1.5 text-sm font-semibold border-0 ${getStatusColor(booking.status)}`}>
                    {STATUS_OPTIONS.find(opt => opt.value === booking.status)?.label || booking.status}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Kolom Kiri - Informasi Lengkap */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Info Layanan & Waktu */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <Wrench className="w-5 h-5 text-primary-blue-medium" />
                            Detail Pekerjaan
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Jenis Layanan</p>
                                    <p className="font-medium text-slate-800">{booking.layanan?.nama || "Custom Service"}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Unit AC</p>
                                    <p className="text-slate-800">
                                        {booking.merekAc || "-"} ({booking.kapasitasAc || "-"}) — <span className="font-bold">{booking.jumlahUnit} Unit</span>
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Jadwal Diminta</p>
                                    <div className="flex items-center gap-2 text-slate-800 font-medium bg-slate-50 p-2 rounded-xl inline-block">
                                        <Calendar className="w-4 h-4 text-primary-blue-medium" />
                                        {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(booking.jadwalTanggal))}
                                        <Clock className="w-4 h-4 text-primary-blue-medium ml-2" />
                                        {booking.jadwalWaktu}
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Keluhan / Catatan Pelanggan</p>
                                    <p className="text-slate-700 bg-yellow-50/50 p-3 rounded-xl border border-yellow-100/50 text-sm">
                                        {booking.keluhan || "Tidak ada keluhan spesifik."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Pelanggan & Lokasi */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-4">
                            <User className="w-5 h-5 text-accent-cyan" />
                            Data Pelanggan & Lokasi
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nama Pelanggan</p>
                                    <p className="font-medium text-slate-800">{booking.namaPelanggan}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Kontak</p>
                                    <div className="flex items-center gap-2 text-slate-800">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        {booking.noHp}
                                    </div>
                                    {booking.email && <div className="text-slate-600 text-sm mt-1">{booking.email}</div>}
                                </div>
                            </div>

                            <div className="space-y-4 border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0">
                                <div>
                                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Alamat Lengkap</p>
                                    <div className="flex items-start gap-2 text-slate-800 text-sm">
                                        <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                        <p className="leading-relaxed">{booking.alamat}</p>
                                    </div>
                                </div>
                                {booking.mapsLink && (
                                    <div className="space-y-2">
                                        <a href={booking.mapsLink} target="_blank" rel="noreferrer" className="text-primary-blue-medium hover:underline text-sm font-medium flex items-center gap-1">
                                            Buka di Google Maps &rarr;
                                        </a>
                                        {booking.latitude && booking.longitude && (
                                            <p className="text-[10px] text-slate-400 font-mono">
                                                Coordinates: {booking.latitude}, {booking.longitude}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Log Aktivitas Status */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <History className="w-5 h-5 text-purple-500" />
                            Riwayat Status Pesanan
                        </h3>

                        <div className="space-y-0 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                            {booking.statusLogs?.length > 0 ? booking.statusLogs.map((log: any, idx: number) => (
                                <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active pb-8 last:pb-0">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 text-slate-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </div>
                                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="font-bold text-slate-800 text-sm">{STATUS_OPTIONS.find(opt => opt.value === log.status)?.label || log.status}</div>
                                            <time className="text-xs font-medium text-slate-400">{formatDate(log.createdAt).split(' ')[3]}</time>
                                        </div>
                                        <div className="text-slate-600 text-xs mt-1">{log.keterangan || "Status diperbarui."}</div>
                                        {log.changedBy && <div className="text-slate-400 text-[10px] mt-2 font-medium">Oleh: {log.changedBy}</div>}
                                    </div>
                                </div>
                            )) : (
                                <div className="text-center text-slate-500 text-sm py-4">Belum ada riwayat status.</div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Kolom Kanan - Action / Pengaturan State */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sticky top-24">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5 text-accent-green" />
                            Update Pesanan
                        </h3>

                        <div className="space-y-5">

                            {/* Assign Teknisi */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Tugaskan Teknisi</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue-light focus:border-transparent text-sm font-medium"
                                        value={teknisiId}
                                        onChange={(e) => setTeknisiId(e.target.value)}
                                    >
                                        <option value="">-- Belum Di-assign --</option>
                                        {teknisiList.map((t: any) => (
                                            <option key={t.id} value={t.id}>{t.user?.name} (Teknisi)</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Status Update */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Status Saat Ini</label>
                                <div className="relative">
                                    <select
                                        className="w-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 py-3 pl-4 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue-light focus:border-transparent text-sm font-medium"
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                                </div>
                            </div>

                            {/* Catatan Internal */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Catatan Internal / Teknisi</label>
                                <Textarea
                                    placeholder="Tambahkan catatan untuk teknisi atau admin lain..."
                                    className="rounded-xl bg-slate-50 h-24 text-sm"
                                    value={catatan}
                                    onChange={(e) => setCatatan(e.target.value)}
                                />
                            </div>

                            {/* Submit Action */}
                            <div className="pt-2">
                                <Button
                                    onClick={handleUpdate}
                                    disabled={isSaving}
                                    className="w-full bg-primary-blue hover:bg-primary-blue-medium text-white shadow-lg shadow-blue-500/20 py-6 rounded-xl text-base font-bold"
                                >
                                    {isSaving ? (
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="w-5 h-5 mr-2" />
                                    )}
                                    Simpan Perubahan
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
            </AnimationItem>
        </PageWrapper>
    )
}
