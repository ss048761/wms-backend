// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC8IbP4oBeOYgFFdpNOKiCPmu0aMPAmjLw",
  authDomain: "wms-app-8894e.firebaseapp.com",
  projectId: "wms-app-8894e",
  storageBucket: "wms-app-8894e.firebasestorage.app",
  messagingSenderId: "734937143252",
  appId: "1:734937143252:web:149cd0a43c4b30c0236841",
  measurementId: "G-145TZ7E89V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export auth and Google provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
