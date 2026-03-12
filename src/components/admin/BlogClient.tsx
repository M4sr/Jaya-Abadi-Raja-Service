"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, Pencil, Trash2, Eye, Clock, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import { DataTablePagination } from "@/components/admin/DataTablePagination"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface BlogClientProps {
    articles: any[];
    totalItems: number;
    page: number;
    limit: number;
    sort: string;
    order: string;
    totalPages: number;
    onDelete: (id: string) => Promise<void>;
}

export default function BlogClient({
    articles,
    totalItems,
    page,
    limit,
    sort,
    order,
    totalPages,
    onDelete
}: BlogClientProps) {
    const formatDate = (dateValue: any) => {
        const date = new Date(dateValue)
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
    }

    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Artikel & Blog</h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola konten edukasi, tips, dan berita untuk SEO</p>
                    </div>
                    <Link href="/admin/blog/tambah">
                        <Button className="bg-primary-blue hover:bg-primary-blue-medium text-white shadow-lg rounded-xl">
                            <Plus className="w-4 h-4 mr-2" /> Tulis Artikel
                        </Button>
                    </Link>
                </div>
            </AnimationItem>

            <AnimationItem>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 w-16 text-center">No</th>
                                    <th className="px-6 py-4 w-24 text-center">Cover</th>
                                    <th className="px-6 py-4 min-w-[300px] cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/blog?sort=judul&order=${sort === 'judul' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Judul & Kategori
                                            {sort === 'judul' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/blog?sort=isPublished&order=${sort === 'isPublished' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Status & Info
                                            {sort === 'isPublished' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/blog?sort=views&order=${sort === 'views' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center justify-center gap-1">
                                            Stats
                                            {sort === 'views' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 text-center w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {articles.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                            Belum ada artikel. Mulai menulis untuk meningkatkan SEO Anda.
                                        </td>
                                    </tr>
                                ) : (
                                    articles.map((item, idx) => (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-center font-medium">{(page - 1) * limit + idx + 1}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="w-16 h-12 bg-slate-100 rounded overflow-hidden border border-slate-200 mx-auto">
                                                    {item.foto ? (
                                                        <img src={item.foto} alt={item.judul} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">No Img</div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800 text-base mb-1">{item.judul}</div>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-normal">
                                                        {item.kategori}
                                                    </Badge>
                                                    <span>Oleh {item.author.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {item.isPublished ? (
                                                    <div>
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 font-normal border-0 mb-1">Published</Badge>
                                                        <div className="flex items-center text-xs text-slate-500">
                                                            <Clock className="w-3 h-3 mr-1" /> {item.publishedAt ? formatDate(item.publishedAt) : '-'}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <Badge className="bg-slate-100 text-slate-600 hover:bg-slate-100 font-normal border-0 mb-1">Draft</Badge>
                                                        <div className="flex items-center text-xs text-slate-500">
                                                            <Clock className="w-3 h-3 mr-1" /> {formatDate(item.updatedAt)}
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-center text-slate-500">
                                                <div className="flex items-center justify-center gap-1" title={`${item.views} Views`}>
                                                    <Eye className="w-4 h-4" /> <span className="font-medium">{item.views}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-center gap-2">
                                                    <Link href={`/admin/blog/${item.id}/edit`}>
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
