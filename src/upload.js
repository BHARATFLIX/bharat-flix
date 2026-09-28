// PUBLIC UPLOAD - पूरे इंडिया के लिए
export async function uploadHDVideo(file) {
  try {
    if (!file) return alert("❌ फाइल नहीं है!");

    // पब्लिक के लिए सेंसर जरूरी है - Skip नहीं होगा
    if (window.checkVideoSafety) {
      alert("🔍 वीडियो चेक हो रही है भैया जी...");
      let safe = await window.checkVideoSafety(file);
      if (!safe) {
        alert("❌ ये वीडियो गंदी है, पब्लिक के लिए Block कर दी!");
        return; // यहीं रोक देंगे
      }
    } else {
      alert("⚠️ सेंसर लोड नहीं हुआ, फिर भी Upload कर रहा हूँ!");
    }

    if (!window.bunnyUpload) return alert("❌ bunny.js नहीं लगा है!");

    alert("⏳ HD Upload हो रही है: " + file.name);
    let id = await window.bunnyUpload(file);
    alert("✅ Live हो गई! पूरी पब्लिक देखेगी! ID: " + id);
    return id;

  } catch(e) {
    alert("❌ Fail: " + e.message);
  }
}
window.uploadHDVideo = uploadHDVideo;
