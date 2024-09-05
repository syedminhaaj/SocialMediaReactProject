// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBQ3cRU01Ygh64dqg0HaXh8RVTRjSnPpRg",
  authDomain: "react-social-media-eb8e7.firebaseapp.com",
  projectId: "react-social-media-eb8e7",
  storageBucket: "react-social-media-eb8e7.appspot.com",
  messagingSenderId: "882200906220",
  appId: "1:882200906220:web:89a8e4580356bee5c1d8c9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);
