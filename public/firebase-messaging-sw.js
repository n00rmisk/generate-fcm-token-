importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.19.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDUoRdci5djYHuLAWePLa2c2q-yAcJhtL0",
  authDomain: "sample-a0ce6.firebaseapp.com",
  projectId: "sample-a0ce6",
  storageBucket: "sample-a0ce6.firebasestorage.app",
  messagingSenderId: "1050105410811",
  appId: "1:1050105410811:web:6a4c652fc50d1bd9f8ec5e",
});

const messaging = firebase.messaging();

// Background message handling
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/favicon.ico'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', async (event) => {
  event.notification.close(); // Close the notification

  const notificationId = event.notification.data?.notificationId;
  if (notificationId) {
      // Send request to update notification status
      fetch('/api/update-notification-status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notificationId }),
      });
  }

  // Open a page (optional)
  event.waitUntil(
      clients.openWindow('/')
  );
});