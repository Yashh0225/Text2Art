export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    const response = await fetch('https://clipdrop-api.co/text-to-image/v1', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY, // will come from Vercel env var
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    const blob = await response.blob();
    const buffer = await blob.arrayBuffer();

    res.setHeader('Content-Type', 'image/png');
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error("API error", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}
