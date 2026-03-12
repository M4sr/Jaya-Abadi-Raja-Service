import prisma from "@/lib/prisma"
import LegalitasClient from "@/components/admin/LegalitasClient"
import { deleteLegalitas } from "./actions"


export const dynamic = "force-dynamic"

export default async function LegalitasPage() {
    const documents = await prisma.legalitas.findMany({
        orderBy: { urutan: 'asc' }
    })


    return (
        <LegalitasClient
            documents={documents}
            onDelete={deleteLegalitas}
        />
    )
}
