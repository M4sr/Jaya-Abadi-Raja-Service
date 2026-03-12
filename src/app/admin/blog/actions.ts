"use server"

import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { revalidatePath } from "next/cache"


export async function deleteArticle(id: string) {
    const session = await auth()
    if (!session || !session.user.id) {
        throw new Error("Unauthorized")
    }

    // Ensure user owns it theoretically or is admin (Admin can delete anyone's)
    if (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER") {
        throw new Error("Unauthorized")
    }

    await prisma.article.delete({
        where: { id }
    })

    revalidatePath('/admin/blog')
}
