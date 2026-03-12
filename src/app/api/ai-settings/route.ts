import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { namaUsaha, lokasi } = await request.json()

        const apiKey = process.env.GROQ_API_KEY
        console.log("[ai-settings] GROQ_API_KEY loaded:", !!apiKey)

        if (!apiKey) {
            return NextResponse.json({
                error: "Groq API key tidak dikonfigurasi — restart dev server setelah menambah .env"
            }, { status: 500 })
        }

        const prompt = `Kamu adalah copywriter profesional untuk bisnis servis AC di Indonesia.

Buatkan teks website untuk usaha berikut:
Nama Usaha: ${namaUsaha || "Jaya Abadi Raja"}
Lokasi: ${lokasi || "Indonesia"}
Bidang: Jasa service, pemasangan, dan perawatan AC (Air Conditioner)

PENTING: Balas dengan JSON valid satu baris. JANGAN gunakan newline atau baris baru di dalam nilai string JSON.

Buat output dalam format JSON berikut (murni JSON, tanpa markdown):
{"site_title":"...max 60 karakter...","site_description":"...140-160 karakter mengandung kata kunci service AC...","hero_title":"...singkat powerful max 8 kata...","hero_subtitle":"...1-2 kalimat meyakinkan pelanggan...","about_text":"...2-3 kalimat tentang kami profesional...","visi":"...1-2 kalimat visi aspiratif...","misi":"1. Poin pertama | 2. Poin kedua | 3. Poin ketiga (gunakan | sebagai pemisah antar poin, BUKAN newline)"}`

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Kamu adalah copywriter profesional. Selalu balas dengan JSON murni satu baris tanpa newline dalam string values dan tanpa markdown code blocks."
                    },
                    { role: "user", content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 700,
            }),
        })

        console.log("[ai-settings] Groq response status:", groqRes.status)

        if (!groqRes.ok) {
            const err = await groqRes.text()
            console.error("[ai-settings] Groq error body:", err)
            return NextResponse.json({ error: "Groq API error", details: err }, { status: 500 })
        }

        const groqData = await groqRes.json()
        const rawContent: string = groqData.choices?.[0]?.message?.content || "{}"
        console.log("[ai-settings] Raw AI content:", rawContent.slice(0, 300))

        // Remove markdown fences if present
        const cleaned = rawContent.replace(/```json?\n?/g, "").replace(/```/g, "").trim()

        // Escape literal control characters inside JSON string values as fallback
        const sanitized = cleaned.replace(/"((?:[^"\\]|\\.)*)"/g, (match: string) =>
            match.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
        )

        const result = JSON.parse(sanitized)

        return NextResponse.json(result)
    } catch (error: any) {
        console.error("[ai-settings] Unhandled error:", error.message)
        return NextResponse.json({ error: "Gagal generate konten", details: error.message }, { status: 500 })
    }
}
