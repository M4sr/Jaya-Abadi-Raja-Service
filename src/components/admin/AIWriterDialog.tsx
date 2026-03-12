"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Sparkles, Loader2, Wand2, X } from "lucide-react"
import { toast } from "sonner"

interface AIWriterDialogProps {
    onGenerated: (data: {
        judul: string
        konten: string
        excerpt: string
        metaTitle: string
        metaDescription: string
        metaKeywords: string
        kategori: string
        tags: string
    }) => void
}

export default function AIWriterDialog({ onGenerated }: AIWriterDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        topic: "",
        keyPoints: "",
        tone: "Informatif & Profesional",
    })

    async function handleGenerate() {
        if (!formData.topic) {
            toast.error("Tuliskan topik artikel terlebih dahulu")
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/ai-writer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const err = await res.json()
                throw new Error(err.error || "Gagal menghubungi AI")
            }

            const data = await res.json()
            onGenerated(data)
            toast.success("Konten berhasil dibuat oleh AI ✨")
            setOpen(false)
            // Reset form
            setFormData({ topic: "", keyPoints: "", tone: "Informatif & Profesional" })
        } catch (error: any) {
            toast.error(error.message || "Gagal membuat konten, coba lagi")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="inline-flex items-center justify-center gap-2 h-10 px-6 font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98]">
                <Sparkles className="w-4 h-4" />
                Tulis dengan AI ✨
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white relative">
                    <Sparkles className="w-20 h-20 absolute -right-4 -bottom-4 opacity-10 rotate-12" />
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black tracking-tight text-white">AI Content Writer</DialogTitle>
                        <DialogDescription className="text-blue-100 font-medium">
                            Bantu AI menulis artikel berkualitas untuk Anda.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="p-6 space-y-5">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Topik Utama / Judul</label>
                        <Input
                            placeholder="Contoh: 5 Tips Merawat AC Agar Hemat Listrik"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            className="rounded-xl bg-slate-50 border-slate-200 focus:ring-blue-500"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Poin Penting (Opsional)</label>
                        <Textarea
                            placeholder="Contoh: cuci ac tiap 3 bulan, atur suhu 24 derajat, gunakan timer..."
                            value={formData.keyPoints}
                            onChange={(e) => setFormData({ ...formData, keyPoints: e.target.value })}
                            className="rounded-xl bg-slate-50 border-slate-200 min-h-[100px] focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Gaya Bahasa / Tone</label>
                        <Select
                            value={formData.tone}
                            onValueChange={(val) => setFormData({ ...formData, tone: val || "Informatif & Profesional" })}
                        >
                            <SelectTrigger className="rounded-xl bg-slate-50 border-slate-200">
                                <SelectValue placeholder="Pilih tone..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-100">
                                <SelectItem value="Informatif & Profesional">📚 Informatif & Profesional</SelectItem>
                                <SelectItem value="Kasual & Ramah">👋 Kasual & Ramah</SelectItem>
                                <SelectItem value="Persuasif (Promosi)">📢 Persuasif (Promosi)</SelectItem>
                                <SelectItem value="Tips & Tutorial">🛠 Tips & Tutorial</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="p-6 bg-slate-50 flex gap-3 border-t border-slate-100">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-xl font-bold text-slate-500"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-100"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                AI sedang menulis...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4 mr-2" />
                                Mulai Menulis
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
