'use client';

import React, { useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';

// Initialize Firebase only once
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  });
}

// Initialize Firebase Messaging
const messaging = firebase.messaging();

export default function TokenTestPage() {
  const [token, setToken] = useState('');

  const generateToken = async () => {
    try {
      // Request permission for notifications
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Notification permission was not granted.');
        return;
      }

      // Generate the FCM token (replace YOUR_VAPID_KEY with your actual VAPID key)
      const currentToken = await messaging.getToken({ vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY });
      console.log('FCM Token:', currentToken);
      setToken(currentToken);

      // Send the token to your API endpoint
      const response = await fetch('http://localhost:3002/api/collect-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: currentToken })
       
      });
      console.log('response', response);
      const data = await response.json();
      console.log('API Response:', data);
    } catch (error) {
      console.error('Error generating token:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>FCM Token Generator</h1>
      <button onClick={generateToken} style={{ padding: '0.5rem 1rem', fontSize: '1rem' }}>
        Generate Token &amp; Send to API
      </button>
      {token && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Your FCM Token:</strong>
          <pre>{token}</pre>
        </div>
      )}
    </div>
  );
}
