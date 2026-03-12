"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Mail, Phone, Pencil, Calendar, Settings, Wrench, Clock, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import Link from "next/link"
import UserDialog from "@/components/admin/UserDialog"
import UserStatusToggle from "@/components/admin/UserStatusToggle"
import DeleteUserButton from "@/components/admin/DeleteUserButton"
import { DataTablePagination } from "@/components/admin/DataTablePagination"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface UsersClientProps {
    users: any[];
    totalItems: number;
    page: number;
    limit: number;
    sort: string;
    order: string;
    totalPages: number;
    currentTab: string;
    tabs: { id: string, label: string }[];
    deleteUser: (id: string) => Promise<void>;
}

export default function UsersClient({
    users,
    totalItems,
    page,
    limit,
    sort,
    order,
    totalPages,
    currentTab,
    tabs,
    deleteUser
}: UsersClientProps) {
    const getRoleBadgeInfo = (role: string) => {
        switch (role) {
            case 'OWNER':
            case 'DEVELOPER': return { icon: <Settings className="w-3 h-3 mr-1" />, cls: "bg-purple-100 text-purple-800" }
            case 'ADMIN': return { icon: <Settings className="w-3 h-3 mr-1" />, cls: "bg-accent-cyan/20 text-cyan-800" }
            case 'TEKNISI': return { icon: <Wrench className="w-3 h-3 mr-1" />, cls: "bg-blue-100 text-blue-800" }
            default: return { icon: <Users className="w-3 h-3 mr-1" />, cls: "bg-slate-100 text-slate-700" }
        }
    }

    const formatDate = (dateValue: any) => {
        if (!dateValue) return '-'
        const date = new Date(dateValue)
        return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
    }

    return (
        <PageWrapper>
            <AnimationItem>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Manajemen Pengguna</h1>
                        <p className="text-slate-500 text-sm mt-1">Kelola data pelanggan, teknisi, dan admin sistem</p>
                    </div>
                    <UserDialog />
                </div>
            </AnimationItem>

            <AnimationItem>
                <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100 overflow-x-auto w-full md:w-auto self-start">
                    {tabs.map((tab) => (
                        <Link key={tab.id} href={`/admin/users?role=${tab.id}`}>
                            <span className={`px-5 py-2 block text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${currentTab === tab.id ? 'bg-primary-blue text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                                {tab.label}
                            </span>
                        </Link>
                    ))}
                </div>
            </AnimationItem>

            <AnimationItem>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/users?role=${currentTab}&sort=name&order=${sort === 'name' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Nama Lengkap
                                            {sort === 'name' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4">Kontak</th>
                                    <th className="px-6 py-4 text-center cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/users?role=${currentTab}&sort=role&order=${sort === 'role' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center justify-center gap-1">
                                            Tipe Akses
                                            {sort === 'role' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 text-center">Status Akun</th>
                                    <th className="px-6 py-4 cursor-pointer hover:bg-slate-100/80 transition-colors group">
                                        <Link href={`/admin/users?role=${currentTab}&sort=createdAt&order=${sort === 'createdAt' && order === 'asc' ? 'desc' : 'asc'}`} className="flex items-center gap-1">
                                            Info Login
                                            {sort === 'createdAt' ? (order === 'asc' ? <ArrowUp className="w-3 h-3 text-primary-600" /> : <ArrowDown className="w-3 h-3 text-primary-600" />) : <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                                        </Link>
                                    </th>
                                    <th className="px-6 py-4 text-center w-28">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-slate-700">
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                                            Tidak ada pengguna ditemukan untuk filter ini.
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((item) => {
                                        const badge = getRoleBadgeInfo(item.role)
                                        return (
                                            <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-slate-800">{item.name}</div>
                                                    {item.username && <div className="text-xs text-slate-400 font-mono mt-0.5">@{item.username}</div>}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1 text-xs">
                                                        {item.phone && (
                                                            <div className="flex items-center text-slate-600">
                                                                <Phone className="w-3 h-3 mr-1.5 text-slate-400" /> {item.phone}
                                                            </div>
                                                        )}
                                                        {item.email && (
                                                            <div className="flex items-center text-slate-600">
                                                                <Mail className="w-3 h-3 mr-1.5 text-slate-400" /> {item.email}
                                                            </div>
                                                        )}
                                                        {!item.email && !item.phone && <span className="text-slate-400 italic">Tidak ada kontak</span>}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <Badge className={`border-0 font-medium flex items-center justify-center w-28 mx-auto hover:opacity-100 cursor-default ${badge.cls}`}>
                                                        {badge.icon} {item.role}
                                                    </Badge>
                                                    {item.role === 'TEKNISI' && item.teknisiProfile && (
                                                        <div className="text-[10px] text-slate-500 mt-1 font-medium">
                                                            ⭐ {item.teknisiProfile.ratingAvg.toFixed(1)} | {item.teknisiProfile.totalJobs} Jobs
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <UserStatusToggle userId={item.id} initialActive={item.isActive} />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col gap-1.5 text-[11px] text-slate-500">
                                                        <div className="flex items-center">
                                                            <Calendar className="w-3 h-3 mr-1 shrink-0" /> Reg: {formatDate(item.createdAt)}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <Clock className="w-3 h-3 mr-1 shrink-0" /> Lgn: {formatDate(item.lastLoginAt)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <UserDialog
                                                            initialData={item}
                                                            trigger={
                                                                <Button variant="outline" size="icon" className="h-8 w-8 text-primary-blue-medium border-primary-blue-medium/20 hover:bg-blue-50">
                                                                    <Pencil className="w-4 h-4" />
                                                                </Button>
                                                            }
                                                        />
                                                        <DeleteUserButton
                                                            userId={item.id}
                                                            userName={item.name}
                                                            deleteAction={deleteUser}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    <DataTablePagination
                        totalItems={totalItems}
                        pageSize={limit}
                        currentPage={page}
                        totalPages={totalPages}
                    />
                </div>
            </AnimationItem>
        </PageWrapper>
    )
}
