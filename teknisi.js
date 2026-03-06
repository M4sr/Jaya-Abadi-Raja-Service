/**
 * Jaya Abadi Raja Service
 * Technician Panel Script
 */

document.addEventListener('DOMContentLoaded', () => {

    // === Theme Toggle ===
    const techThemeToggle = document.getElementById('techThemeToggle');
    const htmlElement = document.documentElement;
    const themeIcon = techThemeToggle?.querySelector('i');

    function toggleTheme() {
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark');
            localStorage.setItem('tech_theme', 'light');
            if (themeIcon) { themeIcon.classList.replace('ph-sun', 'ph-moon'); }
        } else {
            htmlElement.classList.add('dark');
            localStorage.setItem('tech_theme', 'dark');
            if (themeIcon) { themeIcon.classList.replace('ph-moon', 'ph-sun'); }
        }
    }

    if (localStorage.tech_theme === 'dark' || (!('tech_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        htmlElement.classList.add('dark');
        if (themeIcon) { themeIcon.classList.replace('ph-moon', 'ph-sun'); }
    } else {
        htmlElement.classList.remove('dark');
    }

    if (techThemeToggle) techThemeToggle.addEventListener('click', toggleTheme);


    // === GPS Live Tracking Logic ===
    const toggleGpsBtn = document.getElementById('toggleGpsBtn');
    const gpsStatus = document.getElementById('gpsStatus');
    const gpsIndicator = document.getElementById('gpsIndicator');

    let isTracking = false;
    let watchId = null;

    if (toggleGpsBtn) {
        toggleGpsBtn.addEventListener('click', () => {
            if (!isTracking) {
                // Start Tracking
                if ("geolocation" in navigator) {
                    toggleGpsBtn.innerHTML = '<i class="ph-bold ph-spinner animate-spin"></i> Menghubungkan...';

                    watchId = navigator.geolocation.watchPosition(
                        (position) => {
                            const lat = position.coords.latitude;
                            const lng = position.coords.longitude;

                            // Visual Update
                            isTracking = true;
                            toggleGpsBtn.innerHTML = '<i class="ph-bold ph-stop"></i> Hentikan Sharing';
                            toggleGpsBtn.className = "w-full py-3.5 bg-red-500 text-white font-bold text-sm rounded-xl shadow-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2";

                            gpsStatus.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse block" id="gpsIndicator"></span> GPS ON`;
                            gpsStatus.classList.replace('bg-white/20', 'bg-green-500/20');

                            // FAKE: Send to server logic would go here
                            console.log(`Sending Location to Server: ${lat}, ${lng}`);
                        },
                        (error) => {
                            alert("Gagal mengaktifkan GPS. Pastikan izin lokasi diberikan.");
                            stopTracking();
                        },
                        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
                    );

                } else {
                    alert("Browser Anda tidak mendukung Geolocation");
                }
            } else {
                // Stop Tracking
                stopTracking();
            }
        });
    }

    function stopTracking() {
        if (watchId) navigator.geolocation.clearWatch(watchId);
        isTracking = false;

        if (toggleGpsBtn) {
            toggleGpsBtn.innerHTML = '<i class="ph-bold ph-broadcast"></i> Aktifkan Sharing Lokasi';
            toggleGpsBtn.className = "w-full py-3.5 bg-green-500 text-white font-bold text-sm rounded-xl shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2";
        }

        if (gpsStatus) {
            gpsStatus.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-red-400 block" id="gpsIndicator"></span> GPS OFF`;
            gpsStatus.classList.replace('bg-green-500/20', 'bg-white/20');
        }
        console.log("Tracking Stopped");
    }

    // Initialize PWA
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./service-worker.js');
        });
    }

});
