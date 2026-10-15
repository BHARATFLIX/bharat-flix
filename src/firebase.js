import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSy...आपका_असली_apiKey_यहाँ...",
  authDomain: "bharatflix-xxxxx.firebaseapp.com",
  projectId: "bharatflix-xxxxx",
  storageBucket: "bharatflix-xxxxx.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abcd"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

window.saveToBharatFlixDB = async function(data){
  try{
    await addDoc(collection(db, "videos"), data);
    console.log("✅ गोदाम में Save - पूरे भारत में दिखेगा 🇮🇳");
  }catch(e){ console.log("Godown Error", e); }
}

console.log("✅ Firebase गोदाम ON 🇮🇳");
