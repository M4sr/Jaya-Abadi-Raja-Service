"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Loader2, Save, Globe, Phone, LayoutTemplate, Sparkles, X, Target, ImageIcon, MessageSquare } from "lucide-react"

interface SettingsFormProps {
    initialSettings: Record<string, string | null>
}

// These are defined in schema/seeds
// key: site_title, site_description, whatsapp_number, hero_title, hero_subtitle, about_text, ig_link, fb_link

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const router = useRouter()
    const [isSaving, setIsSaving] = useState(false)
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [showAiModal, setShowAiModal] = useState(false)
    const [namaUsaha, setNamaUsaha] = useState("Jaya Abadi Raja")
    const [lokasi, setLokasi] = useState("Kalimantan Selatan")
    const [logoUrl, setLogoUrl] = useState<string>(initialSettings.site_logo || "")
    const [isLogoUploading, setIsLogoUploading] = useState(false)
    const logoInputRef = useRef<HTMLInputElement>(null)

    const { register, handleSubmit, setValue } = useForm({
        defaultValues: {
            site_title: initialSettings.site_title || "",
            site_description: initialSettings.site_description || "",
            whatsapp_number: initialSettings.whatsapp_number || "",
            hero_title: initialSettings.hero_title || "",
            hero_subtitle: initialSettings.hero_subtitle || "",
            about_text: initialSettings.about_text || "",
            ig_link: initialSettings.ig_link || "",
            fb_link: initialSettings.fb_link || "",
            visi: initialSettings.visi || "",
            misi: initialSettings.misi || "",
            fonnte_token: initialSettings.fonnte_token || "",
        }
    })

    async function onSubmit(data: any) {
        setIsSaving(true)
        try {
            const payload = Object.entries(data).map(([key, value]) => ({
                key,
                value: value as string
            }))
            // Include logo separately (managed outside react-hook-form)
            payload.push({ key: "site_logo", value: logoUrl })

            const response = await fetch("/api/settings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) throw new Error("Gagal menyimpan pengaturan")

            toast.success("Pengaturan website berhasil diperbarui")
            router.refresh()
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
            console.error(error)
        } finally {
            setIsSaving(false)
        }
    }

    async function generateWithAI() {
        setIsAiLoading(true)
        try {
            const res = await fetch("/api/ai-settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ namaUsaha, lokasi }),
            })
            if (!res.ok) throw new Error("Gagal menghubungi AI")
            const data = await res.json()

            if (data.site_title) setValue("site_title", data.site_title)
            if (data.site_description) setValue("site_description", data.site_description)
            if (data.hero_title) setValue("hero_title", data.hero_title)
            if (data.hero_subtitle) setValue("hero_subtitle", data.hero_subtitle)
            if (data.about_text) setValue("about_text", data.about_text)
            if (data.visi) setValue("visi", data.visi)
            if (data.misi) setValue("misi", data.misi)

            toast.success("Konten website berhasil diisi oleh AI ✨")
            setShowAiModal(false)
        } catch {
            toast.error("Gagal menghubungi AI, coba lagi")
        } finally {
            setIsAiLoading(false)
        }
    }

    return (
        <>
            {/* AI Quick-fill Modal */}
            {showAiModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-violet-500" />
                                <h3 className="font-bold text-slate-800">Generate Konten dengan AI</h3>
                            </div>
                            <button onClick={() => setShowAiModal(false)} className="p-1 hover:bg-slate-100 rounded-full" disabled={isAiLoading}>
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="p-5 space-y-4">
                            <p className="text-sm text-slate-500">AI akan mengisi otomatis: <b>Nama Website, Deskripsi SEO, Hero Title, Tagline,</b> dan <b>Tentang Kami</b>.</p>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Nama Usaha</label>
                                <Input
                                    value={namaUsaha}
                                    onChange={(e) => setNamaUsaha(e.target.value)}
                                    placeholder="Jaya Abadi Raja"
                                    className="rounded-xl bg-slate-50"
                                    disabled={isAiLoading}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-slate-700">Kota / Lokasi</label>
                                <Input
                                    value={lokasi}
                                    onChange={(e) => setLokasi(e.target.value)}
                                    placeholder="Banjarmasin, Kalimantan Selatan"
                                    className="rounded-xl bg-slate-50"
                                    disabled={isAiLoading}
                                />
                            </div>

                            <p className="text-xs text-amber-600 bg-amber-50 rounded-xl p-3">
                                ⚠️ Field yang sudah terisi juga akan ditimpa. Pastikan ingin mengisi ulang sebelum klik Generate.
                            </p>
                        </div>

                        <div className="flex justify-end gap-2 px-5 py-4 bg-slate-50 border-t border-slate-100">
                            <Button type="button" variant="outline" onClick={() => setShowAiModal(false)} disabled={isAiLoading} className="rounded-xl">Batal</Button>
                            <Button
                                type="button"
                                onClick={generateWithAI}
                                disabled={isAiLoading || !namaUsaha.trim()}
                                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white rounded-xl shadow-md shadow-violet-200"
                            >
                                {isAiLoading
                                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> AI sedang menulis...</>
                                    : <><Sparkles className="w-4 h-4 mr-2" /> Generate Sekarang</>}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

                {/* AI Generate Banner */}
                <div className="flex items-center justify-between bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl px-5 py-4">
                    <div>
                        <p className="font-semibold text-violet-800 text-sm">Bingung mau isi apa?</p>
                        <p className="text-xs text-violet-600 mt-0.5">Biarkan AI menuliskan teks website Anda secara otomatis dalam hitungan detik.</p>
                    </div>
                    <Button
                        type="button"
                        onClick={() => setShowAiModal(true)}
                        className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-violet-200 flex items-center gap-2 shrink-0 ml-4"
                    >
                        <Sparkles className="w-4 h-4" />
                        ✨ Isi dengan AI
                    </Button>
                </div>

                {/* Seksi Identitas Website */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Globe className="w-5 h-5 text-primary-blue-medium" />
                        Identitas & SEO Website
                    </h3>

                    {/* Logo Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-700">Logo / Icon Website</label>
                        <div className="flex items-start gap-4">
                            {/* Preview box */}
                            <div
                                onClick={() => logoInputRef.current?.click()}
                                onDrop={async (e) => {
                                    e.preventDefault()
                                    const f = e.dataTransfer.files?.[0]
                                    if (!f) return
                                    const fd = new FormData(); fd.append("file", f)
                                    setIsLogoUploading(true)
                                    const res = await fetch("/api/upload-image", { method: "POST", body: fd })
                                    if (res.ok) { const { url } = await res.json(); setLogoUrl(url) }
                                    setIsLogoUploading(false)
                                }}
                                onDragOver={(e) => e.preventDefault()}
                                className="relative w-24 h-24 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 flex items-center justify-center cursor-pointer hover:border-primary-blue/40 transition-colors shrink-0 overflow-hidden"
                            >
                                {isLogoUploading ? (
                                    <Loader2 className="w-5 h-5 text-slate-400 animate-spin" />
                                ) : logoUrl ? (
                                    <>
                                        <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                                        <button
                                            type="button"
                                            onClick={(e) => { e.stopPropagation(); setLogoUrl("") }}
                                            className="absolute top-1 right-1 bg-white/90 rounded-full p-0.5 shadow text-slate-500 hover:text-red-500"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </>
                                ) : (
                                    <ImageIcon className="w-7 h-7 text-slate-300" />
                                )}
                            </div>
                            <div className="space-y-1.5 pt-1">
                                <p className="text-sm text-slate-600">Klik atau drag gambar ke kotak untuk mengupload logo.</p>
                                <p className="text-xs text-slate-400">PNG/WEBP dengan background transparan direkomendasikan. Maks 5MB.</p>
                                <p className="text-xs text-slate-400">Logo akan tampil di pojok kiri atas sidebar admin.</p>
                                <Button type="button" variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} className="rounded-xl text-xs mt-1">
                                    Pilih File
                                </Button>
                            </div>
                        </div>
                        <input ref={logoInputRef} type="file" accept="image/*" className="hidden"
                            onChange={async (e) => {
                                const f = e.target.files?.[0]
                                if (!f) return
                                const fd = new FormData(); fd.append("file", f)
                                setIsLogoUploading(true)
                                const res = await fetch("/api/upload-image", { method: "POST", body: fd })
                                if (res.ok) { const { url } = await res.json(); setLogoUrl(url) }
                                setIsLogoUploading(false)
                                e.target.value = ""
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Nama Website / Title</label>
                            <Input id="site_title" {...register("site_title")} placeholder="Misal: PT Jaya Service AC" className="rounded-xl bg-slate-50" />
                            <p className="text-xs text-slate-500">Akan tampil di tab browser pengunjung</p>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Deskripsi Singkat (SEO Meta)</label>
                            <Textarea {...register("site_description")} placeholder="Layanan service AC profesional..." className="rounded-xl bg-slate-50 h-[84px]" />
                        </div>
                    </div>
                </div>

                {/* Seksi Kontak & Sosmed */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Phone className="w-5 h-5 text-accent-green" />
                        Kontak & Sosial Media
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Nomor WhatsApp Admin</label>
                            <Input id="whatsapp_number" {...register("whatsapp_number")} placeholder="Contoh: 6281234567890" className="rounded-xl bg-slate-50" />
                            <p className="text-xs text-slate-500">Awali dengan 62 tanpa spasi/simbol</p>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Link Instagram</label>
                            <Input id="ig_link" {...register("ig_link")} placeholder="https://instagram.com/..." className="rounded-xl bg-slate-50" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Link Facebook</label>
                            <Input id="fb_link" {...register("fb_link")} placeholder="https://facebook.com/..." className="rounded-xl bg-slate-50" />
                        </div>
                    </div>
                </div>

                {/* Seksi Tampilan (Hero & Profil) */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <LayoutTemplate className="w-5 h-5 text-accent-cyan" />
                        Teks Halaman Utama (Homepage)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Banner Title (Hero)</label>
                            <Input id="hero_title" {...register("hero_title")} placeholder="Solusi Service AC Terbaik..." className="rounded-xl bg-slate-50" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Banner Subtitle / Tagline</label>
                            <Textarea {...register("hero_subtitle")} placeholder="Teks kecil di bawah banner title..." className="rounded-xl bg-slate-50" />
                        </div>
                        <div className="md:col-span-2 space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Teks Tentang Kami (Singkat)</label>
                            <Textarea {...register("about_text")} placeholder="Paragraf penjelasan di section Tentang Kami..." className="rounded-xl bg-slate-50 h-32" />
                        </div>
                    </div>
                </div>

                {/* Seksi Visi & Misi */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <Target className="w-5 h-5 text-rose-500" />
                        Visi & Misi Perusahaan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Visi</label>
                            <Textarea {...register("visi")} placeholder="Menjadi penyedia layanan service AC terpercaya dan profesional di Indonesia..." className="rounded-xl bg-slate-50 h-32" />
                            <p className="text-xs text-slate-500">Pernyataan tujuan jangka panjang perusahaan.</p>
                        </div>
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Misi</label>
                            <Textarea {...register("misi")} placeholder="1. Memberikan pelayanan cepat dan berkualitas&#10;2. Menggunakan teknisi berpengalaman..." className="rounded-xl bg-slate-50 h-32" />
                            <p className="text-xs text-slate-500">Langkah-langkah konkret untuk mencapai visi.</p>
                        </div>
                    </div>
                </div>

                {/* Seksi WhatsApp Gateway (Fonnte) */}
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                        WhatsApp Gateway (Fonnte)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <label className="text-sm font-semibold text-slate-700">Fonnte API Token</label>
                            <Input 
                                id="fonnte_token"
                                {...register("fonnte_token")} 
                                type="password"
                                placeholder="Masukkan token Fonnte Anda..." 
                                className="rounded-xl bg-slate-50" 
                            />
                            <p className="text-xs text-slate-500">Dapatkan token di dashboard <a href="https://fonnte.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Fonnte</a>.</p>
                        </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <p className="text-xs text-blue-700 leading-relaxed">
                            <b>Info:</b> Token ini digunakan untuk mengirim pesan otomatis ke pelanggan saat status pesanan diupdate (Konfirmasi, Teknisi Menuju Lokasi, Selesai, dll).
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                    <Button
                        type="submit"
                        disabled={isSaving}
                        className="bg-primary-blue hover:bg-primary-blue-medium text-white px-8 py-6 rounded-xl shadow-lg shadow-blue-500/20 font-bold"
                    >
                        {isSaving ? (
                            <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        ) : (
                            <Save className="w-5 h-5 mr-3" />
                        )}
                        Simpan Semua Pengaturan
                    </Button>
                </div>

            </form>
        </>
    )
}
