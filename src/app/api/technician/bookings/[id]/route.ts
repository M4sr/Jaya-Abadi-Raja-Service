import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { pusherServer } from "@/lib/pusher"
import webpush from "@/lib/webpush"

const DEFAULT_WHATSAPP_TEMPLATES: Record<string, string> = {
    wa_template_on_the_way: `*TEKNISI MENUJU LOKASI - JAYA ABADI RAJA SERVICE* 🛵\n\nHalo *[NAMA_PELANGGAN]*,\n\nTeknisi kami sedang dalam perjalanan menuju lokasi Anda untuk pesanan *#[KODE_BOOKING]*. Mohon pastikan ada orang di lokasi saat teknisi tiba.\n\nLacak lokasi teknisi secara real-time di sini:\n🔗 [LINK_TRACKING]\n\nTetap sejuk bersama Jaya Abadi!`,
    wa_template_arrived: `*TEKNISI TELAH TIBA - JAYA ABADI RAJA SERVICE* 📍\n\nHalo *[NAMA_PELANGGAN]*,\n\nTeknisi kami telah sampai di lokasi tujuan untuk pesanan *#[KODE_BOOKING]*. Proses pengerjaan akan segera dimulai.\n\nCek progress pengerjaan di sini:\n🔗 [LINK_TRACKING]\n\nTerima kasih.`,
    wa_template_done: `*PESANAN SELESAI - JAYA ABADI RAJA SERVICE* ✅\n\nHalo *[NAMA_PELANGGAN]*,\n\nSelamat! Pekerjaan untuk pesanan *#[KODE_BOOKING]* telah *SELESAI* dikerjakan. Semoga udara di ruangan Anda kembali sejuk dan nyaman.\n\n*Detail Selesai:*\n- Layanan: [LAYANAN]\n- Tanggal: [TANGGAL_SELESAI]\n\nKami sangat menghargai feedback Anda. Silakan isi ulasan melalui link berikut:\n🔗 [LINK_TRACKING]\n\nTerima kasih telah berlangganan!`,
}

function replacePlaceholders(template: string, placeholders: Record<string, string>) {
    let result = template
    Object.entries(placeholders).forEach(([key, value]) => {
        result = result.split(`[${key}]`).join(value || "")
    })
    return result
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                layanan: true,
                pelanggan: true,
                statusLogs: { orderBy: { createdAt: 'desc' } }
            }
        })

        if (!booking) return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 })

        return NextResponse.json(booking)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal mengambil data booking", details: error.message }, { status: 500 })
    }
}

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await context.params
        const { status, catatanTeknisi, fotoBefore, fotoAfter, technicianId } = await request.json()

        const currentBooking = await prisma.booking.findUnique({ where: { id } })
        if (!currentBooking) return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 })

        const updateData: any = {}
        if (status) {
            updateData.status = status
            if (status === 'DONE') updateData.doneAt = new Date()
        }
        if (catatanTeknisi !== undefined) updateData.catatanTeknisi = catatanTeknisi
        if (fotoBefore !== undefined) updateData.fotoBefore = fotoBefore
        if (fotoAfter !== undefined) updateData.fotoAfter = fotoAfter

        const result = await prisma.$transaction(async (tx) => {
            const updated = await (tx as any).booking.update({
                where: { id },
                data: updateData,
                include: {
                    layanan: true,
                    teknisi: { include: { user: true } },
                    pushSubscriptions: true
                }
            })

            if (status && status !== currentBooking.status) {
                await tx.bookingStatusLog.create({
                    data: {
                        bookingId: id,
                        status: status,
                        keterangan: `Status diubah menjadi ${status} oleh Teknisi melalui Mobile App`,
                        changedBy: technicianId || "Teknisi"
                    }
                })
            }

            return updated
        })

        // Notifications
        if (status && status !== currentBooking.status) {
            // 1. Pusher
            await pusherServer.trigger(`booking-${id}`, 'status-updated', { status, kodeBooking: result.kodeBooking }).catch(console.error)

            // 2. Web Push
            const subscriptions = (result as any).pushSubscriptions
            if (subscriptions?.length > 0) {
                const payload = JSON.stringify({
                    title: "Update Pesanan",
                    body: `Pesanan #${result.kodeBooking} statusnya berubah menjadi: ${status}`,
                    url: `/booking/track?code=${result.kodeBooking}&phone=${result.noHp}`
                })
                await Promise.all(subscriptions.map((sub: any) => 
                    webpush.sendNotification({ endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } }, payload).catch(() => {})
                ))
            }

            // 3. WhatsApp
            try {
                const { sendWhatsAppMessage } = await import("@/lib/whatsapp")
                const waSettings = await prisma.setting.findMany({ where: { key: { startsWith: 'wa_template_' } } })
                const templates = waSettings.reduce((acc: any, curr) => { acc[curr.key] = curr.value; return acc }, {})
                
                const baseUrl = process.env.NEXTAUTH_URL || 'https://jayaabadirajaservice.com'
                const placeholders = {
                    NAMA_PELANGGAN: result.namaPelanggan,
                    KODE_BOOKING: result.kodeBooking,
                    LAYANAN: (result as any).layanan?.nama || "Service AC",
                    JADWAL: result.jadwalTanggal ? new Date(result.jadwalTanggal).toLocaleDateString('id-ID') : "-",
                    JAM: result.jadwalWaktu || "-",
                    ALAMAT: result.alamat,
                    LINK_TRACKING: `${baseUrl}/booking/track?code=${result.kodeBooking}&phone=${result.noHp}`,
                    NAMA_TEKNISI: (result as any).teknisi?.user?.name || "Teknisi",
                    TANGGAL_SELESAI: new Date().toLocaleDateString('id-ID')
                }

                const key = `wa_template_${status.toLowerCase()}`
                const waMessage = replacePlaceholders(templates[key] || DEFAULT_WHATSAPP_TEMPLATES[key] || "", placeholders)
                
                if (waMessage) await sendWhatsAppMessage(result.noHp, waMessage)
            } catch (e) { console.error("WA Error:", e) }
        }

        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal update booking", details: error.message }, { status: 500 })
    }
}
