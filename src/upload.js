async function uploadBharatFlixVideo(file) {
  if(window.checkVideoSafety){
    let ok = await window.checkVideoSafety(file);
    if(!ok){ alert("❌ ये वीडियो नहीं चलेगी भैया जी"); return null; }
  }
  let box = document.getElementById('skipBox');
  if(box){ box.style.display='block'; box.style.background='#FF9933'; box.innerText='⏳ सच में Upload हो रहा है भैया जी...'; }

  try {
    // ये नया सर्वर Proxy नहीं मांगता, सीधे चलता है
    let form = new FormData();
    form.append('file', file);

    let res = await fetch('https://tmpfiles.org/api/v1/upload', {
      method: 'POST',
      body: form
    });
    
    let data = await res.json();
    console.log(data);
    
    // लिंक मिलेगा जैसे https://tmpfiles.org/dl/....
    let url = data.data.url;
    // डायरेक्ट प्ले वाला लिंक बनाते हैं
    if(url.includes('/dl/')){
       // tmpfiles का लिंक सीधे वीडियो प्लेयर में चल जाता है
    }
    
    if(url && url.startsWith('https://')){
      if(window.saveToBharatFlixDB){
        await window.saveToBharatFlixDB({title: file.name, url: url, channel: "BharatFlix User 🇮🇳"});
      }
      if(box){ box.innerText='✅ हो गया भैया जी 🇮🇳'; setTimeout(()=>box.style.display='none',2000); }
      let player = document.getElementById('myVideo');
      if(player){ player.src = url; player.play(); }
      alert("✅ वीडियो पूरे भारत में दिखेगा अब! \n" + url);
      return url;
    } else { throw new Error("Upload fail"); }
  } catch(e){
    if(box) box.style.display='none';
    alert("❌ Error: " + e.message + " - छोटी 5 sec की वीडियो से Try करो भैया जी");
    console.log(e);
    return null;
  }
}
window.uploadBharatFlixVideo = uploadBharatFlixVideo;
