"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"


export async function updateAreaOperasional(teknisiId: string, areas: any[]) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
        return { success: false, error: "Unauthorized" }
    }

    try {
        await prisma.teknisiProfile.update({
            where: { id: teknisiId },
            data: {
                // Since areaCoverage is JSON in Prisma schema, we just pass the array
                areaCoverage: areas
            }
        })

        revalidatePath("/admin/laporan/teknisi")
        return { success: true }
    } catch (error: any) {
        console.error("[UPDATE_AREA_ERROR]", error)
        return { success: false, error: "Failed to update operational area" }
    }
}
