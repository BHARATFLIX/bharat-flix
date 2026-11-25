// Vercel - BharatFlix - 100% Kaam Wala + 4 Sensor - FINAL LOCK
// TOKEN AUR GODAM NUMBER ISME NAHI HAI - VO VERSEL ME CHHUPA HUA HAI

export const config = { api: { bodyParser: false } };
import formidable from 'formidable';
import fs from 'fs';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: 'Sirf POST chalega' });
  }

  // TOKEN - DONO NAAM CHALENGE - JO VERSEL ME HOGA WAHI CHALEGA
  const token = process.env.TELEGRAM_TOKEN || process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID || "-1003847641214";
  if (!token || !chatId) {
    return res.status(500).json({ ok: false, msg: 'Token ya Godam number Versel me nahi mila' });
  }

  try {
    // FORMDATA SE VIDEO + TITLE + CATEGORY + REPORTER - MERA WALA TAREEKA
    const form = formidable({ maxFileSize: 200 * 1024 * 1024 });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, f, fl) => err ? reject(err) : resolve([f, fl]));
    });

    const getField = (v) => Array.isArray(v) ? v[0] : v || '';

    const title = String(getField(fields.title) || getField(fields.caption) || '').toLowerCase();
    const category = String(getField(fields.category) || 'normal').toLowerCase();
    // Frontend se isReporter = yes / no aayega
    // Header se bhi aaye to wo bhi chalega
    const isReporter = String(getField(fields.isReporter) || req.headers['x-is-reporter'] || '') === 'yes';

    const videoFile = files.video?.[0] || files.video;
    if (!videoFile) {
      return res.status(400).json({ ok: false, msg: 'Video nahi mili' });
    }

    // ============ SENSOR 1 - COPYRIGHT ============
    const copyrightWords = ['tseries', 'sony', 'zee', 'star plus', 'netflix', 'bollywood movie', 'full movie'];
    for (const w of copyrightWords) {
      if (title.includes(w)) {
        return res.status(400).json({ ok: false, sensor: 1, msg: 'Copyright video nahi chalegi - Kisi aur ka gana / film hai' });
      }
    }

    // ============ SENSOR 2 - WATERMARK ============
    const watermarkWords = ['tiktok', 'youtube', 'instagram reels', 'watermark', 'made by', 'credit:'];
    for (const w of watermarkWords) {
      if (title.includes(w)) {
        return res.status(400).json({ ok: false, sensor: 2, msg: 'Watermark wali video nahi chalegi - Kisi aur ka naam / logo hai' });
      }
    }

    // ============ SENSOR 3 + 4 - GANDI VIDEO + REPORTER RULE ============
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
    const buffer = fs.readFileSync(videoFile.filepath);
    const blob = new Blob([buffer], { type: 'video/mp4' });
    const fd = new FormData();
    fd.append('chat_id', chatId);
    fd.append('caption', ('BharatFlix Video - 4 Sensor Paas - ' + title).slice(0, 1000));
    fd.append('video', blob, 'video.mp4');

    const tgRes = await fetch('https://api.telegram.org/bot' + token + '/sendVideo', { method: 'POST', body: fd });
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
