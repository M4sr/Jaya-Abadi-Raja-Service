"use client"

import WhatsAppTemplatesForm from "@/components/admin/WhatsAppTemplatesForm"
import { MessageSquare } from "lucide-react"
import { PageWrapper, AnimationItem } from "./AnimationWrappers"

interface WhatsAppTemplatesClientProps {
    initialSettings: any;
}

export default function WhatsAppTemplatesClient({ initialSettings }: WhatsAppTemplatesClientProps) {
    return (
        <PageWrapper className="space-y-6 w-full pb-12">
            <AnimationItem>
                <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                        <MessageSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-bold text-slate-800">Template Chat WhatsApp</h1>
                        <p className="text-slate-500 text-sm mt-1">Atur pesan otomatis yang dikirimkan ke pelanggan berdasarkan status pesanan</p>
                    </div>
                </div>
            </AnimationItem>

            <AnimationItem>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
                    <WhatsAppTemplatesForm initialSettings={initialSettings} />
                </div>
            </AnimationItem>
        </PageWrapper>
    )
}
