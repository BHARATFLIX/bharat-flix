import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCCevL_8GSXw0S7u9ujcrQJmiTfpTn87qE",
  authDomain: "bharatflix-82578.firebaseapp.com",
  projectId: "bharatflix-82578",
  storageBucket: "bharatflix-82578.firebasestorage.app",
  messagingSenderId: "858704386202",
  appId: "1:858704386202:web:9cfd17f85b3593d5516723"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);

window.saveToBharatFlixDB = async (data) => {
  try {
    await addDoc(collection(db, "videos"), {
      title: data.title,
      url: data.url,
      channel: data.channel || "BharatFlix User 🇮🇳",
      cat: "यूजर वीडियो",
      views: "अभी-अभी",
      createdAt: serverTimestamp()
    });
    return true;
  } catch(e){ console.error(e); return false; }
};

window.loadBharatFlixVideos = async () => {
  try {
    const q = query(collection(db, "videos"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    let arr = [];
    snap.forEach(d => arr.push(d.data()));
    return arr;
  } catch(e){ return []; }
}
