// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "findnest-ff43f.firebaseapp.com",
  projectId: "findnest-ff43f",
  storageBucket: "findnest-ff43f.appspot.com",
  messagingSenderId: "139751293554",
  appId: "1:139751293554:web:68766b70e1fd16a68278eb",
  measurementId: "G-HQE4T1WYXD"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
