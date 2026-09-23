// src/sensor.js - FINAL - Public BLOCK, Reporter ALL ALLOWED
async function checkVideoSafety(file) {
  try {
    let name = (file.name || '').toLowerCase();
    let title = (document.getElementById('vTitle')?.value || '').toLowerCase();
    let role = document.getElementById('vRole')?.value || 'public';
    let cat = document.getElementById('vCat')?.value || '';
    let allText = name + ' ' + title;

    // अगर Channel Reporter है तो - सब Allowed, कोई चेक नहीं!
    if (role === 'reporter') {
      return true; // Reporter सब दिखा सकता है
    }

    // Public के लिए चेक
    let banned = ['nude','xxx','porn','sex','gandi','watermark','logo','tiktok','copyright','movie clip','fight','ladai','jhagda','khoon','abuse'];
    let badCats = ['Adult/Gandi','Watermark','Copyright','Fight/Ladai'];
    
    let isBad = banned.some(w => allText.includes(w)) || badCats.includes(cat);

    if (isBad) {
      alert("⛔ भैया जी Public इस तरह की (" + cat + ") Video नहीं डाल सकता! \nये सिर्फ Channel Reporter डाल सकता है!");
      return false; // Public Block
    }

    return true; // Public के लिए साफ वीडियो Allowed

  } catch (e) {
    return true;
  }
}
