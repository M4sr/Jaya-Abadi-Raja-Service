/**
 * Jaya Abadi Raja Service
 * Main Frontend Script
 */

document.addEventListener('DOMContentLoaded', () => {
    // === 1. Dark Mode Toggle ===
    const themeToggleBtn = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn?.querySelector('i');

    function toggleTheme() {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            if (themeIcon) { themeIcon.classList.replace('ph-sun', 'ph-moon'); }
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (themeIcon) { themeIcon.classList.replace('ph-moon', 'ph-sun'); }
        }
    }

    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        if (themeIcon) { themeIcon.classList.replace('ph-moon', 'ph-sun'); }
    } else {
        htmlElement.classList.remove('dark');
    }

    if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);

    // === 2. Format Currency ===
    const formatRp = (num) => {
        return "Rp " + num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }

    // === 3. Booking Form Logic ===
    const layananSelect = document.getElementById('layanan');
    const jumlahUnitInput = document.getElementById('jumlahUnit');
    const btnMinQty = document.getElementById('btnMinQty');
    const btnAddQty = document.getElementById('btnAddQty');

    // Display Elements
    const qtyDisplayBadge = document.getElementById('qtyDisplayBadge');
    const serviceCostDisplay = document.getElementById('serviceCostDisplay');
    const transportCostDisplay = document.getElementById('transportCostDisplay');
    const totalCostDisplay = document.getElementById('totalCostDisplay');

    let currentServicePrice = 0;
    let currentTransportPrice = 0;
    let currentQty = 1;

    // Calculate Total
    function calculateTotal() {
        if (layananSelect && layananSelect.selectedIndex > 0) {
            const selectedOption = layananSelect.options[layananSelect.selectedIndex];
            currentServicePrice = parseInt(selectedOption.getAttribute('data-price')) || 0;
        }

        const totalService = currentServicePrice * currentQty;
        const finalTotal = totalService + currentTransportPrice;

        if (serviceCostDisplay) serviceCostDisplay.textContent = formatRp(totalService);
        if (totalCostDisplay) totalCostDisplay.textContent = formatRp(finalTotal);
    }

    // Listeners for Qty
    if (btnMinQty) btnMinQty.addEventListener('click', () => updateQty(-1));
    if (btnAddQty) btnAddQty.addEventListener('click', () => updateQty(1));

    window.updateQty = (change) => {
        let newQty = currentQty + change;
        if (newQty < 1) newQty = 1;
        if (newQty > 10) newQty = 10;

        currentQty = newQty;
        if (jumlahUnitInput) jumlahUnitInput.value = newQty;
        if (qtyDisplayBadge) qtyDisplayBadge.textContent = `x${newQty}`;
        calculateTotal();
    };

    if (layananSelect) layananSelect.addEventListener('change', calculateTotal);

    // Expose selectService for Service Cards
    window.selectService = (serviceName) => {
        if (layananSelect) {
            for (let i = 0; i < layananSelect.options.length; i++) {
                if (layananSelect.options[i].value === serviceName) {
                    layananSelect.selectedIndex = i;
                    calculateTotal();
                    break;
                }
            }
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // === 4. Geolocation & Fake Distance Pricing ===
    const getLocationBtn = document.getElementById('getLocationBtn');
    const locationStatus = document.getElementById('locationStatus');
    const alatInput = document.getElementById('alamat');
    const latInput = document.getElementById('lat');
    const lngInput = document.getElementById('lng');
    const distanceDisplay = document.getElementById('distanceDisplay');

    if (getLocationBtn) {
        getLocationBtn.addEventListener('click', () => {
            if (!navigator.geolocation) {
                locationStatus.textContent = "Geolokasi tidak didukung browser ini.";
                locationStatus.classList.remove('hidden');
                return;
            }

            locationStatus.textContent = "Mencari lokasi (Mohon izinkan akses)...";
            locationStatus.classList.remove('hidden', 'text-red-500');
            locationStatus.classList.add('text-primary');

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    latInput.value = lat;
                    lngInput.value = lng;

                    locationStatus.textContent = `Lokasi Ditemukan: ${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                    getLocationBtn.innerHTML = `<i class="ph-bold ph-check"></i> Lokasi Diperbarui`;
                    getLocationBtn.classList.replace('bg-white/90', 'bg-green-500');
                    getLocationBtn.classList.replace('text-primary', 'text-white');

                    // FAKE Google Maps Geocoding & Distance Matrix (Simulation)
                    // In real world, we use Maps API: 0-5km = free, 5-10km = 10k, 10-20km = 20k
                    setTimeout(() => {
                        alatInput.value = "Jl. Sudirman No 45 (Hasil deteksi otomatis API)";

                        // Fake distance between 2 to 15 km
                        const fakeDistance = (Math.random() * 13 + 2).toFixed(1);
                        distanceDisplay.textContent = fakeDistance;

                        if (fakeDistance <= 5) {
                            currentTransportPrice = 0;
                            transportCostDisplay.textContent = "Gratis";
                        } else if (fakeDistance <= 10) {
                            currentTransportPrice = 10000;
                            transportCostDisplay.textContent = formatRp(10000);
                        } else {
                            currentTransportPrice = 20000;
                            transportCostDisplay.textContent = formatRp(20000);
                        }

                        transportCostDisplay.classList.remove('bg-orange-50', 'text-orange-600', 'dark:bg-orange-900/20');
                        calculateTotal();
                    }, 1500);
                },
                (error) => {
                    locationStatus.textContent = "Gagal mengambil lokasi. Silakan isi manual.";
                    locationStatus.classList.replace('text-primary', 'text-red-500');
                }
            );
        });
    }

    // === 5. Modals & Form Submission ===
    const bookingForm = document.getElementById('bookingForm');
    const qrisModal = document.getElementById('qrisModal');
    const successModal = document.getElementById('successModal');
    const qrisAmount = document.getElementById('qrisAmount');

    // === API URL (Google Apps Script) ===
    const API_URL = 'https://script.google.com/macros/s/AKfycbwlRyq4vzntcfVdUHZ_5LJlaQXfBCVj33RUDeJZzTSJ0eqQby9KaeJszGJQLQiIgXz7yw/exec';

    // Global close modal
    window.closeModal = (id) => {
        const modal = document.getElementById(id);
        if (modal) modal.classList.add('hidden');
    }

    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> Memproses...';
            submitBtn.disabled = true;

            const totalService = currentServicePrice * currentQty;
            const finalTotal = totalService + currentTransportPrice;

            // Build Payload
            const payload = {
                nama: document.getElementById('nama').value,
                wa: document.getElementById('telepon').value,
                layanan: layananSelect.options[layananSelect.selectedIndex].text,
                qty: currentQty,
                tgl: document.getElementById('tanggal').value,
                jam: document.getElementById('waktu').value,
                lat: document.getElementById('lat').value || "0",
                lng: document.getElementById('lng').value || "0",
                alamat: document.getElementById('alamat').value,
                note: document.getElementById('catatan').value,
                totalCost: finalTotal
            };

            try {
                // Fetch to Real API
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // Prevent CORS preflight on some environments
                    body: JSON.stringify({ action: 'createOrder', payload: payload })
                });

                const result = await response.json();

                if (result.status === 'success') {
                    // Success API, Show QRIS
                    document.getElementById('successOrderId').textContent = result.orderId;
                    qrisAmount.textContent = formatRp(finalTotal);
                    qrisModal.classList.remove('hidden');
                } else {
                    alert("Error: " + result.message);
                }
            } catch (error) {
                console.error('Error submitting form:', error);

                // Fallback to Simulation if API fails (offline mostly)
                const mockOrderId = 'JA-' + Math.floor(1000 + Math.random() * 9000);
                document.getElementById('successOrderId').textContent = mockOrderId;
                qrisAmount.textContent = formatRp(finalTotal);
                qrisModal.classList.remove('hidden');
                alert("Mode Simulasi Aktif (API Gagal dihubungi)");
            } finally {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    window.showSuccessModal = () => {
        closeModal('qrisModal');
        successModal.classList.remove('hidden');
        if (bookingForm) bookingForm.reset();
        currentTransportPrice = 0;
        calculateTotal();
    }

    // === 6. PDF Invoice Generation (jsPDF) ===
    window.downloadInvoice = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const orderId = document.getElementById('successOrderId').textContent;
        // Data pelanggan
        const nama = document.getElementById('nama')?.value || 'Pelanggan Setia';
        const alamat = document.getElementById('alamat')?.value || '-';
        // Data Layanan
        const layanan = layananSelect && layananSelect.selectedIndex > 0
            ? layananSelect.options[layananSelect.selectedIndex].text
            : 'Layanan AC';

        // Header Invoice
        doc.setFontSize(24);
        doc.setTextColor(30, 111, 219); // Primary Color
        doc.setFont(undefined, 'bold');
        doc.text("INVOICE", 105, 20, null, null, "center");

        doc.setFontSize(14);
        doc.setTextColor(30, 41, 59); // Dark blue-gray
        doc.text("Jaya Abadi Raja Service", 105, 30, null, null, "center");

        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 116, 139); // Slate 500
        doc.text("Spesialis Perawatan & Perbaikan AC Profesional", 105, 36, null, null, "center");

        // Garis Pembatas Header
        doc.setLineWidth(0.5);
        doc.setDrawColor(226, 232, 240); // Slate 200
        doc.line(20, 45, 190, 45);

        // Info Order & Customer
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85); // Slate 700

        doc.setFont(undefined, 'bold');
        doc.text("Detail Pesanan:", 20, 55);
        doc.setFont(undefined, 'normal');
        doc.text(`Order ID: ${orderId}`, 20, 62);
        doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 20, 68);

        doc.setFont(undefined, 'bold');
        doc.text("Ditagihkan Kepada:", 120, 55);
        doc.setFont(undefined, 'normal');
        doc.text(nama, 120, 62);

        const splitAddress = doc.splitTextToSize(alamat, 70);
        doc.text(splitAddress, 120, 68);

        // Tabel Layanan Header (Bg Biru Muda)
        let startY = 90;
        doc.setFillColor(245, 248, 252); // Secondary color
        doc.rect(20, startY - 6, 170, 10, 'F');

        doc.setFont(undefined, 'bold');
        doc.setTextColor(30, 41, 59);
        doc.text("Deskripsi Layanan", 25, startY);
        doc.text("Kuantitas", 120, startY);
        doc.text("Total", 160, startY);

        // Isi Tabel
        startY += 12;
        doc.setFont(undefined, 'normal');
        doc.text(layanan, 25, startY);
        doc.text(`${currentQty} Unit`, 120, startY);
        doc.text(formatRp(currentServicePrice * currentQty), 160, startY);

        startY += 10;
        doc.text("Biaya Jasa Transportasi", 25, startY);
        doc.text("-", 120, startY);
        doc.text(currentTransportPrice === 0 ? "Gratis" : formatRp(currentTransportPrice), 160, startY);

        // Garis Total
        startY += 10;
        doc.setLineWidth(2);
        doc.setDrawColor(245, 248, 252);
        doc.line(20, startY, 190, startY);

        // Total Bayar
        startY += 12;
        doc.setFont(undefined, 'bold');
        doc.setFontSize(12);
        doc.text("TOTAL BAYAR", 100, startY);

        doc.setTextColor(30, 111, 219); // Primary color
        doc.text(document.getElementById('qrisAmount').textContent, 160, startY);

        // Footer Message
        doc.setFontSize(9);
        doc.setTextColor(148, 163, 184); // Slate 400
        doc.setFont(undefined, 'normal');
        doc.text("Terima kasih telah menggunakan jasa Jaya Abadi Raja Service.", 105, 270, null, null, "center");
        doc.text("Layanan Bergaransi - Teknisi Berpengalaman", 105, 275, null, null, "center");

        doc.save(`Invoice_${orderId}.pdf`);
    }

    // === 7. Tracking Logic ===
    const btnTrack = document.getElementById('btnTrack');
    const trackId = document.getElementById('trackId');
    const trackingResult = document.getElementById('trackingResult');
    const resOrderId = document.getElementById('resOrderId');

    if (btnTrack) {
        btnTrack.addEventListener('click', async () => {
            const id = trackId.value.trim().toUpperCase();
            if (!id) return alert("Masukkan ID Pesanan");

            const originalBtnText = btnTrack.innerHTML;
            btnTrack.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> Mencari...';
            btnTrack.disabled = true;

            try {
                // Fetch to Real API
                const url = new URL(API_URL);
                url.searchParams.append('action', 'trackOrder');
                url.searchParams.append('orderId', id);

                const response = await fetch(url);
                const result = await response.json();

                if (result.status === 'success') {
                    resOrderId.textContent = id;
                    // In a full implementation, you'd dynamically generate the tracking timeline here
                    // based on result.data details. For now, we reveal the section.
                    document.getElementById('trackName').textContent = result.data.nama;
                    document.getElementById('trackService').textContent = result.data.layanan;
                    trackingResult.classList.remove('hidden');
                    trackingResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    alert("Pesanan tidak ditemukan: " + result.message);
                }

            } catch (e) {
                console.error("Error Tracking:", e);
                // Fallback Simulation
                resOrderId.textContent = id;
                document.getElementById('trackName').textContent = "Pelanggan";
                document.getElementById('trackService').textContent = "Layanan AC";
                trackingResult.classList.remove('hidden');
                trackingResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
                alert("Mode Simulasi: Gagal menghubungi server.");

            } finally {
                btnTrack.innerHTML = originalBtnText;
                btnTrack.disabled = false;
            }
        });
    }

    // Check Service Worker registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js')
                .then(reg => console.log('SW registered'))
                .catch(err => console.log('SW failed', err));
        });
    }

});
