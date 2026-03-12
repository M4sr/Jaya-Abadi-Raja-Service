"use client"

import { usePathname } from "next/navigation"
import { ChevronRight, Home } from "lucide-react"

const pageLabels: Record<string, string> = {
    dashboard: "Dashboard",
    layanan: "Layanan",
    galeri: "Galeri Foto",
    legalitas: "Legalitas",
    booking: "Data Booking",
    blog: "Blog & Artikel",
    settings: "Website Setting",
    users: "Manajemen User",
    tambah: "Tambah Baru",
    edit: "Edit",
    artikel: "Artikel",
}

export function AdminBreadcrumb() {
    const pathname = usePathname()

    // Split path and filter empty segments
    const segments = pathname.split("/").filter(Boolean)
    // Remove "admin" from start
    const adminSegments = segments.slice(1)

    const crumbs = adminSegments.map((seg, idx) => {
        const label = pageLabels[seg] || seg.charAt(0).toUpperCase() + seg.slice(1)
        const href = "/" + segments.slice(0, idx + 2).join("/")
        return { label, href }
    })

    // Get the current page label for the badge
    const currentLabel = crumbs[crumbs.length - 1]?.label || "Dashboard"

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-sm text-slate-400">
                <Home className="w-3.5 h-3.5" />
                <span className="text-slate-400">Admin</span>
                {crumbs.map((crumb, idx) => (
                    <span key={idx} className="flex items-center gap-1">
                        <ChevronRight className="w-3.5 h-3.5" />
                        {idx === crumbs.length - 1 ? (
                            <span className="font-semibold text-slate-700">{crumb.label}</span>
                        ) : (
                            <a href={crumb.href} className="hover:text-slate-600 transition-colors">
                                {crumb.label}
                            </a>
                        )}
                    </span>
                ))}
            </div>
            <span className="ml-1 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-blue/10 text-primary-blue border border-primary-blue/20">
                {currentLabel}
            </span>
        </div>
    )
}
