"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, ArrowUpDown, Search, X } from "lucide-react"
import Link from "next/link"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { DataTablePagination } from "@/components/admin/DataTablePagination"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface LayananClientProps {
    layanans: any[];
    categories?: any[];
    totalItems: number;
    page: number;
    limit: number;
    sort: string;
    order: string;
    q?: string;
    kategori?: string;
    totalPages: number;
    onDelete: (id: string) => Promise<void>;
}

export default function LayananClient({
    layanans,
    categories = [],
    totalItems,
    page,
    limit,
    sort,
    order,
    q = "",
    kategori = "all",
    totalPages,
    onDelete
}: LayananClientProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [inputValue, setInputValue] = useState(q)

    // Sync input with URL param q (e.g. when reset button is pressed)
    useEffect(() => {
        setInputValue(q)
    }, [q])

    // Debounced URL update
    useEffect(() => {
        if (inputValue === q) return

        const timer = setTimeout(() => {
            updateFilter('q', inputValue)
        }, 500)

        return () => clearTimeout(timer)
    }, [inputValue, q])

    // Helper to update URL params
    const updateFilter = (type: 'q' | 'kategori', value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', '1') // Reset page on new filter
        
        if (value && value !== 'all') {
            params.set(type, value)
        } else {
            params.delete(type)
        }
        
        router.push(`${pathname}?${params.toString()}`)
    }

    const resetFilter = () => {
        router.push(pathname)
    }

    const hasActiveFilters = q !== "" || (kategori && kategori !== "all")
    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Manajemen Layanan</h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola daftar layanan AC yang ditawarkan ke pelanggan</p>
                    </div>
                    <Link href="/admin/layanan/tambah">
                        <Button className="bg-primary-blue hover:bg-primary-blue-medium text-white shadow-lg rounded-xl">
                            <Plus className="w-4 h-4 mr-2" /> Tambah Layanan
                        </Button>
                    </Link>
                </div>
            </AnimationItem>

            <AnimationItem>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* Filter Bar */}
                    <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/50">
                        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-4 flex-1">
                            <div className="relative max-w-sm w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input 
                                    placeholder="Cari layanan berdasarkan nama..." 
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    className="pl-9 bg-white border-slate-200"
                                />
                            </div>
                            
                            <Select 
                                value={kategori} 
                                onValueChange={(val) => updateFilter('kategori', val || 'all')}
                            >
                                <SelectTrigger className="w-full sm:w-[200px] bg-white border-slate-200">
                                    <SelectValue placeholder="Pilih Kategori">
                                        {kategori && kategori !== 'all' 
                                            ? categories.find((cat: any) => cat.id === kategori)?.nama || "Pilih Kategori"
                                            : "Semua Kategori"}
                                    </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Semua Kategori</SelectItem>
                                    {categories?.map((cat) => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.nama}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {hasActiveFilters && (
                            <Button variant="ghost" onClick={resetFilter} className="text-slate-500 hover:text-slate-800">
                                <X className="w-4 h-4 mr-2" /> Reset Filter
                            </Button>
                        )}
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 w-16 text-center cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/layanan?sort=urutan&order=${sort === 'urutan' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center justify-center gap-1">
                                            No
                                            {sort === 'urutan' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 w-24 text-center">Foto</th>
                                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/layanan?sort=nama&order=${sort === 'nama' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Nama Layanan
                                            {sort === 'nama' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4">Kategori & Deskripsi</th>
                                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/layanan?sort=hargaMulai&order=${sort === 'hargaMulai' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Estimasi Harga
                                            {sort === 'hargaMulai' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-center w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {layanans.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-8 text-center text-slate-500">
                                            Belum ada data layanan.
                                        </td>
                                    </tr>
                                ) : (
                                    layanans.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-center font-medium">{(page - 1) * limit + idx + 1}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 mx-auto">
                                                    {item.foto ? (
                                                        <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">No Img</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{item.nama}</td>
                                            <td className="px-6 py-4">
                                                <Badge variant="outline" className="mb-2 bg-slate-50 text-slate-500 font-medium">
                                                    {item.kategori?.nama || 'Tanpa Kategori'}
                                                </Badge>
                                                <p className="line-clamp-2 text-slate-500">{item.deskripsi || "-"}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-accent-green font-bold block">Rp {item.hargaMulai.toLocaleString('id-ID')}</span>
                                                <span className="text-xs text-slate-400">~{item.estimasiMenit} menit</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {item.isActive ? (
                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-normal">Aktif</Badge>
                                                ) : (
                                                    <Badge className="bg-slate-100 text-slate-800 hover:bg-slate-100 font-normal">Nonaktif</Badge>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/admin/layanan/${item.id}/edit`}>
                                                        <Button variant="outline" size="icon" className="h-8 w-8 text-primary-blue-medium border-primary-blue-medium/20 hover:bg-blue-50">
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Button
                                                        onClick={() => onDelete(item.id)}
                                                        variant="outline" size="icon" className="h-8 w-8 text-accent-red border-red-200 hover:bg-red-50 hover:text-red-700"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
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
