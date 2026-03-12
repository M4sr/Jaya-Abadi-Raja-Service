import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { 
    Calendar, 
    User, 
    ChevronLeft,
    Clock,
    Share2,
    MessageSquare,
    Eye,
    Newspaper
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import JsonLd from "@/components/seo/JsonLd"

interface ArticleDetailProps {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticleDetailProps) {
    const { slug } = await params
    const article = await prisma.article.findUnique({
        where: { slug: slug },
    })

    if (!article) return {}

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jayarepair.com"

    return {
        title: `${article.judul} | PT. Jaya Abadi Raja Service`,
        description: article.excerpt || article.metaDescription,
        openGraph: {
            title: article.metaTitle || article.judul,
            description: article.excerpt || article.metaDescription,
            url: `${baseUrl}/blog/${slug}`,
            images: article.foto ? [{ url: article.foto }] : [],
        }
    }
}

export default async function ArticleDetailPage({ params }: ArticleDetailProps) {
    const { slug } = await params
    const article = await prisma.article.findUnique({
        where: { slug: slug },
        include: { author: true }
    })

    if (!article || !article.isPublished) {
        notFound()
    }

    // Increment views
    await prisma.article.update({
        where: { id: article.id },
        data: { views: { increment: 1 } }
    })

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jayarepair.com"

    // Fetch related articles
    const related = await prisma.article.findMany({
        where: { 
            isPublished: true, 
            kategori: article.kategori,
            NOT: { id: article.id }
        },
        take: 3,
        orderBy: { publishedAt: 'desc' }
    })

    return (
        <main className="min-h-screen bg-[#F8FAFC] pb-32">
            <JsonLd data={{
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": article.judul,
                "image": article.foto ? [article.foto] : [],
                "datePublished": article.publishedAt?.toISOString(),
                "dateModified": article.updatedAt?.toISOString(),
                "author": [{
                    "@type": "Person",
                    "name": article.author.name,
                    "url": `${baseUrl}/tentang`
                }]
            }} />
            {/* Top Navigation Breadcrumb */}
            <nav className="bg-white border-b border-slate-200 pt-32 pb-4">
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <Link 
                        href="/blog" 
                        className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-600 font-bold uppercase tracking-tight text-xs transition-colors group"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Semua Artikel
                    </Link>
                    <div className="hidden md:flex items-center gap-4">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Bagikan:</span>
                        <div className="flex gap-2">
                            <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-100">
                                <Share2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 pt-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Main Content Area */}
                    <div className="lg:flex-1">
                        <header className="mb-10 lg:mb-12">
                            {/* Category Badge */}
                            <div className="inline-flex items-center px-4 py-1 bg-blue-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-blue-500/20">
                                {article.kategori}
                            </div>
                            
                            {/* Headline */}
                            <h1 className="text-4xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9] lg:leading-[0.85] uppercase">
                                {article.judul}
                            </h1>

                            {/* Professional Meta Info */}
                            <div className="flex flex-wrap items-center gap-6 pb-8 border-b border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white shadow-xl">
                                        {article.author.avatar ? (
                                            <Image src={article.author.avatar} alt={article.author.name} width={48} height={48} className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-6 h-6 m-3 text-slate-400" />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-black text-slate-900 leading-none">{article.author.name}</span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Professional Editorial</span>
                                    </div>
                                </div>
                                
                                <div className="h-8 w-px bg-slate-200 hidden sm:block" />

                                <div className="flex flex-wrap items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                            {article.publishedAt ? format(article.publishedAt, "dd MMMM yyyy", { locale: id }) : '-'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-blue-600" />
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{article.readingTimeMin} Min Read</span>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <article className="bg-white rounded-[48px] md:rounded-[64px] p-8 md:p-20 shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            {/* Decorative Background Glow for Article */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10" />

                            {/* Hero Image within Article */}
                            <div className="relative aspect-[16/9] lg:aspect-[21/9] rounded-[40px] overflow-hidden mb-12 md:mb-16 shadow-2xl group">
                                <Image 
                                    src={article.foto || "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=1000&auto=format&fit=crop"}
                                    alt={article.judul}
                                    fill
                                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            {/* Content Body */}
                            <div 
                                className="prose prose-slate prose-lg md:prose-xl max-w-none 
                                prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase prose-headings:text-slate-900
                                prose-p:text-slate-600 prose-p:leading-relaxed prose-p:mb-8
                                prose-strong:text-slate-900
                                prose-a:text-blue-600 prose-a:font-black prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-[40px] prose-img:shadow-2xl prose-img:my-16"
                                dangerouslySetInnerHTML={{ __html: article.konten }}
                            />

                            {/* Bottom Metadata & Sharing */}
                            <div className="mt-20 pt-12 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Filed Under:</span>
                                    <Badge className="bg-slate-100 text-slate-800 hover:bg-blue-600 hover:text-white border-0 px-6 py-2 rounded-xl font-black text-[10px] uppercase transition-all">{article.kategori}</Badge>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Spread The Word:</span>
                                    <div className="flex gap-2">
                                        <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all border border-slate-100 shadow-sm">
                                            <Share2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </article>

                        {/* Pagination / Author Sidebar Style on Mobile */}
                        <div className="mt-12 flex justify-start">
                            <Link href="/blog" className="inline-flex items-center gap-4 group px-8 py-4 bg-slate-900 text-white rounded-[24px] shadow-xl hover:bg-blue-600 transition-all">
                                <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                <span className="text-xs font-black uppercase tracking-widest">Wawasan Lainnya</span>
                            </Link>
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <aside className="w-full lg:w-[400px] space-y-12">
                        
                        {/* Related Articles Widget */}
                        {related.length > 0 && (
                            <div className="bg-white rounded-[48px] p-10 shadow-2xl shadow-slate-200/40 border border-slate-100">
                                <div className="flex items-center justify-between mb-10 pb-4 border-b border-slate-100">
                                    <h4 className="text-xl font-black text-slate-900 tracking-tighter uppercase flex items-center gap-3">
                                        <Newspaper className="w-6 h-6 text-blue-600" />
                                        Terkait
                                    </h4>
                                    <Link href="/blog" className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Semua</Link>
                                </div>
                                <div className="space-y-12">
                                    {related.map(item => (
                                        <Link href={`/blog/${item.slug}`} key={item.id} className="group block space-y-5">
                                            <div className="relative aspect-[16/10] rounded-[24px] overflow-hidden shadow-xl mb-6">
                                                <Image src={item.foto || ""} alt={item.judul} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
                                                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                            </div>
                                            <div className="space-y-3">
                                                <Badge className="bg-blue-50 text-blue-600 border-0 px-3 py-1 rounded-lg font-black text-[9px] uppercase tracking-widest mb-2">{item.kategori}</Badge>
                                                <h5 className="text-lg font-black text-slate-900 tracking-tight leading-[1.3] group-hover:text-blue-600 transition-colors line-clamp-3 uppercase">
                                                    {item.judul}
                                                </h5>
                                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.1em] pt-2">
                                                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {item.publishedAt ? format(item.publishedAt, "dd MMM yyyy") : '-'}</span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Professional CTA Card */}
                        <div className="bg-slate-900 rounded-[48px] p-10 shadow-[0_50px_100px_rgba(0,0,0,0.3)] text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/30 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-[24px] bg-blue-600 flex items-center justify-center text-white mb-10 shadow-2xl shadow-blue-500/40 group-hover:rotate-[15deg] transition-transform">
                                    <MessageSquare className="w-8 h-8" />
                                </div>
                                <h4 className="text-4xl font-black tracking-tighter uppercase mb-6 leading-[0.9]">Butuh <br /><span className="text-blue-500">Bantuan?</span></h4>
                                <p className="text-slate-400 text-base mb-12 leading-relaxed font-medium">Jangan biarkan AC Anda bermasalah. Konsultasikan dengan teknisi ahli kami secara gratis sekarang.</p>
                                <Link href="/booking">
                                    <button className="w-full py-6 bg-white text-slate-900 hover:bg-blue-600 hover:text-white rounded-[28px] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-2xl flex items-center justify-center gap-4 group/btn">
                                        Booking Sekarang
                                        <ChevronLeft className="w-5 h-5 rotate-180 group-hover/btn:translate-x-2 transition-transform" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </aside>

                </div>
            </div>
        </main>
    )
}
