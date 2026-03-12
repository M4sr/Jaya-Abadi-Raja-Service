const fs = require('fs');

const targetPath = 'C:/laragon/www/service_ac/jaya-service/src/components/frontend/BookingClient.tsx';
let source = fs.readFileSync(targetPath, 'utf8');

const uiComponents = `
    const DesktopProgress = (
        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl shadow-slate-200/50 border border-slate-100">
            <div className="space-y-8">
                {steps.map((s, idx) => {
                    const Icon = s.icon
                    const isActive = step === s.id
                    const isDone = step > s.id
                    return (
                        <div key={s.id} className="flex gap-5 relative">
                            {idx !== steps.length - 1 && (
                                <div className={\`absolute left-6 top-12 bottom-[-20px] w-0.5 \${isDone ? 'bg-blue-600' : 'bg-slate-100'}\`} />
                            )}
                            <motion.div 
                                animate={{ 
                                    scale: isActive ? 1.1 : 1,
                                    backgroundColor: isDone || isActive ? '#2563eb' : '#f8fafc',
                                    color: isDone || isActive ? '#fff' : '#94a3b8'
                                }}
                                className={\`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 z-10 shadow-sm border \${isDone || isActive ? 'border-blue-600' : 'border-slate-100'}\`}
                            >
                                {isDone ? <Check className="w-6 h-6" /> : <Icon className="w-5 h-5" />}
                            </motion.div>
                            <div className="flex flex-col justify-center">
                                <p className={\`text-[10px] font-black uppercase tracking-widest \${isActive ? 'text-blue-600' : 'text-slate-400'}\`}>Step 0{s.id}</p>
                                <h4 className={\`text-sm font-black uppercase tracking-tight \${isActive ? 'text-slate-900' : 'text-slate-400'}\`}>{s.title}</h4>
                                <p className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{s.desc}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )

    const MobileProgress = (
        <div className="bg-white p-4 rounded-[28px] shadow-sm border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                    {React.createElement(steps[step-1]?.icon || steps[0].icon, { className: "w-5 h-5 flex-shrink-0" })}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Step 0{step} / 04</p>
                    <h4 className="text-sm font-black uppercase tracking-tight text-slate-900 leading-none mt-0.5">{steps[step-1]?.title || ''}</h4>
                </div>
            </div>
            
            <div className="flex gap-1 pr-2">
                {steps.map(s => (
                    <div key={s.id} className={\`h-1.5 rounded-full transition-all duration-500 \${step === s.id ? 'w-6 bg-blue-600' : step > s.id ? 'w-3 bg-blue-600/40' : 'w-3 bg-slate-100'}\`} />
                ))}
            </div>
        </div>
    )

    const SelectedServiceCardProps = initialServiceId && selectedService ? (
        <div className="bg-blue-600 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
                <Zap className="w-32 h-32" />
            </div>
            <div className="relative z-10 space-y-4">
                <Badge className="bg-white/20 text-white border-0 hover:bg-white/20 px-3 py-1 font-black uppercase tracking-widest text-[9px] mb-1">Layanan Terpilih</Badge>
                <h4 className="text-xl font-black uppercase tracking-tighter leading-none">{selectedService.nama}</h4>
                <p className="text-blue-100 text-[11px] sm:text-xs font-medium">Mulai Dari Rp {selectedService.hargaMulai.toLocaleString('id-ID')}</p>
            </div>
        </div>
    ) : null

    const TrackingCardProps = (
        <Link href="/booking/track" className="block group">
            <div className="bg-slate-900 p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] text-white overflow-hidden relative shadow-2xl shadow-slate-900/40">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-transform duration-500">
                    <Search className="w-24 h-24" />
                </div>
                <div className="relative z-10 space-y-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter leading-none">Sudah Booking?</h4>
                    <p className="text-slate-400 text-[11px] sm:text-xs font-medium leading-relaxed">Lacak status pesanan Anda secara real-time di sini.</p>
                    <div className="flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px] pt-2">
                        Lacak Sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                    </div>
                </div>
            </div>
        </Link>
    )

    const HelpCardProps = (
        <div className="p-6 sm:p-8 rounded-[32px] sm:rounded-[40px] bg-blue-50 border border-blue-100 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-blue-600 shadow-sm shrink-0">
                    <Phone className="w-5 h-5" />
                </div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Butuh Bantuan Cepat?</p>
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed uppercase tracking-tight">
                CS Kami siap membantu via telepon atau WhatsApp selama jam operasional (08:00 - 17:00).
            </p>
        </div>
    )

    return (
        <div className="max-w-6xl mx-auto px-2 sm:px-6">
            
            {/* MOBILE ONLY: Top Content */}
            <div className="block lg:hidden w-full mb-6 space-y-3 px-2 sm:px-0">
                {MobileProgress}
                {SelectedServiceCardProps}
            </div>

            <div className="flex flex-col lg:flex-row gap-0 sm:gap-12">
                {/* DESKTOP ONLY: Left Sidebar */}
                <div className="hidden lg:block lg:w-1/3 lg:sticky lg:top-32 h-fit space-y-8 order-2 lg:order-1">
                    {DesktopProgress}
                    {SelectedServiceCardProps}
                    {TrackingCardProps}
                    {HelpCardProps}
                </div>

                {/* Right Side - Form Content */}
                <div className="lg:w-2/3 order-1 lg:order-2">
                    <div className="bg-white p-5 sm:p-14 rounded-[32px] sm:rounded-[48px] shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[600px] flex flex-col relative overflow-hidden">
                        {/* Glassmorphism Accents */}`;

// Replace Part 1
const startStr = "    return (\r\n        <div className=\"max-w-6xl mx-auto px-2 sm:px-6\">\r\n            <div className=\"flex flex-col lg:flex-row gap-0 sm:gap-12\">";
const endStr = "                        {/* Glassmorphism Accents */}";

const startIndex = source.indexOf(startStr);
const endIndex = source.indexOf(endStr) + endStr.length;

if (startIndex !== -1 && endIndex !== -1) {
    source = source.slice(0, startIndex) + uiComponents + source.slice(endIndex);
    console.log("Replaced Part 1 successfully.");
} else {
    console.log("Did not find Part 1.");
}

// Replace Part 2 (Bottom Container)
const bottomTarget = `                    </div>\r
\r
                    {/* Footer Info Box */}`;

const bottomContent = `                    </div>\r
\r
                    {/* MOBILE ONLY: Bottom Content */}\r
                    <div className="block lg:hidden w-full mt-6 space-y-3 px-2 sm:px-0">\r
                        {TrackingCardProps}\r
                        {HelpCardProps}\r
                    </div>\r
\r
                    {/* Footer Info Box */}`;

if (source.includes(bottomTarget)) {
    source = source.replace(bottomTarget, bottomContent);
    console.log("Replaced Part 2 successfully.");
} else {
    console.log("Did not find Part 2.");
    
    // Fallback if line endings are different
    const fallbackTarget = "                    </div>\n\n                    {/* Footer Info Box */}";
    const fallbackContent = "                    </div>\n\n                    {/* MOBILE ONLY: Bottom Content */}\n                    <div className=\"block lg:hidden w-full mt-6 space-y-3 px-2 sm:px-0\">\n                        {TrackingCardProps}\n                        {HelpCardProps}\n                    </div>\n\n                    {/* Footer Info Box */}";
    if (source.includes(fallbackTarget)) {
        source = source.replace(fallbackTarget, fallbackContent);
        console.log("Replaced Part 2 successfully (fallback).");
    }
}

fs.writeFileSync(targetPath, source);
