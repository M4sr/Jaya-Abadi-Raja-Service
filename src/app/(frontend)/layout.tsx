import { Navbar, Footer, CustomCursor, SnowCursorEffect, PageTransition } from "@/components/frontend"

export default function FrontendLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex flex-col min-h-screen relative">
            <CustomCursor />
            <SnowCursorEffect />
            <Navbar />
            <PageTransition>
                <main className="flex-grow">
                    {children}
                </main>
            </PageTransition>
            <Footer />
        </div>
    )
}
