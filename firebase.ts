// Import the functions you need from the SDKs you need
import {getApp, getApps, initializeApp} from "firebase/app";
import {getAnalytics} from "firebase/analytics";
import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDbLetFsbd-XcccbI-ioRHLgEEuA-W7PNI",
  authDomain: "notable-notes-20ac9.firebaseapp.com",
  projectId: "notable-notes-20ac9",
  storageBucket: "notable-notes-20ac9.appspot.com",
  messagingSenderId: "589816310078",
  appId: "1:589816310078:web:fdf7bc0fd60b777132a46f",
  measurementId: "G-75MRHNYVLB",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
//const analytics = getAnalytics(app);

const db = getFirestore(app);

export {db};
