"use client"

import { useState, useMemo } from "react"
import { Trash2, CalendarDays, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { AnimationItem } from "./AnimationWrappers"

interface GaleriItem {
    id: string
    fotoUrl: string
    judul: string | null
    createdAt: string
}

interface GaleriClientProps {
    galeries: GaleriItem[]
}

function formatDateLabel(dateStr: string) {
    const date = new Date(dateStr)
    return new Intl.DateTimeFormat("id-ID", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(date)
}

function toDateKey(dateStr: string) {
    return new Date(dateStr).toISOString().split("T")[0]
}

export function GaleriClient({ galeries }: GaleriClientProps) {
    const router = useRouter()
    const [searchDate, setSearchDate] = useState("")
    const [searchText, setSearchText] = useState("")
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        setDeletingId(id)
        try {
            const res = await fetch(`/api/galeri/${id}`, { method: "DELETE" })
            if (!res.ok) throw new Error("Gagal menghapus foto")
            toast.success("Foto dihapus")
            router.refresh()
        } catch {
            toast.error("Gagal menghapus foto")
        } finally {
            setDeletingId(null)
        }
    }

    // Filter by date and text
    const filtered = useMemo(() => {
        return galeries.filter((item) => {
            const matchDate = searchDate ? toDateKey(item.createdAt) === searchDate : true
            const matchText = searchText
                ? (item.judul || "").toLowerCase().includes(searchText.toLowerCase())
                : true
            return matchDate && matchText
        })
    }, [galeries, searchDate, searchText])

    // Group by date
    const grouped = useMemo(() => {
        const map = new Map<string, GaleriItem[]>()
        for (const item of filtered) {
            const key = toDateKey(item.createdAt)
            if (!map.has(key)) map.set(key, [])
            map.get(key)!.push(item)
        }
        return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
    }, [filtered])

    // Get unique dates for filter hint
    const uniqueDates = useMemo(() => {
        const dates = new Set(galeries.map((g) => toDateKey(g.createdAt)))
        return Array.from(dates).sort((a, b) => b.localeCompare(a))
    }, [galeries])

    return (
        <>
            {/* Filters */}
            <AnimationItem>
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <CalendarDays className="w-4 h-4 text-slate-400 shrink-0" />
                        <Input
                            type="date"
                            value={searchDate}
                            onChange={(e) => setSearchDate(e.target.value)}
                            className="h-9 rounded-xl bg-slate-50 border-slate-200 text-sm"
                        />
                        {searchDate && (
                            <button onClick={() => setSearchDate("")} className="p-1 hover:bg-slate-100 rounded-full">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <Input
                            placeholder="Cari judul foto..."
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            className="h-9 rounded-xl bg-slate-50 border-slate-200 text-sm"
                        />
                        {searchText && (
                            <button onClick={() => setSearchText("")} className="p-1 hover:bg-slate-100 rounded-full">
                                <X className="w-4 h-4 text-slate-400" />
                            </button>
                        )}
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                        {filtered.length} foto dari {uniqueDates.length} hari
                    </span>
                </div>
            </AnimationItem>

            {grouped.length === 0 ? (
                <AnimationItem>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                        <CalendarDays className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-500 font-medium">Tidak ada foto yang cocok dengan filter</p>
                        <button onClick={() => { setSearchDate(""); setSearchText("") }} className="text-xs text-primary-blue mt-2 hover:underline">
                            Reset filter
                        </button>
                    </div>
                </AnimationItem>
            ) : (
                grouped.map(([dateKey, items]) => (
                    <AnimationItem key={dateKey} className="space-y-3">
                        {/* Date Header */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-primary-blue/10 text-primary-blue px-3 py-1.5 rounded-full">
                                <CalendarDays className="w-3.5 h-3.5" />
                                <span className="text-xs font-bold">{formatDateLabel(items[0].createdAt)}</span>
                            </div>
                            <span className="text-xs text-slate-400">{items.length} foto</span>
                            <div className="h-px flex-1 bg-slate-100" />
                        </div>

                        {/* Photo Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden group">
                                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                                        <img
                                            src={item.fotoUrl}
                                            alt={item.judul || "Foto Galeri"}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={deletingId === item.id}
                                                variant="destructive"
                                                size="icon"
                                                className="rounded-full shadow-xl bg-red-500 hover:bg-red-600 w-9 h-9"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-2.5">
                                        <p className="font-medium text-slate-800 text-xs truncate">{item.judul || "Tanpa Judul"}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AnimationItem>
                ))
            )}
        </>
    )
}
