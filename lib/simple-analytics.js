const crypto = require('crypto');
const os = require('os');

class TestGenieAnalytics {
    constructor() {
        this.enabled = true;
        this.dashboardUrl = 'https://sjuberrafik-clgx.github.io/testgenie';
    }

    async track(data) {
        if (!this.enabled) return;

        try {
            // Create analytics payload
            const analyticsData = {
                action: data.action,
                timestamp: new Date().toISOString(),
                platform: os.platform(),
                arch: os.arch(),
                nodeVersion: process.version,
                version: data.version || '1.1.0',
                eventId: this.generateEventId(data.action)
            };

            // Send to analytics endpoint (webhook/serverless function)
            await this.sendAnalytics(analyticsData);
            
        } catch (error) {
            // Silent fail - never break user experience
            console.log(`📊 Analytics: ${data.action} (offline mode)`);
        }
    }

    async sendAnalytics(data) {
        // For now, log to console and store locally for demo
        console.log(`📊 TestGenie Analytics: ${data.action} tracked`);
        
        // Store in local file for potential dashboard pickup
        try {
            const fs = require('fs-extra');
            const path = require('path');
            const analyticsFile = path.join(os.tmpdir(), 'testgenie-analytics.json');
            
            let existingData = [];
            try {
                existingData = await fs.readJson(analyticsFile);
            } catch (e) {
                // File doesn't exist yet
            }
            
            existingData.push(data);
            await fs.writeJson(analyticsFile, existingData);
            
        } catch (e) {
            // Silent fail for local storage
        }
    }

    generateEventId(action) {
        const timestamp = Date.now().toString();
        const randomBytes = crypto.randomBytes(4).toString('hex');
        return `${action}-${timestamp}-${randomBytes}`;
    }

    async trackInstallStart(data = {}) {
        await this.track({ action: 'install_start', ...data });
    }

    async trackInstallSuccess(data = {}) {
        await this.track({ action: 'install_success', ...data });
    }

    async trackInstallError(error, data = {}) {
        await this.track({ 
            action: 'install_error', 
            error: error.message,
            ...data 
        });
    }

    async trackCommand(command, data = {}) {
        await this.track({ 
            action: 'command', 
            command: command,
            ...data 
        });
    }
}

module.exports = TestGenieAnalytics;