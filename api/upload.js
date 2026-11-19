// BHARAT FLIX - FINAL api/upload.js - DATE: 19-11-2026
// 1. Telegram Godam - Video ke liye - SAHI WALA
// 2. Supabase Godam - Profile / Channel / Monetization ka hisab ke liye

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;

// GODAM - Video wala Godam - SAHI WALA
// Aapka sahi Godam = -1003847641214
// Galat wala -1008981405478 ab kahi nahi hai, wo kabhi tha hi nahi
const GODAM_ID = process.env.TELEGRAM_GODAM_ID || "-1003847641214";

// CHANNEL_ID - Profile wala Channel - Bharat Flix App wala
// Ye Telegram wala nahi hai
// Ye App me User ke Channel ki ID hai - Jaise Satyaveer Vlogs
// Ye Frontend se aayega - form me creatorChannel ke naam se
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || "";

export const config = {
  api: {
    bodyParser: false,
  },
};

// FormData ko padhne ke liye - Vercel me ye jaruri hai
async function parseForm(req) {
  const formidable = (await import('formidable')).default;
  const form = formidable({ maxFileSize: 200 * 1024 * 1024 }); // 200 MB tak
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

function getField(fields, name) {
  let v = fields[name];
  if (Array.isArray(v)) return v[0];
  return v || "";
}

export default async function handler(req, res) {
  // CORS - Bharat Flix se aane do
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Only POST allowed' });
  }

  if (!BOT_TOKEN) {
    return res.status(500).json({ ok: false, error: 'BOT_TOKEN nahi mila - Vercel me TELEGRAM_BOT_TOKEN dalo' });
  }

  try {
    const { fields, files } = await parseForm(req);

    const title = getField(fields, 'title') || 'Bharat Flix Video';
    const creator = getField(fields, 'creator') || 'Bharat Flix';
    const creatorChannel = getField(fields, 'creatorChannel') || CHANNEL_ID || '';
    const captionText = getField(fields, 'caption') || title;
    const category = getField(fields, 'category') || '';
    const isPublic = getField(fields, 'isPublic');

    let videoFile = files.video;
    if (Array.isArray(videoFile)) videoFile = videoFile[0];
    if (!videoFile) {
      return res.status(400).json({ ok: false, error: 'Video nahi mili' });
    }

    // Telegram ko Video bhejo - Godam me
    const fs = await import('fs');
    const fileStream = fs.createReadStream(videoFile.filepath);

    const tgForm = new FormData();
    tgForm.append('chat_id', GODAM_ID);
    tgForm.append('video', fileStream, {
      filename: videoFile.originalFilename || 'video.mp4',
      contentType: videoFile.mimetype || 'video/mp4'
    });
    tgForm.append('caption', `🎬 ${title}\n\n📺 Channel: ${creator} (${creatorChannel})\n📁 Category: ${category}\n👤 Creator: ${creator}\n\n🇮🇳 Bharat Flix`);
    tgForm.append('supports_streaming', 'true');

    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
      method: 'POST',
      body: tgForm
    });

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      console.log('Telegram Error:', tgData);
      return res.status(500).json({ ok: false, error: 'Telegram Godam me nahi gaya: ' + (tgData.description || 'Unknown') });
    }

    // Supabase Godam me hisab likho - Profile / Channel / Monetization
    // Agar SUPABASE_URL hai to hi likhega, nahi hai to skip
    try {
      if (process.env.SUPABASE_URL && process.env.SUPABASE_KEY) {
        await fetch(`${process.env.SUPABASE_URL}/rest/v1/videos`, {
          method: 'POST',
          headers: {
            'apikey': process.env.SUPABASE_KEY,
            'Authorization': `Bearer ${process.env.SUPABASE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            title: title,
            creator: creator,
            creator_channel: creatorChannel,
            category: category,
            visibility: isPublic === 'true' ? 'Public' : 'Private',
            godam_id: GODAM_ID,
            telegram_file_id: tgData.result.video.file_id,
            channel_id: creatorChannel
          })
        });
      }
    } catch (e) {
      console.log('Supabase hisab me error, Video to Godam me chali gayi:', e.message);
    }

    return res.status(200).json({
      ok: true,
      result: {
        video: {
          file_id: tgData.result.video.file_id,
          file_unique_id: tgData.result.video.file_unique_id,
          duration: tgData.result.video.duration
        },
        message_id: tgData.result.message_id,
        godam_id: GODAM_ID,
        channel: creator,
        channel_id: creatorChannel
      }
    });

  } catch (err) {
    console.log('Upload Error:', err);
    return res.status(500).json({ ok: false, error: err.message || 'Upload fail ho gaya' });
  }
}
