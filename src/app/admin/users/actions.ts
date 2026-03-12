"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"


export async function deleteUser(id: string) {
    const session = await auth()
    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
        throw new Error("Unauthorized")
    }

    const userToDelete = await prisma.user.findUnique({ where: { id } })
    if (!userToDelete) throw new Error("Pengguna tidak ditemukan")

    // Prevent users from deleting Developers/Owners unless they are Developer/Owner
    if ((userToDelete.role === 'DEVELOPER' || userToDelete.role === 'OWNER') && session.user.role === 'ADMIN') {
        throw new Error("Admin tidak dapat menghapus akun Owner/Developer")
    }

    // Prevent self deletion
    if (userToDelete.id === session.user.id) {
        throw new Error("Tidak dapat menghapus akun sendiri!")
    }

    await prisma.user.delete({
        where: { id }
    })

    revalidatePath('/admin/users')
}
