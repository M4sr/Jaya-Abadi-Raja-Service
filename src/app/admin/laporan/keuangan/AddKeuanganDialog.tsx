"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { addKeuangan } from "./actions"

export default function AddKeuanganDialog() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            tipe: "PENGELUARAN",
            kategori: "",
            nominal: "",
            keterangan: "",
            tanggal: new Date().toISOString().split('T')[0] // yyyy-mm-dd
        }
    })

    const tipeVal = watch("tipe")

    async function onSubmit(data: any) {
        setIsLoading(true)
        try {
            const nominal = parseInt(data.nominal.replace(/\D/g, ""))
            if (isNaN(nominal) || nominal <= 0) {
                toast.error("Nominal tidak valid")
                setIsLoading(false)
                return
            }

            const res = await addKeuangan({
                tipe: data.tipe,
                kategori: data.kategori,
                nominal: nominal,
                tanggal: new Date(data.tanggal),
                keterangan: data.keterangan || ""
            })

            if (res.success) {
                toast.success("Data keuangan berhasil disimpan")
                setOpen(false)
                reset()
                router.refresh()
            } else {
                toast.error(res.error || "Gagal menyimpan data")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button className="bg-primary-blue-medium hover:bg-primary-blue-light text-white rounded-xl shadow-sm text-xs h-9" />}>
                <Plus className="w-4 h-4 mr-1.5" />
                Tambah Catatan Kas
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Catat Arus Kas</DialogTitle>
                    <DialogDescription className="text-xs">
                        Tambahkan pemasukan atau pengeluaran manual di luar sistem booking.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-700">Tanggal</label>
                            <Input type="date" {...register("tanggal", { required: true })} className="rounded-xl text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-slate-700">Tipe</label>
                            <Select onValueChange={(val) => setValue("tipe", val as "PEMASUKAN" | "PENGELUARAN")} defaultValue="PENGELUARAN">
                                <SelectTrigger className="rounded-xl text-sm font-medium border-slate-200">
                                    <SelectValue placeholder="Pilih Tipe" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="PEMASUKAN" className="text-green-600 font-medium font-sm">Pemasukan</SelectItem>
                                    <SelectItem value="PENGELUARAN" className="text-red-600 font-medium font-sm">Pengeluaran</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Kategori</label>
                        <Select onValueChange={(val) => setValue("kategori", val as string)} required>
                            <SelectTrigger className="rounded-xl text-sm border-slate-200">
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent>
                                {tipeVal === "PEMASUKAN" ? (
                                    <>
                                        <SelectItem value="Service AC Manual">Service AC (Manual)</SelectItem>
                                        <SelectItem value="Jual Sparepart">Jual Sparepart</SelectItem>
                                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                                    </>
                                ) : (
                                    <>
                                        <SelectItem value="Beli Sparepart">Beli Sparepart</SelectItem>
                                        <SelectItem value="Insentif Teknisi">Insentif / Gaji Teknisi</SelectItem>
                                        <SelectItem value="Operasional Kantor">Operasional Kantor</SelectItem>
                                        <SelectItem value="Biaya Iklan">Biaya Iklan / Marketing</SelectItem>
                                        <SelectItem value="Lainnya">Lainnya</SelectItem>
                                    </>
                                )}
                            </SelectContent>
                        </Select>
                        {/* Hidden input to register with react-hook-form */}
                        <input type="hidden" {...register("kategori", { required: true })} />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Nominal (Rp)</label>
                        <Input
                            type="text"
                            placeholder="Contoh: 150000"
                            {...register("nominal", { required: true })}
                            className="rounded-xl font-medium"
                            onChange={(e) => {
                                // Format as Rp number while typing
                                const val = e.target.value.replace(/\D/g, "")
                                e.target.value = val ? parseInt(val).toLocaleString('id-ID') : ""
                            }}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">Keterangan (Opsional)</label>
                        <Textarea
                            {...register("keterangan")}
                            placeholder="Catatan tambahan..."
                            className="rounded-xl text-sm h-20"
                        />
                    </div>

                    <div className="pt-2 flex justify-end">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full sm:w-auto bg-primary-blue-medium hover:bg-primary-blue-light text-white rounded-xl shadow-sm text-sm h-10 px-8"
                        >
                            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Buku Kas
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
