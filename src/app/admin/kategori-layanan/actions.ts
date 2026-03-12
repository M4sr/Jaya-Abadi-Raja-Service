'use server'

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const kategoriSchema = z.object({
  nama: z.string().min(1, "Nama kategori diperlukan"),
  slug: z.string().min(1, "Slug diperlukan"),
  urutan: z.number().int().default(0),
  isActive: z.boolean().default(true),
})

export async function getKategoriList() {
  try {
    const kategori = await prisma.kategoriLayanan.findMany({
      orderBy: { urutan: 'asc' }
    })
    return { success: true, data: kategori }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function createKategori(data: z.infer<typeof kategoriSchema>) {
  try {
    const validatedData = kategoriSchema.parse(data)
    
    // Check slug uniqueness
    const existing = await prisma.kategoriLayanan.findUnique({
      where: { slug: validatedData.slug }
    })
    if (existing) {
      return { success: false, error: "Slug sudah digunakan" }
    }

    const kategori = await prisma.kategoriLayanan.create({
      data: validatedData
    })
    
    revalidatePath('/admin/kategori-layanan')
    revalidatePath('/layanan')
    return { success: true, data: kategori }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function updateKategori(id: string, data: z.infer<typeof kategoriSchema>) {
  try {
    const validatedData = kategoriSchema.parse(data)
    
    // Check slug uniqueness if it changed
    const existing = await prisma.kategoriLayanan.findFirst({
      where: { 
        slug: validatedData.slug,
        NOT: { id }
      }
    })
    if (existing) {
      return { success: false, error: "Slug sudah digunakan kategori lain" }
    }

    const kategori = await prisma.kategoriLayanan.update({
      where: { id },
      data: validatedData
    })
    
    revalidatePath('/admin/kategori-layanan')
    revalidatePath('/layanan')
    return { success: true, data: kategori }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function deleteKategori(id: string) {
  try {
    await prisma.kategoriLayanan.delete({
      where: { id }
    })
    revalidatePath('/admin/kategori-layanan')
    revalidatePath('/layanan')
    return { success: true }
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus kategori. Pastikan tidak ada layanan yang menggunakan kategori ini." }
  }
}

export async function toggleKategoriStatus(id: string, currentStatus: boolean) {
  try {
    const kategori = await prisma.kategoriLayanan.update({
      where: { id },
      data: { isActive: !currentStatus }
    })
    revalidatePath('/admin/kategori-layanan')
    revalidatePath('/layanan')
    return { success: true, data: kategori }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
