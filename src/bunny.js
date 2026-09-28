// src/bunny.js - Third & Final Code - BHARATFLIX - NEW & WORKING
const BUNNY_CDN = "https://bharatflix-videos.b-cdn.net";
const BUNNY_LIBRARY_ID = import.meta.env.VITE_BUNNY_LIBRARY_ID; // .env से आएगा
const BUNNY_API_KEY = import.meta.env.VITE_BUNNY_API_KEY; // .env से आएगा

// 1. Video Play करने के लिए - आपका वाला सही है
function playBharatFlixVideo(videoName) {
  let player = document.getElementById('v');
  if(player){
    player.src = BUNNY_CDN + "/" + videoName;
    player.load();
    player.play().catch(e => console.log("Play error:", e));
    console.log("Playing: " + videoName);
  } else {
    console.log("Player id='v' नहीं मिला भैया जी!");
  }
}

// 2. Bunny पर HD Upload - ये नया वाला है भैया जी
async function uploadToBunny(file) {
  if (!BUNNY_LIBRARY_ID || !BUNNY_API_KEY) {
    throw new Error("Bunny की चाबी .env में नहीं मिली भैया जी!");
  }

  console.log("Uploading to Bunny: " + file.name);

  // Step 1: Video को Library में बनाओ
  let createRes = await fetch(`https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: {
      'AccessKey': BUNNY_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: file.name })
  });

  if (!createRes.ok) throw new Error("Video create fail: " + await createRes.text());
  
  let videoData = await createRes.json();
  let videoId = videoData.guid;
  console.log("Video ID बना: " + videoId);

  // Step 2: असली फाइल Upload करो
  let uploadRes = await fetch(`https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos/${videoId}`, {
    method: 'PUT',
    headers: {
      'AccessKey': BUNNY_API_KEY
    },
    body: file
  });

  if (!uploadRes.ok) throw new Error("Upload fail: " + await uploadRes.text());

  console.log("✅ Bunny Upload Success: " + videoId);
  return videoId; // यही ID upload.js को जाएगा
}

// पुराने नाम और नए नाम दोनों जोड़ दिए ताकि आपका कोड चले
window.bunnyUpload = uploadToBunny;
window.uploadToBunny = uploadToBunny;
window.playBharatFlixVideo = playBharatFlixVideo;

export { playBharatFlixVideo, uploadToBunny, BUNNY_CDN };
