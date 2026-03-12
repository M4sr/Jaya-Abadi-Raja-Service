"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    Wallet,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    FileText,
    ArrowUpDown,
    ArrowUp,
    ArrowDown
} from "lucide-react"
import Link from "next/link"
import { DataTablePagination } from "@/components/admin/DataTablePagination"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface KeuanganClientProps {
    transaksi: any[];
    totalItems: number;
    page: number;
    limit: number;
    sort: string;
    order: string;
    totalPages: number;
    activeMonthStr: string;
    startDate: Date;
    totalPemasukan: number;
    totalPengeluaran: number;
    saldoBersih: number;
    addKeuanganDialog: React.ReactNode;
}

export default function KeuanganClient({
    transaksi,
    totalItems,
    page,
    limit,
    sort,
    order,
    totalPages,
    activeMonthStr,
    startDate,
    totalPemasukan,
    totalPengeluaran,
    saldoBersih,
    addKeuanganDialog
}: KeuanganClientProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(amount)
    }

    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Laporan Keuangan</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Rekapitulasi pemasukan dan pengeluaran bulan {format(startDate, "MMMM yyyy", { locale: id })}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-xl shadow-sm text-sm text-slate-700 font-medium">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span>{format(startDate, "MMM yyyy", { locale: id })}</span>
                        </div>
                        {addKeuanganDialog}
                    </div>
                </div>
            </AnimationItem>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnimationItem>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group h-full">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-green-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <div className="p-2 bg-green-100/50 rounded-lg">
                                        <ArrowUpRight className="w-5 h-5 text-green-600" />
                                    </div>
                                    <span className="font-semibold text-sm">Pemasukan</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                    {formatCurrency(totalPemasukan)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </AnimationItem>

                <AnimationItem>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden group h-full">
                        <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-50 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <div className="p-2 bg-red-100/50 rounded-lg">
                                        <ArrowDownRight className="w-5 h-5 text-red-600" />
                                    </div>
                                    <span className="font-semibold text-sm">Pengeluaran</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                                    {formatCurrency(totalPengeluaran)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </AnimationItem>

                <AnimationItem>
                    <div className="bg-gradient-to-br from-primary-blue-medium to-primary-blue-light rounded-2xl p-6 shadow-md shadow-blue-500/20 relative overflow-hidden group h-full">
                        <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
                        <div className="relative flex justify-between items-start">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-blue-100">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Wallet className="w-5 h-5 text-white" />
                                    </div>
                                    <span className="font-semibold text-sm">Saldo Bersih</span>
                                </div>
                                <h3 className="text-2xl font-black text-white tracking-tight">
                                    {formatCurrency(saldoBersih)}
                                </h3>
                            </div>
                        </div>
                    </div>
                </AnimationItem>
            </div>

            <AnimationItem>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-slate-800">Riwayat Transaksi</h3>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50/80 text-slate-500 font-semibold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4 rounded-tl-xl cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/laporan/keuangan?month=${activeMonthStr}&sort=tanggal&order=${sort === 'tanggal' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Tanggal
                                            {sort === 'tanggal' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/laporan/keuangan?month=${activeMonthStr}&sort=kategori&order=${sort === 'kategori' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Kategori
                                            {sort === 'kategori' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4">Keterangan</th>
                                    <th className="px-6 py-4 text-right cursor-pointer hover:bg-slate-100/80 transition-colors group rounded-tr-xl">
                                        <Link href={`/admin/laporan/keuangan?month=${activeMonthStr}&sort=nominal&order=${sort === 'nominal' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center justify-end gap-1">
                                            Nominal
                                            {sort === 'nominal' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80 text-slate-700">
                                {transaksi.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                                            Belum ada data transaksi bulan ini
                                        </td>
                                    </tr>
                                ) : (
                                    transaksi.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {format(new Date(item.tanggal), "dd MMM yyyy", { locale: id })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-1.5 h-1.5 rounded-full ${item.tipe === "PEMASUKAN" ? "bg-green-500" : "bg-red-500"}`}></div>
                                                    <span className="font-medium">{item.kategori}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 max-w-sm truncate text-xs">
                                                {item.bookingId ? (
                                                    <span className="text-primary-blue-medium font-medium">#{item.booking?.kodeBooking}</span>
                                                ) : (
                                                    item.keterangan || "-"
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <span className={`font-bold ${item.tipe === "PEMASUKAN" ? "text-green-600" : "text-red-500"}`}>
                                                    {item.tipe === "PEMASUKAN" ? "+" : "-"}{formatCurrency(item.nominal)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <DataTablePagination
                        totalItems={totalItems}
                        pageSize={limit}
                        currentPage={page}
                        totalPages={totalPages}
                    />
                </div>
            </AnimationItem>
        </PageWrapper>
    )
}
