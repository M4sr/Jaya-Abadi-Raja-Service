"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, PenSquare, MapPin, Trash2 } from "lucide-react"
import { LocationMapPicker } from "./LocationMapPicker"
import { CustomSwal } from "@/lib/swal"

const userSchema = z.object({
    name: z.string().min(3, "Nama minimal 3 karakter"),
    email: z.string().email("Format email tidak valid").or(z.literal("")),
    phone: z.string().min(10, "Nomor ponsel minimal 10 digit"),
    username: z.string().min(3, "Username minimal 3 karakter").or(z.literal("")),
    password: z.string().optional(), // optional if edit, required if new
    role: z.enum(["ADMIN", "TEKNISI", "PELANGGAN", "OWNER", "DEVELOPER"]),
    isActive: z.boolean(),
    areaCoverage: z.array(z.object({
        label: z.string(),
        lat: z.number(),
        lng: z.number()
    })).optional(),
})

type UserFormValues = z.infer<typeof userSchema>

interface Props {
    initialData?: any
    trigger?: React.ReactNode
}

export default function UserDialog({ initialData, trigger }: Props) {
    const router = useRouter()
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [step, setStep] = useState<1 | 2>(1)

    const defaultValues = {
        name: initialData?.name || "",
        email: initialData?.email || "",
        phone: initialData?.phone || "",
        username: initialData?.username || "",
        password: "",
        role: initialData?.role || "PELANGGAN",
        isActive: initialData?.isActive ?? true,
        areaCoverage: initialData?.teknisiProfile?.areaCoverage
            ? (Array.isArray(initialData.teknisiProfile.areaCoverage)
                ? initialData.teknisiProfile.areaCoverage.map((a: any) =>
                    typeof a === 'object' ? a : { label: a, lat: 0, lng: 0 }
                )
                : [])
            : [],
    }

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues
    })

    useEffect(() => {
        if (open && initialData) {
            setStep(1)
            form.reset({
                name: initialData.name || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                username: initialData.username || "",
                password: "",
                role: initialData.role || "PELANGGAN",
                isActive: initialData.isActive ?? true,
                areaCoverage: initialData?.teknisiProfile?.areaCoverage
                    ? (Array.isArray(initialData.teknisiProfile.areaCoverage)
                        ? initialData.teknisiProfile.areaCoverage.map((a: any) =>
                            typeof a === 'object' ? a : { label: a, lat: 0, lng: 0 }
                        )
                        : [])
                    : [],
            })
        } else if (open && !initialData) {
            setStep(1)
            form.reset(defaultValues)
        }
    }, [open, initialData])

    async function onSubmit(data: UserFormValues) {
        // Jika Teknisi dan masih di step 1, jangan simpan tapi arahkan ke step 2 (Peta)
        if (data.role === "TEKNISI" && step === 1) {
            const isValid = await form.trigger(["name", "email", "phone", "username", "password", "role"])
            if (isValid) {
                if (!initialData && !data.password) {
                    await CustomSwal.fire({
                        title: "Data Kurang Lengkap",
                        text: "Password wajib diisi untuk pengguna baru!",
                        icon: "warning",
                        confirmButtonColor: "#3b82f6"
                    })
                    return
                }
                setStep(2)
            } else {
                await CustomSwal.fire({
                    title: "Periksa Kembali Data",
                    text: "Mohon lengkapi semua baris bertanda bintang wajib sebelum melanjutkan.",
                    icon: "warning",
                    confirmButtonColor: "#3b82f6"
                })
            }
            return
        }

        // Validasi khusus Teknisi di step 2: Harus ada minimal 1 area
        if (data.role === "TEKNISI" && step === 2 && (!data.areaCoverage || data.areaCoverage.length === 0)) {
            await CustomSwal.fire({
                title: "Area Belum Dipilih",
                text: "Mohon tentukan minimal satu area operasional di peta sebelum menyimpan.",
                icon: "warning",
                confirmButtonColor: "#3b82f6"
            })
            return
        }

        if (!initialData && !data.password) {
            CustomSwal.fire({
                title: "Validasi Gagal",
                text: "Password wajib diisi untuk pengguna baru!",
                icon: "warning",
                confirmButtonColor: "#3b82f6"
            })
            return
        }

        setIsLoading(true)
        try {
            const url = initialData ? `/api/users/${initialData.id}` : "/api/users"
            const method = initialData ? "PUT" : "POST"

            // Data areaCoverage Array is already in the correct Object form
            const payload: any = {
                ...data,
                areaCoverageArray: [],
                email: data.email?.trim() || undefined,
                phone: data.phone?.trim() || undefined,
                username: data.username?.trim() || undefined,
            }

            if (data.role === "TEKNISI" && data.areaCoverage) {
                payload.areaCoverageArray = data.areaCoverage
            }

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                const err = await response.json()
                if (err.field && ['email', 'username', 'phone'].includes(err.field)) {
                    form.setError(err.field as 'email' | 'username' | 'phone', { message: err.error })
                    setStep(1) // Kembalikan ke step 1

                    await CustomSwal.fire({
                        title: "Validasi Gagal",
                        text: err.error,
                        icon: "warning",
                        confirmButtonColor: "#3b82f6"
                    })
                    return // Stop eksekusi
                }
                throw new Error(err.error || "Gagal menyimpan pengguna")
            }

            setOpen(false)
            CustomSwal.fire({
                title: "Berhasil!",
                text: `Pengguna berhasil ${initialData ? "diperbarui" : "ditambahkan"}.`,
                icon: "success",
                confirmButtonColor: "#3b82f6",
                timer: 2000,
                showConfirmButton: false
            })
            router.refresh()
        } catch (error: any) {
            setStep(1) // Kembalikan ke step 1 jika ada error (misal unik constraint)

            await CustomSwal.fire({
                title: "Gagal Mengambil Tindakan",
                text: error.message,
                icon: "error",
                confirmButtonColor: "#ef4444"
            })
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div onClick={() => setOpen(true)} className="inline-block cursor-pointer">
                {trigger ? trigger : (
                    <Button type="button" className="bg-primary-blue hover:bg-primary-blue-medium text-white shadow-lg rounded-xl pointer-events-none">
                        <Plus className="w-4 h-4 mr-2" /> Tambah Pengguna
                    </Button>
                )}
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>{initialData ? "Edit Data Pengguna" : "Buat Akun Pengguna"}</DialogTitle>
                        <DialogDescription>
                            {initialData ? "Ubah data akses pengguna terpilih." : "Masukan informasi untuk akun baru."}
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 pt-4"
                        onKeyDown={(e) => {
                            // Mencegah Enter melakukan submit otomatis jika di Step 1 untuk Teknisi
                            if (e.key === 'Enter' && step === 1 && form.watch("role") === "TEKNISI") {
                                e.preventDefault()
                                // Biarkan logic di tombol "Lanjutkan ke Area" yang meng-handle lewat onSubmit via trigger/click
                            }
                        }}
                    >
                        {step === 1 && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2 col-span-2">
                                        <label className="text-sm font-semibold text-slate-700">Nama Lengkap *</label>
                                        <Input {...form.register("name")} placeholder="Jhon Doe" className="rounded-xl" />
                                        {form.formState.errors.name && <p className="text-red-500 text-xs">{form.formState.errors.name.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Email Utama</label>
                                        <Input {...form.register("email")} type="email" placeholder="email@contoh.com" className="rounded-xl" />
                                        {form.formState.errors.email && <p className="text-red-500 text-xs">{form.formState.errors.email.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Nomor Ponsel / WA *</label>
                                        <Input {...form.register("phone")} placeholder="081234..." className="rounded-xl" />
                                        {form.formState.errors.phone && <p className="text-red-500 text-xs">{form.formState.errors.phone.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Username Login</label>
                                        <Input {...form.register("username")} placeholder="jhoondoe12" className="rounded-xl" />
                                        {form.formState.errors.username && <p className="text-red-500 text-xs">{form.formState.errors.username.message}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Password</label>
                                        <Input {...form.register("password")} type="password" placeholder={initialData ? "(Kosongkan jika tak diubah)" : "Minimal 6 karakter..."} className="rounded-xl" />
                                        {form.formState.errors.password && <p className="text-red-500 text-xs">{form.formState.errors.password.message}</p>}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Hak Akses (Role)</label>
                                        <select {...form.register("role")} className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-blue-light focus:border-transparent">
                                            <option value="PELANGGAN">Pelanggan</option>
                                            <option value="TEKNISI">Teknisi</option>
                                            <option value="ADMIN">Admin / Staff</option>
                                            <option value="OWNER">Pemilik Bisnis (Owner)</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2 flex flex-col justify-center">
                                        <label className="text-sm font-semibold text-slate-700">Status Aktif</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Switch
                                                checked={form.watch("isActive")}
                                                disabled={isLoading}
                                                onCheckedChange={(checked: boolean) => form.setValue("isActive", checked)}
                                            />
                                            <span className="text-xs text-slate-500">{form.watch("isActive") ? "Aktif" : "Non-aktif"}</span>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {step === 2 && form.watch("role") === "TEKNISI" && (
                            <div className="space-y-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100 mt-2">
                                <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                                    <MapPin className="w-4 h-4 text-primary-blue-medium" />
                                    Area Operasional Peta (Pin Point)
                                </label>

                                <div className="space-y-2">
                                    {form.watch("areaCoverage")?.map((area, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-blue-200/60 shadow-sm">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-slate-700">{area.label}</span>
                                                <span className="text-[10px] text-slate-400 font-mono tracking-tight">{area.lat.toFixed(5)}, {area.lng.toFixed(5)}</span>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                                onClick={() => {
                                                    const current = form.watch("areaCoverage") || []
                                                    form.setValue("areaCoverage", current.filter((_, i) => i !== idx))
                                                }}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>

                                <LocationMapPicker
                                    onSelectArea={(area) => {
                                        const current = form.watch("areaCoverage") || []
                                        if (!current.find((a) => a.label === area.label)) {
                                            form.setValue("areaCoverage", [...current, area])
                                        } else {
                                            CustomSwal.fire({
                                                title: "Gagal",
                                                text: "Area tersebut sudah ada di daftar",
                                                icon: "error",
                                                confirmButtonColor: "#ef4444"
                                            })
                                        }
                                    }}
                                />
                            </div>
                        )}

                        <div className="pt-6 flex justify-end gap-2">
                            {step === 2 ? (
                                <>
                                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="rounded-xl">Kembali</Button>
                                    <Button type="submit" disabled={isLoading} className="bg-primary-blue hover:bg-primary-blue-medium text-white rounded-xl px-6">
                                        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                        {initialData ? "Simpan Area & Profil" : "Buat Akun Teknisi"}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Batal</Button>
                                    {form.watch("role") === "TEKNISI" ? (
                                        <Button
                                            type="button"
                                            className="bg-primary-blue hover:bg-primary-blue-medium text-white rounded-xl px-6"
                                            onClick={async () => {
                                                const isValid = await form.trigger(["name", "email", "phone", "username", "password", "role"])
                                                if (isValid) {
                                                    if (!initialData && !form.getValues("password")) {
                                                        CustomSwal.fire({
                                                            title: "Data Kurang Lengkap",
                                                            text: "Password wajib diisi untuk pengguna baru!",
                                                            icon: "warning",
                                                            confirmButtonColor: "#3b82f6"
                                                        })
                                                        return
                                                    }
                                                    setStep(2)
                                                } else {
                                                    CustomSwal.fire({
                                                        title: "Periksa Kembali Data",
                                                        text: "Mohon lengkapi semua baris bertanda bintang wajib sebelum melanjutkan.",
                                                        icon: "warning",
                                                        confirmButtonColor: "#3b82f6"
                                                    })
                                                }
                                            }}
                                        >
                                            Lanjutkan ke Area
                                        </Button>
                                    ) : (
                                        <Button type="submit" disabled={isLoading} className="bg-primary-blue hover:bg-primary-blue-medium text-white rounded-xl px-6">
                                            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                                            {initialData ? "Simpan" : "Buat Akun"}
                                        </Button>
                                    )}
                                </>
                            )}
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}
