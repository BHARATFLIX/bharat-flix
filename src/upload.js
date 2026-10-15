// FINAL BharatFlix Upload - 100% Mobile + % + No API Key Error
window.uploadBharatFlixVideo = function(file){
  let box = document.getElementById('skipBox');
  if(box){
    box.style.display = 'block';
    box.style.background = '#FF9933';
    box.style.color = '#000';
    box.innerText = '⏳ 0% से शुरू भैया जी...';
  }
  return new Promise((resolve)=>{
    let fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', 'bharatflix');

    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/xuwsz3ag/video/upload');

    xhr.upload.onprogress = (e)=>{
      if(e.lengthComputable){
        let p = Math.round((e.loaded / e.total) * 100);
        if(box) box.innerText = `⏳ ${p}% Upload हो रहा है...`;
      }
    };

    xhr.onload = ()=>{
      try{
        let d = JSON.parse(xhr.responseText);
        if(d.secure_url){
          if(box){
            box.innerText = '✅ 100% हो गया 🇮🇳';
            box.style.background = '#138808';
            box.style.color = '#fff';
            setTimeout(()=> box.style.display='none', 3000);
          }
          // Firebase में save
          if(window.saveToBharatFlixDB){
            window.saveToBharatFlixDB({
              title: file.name,
              url: d.secure_url,
              channel: "BharatFlix",
              views: "नया",
              thumb: d.secure_url.replace('.mp4','.jpg')
            });
          }
          alert('✅ Save हो गया भैया जी 🇮🇳\n' + d.secure_url);
          resolve(d.secure_url);
          return;
        } else {
          if(box) box.style.display='none';
          alert('❌ Cloudinary Error: ' + xhr.responseText.substring(0,400));
          resolve(null);
        }
      }catch(err){
        if(box) box.style.display='none';
        alert('❌ Error: ' + xhr.responseText.substring(0,400));
        resolve(null);
      }
    };

    xhr.onerror = ()=>{
      if(box) box.style.display='none';
      alert('❌ नेटवर्क Error, फिर से Try करो भैया जी');
      resolve(null);
    };

    xhr.send(fd);
  });
}

console.log('BharatFlix Upload Ready 🇮🇳');
