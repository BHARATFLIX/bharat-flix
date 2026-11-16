// api/upload.js - BharatFlix Final - Godam + Channel
import formidable from "formidable";
import fs from "fs";
import FormData from "form-data";
import fetch from "node-fetch";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }

  try {
    const form = formidable({ maxFileSize: 200 * 1024 * 1024 });
    const [fields, files] = await form.parse(req);

    const title = fields.title?.[0] || "BharatFlix Video";
    const creator = fields.creator?.[0] || "Unknown";
    const creatorChannel = fields.creatorChannel?.[0] || "";
    const isPublic = fields.isPublic?.[0] || "true";

    const videoFile = files.video?.[0];
    if (!videoFile) return res.status(400).json({ error: "Video nahi mili" });

    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const GODAM_ID = process.env.TELEGRAM_GODAM_ID;
    const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID;

    if (!BOT_TOKEN || !GODAM_ID) {
      return res.status(500).json({ error: "Chabi tijori me nahi hai" });
    }

    const caption = `🎬 ${title}\n👤 Creator: ${creator}\n📺 Channel: ${creatorChannel || "BharatFlix"}\n🌍 Public: ${isPublic}\n\n#BharatFlix`;

    // 1. GODAM me bhejo
    const fd1 = new FormData();
    fd1.append("chat_id", GODAM_ID);
    fd1.append("caption", caption);
    fd1.append("video", fs.createReadStream(videoFile.filepath), videoFile.originalFilename);

    let godamRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, { method: "POST", body: fd1 });
    let godamData = await godamRes.json();
    let file_id = godamData?.result?.video?.file_id || "";

    // 2. PUBLIC CHANNEL me bhejo
    if (CHANNEL_ID && file_id) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHANNEL_ID, video: file_id, caption: caption })
      });
    }

    // 3. CREATOR ke CHANNEL me bhejo
    if (creatorChannel && file_id && creatorChannel !== CHANNEL_ID) {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendVideo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: creatorChannel, video: file_id, caption: caption })
      });
    }

    return res.status(200).json({ ok: true, file_id: file_id, message: "Godam + Public + Channel teeno me chali gayi" });

  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
}
