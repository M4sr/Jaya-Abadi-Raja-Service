import prisma from "@/lib/prisma"
import AddPhotoDialog from "@/components/admin/AddPhotoDialog"
import { GaleriClient } from "@/components/admin/GaleriClient"
import { PageWrapper, AnimationItem } from "@/components/admin/AnimationWrappers"

export const dynamic = "force-dynamic"

export default async function GaleriPage() {
    const galeries = await prisma.galeriFoto.findMany({
        orderBy: { createdAt: 'desc' }
    })

    // Serialize dates (avoid passing Date objects to client components)
    const serialized = galeries.map((g) => ({
        id: g.id,
        fotoUrl: g.fotoUrl,
        judul: g.judul,
        createdAt: g.createdAt.toISOString(),
    }))

    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Galeri Foto</h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola dokumentasi portofolio hasil kinerja</p>
                    </div>
                    <AddPhotoDialog />
                </div>
            </AnimationItem>

            <GaleriClient galeries={serialized} />
        </PageWrapper>
    )
}
