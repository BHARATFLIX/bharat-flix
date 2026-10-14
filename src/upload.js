async function uploadBharatFlixVideo(file) {
  let box = document.getElementById('skipBox');
  if(box){ box.style.display='block'; box.style.background='#FF9933'; box.innerText='⏳ सच में Upload हो रहा है भैया जी...'; }

  try {
    const CLOUD_NAME = "xuwsz3ag";
    const UPLOAD_PRESET = "bharatflix";

    let form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);

    let res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`, {
      method: 'POST',
      body: form
    });

    let data = await res.json();
    console.log(data);
    let url = data.secure_url;

    if(!url) throw new Error(data.error?.message || "Preset नहीं बना है");

    if(window.saveToBharatFlixDB){
      await window.saveToBharatFlixDB({title: file.name, url: url, channel: "BharatFlix User 🇮🇳"});
    }

    if(box){ box.innerText='✅ हो गया भैया जी 🇮🇳'; setTimeout(()=>box.style.display='none',2000); }
    let player = document.getElementById('myVideo');
    if(player){ player.src = url; }

    alert("✅ फाइनल हो गया! बिना कार्ड के 🇮🇳\n" + url);
    return url;

  } catch(e) {
    if(box) box.style.display='none';
    alert("❌ Error: " + e.message + "\nपहले 'bharatflix' नाम का Unsigned Preset बनाओ भैया जी");
    console.log(e);
    return null;
  }
}
window.uploadBharatFlixVideo = uploadBharatFlixVideo;
