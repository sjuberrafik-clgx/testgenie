# TestGenie Analytics Dashboard

Real-time dashboard for monitoring TestGenie CLI usage with user information.

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
cd analytics-dashboard
npm install
```

### 2. Start the Dashboard Server
```bash
npm start
```

### 3. Access Dashboard
Open your browser and navigate to: http://localhost:3000

## 📊 Dashboard Features

### Real-time Analytics
- **Live Updates** - See new installations as they happen
- **User Tracking** - Monitor who is using TestGenie
- **Success Rates** - Track installation success/failure rates
- **Usage Trends** - View usage patterns over time

### Data Collected
- ✅ Username (`process.env.USERNAME`)
- ✅ Machine Name (`os.hostname()`)
- ✅ Git Email (`git config user.email`)
- ✅ Installation timestamps
- ✅ Command usage patterns
- ✅ System information (OS, Node.js version)

## 🖥️ Dashboard Sections

### 1. Statistics Cards
- Total installations
- Unique users
- Success rate percentage
- Active users today

### 2. Usage Over Time Chart
- Daily installation trends
- 30-day historical view
- Line chart visualization

### 3. Recent Activity Chart
- Command distribution
- Event type breakdown
- Doughnut chart format

### 4. User Activity Table
- Real-time user list
- Last seen timestamps
- Installation counts
- Online/offline status indicators

## 🔧 Configuration

### Database
- **SQLite** database (`analytics.db`)
- Automatic table creation
- Persistent storage

### Server Settings
```javascript
const PORT = process.env.PORT || 3000;
```

### Client Configuration
Update the analytics endpoint in `lib/analytics.js`:
```javascript
this.endpoint = 'http://your-server.com:3000/api/usage';
```

## 🌐 Deployment Options

### Option 1: Free Hosting (Railway)
```bash
# 1. Sign up at railway.app
# 2. Connect your GitHub repo
# 3. Deploy automatically
# 4. Get your deployment URL
```

### Option 2: Local Network Server
```bash
# Run on internal server
npm start
# Access from any machine: http://server-ip:3000
```

### Option 3: Cloud Hosting (Heroku)
```bash
# 1. Create Heroku app
heroku create testgenie-analytics

# 2. Deploy
git push heroku main

# 3. Open dashboard
heroku open
```

## 📈 API Endpoints

### POST /api/usage
Collect analytics data from CLI
```json
{
  "event": "install_success",
  "timestamp": "2025-11-15T12:00:00Z",
  "sessionId": "abc123",
  "userInfo": {
    "username": "john.doe",
    "hostname": "DESKTOP-ABC123",
    "userEmail": "john.doe@company.com"
  },
  "data": { ... }
}
```

### GET /api/stats
Get dashboard statistics
```json
{
  "totalInstalls": 145,
  "uniqueUsers": 23,
  "successRate": 96,
  "recentActivity": [...]
}
```

### GET /api/users
Get user activity data
```json
[
  {
    "username": "john.doe",
    "userEmail": "john.doe@company.com",
    "hostname": "DESKTOP-ABC123",
    "lastSeen": "2025-11-15T12:00:00Z",
    "totalEvents": 5,
    "successfulInstalls": 3
  }
]
```

## 🔒 Security Notes

### Internal Use Only
- This dashboard is designed for internal CoreLogic use
- Contains personal information (usernames, emails)
- Should be deployed on internal networks only

### Access Control (Optional)
Add basic authentication:
```javascript
app.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (auth === 'Bearer YOUR_SECRET_TOKEN') {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
});
```

## 📱 Mobile Responsive

The dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🛠️ Troubleshooting

### Database Issues
```bash
# Reset database
rm analytics.db
# Restart server - tables will be recreated
```

### Connection Issues
```bash
# Check if server is running
curl http://localhost:3000/api/stats

# Check logs
npm start
```

### Real-time Updates Not Working
- Ensure WebSocket connections are allowed
- Check firewall settings
- Verify Socket.io is working

## 📊 Sample Dashboard Data

After some usage, your dashboard will show:

**Statistics**
- Total Installations: 145
- Unique Users: 23  
- Success Rate: 96%
- Active Today: 12

**Recent Users**
- john.doe@corelogic.com (DESKTOP-ABC123) - 2 minutes ago
- jane.smith@corelogic.com (LAPTOP-XYZ789) - 15 minutes ago
- mike.jones@corelogic.com (DEV-MACHINE-01) - 1 hour ago

This gives you complete visibility into who is using TestGenie and how it's performing!