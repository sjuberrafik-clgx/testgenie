export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  if (!data || !data.action) {
    return res.status(400).json({ error: 'Missing required field: action' });
  }

  const githubToken = process.env.GITHUB_TOKEN;
  const githubRepo = process.env.GITHUB_REPO || 'sjuberrafik-clgx/testgenie';

  if (!githubToken) {
    return res.status(500).json({ error: 'GitHub token not configured' });
  }

  try {
    const dispatchResponse = await fetch(
      `https://api.github.com/repos/${githubRepo}/dispatches`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${githubToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'TestGenie-Analytics/1.0'
        },
        body: JSON.stringify({
          event_type: 'testgenie_analytics',
          client_payload: data
        })
      }
    );

    if (dispatchResponse.ok) {
      return res.status(200).json({ 
        success: true,
        message: 'Analytics tracked',
        action: data.action
      });
    } else {
      const errorText = await dispatchResponse.text();
      return res.status(500).json({ error: 'GitHub API error', details: errorText });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
