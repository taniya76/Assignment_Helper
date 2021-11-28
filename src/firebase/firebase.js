// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgpZEYbmPJn2UNFp1hKbotPYdIqujyfUo",
  authDomain: "classroom2-72408.firebaseapp.com",
  databaseURL: "https://classroom2-72408-default-rtdb.firebaseio.com",
  projectId: "classroom2-72408",
  storageBucket: "classroom2-72408.appspot.com",
  messagingSenderId: "257482567897",
  appId: "1:257482567897:web:d884508313d5b9cbba0ec8",
  measurementId: "G-KKP0Q3E608"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);
const reference=ref;
export {db,storage,reference};