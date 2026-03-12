import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding data...')

    // 1. Create Developer/Admin user
    const hashedPassword = await bcrypt.hash('password123', 10)

    const devUser = await prisma.user.upsert({
        where: { email: 'developer@jayarajaserivce.com' },
        update: {},
        create: {
            name: 'Developer Admin',
            email: 'developer@jayarajaserivce.com',
            username: 'developer',
            password: hashedPassword,
            phone: '081234567890',
            role: 'DEVELOPER',
        },
    })

    // 2. Insert Settings
    const defaultSettings = [
        { key: 'site_name', value: 'PT. Jaya Abadi Raja Service', label: 'Nama Website/Perusahaan' },
        { key: 'wa_number', value: '6281234567890', label: 'No. WhatsApp' },
        { key: 'email', value: 'info@jayaabadirajaservice.com', label: 'Email' },
        { key: 'address', value: 'Jl. Contoh Alamat Pekanbaru No. 123', label: 'Alamat Lengkap' },
        { key: 'about_text', value: 'Kami adalah penyedia layanan AC terbaik di Pekanbaru.', label: 'Tentang Kami' },
        { key: 'facebook_url', value: 'https://facebook.com', label: 'Facebook URL' },
        { key: 'instagram_url', value: 'https://instagram.com', label: 'Instagram URL' },
        { key: 'jam_operasional', value: 'Senin - Sabtu, 08:00 - 17:00 (Layanan Darurat 24/7)', label: 'Jam Operasional' },
    ]

    for (const setting of defaultSettings) {
        await prisma.setting.upsert({
            where: { key: setting.key },
            update: {},
            create: setting,
        })
    }

    // 3. Insert default Layanan
    const layananMock = [
        { nama: 'Cuci AC (Cleaning)', slug: 'cuci-ac-cleaning', hargaMulai: 75000, estimasiMenit: 60, deskripsi: 'Pembersihan AC indoor dan outdoor secara menyeluruh' },
        { nama: 'Bongkar Pasang AC', slug: 'bongkar-pasang-ac', hargaMulai: 250000, estimasiMenit: 120, deskripsi: 'Layanan bongkar dan pasang AC dari lokasi lama ke baru' },
        { nama: 'Isi Freon', slug: 'isi-freon', hargaMulai: 150000, estimasiMenit: 45, deskripsi: 'Pengisian ulang / tambah freon AC semua tipe' },
        { nama: 'Perbaikan Kompresor', slug: 'perbaikan-kompresor', hargaMulai: 400000, estimasiMenit: 180, deskripsi: 'Perbaikan atau penggantian kompresor AC yang rusak' },
        { nama: 'Pengecekan AC', slug: 'pengecekan-ac', hargaMulai: 50000, estimasiMenit: 30, deskripsi: 'Layanan pengecekan kerusakan awal AC' },
    ]

    for (const layanan of layananMock) {
        await prisma.layanan.upsert({
            where: { slug: layanan.slug },
            update: {},
            create: layanan,
        })
    }

    console.log('Seeding completed successfully.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
