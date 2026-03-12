"use client"
import dynamic from "next/dynamic"
import { Loader2 } from "lucide-react"

export const LocationMapPicker = dynamic(
    () => import('./LocationMapClient'),
    {
        ssr: false,
        loading: () => (
            <div className="h-[250px] w-full rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-2">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span className="text-xs">Memuat peta interaktif...</span>
            </div>
        )
    }
)
