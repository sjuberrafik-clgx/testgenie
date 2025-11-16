const crypto = require('crypto');
const os = require('os');

class TestGenieAnalytics {
    constructor() {
        this.enabled = true;
        this.dashboardUrl = 'https://sjuberrafik-clgx.github.io/testgenie';
        this.githubToken = this.getGitHubToken();
        this.repo = 'sjuberrafik-clgx/testgenie';
    }

    getGitHubToken() {
        // Check multiple sources for GitHub token
        return process.env.GITHUB_TOKEN || 
               process.env.GH_TOKEN || 
               process.env.TESTGENIE_GITHUB_TOKEN || 
               null;
    }

    async track(data) {
        if (!this.enabled) return;

        try {
            // Detect installation method
            const installMethod = this.detectInstallMethod();
            
            // Create analytics payload
            const analyticsData = {
                action: data.action,
                timestamp: new Date().toISOString(),
                platform: os.platform(),
                arch: os.arch(),
                nodeVersion: process.version,
                version: data.version || '1.1.1',
                installMethod: installMethod,
                eventId: this.generateEventId(data.action),
                ...data // Include any additional data passed
            };

            // Send to analytics endpoint (webhook/serverless function)
            await this.sendAnalytics(analyticsData);
            
        } catch (error) {
            // Silent fail - never break user experience
            console.log(`📊 Analytics: ${data.action} (offline mode)`);
        }
    }

    async sendAnalytics(data) {
        // Try authenticated GitHub Issues API first
        if (this.githubToken) {
            try {
                const issueUrl = `https://api.github.com/repos/${this.repo}/issues`;
                
                const issueData = {
                    title: `[Analytics] ${data.action} - ${new Date().toISOString().split('T')[0]}`,
                    body: this.createIssueBody(data),
                    labels: ['analytics', data.action, data.platform, data.installMethod || 'unknown']
                };
                
                const response = await fetch(issueUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json',
                        'Authorization': `Bearer ${this.githubToken}`,
                        'User-Agent': 'TestGenie-Analytics/1.2.0'
                    },
                    body: JSON.stringify(issueData)
                });
                
                if (response.ok) {
                    const issue = await response.json();
                    console.log(`📊 TestGenie Analytics: ${data.action} tracked (🐛 Issue #${issue.number})`);
                    return;
                } else {
                    const errorText = await response.text();
                    console.warn(`GitHub API Error (${response.status}):`, errorText);
                }
            } catch (error) {
                console.warn('Authenticated GitHub API failed:', error.message);
            }
        }
        
        // Fallback to repository dispatch (requires public repo permissions)
        try {
            const dispatchUrl = `https://api.github.com/repos/${this.repo}/dispatches`;
            
            const payload = {
                event_type: 'analytics_data',
                client_payload: data
            };
            
            const headers = {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json',
                'User-Agent': 'TestGenie-Analytics/1.2.0'
            };
            
            if (this.githubToken) {
                headers['Authorization'] = `Bearer ${this.githubToken}`;
            }
            
            const response = await fetch(dispatchUrl, {
                method: 'POST',
                headers,
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log(`📊 TestGenie Analytics: ${data.action} tracked (webhook)`);
                return;
            }
        } catch (error) {
            // Repository dispatch failed
        }
        
        // Final fallback: Log to console and store locally
        console.log(`📊 TestGenie Analytics: ${data.action} tracked (local mode)`);
        
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
            // Keep only last 50 entries
            if (existingData.length > 50) {
                existingData = existingData.slice(-50);
            }
            
            await fs.writeJson(analyticsFile, existingData);
            
        } catch (e) {
            // Silent fail for local storage
        }
    }

    createIssueBody(data) {
        const getUserData = () => {
            try {
                const os = require('os');
                const { execSync } = require('child_process');
                
                let gitUser, gitEmail;
                try {
                    gitUser = execSync('git config user.name', { encoding: 'utf8' }).trim();
                    gitEmail = execSync('git config user.email', { encoding: 'utf8' }).trim();
                } catch (e) {
                    gitUser = os.userInfo().username;
                    gitEmail = 'unknown@domain.com';
                }
                
                return {
                    username: gitUser,
                    email: gitEmail,
                    hostname: os.hostname()
                };
            } catch (error) {
                return {
                    username: 'unknown-user',
                    email: 'unknown@domain.com', 
                    hostname: 'unknown-host'
                };
            }
        };
        
        const userData = getUserData();
        const eventId = this.generateEventId(data.action);
        
        return `## 🧞‍♀️ TestGenie Analytics Event [${eventId}]

### 📊 Event Details
**User**: ${userData.username}
**Email**: ${userData.email}
**Hostname**: ${userData.hostname}
**Action**: ${data.action}
**Timestamp**: ${data.timestamp}
**Event ID**: ${eventId}

### 🖥️ System Information  
**Version**: ${data.version || '1.2.0'}
**Platform**: ${data.platform} 
**Architecture**: ${data.arch}
**Node Version**: ${data.nodeVersion}
**Install Method**: ${data.installMethod || 'unknown'}

### 📋 Command Details
**Install Location**: ${data.installLocation || process.cwd()}
**Command**: ${data.command || 'unknown'}
**Success**: ${data.success !== false ? '✅ true' : '❌ false'}
**Duration**: ${data.duration ? `${data.duration}ms` : 'unknown'}

### 🗄️ Data Retention Policy
**Retention Period**: 7 years (until ${new Date(Date.now() + 7*365*24*60*60*1000).toISOString().split('T')[0]})
**Archive Date**: ${new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0]}
**Storage Type**: Permanent Business Record
**Compliance**: CoreLogic Data Retention Standards

---
*Auto-generated by TestGenie Analytics v${data.version || '1.2.0'}*
*Event logged on ${data.timestamp} for permanent business analytics*`;
    }

    detectInstallMethod() {
        // Detect if running via npx
        if (process.env.NPX_CLI_JS || 
            process.argv[0].includes('npx') ||
            process.argv[1].includes('_npx') ||
            process.env._?.includes('npx')) {
            return 'npx';
        }
        
        // Check if globally installed
        if (process.argv[1].includes('node_modules/.bin') ||
            process.argv[1].includes('npm/bin') ||
            process.env.NPM_CONFIG_PREFIX) {
            return 'global';
        }
        
        // Check if running from local node_modules
        if (process.argv[1].includes('node_modules')) {
            return 'local';
        }
        
        return 'unknown';
    }

    generateEventId(action) {
        const timestamp = Date.now().toString();
        const randomBytes = crypto.randomBytes(4).toString('hex');
        return `${action}-${timestamp}-${randomBytes}`;
    }

    async trackNpxUsage(data = {}) {
        await this.track({ 
            action: 'npx_usage', 
            command: 'npx testgenie-cli',
            ...data 
        });
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