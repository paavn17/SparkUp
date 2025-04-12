// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth'
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAeNJJn4rCuFnR7shIKTVJ_L47l_ZFZJ98",
  authDomain: "sealed-ideas.firebaseapp.com",
  projectId: "sealed-ideas",
  storageBucket: "sealed-ideas.firebasestorage.app",
  messagingSenderId: "446736225092",
  appId: "1:446736225092:web:8fa6f5670d337bb159fd11"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app)