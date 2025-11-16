// Simple file-based storage for Vercel serverless functions
// This uses the /tmp directory which persists during function execution
import fs from 'fs';
import path from 'path';

const DATA_FILE = '/tmp/analytics-data.json';

class AnalyticsStorage {
  static loadData() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    }
    return [];
  }

  static saveData(data) {
    try {
      // Keep only last 1000 events
      const limitedData = data.slice(-1000);
      fs.writeFileSync(DATA_FILE, JSON.stringify(limitedData, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving analytics data:', error);
      return false;
    }
  }

  static addEvent(eventData) {
    const data = this.loadData();
    data.push({
      ...eventData,
      id: Date.now() + Math.random(),
      received_at: new Date().toISOString()
    });
    return this.saveData(data);
  }

  static getStats() {
    const data = this.loadData();
    const today = new Date().toDateString();
    
    const todayEvents = data.filter(item => 
      new Date(item.timestamp).toDateString() === today
    ).length;

    const uniqueUsers = new Set(
      data.map(item => item.userInfo?.username).filter(Boolean)
    );

    const platforms = new Set(
      data.map(item => item.data?.platform).filter(Boolean)
    );

    const recentEvents = data
      .slice(-10)
      .reverse()
      .map(event => ({
        event: event.event,
        username: event.userInfo?.username || 'Unknown',
        timestamp: event.timestamp,
        platform: event.data?.platform || 'Unknown'
      }));

    return {
      totalEvents: data.length,
      todayEvents,
      uniqueUsers: uniqueUsers.size,
      platforms: Array.from(platforms),
      recentEvents,
      lastUpdated: new Date().toISOString(),
      isLive: true
    };
  }
}

export default AnalyticsStorage;