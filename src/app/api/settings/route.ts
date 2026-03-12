import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"


export async function GET(request: Request) {
    try {
        const settings = await prisma.setting.findMany({
            orderBy: { key: 'asc' }
        })
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: "Gagal mengambil data pengaturan" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const session = await auth()
        if (!session || (session.user.role !== "ADMIN" && session.user.role !== "DEVELOPER" && session.user.role !== "OWNER")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const data = await request.json()
        // Data expected: array of { key: string, value: string }

        if (!Array.isArray(data)) {
            return NextResponse.json({ error: "Invalid data format, expected array" }, { status: 400 })
        }

        // Gunakan upsert agar key baru (misal visi, misi) otomatis dibuat jika belum ada
        const updatePromises = data.map((item: any) =>
            prisma.setting.upsert({
                where: { key: item.key },
                update: { value: item.value },
                create: { key: item.key, value: item.value },
            })
        )

        await prisma.$transaction(updatePromises)

        // --- Sinkronisasi ke .env (Opsional/Sesuai Permintaan User) ---
        const fonnteItem = data.find((item: any) => item.key === 'fonnte_token')
        if (fonnteItem) {
            try {
                const fs = await import('fs')
                const path = await import('path')
                const envPath = path.join(process.cwd(), '.env')
                
                if (fs.existsSync(envPath)) {
                    let content = fs.readFileSync(envPath, 'utf8')
                    const regex = /^FONNTE_TOKEN=.*$/m
                    
                    if (regex.test(content)) {
                        content = content.replace(regex, `FONNTE_TOKEN="${fonnteItem.value}"`)
                    } else {
                        content += `\nFONNTE_TOKEN="${fonnteItem.value}"`
                    }
                    
                    fs.writeFileSync(envPath, content)
                    console.log("FONNTE_TOKEN synchronized to .env")
                }
            } catch (envError) {
                console.error("Gagal sinkronisasi .env:", envError)
            }
        }

        return NextResponse.json({ success: true, message: "Pengaturan berhasil disimpan" })
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal menyimpan pengaturan", details: error.message }, { status: 500 })
    }
}
