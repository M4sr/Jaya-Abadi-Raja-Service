import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

export async function POST(request: Request) {
    try {
        const session = await auth()
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { topic, keyPoints, tone, category } = await request.json()

        if (!topic) {
            return NextResponse.json({ error: "Topik artikel diperlukan" }, { status: 400 })
        }

        const apiKey = process.env.GROQ_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: "Groq API key tidak dikonfigurasi" }, { status: 500 })
        }

        const prompt = `Kamu adalah penulis konten profesional dan ahli SEO untuk website jasa servis AC bernama "Jaya Abadi Raja Service" (lokasi: Indonesia).
Tugasmu adalah menulis artikel blog yang edukatif, menarik, dan ramah SEO.

INFORMASI ARTIKEL:
- Topik Utama: ${topic}
- Poin Penting: ${keyPoints || "Gunakan keahlianmu untuk menentukan poin penting yang relevan"}
- Gaya Penulisan: ${tone || "Informatif dan Profesional"}
- Kategori: ${category || "Umum"}

INSTRUKSI KHUSUS:
1. Gunakan Bahasa Indonesia yang kasual namun tetap profesional (semacam gaya portal berita gaya hidup/properti).
2. Struktur artikel harus terdiri dari:
   - Judul yang menarik (Clickworthy)
   - Pendahuluan yang memikat
   - Minimal 3 sub-judul (menggunakan tag <h2> dan <h3>)
   - Gunakan List (<ul> atau <ol>) jika relevan
   - Penutup/Kesimpulan yang menyertakan sedikit promosi halus tentang "Jaya Abadi Raja Service" sebagai solusi AC terpercaya.
3. FORMAT OUTPUT: Harus dalam JSON murni dengan struktur:
{
  "judul": "Judul artikel saja",
  "konten": "Isi artikel lengkap dalam format HTML (gunakan tag <h2>, <h3>, <p>, <ul>, <li>, <strong>)",
  "excerpt": "Ringkasan singkat (1-2 kalimat) untuk preview card",
  "metaTitle": "Meta title SEO (max 60 karakter)",
  "metaDescription": "Meta description SEO (120-160 karakter)",
  "metaKeywords": "keyword1, keyword2, keyword3, keyword4, keyword5",
  "kategori": "Kategori yang paling relevan (1-2 kata)",
  "tags": "Tag1, Tag2, Tag3, Tag4 (pisahkan dengan koma)"
}

PENTING: Berikan JSON murni tanpa markdown code blocks.`

        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: "Kamu adalah penulis konten profesional yang hanya membalas dengan JSON murni." },
                    { role: "user", content: prompt }
                ],
                temperature: 0.8,
                max_tokens: 2500,
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
            console.error("AI Response non-JSON:", rawContent)
            throw new Error("Format respon AI tidak valid (bukan JSON)")
        }

        try {
            const articleData = JSON.parse(jsonMatch[0])
            return NextResponse.json(articleData)
        } catch (parseError) {
            console.error("JSON Parse Error. Raw content:", rawContent)
            throw new Error("Gagal memproses data JSON dari AI")
        }
    } catch (error: any) {
        return NextResponse.json({ error: "Gagal menulis artikel", details: error.message }, { status: 500 })
    }
}
