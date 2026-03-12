import prisma from "@/lib/prisma"
import UsersClient from "@/components/admin/UsersClient"
import { deleteUser } from "./actions"


export const dynamic = "force-dynamic"

export default async function UsersPage({
    searchParams,
}: {
    searchParams: Promise<{
        role?: string;
        page?: string;
        limit?: string;
        sort?: string;
        order?: string
    }>
}) {
    const params = await searchParams
    const currentTab = params.role || 'ALL'
    const page = parseInt(params.page || '1')
    const limit = parseInt(params.limit || '10')
    const sort = params.sort || 'createdAt'
    const order = (params.order as 'asc' | 'desc') || 'desc'

    const skip = (page - 1) * limit
    const take = limit

    const whereCondition: any = {}
    if (currentTab !== 'ALL') {
        whereCondition.role = currentTab
    }

    const [users, totalItems] = await Promise.all([
        prisma.user.findMany({
            where: whereCondition,
            orderBy: { [sort]: order },
            skip,
            take,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                username: true,
                role: true,
                isActive: true,
                createdAt: true,
                lastLoginAt: true,
                teknisiProfile: {
                    select: { status: true, totalJobs: true, ratingAvg: true }
                }
            }
        }),
        prisma.user.count({ where: whereCondition })
    ])

    const totalPages = Math.ceil(totalItems / limit)

    const tabs = [
        { id: 'ALL', label: 'Semua Akses' },
        { id: 'PELANGGAN', label: 'Pelanggan' },
        { id: 'TEKNISI', label: 'Teknisi' },
        { id: 'ADMIN', label: 'Admin Ops' },
        { id: 'OWNER', label: 'Owner/Dev' },
    ]

    return (
        <UsersClient
            users={users}
            totalItems={totalItems}
            page={page}
            limit={limit}
            sort={sort}
            order={order}
            totalPages={totalPages}
            currentTab={currentTab}
            tabs={tabs}
            deleteUser={deleteUser}
        />
    )
}
