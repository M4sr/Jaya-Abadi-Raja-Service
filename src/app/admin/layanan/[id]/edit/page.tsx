import ServiceForm from "@/components/admin/ServiceForm"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

export default async function LayananEditPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const layanan = await prisma.layanan.findUnique({
        where: { id }
    })

    if (!layanan) {
        notFound()
    }

    const kategori = await prisma.kategoriLayanan.findMany({
        orderBy: { urutan: 'asc' }
    })

    return <ServiceForm initialData={layanan} categories={kategori} />
}
