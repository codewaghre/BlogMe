// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getEnv } from "./GetEnv";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: getEnv('VITE_FIREBASE_API_KEY'),
    authDomain: "blog-me-3bbb6.firebaseapp.com",
    projectId: "blog-me-3bbb6",
    storageBucket: "blog-me-3bbb6.firebasestorage.app",
    messagingSenderId: "601241131536",
    appId: "1:601241131536:web:a8c56c48ed117c2a050895"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {
    auth, provider
}