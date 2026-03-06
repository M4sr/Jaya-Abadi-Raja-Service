/**
 * Jaya Abadi Raja Service
 * Admin Dashboard Script
 */

document.addEventListener('DOMContentLoaded', () => {

    // === Theme Toggle ===
    const adminThemeToggle = document.getElementById('adminThemeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = adminThemeToggle?.querySelector('i');

    function toggleTheme() {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('admin_theme', 'light');
            if (themeIcon) { themeIcon.classList.replace('ph-sun', 'ph-moon'); }
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('admin_theme', 'dark');
            if (themeIcon) { themeIcon.classList.replace('ph-moon', 'ph-sun'); }
        }

        // Update Chart JS colors on theme change
        if (revenueChart) {
            const isDark = htmlElement.classList.contains('dark');
            revenueChart.options.scales.x.grid.color = isDark ? '#334155' : '#f1f5f9';
            revenueChart.options.scales.y.grid.color = isDark ? '#334155' : '#f1f5f9';
            revenueChart.options.scales.x.ticks.color = isDark ? '#94a3b8' : '#64748b';
            revenueChart.options.scales.y.ticks.color = isDark ? '#94a3b8' : '#64748b';
            revenueChart.update();
        }
    }

    if (localStorage.admin_theme === 'dark' || (!('admin_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        if (themeIcon) { themeIcon.classList.replace('ph-moon', 'ph-sun'); }
    } else {
        htmlElement.classList.remove('dark');
    }

    if (adminThemeToggle) adminThemeToggle.addEventListener('click', toggleTheme);

    // === Mobile Sidebar Logic ===
    const adminSidebar = document.getElementById('adminSidebar');
    const openSidebarBtn = document.getElementById('openSidebarBtn');
    const closeSidebarBtn = document.getElementById('closeSidebarBtn');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    function openSidebar() {
        adminSidebar.classList.remove('-translate-x-full');
        sidebarOverlay.classList.remove('hidden');
        // Small delay to allow display block to apply before opacity transition
        setTimeout(() => sidebarOverlay.classList.remove('opacity-0'), 10);
    }

    function closeSidebar() {
        adminSidebar.classList.add('-translate-x-full');
        sidebarOverlay.classList.add('opacity-0');
        setTimeout(() => sidebarOverlay.classList.add('hidden'), 300); // Wait for transition
    }

    if (openSidebarBtn) openSidebarBtn.addEventListener('click', openSidebar);
    if (closeSidebarBtn) closeSidebarBtn.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    // === Navigation Logic ===
    const navLinks = document.querySelectorAll('.nav-link');
    const pageTitle = document.getElementById('pageTitle');

    // Close sidebar on mobile when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 768) {
                closeSidebar();
            }
        });
    });

    // Navigation Logic Main
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active from all
            navLinks.forEach(l => {
                l.classList.remove('bg-primary/10', 'text-primary');
                l.classList.add('text-text-light');
            });

            // Add active to clicked
            link.classList.remove('text-text-light');
            link.classList.add('bg-primary/10', 'text-primary');

            // Set Title
            pageTitle.textContent = link.textContent.trim().replace(/\d+$/, ''); // Remove notification number if exists

            const href = link.getAttribute('href');

            // Hide all sections
            contentSections.forEach(sec => sec.classList.add('hidden'));

            // Show target section
            if (href === '#dashboard') {
                document.getElementById('section-dashboard').classList.remove('hidden');
            } else if (href === '#calendar') {
                document.getElementById('section-calendar').classList.remove('hidden');
                // Render calendar if not already
                if (calendarInstance) {
                    calendarInstance.render();
                }
            } else if (href === '#orders') {
                document.getElementById('section-orders').classList.remove('hidden');
                renderOrders();
            } else if (href === '#services') {
                document.getElementById('section-services').classList.remove('hidden');
                renderServices();
            } else if (href === '#technicians') {
                document.getElementById('section-technicians').classList.remove('hidden');
                renderTechnicians();
            }
        });
    });

    // === Chart.js Initialization ===
    let revenueChart;
    const ctx = document.getElementById('revenueChart');
    if (ctx) {
        const isDark = htmlElement.classList.contains('dark');
        const gridColor = isDark ? '#334155' : '#f1f5f9';
        const textColor = isDark ? '#94a3b8' : '#64748b';

        revenueChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'],
                datasets: [{
                    label: 'Pendapatan (Juta Rp)',
                    data: [2.5, 3.8, 3.2, 5.1, 4.2, 6.8, 7.5],
                    borderColor: '#1E6FDB',
                    backgroundColor: 'rgba(30, 111, 219, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#1E6FDB',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: textColor, font: { family: 'Inter', size: 10 } }
                    },
                    y: {
                        grid: { color: gridColor, drawBorder: false },
                        ticks: { color: textColor, font: { family: 'Inter', size: 10 }, stepSize: 2 }
                    }
                }
            }
        });
    }

    // === FullCalendar.js Initialization ===
    let calendarInstance;
    const calendarEl = document.getElementById('calendar');

    if (calendarEl) {
        const isMobile = window.innerWidth < 768;

        calendarInstance = new FullCalendar.Calendar(calendarEl, {
            initialView: isMobile ? 'timeGridDay' : 'timeGridWeek',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: isMobile ? 'timeGridDay,listWeek' : 'dayGridMonth,timeGridWeek,timeGridDay'
            },
            themeSystem: 'standard',
            height: '100%',
            slotMinTime: '08:00:00',
            slotMaxTime: '20:00:00',
            eventTimeFormat: {
                hour: '2-digit',
                minute: '2-digit',
                meridiem: false
            },
            events: [
                {
                    title: 'Cuci AC - Budi (JA-9281)',
                    start: new Date().toISOString().split('T')[0] + 'T14:00:00',
                    end: new Date().toISOString().split('T')[0] + 'T15:00:00',
                    color: '#f97316' // Orange for waiting
                },
                {
                    title: 'Isi Freon - Siti (JA-7542)',
                    start: new Date().toISOString().split('T')[0] + 'T16:30:00',
                    end: new Date().toISOString().split('T')[0] + 'T18:00:00',
                    color: '#3b82f6' // Blue for scheduled
                }
            ]
        });

        // We defer rendering until the tab is actually shown, 
        // managed in the nav logic above to fix layout issues.
    }

    // === API URL (Google Apps Script) ===
    const API_URL = 'https://script.google.com/macros/s/AKfycbwlRyq4vzntcfVdUHZ_5LJlaQXfBCVj33RUDeJZzTSJ0eqQby9KaeJszGJQLQiIgXz7yw/exec';

    // === Async Render Functions ===

    async function renderOrders() {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody) return;

        tbody.innerHTML = '<tr><td colspan="6" class="py-4 text-center"><i class="ph-bold ph-spinner animate-spin"></i> Memuat Data...</td></tr>';

        try {
            const url = new URL(API_URL);
            url.searchParams.append('action', 'getTracking'); // getTracking can function as getOrders if used loosely, but our code.gs uses trackOrder. Let's create a getOrders fallback array if no API yet, but code.gs lacked getOrders. I'll use the dummy array mostly for visual completeness and add simple fetch block.
            // Note: The code.gs currently doesn't have a specific "getOrders" endpoint returning all data (security!). 
            // So we will simulate standard Admin fetching behavior but use mock data locally since the provided API doesn't expose full DB queries.

            // SIMULASI FETCH - In production, this would be: await fetch(API_URL + '?action=getOrders')
            await new Promise(r => setTimeout(r, 1000)); // Fake network delay

            const mockOrders = [
                { id: 'JA-9281', name: 'Budi Santoso', service: 'Cuci AC & Tambah Freon', date: 'Hari ini, 14:00', status: 'Menunggu', statusColor: 'orange' },
                { id: 'JA-7542', name: 'Siti Aminah', service: 'Isi Freon Full', date: 'Hari ini, 16:30', status: 'Dijadwalkan', statusColor: 'blue' },
                { id: 'JA-3321', name: 'Ahmad M.', service: 'Bongkar Pasang AC', date: 'Kemarin, 10:00', status: 'Selesai', statusColor: 'green' }
            ];

            tbody.innerHTML = mockOrders.map(o => `
                <tr class="border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td class="py-4 font-bold">${o.id}</td>
                    <td class="py-4">${o.name}</td>
                    <td class="py-4">${o.service}</td>
                    <td class="py-4 text-text-light text-xs"><i class="ph ph-calendar"></i> ${o.date}</td>
                    <td class="py-4">
                        <span class="text-[10px] font-bold text-${o.statusColor}-500 bg-${o.statusColor}-50 dark:bg-${o.statusColor}-900/20 px-2 py-1 rounded uppercase">
                            ${o.status}
                        </span>
                    </td>
                    <td class="py-4 text-right">
                        <button class="text-primary hover:text-primary-dark"><i class="ph-bold ph-pencil-simple text-lg"></i></button>
                        <button class="text-red-500 hover:text-red-700 ml-2"><i class="ph-bold ph-trash text-lg"></i></button>
                    </td>
                </tr>
            `).join('');

        } catch (e) {
            console.error("Failed to load orders", e);
            tbody.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-red-500">Gagal memuat data</td></tr>';
        }
    }

    function renderServices() {
        const grid = document.getElementById('servicesGrid');
        if (!grid) return;

        const mockServices = [
            { name: 'Cuci AC', price: 'Rp 75.000', icon: 'ph-drop' },
            { name: 'Tambah Freon', price: 'Rp 150.000', icon: 'ph-wind' },
            { name: 'Isi Freon Full', price: 'Rp 250.000', icon: 'ph-thermometer-cold' },
            { name: 'Bongkar Pasang', price: 'Rp 350.000', icon: 'ph-wrench' }
        ];

        grid.innerHTML = mockServices.map(s => `
            <div class="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4 transition-transform hover:-translate-y-1">
                <div class="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-2xl shrink-0">
                    <i class="ph-fill ${s.icon}"></i>
                </div>
                <div>
                    <h4 class="font-bold text-dark dark:text-white capitalize text-sm">${s.name}</h4>
                    <p class="text-xs font-bold text-primary">${s.price}</p>
                </div>
                <button class="ml-auto text-text-light hover:text-primary shrink-0"><i class="ph-bold ph-pencil-simple text-xl"></i></button>
            </div>
        `).join('');
    }

    function renderTechnicians() {
        const grid = document.getElementById('techniciansGrid');
        if (!grid) return;

        const mockTechs = [
            { name: 'Agus Setiawan', rating: 4.9, jobs: 120, status: 'Aktif', avatar: '1E6FDB' },
            { name: 'Bambang P.', rating: 4.8, jobs: 95, status: 'Sibuk', avatar: '10b981' },
            { name: 'Cipto W.', rating: 4.7, jobs: 60, status: 'Aktif', avatar: 'f59e0b' }
        ];

        grid.innerHTML = mockTechs.map(t => `
            <div class="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center relative transition-transform hover:-translate-y-1">
                <span class="absolute top-4 right-4 ${t.status === 'Aktif' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400'} text-[9px] font-bold px-2 py-1 rounded-full uppercase">
                    ${t.status}
                </span>
                <img src="https://ui-avatars.com/api/?name=${t.name.replace(' ', '+')}&background=${t.avatar}&color=fff&size=128" alt="${t.name}" class="w-16 h-16 rounded-full mx-auto mb-3 shadow-md">
                <h4 class="font-bold text-dark dark:text-white text-sm">${t.name}</h4>
                <div class="flex items-center justify-center gap-1 text-xs text-text-light mt-1">
                    <i class="ph-fill ph-star text-yellow-400"></i> <span class="dark:text-gray-400">${t.rating} (${t.jobs} Pengerjaan)</span>
                </div>
                <div class="flex gap-2 mt-4">
                    <button class="flex-1 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 text-dark dark:text-white text-xs font-bold py-2 rounded-xl transition-colors">Detail Profil</button>
                </div>
            </div>
        `).join('');
    }

});
