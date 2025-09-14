import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: 'studio-1213604602-2271c',
  appId: '1:24333270254:web:cdf84b42e1131fb41107ff',
  storageBucket: 'studio-1213604602-2271c.firebasestorage.app',
  apiKey: 'AIzaSyBgE786RLwfHVvgmqJG1WNBkY3mEIMLQoQ',
  authDomain: 'studio-1213604602-2271c.firebaseapp.com',
  messagingSenderId: '24333270254',
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
