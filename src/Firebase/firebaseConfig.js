// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCRiUrAw77Y4Qgtk0MYa0XqfFFVGdZPmNI",
  authDomain: "gym1-15705.firebaseapp.com",
  projectId: "gym1-15705",
  storageBucket: "gym1-15705.appspot.com",
  messagingSenderId: "808335072871",
  appId: "1:808335072871:web:5e275a9d69245a10e87ec2",
  measurementId: "G-3T1PS6JGJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const  db = getFirestore(app);
export const auth = getAuth(app);