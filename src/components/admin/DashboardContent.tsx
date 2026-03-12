"use client"

import { motion } from "framer-motion"
import {
    CalendarCheck,
    Hourglass,
    Wrench,
    CheckCircle2,
    ChevronRight,
    Image as ImageIcon,
    Settings2,
    TrendingUp,
    Users,
    FileText,
    Bell
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer
} from 'recharts'

interface DashboardContentProps {
    userName: string
    stats: {
        total: number
        pending: number
        proses: number
        selesai: number
        percentDone: number
    }
    recentBookings: any[]
    counts: {
        users: number
        articles: number
    }
    chartData: {
        name: string
        bookings: number
    }[]
}

export default function DashboardContent({ userName, stats, recentBookings, counts, chartData }: DashboardContentProps) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
    }

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8 pb-10"
        >
            {/* Header section */}
            <motion.div variants={item} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-display font-black tracking-tight text-slate-900">
                        Selamat datang, <span className="text-primary-blue">{userName}</span>! 👋
                    </h1>
                    <p className="text-slate-500 font-medium mt-1">
                        Inilah ringkasan operasional <span className="text-slate-800 font-bold">Jaya Abadi Raja Service</span> hari ini.
                    </p>
                </div>
                {stats.pending > 0 && (
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Link href="/admin/booking?status=PENDING_WA">
                            <Button className="bg-gradient-to-r from-accent-yellow to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-xl shadow-yellow-200 rounded-2xl px-6 py-6 border-none">
                                <Bell className="w-5 h-5 mr-2 animate-bounce" />
                                <span className="font-bold">{stats.pending} Booking Pending</span>
                            </Button>
                        </Link>
                    </motion.div>
                )}
            </motion.div>

            {/* Stats Cards Top Row */}
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
                {[
                    { label: "PENDING", val: stats.pending, icon: Hourglass, color: "yellow", bg: "bg-yellow-50", text: "text-amber-600", iconBg: "bg-amber-100", progress: 30 },
                    { label: "PROSES", val: stats.proses, icon: Wrench, color: "blue", bg: "bg-blue-50", text: "text-blue-600", iconBg: "bg-blue-100", progress: 50 },
                    { label: "SELESAI", val: stats.selesai, icon: CheckCircle2, color: "green", bg: "bg-emerald-50", text: "text-emerald-600", iconBg: "bg-emerald-100", progress: 80 }
                ].map((s, idx) => (
                    <motion.div key={idx} variants={item}>
                        <Card className="shadow-xl shadow-slate-100 border-none group hover:translate-y-[-4px] transition-all duration-300 relative overflow-hidden">
                            <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full ${s.bg} opacity-0 group-hover:opacity-40 transition-all duration-500 blur-2xl`} />
                            <div className={`absolute -left-2 -top-2 w-12 h-12 rounded-full ${s.iconBg} opacity-0 group-hover:opacity-20 transition-all duration-500 blur-xl`} />

                            <CardContent className="p-3 sm:p-5 flex flex-col justify-between relative z-10 min-h-[100px] sm:min-h-[140px]">
                                <div className="flex justify-between items-start">
                                    <p className="text-slate-400 font-black text-[8px] sm:text-[11px] tracking-[0.1em] uppercase">{s.label}</p>
                                    <motion.div
                                        whileHover={{ rotate: 15, scale: 1.1 }}
                                        className={`p-1 sm:p-2 ${s.iconBg} ${s.text} rounded-lg sm:rounded-xl group-hover:shadow-lg transition-all`}
                                    >
                                        <s.icon className="w-3 h-3 sm:w-4 h-4" />
                                    </motion.div>
                                </div>
                                <div className="mt-1 sm:mt-2">
                                    <h3 className="text-lg sm:text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-1">
                                        {s.val}
                                        <span className="text-[8px] sm:text-[10px] text-slate-400 font-bold">Orders</span>
                                    </h3>
                                    <div className="mt-1 sm:mt-2 bg-slate-100/50 rounded-full h-1 sm:h-1.5 w-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(s.val / (stats.total || 1)) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                                            className={`${s.text.replace('text', 'bg')} h-full rounded-full shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                                        ></motion.div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-stretch">
                {/* Chart Card (Left Side) */}
                <motion.div variants={item} className="lg:col-span-2">
                    <Card className="h-full bg-gradient-to-br from-blue-700 via-primary-blue to-indigo-800 border-0 shadow-2xl shadow-blue-200 overflow-hidden relative group min-h-[260px]">
                        {/* Background Ornament */}
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
                            <CalendarCheck className="w-40 h-40 text-white" />
                        </div>

                        <CardContent className="p-0 relative z-10 text-white h-full flex flex-col">
                            <div className="p-6 pb-2">
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                                            <TrendingUp className="w-3.5 h-3.5 text-blue-200" />
                                        </div>
                                        <p className="text-blue-100 font-bold text-[11px] uppercase tracking-wider">Tren Booking 7 Hari</p>
                                    </div>
                                    <Badge className="bg-white/10 text-white border-none text-[10px] font-bold">Live Data</Badge>
                                </div>
                                <h2 className="text-4xl font-display font-black tracking-tighter">
                                    {stats.total.toLocaleString()}
                                    <span className="text-blue-200 text-sm font-medium ml-2 tracking-normal opacity-70">Total Booking</span>
                                </h2>
                            </div>

                            {/* Recharts Chart */}
                            <div className="w-full h-[140px] mt-2 px-1">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                        <XAxis
                                            dataKey="name"
                                            axisLine={false}
                                            tickLine={false}
                                            tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10, fontWeight: 'bold' }}
                                            dy={10}
                                        />
                                        <YAxis hide />
                                        <ChartTooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: 'none',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                fontSize: '12px',
                                                fontWeight: 'bold',
                                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                                            }}
                                            itemStyle={{ color: '#22c55e' }}
                                            cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="bookings"
                                            stroke="#22c55e"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorBookings)"
                                            animationDuration={2000}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="p-4 pt-1 flex justify-between items-center bg-black/10 backdrop-blur-sm border-t border-white/5">
                                <div className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-accent-green rounded-full animate-pulse shadow-[0_0_8px_#22c55e]" />
                                    <p className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">{stats.percentDone}% Selesai</p>
                                </div>
                                <p className="text-[9px] text-blue-200/50 font-medium uppercase tracking-widest">Target tercapai</p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Aksi Cepat Card (Right Side - Aligned with Chart) */}
                <motion.div variants={item} className="lg:col-span-3">
                    <Card className="h-full shadow-2xl shadow-slate-100 border-none rounded-3xl overflow-hidden bg-white px-6 py-7 flex flex-col justify-center">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-1.5 h-6 bg-primary-blue rounded-full" />
                            <h4 className="text-[14px] font-black text-slate-800 uppercase tracking-[0.2em]">Aksi Cepat</h4>
                        </div>
                        <div className="grid grid-cols-3 gap-2 sm:gap-6">
                            {[
                                { href: "/admin/booking?status=PENDING_WA", label: "Booking", desc: "PENDING", icon: Bell, border: "border-l-amber-400", bg: "hover:bg-amber-50", color: "text-amber-500", iconBg: "bg-amber-100" },
                                { href: "/admin/blog/tambah", label: "Artikel", desc: "TULIS", icon: FileText, border: "border-l-purple-400", bg: "hover:bg-purple-50", color: "text-purple-500", iconBg: "bg-purple-100" },
                                { href: "/admin/settings", label: "Setting", desc: "SISTEM", icon: Settings2, border: "border-l-emerald-400", bg: "hover:bg-emerald-50", color: "text-emerald-500", iconBg: "bg-emerald-100" }
                            ].map((act, idx) => (
                                <motion.div key={idx} variants={item}>
                                    <Link href={act.href}>
                                        <div className={`group flex flex-col p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-100 bg-white ${act.bg} transition-all border-l-4 ${act.border} shadow-sm hover:shadow-md h-full`}>
                                            <div className="flex justify-between items-start mb-2 sm:mb-4">
                                                <div className={`p-1.5 sm:p-2.5 ${act.iconBg} ${act.color} rounded-lg sm:rounded-xl group-hover:bg-white transition-colors`}>
                                                    <act.icon className="w-3.5 h-3.5 sm:w-5 h-5" />
                                                </div>
                                                <ChevronRight className={`w-3 h-3 sm:w-4 h-4 text-slate-300 group-hover:${act.color} transition-colors`} />
                                            </div>
                                            <div>
                                                <p className="font-black text-slate-800 text-[9px] sm:text-[14px] mb-0.5 sm:mb-1 truncate">{act.label}</p>
                                                <p className="text-[7px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-widest">{act.desc}</p>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Booking Terbaru Table */}
                <motion.div variants={item} className="lg:col-span-2">
                    <Card className="shadow-2xl shadow-slate-100 border-none rounded-3xl overflow-hidden bg-white">
                        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h3 className="font-black text-xl text-slate-800 tracking-tight">Booking Terbaru</h3>
                                <p className="text-xs text-slate-500 font-medium">Monitoring antrian pelanggan terbaru</p>
                            </div>
                            <Link href="/admin/booking">
                                <Button variant="outline" size="sm" className="text-primary-blue border-blue-100 hover:bg-blue-50 rounded-xl font-bold px-4">
                                    Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                            </Link>
                        </div>
                        <div className="p-0 overflow-x-auto">
                            <table className="w-full text-sm text-left border-collapse">
                                <thead className="bg-slate-50/80 text-slate-400 font-bold uppercase text-[10px] tracking-widest border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4">Tanggal</th>
                                        <th className="px-8 py-4">Client</th>
                                        <th className="px-8 py-4">Layanan</th>
                                        <th className="px-8 py-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50 text-slate-700">
                                    {recentBookings.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-10 text-center text-slate-400 italic">Belum ada data booking</td>
                                        </tr>
                                    ) : (
                                        recentBookings.map((b, idx) => (
                                            <motion.tr
                                                key={b.id}
                                                whileHover={{ backgroundColor: "rgba(248, 250, 252, 0.8)" }}
                                                className="transition-colors group"
                                            >
                                                <td className="px-8 py-5">
                                                    <span className="font-bold text-slate-500">
                                                        {new Date(b.jadwalTanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <p className="font-bold text-slate-800 leading-tight">{b.namaPelanggan}</p>
                                                    <p className="text-[11px] text-slate-400 font-medium mt-0.5">{b.noHp}</p>
                                                </td>
                                                <td className="px-8 py-5">
                                                    <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-lg text-[11px] font-bold">
                                                        {b.layanan?.nama || "General Service"}
                                                    </span>
                                                </td>
                                                <td className="px-8 py-5 text-center">
                                                    <Badge className={`
                                                        font-black text-[10px] uppercase px-3 py-1 rounded-full border-none shadow-sm
                                                        ${b.status === 'DONE' ? 'bg-emerald-100 text-emerald-700' :
                                                            b.status === 'PENDING_WA' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-blue-100 text-blue-700'}
                                                    `}>
                                                        {b.status.replace('_', ' ')}
                                                    </Badge>
                                                </td>
                                            </motion.tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </motion.div>

                {/* Sidebar Cards */}
                <div className="space-y-6">
                    {/* Activity Overview */}
                    <motion.div variants={item}>
                        <Card className="shadow-2xl shadow-slate-100 border-none rounded-3xl p-6 bg-gradient-to-br from-indigo-50 to-white overflow-hidden relative">
                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                <Users className="w-20 h-20 text-indigo-600" />
                            </div>
                            <h4 className="font-black text-slate-800 tracking-tight text-lg mb-4">Statistik Global</h4>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-indigo-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-xl">
                                            <Users className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">Total User</span>
                                    </div>
                                    <span className="font-black text-slate-800">{counts.users}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-sm border border-emerald-100/50">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-600">Total Artikel</span>
                                    </div>
                                    <span className="font-black text-slate-800">{counts.articles}</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    )
}
