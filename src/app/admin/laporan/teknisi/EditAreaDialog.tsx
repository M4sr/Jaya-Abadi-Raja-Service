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
import { Edit, Loader2, MapPin, Plus, X } from "lucide-react"
import { toast } from "sonner"
// Import server action untuk update area
import { updateAreaOperasional } from "./actions"
import { LocationMapPicker } from "@/components/admin/LocationMapPicker"
import { Trash2 } from "lucide-react"

export interface AreaCoordinate {
    label: string
    lat: number
    lng: number
}

interface EditAreaDialogProps {
    teknisiId: string
    teknisiName: string
    currentAreas: any // The JSON structure from DB
}

export default function EditAreaDialog({ teknisiId, teknisiName, currentAreas }: EditAreaDialogProps) {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    // Parse the current areas from the DB format
    // In DB it might be an array of strings or array of objects { value, label }
    let initialAreas: AreaCoordinate[] = []
    if (currentAreas && Array.isArray(currentAreas)) {
        initialAreas = currentAreas.map((a: any) => typeof a === 'object' ? a : { label: a, lat: 0, lng: 0 })
    }

    const [areas, setAreas] = useState<AreaCoordinate[]>(initialAreas)

    const handleAddArea = (area: AreaCoordinate) => {
        if (areas.find(a => a.label === area.label)) {
            toast.error("Area ini sudah ada di daftar")
            return
        }
        setAreas([...areas, area])
    }

    const handleRemoveArea = (indexToRemove: number) => {
        setAreas(areas.filter((_, idx) => idx !== indexToRemove))
    }

    // Removed Keyboard handler as map component handles its own search

    const onSave = async () => {
        setIsLoading(true)
        try {
            // Update to DB via Server Action
            const result = await updateAreaOperasional(teknisiId, areas)

            if (result.success) {
                toast.success(`Area operasional ${teknisiName} berhasil diupdate!`)
                setOpen(false)
                router.refresh()
            } else {
                toast.error(result.error || "Gagal menyimpan data area")
            }
        } catch (error) {
            toast.error("Terjadi kesalahan sistem")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (isOpen) {
                // Reset to DB state when opening
                let current: AreaCoordinate[] = []
                if (currentAreas && Array.isArray(currentAreas)) {
                    current = currentAreas.map((a: any) => typeof a === 'object' ? a : { label: a, lat: 0, lng: 0 })
                }
                setAreas(current)
            }
        }}>
            <DialogTrigger render={<Button variant="outline" size="icon-sm" className="h-8 w-8 text-slate-500 hover:text-primary-blue-medium hover:bg-blue-50/50 hover:border-blue-200 shadow-none transition-all" />}>
                <Edit className="w-4 h-4" />
            </DialogTrigger>

            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary-blue-medium" />
                        Area Operasional
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        Kelola wilayah jangkauan servis untuk teknisi <strong>{teknisiName}</strong>.
                        Area ini akan muncul saat admin memberikan tugas.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    <LocationMapPicker
                        onSelectArea={(area) => handleAddArea(area)}
                    />

                    {/* Area list badges */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 min-h-[120px]">
                        <label className="text-xs font-semibold text-slate-500 mb-3 block">Titik Jangkauan Saat Ini</label>
                        {areas.length === 0 ? (
                            <div className="flex flex-col items-center justify-center text-slate-400 gap-2 h-[80px]">
                                <MapPin className="w-8 h-8 opacity-20" />
                                <span className="text-xs">Belum ada area operasional</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {areas.map((area, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-blue-200/60 shadow-sm">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-700">{area.label}</span>
                                            <span className="text-[10px] text-slate-400 font-mono tracking-tight">{area.lat.toFixed(5)}, {area.lng.toFixed(5)}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                                            onClick={() => handleRemoveArea(idx)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setOpen(false)}
                        className="rounded-xl px-5"
                    >
                        Batal
                    </Button>
                    <Button
                        type="button"
                        onClick={onSave}
                        disabled={isLoading}
                        className="bg-primary-blue-medium hover:bg-primary-blue-light text-white rounded-xl shadow-sm px-6"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                        Simpan Area
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
