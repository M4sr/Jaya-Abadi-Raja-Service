"use client"

import { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"
import { Loader2, Plus, Upload, X, CheckCircle2, AlertCircle, Image as ImageIcon } from "lucide-react"

interface FileItem {
    id: string
    file: File
    preview: string
    judul: string
    status: "pending" | "uploading" | "done" | "error"
    error?: string
}

export default function AddPhotoDialog() {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [files, setFiles] = useState<FileItem[]>([])
    const [batchJudul, setBatchJudul] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    function addFiles(newFiles: File[]) {
        const validFiles = newFiles.filter((f) => {
            if (!f.type.startsWith("image/")) {
                toast.error(`${f.name}: hanya file gambar yang diizinkan`)
                return false
            }
            if (f.size > 5 * 1024 * 1024) {
                toast.error(`${f.name}: ukuran melebihi 5MB`)
                return false
            }
            return true
        })

        const items: FileItem[] = validFiles.map((f) => ({
            id: `${f.name}-${Date.now()}-${Math.random()}`,
            file: f,
            preview: URL.createObjectURL(f),
            judul: f.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
            status: "pending",
        }))
        setFiles((prev) => [...prev, ...items])
    }

    function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) addFiles(Array.from(e.target.files))
        e.target.value = ""
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault()
        if (e.dataTransfer.files) addFiles(Array.from(e.dataTransfer.files))
    }

    function removeFile(id: string) {
        setFiles((prev) => prev.filter((f) => f.id !== id))
    }

    function updateJudul(id: string, judul: string) {
        setFiles((prev) => prev.map((f) => f.id === id ? { ...f, judul } : f))
    }

    function handleClose() {
        if (isUploading) return
        setFiles([])
        setBatchJudul("")
        setOpen(false)
    }

    async function uploadAll() {
        const pending = files.filter((f) => f.status === "pending")
        if (pending.length === 0) {
            toast.error("Tidak ada file yang dipilih")
            return
        }

        setIsUploading(true)
        let successCount = 0
        let failCount = 0

        for (const [idx, item] of pending.entries()) {
            // Mark as uploading
            setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: "uploading" } : f))

            try {
                const formData = new FormData()
                formData.append("file", item.file)
                // Batch title takes priority; fall back to individual title
                const finalJudul = batchJudul.trim()
                    ? `${batchJudul.trim()} ${idx + 1}`
                    : item.judul
                if (finalJudul) formData.append("judul", finalJudul)

                const res = await fetch("/api/galeri", { method: "POST", body: formData })
                if (!res.ok) {
                    const err = await res.json()
                    throw new Error(err.error || "Gagal upload")
                }

                setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: "done" } : f))
                successCount++
            } catch (err: any) {
                setFiles((prev) => prev.map((f) => f.id === item.id ? { ...f, status: "error", error: err.message } : f))
                failCount++
            }
        }

        setIsUploading(false)

        if (successCount > 0) {
            toast.success(`${successCount} foto berhasil diupload${failCount > 0 ? `, ${failCount} gagal` : ""}`)
            router.refresh()
        }
        if (failCount === 0) {
            setTimeout(() => handleClose(), 800)
        }
    }

    const pendingCount = files.filter((f) => f.status === "pending").length
    const doneCount = files.filter((f) => f.status === "done").length

    return (
        <>
            <Button onClick={() => setOpen(true)} className="bg-primary-blue hover:bg-primary-blue-medium text-white shadow-lg rounded-xl">
                <Plus className="w-4 h-4 mr-2" /> Tambah Foto
            </Button>

            <Dialog open={open} onOpenChange={handleClose}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
                    <DialogHeader>
                        <DialogTitle>Tambah Foto Galeri</DialogTitle>
                        <DialogDescription>
                            Upload beberapa foto sekaligus. Anda bisa drag & drop atau klik untuk memilih.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">

                        {/* Batch Title Field */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                Judul Album / Batch
                                <span className="text-xs font-normal text-slate-400">(opsional)</span>
                            </label>
                            <Input
                                value={batchJudul}
                                onChange={(e) => setBatchJudul(e.target.value)}
                                placeholder="Misal: Pemasangan AC Kantor Budi · Maret 2026"
                                className="rounded-xl bg-slate-50"
                            />
                            {batchJudul.trim() && (
                                <p className="text-xs text-primary-blue">
                                    ✦ Semua foto akan diberi judul: <b>{batchJudul.trim()} 1</b>, <b>{batchJudul.trim()} 2</b>, dst.
                                </p>
                            )}
                        </div>

                        {/* Drop Zone */}
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            onDrop={handleDrop}
                            onDragOver={(e) => e.preventDefault()}
                            className="border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 hover:border-primary-blue/50 transition-colors cursor-pointer group"
                        >
                            <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                <Upload className="w-5 h-5 text-primary-blue" />
                            </div>
                            <p className="text-sm font-semibold text-slate-700">Klik atau drag & drop foto di sini</p>
                            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP — Bisa pilih banyak sekaligus — Maks. 5MB/foto</p>
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={handleFileInput}
                        />

                        {/* File Queue */}
                        {files.length > 0 && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-700">{files.length} foto dipilih</p>
                                    {doneCount > 0 && <span className="text-xs text-green-600 font-medium">{doneCount} selesai</span>}
                                </div>
                                {files.map((item) => (
                                    <div key={item.id} className={`flex items-center gap-3 bg-white border rounded-xl p-3 ${item.status === "done" ? "border-green-200 bg-green-50/50" :
                                        item.status === "error" ? "border-red-200 bg-red-50/50" :
                                            item.status === "uploading" ? "border-blue-200 bg-blue-50/50" :
                                                "border-slate-200"
                                        }`}>
                                        {/* Thumbnail */}
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                            <img src={item.preview} alt="" className="w-full h-full object-cover" />
                                        </div>

                                        {/* Judul input */}
                                        <div className="flex-1 min-w-0">
                                            <Input
                                                value={item.judul}
                                                onChange={(e) => updateJudul(item.id, e.target.value)}
                                                placeholder="Judul foto (opsional)"
                                                disabled={item.status !== "pending"}
                                                className="h-8 text-xs rounded-lg bg-slate-50 border-slate-200"
                                            />
                                            <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.file.name} · {(item.file.size / 1024).toFixed(0)} KB</p>
                                        </div>

                                        {/* Status indicator */}
                                        <div className="shrink-0">
                                            {item.status === "pending" && (
                                                <button onClick={() => removeFile(item.id)} className="p-1 hover:bg-slate-100 rounded-full">
                                                    <X className="w-4 h-4 text-slate-400" />
                                                </button>
                                            )}
                                            {item.status === "uploading" && <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />}
                                            {item.status === "done" && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                                            {item.status === "error" && (
                                                <span title={item.error}>
                                                    <AlertCircle className="w-4 h-4 text-red-500" />
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex justify-between items-center gap-2">
                        <span className="text-xs text-slate-400">
                            {pendingCount > 0 ? `${pendingCount} foto siap diupload` : "Semua sudah diupload"}
                        </span>
                        <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={handleClose} disabled={isUploading} className="rounded-xl">
                                {doneCount > 0 && pendingCount === 0 ? "Tutup" : "Batal"}
                            </Button>
                            <Button
                                onClick={uploadAll}
                                disabled={isUploading || pendingCount === 0}
                                className="bg-primary-blue hover:bg-primary-blue-medium text-white rounded-xl"
                            >
                                {isUploading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                {isUploading ? "Mengupload..." : `Upload ${pendingCount} Foto`}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
