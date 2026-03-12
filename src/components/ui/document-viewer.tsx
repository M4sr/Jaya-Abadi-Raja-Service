"use client"

import { useState } from "react"
import { FileText, ZoomIn, X, ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"

interface DocumentViewerProps {
    fileUrl: string
    namaDokumen: string
    coverUrl?: string | null
    className?: string
}

/**
 * Renders a PDF or image inline:
 * - Images → displayed directly as <img>
 * - PDFs   → embedded via <iframe> (no download needed, renders in browser)
 */
export function DocumentViewer({ fileUrl, namaDokumen, coverUrl, className = "" }: DocumentViewerProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const isPdf = fileUrl.toLowerCase().endsWith(".pdf")

    return (
        <>
            {/* Thumbnail / Preview Card */}
            <div
                className={`relative group cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm hover:shadow-md transition-all ${className}`}
                onClick={() => setLightboxOpen(true)}
            >
                {coverUrl ? (
                    <div className="relative w-full aspect-[3/4] bg-slate-50">
                        <img
                            src={coverUrl}
                            alt={namaDokumen}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end p-4">
                            <div className="flex items-center gap-2 text-white">
                                <ZoomIn className="w-4 h-4" />
                                <span className="text-sm font-medium">Buka Dokumen</span>
                            </div>
                        </div>
                        {isPdf && (
                            <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">PDF</div>
                        )}
                    </div>
                ) : isPdf ? (
                    /* PDF thumbnail: static card — no iframe, no file load until user clicks */
                    <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-red-50 to-slate-100 flex flex-col items-center justify-center gap-3 p-4 uppercase tracking-tighter">
                        <div className="p-4 bg-white rounded-2xl shadow-md group-hover:scale-110 transition-transform duration-500">
                            <FileText className="w-10 h-10 text-red-500" />
                        </div>
                        <p className="text-[10px] font-black text-slate-400 text-center line-clamp-2 px-4 italic opacity-40">TIDAK ADA COVER</p>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end p-4">
                            <div className="flex items-center gap-2 text-white">
                                <ZoomIn className="w-4 h-4" />
                                <span className="text-sm font-medium">Lihat Dokumen</span>
                            </div>
                        </div>
                        {/* PDF badge */}
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PDF</div>
                    </div>
                ) : (
                    /* Image preview as fallback if no coverUrl */
                    <div className="relative w-full aspect-[3/4] bg-slate-50">
                        <img
                            src={fileUrl}
                            alt={namaDokumen}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-end p-4">
                            <div className="flex items-center gap-2 text-white">
                                <ZoomIn className="w-4 h-4" />
                                <span className="text-sm font-medium">Perbesar</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Document name footer */}
                <div className="p-3 border-t border-slate-100 flex items-center gap-2">
                    <div className={`p-1.5 rounded-lg ${isPdf ? "bg-red-50" : "bg-blue-50"}`}>
                        <FileText className={`w-4 h-4 ${isPdf ? "text-red-500" : "text-blue-500"}`} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 truncate flex-1">{namaDokumen}</p>
                </div>
            </div>

            {/* Lightbox / Modal */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={() => setLightboxOpen(false)}
                >
                    <div
                        className="relative bg-white rounded-2xl overflow-hidden shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <FileText className={`w-4 h-4 ${isPdf ? "text-red-500" : "text-blue-500"}`} />
                                <span className="font-semibold text-slate-800 text-sm">{namaDokumen}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <a
                                    href={fileUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                                    title="Buka di tab baru"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                                <button
                                    onClick={() => setLightboxOpen(false)}
                                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            {isPdf ? (
                                <iframe
                                    src={`${fileUrl}#toolbar=1&navpanes=0`}
                                    className="w-full h-full min-h-[70vh]"
                                    title={namaDokumen}
                                />
                            ) : (
                                <div className="flex items-center justify-center p-4 h-full min-h-[60vh] bg-slate-50">
                                    <img
                                        src={fileUrl}
                                        alt={namaDokumen}
                                        className="max-w-full max-h-[70vh] object-contain rounded-lg shadow"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
