import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Importa getFirestore

const firebaseConfig = {
  apiKey: "AIzaSyC7Csbyec9vsOgLfUSsEUo_isQ2BMdrTqk",
  authDomain: "osciris-hub.firebaseapp.com",
  projectId: "osciris-hub",
  storageBucket: "osciris-hub.appspot.com",
  messagingSenderId: "424533593913",
  appId: "1:424533593913:web:ad8b0a7df578c63340a2e8",
  measurementId: "G-Y14DC4H3MG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Utiliza getFirestore para obtener la instancia de Firestore

export default db;
