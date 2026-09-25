export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const BUNNY_KEY = process.env.BUNNY_API_KEY;
  const LIBRARY_ID = '760230'; // आपका Godam ID

  // Step 1: Bunny पर video entry बनाओ
  const createRes = await fetch(`https://video.bunnycdn.com/library/${LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: {
      'AccessKey': BUNNY_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ title: req.body.title || 'BharatFlix Video' })
  });
  
  const videoData = await createRes.json();
  if(!createRes.ok) return res.status(401).json(videoData);

  return res.json({ videoId: videoData.guid, libraryId: LIBRARY_ID });
}
