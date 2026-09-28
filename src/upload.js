// src/upload.js - HD VIDEO UPLOAD
export async function uploadHDVideo(file) {
  try {
    // 1. Sensor Check
    if (window.checkVideoSafety) {
      let safe = await window.checkVideoSafety(file);
      if (!safe) { alert("❌ अश्लील वीडियो Block!"); return; }
    }
    // 2. Bunny पर HD Upload - bunny.js से चलेगा
    alert("⏳ HD Upload हो रही है: " + file.name);
    let id = await window.bunnyUpload(file);
    alert("✅ HD में Live हो गई! ID: " + id);
  } catch(e) { alert("❌ Fail: " + e.message); }
}
window.uploadHDVideo = uploadHDVideo;
