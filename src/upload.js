window.uploadBharatFlixVideo = function(file){
  // 100MB से बड़ा है तो रोक दो
  if(file.size > 90 * 1024 * 1024){
    alert('❌ भैया जी वीडियो 90MB से बड़ा है! छोटा वीडियो चुनो 🇮🇳\nअभी: ' + Math.round(file.size/1024/1024) + 'MB');
    return Promise.resolve(null);
  }

  let box = document.getElementById('skipBox');
  if(box){ box.style.display='block'; box.style.background='#FF9933'; box.style.color='#000'; box.innerText='⏳ 0% शुरू...'; }
  
  return new Promise((resolve)=>{
    let fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', 'bharatflix');
    
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/xuwsz3ag/video/upload');
    xhr.timeout = 300000; // 5 मिनट timeout

    let lastLoaded = 0;
    let stuckTimer = null;

    xhr.upload.onprogress = (e)=>{
      if(e.lengthComputable){
        let p = Math.round((e.loaded/e.total)*100);
        if(box) box.innerText = `⏳ ${p}% हो रहा है... ${Math.round(e.loaded/1024/1024)}MB`;
        
        // अगर 20 सेकंड तक आगे नहीं बढ़ा तो फंसा हुआ मानो
        if(e.loaded > lastLoaded){ lastLoaded = e.loaded; clearTimeout(stuckTimer); 
          stuckTimer = setTimeout(()=>{ 
            if(box) box.innerText = '⚠️ नेट slow, फिर से कोशिश...';
          }, 20000);
        }
      }
    };

    xhr.onload = ()=>{
      clearTimeout(stuckTimer);
      try{
        let d = JSON.parse(xhr.responseText);
        if(d.secure_url){
          if(box){ box.innerText='✅ 100% हो गया 🇮🇳'; box.style.background='#138808'; box.style.color='#fff'; setTimeout(()=>box.style.display='none',3000); }
          if(window.saveToBharatFlixDB) window.saveToBharatFlixDB({title:file.name, url:d.secure_url, channel:"BharatFlix", views:"नया"});
          alert('✅ Save हो गया भैया जी 🇮🇳');
          resolve(d.secure_url); return;
        }
      }catch(e){}
      if(box) box.style.display='none';
      alert('❌ Error: ' + xhr.responseText.substring(0,400));
      resolve(null);
    };

    xhr.ontimeout = ()=>{ if(box) box.style.display='none'; alert('❌ नेट बहुत slow है भैया जी, छोटा वीडियो या WiFi से करो'); resolve(null); };
    xhr.onerror = ()=>{ if(box) box.style.display='none'; alert('❌ नेटवर्क फेल, फिर से करो'); resolve(null); };
    
    xhr.send(fd);
  });
}
