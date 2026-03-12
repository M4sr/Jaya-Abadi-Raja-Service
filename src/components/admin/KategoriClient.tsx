'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Edit2, Plus, Search, Trash2, ArrowUpDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import type { KategoriLayanan } from '@prisma/client'
import { createKategori, updateKategori, deleteKategori, toggleKategoriStatus } from '@/app/admin/kategori-layanan/actions'

type KategoriWithCount = KategoriLayanan & {
  _count?: {
    layanan: number
  }
}

interface KategoriClientProps {
  initialData: KategoriWithCount[]
}

export default function KategoriClient({ initialData }: KategoriClientProps) {
  const [data, setData] = useState<KategoriWithCount[]>(initialData)
  const [search, setSearch] = useState("")
  const [isPending, startTransition] = useTransition()
  
  // Dialog State
  const [isOpen, setIsOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    slug: '',
    urutan: 0,
    isActive: true
  })

  const resetForm = () => {
    setFormData({ nama: '', slug: '', urutan: 0, isActive: true })
    setEditingId(null)
  }

  const handleOpenNew = () => {
    resetForm()
    setIsOpen(true)
  }

  const handleOpenEdit = (kategori: KategoriLayanan) => {
    setFormData({
      nama: kategori.nama,
      slug: kategori.slug,
      urutan: kategori.urutan,
      isActive: kategori.isActive
    })
    setEditingId(kategori.id)
    setIsOpen(true)
  }

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
  }

  const handleNameChange = (val: string) => {
    if (!editingId) { // auto generate slug only when creating new
      setFormData({ ...formData, nama: val, slug: generateSlug(val) })
    } else {
      setFormData({ ...formData, nama: val })
    }
  }

  const onSubmit = async () => {
    if (!formData.nama || !formData.slug) {
      toast.error('Nama dan Slug wajib diisi')
      return
    }

    startTransition(async () => {
      let res
      if (editingId) {
        res = await updateKategori(editingId, formData)
      } else {
        res = await createKategori(formData)
      }

      if (res.success && res.data) {
        toast.success(editingId ? 'Kategori berhasil diupdate' : 'Kategori berhasil dibuat')
        
        // update local state
        if (editingId) {
          setData(data.map(k => k.id === editingId ? res.data as KategoriLayanan : k))
        } else {
          setData([...data, res.data as KategoriLayanan].sort((a, b) => a.urutan - b.urutan))
        }
        
        setIsOpen(false)
        resetForm()
      } else {
        toast.error(res.error || 'Terjadi kesalahan')
      }
    })
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus kategori ${name}?`)) return

    startTransition(async () => {
      const res = await deleteKategori(id)
      if (res.success) {
        toast.success('Kategori dihapus')
        setData(data.filter(k => k.id !== id))
      } else {
        toast.error(res.error)
      }
    })
  }

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const res = await toggleKategoriStatus(id, currentStatus)
      if (res.success && res.data) {
        setData(data.map(k => k.id === id ? res.data as KategoriLayanan : k))
        toast.success(res.data.isActive ? 'Kategori Aktif' : 'Kategori Nonaktif')
      } else {
        toast.error(res.error || 'Terjadi kesalahan')
      }
    })
  }

  const filteredData = data.filter(k => 
    k.nama.toLowerCase().includes(search.toLowerCase()) || 
    k.slug.toLowerCase().includes(search.toLowerCase())
  ).sort((a,b) => a.urutan - b.urutan)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input 
            placeholder="Cari kategori..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-white"
          />
        </div>
        <Button onClick={handleOpenNew} className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" /> Kategori Baru
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredData.map((kategori) => (
          <Card key={kategori.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className={`h-2 ${kategori.isActive ? 'bg-blue-500' : 'bg-slate-300'}`} />
              <div className="p-5 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800">{kategori.nama}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">/{kategori.slug}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md border border-blue-100">{kategori._count?.layanan || 0} Layanan</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded-md">Urutan: {kategori.urutan}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
                  <div className="flex items-center gap-2">
                    <Switch 
                      checked={kategori.isActive}
                      onCheckedChange={() => handleToggleStatus(kategori.id, kategori.isActive)}
                      disabled={isPending}
                    />
                    <span className="text-xs text-slate-500 font-medium">{kategori.isActive ? 'Aktif' : 'Draft'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleOpenEdit(kategori)}
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDelete(kategori.id, kategori.nama)}
                      disabled={isPending}
                      className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredData.length === 0 && (
          <div className="col-span-full py-12 text-center border-2 border-dashed border-slate-200 rounded-[24px]">
            <p className="text-slate-500 font-medium">Tidak ada kategori yang ditemukan.</p>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Kategori" : "Kategori Baru"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nama Kategori</Label>
              <Input 
                placeholder="Misal: Perawatan, Perbaikan..." 
                value={formData.nama}
                onChange={(e) => handleNameChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Slug URL</Label>
              <Input 
                placeholder="perawatan" 
                value={formData.slug}
                onChange={(e) => setFormData({...formData, slug: e.target.value})}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label>Urutan Tampil (Paling kecil tampil duluan)</Label>
              <Input 
                type="number" 
                value={formData.urutan}
                onChange={(e) => setFormData({...formData, urutan: parseInt(e.target.value) || 0})}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>Batal</Button>
            <Button onClick={onSubmit} disabled={isPending} className="bg-blue-600 hover:bg-blue-700 text-white">
              {isPending ? 'Menyimpan...' : 'Simpan Kategori'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
