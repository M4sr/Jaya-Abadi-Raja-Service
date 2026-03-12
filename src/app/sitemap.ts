import { MetadataRoute } from "next"
import prisma from "@/lib/prisma"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://jayaabadirajaservice.com"

    // Fetch dynamic routes
    const services = await prisma.layanan.findMany({
        where: { isActive: true },
        select: { slug: true, updatedAt: true }
    })

    const articles = await prisma.article.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true }
    })

    // Static routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 1,
        },
        {
            url: `${baseUrl}/tentang`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/kontak`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/layanan`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/booking`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/booking/track`,
            lastModified: new Date(),
            changeFrequency: "always",
            priority: 0.5,
        },
    ]

    // Service routes
    const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
        url: `${baseUrl}/layanan/${s.slug}`,
        lastModified: s.updatedAt,
        changeFrequency: "weekly",
        priority: 0.8,
    }))

    // Article routes
    const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({
        url: `${baseUrl}/blog/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
    }))

    return [...staticRoutes, ...serviceRoutes, ...articleRoutes]
}
