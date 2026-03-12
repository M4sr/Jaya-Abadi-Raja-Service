"use client"

import { format } from "date-fns"
import { id } from "date-fns/locale"
import {
    MessageSquare,
    Calendar,
    Star,
    MessageCircleDashed,
    Quote,
    ThumbsUp,
    AlertCircle,
    ArrowUp,
    ArrowDown,
    ChevronDown
} from "lucide-react"
import Link from "next/link"
import { DataTablePagination } from "@/components/admin/DataTablePagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface FeedbackReportClientProps {
    feedbackList: any[];
    totalItems: number;
    page: number;
    limit: number;
    sort: string;
    order: string;
    totalPages: number;
    activeMonthStr: string;
    startDate: Date;
    totalReviews: number;
    avgRating: string;
    positiveReviews: number;
    criticalReviews: number;
}

export default function FeedbackReportClient({
    feedbackList,
    totalItems,
    page,
    limit,
    sort,
    order,
    totalPages,
    activeMonthStr,
    startDate,
    totalReviews,
    avgRating,
    positiveReviews,
    criticalReviews
}: FeedbackReportClientProps) {
    const renderStars = (rating: number | null) => {
        if (!rating) return <span className="text-xs text-slate-400 italic">Tidak ada rating</span>

        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}`}
                    />
                ))}
            </div>
        )
    }

    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Ulasan & Komplain</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Feedback pelanggan untuk pelayanan bulan {format(startDate, "MMMM yyyy", { locale: id })}
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

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnimationItem>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-2 relative overflow-hidden h-full">
                        <div className="flex items-center gap-2 text-slate-500">
                            <MessageSquare className="w-4 h-4 text-primary-blue-medium" />
                            <span className="font-semibold text-xs">Total Ulasan Masuk</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">{totalReviews}</h3>
                    </div>
                </AnimationItem>

                <AnimationItem>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-2 relative overflow-hidden h-full">
                        <div className="flex items-center gap-2 text-slate-500">
                            <Star className="w-4 h-4 text-amber-500" />
                            <span className="font-semibold text-xs">Rata-Rata Rating</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight flex items-baseline gap-1">
                            {avgRating} <span className="text-sm font-semibold text-slate-400">/ 5.0</span>
                        </h3>
                    </div>
                </AnimationItem>

                <AnimationItem>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-2 relative overflow-hidden h-full">
                        <div className="flex items-center gap-2 text-slate-500">
                            <ThumbsUp className="w-4 h-4 text-emerald-500" />
                            <span className="font-semibold text-xs">Puas (4-5 Bintang)</span>
                        </div>
                        <h3 className="text-2xl font-black text-emerald-600 tracking-tight">{positiveReviews}</h3>
                    </div>
                </AnimationItem>

                <AnimationItem>
                    <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col gap-2 relative overflow-hidden h-full">
                        <div className="flex items-center gap-2 text-slate-500">
                            <AlertCircle className="w-4 h-4 text-rose-500" />
                            <span className="font-semibold text-xs">Perlu Perhatian</span>
                        </div>
                        <h3 className="text-2xl font-black text-rose-600 tracking-tight">{criticalReviews}</h3>
                    </div>
                </AnimationItem>
            </div>

            <AnimationItem>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden">
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Quote className="w-5 h-5 text-slate-400" />
                            <h3 className="font-bold text-slate-800">Daftar Komentar Pelanggan</h3>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-slate-400">Urutkan:</span>
                            <DropdownMenu>
                                <DropdownMenuTrigger className="inline-flex items-center justify-center gap-1 h-8 text-xs font-medium px-3 border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">
                                    {sort === 'doneAt' ? 'Tanggal' : 'Rating'}
                                    {order === 'asc' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                                    <ChevronDown className="w-3 h-3 opacity-50" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-[160px]">
                                    <DropdownMenuItem className="p-0">
                                        <Link href={`/admin/laporan/feedback?month=${activeMonthStr}&sort=doneAt&order=desc`} className="w-full px-2 py-1.5 block">Terbaru</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-0">
                                        <Link href={`/admin/laporan/feedback?month=${activeMonthStr}&sort=doneAt&order=asc`} className="w-full px-2 py-1.5 block">Terlama</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-0">
                                        <Link href={`/admin/laporan/feedback?month=${activeMonthStr}&sort=rating&order=desc`} className="w-full px-2 py-1.5 block">Rating Tertinggi</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="p-0">
                                        <Link href={`/admin/laporan/feedback?month=${activeMonthStr}&sort=rating&order=asc`} className="w-full px-2 py-1.5 block">Rating Terendah</Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    <div className="p-0 sm:p-2">
                        {feedbackList.length === 0 ? (
                            <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
                                <MessageCircleDashed className="w-12 h-12 text-slate-200" />
                                <p className="text-sm">Belum ada ulasan atau komplain bulan ini.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 text-slate-700">
                                {feedbackList.map((item) => (
                                    <div key={item.id} className="bg-slate-50/50 border border-slate-100 rounded-xl p-5 flex flex-col gap-4 transition-all hover:bg-white hover:shadow-md">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="font-bold text-sm text-slate-800">{item.namaPelanggan}</span>
                                                <span className="text-xs text-slate-500 font-medium">#{item.kodeBooking} &bull; {item.layanan?.nama || "Service"}</span>
                                            </div>
                                            <div className="shrink-0 bg-white px-2 py-1.5 rounded-lg border border-slate-100 shadow-sm">
                                                {renderStars(item.rating)}
                                            </div>
                                        </div>

                                        <div className="flex-1 bg-white p-4 rounded-xl border border-slate-100/50 shadow-sm shadow-slate-200/20 text-sm leading-relaxed italic relative">
                                            <Quote className="w-8 h-8 absolute top-2 left-2 text-slate-100 rotate-180 -z-0" />
                                            <span className="relative z-10">
                                                {item.reviewKomentar
                                                    ? `"${item.reviewKomentar}"`
                                                    : <span className="text-slate-400 not-italic">Hanya rating tanpa komentar.</span>
                                                }
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center text-xs font-medium border-t border-slate-100 pt-3">
                                            <span className="text-slate-400">
                                                {item.doneAt ? format(new Date(item.doneAt), "dd MMM yyyy", { locale: id }) : "-"}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-primary-blue-medium bg-blue-50 px-2 py-1 rounded-md">
                                                👨‍🔧 {item.teknisi?.user.name || "Anonim"}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
