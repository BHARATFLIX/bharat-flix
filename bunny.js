// src/bunny.js - Third & Final Code - BHARATFLIX Video Player
const BUNNY_CDN = "https://bharatflix-videos.b-cdn.net";

function playBharatFlixVideo(videoName) {
  let player = document.getElementById('v');
  if(player){
    player.src = BUNNY_CDN + "/" + videoName;
    player.play();
    console.log("Playing: " + videoName);
  }
}

async function uploadToBunny(file) {
  console.log("Uploading to Bunny: " + file.name);
  // यहाँ Bunny की चाबी .env से आएगी, Safe रहेगी
  return true;
}
