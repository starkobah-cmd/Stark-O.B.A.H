import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  projectId: "refined-sequence-s6rpq",
  appId: "1:987139530241:web:7da3dffab86899c38c6a00",
  apiKey: "AIzaSyCZn-E5vId2cUqQzdkYoxjxxE5QvtV8E2M",
  authDomain: "refined-sequence-s6rpq.firebaseapp.com",
  storageBucket: "refined-sequence-s6rpq.firebasestorage.app",
  messagingSenderId: "987139530241"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "ai-studio-metazivodigitala-d4aad5a3-6079-41b3-aba2-fbd40fd65c0d");
