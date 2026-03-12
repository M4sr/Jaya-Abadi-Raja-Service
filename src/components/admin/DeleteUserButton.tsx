"use client"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { CustomSwal } from "@/lib/swal"
import { useRouter } from "next/navigation"

interface DeleteUserButtonProps {
    userId: string
    userName: string
    deleteAction: (id: string) => Promise<void>
}

export default function DeleteUserButton({ userId, userName, deleteAction }: DeleteUserButtonProps) {
    const router = useRouter()

    const handleDelete = async () => {
        CustomSwal.fire({
            title: "Hapus Pengguna?",
            text: `Anda yakin ingin menghapus akun ${userName}? Data yang dihapus tidak dapat dikembalikan.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Ya, Hapus!",
            cancelButtonText: "Batal",
            reverseButtons: true,
            customClass: {
                confirmButton: 'bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-100 active:scale-95 transition-all text-white px-8 py-2.5 rounded-xl font-medium shadow-md outline-none',
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteAction(userId)
                    CustomSwal.fire({
                        title: "Terhapus!",
                        text: `Akun ${userName} berhasil dihapus.`,
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false
                    })
                    router.refresh()
                } catch (error) {
                    CustomSwal.fire("Gagal", "Terjadi kesalahan saat menghapus pengguna.", "error")
                }
            }
        })
    }

    return (
        <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleDelete}
            className="h-8 w-8 text-accent-red border-red-200 hover:bg-red-50 hover:text-red-700"
        >
            <Trash2 className="w-4 h-4" />
        </Button>
    )
}
