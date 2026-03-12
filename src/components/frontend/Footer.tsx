"use client"

import Link from "next/link"
import { Snowflake, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer-rounded bg-slate-900 border-t border-slate-800 pt-20 pb-10 overflow-hidden relative rounded-t-[32px] md:rounded-t-[48px] mt-8 md:mt-16">
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">

                    {/* Column 1: Brand & Contact */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-2 group w-max">
                            <div className="bg-primary-blue-medium p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300">
                                <Snowflake className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-lg text-white leading-none">Jaya Abadi</span>
                                <span className="text-[10px] text-blue-300 font-medium tracking-wider">RAJA SERVICE AC</span>
                            </div>
                        </Link>

                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            Solusi pendingin ruangan terpercaya di Pekanbaru. Kami memberikan layanan profesional dengan teknisi berpengalaman untuk kenyamanan Anda.
                        </p>

                        <div className="flex flex-col gap-4 mt-2">
                            <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <Phone className="w-4 h-4 text-primary-blue-light" />
                                </div>
                                <span className="text-sm">0812-3456-7890</span>
                            </div>
                            <div className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                                    <Mail className="w-4 h-4 text-primary-blue-light" />
                                </div>
                                <span className="text-sm break-all">info@jayaabadirajaservice.com</span>
                            </div>
                            <div className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                                    <MapPin className="w-4 h-4 text-primary-blue-light" />
                                </div>
                                <span className="text-sm leading-relaxed">Jl. Contoh Alamat Pekanbaru No. 123, Riau</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-bold text-lg">Navigasi Cepat</h4>
                        <ul className="flex flex-col gap-4">
                            {["Beranda", "Layanan Kami", "Produk AC", "Tentang Kami", "Artikel & Tips", "Hubungi Kami"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-primary-blue-light hover:translate-x-1 transition-all flex items-center gap-2 text-sm group">
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-bold text-lg">Layanan Utama</h4>
                        <ul className="flex flex-col gap-4">
                            {["Cuci AC (Cleaning)", "Bongkar Pasang AC", "Isi Freon (Refill)", "Perbaikan AC Rusak", "Pengecekan Rutin", "Layanan Darurat 24/7"].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-slate-400 hover:text-primary-blue-light hover:translate-x-1 transition-all flex items-center gap-2 text-sm group">
                                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Newsletter & Social */}
                    <div className="flex flex-col gap-6">
                        <h4 className="text-white font-bold text-lg">Media Sosial</h4>
                        <p className="text-slate-400 text-sm">Follow kami untuk mendapatkan info promo menarik dan tips perawatan AC.</p>

                        <div className="flex items-center gap-3">
                            {[
                                { icon: Facebook, color: "hover:bg-blue-600" },
                                { icon: Instagram, color: "hover:bg-pink-600" },
                                { icon: Twitter, color: "hover:bg-sky-500" },
                                { icon: Youtube, color: "hover:bg-red-600" }
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    className={`w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 transition-all duration-300 ${social.color} hover:text-white hover:-translate-y-1`}
                                >
                                    <social.icon className="w-5 h-5" />
                                </a>
                            ))}
                        </div>

                        <div className="mt-4 p-5 rounded-2xl bg-blue-600/10 border border-blue-500/20 backdrop-blur-sm">
                            <p className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Jam Operasional</p>
                            <div className="flex justify-between items-center text-xs text-blue-200">
                                <span>Senin - Sabtu:</span>
                                <span>08:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between items-center text-xs text-blue-200 mt-1">
                                <span>Minggu:</span>
                                <span>Layanan Darurat</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Area */}
                <div className="pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-medium text-slate-500">
                    <div className="flex items-center gap-6">
                        <p>&copy; {currentYear} PT. Jaya Abadi Raja Service. Hak Cipta Dilindungi.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                        <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                        <Link href="#" className="hover:text-white transition-colors">Peta Situs</Link>
                    </div>
                    <p className="md:opacity-50">Didesain oleh Antigravity AI Engine</p>
                </div>
            </div>
        </footer>
    )
}
