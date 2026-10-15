window.uploadBharatFlixVideo = async function(file){
  // 1. सबसे पहले Sensor Check 🇮🇳
  if(window.checkVideoSafety){
    let safe = await window.checkVideoSafety(file);
    if(!safe) return null; // गंदी Video तो रोको
  }

  // 2. Size Check - 90MB
  if(file.size > 90 * 1024 * 1024){
    alert('❌ भैया जी वीडियो 90MB से बड़ा है! छोटा वीडियो चुनो 🇮🇳\nअभी: ' + Math.round(file.size/1024/1024) + 'MB');
    return null;
  }

  let box = document.getElementById('skipBox');
  if(box){ box.style.display='block'; box.style.background='#FF9933'; box.style.color='#000'; box.innerText='⏳ 0% शुरू...'; }
  
  return new Promise((resolve)=>{
    let fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', 'bharatflix');
    
    let xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.cloudinary.com/v1_1/xuwsz3ag/video/upload');
    xhr.timeout = 300000;

    xhr.upload.onprogress = (e)=>{
      if(e.lengthComputable){
        let p = Math.round((e.loaded/e.total)*100);
        if(box) box.innerText = `⏳ ${p}% हो रहा है... ${Math.round(e.loaded/1024/1024)}MB / ${Math.round(e.total/1024/1024)}MB`;
      }
    };

    xhr.onload = async ()=>{
      try{
        let d = JSON.parse(xhr.responseText);
        if(d.secure_url){
          if(box){ box.innerText='✅ 100% Upload, अब Save हो रहा है...'; box.style.background='#138808'; box.style.color='#fff'; }
          
          // 3. यहाँ था Error - अब सही कर दिया! FINAL SAVE
          try {
            if(window.saveToBharatFlixDB){
              await window.saveToBharatFlixDB({
                title: file.name, 
                url: d.secure_url, 
                channel: "BharatFlix User 🇮🇳", 
                views: "नया"
              });
              if(box){ box.innerText='✅ FINAL Save हो गया 🇮🇳'; setTimeout(()=>box.style.display='none',3000); }
              alert('✅ Save हो गया भैया जी 🇮🇳\nFirebase में चला गया!');
            } else {
              // अगर Firebase नहीं भी है तो भी Cloudinary URL तो मिला!
              if(box) box.style.display='none';
              alert('✅ Video Upload हो गया (Cloudinary) 🇮🇳\nURL: ' + d.secure_url.substring(0,50));
            }
          } catch(saveErr){
            // Save Fail भी हो तो भी Video तो Upload है!
            console.error("Save Error:", saveErr);
            if(box) box.style.display='none';
            alert('⚠️ Video Upload तो हो गया भैया जी! 🇮🇳\nपर Firebase Permission में Error है, Firebase Console में Rule को Allow करो।\n\nVideo URL: ' + d.secure_url);
          }
          
          resolve(d.secure_url); 
          return;
        } else {
          throw new Error("No secure_url");
        }
      }catch(e){
        console.error(e);
        if(box) box.style.display='none';
        alert('❌ Error: ' + xhr.responseText.substring(0,400));
        resolve(null);
      }
    };

    xhr.ontimeout = ()=>{ if(box) box.style.display='none'; alert('❌ नेट बहुत slow है भैया जी, WiFi से करो'); resolve(null); };
    xhr.onerror = ()=>{ if(box) box.style.display='none'; alert('❌ नेटवर्क फेल, फिर से करो'); resolve(null); };
    
    xhr.send(fd);
  });
}

console.log("BharatFlix Upload FINAL Ready 🇮🇳 - Save Error Fixed");
