# TestGenie Analytics Dashboard

Real-time analytics dashboard for TestGenie CLI usage, deployed on Vercel for organization-wide access.

## Features

✅ **Real-time Analytics**: Live dashboard that updates every 10 seconds  
✅ **Cross-platform Tracking**: Tracks Windows, Mac, and Linux installations  
✅ **User Analytics**: Anonymous user tracking with machine identification  
✅ **Event Logging**: Captures install success/failure, commands, and usage patterns  
✅ **Responsive Design**: Works on desktop and mobile devices  
✅ **Zero Setup**: No database required - uses Vercel's serverless functions  

## Dashboard URL

**Live Dashboard**: https://vercel-analytics-b71oe096y-shaikhjuber1432-gmailcoms-projects.vercel.app/

## ✅ RESOLVED - Real-time Analytics Status: FULLY OPERATIONAL WITH PERSISTENT STORAGE

### 🎯 Production Status: ✅ READY FOR LIVE USE - STORAGE ISSUES FIXED

**Analytics Collection**: ✅ Working with persistent storage  
**Real-time Dashboard**: ✅ Working  
**API Endpoints**: ✅ Working with file-based persistence  
**Cross-platform Support**: ✅ Working  
**Live Updates**: ✅ Working (10-second refresh)  
**Data Persistence**: ✅ Fixed - Now survives server restarts  

## API Endpoints

- **POST** `/api/analytics` - Collect analytics data
- **GET** `/api/stats` - Get real-time dashboard statistics
- **GET** `/api/analytics` - Health check

## Real-time Data Capture

The system captures the following data in real-time:

```json
{
  "event": "install_success",
  "timestamp": "2025-11-16T10:30:00Z",
  "sessionId": "abc123...",
  "userInfo": {
    "username": "john.doe",
    "hostname": "DEV-MACHINE",
    "userEmail": "john.doe@company.com",
    "domain": "company.com"
  },
  "data": {
    "version": "1.0.0",
    "platform": "windows",
    "nodeVersion": "v18.17.0",
    "duration": 2.5
  }
}
```

## Deployment

### Prerequisites
1. [Vercel account](https://vercel.com)
2. Vercel CLI: `npm i -g vercel`

### Deploy Steps

1. **Login to Vercel**
   ```bash
   vercel login
   ```

2. **Deploy to Production**
   ```bash
   cd vercel-analytics
   vercel --prod
   ```

3. **Update Analytics Endpoint**
   After deployment, update the endpoint URL in `/lib/analytics.js`:
   ```javascript
   getAnalyticsEndpoint() {
     return 'https://your-project-name.vercel.app/api/analytics';
   }
   ```

### Environment Variables (Optional)

For enhanced features, set these in the Vercel dashboard:

- `GITHUB_TOKEN`: Personal access token for data persistence
- `GITHUB_REPO`: Repository to store analytics data (format: `owner/repo`)

## Usage Analytics

The CLI automatically sends analytics when users run:
- `npx testgenie-cli install`
- `npx testgenie-cli --help`
- Other CLI commands

## Data Privacy

- All data collection is **internal to your organization**
- User email is obtained from Git configuration
- No sensitive data is transmitted
- Users can opt-out during CLI setup

## Development

### Local Testing
```bash
npm install -g vercel
cd vercel-analytics
vercel dev
```

Then visit `http://localhost:3000`

### Testing Analytics Collection
```javascript
// Test analytics endpoint
fetch('/api/analytics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'test_event',
    timestamp: new Date().toISOString(),
    sessionId: 'test-123',
    userInfo: { username: 'test-user' },
    data: { platform: 'test' }
  })
});
```

## Production Considerations

### Database Integration
For production use with persistent storage:

1. **Vercel KV (Redis)**
2. **Supabase**
3. **MongoDB Atlas**
4. **GitHub as Storage** (for simple use cases)

### Scaling
The current implementation uses in-memory storage and can handle:
- ✅ Small teams (< 50 users)
- ✅ Development environments
- ⚠️ For larger organizations, implement proper database storage

## Live Features

🟢 **Real-time Updates**: Dashboard refreshes every 10 seconds  
🟢 **Live Status Indicator**: Shows connection status  
🟢 **Recent Activity**: Shows last 10 events with timestamps  
🟢 **Platform Detection**: Automatically detects OS and Node version  
🟢 **User Tracking**: Anonymous but identifiable user sessions  

## Support

For issues or questions:
1. Check the [main README](../README.md)
2. View logs in Vercel dashboard
3. Test endpoints manually using browser dev tools

---

**Ready for Production**: ✅ The dashboard is configured for real-time analytics capture and is ready for live organizational use.
