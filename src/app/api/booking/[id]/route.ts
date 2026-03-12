import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { pusherServer } from "@/lib/pusher"
import webpush from "@/lib/webpush"
import { getMessaging } from "@/lib/firebase-admin"

const DEFAULT_WHATSAPP_TEMPLATES: Record<string, string> = {
    wa_template_confirmed: `*KONFIRMASI PESANAN - JAYA ABADI RAJA SERVICE* ❄️\n\nHalo *[NAMA_PELANGGAN]*,\n\nPesanan Anda dengan kode *#[KODE_BOOKING]* telah kami *DIKONFIRMASI*. Terima kasih telah mempercayakan layanan AC Anda kepada kami.\n\n*Detail Pesanan:*\n- Layanan: [LAYANAN]\n- Jadwal: [JADWAL]\n- Jam: [JAM]\n- Alamat: [ALAMAT]\n\n[INFO_TEKNISI]\n\nPantau status pesanan Anda secara real-time di sini:\n🔗 [LINK_TRACKING]\n\nTerima kasih.`,
    wa_template_assigned: `*TEKNISI DITUGASKAN - JAYA ABADI RAJA SERVICE* 🔧\n\nHalo *[NAMA_PELANGGAN]*,\n\nKabar baik! Teknisi *[NAMA_TEKNISI]* telah kami tugaskan untuk menangani pesanan *#[KODE_BOOKING]* Anda. Selanjutnya teknisi kami akan menghubungi Anda untuk konfirmasi waktu kedatangan.\n\n*Kontak Teknisi:*\n📱 [PHONE_TEKNISI][LINK_CHAT_WA]\n\n*Jadwal Kunjungan:*\n- Hari: [JADWAL]\n- Jam: [JAM]\n\nCek profil teknisi & status terbaru di sini:\n🔗 [LINK_TRACKING]\n\nSampai jumpa di lokasi.`,
    wa_template_on_the_way: `*TEKNISI MENUJU LOKASI - JAYA ABADI RAJA SERVICE* 🛵\n\nHalo *[NAMA_PELANGGAN]*,\n\nTeknisi kami sedang dalam perjalanan menuju lokasi Anda untuk pesanan *#[KODE_BOOKING]*. Mohon pastikan ada orang di lokasi saat teknisi tiba.\n\nLacak lokasi teknisi secara real-time di sini:\n🔗 [LINK_TRACKING]\n\nTetap sejuk bersama Jaya Abadi!`,
    wa_template_arrived: `*TEKNISI TELAH TIBA - JAYA ABADI RAJA SERVICE* 📍\n\nHalo *[NAMA_PELANGGAN]*,\n\nTeknisi kami telah sampai di lokasi tujuan untuk pesanan *#[KODE_BOOKING]*. Proses pengerjaan akan segera dimulai.\n\nCek progress pengerjaan di sini:\n🔗 [LINK_TRACKING]\n\nTerima kasih.`,
    wa_template_done: `*PESANAN SELESAI - JAYA ABADI RAJA SERVICE* ✅\n\nHalo *[NAMA_PELANGGAN]*,\n\nSelamat! Pekerjaan untuk pesanan *#[KODE_BOOKING]* telah *SELESAI* dikerjakan. Semoga udara di ruangan Anda kembali sejuk dan nyaman.\n\n*Detail Selesai:*\n- Layanan: [LAYANAN]\n- Tanggal: [TANGGAL_SELESAI]\n\nKami sangat menghargai feedback Anda. Silakan isi ulasan melalui link berikut:\n🔗 [LINK_TRACKING]\n\nTerima kasih telah berlangganan!`,
    wa_template_cancelled: `*PESANAN DIBATALKAN - JAYA ABADI RAJA SERVICE* ❌\n\nHalo *[NAMA_PELANGGAN]*,\n\nKami menginformasikan bahwa pesanan *#[KODE_BOOKING]* Anda telah *DIBATALKAN*.\n\nJika ini adalah kekeliruan atau Anda ingin menjadwalkan ulang, silakan hubungi admin kami atau buat pesanan baru di website.\n\nDetail lengkap:\n🔗 [LINK_TRACKING]\n\nSalam, Jaya Abadi Raja Service.`
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
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                layanan: true,
                teknisi: {
                    include: {
                        user: { select: { name: true, phone: true, avatar: true } }
                    }
                },
                pelanggan: {
                    select: { name: true, phone: true, email: true }
                },
                statusLogs: {
                    orderBy: { createdAt: 'desc' },
                    include: {
                        // Include user info for who changed it if possible, but currently we just store 'changedBy' string.
                        // If changedBy contains userId, we could relate it, but it's just a string in schema.
                    }
                }
            }
        })

        if (!booking) return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 })

        return NextResponse.json(booking)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal mengambil data booking", details: error.message }, { status: 500 })
    }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { id } = await context.params
        const data = await request.json()

        // Ambil data lama untuk cek perubahan status
        const currentBooking = await prisma.booking.findUnique({ where: { id } })
        if (!currentBooking) return NextResponse.json({ error: "Booking tidak ditemukan" }, { status: 404 })

        // Data yang akan diupdate
        const updateData: any = {}

        if (data.status && data.status !== currentBooking.status) {
            updateData.status = data.status
            // Track specific timestamps based on status
            if (data.status === 'CONFIRMED') updateData.confirmedAt = new Date()
            if (data.status === 'DONE') updateData.doneAt = new Date()
        }

        if (data.teknisiId !== undefined) updateData.teknisiId = data.teknisiId
        if (data.jadwalTanggal) updateData.jadwalTanggal = new Date(data.jadwalTanggal)
        if (data.jadwalWaktu) updateData.jadwalWaktu = data.jadwalWaktu
        if (data.catatanTeknisi) updateData.catatanTeknisi = data.catatanTeknisi

        // Lakukan update menggunakan transaksi agar log status juga terbuat
        const result = await prisma.$transaction(async (tx) => {
            const updatedBooking = await (tx as any).booking.update({
                where: { id },
                data: updateData,
                include: {
                    pushSubscriptions: true,
                    pelanggan: { select: { name: true } },
                    layanan: { select: { nama: true } },
                    teknisi: {
                        include: {
                            user: { select: { name: true, phone: true, fcmToken: true } }
                        }
                    }
                }
            })

            // Jika status berubah, insert ke log
            if (data.status && data.status !== currentBooking.status) {
                await tx.bookingStatusLog.create({
                    data: {
                        bookingId: id,
                        status: data.status as any,
                        keterangan: data.keterangan || `Status diubah dari ${currentBooking.status} menjadi ${data.status} oleh Admin`,
                        changedBy: session.user.id || session.user.name,
                    }
                })
            }

            return updatedBooking
        })

        // --- Notifikasi (Dilakukan di luar transaksi agar tidak membebani/timeout) ---
        if (data.status && data.status !== currentBooking.status) {
            // 1. Trigger Pusher untuk Real-time Timeline
            try {
                await pusherServer.trigger(`booking-${id}`, 'status-updated', {
                    status: data.status,
                    kodeBooking: result.kodeBooking
                })
            } catch (pe) {
                console.error("Pusher trigger error:", pe)
            }

            // 2. Trigger Web Push untuk Notifikasi Background
            const subscriptions = (result as any).pushSubscriptions
            if (subscriptions && subscriptions.length > 0) {
                const statusLabels: Record<string, string> = {
                    PENDING_WA: 'Menunggu Konfirmasi',
                    CONFIRMED: 'Terkonfirmasi',
                    ASSIGNED: 'Teknisi Ditugaskan',
                    ON_THE_WAY: 'Sedang Menuju Lokasi',
                    ARRIVED: 'Tiba di Lokasi',
                    IN_PROGRESS: 'Dalam Pengerjaan',
                    DONE: 'Selesai',
                    CANCELLED: 'Dibatalkan'
                }
                const readableStatus = statusLabels[data.status] || data.status

                const payload = JSON.stringify({
                    title: "Jaya Abadi Raja Service",
                    body: `Status pesanan #${result.kodeBooking} Anda kini: ${readableStatus}`,
                    url: `/booking/track?code=${result.kodeBooking}&phone=${result.noHp}`
                })

                await Promise.all(subscriptions.map((sub: any) => {
                    return webpush.sendNotification(
                        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
                        payload
                    ).catch(async e => {
                        console.error("WebPush send error:", e)
                        if (e.statusCode === 410 || e.statusCode === 404) {
                            await (prisma as any).pushSubscription.delete({ where: { id: sub.id } }).catch(() => {})
                        }
                    })
                }))
            }

            // 3. Trigger Firebase Push Notification for Technician
            if (data.status === 'ASSIGNED' && (result as any).teknisi?.user?.fcmToken) {
                const technicianToken = (result as any).teknisi.user.fcmToken
                const messaging = getMessaging()
                
                if (messaging) {
                    const payload = {
                        notification: {
                            title: "Tugas Baru!",
                            body: `Anda ditugaskan untuk pesanan #${result.kodeBooking} (${(result as any).layanan?.nama || 'Service AC'})`,
                        },
                        data: {
                            bookingId: result.id,
                            type: "NEW_ASSIGNMENT",
                            click_action: "FLUTTER_NOTIFICATION_CLICK",
                        },
                        token: technicianToken,
                    }

                    try {
                        await messaging.send(payload)
                        console.log(`FCM Notification sent to technician: ${(result as any).teknisi.user.name}`)
                    } catch (fe) {
                        console.error("FCM Send Error:", fe)
                    }
                } else {
                    console.warn("Skipping FCM send: Firebase messaging is not initialized.")
                }
            }

            // 4. Trigger WhatsApp Notification (Fonnte)
            try {
                const { sendWhatsAppMessage } = await import("@/lib/whatsapp")
                
                const customerPhone = result.noHp
                const kodeBooking = result.kodeBooking
                const namaPelanggan = (result as any).pelanggan?.name || result.namaPelanggan || "Pelanggan"
                const namaLayanan = (result as any).layanan?.nama || "Service AC"
                const jadwalStr = result.jadwalTanggal ? new Date(result.jadwalTanggal).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "-"
                const waktuStr = result.jadwalWaktu || "-"
                const alamatStr = result.alamat || "-"
                
                const baseUrl = process.env.NEXTAUTH_URL || 'https://jayaabadirajaservice.com' // Fallback to domain if env not set
                const trackingLink = `${baseUrl}/booking/track?code=${kodeBooking}&phone=${customerPhone}`
                
                const teknisi = (result as any).teknisi
                const namaTeknisi = teknisi?.user?.name || "Tim Teknisi Kami"
                const phoneTeknisi = teknisi?.user?.phone || ""
                const waLinkTeknisi = phoneTeknisi ? `https://wa.me/${phoneTeknisi.replace(/^0/, '62')}` : ""

                const waSettings = await prisma.setting.findMany({
                    where: { key: { startsWith: 'wa_template_' } }
                })
                const templates = waSettings.reduce((acc: any, curr) => {
                    acc[curr.key] = curr.value
                    return acc
                }, {})

                const placeholders = {
                    NAMA_PELANGGAN: namaPelanggan,
                    KODE_BOOKING: kodeBooking,
                    LAYANAN: namaLayanan,
                    JADWAL: jadwalStr,
                    JAM: waktuStr,
                    ALAMAT: alamatStr,
                    LINK_TRACKING: trackingLink,
                    NAMA_TEKNISI: namaTeknisi,
                    PHONE_TEKNISI: phoneTeknisi,
                    LINK_CHAT_WA: waLinkTeknisi ? `\n🔗 Chat: ${waLinkTeknisi}` : "",
                    INFO_TEKNISI: teknisi ? `*Teknisi Ditugaskan:* ${namaTeknisi}` : "Kami akan segera menjadwalkan kunjungan teknisi kami.",
                    TANGGAL_SELESAI: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
                }

                const getMsg = (status: string) => {
                    const key = `wa_template_${status.toLowerCase()}`
                    const template = templates[key] || DEFAULT_WHATSAPP_TEMPLATES[key]
                    return template ? replacePlaceholders(template, placeholders) : ""
                }

                let waMessage = getMsg(data.status)

                if (waMessage && customerPhone) {
                    await sendWhatsAppMessage(customerPhone, waMessage)
                }
            } catch (wae) {
                console.error("WhatsApp Send Error:", wae)
            }
        }

        return NextResponse.json(result)
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal mengupdate booking", details: error.message }, { status: 500 })
    }
}
