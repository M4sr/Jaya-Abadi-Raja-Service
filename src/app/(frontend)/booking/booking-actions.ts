'use server'

import prisma from "@/lib/prisma"
import { BookingStatus } from "@prisma/client"

export async function createBooking(data: any) {
    try {
        // Generate booking code: JA-YYYYMMDD-XXXX
        const today = new Date()
        const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '')
        const count = await prisma.booking.count({
            where: {
                createdAt: {
                    gte: new Date(today.setHours(0, 0, 0, 0)),
                }
            }
        })
        const code = `JA-${dateStr}-${(count + 1).toString().padStart(4, '0')}`

        const booking = await prisma.booking.create({
            data: {
                kodeBooking: code,
                namaPelanggan: data.name,
                noHp: data.phone,
                email: data.email || null,
                alamat: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                mapsLink: data.mapsLink,
                layananId: data.layananId,
                merekAc: data.merekAc,
                kapasitasAc: data.kapasitasAc,
                jumlahUnit: parseInt(data.jumlahUnit) || 1,
                keluhan: data.keluhan,
                jadwalTanggal: new Date(data.tanggal),
                jadwalWaktu: data.waktu,
                status: BookingStatus.PENDING_WA,
            },
            include: {
                layanan: true
            }
        })

        return { success: true, booking }
    } catch (error: any) {
        console.error("Booking Error:", error)
        return { success: false, error: error.message }
    }
}

export async function getBookingStatus(kodeBooking: string, phone: string) {
    try {
        const booking = await prisma.booking.findFirst({
            where: {
                kodeBooking: kodeBooking.toUpperCase(),
                noHp: phone
            },
            include: {
                layanan: true,
                statusLogs: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        })

        if (!booking) {
            return { success: false, error: "Booking tidak ditemukan. Pastikan Kode Booking dan Nomor HP sudah benar." }
        }

        return { success: true, booking }
    } catch (error: any) {
        console.error("Tracking Error:", error)
        return { success: false, error: "Terjadi kesalahan sistem saat melacak" }
    }
}
