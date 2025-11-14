# TestGenie CLI

A comprehensive CLI tool to install GitHub Chatmodes for VS Code projects with complete testing setup. This package provides specialized chatmodes for test generation, bug reporting, and automation script creation, along with all necessary dependencies and MCP configuration.

## 🚀 Quick Start

### Global Installation

```bash
npm install -g testgenie-cli
```

### One-Command Setup

```bash
# Navigate to your VS Code project
cd your-vscode-project

# Complete installation with dependencies and MCP setup
testgenie install

# Alternative commands
chatmodes install
install-chatmodes
```

## 🎯 What Gets Installed

### 1. GitHub Chatmodes
- **TestGenie** - Test case generation from Jira tickets
- **BugGenie** - Standardized bug reporting with Jira integration  
- **ScriptGenerator** - Playwright automation script generation

### 2. Testing Dependencies
- **@playwright/test** - Browser automation framework
- **mocha & chai** - Testing framework and assertions
- **allure-playwright** - Advanced test reporting
- **typescript** - Type safety for better code quality
- **axios & dotenv** - HTTP requests and environment management

### 3. MCP Configuration
- **Atlassian MCP Server** - Direct Jira integration
- **VS Code User Settings** - Optimized for chatmode usage
- **Environment Setup** - Ready for immediate use

### 4. Project Scripts
- **npm test** - Run Playwright tests
- **npm run test:headed** - Visual browser testing
- **npm run test:debug** - Debug mode with step-through
- **npm run report** - Generate and view test reports

## 📋 Available Chatmodes

### 🧞‍♀️ TestGenie - Test Case Generation
- Generate structured test cases from Jira tickets
- Create automation scripts with Mocha framework
- Support for multiple MLS (Multiple Listing Service) systems
- Comprehensive test coverage scenarios

### 🪰 BugGenie - Bug Report Generation
- Create detailed, standardized bug reports
- Integrate with Jira for automated ticket creation
- Support for UAT and PROD environments
- Structured workflow for bug documentation

### 🤖 ScriptGenerator - Automation Scripts
- Generate Playwright test scripts
- Real-time browser automation
- End-to-end testing workflows
- Interactive test development

## 🛠️ CLI Commands

## 🛠️ Installation Options

### Full Installation (Recommended)
```bash
# Complete setup with chatmodes, dependencies, and MCP configuration
testgenie install
```

### Selective Installation
```bash
# Skip dependency installation
testgenie install --no-deps

# Skip MCP configuration
testgenie install --no-mcp

# Install specific chatmode only
testgenie install --type test
testgenie install --type bug
testgenie install --type script

# Install to specific directory
testgenie install /path/to/project

# Force overwrite existing files
testgenie install --force
```

### One-Time Use (No Global Install)
```bash
npx testgenie-cli install
```

### Other Commands
```bash
testgenie list              # Show available features
testgenie update            # Update to latest version
testgenie analytics         # Manage analytics preferences
testgenie --help            # Show all commands
```

## 📁 Project Structure After Installation

```
your-project/
├── .github/
│   ├── chatmodes/
│   │   ├── 🧞‍♀️🤖 TestGenie.chatmode.md
│   │   ├── 🪰𖢥🧞‍♀️ BugGenie.chatmode.md
│   │   └── 🧞‍♀️🤖 ScriptGenerator.chatmode.md
│   └── instructions/
│       └── copilotinstruction.md
├── .vscode/
│   └── settings.json
├── package.json (updated with dependencies and scripts)
├── node_modules/ (testing dependencies installed)
└── C:\Users\[Username]\AppData\Roaming\Code\User\
    └── mcp.json (MCP configuration for Atlassian)
```

## 🔧 Usage in VS Code

1. **Run the installation command in your VS Code project**
2. **Restart VS Code** to load the new MCP configuration
3. **Open GitHub Copilot Chat** (Ctrl+Shift+I or Cmd+Shift+I)
4. **Type `@` to see available chatmodes**
5. **Start using your chatmodes:**

### Example Usage

```
@TestGenie generate test cases for user login functionality

@BugGenie create bug report for navigation issue in UAT environment

@ScriptGenerator create Playwright test for checkout flow
```

### Post-Installation Commands

```bash
# Run your tests
npm test

# Test with visible browser
npm run test:headed

# Debug tests step-by-step
npm run test:debug

# View test reports
npm run report
```

## � Privacy & Analytics

TestGenie includes **optional** anonymous usage analytics to help improve the tool.

### What We Collect (Only if you opt-in)
- ✅ Command usage statistics (install, list, update)
- ✅ Success/failure rates 
- ✅ System information (OS, Node.js version)
- ✅ Installation options used
- ✅ Anonymous machine fingerprint

### What We DON'T Collect
- ❌ Personal information (names, emails, usernames)
- ❌ File contents or project details
- ❌ Sensitive data or credentials
- ❌ Personally identifiable information

### Managing Analytics
```bash
# Check current status
testgenie analytics --status

# Enable analytics
testgenie analytics --enable

# Disable analytics
testgenie analytics --disable

# Interactive management
testgenie analytics
```

**Note**: Analytics are completely optional and can be disabled at any time. The tool works exactly the same whether analytics are enabled or disabled.

### For TestGenie and BugGenie:
- **Jira Integration**: Requires Jira project access
- **Project Key**: `AOTF`
- **Cloud ID**: `bbbb661d-12fe-49bd-b7b0-3a6d1f57acb0`

### For ScriptGenerator:
- **Playwright**: For automation script execution
- **Node.js**: v14 or higher

## 🌟 Features

- **Zero Configuration**: Works out of the box
- **Interactive Installation**: Choose which chatmodes to install
- **Force Overwrite**: Update existing installations
- **Multiple Project Support**: Install in any VS Code project
- **Standardized Templates**: Consistent formatting and structure

## 📦 Package Structure

```
testgenie-cli/
├── bin/
│   └── cli.js              # Main CLI executable
├── templates/
│   ├── chatmodes/          # Chatmode template files
│   └── instructions/       # Instruction template files
├── package.json
└── README.md
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the CLI locally
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔧 Development

### Local Development
```bash
git clone https://github.com/sjuberrafik-clgx/testgenie
cd testgenie
npm install
npm link  # Makes the CLI available globally for testing
```

### Testing
```bash
# Test in a sample project
mkdir test-project
cd test-project
chatmodes install
```

## 🐛 Issues & Support

If you encounter any issues or have suggestions:

1. Check existing issues on GitHub
2. Create a new issue with detailed description
3. Include your OS, Node.js version, and VS Code version

## 📚 Related Projects

- [GitHub Copilot](https://github.com/features/copilot)
- [VS Code](https://code.visualstudio.com/)
- [Playwright](https://playwright.dev/)
- [Mocha](https://mochajs.org/)

---

**Powered by Doremon Team** 🚀💙