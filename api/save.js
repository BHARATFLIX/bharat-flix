// SAVE WALI FILE - CHOTHI FILE - CHHOTE GODAM WALI
// ISME VIDEO NAHI JAYEGI - SIRF LIKHI HUI CHEEZ JAYEGI
// TOKEN AUR CHHOTE GODAM KA NUMBER ISME NAHI HAI - VO VERSEL ME CHHUPA HUA HAI

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, msg: 'Sirf POST chalega' });
  }

  // 1. VERSEL SE CHABI MANG RAHE HAIN - CHHOTE GODAM KI CHABI
  const token = process.env.TELEGRAM_TOKEN;
  const smallChatId = process.env.TELEGRAM_SMALL_CHAT_ID;

  if (!token || !smallChatId) {
    return res.status(500).json({ ok: false, msg: 'Chhote godam ka number Versel me nahi mila' });
  }

  try {
    const data = req.body || {};

    // 2. KYA-KYA AAYA HAI - SAB ALAG ALAG
    const profileName = data.profileName || '';
    const profilePhoto = data.profilePhoto || '';
    const profileNumber = data.profileNumber || '';

    const channelName = data.channelName || '';
    const channelInfo = data.channelInfo || '';
    const attitudeChannel = data.attitudeChannel || '';
    const attitudeInfo = data.attitudeInfo || '';

    const report = data.report || '';
    const reportBy = data.reportBy || '';

    const upi = data.upi || '';
    const paisa = data.paisa || '';
    const thanksPaisa = data.thanksPaisa || '';
    const totalPaisa = data.totalPaisa || '';

    // 3. CHHOTE GODAM ME BHEJNE KE LIYE SAJANA
    const message =
      'BHARATFLIX - SAVE - CHHOTA GODAM\n\n' +
      '--- PROFILE ---\n' +
      'Naam: ' + profileName + '\n' +
      'Photo: ' + profilePhoto + '\n' +
      'Number: ' + profileNumber + '\n\n' +
      '--- CHANNEL ---\n' +
      'Channel Naam: ' + channelName + '\n' +
      'Channel Jankari: ' + channelInfo + '\n\n' +
      '--- ATTITUDE CHANNEL ---\n' +
      'Attitude Channel: ' + attitudeChannel + '\n' +
      'Attitude Jankari: ' + attitudeInfo + '\n\n' +
      '--- REPORT ---\n' +
      'Report: ' + report + '\n' +
      'Report Kisne Ki: ' + reportBy + '\n\n' +
      '--- PAISA - UPI TAK ---\n' +
      'UPI: ' + upi + '\n' +
      'Paisa: ' + paisa + '\n' +
      'Thanks Wala Paisa: ' + thanksPaisa + '\n' +
      'Total Paisa: ' + totalPaisa + '\n\n' +
      'Time: ' + new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 4. CHHOTE GODAM ME BHEJ RAHE HAIN - SIRF LIKHAI
    const telegramUrl = 'https://api.telegram.org/bot' + token + '/sendMessage';

    const tgRes = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: smallChatId,
        text: message,
      }),
    });

    const tgData = await tgRes.json();

    if (!tgData.ok) {
      return res.status(500).json({ ok: false, msg: 'Chhote godam me nahi gaya', detail: tgData });
    }

    // 5. HO GAYA - SAB CHHOTE GODAM ME CHALA GAYA
    return res.status(200).json({
      ok: true,
      where: 'chhota-godam-save-only',
      message_id: tgData.result.message_id,
    });

  } catch (err) {
    return res.status(500).json({ ok: false, msg: 'Error aa gaya', error: String(err) });
  }
}
