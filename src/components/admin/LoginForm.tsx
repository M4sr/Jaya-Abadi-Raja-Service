"use client"

import { useActionState } from "react"
import { authenticate } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { User, Lock, ShieldCheck, Loader2, AlertCircle } from "lucide-react"

export default function LoginForm() {
    const [errorMessage, formAction, isPending] = useActionState(
        authenticate,
        undefined,
    )

    return (
        <form action={formAction} className="space-y-6">
            <div className="space-y-4">
                {/* Username Field */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider">USERNAME ATAU EMAIL</label>
                    <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            type="text"
                            name="username"
                            placeholder="Masukkan username"
                            required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-blue-light focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-300 tracking-wider">PASSWORD</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3 pl-11 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-blue-light focus:border-transparent transition-all"
                        />
                    </div>
                </div>
            </div>

            {errorMessage && (
                <div
                    className="flex items-center gap-2 text-sm text-red-400 bg-red-400/10 p-3 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-top-2"
                >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <p>{errorMessage}</p>
                </div>
            )}

            <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary-blue hover:bg-primary-blue-medium text-white py-6 rounded-xl font-bold text-base transition-all shadow-lg hover:shadow-primary-blue/25"
            >
                {isPending ? (
                    <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Memproses...
                    </>
                ) : (
                    <>
                        Authorize <span className="ml-2">→</span>
                    </>
                )}
            </Button>
        </form>
    )
}
