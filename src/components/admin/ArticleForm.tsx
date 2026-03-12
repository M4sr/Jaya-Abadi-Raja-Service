"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Image as ImageIcon, Send, Save, X, Sparkles } from "lucide-react"
import Link from "next/link"
import { RichTextEditor } from "@/components/ui/rich-text-editor"
import AIWriterDialog from "./AIWriterDialog"

export default function ArticleForm({ initialData }: { initialData?: any }) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [isCoverUploading, setIsCoverUploading] = useState(false)
    const [isAiLoading, setIsAiLoading] = useState(false)
    const coverInputRef = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            judul: initialData?.judul || "",
            kategori: initialData?.kategori || "Umum",
            slug: initialData?.slug || "",
            excerpt: initialData?.excerpt || "",
            konten: initialData?.konten || "",
            foto: initialData?.foto || "",
            tags: initialData?.tags?.join(", ") || "",
            isPublished: initialData?.isPublished ?? true,
            metaTitle: initialData?.metaTitle || "",
            metaDescription: initialData?.metaDescription || "",
            metaKeywords: initialData?.metaKeywords || "",
        }
    })

    const konten = watch("konten")

    async function generateSEO() {
        const judul = watch("judul")
        if (!judul.trim()) {
            toast.error("Isi Judul Artikel terlebih dahulu")
            return
        }
        setIsAiLoading(true)
        try {
            const res = await fetch("/api/ai-seo", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    judul,
                    konten: watch("konten"),
                    excerpt: watch("excerpt"),
                }),
            })
            if (!res.ok) throw new Error("Gagal menghubungi AI")
            const data = await res.json()
            if (data.metaTitle) setValue("metaTitle", data.metaTitle)
            if (data.metaDescription) setValue("metaDescription", data.metaDescription)
            if (data.metaKeywords) setValue("metaKeywords", data.metaKeywords)
            if (data.excerpt && !watch("excerpt").trim()) setValue("excerpt", data.excerpt)
            toast.success("SEO berhasil diisi oleh AI ✨")
        } catch {
            toast.error("Gagal menghubungi AI, coba lagi")
        } finally {
            setIsAiLoading(false)
        }
    }

    function handleAIContentGenerated(data: any) {
        setValue("judul", data.judul)
        setValue("konten", data.konten)
        setValue("excerpt", data.excerpt)
        setValue("metaTitle", data.metaTitle)
        setValue("metaDescription", data.metaDescription)
        setValue("metaKeywords", data.metaKeywords)
        setValue("kategori", data.kategori)
        setValue("tags", data.tags)
    }

    async function onSubmit(data: any) {
        if (!data.judul || !data.konten) {
            toast.error("Judul dan Konten wajib diisi")
            return
        }

        setIsLoading(true)
        try {
            // Parse tags
            const parsedTags = data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)

            const payload = {
                ...data,
                tags: parsedTags,
            }

            const url = initialData ? `/api/blog/${initialData.id}` : "/api/blog"
            const method = initialData ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || "Gagal menyimpan artikel")
            }

            toast.success(`Artikel berhasil ${initialData ? "diperbarui" : "ditambahkan"}`)
            router.push("/admin/blog")
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan sistem")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 w-full pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/blog">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200">
                            <ArrowLeft className="w-5 h-5 text-slate-600" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">
                            {initialData ? "Edit Artikel" : "Tulis Artikel Baru"}
                        </h1>
                        <p className="text-slate-500 text-sm mt-1">Buat konten edukasi & SEO untuk website</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Kolom Kiri - Main Content Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Judul Artikel *</label>
                            <Input {...register("judul")} placeholder="Cara Merawat AC Agar..." className="rounded-xl bg-slate-50 text-base" />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <label className="text-sm font-semibold text-slate-700">Isi Konten *</label>
                                <AIWriterDialog onGenerated={handleAIContentGenerated} />
                            </div>
                            <RichTextEditor
                                content={konten}
                                onChange={(html) => setValue("konten", html)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Kutipan / Excerpt (Opsional)</label>
                            <Textarea {...register("excerpt")} placeholder="Ringkasan singkat artikel (tampil di daftar artikel desain card)..." className="rounded-xl bg-slate-50 h-24" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-lg text-slate-800">Meta & SEO Info</h3>
                            <Button
                                type="button"
                                onClick={generateSEO}
                                disabled={isAiLoading}
                                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-violet-200 flex items-center gap-2"
                            >
                                {isAiLoading
                                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                    : <Sparkles className="w-3.5 h-3.5" />}
                                {isAiLoading ? "AI sedang mengisi..." : "✨ Isi Otomatis dengan AI"}
                            </Button>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Meta Title</label>
                            <Input {...register("metaTitle")} placeholder="Default menggunakan Judul" className="rounded-xl bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Meta Description</label>
                            <Textarea {...register("metaDescription")} placeholder="Default menggunakan Excerpt..." className="rounded-xl bg-slate-50 h-20" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Meta Keywords</label>
                            <Input {...register("metaKeywords")} placeholder="service ac, perawatan ac, (pisahkan dengan koma)" className="rounded-xl bg-slate-50" />
                        </div>
                    </div>
                </div>

                {/* Kolom Kanan - Settings & Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 space-y-6 sticky top-24">

                        <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm text-slate-800">Status Publish</h4>
                                <p className="text-xs text-slate-500">Tampilkan ke publik</p>
                            </div>
                            <Switch
                                checked={watch("isPublished")}
                                disabled={isLoading}
                                onCheckedChange={(checked: boolean) => setValue("isPublished", checked)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Kategori</label>
                            <Input {...register("kategori")} placeholder="Umum, Tips, Berita" className="rounded-xl bg-slate-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Tags</label>
                            <Input {...register("tags")} placeholder="Tag 1, Tag 2, Tag 3" className="rounded-xl bg-slate-50 text-xs" />
                            <p className="text-[10px] text-slate-400">Pisahkan dengan tanda koma.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Custom Slug (URL)</label>
                            <Input {...register("slug")} placeholder="Otomatis dari judul jika kosong" className="rounded-xl bg-slate-50" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Cover Image</label>
                            <div
                                onClick={() => coverInputRef.current?.click()}
                                onDrop={async (e) => {
                                    e.preventDefault()
                                    const f = e.dataTransfer.files?.[0]
                                    if (f) {
                                        const fd = new FormData(); fd.append("file", f)
                                        setIsCoverUploading(true)
                                        const res = await fetch("/api/upload-image", { method: "POST", body: fd })
                                        if (res.ok) { const { url } = await res.json(); setValue("foto", url) }
                                        setIsCoverUploading(false)
                                    }
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                className="border-2 border-dashed border-slate-200 rounded-xl overflow-hidden bg-slate-50 cursor-pointer hover:border-primary-blue/40 transition-colors relative aspect-video flex items-center justify-center"
                            >
                                {isCoverUploading ? (
                                    <div className="flex flex-col items-center gap-2 text-slate-400">
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                        <span className="text-xs">Mengupload...</span>
                                    </div>
                                ) : watch("foto") ? (
                                    <>
                                        <img src={watch("foto")} alt="Cover" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setValue("foto", "") }}
                                            className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow text-slate-600 hover:text-red-500"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center text-slate-400 p-4">
                                        <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        <span className="text-xs font-medium">Klik atau drag gambar</span>
                                        <p className="text-[10px] mt-0.5">JPG, PNG, WEBP — Maks. 5MB</p>
                                    </div>
                                )}
                            </div>
                            <input ref={coverInputRef} type="file" accept="image/*" className="hidden"
                                onChange={async (e) => {
                                    const f = e.target.files?.[0]
                                    if (!f) return
                                    const fd = new FormData(); fd.append("file", f)
                                    setIsCoverUploading(true)
                                    const res = await fetch("/api/upload-image", { method: "POST", body: fd })
                                    if (res.ok) { const { url } = await res.json(); setValue("foto", url) }
                                    setIsCoverUploading(false)
                                    e.target.value = ""
                                }}
                            />
                        </div>

                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <Button type="submit" disabled={isLoading} className="w-full bg-primary-blue hover:bg-primary-blue-medium text-white shadow-lg py-5 rounded-xl font-bold">
                                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                                {initialData ? "Simpan Perubahan" : "Terbitkan Artikel"}
                            </Button>
                            <Link href="/admin/blog">
                                <Button type="button" variant="ghost" className="w-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl">
                                    Batal
                                </Button>
                            </Link>
                        </div>

                    </div>
                </div>

            </form>
        </div>
    )
}
