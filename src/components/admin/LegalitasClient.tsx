"use client"

import { Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DocumentViewer } from "@/components/ui/document-viewer"
import AddLegalitasDialog from "./AddLegalitasDialog"
import EditLegalitasDialog from "./EditLegalitasDialog"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface LegalitasClientProps {
    documents: any[];
    onDelete: (id: string) => Promise<void>;
}

export default function LegalitasClient({ documents, onDelete }: LegalitasClientProps) {
    const formatDate = (dateValue: any) => {
        if (!dateValue) return "-"
        const date = new Date(dateValue)
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric', month: 'short', year: 'numeric'
        }).format(date)
    }
    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Dokumen Legalitas</h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola perizinan & sertifikasi untuk website</p>
                    </div>
                    <AddLegalitasDialog />
                </div>
            </AnimationItem>

            {documents.length === 0 ? (
                <AnimationItem>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <FileText className="w-8 h-8 text-slate-300" />
                        </div>
                        <h3 className="font-bold text-slate-700 text-lg">Belum ada dokumen</h3>
                        <p className="text-slate-500 mt-1 max-w-sm mx-auto">Klik tombol Tambah Dokumen di atas untuk melengkapi legalitas usaha.</p>
                    </div>
                </AnimationItem>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {documents.map((item, idx) => (
                        <AnimationItem key={item.id}>
                            <div className="flex flex-col gap-2">
                                <DocumentViewer
                                    fileUrl={item.fileUrl}
                                    namaDokumen={item.namaDokumen}
                                    coverUrl={item.coverUrl}
                                />
                                <div className="flex items-center justify-between px-1">
                                    <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                                    <div className="flex items-center gap-1">
                                        <EditLegalitasDialog document={item} />
                                        <Button
                                            onClick={() => onDelete(item.id)}
                                            variant="ghost"
                                            size="sm"
                                            className="h-7 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-3 h-3 mr-1" /> Hapus
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </AnimationItem>
                    ))}
                </div>
            )}
        </PageWrapper>
    )
}
