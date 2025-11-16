import SupabaseAnalytics from '../lib/supabase-analytics.js';

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    try {
      console.log('Initializing Supabase database for analytics...');
      
      const success = await SupabaseAnalytics.initializeDatabase();
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Analytics database initialized successfully',
          timestamp: new Date().toISOString(),
          supabase_connected: SupabaseAnalytics.isConnected()
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to initialize analytics database',
          timestamp: new Date().toISOString(),
          supabase_connected: SupabaseAnalytics.isConnected()
        });
      }
    } catch (error) {
      console.error('Database initialization error:', error);
      res.status(500).json({
        success: false,
        message: 'Database initialization failed',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  } else if (req.method === 'GET') {
    // Check initialization status
    res.status(200).json({
      status: 'Analytics Database Setup',
      supabase_connected: SupabaseAnalytics.isConnected(),
      timestamp: new Date().toISOString(),
      instructions: {
        setup: 'POST to this endpoint to initialize the database',
        environment_vars_needed: [
          'SUPABASE_URL - Your Supabase project URL',
          'SUPABASE_ANON_KEY - Your Supabase anonymous key'
        ]
      }
    });
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'OPTIONS']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}