import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1P4h3VtporU2s_Vrj0WsPqughKf4AIJw",
  authDomain: "didong2-9ce2a.firebaseapp.com",
  projectId: "didong2-9ce2a",
  storageBucket: "didong2-9ce2a.firebasestorage.app",
  messagingSenderId: "791074240366",
  appId: "1:791074240366:web:d877fb3af937c299f4337f",
  measurementId: "G-DJN4BK7W50"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
