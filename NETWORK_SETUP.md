# TestGenie Network Analytics Setup

## Overview
This guide helps you set up TestGenie analytics collection across your organization's network. The analytics dashboard will run on one machine and collect usage data from all users who install TestGenie CLI.

## Quick Setup

### 1. Set Up Analytics Server (Your Machine)
```bash
# Navigate to analytics dashboard
cd analytics-dashboard

# Install dependencies (if not done already)
npm install

# Start the server
npm start
```

The server will display network connection information like:
```
🚀 TestGenie Analytics Dashboard running on:
   📊 Local access: http://localhost:3001
   🌐 Network access: http://192.168.1.100:3001
   
👥 Users across your organization can now send analytics to:
   http://192.168.1.100:3001/api/usage
   
✅  CORELOGIC AVD ENVIRONMENT:
   Since everyone uses CoreLogic-provided AVD machines, this setup works perfectly!
   All AVD machines are on the same virtual network and can reach your analytics server.
   
⚠️  LIMITATION ONLY FOR NON-AVD USERS:
   Personal laptops or home machines CANNOT reach this address.
   
   If you have users outside AVD environment:
   1. Cloud deployment (Heroku, Azure, AWS) - See CLOUD_DEPLOYMENT.md
   2. Corporate IT setup (public IP + port forwarding)
   3. VPN requirement for external users
```

### 2. Share TestGenie CLI with Your Team
Users can install TestGenie CLI using:
```bash
npx testgenie-cli install
```

The CLI will automatically detect your network IP and send analytics data to your dashboard.

## Network Requirements

### Firewall Configuration
Ensure port 3001 is open for incoming connections:

**Windows Firewall:**
```powershell
New-NetFirewallRule -DisplayName "TestGenie Analytics" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

**Windows Defender:**
- Go to Windows Security → Firewall & network protection
- Click "Allow an app through firewall"
- Add Node.js or the analytics server executable

### Corporate Network Considerations
- **IT Department**: You may need to request firewall exceptions for port 3001
- **VPN Users**: The dashboard works across VPN connections
- **Remote Workers**: Analytics will work from any network location

## Dashboard Features

### Real-Time Monitoring
- **Live User Activity**: See who's using TestGenie in real-time
- **Installation Tracking**: Monitor new TestGenie installations
- **Usage Analytics**: Track which features are most popular

### Data Collection
The system automatically collects:
- **User Identity**: Username and email from git config
- **Machine Info**: Hostname and operating system
- **Usage Patterns**: Commands run and frequency
- **Timestamps**: When features are used

### Privacy & Security
- **Internal Only**: Data stays within your network
- **No External Calls**: Analytics never leave your organization
- **Secure SQLite**: Local database with no cloud dependencies

## Troubleshooting

### Common Issues

**"Connection refused" errors:**
- Check if analytics server is running
- Verify firewall settings
- Confirm network IP address is correct

**Dashboard not loading:**
- Try accessing via `http://localhost:3001` first
- Check if port 3001 is already in use
- Restart the analytics server

**No data appearing:**
- Verify users are running `npx testgenie-cli install`
- Check server logs for incoming requests
- Ensure network connectivity between machines

### Advanced Configuration

**Custom Port:**
```bash
PORT=8080 npm start
```

**Custom Host:**
```bash
HOST=192.168.1.100 npm start
```

**Environment Variables:**
```bash
# .env file in analytics-dashboard/
PORT=3001
HOST=0.0.0.0
DB_PATH=./analytics.db
```

## Production Deployment

For organization-wide deployment, consider:

1. **Dedicated Server**: Run analytics on a always-on machine
2. **Docker Container**: Use provided Dockerfile for containerized deployment
3. **Cloud Hosting**: Deploy to internal cloud infrastructure
4. **Load Balancing**: For high-usage environments

### Docker Deployment
```bash
# Build container
docker build -t testgenie-analytics .

# Run container
docker run -p 3001:3001 -v $(pwd)/data:/app/data testgenie-analytics
```

## Support

For technical support or feature requests:
- **Internal Slack**: #testgenie-support
- **Email**: your-team@corelogic.com
- **Documentation**: Check README.md for additional details

---

**Next Steps:**
1. Start your analytics dashboard
2. Share TestGenie CLI with your team
3. Monitor real-time usage data
4. Track adoption and popular features