import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"


export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        await prisma.galeriFoto.delete({
            where: { id }
        })

        return NextResponse.json({ success: true, message: "Foto berhasil dihapus dari galeri" })
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal menghapus foto", details: error.message }, { status: 500 })
    }
}
