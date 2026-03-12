"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, MapPin, Eye, Filter, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { DataTablePagination } from "@/components/admin/DataTablePagination"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface BookingClientProps {
    bookings: any[];
    totalItems: number;
    page: number;
    limit: number;
    sort: string;
    order: string;
    totalPages: number;
    currentTab: string;
    tabs: { id: string, label: string }[];
}

export default function BookingClient({
    bookings,
    totalItems,
    page,
    limit,
    sort,
    order,
    totalPages,
    currentTab,
    tabs
}: BookingClientProps) {
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING_WA':
            case 'CONFIRMED':
                return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-normal border-0">{status.replace('_', ' ')}</Badge>
            case 'ASSIGNED':
            case 'ON_THE_WAY':
            case 'ARRIVED':
            case 'IN_PROGRESS':
                return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-normal border-0">{status.replace('_', ' ')}</Badge>
            case 'DONE':
                return <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-normal border-0">SELESAI</Badge>
            case 'CANCELLED':
                return <Badge className="bg-red-100 text-red-800 hover:bg-red-100 font-normal border-0">DIBATALKAN</Badge>
            default:
                return <Badge className="bg-slate-100 text-slate-800 border-0">{status}</Badge>
        }
    }

    const formatDate = (dateValue: any) => {
        const date = new Date(dateValue)
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
    }

    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Manajemen Booking</h1>
                        <p className="text-slate-500 text-sm mt-1">Pantau, tugaskan teknisi, dan update status pesanan layanan AC</p>
                    </div>
                    <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
                        {tabs.map((tab) => (
                            <Link key={tab.id} href={`/admin/booking?status=${tab.id}`}>
                                <span className={`px-4 py-2 block text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${currentTab === tab.id ? 'bg-white text-primary-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                    {tab.label}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </AnimationItem>

            <AnimationItem>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/booking?status=${currentTab}&sort=kodeBooking&order=${sort === 'kodeBooking' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Kode / Waktu
                                            {sort === 'kodeBooking' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/booking?status=${currentTab}&sort=namaPelanggan&order=${sort === 'namaPelanggan' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Pelanggan
                                            {sort === 'namaPelanggan' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4">Layanan</th>
                                    <th className="px-6 py-4">Teknisi</th>
                                    <th className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/booking?status=${currentTab}&sort=status&order=${sort === 'status' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center justify-center gap-1">
                                            Status
                                            {sort === 'status' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                                                <Filter className="w-8 h-8 text-slate-300" />
                                            </div>
                                            Tidak ada data booking ditemukan untuk filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-primary-blue-medium">{item.kodeBooking}</div>
                                                <div className="flex items-center text-xs text-slate-500 mt-1 gap-1">
                                                    <Calendar className="w-3 h-3" /> {formatDate(item.jadwalTanggal)}
                                                    <Clock className="w-3 h-3 ml-2" /> {item.jadwalWaktu}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800">{item.namaPelanggan}</div>
                                                <div className="text-xs text-slate-500">{item.noHp}</div>
                                                <div className="flex items-start text-xs text-slate-400 mt-1 gap-1 max-w-[200px]">
                                                    <MapPin className="w-3 h-3 shrink-0 mt-0.5" />
                                                    <span className="truncate" title={item.alamat}>{item.alamat}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-medium">{item.layanan?.nama || "Layanan Custom"}</div>
                                                <div className="text-xs text-slate-500">
                                                    {item.merekAc} ({item.kapasitasAc}) - {item.jumlahUnit} Unit
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.teknisi ? (
                                                    <span className="inline-flex items-center gap-2 font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-xs">
                                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                        {item.teknisi.user.name}
                                                    </span>
                                                ) : (
                                                    <span className="text-xs italic text-slate-400">Belum di-assign</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {getStatusBadge(item.status)}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <Link href={`/admin/booking/${item.id}`}>
                                                    <Button variant="outline" size="sm" className="text-primary-blue-medium border-primary-blue-medium/20 hover:bg-blue-50">
                                                        <Eye className="w-4 h-4 mr-2" /> Detail
                                                    </Button>
                                                </Link>
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
