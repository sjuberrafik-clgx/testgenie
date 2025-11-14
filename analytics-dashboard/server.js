const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const http = require('http');
const socketIo = require('socket.io');
const moment = require('moment');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.static('public'));

// Database setup
const db = new sqlite3.Database('analytics.db');

// Initialize database tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS analytics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event TEXT NOT NULL,
    timestamp DATETIME NOT NULL,
    sessionId TEXT NOT NULL,
    username TEXT,
    hostname TEXT,
    userEmail TEXT,
    domain TEXT,
    version TEXT,
    nodeVersion TEXT,
    platform TEXT,
    arch TEXT,
    machineId TEXT,
    installLocation TEXT,
    eventData TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// API Routes

// Collect analytics data
app.post('/api/usage', (req, res) => {
  try {
    const { event, timestamp, sessionId, userInfo, data } = req.body;
    
    const stmt = db.prepare(`INSERT INTO analytics (
      event, timestamp, sessionId, username, hostname, userEmail, domain,
      version, nodeVersion, platform, arch, machineId, installLocation, eventData
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    
    stmt.run(
      event,
      timestamp,
      sessionId,
      userInfo.username,
      userInfo.hostname,
      userInfo.userEmail,
      userInfo.domain,
      data.version,
      data.nodeVersion,
      data.platform,
      data.arch,
      data.machineId,
      data.installLocation,
      JSON.stringify(data)
    );
    
    stmt.finalize();
    
    // Emit real-time update to dashboard
    io.emit('newEvent', {
      event,
      timestamp,
      username: userInfo.username,
      hostname: userInfo.hostname,
      userEmail: userInfo.userEmail
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to record analytics' });
  }
});

// Get dashboard statistics
app.get('/api/stats', (req, res) => {
  const stats = {};
  
  // Total installations
  db.get("SELECT COUNT(*) as count FROM analytics WHERE event = 'install_success'", (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    stats.totalInstalls = row.count;
    
    // Unique users
    db.get("SELECT COUNT(DISTINCT username) as count FROM analytics", (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      stats.uniqueUsers = row.count;
      
      // Success rate
      db.get(`
        SELECT 
          (SELECT COUNT(*) FROM analytics WHERE event = 'install_success') * 100.0 / 
          (SELECT COUNT(*) FROM analytics WHERE event IN ('install_success', 'install_error')) as rate
      `, (err, row) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        stats.successRate = Math.round(row.rate || 0);
        
        // Recent activity (last 24 hours)
        db.all(`
          SELECT event, COUNT(*) as count 
          FROM analytics 
          WHERE datetime(timestamp) > datetime('now', '-1 day')
          GROUP BY event
        `, (err, rows) => {
          if (err) {
            return res.status(500).json({ error: err.message });
          }
          stats.recentActivity = rows;
          
          res.json(stats);
        });
      });
    });
  });
});

// Get recent installations
app.get('/api/recent', (req, res) => {
  db.all(`
    SELECT 
      username, hostname, userEmail, timestamp, event, platform, version
    FROM analytics 
    WHERE event IN ('install_success', 'install_start')
    ORDER BY datetime(timestamp) DESC 
    LIMIT 50
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get usage over time
app.get('/api/usage-over-time', (req, res) => {
  db.all(`
    SELECT 
      DATE(timestamp) as date,
      COUNT(*) as installations
    FROM analytics 
    WHERE event = 'install_success'
    AND datetime(timestamp) > datetime('now', '-30 days')
    GROUP BY DATE(timestamp)
    ORDER BY date
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Get user breakdown
app.get('/api/users', (req, res) => {
  db.all(`
    SELECT 
      username,
      userEmail,
      hostname,
      MAX(timestamp) as lastSeen,
      COUNT(*) as totalEvents,
      COUNT(CASE WHEN event = 'install_success' THEN 1 END) as successfulInstalls
    FROM analytics 
    GROUP BY username, hostname
    ORDER BY lastSeen DESC
  `, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('Dashboard connected');
  
  socket.on('disconnect', () => {
    console.log('Dashboard disconnected');
  });
});

// Serve dashboard
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0'; // Listen on all network interfaces

server.listen(PORT, HOST, () => {
  const networkInterfaces = require('os').networkInterfaces();
  let localIP = 'localhost';
  
  // Find and display your network IP
  for (const interfaceName in networkInterfaces) {
    const interfaces = networkInterfaces[interfaceName];
    for (const iface of interfaces) {
      if (iface.family === 'IPv4' && !iface.internal) {
        localIP = iface.address;
        break;
      }
    }
  }
  
  console.log(`🚀 TestGenie Analytics Dashboard running on:`);
  console.log(`   📊 Local access: http://localhost:${PORT}`);
  console.log(`   🌐 Network access: http://${localIP}:${PORT}`);
  console.log(`   � Database: ${path.join(__dirname, 'analytics.db')}`);
  console.log(`\n� Users across your organization can now send analytics to:`);
  console.log(`   http://${localIP}:${PORT}/api/usage`);
  console.log(`\n� Ready to collect data from anyone who runs: npx testgenie-cli install\n`);
});