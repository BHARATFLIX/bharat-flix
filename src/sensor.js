window.BharatFlixCensor = {
  blockWords: ["porn","xxx","nude","sex"],
  checkTitle: function(title){
    let t = title.toLowerCase();
    for(let w of this.blockWords){ if(t.includes(w)) return {ok:false, reason:"❌ गंदी वीडियो Block"}; }
    if(t.includes("tiktok")||t.includes("likee")) return {ok:false, reason:"❌ Watermark Block"};
    return {ok:true};
  },
  checkVideo: function(file){
    if(file.size > 150*1024*1024) return {ok:false, reason:"❌ 150MB से बड़ी नहीं"};
    if(!navigator.onLine) return {ok:false, reason:"📶 Net नहीं है"};
    return {ok:true};
  }
};
console.log("✅ Censor ON - Unknown API Key खत्म 🇮🇳");
