"use client"

import SettingsForm from "@/components/admin/SettingsForm"
import { Settings } from "lucide-react"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface SettingsClientProps {
    initialSettings: any;
}

export default function SettingsClient({ initialSettings }: SettingsClientProps) {
    return (
        <PageWrapper className="space-y-6 w-full pb-12">
            <AnimationItem>
                <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-blue-50 text-primary-blue rounded-xl flex items-center justify-center shrink-0">
                        <Settings className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Pengaturan Website</h1>
                        <p className="text-slate-500 text-sm mt-1">Konfigurasi identitas, kontak, dan teks utama pada website publik</p>
                    </div>
                </div>
            </AnimationItem>

            <AnimationItem>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                    <SettingsForm initialSettings={initialSettings} />
                </div>
            </AnimationItem>
        </PageWrapper>
    )
}
