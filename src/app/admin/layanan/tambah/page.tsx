import ServiceForm from "@/components/admin/ServiceForm"
import prisma from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function LayananTambahPage() {
    const kategori = await prisma.kategoriLayanan.findMany({
        orderBy: { urutan: 'asc' }
    })
    
    return <ServiceForm categories={kategori} />
}
