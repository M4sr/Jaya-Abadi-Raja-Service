"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    Users,
    Calendar,
    Star,
    CheckCircle2,
    MapPin
} from "lucide-react"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"
import EditAreaDialog from "@/app/admin/laporan/teknisi/EditAreaDialog"

interface TeknisiReportClientProps {
    startDate: Date;
    totalJobsThisMonth: number;
    overallRating: string;
    allRatedCount: number;
    activeTechniciansThisMonth: number;
    teknisiStats: any[];
}

export default function TeknisiReportClient({
    startDate,
    totalJobsThisMonth,
    overallRating,
    allRatedCount,
    activeTechniciansThisMonth,
    teknisiStats
}: TeknisiReportClientProps) {
    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Performa Teknisi</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Rekap kinerja teknisi untuk bulan {format(startDate, "MMMM yyyy", { locale: id })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-sm text-slate-700 font-medium">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{format(startDate, "MMM yyyy", { locale: id })}</span>
                        </div>
                    </div>
                </div>
            </AnimationItem>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimationItem>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group h-full">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-blue-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <div className="p-2 bg-blue-100/50 rounded-lg">
                                        <CheckCircle2 className="w-5 h-5 text-primary-blue-medium" />
                                    </div>
                                    <span className="font-semibold text-sm">Total Selesai</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                    {totalJobsThisMonth} <span className="text-sm font-semibold text-slate-400">Order</span>
                                </h3>
                            </div>
                        </div>
                    </div>
                </AnimationItem>

                <AnimationItem>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group h-full">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <div className="p-2 bg-amber-100/50 rounded-lg">
                                        <Star className="w-5 h-5 text-amber-500" />
                                    </div>
                                    <span className="font-semibold text-sm">Rating Rata-Rata</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-1">
                                    {overallRating} <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                                </h3>
                                <p className="text-xs text-slate-400">Berdasarkan {allRatedCount} ulasan bulan ini</p>
                            </div>
                        </div>
                    </div>
                </AnimationItem>

                <AnimationItem>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group h-full">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <div className="p-2 bg-emerald-100/50 rounded-lg">
                                        <Users className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <span className="font-semibold text-sm">Teknisi Aktif</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                    {activeTechniciansThisMonth} <span className="text-sm font-semibold text-slate-400">Orang</span>
                                </h3>
                                <p className="text-xs text-slate-400">Teknisi berkontribusi bulan ini</p>
                            </div>
                        </div>
                    </div>
                </AnimationItem>
            </div>

            <AnimationItem>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-slate-800">Tabel Kinerja Teknisi</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl">Nama Teknisi</th>
                                    <th className="px-6 py-4">Area Operasional</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center">Tugas Selesai (Bulan Ini)</th>
                                    <th className="px-6 py-4 text-center">Rating (Bulan Ini)</th>
                                    <th className="px-6 py-4 text-center rounded-tr-xl">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80 text-slate-700">
                                {teknisiStats.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            Belum ada data teknisi yang terdaftar di sistem.
                                        </td>
                                    </tr>
                                ) : (
                                    teknisiStats.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-slate-700">{item.user.name}</span>
                                                    <span className="text-xs text-slate-500">{item.user.phone || "-"}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-start gap-1.5 text-slate-600">
                                                    <MapPin className="w-4 h-4 shrink-0 text-slate-400 mt-0.5" />
                                                    <span className="max-w-[200px] truncate" title={item.areas}>
                                                        {item.areas}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.status === "ACTIVE" ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-green-50 text-green-600 border border-green-200">AKTIF</span>
                                                ) : item.status === "ON_DUTY" ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">BERTUGAS</span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">TIDAK AKTIF</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center justify-center">
                                                    <span className={`font-black text-lg ${item.monthlyJobsCompleted > 0 ? "text-primary-blue-medium" : "text-slate-300"}`}>
                                                        {item.monthlyJobsCompleted}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex flex-col items-center justify-center gap-1">
                                                    <div className="flex gap-1 items-center">
                                                        <Star className={`w-4 h-4 ${parseFloat(item.monthlyAvgRating) > 0 ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                                                        <span className="font-bold">{item.monthlyAvgRating}</span>
                                                    </div>
                                                    {item.totalRatedJobs > 0 && (
                                                        <span className="text-[10px] text-slate-400">({item.totalRatedJobs} Ulasan)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex justify-center">
                                                    <EditAreaDialog
                                                        teknisiId={item.id}
                                                        teknisiName={item.user.name || "Teknisi"}
                                                        currentAreas={item.areaCoverage}
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </AnimationItem>
        </PageWrapper>
    )
}
