import LoginForm from "@/components/admin/LoginForm"
import { ShieldCheck } from "lucide-react"

export default function LoginPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-primary-blue-medium/20 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-accent-cyan/10 blur-[120px] pointer-events-none" />
            <div className="absolute top-[20%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/15 blur-[100px] pointer-events-none" />

            {/* Main Container */}
            <div className="w-full max-w-md p-4 relative z-10">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">
                    {/* Header */}
                    <div className="flex flex-col items-center text-center space-y-4 mb-8">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-blue-light to-primary-blue flex items-center justify-center shadow-lg shadow-primary-blue/30 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></div>
                            <ShieldCheck className="w-10 h-10 text-white relative z-10" />
                        </div>

                        <div className="space-y-1">
                            <h1 className="text-2xl font-display font-bold text-white">System Authorization</h1>
                            <p className="text-sm text-slate-400">Restricted access area. Please login.</p>
                        </div>
                    </div>

                    {/* Form */}
                    <LoginForm />

                </div>

                {/* Footer */}
                <p className="text-center text-slate-500 text-sm mt-8">
                    © {new Date().getFullYear()} PT. Jaya Abadi Raja Service.<br />All rights reserved.
                </p>
            </div>
        </div>
    )
}
