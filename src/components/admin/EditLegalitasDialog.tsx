"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Loader2, Pencil, Upload, FileText, Image as ImageIcon, X, FileEdit } from "lucide-react"

interface EditLegalitasDialogProps {
    document: {
        id: string
        namaDokumen: string
        fileUrl: string
        coverUrl: string | null
        urutan: number
    }
}

export default function EditLegalitasDialog({ document }: EditLegalitasDialogProps) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [namaDokumen, setNamaDokumen] = useState(document.namaDokumen)
    const [urutan, setUrutan] = useState(document.urutan.toString())
    
    // Cover Image State
    const [selectedCover, setSelectedCover] = useState<File | null>(null)
    const [coverPreview, setCoverPreview] = useState<string>(document.coverUrl || "")
    const coverInputRef = useRef<HTMLInputElement>(null)

    // Document File State
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string>(document.fileUrl)
    const [fileType, setFileType] = useState<"pdf" | "image" | null>(
        document.fileUrl.toLowerCase().endsWith(".pdf") ? "pdf" : "image"
    )
    const fileInputRef = useRef<HTMLInputElement>(null)

    function handleCoverSelect(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith("image/")) {
            toast.error("Cover harus berupa file gambar")
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
            toast.error("Hanya file PDF atau gambar yang diizinkan")
            return
        }

        setSelectedFile(file)
        setFileType(isPdf ? "pdf" : "image")
        setFilePreview(URL.createObjectURL(file))
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!namaDokumen.trim()) {
            toast.error("Nama dokumen wajib diisi")
            return
        }

        setIsLoading(true)
        try {
            const formData = new FormData()
            if (selectedFile) formData.append("file", selectedFile)
            if (selectedCover) formData.append("cover", selectedCover)
            formData.append("namaDokumen", namaDokumen)
            formData.append("urutan", urutan)

            const response = await fetch(`/api/legalitas/${document.id}`, {
                method: "PATCH",
                body: formData,
            })

            if (!response.ok) {
                const err = await response.json()
                throw new Error(err.error || "Gagal memperbarui dokumen")
            }

            toast.success("Dokumen berhasil diperbarui")
            setOpen(false)
            router.refresh()
        } catch (error: any) {
            toast.error(error.message || "Terjadi kesalahan sistem")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setOpen(true)}
                className="h-7 text-xs text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            >
                <Pencil className="w-3 h-3 mr-1" /> Edit
            </Button>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[550px] overflow-hidden leading-relaxed">
                    <DialogHeader>
                        <DialogTitle>Edit Legalitas</DialogTitle>
                        <DialogDescription>
                            Ubah data dokumen legalitas. Kosongkan pilihan file jika tidak ingin mengganti cover atau dokumen asli.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={onSubmit} className="space-y-6 pt-2 w-full">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-slate-700">Nama Dokumen *</label>
                            <Input
                                value={namaDokumen}
                                onChange={(e) => setNamaDokumen(e.target.value)}
                                className="rounded-xl"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* Cover Image */}
                            <div className="space-y-2 text-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 text-left">Ganti Cover Image</label>
                                <div 
                                    onClick={() => coverInputRef.current?.click()}
                                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm cursor-pointer group bg-slate-50"
                                >
                                    <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="p-2 bg-white rounded-full shadow-lg">
                                            <Upload className="w-4 h-4 text-blue-600" />
                                        </div>
                                    </div>
                                    {selectedCover && (
                                        <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0 text-[8px] uppercase">Baru</Badge>
                                    )}
                                </div>
                                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={handleCoverSelect} />
                            </div>

                            {/* Document File */}
                            <div className="space-y-2 text-center">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2 text-left">Ganti File Dokumen</label>
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm cursor-pointer group bg-slate-50 flex flex-col items-center justify-center p-4"
                                >
                                    {fileType === "pdf" ? (
                                        <div className="text-center group-hover:translate-y-[-4px] transition-transform">
                                            <FileText className="w-12 h-12 text-red-500 mb-2 mx-auto" />
                                            <p className="text-[9px] font-bold text-slate-500 break-all">{selectedFile ? selectedFile.name : 'PDF Terpasang'}</p>
                                        </div>
                                    ) : (
                                        <img src={filePreview} alt="File Preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="p-2 bg-white rounded-full shadow-lg">
                                            <Upload className="w-4 h-4 text-red-600" />
                                        </div>
                                    </div>
                                    {selectedFile && (
                                        <Badge className="absolute top-2 right-2 bg-green-500 text-white border-0 text-[8px] uppercase">Baru</Badge>
                                    )}
                                </div>
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
                            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl h-12 px-6">Batal</Button>
                            <Button
                                type="submit"
                                disabled={isLoading || !namaDokumen.trim()}
                                className="bg-primary-blue hover:bg-primary-blue-medium text-white rounded-xl h-12 px-8 shadow-lg shadow-blue-500/20 transition-all font-bold"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</>
                                ) : (
                                    "Simpan Perubahan"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
