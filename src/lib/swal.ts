import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const ReactSwal = withReactContent(Swal)

export const CustomSwal = ReactSwal.mixin({
    customClass: {
        popup: 'bg-white rounded-3xl shadow-2xl border border-slate-100/60 p-6',
        title: 'text-2xl font-bold text-slate-800 mb-2 font-display',
        htmlContainer: 'text-sm text-slate-500 m-0',
        actions: 'flex gap-3 mt-6 justify-center w-full',
        confirmButton: 'bg-primary-blue hover:bg-[#1a5bbf] focus:ring-4 focus:ring-blue-100 active:scale-95 transition-all text-white px-6 py-2.5 rounded-xl font-semibold shadow-md outline-none min-w-[120px]',
        cancelButton: 'bg-white hover:bg-slate-50 text-slate-700 focus:ring-4 focus:ring-slate-100 active:scale-95 transition-all border border-slate-200 px-6 py-2.5 rounded-xl font-semibold shadow-sm outline-none min-w-[120px]',
        icon: 'border-0 mb-4',
    },
    buttonsStyling: false, // Wajib false agar Tailwind bisa mengatur tampilan tombol sepenuhnya
})
