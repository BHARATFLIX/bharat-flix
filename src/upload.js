// src/upload.js - REAL UPLOAD - BharatFlix Cloudinary
async function uploadBharatFlixVideo(file) {
  // 1. गंदी वीडियो चेक
  if (typeof window.checkVideoSafety === 'function') {
    let safe = await window.checkVideoSafety(file);
    if (!safe) {
      alert("❌ ये वीडियो BharatFlix के लायक नहीं है भैया जी!");
      return null;
    }
  }

  // 2. Cloudinary की असली जानकारी
  const CLOUD_NAME = "xuwsz3ag";
  const UPLOAD_PRESET = "bharatflix_public";

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('folder', 'bharatflix_videos');

  try {
    // झूठा alert नहीं, सच का progress
    let statusBox = document.getElementById('skipBox');
    if(statusBox){
        statusBox.style.display = 'block';
        statusBox.style.background = '#FF9933';
        statusBox.innerText = '⏳ Upload हो रहा है... 0%';
    }

    let response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    let data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    let videoUrl = data.secure_url;
    
    if(statusBox){
        statusBox.innerText = '✅ हो गया भैया जी! 🇮🇳';
        setTimeout(()=> statusBox.style.display='none', 2000);
    } else {
        alert("✅ वीडियो सच में अपलोड हो गया भैया जी! 🇮🇳");
    }

    // Player में चलाओ
    let player = document.getElementById('myVideo');
    if(player){ 
        player.src = videoUrl; 
        player.play();
        // Ad बंद करो असली वीडियो के लिए
        if(window.adPlayed !== undefined) window.adPlayed = true;
        let playBtn = document.getElementById('playBtn');
        if(playBtn) playBtn.style.display='none';
    }

    return videoUrl;

  } catch (e) {
    console.error(e);
    alert("❌ Upload Fail: " + e.message + "\n\nभैया जी Cloudinary में जाकर Preset 'bharatflix_public' को Unsigned किया है ना? चेक कर लो।");
    let statusBox = document.getElementById('skipBox');
    if(statusBox) statusBox.style.display='none';
    return null;
  }
}
window.uploadBharatFlixVideo = uploadBharatFlixVideo;
