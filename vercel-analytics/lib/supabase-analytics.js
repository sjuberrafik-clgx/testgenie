import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// These should be set as environment variables in Vercel dashboard
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

let supabase = null;

// Initialize Supabase client
if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

class SupabaseAnalytics {
  static isConnected() {
    return supabase !== null;
  }

  static async createTable() {
    if (!supabase) return false;

    try {
      // Create analytics table if it doesn't exist
      const { error } = await supabase.rpc('create_analytics_table', {});
      
      if (error && !error.message.includes('already exists')) {
        console.error('Error creating table:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error creating analytics table:', error);
      return false;
    }
  }

  static async addEvent(eventData) {
    if (!supabase) {
      console.warn('Supabase not configured, falling back to memory storage');
      return false;
    }

    try {
      // Try to insert data - this will auto-create the table if it doesn't exist
      const { data, error } = await supabase
        .from('analytics_events')
        .insert([{
          event: eventData.event,
          timestamp: eventData.timestamp,
          session_id: eventData.sessionId,
          username: eventData.userInfo?.username,
          hostname: eventData.userInfo?.hostname,
          user_email: eventData.userInfo?.userEmail,
          domain: eventData.userInfo?.domain,
          version: eventData.data?.version,
          platform: eventData.data?.platform,
          node_version: eventData.data?.nodeVersion,
          arch: eventData.data?.arch,
          install_location: eventData.data?.installLocation,
          event_data: JSON.stringify(eventData.data),
          created_at: new Date().toISOString()
        }])
        .select();

      if (error) {
        // If table doesn't exist, create it first
        if (error.message.includes('does not exist') || error.message.includes('relation') || error.code === '42P01') {
          console.log('Table does not exist, attempting to create it...');
          await this.createTableDirectly();
          
          // Retry the insert
          const retryResult = await supabase
            .from('analytics_events')
            .insert([{
              event: eventData.event,
              timestamp: eventData.timestamp,
              session_id: eventData.sessionId,
              username: eventData.userInfo?.username,
              hostname: eventData.userInfo?.hostname,
              user_email: eventData.userInfo?.userEmail,
              domain: eventData.userInfo?.domain,
              version: eventData.data?.version,
              platform: eventData.data?.platform,
              node_version: eventData.data?.nodeVersion,
              arch: eventData.data?.arch,
              install_location: eventData.data?.installLocation,
              event_data: JSON.stringify(eventData.data),
              created_at: new Date().toISOString()
            }])
            .select();
            
          if (retryResult.error) {
            console.error('Supabase insert retry error:', retryResult.error);
            return false;
          }
        } else {
          console.error('Supabase insert error:', error);
          return false;
        }
      }

      console.log('Analytics event stored in Supabase successfully');
      return true;
    } catch (error) {
      console.error('Error storing analytics in Supabase:', error);
      return false;
    }
  }

  static async getStats(limit = 10, offset = 0) {
    if (!supabase) {
      return this.getDemoStats();
    }

    try {
      // Get total events
      const { count: totalEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true });

      // Get today's events
      const today = new Date().toISOString().split('T')[0];
      const { count: todayEvents } = await supabase
        .from('analytics_events')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', `${today}T00:00:00.000Z`)
        .lt('created_at', `${today}T23:59:59.999Z`);

      // Get unique users
      const { data: uniqueUserData } = await supabase
        .from('analytics_events')
        .select('username')
        .not('username', 'is', null);

      const uniqueUsers = new Set(uniqueUserData?.map(row => row.username) || []).size;

      // Get platforms
      const { data: platformData } = await supabase
        .from('analytics_events')
        .select('platform')
        .not('platform', 'is', null);

      const platforms = Array.from(new Set(platformData?.map(row => row.platform) || []));

      // Get recent events with pagination
      const { data: recentEventsData } = await supabase
        .from('analytics_events')
        .select('event, username, timestamp, platform, hostname, user_email, domain, version, node_version, arch, install_location, session_id, event_data, created_at')
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      const recentEvents = recentEventsData?.map(event => ({
        event: event.event,
        username: event.username || 'Unknown',
        timestamp: event.timestamp,
        platform: event.platform || 'Unknown',
        hostname: event.hostname || 'Unknown',
        userEmail: event.user_email || 'Unknown',
        domain: event.domain || 'Unknown',
        version: event.version || 'Unknown',
        nodeVersion: event.node_version || 'Unknown',
        arch: event.arch || 'Unknown',
        installLocation: event.install_location || 'Unknown',
        sessionId: event.session_id || 'Unknown',
        eventData: event.event_data ? JSON.parse(event.event_data) : {},
        createdAt: event.created_at
      })) || [];

      return {
        totalEvents: totalEvents || 0,
        todayEvents: todayEvents || 0,
        uniqueUsers,
        platforms,
        recentEvents,
        lastUpdated: new Date().toISOString(),
        isLive: true,
        dataSource: 'supabase'
      };
    } catch (error) {
      console.error('Error fetching stats from Supabase:', error);
      return this.getDemoStats();
    }
  }

  static getDemoStats() {
    return {
      totalEvents: 0,
      todayEvents: 0,
      uniqueUsers: 0,
      platforms: [],
      recentEvents: [{
        event: 'system_status',
        username: 'system',
        timestamp: new Date().toISOString(),
        platform: 'dashboard'
      }],
      lastUpdated: new Date().toISOString(),
      isLive: true,
      dataSource: 'demo',
      message: 'Supabase not configured. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.'
    };
  }

  static async createTableDirectly() {
    if (!supabase) return false;

    try {
      // Create the table using a simple SQL command
      const { error } = await supabase.rpc('create_analytics_table_sql', {
        sql_query: `
          CREATE TABLE IF NOT EXISTS analytics_events (
            id BIGSERIAL PRIMARY KEY,
            event TEXT NOT NULL,
            timestamp TIMESTAMPTZ NOT NULL,
            session_id TEXT NOT NULL,
            username TEXT,
            hostname TEXT,
            user_email TEXT,
            domain TEXT,
            version TEXT,
            platform TEXT,
            node_version TEXT,
            arch TEXT,
            install_location TEXT,
            event_data JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW()
          );
          
          CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
          CREATE INDEX IF NOT EXISTS idx_analytics_events_event ON analytics_events(event);
          CREATE INDEX IF NOT EXISTS idx_analytics_events_username ON analytics_events(username);
        `
      });

      if (error) {
        console.error('Error creating table with RPC:', error);
        return false;
      }

      console.log('Analytics table created successfully');
      return true;
    } catch (error) {
      console.error('Error in createTableDirectly:', error);
      return false;
    }
  }
}

export default SupabaseAnalytics;