async function uploadBharatFlixVideo(file) {
  let box = document.getElementById('skipBox');
  if(box){ box.style.display='block'; box.style.background='#FF9933'; box.innerText='⏳ 0% Upload हो रहा है भैया जी...'; }

  return new Promise((resolve, reject) => {
    const CLOUD_NAME = "xuwsz3ag";
    const UPLOAD_PRESET = "bharatflix";
    
    let form = new FormData();
    form.append('file', file);
    form.append('upload_preset', UPLOAD_PRESET);

    let xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`);

    // यही % चलाएगा
    xhr.upload.onprogress = function(e) {
      if(e.lengthComputable){
        let percent = Math.round((e.loaded / e.total) * 100);
        if(box) box.innerText = `⏳ ${percent}% Upload हो रहा है भैया जी...`;
        console.log(percent + "%");
      }
    };

    xhr.onload = async function() {
      try {
        let data = JSON.parse(xhr.responseText);
        let url = data.secure_url;
        if(!url) throw new Error(data.error?.message || "Preset बनाओ");

        if(window.saveToBharatFlixDB){
          await window.saveToBharatFlixDB({title: file.name, url: url, channel: "BharatFlix User 🇮🇳"});
        }

        if(box){ box.innerText='✅ हो गया भैया जी 🇮🇳 ' + '100%'; setTimeout(()=>box.style.display='none',2500); }
        let player = document.getElementById('myVideo');
        if(player){ player.src = url; }

        alert("✅ हो गया! 🇮🇳\n" + url);
        resolve(url);
      } catch(err){
        if(box) box.style.display='none';
        alert("❌ " + err.message);
        reject(null);
      }
    };

    xhr.onerror = function(){
      if(box) box.style.display='none';
      alert("❌ नेटवर्क Error, फिर से Try करो");
      reject(null);
    };

    xhr.send(form);
  });
}
window.uploadBharatFlixVideo = uploadBharatFlixVideo;
