const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const settings = [
    { key: 'phone', value: '6285219430485', label: 'Nomor Telepon' },
    { key: 'wa_number', value: '6285219430485', label: 'Nomor WhatsApp' },
    { key: 'address', value: 'Jl. Karya Labersa Perumahan Griya Tika Utama Blok G2 No. 17 RT 0044 RW 14 Kel. Air Dingin Kec. Bukit Raya Kota Pekanbaru', label: 'Alamat Kantor' },
    { key: 'email', value: 'jayaabadirajaservice@gmail.com', label: 'Email Resmi' }
  ]

  for (const s of settings) {
    await prisma.setting.upsert({
      where: { key: s.key },
      update: { value: s.value, label: s.label },
      create: { key: s.key, value: s.value, label: s.label, type: 'TEXT', group: 'contact' }
    })
  }
  
  console.log('Contact settings updated successfully.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
