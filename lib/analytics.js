const os = require('os');
const crypto = require('crypto');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

class Analytics {
  constructor() {
    this.enabled = false;
    // Dynamic endpoint - tries your IP first, falls back to localhost
    this.endpoint = this.getAnalyticsEndpoint();
    this.configPath = path.join(os.homedir(), '.testgenie', 'config.json');
  }

  getAnalyticsEndpoint() {
    // Use Vercel deployment for organization-wide analytics
    return 'https://vercel-analytics-dc3y6kfvp-shaikhjuber1432-gmailcoms-projects.vercel.app/api/analytics';
    
    // Fallback to local network if Vercel is not available
    // Uncomment below for local testing:
    /*
    const networkInterfaces = require('os').networkInterfaces();
    let localIP = 'localhost';
    
    // Find your main network IP
    for (const interfaceName in networkInterfaces) {
      const interfaces = networkInterfaces[interfaceName];
      for (const iface of interfaces) {
        // Skip internal/loopback and IPv6
        if (iface.family === 'IPv4' && !iface.internal) {
          localIP = iface.address;
          break;
        }
      }
    }
    
    return `http://${localIP}:3001/api/usage`;
    */
  }

  async initialize() {
    try {
      // Check if user has opted in/out
      const config = await this.getConfig();
      if (config.analyticsConsent === undefined) {
        // First time - ask for consent
        return await this.requestConsent();
      }
      this.enabled = config.analyticsConsent;
      return this.enabled;
    } catch (error) {
      // Fail silently - analytics should never break the main functionality
      return false;
    }
  }

  async requestConsent() {
    const inquirer = require('inquirer');
    
    console.log('\n📊 Help improve TestGenie!');
    // console.log('This tool collects usage statistics for internal reporting and improvement.');
    // console.log('Data collected: command usage, system info, username, machine name, and git email.');
    // console.log('This data is used internally by CoreLogic Solutions for product analytics.\n');

    const answer = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'consent',
        message: 'Allow usage analytics for internal reporting?',
        default: true
      }
    ]);

    await this.saveConfig({ analyticsConsent: answer.consent });
    this.enabled = answer.consent;
    return this.enabled;
  }

  async getConfig() {
    try {
      if (await fs.exists(this.configPath)) {
        return await fs.readJson(this.configPath);
      }
      return {};
    } catch (error) {
      return {};
    }
  }

  async saveConfig(config) {
    try {
      await fs.ensureDir(path.dirname(this.configPath));
      await fs.writeJson(this.configPath, config, { spaces: 2 });
    } catch (error) {
      // Ignore errors
    }
  }

  getGitEmail() {
    try {
      // Try to get git email from global config
      const email = execSync('git config --global user.email', { encoding: 'utf8' }).trim();
      return email || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  async track(event, data = {}) {
    if (!this.enabled) return;

    try {
      const payload = {
        event,
        timestamp: new Date().toISOString(),
        sessionId: this.getSessionId(),
        // Internal reporting data
        userInfo: {
          username: process.env.USERNAME || process.env.USER || 'unknown',
          hostname: os.hostname(),
          userEmail: this.getGitEmail(),
          domain: os.hostname().split('.').slice(1).join('.') || 'unknown'
        },
        data: {
          ...data,
          version: require('../package.json').version,
          nodeVersion: process.version,
          platform: os.platform(),
          arch: os.arch(),
          machineId: this.getMachineId(),
          installLocation: process.cwd()
        }
      };

      // Send async, don't wait for response
      axios.post(this.endpoint, payload, { timeout: 10000 }).then((response) => {
        // Log successful analytics send for debugging
        console.log(`\n✅ Analytics sent successfully to ${this.endpoint}`);
        console.log(`📊 Event: ${event}, User: ${payload.userInfo.username}, Status: ${response.status}\n`);
      }).catch((error) => {
        // Log network connectivity issues for debugging
        if (error.code === 'ECONNREFUSED' || error.code === 'ENETUNREACH') {
          console.log(`\n📊 Analytics: Unable to connect to analytics server at ${this.endpoint}`);
          console.log(`   This is normal if you're not on the same network as the analytics server.`);
          console.log(`   Your TestGenie installation will work normally.\n`);
        } else if (error.response) {
          console.log(`\n⚠️ Analytics server responded with error: ${error.response.status}`);
          console.log(`   Endpoint: ${this.endpoint}`);
          console.log(`   Error: ${error.response.data?.error || error.message}\n`);
        } else {
          console.log(`\n⚠️ Analytics error: ${error.message}`);
          console.log(`   Endpoint: ${this.endpoint}\n`);
        }
        // Ignore all failures - analytics should never break functionality
      });
    } catch (error) {
      // Ignore all errors
    }
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = crypto.randomBytes(16).toString('hex');
    }
    return this.sessionId;
  }

  getMachineId() {
    // Create anonymous machine fingerprint
    const hostname = os.hostname();
    const platform = os.platform();
    const arch = os.arch();
    const cpus = os.cpus().length;
    
    const fingerprint = `${hostname}-${platform}-${arch}-${cpus}`;
    return crypto.createHash('sha256').update(fingerprint).digest('hex').substring(0, 16);
  }

  // Helper methods for common events
  async trackInstallStart(options) {
    await this.track('install_start', {
      type: options.type || 'interactive',
      skipDeps: options.noDeps || false,
      skipMcp: options.noMcp || false,
      force: options.force || false
    });
  }

  async trackInstallSuccess(options, duration) {
    await this.track('install_success', {
      type: options.type || 'interactive',
      duration,
      chatmodesInstalled: options.chatmodes?.length || 0
    });
  }

  async trackInstallError(error, options) {
    await this.track('install_error', {
      error: error.message,
      type: options.type || 'interactive'
    });
  }

  async trackCommand(command, success = true) {
    await this.track('command', {
      command,
      success
    });
  }
}

module.exports = Analytics;