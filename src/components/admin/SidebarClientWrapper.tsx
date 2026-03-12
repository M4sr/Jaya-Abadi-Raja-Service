"use client"

import dynamic from "next/dynamic"

// ssr: false must be used inside a Client Component
const AppSidebarDynamic = dynamic(
    () => import("@/components/admin/AppSidebar").then((m) => m.AppSidebar),
    { ssr: false }
)

export function SidebarClientWrapper({ user, siteLogo }: { user: any; siteLogo?: string | null }) {
    return <AppSidebarDynamic user={user} siteLogo={siteLogo} />
}
