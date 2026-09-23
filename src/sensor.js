// src/sensor.js - Second Code - BHARATFLIX Safe System
async function checkVideoSafety(file) {
  let name = file.name.toLowerCase();
  if(name.includes('nude') || name.includes('xxx') || name.includes('porn')){
    alert("❌ गंदी Video Block कर दी भैया जी!");
    return false;
  }
  if(file.size > 500*1024*1024){
    alert("❌ Video बहुत बड़ी है!");
    return false;
  }
  return true;
}
