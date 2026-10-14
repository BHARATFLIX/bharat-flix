async function uploadBharatFlixVideo(file) {
  if(window.checkVideoSafety){
    let ok = await window.checkVideoSafety(file);
    if(!ok){ alert("❌ ये वीडियो नहीं चलेगी भैया जी"); return null; }
  }
  let box = document.getElementById('skipBox');
  if(box){ box.style.display='block'; box.style.background='#FF9933'; box.innerText='⏳ सच में Upload हो रहा है...'; }

  try {
    let form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('fileToUpload', file);
    let res = await fetch('https://catbox.moe/user/api.php', { method: 'POST', body: form });
    let url = (await res.text()).trim();
    
    if(url.startsWith('https://')){
      if(window.saveToBharatFlixDB){
        await window.saveToBharatFlixDB({title: file.name, url: url, channel: "BharatFlix User 🇮🇳"});
      }
      if(box){ box.innerText='✅ हो गया भैया जी 🇮🇳'; setTimeout(()=>box.style.display='none',2000); }
      let player = document.getElementById('myVideo');
      if(player){ player.src = url; player.play(); }
      alert("✅ वीडियो पूरे भारत में दिखेगा अब! \n" + url);
      return url;
    } else { throw new Error(url); }
  } catch(e){
    if(box) box.style.display='none';
    alert("❌ Error: " + e.message);
    return null;
  }
}
window.uploadBharatFlixVideo = uploadBharatFlixVideo;
