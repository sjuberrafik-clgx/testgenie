// Shared data endpoint that both analytics and stats can use
// This creates a common data store accessible across function invocations

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Return stored analytics data
    const data = global.analyticsData || [];
    res.status(200).json({
      success: true,
      data: data,
      count: data.length,
      timestamp: new Date().toISOString()
    });
  } else if (req.method === 'POST') {
    // Add analytics data (called from analytics endpoint)
    const { events } = req.body;
    
    if (!global.analyticsData) {
      global.analyticsData = [];
    }
    
    if (Array.isArray(events)) {
      global.analyticsData.push(...events);
      // Keep only last 1000 events
      if (global.analyticsData.length > 1000) {
        global.analyticsData = global.analyticsData.slice(-1000);
      }
    }
    
    res.status(200).json({
      success: true,
      count: global.analyticsData.length,
      timestamp: new Date().toISOString()
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}