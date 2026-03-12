"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"


export async function deleteGaleri(id: string) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
        throw new Error("Unauthorized")
    }

    await prisma.galeriFoto.delete({
        where: { id }
    })

    revalidatePath('/admin/galeri')
}
