function uploadBharatFlixVideo(file){
  let box=document.getElementById('skipBox');
  if(box){box.style.display='block'; box.style.background='#FF9933'; box.innerText='⏳ 0% से शुरू भैया जी...';}
  return new Promise((resolve)=>{
    let fd=new FormData();
    fd.append('file',file);
    fd.append('upload_preset','bharatflix');
    let xhr=new XMLHttpRequest();
    xhr.open('POST','https://api.cloudinary.com/v1_1/xuwsz3ag/video/upload');
    xhr.upload.onprogress=(e)=>{
      if(e.lengthComputable){
        let p=Math.round(e.loaded/e.total*100);
        if(box) box.innerText=`⏳ ${p}% Upload हो रहा है भैया जी...`;
      }
    };
    xhr.onload=()=>{
      try{
        let d=JSON.parse(xhr.responseText);
        if(d.secure_url){
          let url=d.secure_url;
          if(window.saveToBharatFlixDB) window.saveToBharatFlixDB({title:file.name,url:url,channel:"BharatFlix"});
          if(box){box.innerText='✅ 100% हो गया 🇮🇳'; setTimeout(()=>box.style.display='none',3000);}
          let p=document.getElementById('myVideo'); if(p) p.src=url;
          alert('✅ हो गया भैया जी 🇮🇳\n'+url);
          resolve(url); return;
        }
      }catch(e){}
      if(box) box.style.display='none';
      alert('❌ Error: '+xhr.responseText.substring(0,200));
      resolve(null);
    };
    xhr.onerror=()=>{
      if(box) box.style.display='none';
      alert('❌ नेटवर्क धीमा है, फिर से Try करो');
      resolve(null);
    };
    xhr.send(fd);
  });
}
window.uploadBharatFlixVideo=uploadBharatFlixVideo;
