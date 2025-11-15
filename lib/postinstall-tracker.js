#!/usr/bin/env node

// PostInstall Analytics Tracker for TestGenie CLI
// Tracks npm installations to GitHub Issues analytics

const GitHubAnalytics = require('./simple-analytics');

async function trackNpmInstall() {
    try {
        const analytics = new GitHubAnalytics();
        
        // Get installation context
        const installData = {
            action: 'npm_install',
            command: 'npm install -g testgenie-cli',
            version: require('../package.json').version,
            installLocation: process.cwd(),
            installMethod: 'npm',
            success: true,
            timestamp: new Date().toISOString()
        };

        // Track the npm installation
        await analytics.track(installData);
        
    } catch (error) {
        // Fail silently to not interrupt npm install process
        // console.log('📊 TestGenie analytics: offline mode');
    }
}

// Only run if this is a global npm install (not dev dependency)
if (process.env.npm_config_global === 'true' || 
    process.env.NPM_CONFIG_PREFIX || 
    process.argv.includes('-g') || 
    process.argv.includes('--global')) {
    trackNpmInstall();
}