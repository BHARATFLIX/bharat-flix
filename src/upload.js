// src/upload.js - NO PRESET NEEDED - REAL UPLOAD FOR ALL INDIA
async function uploadBharatFlixVideo(file) {
  if(window.checkVideoSafety){
    let ok = await window.checkVideoSafety(file);
    if(!ok){ alert("❌ ये वीडियो नहीं चलेगी भैया जी"); return null; }
  }

  let box = document.getElementById('skipBox');
  if(box){ box.style.display='block'; box.style.background='#FF9933'; box.innerText='⏳ सच में Upload हो रहा है भैया जी...'; }

  try {
    // ये बिना किसी Preset के काम करता है
    let form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', file);

    let res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });

    let url = await res.text();
    
    if(url.startsWith('https://')){
      if(box){ box.innerText='✅ हो गया भैया जी 🇮🇳'; setTimeout(()=>box.style.display='none',2000); }
      let player = document.getElementById('myVideo');
      if(player){ player.src = url.trim(); player.play(); }
      alert("✅ वीडियो सच में Upload हो गया भैया जी! अब पूरे भारत में दिखेगा 🇮🇳\n\nLink: " + url);
      return url.trim();
    } else {
      throw new Error(url);
    }
  } catch(e){
    if(box) box.style.display='none';
    alert("❌ Error: " + e.message);
    return null;
  }
}
window.uploadBharatFlixVideo = uploadBharatFlixVideo;
