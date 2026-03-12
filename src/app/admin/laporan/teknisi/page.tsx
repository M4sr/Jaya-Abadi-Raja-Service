import { Metadata } from "next"
import prisma from "@/lib/prisma"
import TeknisiReportClient from "@/components/admin/TeknisiReportClient"

export const metadata: Metadata = {
    title: "Laporan Performa Teknisi",
    description: "Rekap performa dan laporan penyelesaian tugas teknisi.",
}


export default async function TeknisiReportPage({
    searchParams,
}: {
    searchParams: Promise<{ month?: string }>
}) {
    // Determine the active month filter
    const today = new Date()
    const resolvedSearchParams = await searchParams
    const activeMonthStr = resolvedSearchParams.month || `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`

    // Calculate date ranges for Prisma
    const [yearStr, monthStr] = activeMonthStr.split("-")
    const yearNum = parseInt(yearStr)
    const monthNum = parseInt(monthStr) - 1 // JS Date month index (0-11)

    const startDate = new Date(yearNum, monthNum, 1)
    const endDate = new Date(yearNum, monthNum + 1, 0, 23, 59, 59, 999)

    // Fetch all technicians with their user data
    const teknisiProfiles = await prisma.teknisiProfile.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    phone: true,
                    email: true,
                }
            }
        },
        orderBy: {
            user: { name: 'asc' }
        }
    })

    // Fetch all bookings that were DONE within this month
    const monthlyBookings = await prisma.booking.findMany({
        where: {
            status: "DONE",
            doneAt: {
                gte: startDate,
                lte: endDate
            },
            teknisiId: {
                not: null
            }
        },
        select: {
            teknisiId: true,
            rating: true,
        }
    })

    // Aggregate data per technician
    const teknisiStats = teknisiProfiles.map(profile => {
        const myBookings = monthlyBookings.filter(b => b.teknisiId === profile.id)
        const jobsCompleted = myBookings.length

        // Calculate average rating for THIS MONTH
        const ratedBookings = myBookings.filter(b => b.rating !== null)
        const totalStars = ratedBookings.reduce((sum, b) => sum + (b.rating || 0), 0)
        const monthlyAvgRating = ratedBookings.length > 0 ? (totalStars / ratedBookings.length).toFixed(1) : "0.0"

        // Format area coverage from specific array structure
        let areas = "Belum diatur"
        if (profile.areaCoverage && Array.isArray(profile.areaCoverage) && profile.areaCoverage.length > 0) {
            // Check if it's an array of objects or strings
            if (typeof profile.areaCoverage[0] === 'object') {
                areas = profile.areaCoverage.map((a: any) => a.value || a.label || "").filter(Boolean).join(", ")
            } else {
                areas = profile.areaCoverage.join(", ")
            }
        }

        return {
            ...profile,
            monthlyJobsCompleted: jobsCompleted,
            monthlyAvgRating,
            areas,
            totalRatedJobs: ratedBookings.length
        }
    })

    // Sort by most jobs completed this month
    teknisiStats.sort((a, b) => b.monthlyJobsCompleted - a.monthlyJobsCompleted)

    // Summary logic
    const totalJobsThisMonth = monthlyBookings.length
    const activeTechniciansThisMonth = teknisiStats.filter(t => t.monthlyJobsCompleted > 0).length
    const allRated = monthlyBookings.filter(b => b.rating !== null)
    const overallRating = allRated.length > 0
        ? (allRated.reduce((sum, b) => sum + (b.rating || 0), 0) / allRated.length).toFixed(1)
        : "0.0"

    return (
        <TeknisiReportClient
            startDate={startDate}
            totalJobsThisMonth={totalJobsThisMonth}
            overallRating={overallRating}
            allRatedCount={allRated.length}
            activeTechniciansThisMonth={activeTechniciansThisMonth}
            teknisiStats={teknisiStats}
        />
    )
}
