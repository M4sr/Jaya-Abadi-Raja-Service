import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jayarepair.com"),
  title: {
    default: "PT. Jaya Abadi Raja Service - Service AC Pekanbaru Terpercaya",
    template: "%s | PT. Jaya Abadi Raja Service"
  },
  description: "Jasa service AC Pekanbaru profesional & bergaransi. Isi freon, pasang AC, bongkar AC, perbaikan. Teknisi berpengalaman, respon cepat, harga terjangkau. Hubungi sekarang!",
  keywords: ["service ac pekanbaru", "cuci ac pekanbaru", "pasang ac pekanbaru", "perbaikan ac pekanbaru", "jaya abadi raja service"],
  authors: [{ name: "Jaya Abadi Raja Service" }],
  creator: "Jaya Abadi Raja Service",
  publisher: "Jaya Abadi Raja Service",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "/",
    siteName: "Jaya Abadi Raja Service",
    title: "PT. Jaya Abadi Raja Service - Ahli AC Pekanbaru",
    description: "Jasa service AC Pekanbaru profesional & bergaransi. Teknisi berpengalaman, respon cepat, harga terjangkau.",
    images: [
      {
        url: "/images/hero.png",
        width: 1200,
        height: 630,
        alt: "Jaya Abadi Raja Service AC Pekanbaru",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PT. Jaya Abadi Raja Service - Ahli AC Pekanbaru",
    description: "Jasa service AC Pekanbaru profesional & bergaransi.",
    images: ["/images/hero.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body
        suppressHydrationWarning
        className={`${plusJakartaSans.variable} antialiased overflow-x-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
