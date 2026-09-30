// src/upload.js - FINAL SAFE - BharatFlix
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

async function uploadBharatFlixVideo(file) {
  if (typeof checkVideoSafety === 'function') {
    let safe = await checkVideoSafety(file);
    if (!safe) return;
  }
  try {
    alert("Upload हो रहा है भैया जी...");
    const storage = getStorage();
    const storageRef = ref(storage, 'videos/' + Date.now() + '_' + file.name);
    await uploadBytes(storageRef, file);
    let url = await getDownloadURL(storageRef);
    alert("✅ हो गया भैया जी!");
    let player = document.getElementById('v');
    if(player){ player.src = url; player.play(); }
    return url;
  } catch (e) {
    alert("Fail: " + e.message);
  }
}
window.uploadBharatFlixVideo = uploadBharatFlixVideo;
