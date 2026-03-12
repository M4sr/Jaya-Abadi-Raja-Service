"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, Plus, Upload, FileText, Image as ImageIcon, X, FilePlus } from "lucide-react"

export default function AddLegalitasDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [namaDokumen, setNamaDokumen] = useState("")
    const [urutan, setUrutan] = useState("0")
    
    // Cover Image State
    const [selectedCover, setSelectedCover] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string>("")
    const coverInputRef = useRef<HTMLInputElement>(null)

    // Document File State
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string>("")
    const [fileType, setFileType] = useState<"pdf" | "image" | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Cover harus berupa file gambar")
            return
        }
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Ukuran cover maksimal 5MB")
            return
        }

        setSelectedCover(file)
        setCoverPreview(URL.createObjectURL(file))
    }

    function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        const isPdf = file.type === "application/pdf"
        const isImage = file.type.startsWith("image/")

        if (!isPdf && !isImage) {
            toast.error("Hanya file PDF atau gambar yang diizinkan untuk dokumen")
            return
        }
        if (file.size > 15 * 1024 * 1024) {
            toast.error("Ukuran file dokumen maksimal 15MB")
            return
        }

        setSelectedFile(file)
        setFileType(isPdf ? "pdf" : "image")
        setFilePreview(URL.createObjectURL(file))

        // Auto-fill nama dokumen from filename if still empty
        if (!namaDokumen.trim()) {
            const autoName = file.name
                .replace(/\.[^/.]+$/, "")
                .replace(/[-_]/g, " ")
                .replace(/\b\w/g, (c) => c.toUpperCase())
            setNamaDokumen(autoName)
        }
    }

    function resetCover() {
        setSelectedCover(null)
        setCoverPreview("")
        if (coverInputRef.current) coverInputRef.current.value = ""
    }

    function resetFile() {
        setSelectedFile(null)
        setFilePreview("")
        setFileType(null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    function handleClose() {
        setOpen(false)
        setNamaDokumen("")
        setUrutan("0")
        resetCover()
        resetFile()
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!namaDokumen.trim()) {
            toast.error("Nama dokumen wajib diisi")
            return
        }
        if (!selectedFile) {
            toast.error("Pilih file dokumen terlebih dahulu")
            return
        }
        if (!selectedCover) {
            toast.error("Pilih cover dokumen terlebih dahulu")
            return
        }

        setIsLoading(true)
        try {
            const formData = new FormData()
            formData.append("file", selectedFile)
            formData.append("cover", selectedCover)
            formData.append("namaDokumen", namaDokumen)
            formData.append("urutan", urutan)

            const response = await fetch("/api/legalitas", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || "Gagal mengupload dokumen")
            }

            toast.success("Dokumen & Cover berhasil ditambahkan")
            handleClose()
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan sistem")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button onClick={() => setOpen(true)} className="bg-primary-blue hover:bg-primary-blue-medium text-white shadow-lg rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Tambah Dokumen
            </Button>
            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[550px] overflow-hidden">
                    <DialogHeader>
                        <DialogTitle>Tambah Legalitas & Cover</DialogTitle>
                        <DialogDescription>
                            Lengkapi data legalitas dengan Cover (Thumbnail) dan File Utama.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-6 pt-2 w-full">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Nama Dokumen *</label>
                            <Input
                                value={namaDokumen}
                                onChange={(e) => setNamaDokumen(e.target.value)}
                                placeholder="Misal: Sertifikat ISO 9001"
                                className="rounded-xl"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* File 1: Cover Image */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">1. Cover Utama (Gambar)</label>
                                {selectedCover ? (
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm group">
                                        <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button type="button" variant="destructive" size="icon" onClick={resetCover} className="rounded-full">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div 
                                        onClick={() => coverInputRef.current?.click()}
                                        className="aspect-[3/4] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-blue-400/50 cursor-pointer transition-all group"
                                    >
                                        <div className="p-3 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <ImageIcon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Upload Cover</p>
                                    </div>
                                )}
                                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                            </div>

                            {/* File 2: Document Resource */}
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">2. File Dokumen (PDF/JPG)</label>
                                {selectedFile ? (
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-100 bg-slate-50 shadow-sm group flex flex-col items-center justify-center p-4">
                                        {fileType === "pdf" ? (
                                            <>
                                                <FileText className="w-12 h-12 text-red-500 mb-2" />
                                                <p className="text-[10px] font-bold text-slate-600 text-center line-clamp-2">{selectedFile.name}</p>
                                            </>
                                        ) : (
                                            <img src={filePreview} alt="File Preview" className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button type="button" variant="destructive" size="icon" onClick={resetFile} className="rounded-full">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ) : (
                                    <div 
                                        onClick={() => fileInputRef.current?.click()}
                                        className="aspect-[3/4] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 hover:border-red-400/50 cursor-pointer transition-all group"
                                    >
                                        <div className="p-3 bg-white rounded-2xl shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <FilePlus className="w-6 h-6 text-red-500" />
                                        </div>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Upload Dokumen</p>
                                    </div>
                                )}
                                <input ref={fileInputRef} type="file" accept=".pdf,image/*" className="hidden" onChange={handleFileSelect} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Urutan Tampil</label>
                            <Input
                                type="number"
                                value={urutan}
                                onChange={(e) => setUrutan(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={handleClose} className="rounded-xl h-12 px-6">Batal</Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !selectedFile || !selectedCover || !namaDokumen.trim()}
                                className="bg-primary-blue hover:bg-primary-blue-medium text-white rounded-xl h-12 px-8 shadow-lg shadow-blue-500/20 transition-all"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengupload...</>
                                ) : (
                                    "Simpan Legalitas"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
