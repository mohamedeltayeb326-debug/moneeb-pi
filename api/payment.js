export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { action, paymentId, txid } = req.body;
  const apiKey = process.env.PI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'PI_API_KEY is missing on server' });
  }

  try {
    let url = '';
    let bodyData = null;

    if (action === 'approve') {
      url = `https://api.minepi.com/v2/payments/${paymentId}/approve`;
    } else if (action === 'complete') {
      url = `https://api.minepi.com/v2/payments/${paymentId}/complete`;
      bodyData = JSON.stringify({ txid });
    } else {
      return res.status(400).json({ error: 'Invalid action' });
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      ...(bodyData && { body: bodyData })
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
