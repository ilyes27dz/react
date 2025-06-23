import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage"; // أضف هذا السطر

const firebaseConfig = {
  apiKey: "AIzaSyDQsYsF-BveEzfTqBsjyChrxfznTH5hvz4",
  authDomain: "mostaganem-safe.firebaseapp.com",
  projectId: "mostaganem-safe",
  storageBucket: "mostaganem-safe.appspot.com",
  messagingSenderId: "275984612145",
  appId: "1:275984612145:web:3ddadde1e34f8bdba8ce10"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app); // أضف هذا السطر