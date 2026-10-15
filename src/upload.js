function uploadBharatFlixVideo(file){
  let box=document.getElementById('skipBox');
  if(box){box.style.display='block'; box.innerText='⏳ 0% से शुरू...';}
  return new Promise((resolve)=>{
    let fd=new FormData();
    fd.append('file',file);
    fd.append('upload_preset','bharatflix');
    // cloud_name यहाँ नहीं लिखना, वो URL में है

    let xhr=new XMLHttpRequest();
    xhr.open('POST','https://api.cloudinary.com/v1_1/xuwsz3ag/video/upload');
    xhr.upload.onprogress=(e)=>{
      if(e.lengthComputable){
        let p=Math.round(e.loaded/e.total*100);
        if(box) box.innerText=`⏳ ${p}% हो रहा है...`;
      }
    };
    xhr.onload=()=>{
      try{
        let d=JSON.parse(xhr.responseText);
        if(d.secure_url){
          if(box){box.innerText='✅ 100% हो गया 🇮🇳'; setTimeout(()=>box.style.display='none',2000);}
          if(window.saveToBharatFlixDB) window.saveToBharatFlixDB({title:file.name,url:d.secure_url,channel:"BharatFlix"});
          alert('✅ Save हो गया भैया जी 🇮🇳');
          resolve(d.secure_url); return;
        }
      }catch(e){}
      if(box) box.style.display='none';
      alert('Error: '+xhr.responseText.substring(0,300));
      resolve(null);
    };
    xhr.send(fd);
  });
}
window.uploadBharatFlixVideo=uploadBharatFlixVideo;
