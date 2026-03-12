import KategoriClient from "@/components/admin/KategoriClient"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"
import prisma from "@/lib/prisma"

export const metadata = {
  title: 'Kelola Kategori Layanan - Admin Jaya Service',
  description: 'Pengaturan master data kategori layanan',
}

export const dynamic = "force-dynamic"

export default async function KategoriLayananPage() {
  const kategori = await prisma.kategoriLayanan.findMany({
    include: {
      _count: {
        select: { layanan: true }
      }
    },
    orderBy: { urutan: 'asc' }
  })

  return (
    <div className="p-6 md:p-8 space-y-8 w-full">
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Kategori Layanan</h1>
        <p className="text-slate-500 font-medium max-w-2xl">
          Kelola master data menu kategori (tabulator) yang akan ditampilkan di halaman daftar layanan depan.
        </p>
      </div>

      <KategoriClient initialData={kategori} />
    </div>
  )
}
