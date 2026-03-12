"use client"

import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps {
    totalItems: number
    pageSize: number
    currentPage: number
    totalPages: number
}

export function DataTablePagination({
    totalItems,
    pageSize,
    currentPage,
    totalPages,
}: DataTablePaginationProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const createQueryString = (params: Record<string, string | number | null>) => {
        const newSearchParams = new URLSearchParams(searchParams.toString())
        for (const [key, value] of Object.entries(params)) {
            if (value === null) {
                newSearchParams.delete(key)
            } else {
                newSearchParams.set(key, String(value))
            }
        }
        return newSearchParams.toString()
    }

    const handlePageChange = (page: number) => {
        router.push(`${pathname}?${createQueryString({ page })}`)
    }

    const handlePageSizeChange = (value: string | null) => {
        if (!value) return
        router.push(`${pathname}?${createQueryString({ page: 1, limit: value })}`)
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 gap-4">
            <div className="flex-1 text-sm text-slate-500 order-2 sm:order-1">
                {totalItems > 0 ? (
                    <>
                        Menampilkan <span className="font-semibold text-slate-700">{(currentPage - 1) * pageSize + 1}</span> sampai{" "}
                        <span className="font-semibold text-slate-700">{Math.min(currentPage * pageSize, totalItems)}</span> dari{" "}
                        <span className="font-semibold text-slate-700">{totalItems}</span> entri
                    </>
                ) : (
                    "Tidak ada data untuk ditampilkan"
                )}
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 lg:gap-8 order-1 sm:order-2">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-slate-600 whitespace-nowrap">Baris per halaman</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={handlePageSizeChange}
                    >
                        <SelectTrigger className="h-9 w-[70px] bg-white border-slate-200 rounded-lg">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {[10, 20, 30, 40, 50].map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center text-sm font-medium text-slate-600 mr-2">
                        {totalPages > 0 ? `Halaman ${currentPage} / ${totalPages}` : "Halaman 0"}
                    </div>
                    <div className="flex items-center space-x-1.5">
                        <Button
                            variant="outline"
                            className="hidden h-9 w-9 p-0 lg:flex bg-white border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage <= 1 || totalPages === 0}
                        >
                            <span className="sr-only">Halaman pertama</span>
                            <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 w-9 p-0 bg-white border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage <= 1 || totalPages === 0}
                        >
                            <span className="sr-only">Halaman sebelumnya</span>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="h-9 w-9 p-0 bg-white border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage >= totalPages || totalPages === 0}
                        >
                            <span className="sr-only">Halaman berikutnya</span>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="outline"
                            className="hidden h-9 w-9 p-0 lg:flex bg-white border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 disabled:opacity-50"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage >= totalPages || totalPages === 0}
                        >
                            <span className="sr-only">Halaman terakhir</span>
                            <ChevronsRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
