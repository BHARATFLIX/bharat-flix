// VIDEO UPLOAD - 4 SENSOR KE SAATH - BADE GODAM SE PEHLE CHECK HOGA
// TOKEN AUR GODAM NUMBER ISME NAHI HAI - VO VERSEL ME CHHUPA HUA HAI

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: 'Sirf POST chalega' });
  }

  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, msg: 'Token ya Godam number Versel me nahi mila' });
  }

  try {
    const chunks = [];
    for await (const chunk of req) { chunks.push(chunk); }
    const buffer = Buffer.concat(chunks);

    // TITLE / USER TYPE - INDEX SE AAYEGA
    // isReporter = true matlab News Reporter hai, false matlab Aam Aadmi hai
    // title = video ka naam, category = news / normal
    const title = (req.headers['x-video-title'] || '').toLowerCase();
    const category = (req.headers['x-video-category'] || 'normal').toLowerCase();
    const isReporter = req.headers['x-is-reporter'] === 'yes';

    // ============ SENSOR 1 - COPYRIGHT ============
    // Kisi aur ka gana, film, tv, channel ka naam ho to ROK DO
    const copyrightWords = ['tseries', 'sony', 'zee', 'star plus', 'netflix', 'bollywood movie', 'full movie'];
    for (const w of copyrightWords) {
      if (title.includes(w)) {
        return res.status(400).json({ ok: false, sensor: 1, msg: 'Copyright video nahi chalegi - Kisi aur ka gana / film hai' });
      }
    }

    // ============ SENSOR 2 - WATERMARK ============
    // Kisi aur ka logo / naam / tiktok / youtube likha ho to ROK DO
    const watermarkWords = ['tiktok', 'youtube', 'instagram reels', 'watermark', 'made by', 'credit:'];
    for (const w of watermarkWords) {
      if (title.includes(w)) {
        return res.status(400).json({ ok: false, sensor: 2, msg: 'Watermark wali video nahi chalegi - Kisi aur ka naam / logo hai' });
      }
    }

    // ============ SENSOR 3 + 4 - GANDI VIDEO + REPORTER RULE ============
    // Gandi wali baat title me ho to check karo
    const gandiWords = ['adult', 'xxx', 'porn', 'nude', 'sex'];
    let isGandi = false;
    for (const w of gandiWords) {
      if (title.includes(w)) { isGandi = true; }
    }

    // SENSOR 3 - AAM AADMI GANDI VIDEO NAHI DAAL SAKTA
    if (isGandi && !isReporter) {
      return res.status(400).json({ ok: false, sensor: 3, msg: 'Gandi video nahi chalegi - Aam aadmi gandi video nahi daal sakta' });
    }

    // SENSOR 4 - REPORTER SIRF NEWS HI DAAL SAKTA HAI, GANDI NAHI
    if (isReporter && isGandi && category !== 'news') {
      return res.status(400).json({ ok: false, sensor: 4, msg: 'Reporter sirf News wali video daal sakta hai - Gandi wali nahi' });
    }
    if (isReporter && category === 'news' && isGandi) {
      return res.status(400).json({ ok: false, sensor: 4, msg: 'Reporter News me bhi gandi video nahi daal sakta' });
    }

    // ============ 4 SENSOR PAAS HO GAYE - AB VIDEO GODAM ME JAYEGI ============
    const telegramUrl = 'https://api.telegram.org/bot' + token + '/sendVideo';
    const form = new FormData();
    form.append('chat_id', chatId);
    form.append('video', new Blob([buffer]), 'video.mp4');
    form.append('caption', 'BharatFlix Video - 4 Sensor Paas');

    const tgRes = await fetch(telegramUrl, { method: 'POST', body: form });
    const tgData = await tgRes.json();

    if (!tgData.ok) {
      return res.status(500).json({ ok: false, msg: 'Video bade godam me nahi gayi', detail: tgData });
    }

    return res.status(200).json({
      ok: true,
      where: 'bada-godam-video-only-4-sensor-paas',
      message_id: tgData.result.message_id,
    });

  } catch (err) {
    return res.status(500).json({ ok: false, msg: 'Error aa gaya', error: String(err) });
  }
}
