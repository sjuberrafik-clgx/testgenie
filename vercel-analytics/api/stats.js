import SupabaseAnalytics from '../lib/supabase-analytics.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      // Get pagination parameters
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Get stats from Supabase (includes pagination)
      const stats = await SupabaseAnalytics.getStats(limit, offset);
      
      // Add pagination info
      stats.pagination = {
        currentPage: page,
        itemsPerPage: limit,
        hasNextPage: stats.recentEvents.length === limit,
        hasPrevPage: page > 1
      };
      
      res.status(200).json(stats);
    } catch (error) {
      console.error('Stats error:', error);
      res.status(500).json({ 
        error: 'Failed to get stats',
        message: error.message 
      });
    }
  } else {
    res.setHeader('Allow', ['GET', 'OPTIONS']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}