// 'use client';

// import React, { useState } from 'react';
// import firebase from 'firebase/compat/app';
// import 'firebase/compat/messaging';

// // Initialize Firebase only once
// if (!firebase.apps.length) {
//   firebase.initializeApp({
//     apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//     authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//     projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//     storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
//   });
// }

// // Initialize Firebase Messaging
// const messaging = firebase.messaging();

// export default function TokenTestPage() {
//   const [token, setToken] = useState('');

//   const generateToken = async () => {
//     try {
//       // Request permission for notifications
//       const permission = await Notification.requestPermission();
//       if (permission !== 'granted') {
//         alert('Notification permission was not granted.');
//         return;
//       }

//       // Generate the FCM token (replace YOUR_VAPID_KEY with your actual VAPID key)
//       const currentToken = await messaging.getToken({ vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
//       console.log('FCM Token:', currentToken);
//       setToken(currentToken);

//       // Send the token to your API endpoint
//       const response = await fetch('http://localhost:3002/api/collect-token', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ token: currentToken })
       
//       });
//       console.log('response', response);
//       const data = await response.json();
//       console.log('API Response:', data);
//     } catch (error) {
//       console.error('Error generating token:', error);
//     }
//   };

//   return (
//     <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
//       <h1>FCM Token Generator</h1>
//       <button onClick={generateToken} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
//         Generate Token &amp; Send to API
//       </button>
//       {token && (
//         <div style={{ marginTop: '1rem' }}>
//           <strong>Your FCM Token:</strong>
//           <pre>{token}</pre>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';

import React, { useEffect, useState } from 'react';

export default function TokenTestPage() {
  const [token, setToken] = useState('');

  useEffect(() => {
    async function initFirebaseMessaging() {
      // Dynamically import Firebase and assert its type as any to bypass type errors
      const firebase = (await import('firebase/compat/app')).default as any;
      await import('firebase/compat/messaging');

      // Initialize Firebase if not already initialized
      if (!firebase.apps?.length) {
        firebase.initializeApp({
          apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
          authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
          storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
          messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
          appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        });
      }

      const messaging = firebase.messaging();
      try {
        // Request notification permission
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          alert('Notification permission was not granted.');
          return;
        }

        // Generate the FCM token using your VAPID key
        const currentToken = await messaging.getToken({
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        });
        console.log('FCM Token:', currentToken);
        setToken(currentToken);

        // Send the token to your API endpoint
        const response = await fetch('http://localhost:3001/api/collect-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: currentToken }),
        });
        console.log('Response:', response);
        const data = await response.json();
        console.log('API Response:', data);
      } catch (error) {
        console.error('Error generating token:', error);
      }
    }
    initFirebaseMessaging();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FCM Token Generator</h1>
      {token ? (
        <div style={{ marginTop: '1rem' }}>
          <strong>Your FCM Token:</strong>
          <pre>{token}</pre>
        </div>
      ) : (
        <p>Loading token...</p>
      )}
    </div>
  );
}
