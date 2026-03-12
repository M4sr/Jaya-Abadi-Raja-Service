"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { Loader2, ArrowLeft, Image as ImageIcon } from "lucide-react"
import Link from "next/link"

const serviceSchema = z.object({
    nama: z.string().min(3, "Nama layanan minimal 3 karakter"),
    kategoriId: z.string().optional().nullable(),
    slug: z.string().optional(),
    deskripsi: z.string().optional(),
    deskripsiLengkap: z.string().optional(),
    hargaMulai: z.string().or(z.number()),
    estimasiMenit: z.string().or(z.number()),
    foto: z.string().optional(),
    isActive: z.boolean(),
    urutan: z.string().or(z.number()),
})

type ServiceFormValues = z.infer<typeof serviceSchema>

interface ServiceFormProps {
    initialData?: any
    categories?: any[]
}

export default function ServiceForm({ initialData, categories = [] }: ServiceFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [uploadingPhoto, setUploadingPhoto] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const form = useForm<ServiceFormValues>({
        resolver: zodResolver(serviceSchema),
        defaultValues: {
            nama: initialData?.nama || "",
            kategoriId: initialData?.kategoriId || "",
            slug: initialData?.slug || "",
            deskripsi: initialData?.deskripsi || "",
            deskripsiLengkap: initialData?.deskripsiLengkap || "",
            hargaMulai: initialData?.hargaMulai?.toString() || "0",
            estimasiMenit: initialData?.estimasiMenit?.toString() || "60",
            foto: initialData?.foto || "",
            isActive: initialData?.isActive ?? true,
            urutan: initialData?.urutan?.toString() || "0",
        },
    })

    async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingPhoto(true)
        try {
            const formData = new FormData()
            formData.append("file", file)

            const res = await fetch("/api/galeri", { method: "POST", body: formData })
            if (!res.ok) throw new Error("Upload gagal")

            const data = await res.json()
            // API returns 'fotoUrl' in the galeri object. Fallback to 'url' or 'foto' if needed.
            const url = data?.fotoUrl || data?.url || data?.foto
            
            if (url) {
                form.setValue("foto", url)
                toast.success("Foto berhasil diupload")
            } else {
                throw new Error("API tidak mengembalikan URL")
            }
        } catch (error) {
            console.error("Upload error:", error)
            // Use local preview URL ONLY for UI, but don't save it as the final value if it's a blob
            // Actually, keep it for preview but warn the user.
            const previewUrl = URL.createObjectURL(file)
            form.setValue("foto", previewUrl)
            toast.error("Upload gagal. Gambar hanya tersimpan sebagai preview lokal.")
        } finally {
            setUploadingPhoto(false)
        }
    }

    async function onSubmit(data: ServiceFormValues) {
        setIsLoading(true)
        try {
            const url = initialData ? `/api/layanan/${initialData.id}` : "/api/layanan"
            const method = initialData ? "PUT" : "POST"

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            })

            if (!response.ok) throw new Error("Gagal menyimpan data")

            toast.success(`Layanan berhasil ${initialData ? "diperbarui" : "ditambahkan"}`)
            router.push("/admin/layanan")
            router.refresh()
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-6 max-w-4xl">
            <div className="flex items-center gap-4">
                <Link href="/admin/layanan">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full border-slate-200">
                        <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-display font-bold text-slate-800">
                        {initialData ? "Edit Layanan" : "Tambah Layanan Baru"}
                    </h1>
                    <p className="text-slate-500 text-sm mt-1">Isi formulir di bawah untuk menyimpan data layanan</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left Column */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Nama Layanan *</label>
                                <Input {...form.register("nama")} placeholder="Misal: Cuci AC (Cleaning)" className="rounded-xl bg-slate-50" />
                                {form.formState.errors.nama && <p className="text-red-500 text-xs">{form.formState.errors.nama.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Kategori Layanan</label>
                                <Select 
                                    onValueChange={(val) => form.setValue("kategoriId", val === "unassigned" ? null : val)}
                                    value={form.watch("kategoriId") || "unassigned"}
                                >
                                    <SelectTrigger className="rounded-xl bg-slate-50">
                                        <SelectValue placeholder="Pilih Kategori">
                                            {form.watch("kategoriId") && form.watch("kategoriId") !== "unassigned"
                                                ? categories.find((cat: any) => cat.id === form.watch("kategoriId"))?.nama || "Pilih Kategori"
                                                : "Tanpa Kategori"}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unassigned">Tanpa Kategori</SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.nama}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Filter Slug URL</label>
                                <Input {...form.register("slug")} placeholder="Otomatis diisi jika kosong" className="rounded-xl bg-slate-50" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Deskripsi Singkat</label>
                                <Textarea {...form.register("deskripsi")} placeholder="Deskripsi pendek untuk card layanan" className="rounded-xl bg-slate-50 h-24" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Harga Mulai (Rp) *</label>
                                    <Input {...form.register("hargaMulai")} type="number" className="rounded-xl bg-slate-50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-slate-700">Estimasi Waktu (Menit) *</label>
                                    <Input {...form.register("estimasiMenit")} type="number" className="rounded-xl bg-slate-50" />
                                </div>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Foto Layanan</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer group h-48 relative overflow-hidden"
                                >
                                    {form.watch("foto") ? (
                                        <img src={form.watch("foto")} alt="Preview" className="h-full object-cover rounded-lg" />
                                    ) : (
                                        <>
                                            <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                                {uploadingPhoto ? (
                                                    <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
                                                ) : (
                                                    <ImageIcon className="w-6 h-6 text-slate-400" />
                                                )}
                                            </div>
                                            <p className="text-sm font-medium text-slate-600">
                                                {uploadingPhoto ? "Mengupload..." : "Klik untuk upload foto"}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">Rekomendasi: 800x600px (JPG/PNG)</p>
                                        </>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                />
                                {form.watch("foto") && (
                                    <button
                                        type="button"
                                        onClick={() => form.setValue("foto", "")}
                                        className="text-xs text-red-500 hover:text-red-700 mt-1"
                                    >
                                        Hapus foto
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                <div className="flex-1">
                                    <h4 className="font-semibold text-sm text-slate-800">Status Aktif</h4>
                                    <p className="text-xs text-slate-500">Layanan akan tampil di halaman publik jika Aktif</p>
                                </div>
                                <Switch
                                    checked={form.watch("isActive")}
                                    disabled={isLoading}
                                    onCheckedChange={(checked: boolean) => form.setValue("isActive", checked)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Urutan Tampil</label>
                                <Input {...form.register("urutan")} type="number" placeholder="0" className="rounded-xl bg-slate-50" />
                            </div>

                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex justify-end gap-4">
                        <Link href="/admin/layanan">
                            <Button type="button" variant="outline" className="rounded-xl px-6">
                                Batal
                            </Button>
                        </Link>
                        <Button type="submit" disabled={isLoading} className="bg-primary-blue hover:bg-primary-blue-medium text-white px-8 rounded-xl shadow-lg">
                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            {initialData ? "Simpan Perubahan" : "Simpan Layanan"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
