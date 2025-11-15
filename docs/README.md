# TestGenie Analytics Dashboard

This directory contains the GitHub Pages hosted analytics dashboard for TestGenie CLI.

## Dashboard Features

- **📊 Real-time Usage Analytics** - Live tracking of installations and command usage
- **🌍 Global User Insights** - Platform distribution and geographic usage patterns  
- **📈 Trend Analysis** - Installation trends over time with interactive charts
- **🕒 Recent Activity** - Real-time activity feed of recent user actions
- **📱 Responsive Design** - Works on desktop, tablet, and mobile devices

## How It Works

The analytics dashboard uses GitHub Issues as a database:

1. **Data Collection**: The TestGenie CLI creates GitHub issues with analytics data
2. **Data Processing**: The dashboard reads these issues via GitHub API
3. **Visualization**: Chart.js provides interactive charts and graphs
4. **Real-time Updates**: Dashboard auto-refreshes every 5 minutes

## Analytics Data Structure

Each analytics event creates a GitHub issue with labels:
- `analytics` - Main analytics data label
- `install` - Installation tracking
- `command` - Command usage tracking
- `error` - Error tracking

## Privacy & Security

- **No Personal Data**: Only anonymous system information is collected
- **GitHub Hosted**: All data stays within GitHub ecosystem
- **Open Source**: Analytics code is transparent and auditable
- **User Control**: Users can opt-out of analytics collection

## Dashboard URL

🌐 **Live Dashboard**: https://sjuberrafik-clgx.github.io/testgenie

## Files

- `index.html` - Main dashboard with charts and analytics
- `README.md` - This documentation file

## Setup

GitHub Pages is configured to serve from the `/docs` folder on the main branch.