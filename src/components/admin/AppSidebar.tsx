"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarMenuSubButton,
    useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import {
    LayoutDashboard,
    Wrench,
    Images,
    FileText,
    CalendarCheck,
    PenLine,
    Settings2,
    Users,
    Snowflake,
    Globe,
    PieChart,
    MessageSquare,
    ChevronRight
} from "lucide-react"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"

const adminNav = [
    {
        group: "UTAMA",
        items: [
            { icon: LayoutDashboard, title: "Dashboard", url: "/admin" },
        ],
    },
    {
        group: "MASTER DATA",
        items: [
            { icon: Wrench, title: "Layanan", url: "/admin/layanan" },
            { icon: Wrench, title: "Kategori Layanan", url: "/admin/kategori-layanan" },
            { icon: Images, title: "Galeri Foto", url: "/admin/galeri" },
            { icon: FileText, title: "Legalitas", url: "/admin/legalitas" },
        ],
    },
    {
        group: "TRANSAKSI",
        items: [
            { icon: CalendarCheck, title: "Data Booking", url: "/admin/booking" },
        ],
    },
    {
        group: "KONTEN",
        items: [
            { icon: PenLine, title: "Blog & Artikel", url: "/admin/blog" },
        ],
    },
    {
        group: "LAPORAN",
        items: [
            { icon: PieChart, title: "Laporan Keuangan", url: "/admin/laporan/keuangan" },
            { icon: Users, title: "Performa Teknisi", url: "/admin/laporan/teknisi" },
            { icon: MessageSquare, title: "Ulasan & Komplain", url: "/admin/laporan/feedback" },
        ],
    },
    {
        group: "PENGATURAN",
        items: [
            { 
                icon: Settings2, 
                title: "Website Setting", 
                url: "/admin/settings",
                subItems: [
                    { title: "Pengaturan Umum", url: "/admin/settings" },
                    { title: "Template Chat WhatsApp", url: "/admin/settings/whatsapp" },
                ]
            },
            { icon: Users, title: "Manajemen Pengguna", url: "/admin/users" },
        ],
    },
]

function CollapsibleMenuItem({ item, pathname, isActive }: { item: any, pathname: string, isActive: boolean }) {
    const { setOpenMobile, isMobile } = useSidebar()
    const [open, setOpen] = React.useState(item.subItems.some((sub: any) => pathname === sub.url))

    // Auto-expand if navigating into a sub-item via direct URL change
    React.useEffect(() => {
        if (item.subItems.some((sub: any) => pathname === sub.url)) {
            setOpen(true)
        }
    }, [pathname, item.subItems])

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
            <CollapsibleTrigger
                render={
                    <SidebarMenuButton 
                        tooltip={item.title}
                        className={isActive ? "bg-blue-600/10 text-blue-400" : ""}
                    >
                        <item.icon className={isActive ? "text-blue-400" : "text-slate-400"} />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                }
            />
            <CollapsibleContent>
                <SidebarMenuSub>
                    {item.subItems.map((sub: any) => (
                        <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton 
                                render={<Link href={sub.url} />}
                                isActive={pathname === sub.url}
                                onClick={() => {
                                    if (isMobile) setOpenMobile(false)
                                }}
                            >
                                <span>{sub.title}</span>
                            </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                    ))}
                </SidebarMenuSub>
            </CollapsibleContent>
        </Collapsible>
    )
}

export function AppSidebar({ user, siteLogo, ...props }: React.ComponentProps<typeof Sidebar> & { user: any; siteLogo?: string | null }) {
    const pathname = usePathname()
    const { setOpenMobile, isMobile } = useSidebar()

    return (
        <Sidebar
            collapsible="icon"
            style={{
                // Tailwind v4 uses oklch() — must match that format
                "--sidebar": "oklch(0.155 0.04 252)",           // deep navy background
                "--sidebar-foreground": "oklch(0.82 0.04 252)", // light blue-grey text
                "--sidebar-accent": "oklch(0.22 0.04 252)",     // hover bg
                "--sidebar-accent-foreground": "oklch(1 0 0)",  // white hover text
                "--sidebar-border": "oklch(0.25 0.03 252)",     // subtle border
                "--sidebar-primary": "oklch(0.58 0.2 262)",     // active blue
                "--sidebar-primary-foreground": "oklch(1 0 0)", // white active text
                "--sidebar-ring": "oklch(0.58 0.2 262)",
            } as React.CSSProperties}
            {...props}
        >
            {/* Header — brand */}
            <SidebarHeader className="border-b border-white/10 pb-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="bg-white/10 hover:bg-white/15 text-white data-[state=open]:bg-white/15"
                        >
                            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-white overflow-hidden shrink-0">
                                {siteLogo ? (
                                    <img src={siteLogo} alt="Logo" className="w-full h-full object-contain" />
                                ) : (
                                    <Snowflake className="size-5 text-blue-600" />
                                )}
                            </div>
                            <div className="flex flex-col gap-0.5 leading-none">
                                <span className="font-bold text-sm text-white">Jaya Abadi Raja Service</span>
                                <span className="text-[10px] bg-blue-500/30 text-blue-200 px-1.5 py-0.5 rounded-full w-max border border-blue-400/30">Admin Panel</span>
                            </div>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            {/* Nav items */}
            <SidebarContent>
                {adminNav.map((section, index) => (
                    <SidebarGroup key={index}>
                        <SidebarGroupLabel className="text-[10px] font-bold tracking-widest text-blue-300/60 uppercase px-3 pt-3 pb-1">
                            {section.group}
                        </SidebarGroupLabel>
                        <SidebarMenu>
                            {section.items.map((item) => {
                                // Fix active state: Dashboard is /admin. We don't want /admin/anything to match it.
                                const isActive = item.url === "/admin"
                                    ? pathname === "/admin" || pathname === "/admin/dashboard"
                                    : pathname === item.url || pathname.startsWith(item.url + "/")

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        {item.subItems ? (
                                            <CollapsibleMenuItem item={item} pathname={pathname} isActive={isActive} />
                                        ) : (
                                            <SidebarMenuButton
                                                render={<Link href={item.url} />}
                                                tooltip={item.title}
                                                isActive={isActive}
                                                onClick={() => {
                                                    if (isMobile) setOpenMobile(false)
                                                }}
                                                className={isActive
                                                    ? "!bg-blue-600 !text-white hover:!bg-blue-500 font-medium shadow-sm"
                                                    : "text-slate-300 hover:bg-white/10 hover:text-white"
                                                }
                                            >
                                                <item.icon className={isActive ? "text-white" : "text-slate-400"} />
                                                <span>{item.title}</span>
                                            </SidebarMenuButton>
                                        )}
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="border-t border-white/10 pt-2">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            render={<Link href="/" target="_blank" />}
                            tooltip="Lihat Website"
                            className="text-slate-400 hover:text-white hover:bg-white/10"
                        >
                            <Globe className="text-slate-400" />
                            <span>Lihat Website</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                {user && <NavUser user={user} />}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
