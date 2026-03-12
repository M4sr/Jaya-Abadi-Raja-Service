"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"


export async function addKeuangan(data: {
    tipe: string
    kategori: string
    nominal: number
    tanggal: Date
    keterangan?: string
}) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await prisma.keuangan.create({
            data: {
                tipe: data.tipe as any,
                kategori: data.kategori,
                nominal: data.nominal,
                tanggal: data.tanggal,
                keterangan: data.keterangan || null,
            }
        })

        revalidatePath("/admin/laporan/keuangan")
        return { success: true }
    } catch (error: any) {
        console.error("[ADD_KEUANGAN_ERROR]", error)
        return { success: false, error: error.message || "Failed to add transaction" }
    }
}

export async function deleteKeuangan(id: string) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await prisma.keuangan.delete({
            where: { id }
        })

        revalidatePath("/admin/laporan/keuangan")
        return { success: true }
    } catch (error: any) {
        console.error("[DELETE_KEUANGAN_ERROR]", error)
        return { success: false, error: "Failed to delete transaction" }
    }
}
