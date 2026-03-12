import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { judul, konten, excerpt } = await request.json()

        if (!judul) {
            return NextResponse.json({ error: "Judul artikel diperlukan" }, { status: 400 })
        }

        const apiKey = process.env.GROQ_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: "Groq API key tidak dikonfigurasi" }, { status: 500 })
        }

        // Strip HTML tags from content for cleaner context
        const cleanContent = (konten || "").replace(/<[^>]*>/g, "").slice(0, 2000)

        const prompt = `Kamu adalah ahli SEO untuk website jasa servis AC bernama "Jaya Abadi Raja Service" yang berlokasi di Indonesia.

Berdasarkan artikel berikut, buatkan metadata SEO yang optimal dalam Bahasa Indonesia:

Judul Artikel: ${judul}
Isi Artikel: ${cleanContent || "(belum ada isi konten)"}
Kutipan: ${excerpt || "(belum ada)"}

Buat output dalam format JSON berikut (tanpa markdown, hanya JSON murni):
{
  "metaTitle": "judul SEO menarik, max 60 karakter, sertakan kata kunci utama",
  "metaDescription": "deskripsi meta yang menarik dan informatif, 120-160 karakter, mengandung kata kunci",
  "metaKeywords": "kata kunci 1, kata kunci 2, kata kunci 3, kata kunci 4, kata kunci 5",
  "excerpt": "ringkasan menarik artikel untuk preview di halaman daftar, 1-2 kalimat"
}`

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Kamu adalah asisten SEO profesional. Selalu balas dengan JSON murni tanpa markdown code blocks." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 500,
            }),
        })

        if (!groqRes.ok) {
            const err = await groqRes.text()
            return NextResponse.json({ error: "Groq API error", details: err }, { status: 500 })
        }

        const groqData = await groqRes.json()
        const rawContent = groqData.choices?.[0]?.message?.content || ""

        if (!rawContent) {
            throw new Error("Respon AI kosong")
        }

        // Robust JSON extraction using regex to find the first '{' and last '}'
        const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
        if (!jsonMatch) {
            console.error("AI SEO Response non-JSON:", rawContent)
            throw new Error("Format respon AI tidak valid (bukan JSON)")
        }

        try {
            const seoData = JSON.parse(jsonMatch[0])
            return NextResponse.json(seoData)
        } catch (parseError) {
            console.error("SEO JSON Parse Error. Raw content:", rawContent)
            throw new Error("Gagal memproses data SEO dari AI")
        }
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal generate SEO", details: error.message }, { status: 500 })
    }
}
