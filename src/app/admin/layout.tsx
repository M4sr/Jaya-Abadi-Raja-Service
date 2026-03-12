import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"
import { SidebarClientWrapper } from "@/components/admin/SidebarClientWrapper"
import { AdminBreadcrumb } from "@/components/admin/AdminBreadcrumb"


export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
        redirect("/admin-login")
    }

    // Fetch custom logo from settings
    const logoSetting = await prisma.setting.findUnique({ where: { key: "site_logo" } })
    const siteLogo = logoSetting?.value || null

    return (
        <SidebarProvider>
            <SidebarClientWrapper user={session.user} siteLogo={siteLogo} />
            <SidebarInset className="bg-slate-50 h-screen overflow-hidden flex flex-col">
                <header className="flex h-16 shrink-0 bg-white items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                    <div className="w-full flex justify-between items-center">
                        <AdminBreadcrumb />
                    </div>
                </header>
                <main className="flex-1 w-full p-4 overflow-y-auto">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
