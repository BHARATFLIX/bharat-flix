// src/sensor.js - FINAL - Public BLOCK, Reporter ALL ALLOWED 🇮🇳
async function checkVideoSafety(file) {
  try {
    let name = (file.name || '').toLowerCase();
    // Title input अगर नहीं है तो file name ही Title मान लो
    let titleEl = document.getElementById('vTitle') || document.getElementById('mainTitle');
    let title = (titleEl?.value || titleEl?.innerText || '').toLowerCase();
    
    // Role और Category - अगर नहीं मिले तो public मानो
    let roleEl = document.getElementById('vRole');
    let catEl = document.getElementById('vCat');
    let role = roleEl?.value || 'public'; 
    let cat = catEl?.value || '';
    
    let allText = name + ' ' + title + ' ' + cat.toLowerCase();

    // 1. अगर Channel Reporter है तो - सब ALLOWED, कोई चेक नहीं! 👑
    if (role === 'reporter') {
      console.log("✅ Reporter Allowed: " + name);
      return true;
    }

    // 2. Public के लिए STRICT CHECK 🔍
    let banned = ['nude','xxx','porn','sex','sexy','gandi','ganda','nanga','watermark','logo','tiktok','insta reel','copyright','movie clip','full movie','fight','ladai','jhagda','khoon','abuse','gaali','mc ','bc '];
    let badCats = ['adult','gandi','watermark','copyright','fight','ladai'];
    
    let isBad = banned.some(w => allText.includes(w)) || badCats.some(c => cat.toLowerCase().includes(c));

    if (isBad) {
      alert("⛔ भैया जी Public इस तरह की Video नहीं डाल सकता! \n\n(" + (cat || name) + ") \n\nये सिर्फ Channel Reporter डाल सकता है! \n\nसाफ-सुथरी Video डालो 🇮🇳");
      return false; // Public BLOCK
    }

    console.log("✅ Public Clean Video: " + name);
    return true; // Clean तो Allowed

  } catch (e) {
    console.error("Sensor Error:", e);
    return true; // Error में भी Allow कर दो, ताकि Site रुके नहीं
  }
}

// इसको Global बना दिया ताकि upload.js में चल जाए
window.checkVideoSafety = checkVideoSafety;

console.log("BharatFlix Sensor FINAL Ready 🇮🇳 - Public BLOCK, Reporter KING");
