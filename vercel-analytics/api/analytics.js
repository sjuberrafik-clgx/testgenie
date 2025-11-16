import SupabaseAnalytics from '../lib/supabase-analytics.js';

// Fallback storage for when Supabase is not available
global.analyticsData = global.analyticsData || [];

export default async function handler(req, res) {
  // Set CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      const { event, timestamp, sessionId, userInfo, data } = req.body;
      
      // Validate required fields
      if (!event || !timestamp || !sessionId) {
        return res.status(400).json({ 
          error: 'Missing required fields: event, timestamp, sessionId' 
        });
      }
      
      // Store analytics data in Supabase first, fallback to memory
      const analyticsData = {
        event,
        timestamp,
        sessionId,
        userInfo: userInfo || {},
        data: data || {}
      };

      // Try Supabase first
      const supabaseSuccess = await SupabaseAnalytics.addEvent(analyticsData);
      
      if (!supabaseSuccess) {
        // Fallback to memory storage
        const memoryData = {
          id: Date.now() + Math.random(),
          ...analyticsData,
          received_at: new Date().toISOString()
        };

        global.analyticsData.push(memoryData);
        
        // Keep only last 1000 events to prevent memory issues
        if (global.analyticsData.length > 1000) {
          global.analyticsData = global.analyticsData.slice(-1000);
        }
      }

      console.log('Analytics received and stored:', {
        event,
        username: userInfo?.username,
        platform: data?.platform,
        timestamp,
        storage: supabaseSuccess ? 'supabase' : 'memory',
        totalStored: supabaseSuccess ? 'db' : global.analyticsData.length
      });

      // Store in external service if configured
      if (process.env.GITHUB_TOKEN && process.env.GITHUB_REPO) {
        try {
          // You could implement GitHub storage here for persistence
          console.log('GitHub storage available but not implemented in this example');
        } catch (githubError) {
          console.warn('GitHub storage failed:', githubError.message);
        }
      }

      res.status(200).json({ 
        success: true, 
        message: 'Analytics recorded',
        timestamp: new Date().toISOString(),
        storage: supabaseSuccess ? 'supabase' : 'memory',
        supabase_available: SupabaseAnalytics.isConnected()
      });
    } catch (error) {
      console.error('Analytics error:', error);
      res.status(500).json({ 
        error: 'Failed to process analytics',
        message: error.message 
      });
    }
  } else if (req.method === 'GET') {
    // Health check endpoint
    res.status(200).json({ 
      status: 'ok', 
      service: 'TestGenie Analytics API',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      supabase_connected: SupabaseAnalytics.isConnected(),
      fallback_events: global.analyticsData ? global.analyticsData.length : 0
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
