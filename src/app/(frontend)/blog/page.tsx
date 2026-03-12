import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import prisma from "@/lib/prisma"
import { 
    Newspaper, 
    Calendar, 
    User, 
    ChevronRight, 
    Clock,
    Search,
    TrendingUp,
    MessageSquare,
    Zap,
    ArrowRight,
    Eye
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { id } from "date-fns/locale"

export const metadata = {
    title: 'Warta & Wawasan | Jaya Abadi Raja Service AC',
    description: 'Pusat informasi, tips perawatan AC, dan wawasan profesional seputar kenyamanan udara ruangan di Pekanbaru.',
}

export default async function BlogPage() {
    const articles = await prisma.article.findMany({
        where: { isPublished: true },
        orderBy: { publishedAt: 'desc' },
        include: { author: true }
    })

    // Separate featured and others
    const featuredArticle = articles[0]
    const secondaryArticles = articles.slice(1, 4)
    const feedArticles = articles.slice(4)

    // Trending logic (by views)
    const trendingArticles = [...articles]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5)

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-32">
            {/* Top Minimal Header */}
            <header className="bg-white border-b border-slate-200 pt-32 pb-12">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-2">
                            <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.4em] block">Professional Editorial</span>
                            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                                WARTA & <span className="text-blue-600">WAWASAN</span>
                            </h1>
                        </div>
                        <p className="text-slate-500 font-medium max-w-md md:text-right text-sm">
                            Informasi terkini seputar perawatan pendingin ruangan, efisiensi energi, dan solusi teknis terpercaya.
                        </p>
                    </div>
                </div>
            </header>

            {/* Main Portal Section */}
            <div className="max-w-7xl mx-auto px-6 pt-12">
                
                {/* 1. Featured Hero Story (Yahoo Style) */}
                {featuredArticle && (
                    <section className="mb-16">
                        <Link 
                            href={`/blog/${featuredArticle.slug}`}
                            className="group relative flex flex-col lg:flex-row bg-white rounded-[40px] md:rounded-[56px] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-blue-200/40"
                        >
                            <div className="lg:w-[65%] relative aspect-[16/9] lg:aspect-auto overflow-hidden">
                                <Image 
                                    src={featuredArticle.foto || "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop"}
                                    alt={featuredArticle.judul}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute top-8 left-8">
                                    <Badge className="bg-blue-600 text-white border-0 px-6 py-2 rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/30">
                                        FEATURED STORY
                                    </Badge>
                                </div>
                            </div>
                            <div className="lg:w-[35%] p-8 md:p-14 flex flex-col justify-center bg-white">
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-4 inline-block">{featuredArticle.kategori}</span>
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter uppercase leading-[1.1] mb-6 group-hover:text-blue-600 transition-colors">
                                    {featuredArticle.judul}
                                </h2>
                                <p className="text-slate-500 text-sm md:text-base leading-relaxed line-clamp-3 mb-8">
                                    {featuredArticle.excerpt}
                                </p>
                                <div className="flex items-center gap-4 pt-6 border-t border-slate-100 mt-auto">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                                        {featuredArticle.author.avatar ? (
                                            <Image src={featuredArticle.author.avatar} alt={featuredArticle.author.name} width={40} height={40} />
                                        ) : (
                                            <User className="w-5 h-5 m-2.5 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-black text-slate-900 leading-none">{featuredArticle.author.name}</span>
                                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            {featuredArticle.publishedAt ? format(featuredArticle.publishedAt, "dd MMMM yyyy", { locale: id }) : '-'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </section>
                )}

                {/* 2. Dashboard Grid & Sidebar */}
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Main Content Column */}
                    <div className="lg:flex-1 space-y-16">
                        
                        {/* Secondary Secondary Grid */}
                        {secondaryArticles.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Berita Terpopuler</h3>
                                    <div className="h-px flex-1 bg-slate-200" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {secondaryArticles.map(article => (
                                        <Link 
                                            href={`/blog/${article.slug}`} 
                                            key={article.id}
                                            className="group flex flex-col bg-white rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/40 border border-slate-100 hover:-translate-y-2 transition-all duration-500"
                                        >
                                            <div className="relative aspect-[16/10] overflow-hidden">
                                                <Image 
                                                    src={article.foto || "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop"}
                                                    alt={article.judul}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 left-4">
                                                    <Badge className="bg-white/90 backdrop-blur-md text-slate-900 border-0 px-3 py-1 rounded-lg font-black uppercase tracking-widest text-[8px]">
                                                        {article.kategori}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <div className="p-8 space-y-4">
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight leading-snug group-hover:text-blue-600 transition-colors uppercase line-clamp-2">
                                                    {article.judul}
                                                </h4>
                                                <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest pt-4 border-t border-slate-50">
                                                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {article.publishedAt ? format(article.publishedAt, "dd MMM yyyy") : '-'}</span>
                                                    <span className="flex items-center gap-2"><Eye className="w-3.5 h-3.5" /> {article.views} Views</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Articles Feed List */}
                        {feedArticles.length > 0 && (
                            <section>
                                <div className="flex items-center gap-4 mb-8">
                                    <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Arsip Warta</h3>
                                    <div className="h-px flex-1 bg-slate-200" />
                                </div>
                                <div className="space-y-8">
                                    {feedArticles.map(article => (
                                        <Link 
                                            href={`/blog/${article.slug}`} 
                                            key={article.id}
                                            className="group grid grid-cols-1 sm:grid-cols-12 gap-6 items-start bg-white p-4 rounded-[40px] shadow-lg shadow-slate-200/30 border border-slate-50 hover:border-blue-100 hover:shadow-2xl transition-all"
                                        >
                                            <div className="sm:col-span-4 relative aspect-[16/10] sm:aspect-square rounded-[28px] overflow-hidden shadow-md">
                                                <Image 
                                                    src={article.foto || ""} 
                                                    alt={article.judul} 
                                                    fill 
                                                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                                                />
                                            </div>
                                            <div className="sm:col-span-8 py-2 pr-4 flex flex-col h-full">
                                                <Badge className="bg-blue-50 text-blue-600 border-0 px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest w-max mb-3">
                                                    {article.kategori}
                                                </Badge>
                                                <h4 className="text-xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors uppercase line-clamp-2 mb-3">
                                                    {article.judul}
                                                </h4>
                                                <p className="text-slate-500 text-sm line-clamp-2 mb-6 font-medium">
                                                    {article.excerpt}
                                                </p>
                                                <div className="mt-auto flex items-center gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /> {article.publishedAt ? format(article.publishedAt, "dd MMM yyyy") : '-'}</span>
                                                    <span className="flex items-center gap-2"><User className="w-3.5 h-3.5" /> {article.author.name}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {articles.length === 0 && (
                            <div className="bg-white p-20 rounded-[48px] shadow-xl text-center border border-dashed border-slate-200 flex flex-col items-center gap-6">
                                <div className="p-6 bg-slate-50 rounded-full text-slate-400">
                                    <Search className="w-12 h-12" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Belum Ada Berita</h3>
                                <Link href="/">
                                    <Badge className="bg-slate-900 text-white cursor-pointer hover:bg-slate-800 px-8 py-2 rounded-full border-0 font-bold uppercase tracking-widest text-xs">Kembali Beranda</Badge>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Column */}
                    <aside className="w-full lg:w-[380px] space-y-12">
                        
                        {/* Trending Section */}
                        <div className="bg-white rounded-[40px] p-10 shadow-2xl shadow-slate-200/50 border border-slate-100">
                            <div className="flex items-center gap-3 mb-10 pb-4 border-b border-slate-100">
                                <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-orange-500" />
                                </div>
                                <h4 className="text-lg font-black text-slate-900 tracking-tighter uppercase">Hot Topics</h4>
                            </div>
                            <div className="space-y-10">
                                {trendingArticles.map((article, idx) => (
                                    <Link key={article.id} href={`/blog/${article.slug}`} className="group relative flex gap-6">
                                        <span className="text-4xl font-black text-slate-100 group-hover:text-blue-50 transition-colors leading-none tracking-tighter">{idx + 1}</span>
                                        <div className="space-y-2 pt-1 border-t border-slate-200 w-full group-hover:border-blue-100 transition-colors">
                                            <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{article.kategori}</p>
                                            <h5 className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight leading-snug uppercase line-clamp-2">
                                                {article.judul}
                                            </h5>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Newsletter/Booking CTA */}
                        <div className="bg-slate-900 rounded-[40px] p-10 shadow-2xl text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10">
                                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white mb-8 shadow-xl">
                                    <Zap className="w-7 h-7" />
                                </div>
                                <h4 className="text-3xl font-black tracking-tighter uppercase mb-4 leading-tight">Jangan Lewatkan <br /><span className="text-blue-500">Udara Sejuk</span></h4>
                                <p className="text-slate-400 text-sm mb-10 leading-relaxed font-medium">Dapatkan penawaran eksklusif dan tips perawatan AC rahasia langsung di HP Anda.</p>
                                <Link href="/booking">
                                    <button className="w-full py-5 bg-blue-600 hover:bg-white hover:text-slate-900 rounded-[24px] font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-3">
                                        Pesan Sekarang
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>

                        {/* Editorial Stats Widget */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg text-center">
                                <div className="text-2xl font-black text-slate-900">{articles.length}</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Articles</div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg text-center">
                                <div className="text-2xl font-black text-slate-900">10+</div>
                                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Experts</div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    )
}
