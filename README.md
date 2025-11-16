# 🧞‍♀️ TestGenie CLI - Professional Testing Assistant

[![npm version](https://img.shields.io/npm/v/testgenie-cli.svg)](https://www.npmjs.com/package/testgenie-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Analytics Dashboard](https://img.shields.io/badge/Analytics-Dashboard-purple.svg)](https://vercel-analytics-6btqbortq-shaikhjuber1432-gmailcoms-projects.vercel.app)

TestGenie is a powerful CLI tool that brings AI-powered testing assistance directly to your development workflow through VS Code's Model Context Protocol (MCP).

## 🚀 Features

- **🧞‍♀️ AI-Powered Test Generation**: Generate comprehensive tests with intelligent analysis
- **🐛 Smart Bug Detection**: Advanced debugging and issue identification
- **📜 Script Generation**: Automated script creation for various testing scenarios
- 📊 **Analytics**: [Dashboard](https://vercel-analytics-6btqbortq-shaikhjuber1432-gmailcoms-projects.vercel.app)
- **🎨 VS Code Integration**: Seamless integration through Model Context Protocol
- **👤 Profile Support**: Automatic VS Code profile detection and configuration

## 📦 Quick Installation

```bash
# Install globally
npm install -g testgenie-cli@latest

# Or use directly with npx
npx testgenie-cli@latest --help
```

## 🛠️ Usage

### Basic Commands

```bash
# Initialize TestGenie in your project
testgenie-cli init

# Generate tests for your code
testgenie-cli test <file-path>

# Configure MCP integration
testgenie-cli mcp

# List available VS Code profiles
testgenie-cli mcp --list-profiles

# Configure for specific VS Code profile
testgenie-cli mcp --profile <profile-name>
```

### MCP Integration

TestGenie integrates with VS Code through the Model Context Protocol:

1. **Automatic Setup**: Run `testgenie-cli mcp` for automatic configuration
2. **Profile Detection**: Automatically detects and uses appropriate VS Code profile
3. **Manual Configuration**: Specify custom profile with `--profile` option

## 📊 Analytics Dashboard

Monitor usage and performance through our professional analytics dashboard:

**🔗 [Live Analytics Dashboard](https://vercel-analytics-6btqbortq-shaikhjuber1432-gmailcoms-projects.vercel.app)**

### Dashboard Features

- **📈 Real-time Statistics**: Total events, daily usage, unique users
- **🧞‍♀️ Professional Design**: Clean, modern interface with genie theming
- **📄 Event Pagination**: Navigate through historical usage data
- **🔍 Detailed Event Information**: Expandable cards with comprehensive details
- **📱 Responsive Design**: Works perfectly on desktop and mobile

### Event Details Tracked

- User information (username, email, hostname)
- System details (platform, architecture, Node.js version)
- CLI usage patterns (commands, install locations, sessions)
- Performance metrics and error tracking

## 🎨 Chat Modes

TestGenie includes specialized AI chat modes for different testing scenarios:

### 🧞‍♀️ TestGenie Mode
- Comprehensive test generation
- Test strategy recommendations
- Code coverage analysis

### 🪐 BugGenie Mode
- Advanced bug detection
- Root cause analysis
- Fix recommendations

### 🤖 ScriptGenerator Mode
- Automated script creation
- Workflow automation
- Custom tool generation

## 📁 Project Structure

```
testgenie/
├── 🧞‍♀️ bin/           # CLI executable
├── 📚 lib/           # Core libraries
│   ├── analytics.js  # Usage analytics
│   ├── github-analytics.js
│   └── chatmode-manager.js
├── 📋 templates/     # Configuration templates
│   ├── mcp.json
│   └── chatmodes/   # AI chat mode definitions
├── 📊 analytics-dashboard/ # Local dashboard
├── 🌐 vercel-analytics/    # Production dashboard
└── 📖 docs/         # Documentation
```

```
@TestGenie Generate test cases for login functionality
@BugGenie Create bug report for checkout issue  
@ScriptGenerator Generate Playwright test for user registration
```

## 🔧 Commands

```bash
# Install all chatmodes and dependencies
npx testgenie-cli install

# List available features
npx testgenie-cli list

# Update to latest version
npx testgenie-cli update

# Manage analytics
npx testgenie-cli analytics --status
npx testgenie-cli analytics --disable
```

## 📋 Installation Options

```bash
# Install specific chatmode
npx testgenie-cli install --type test

# Skip dependency installation
npx testgenie-cli install --no-deps

# Skip MCP configuration
npx testgenie-cli install --no-mcp

# Force overwrite existing files
npx testgenie-cli install --force
```

## 🏢 Enterprise Features

### **Jira Integration**
- Direct ticket creation and updates
- Automated test case linking
- Sprint planning integration
- Requirements traceability

### **Team Collaboration**
- Standardized testing workflows
- Consistent bug report formats
- Shared automation scripts
- Knowledge transfer via AI

### **Analytics & Reporting**
- Usage tracking and adoption metrics
- Feature popularity insights
- Team productivity analytics
- Success rate monitoring

## 🔒 Privacy & Security

- **Corporate Friendly**: Works within enterprise networks
- **Data Control**: Analytics stay within your infrastructure
- **No External Dependencies**: Optional cloud analytics
- **Opt-out Available**: Full control over data sharing

## 🛠️ Requirements

- **Node.js**: 14.0.0 or higher
- **VS Code**: Latest version recommended
- **GitHub Copilot**: Active subscription
- **Git**: For project integration

## 📖 Documentation

- [Installation Guide](./DEPLOYMENT_ANNOUNCEMENT.md)
- [Network Setup](./NETWORK_SETUP.md)
- [Troubleshooting](./DEPLOYMENT_CHECKLIST.md)
- [API Documentation](./analytics-dashboard/)

## 🤝 Support

For technical support or feature requests:
- Check documentation for common solutions
- Review troubleshooting guide
- Contact your development team leads
- Report issues through standard IT channels

## 📈 What's Next

After installation, you'll have access to:

- **VS Code Integration**: Chatmodes available in GitHub Copilot Chat
- **Project Setup**: Automatic package.json and dependency configuration  
- **Testing Scripts**: Ready-to-use npm commands for testing
- **Jira Connectivity**: Direct integration with Atlassian tools
- **Team Analytics**: Optional usage tracking and insights

## 🎉 Success Stories

TestGenie CLI has helped development teams:
- **Reduce test creation time** by 60%
- **Standardize bug reporting** across projects
- **Accelerate automation adoption** with AI assistance
- **Improve code quality** through comprehensive testing

---

**Ready to supercharge your testing workflow with AI?**

```bash
npx testgenie-cli install
```

**Happy Testing!** 🧞‍♀️🚀
=======
# testgenie
Test Genie helps to generate Manual/Automation test cases using CoPilot
>>>>>>> 7bfc5da2263a3c424810a22cca8da5e5dac748c7
