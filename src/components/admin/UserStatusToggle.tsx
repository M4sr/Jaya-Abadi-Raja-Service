"use client"

import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Props {
    userId: string
    initialActive: boolean
}

export default function UserStatusToggle({ userId, initialActive }: Props) {
    const [isActive, setIsActive] = useState(initialActive)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    async function toggle(checked: boolean) {
        setIsActive(checked) // optimistic update
        setIsLoading(true)
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: checked }),
            })

            if (!res.ok) {
                const err = await res.json()
                toast.error(err.error || "Gagal mengubah status akun")
                setIsActive(!checked) // revert
                return
            }

            toast.success(checked ? "Akun diaktifkan" : "Akun dinonaktifkan")
            router.refresh()
        } catch {
            toast.error("Gagal menghubungi server")
            setIsActive(!checked) // revert
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center gap-1.5">
            <Switch
                checked={isActive}
                onCheckedChange={toggle}
                disabled={isLoading}
                className="data-[state=checked]:bg-green-500"
            />
            <span className={`text-[10px] font-semibold ${isActive ? "text-green-600" : "text-slate-400"}`}>
                {isActive ? "Aktif" : "Nonaktif"}
            </span>
        </div>
    )
}
