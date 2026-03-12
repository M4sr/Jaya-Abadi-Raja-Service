self.addEventListener('push', function(event) {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: '/images/logo-icon.png', // Sesuaikan dengan path logo Anda
            badge: '/images/logo-icon.png',
            vibrate: [100, 50, 100],
            data: {
                url: data.url || '/'
            },
            actions: [
                { action: 'open', title: 'Lihat Detail' }
            ]
        };

        event.waitUntil(
            self.registration.showNotification(data.title, options)
        );

        // Play custom sound if needed
        // Note: Browsers usually prevent sound without user interaction, 
        // but some allow it via specific notification options or if already interacted with.
    }
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow(event.notification.data.url)
    );
});
