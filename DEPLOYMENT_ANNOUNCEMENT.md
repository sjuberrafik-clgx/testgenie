# 🚀 TestGenie CLI - Now Available for CoreLogic Teams!

## 📋 **What is TestGenie?**

TestGenie CLI is a powerful tool that brings **AI-powered GitHub Chatmodes** directly to your VS Code projects. It automatically installs and configures:

- **🧞‍♀️ TestGenie**: Generate comprehensive test cases from Jira tickets
- **🪰 BugGenie**: Create detailed bug reports with Jira integration  
- **🤖 ScriptGenerator**: Generate Playwright automation scripts
- **📦 Testing Dependencies**: Playwright, Mocha, TypeScript, Allure reporting
- **🔗 MCP Integration**: Seamless Atlassian/Jira connectivity

## ⚡ **Quick Installation**

**One command installs everything you need:**

```bash
npx testgenie-cli install
```

**That's it!** No configuration required - the CLI handles everything automatically.

## ✨ **What You Get**

### **Instant AI Testing Capabilities**
- **Test Case Generation**: Convert Jira tickets into structured test cases
- **Bug Report Creation**: Standardized bug reporting with Jira integration
- **Automation Scripts**: Generate Playwright tests for any web application
- **Real-time Testing**: End-to-end browser automation

### **Complete Testing Environment**
- **Playwright**: Latest browser automation framework
- **Mocha & Chai**: Industry-standard testing tools
- **TypeScript**: Type-safe test development
- **Allure Reports**: Beautiful test reporting
- **VS Code Integration**: Seamless development experience

### **Corporate Integration**
- **Jira Connectivity**: Direct ticket creation and updates
- **Atlassian MCP**: Model Context Protocol for enterprise tools
- **Team Collaboration**: Standardized workflows across development teams
- **Project Templates**: Pre-configured package.json and scripts

## 🎯 **Usage Examples**

### **Generate Test Cases**
```
Open VS Code → GitHub Copilot Chat → @TestGenie

"Generate test cases for JIRA-1234 login functionality"
```

### **Create Bug Reports**  
```
Open VS Code → GitHub Copilot Chat → @BugGenie

"Create bug report for checkout payment failure"
```

### **Generate Automation**
```
Open VS Code → GitHub Copilot Chat → @ScriptGenerator

"Generate Playwright test for user registration flow"
```

## 📊 **Usage Tracking**

This tool includes **anonymous usage analytics** to help improve the service:
- **Data Collected**: Username, hostname, email (from git config), command usage
- **Purpose**: Track adoption, identify popular features, improve functionality
- **Privacy**: All data stays within CoreLogic network (AVD environment)
- **Opt-out**: Run `npx testgenie-cli analytics --disable` if preferred

## 🔧 **Troubleshooting**

### **Common Issues**

**"Command not found"**
- Ensure you have Node.js 14+ installed
- Try: `npm cache clean --force` then retry installation

**"VS Code doesn't show chatmodes"**
- Restart VS Code after installation
- Check GitHub Copilot Chat: type `@` to see available chatmodes
- Verify `.github/chatmodes/` directory was created

**"MCP configuration failed"**
- Requires VS Code 1.85+ with GitHub Copilot
- Run installation as administrator if needed
- Manual setup: Copy `.mcp/` folder to VS Code settings

**"Dependencies installation failed"**
- Run with `--no-deps` flag to skip automatic dependency installation
- Manually install: `npm install playwright mocha chai typescript`

### **Need Help?**
- **Internal Support**: Check with your development team leads
- **Documentation**: Full guides available in the TestGenie repository
- **Issues**: Report problems through your standard IT support channels

## 🎉 **Benefits for Development Teams**

### **Increased Productivity**
- **Faster Test Creation**: AI-generated test cases from requirements
- **Standardized Bug Reports**: Consistent quality across teams
- **Automated Script Generation**: Reduce manual Playwright coding
- **One-click Setup**: No complex configuration or setup time

### **Quality Improvements**
- **Comprehensive Testing**: AI helps identify edge cases
- **Consistent Workflows**: Standardized testing approaches
- **Enterprise Integration**: Direct Jira/Atlassian connectivity
- **Best Practices**: Pre-configured industry-standard tools

### **Team Collaboration**
- **Shared Templates**: Consistent project structures
- **Knowledge Transfer**: AI-assisted test case documentation
- **Cross-team Standards**: Unified testing approaches
- **Mentoring**: AI helps junior developers learn testing patterns

## 🚀 **Get Started Now**

1. **Open terminal** in any VS Code project
2. **Run installation**: `npx testgenie-cli install`
3. **Follow prompts**: Select which chatmodes you want
4. **Restart VS Code**: Load new configurations
5. **Start testing**: Open GitHub Copilot Chat and type `@`

**Installation takes ~2-3 minutes and sets up everything automatically!**

---

## 📈 **Analytics Dashboard**

Development leads can monitor adoption and usage at:
**http://10.30.22.16:3001**

Track:
- Team installation rates
- Feature usage patterns  
- Popular chatmodes
- Success metrics

---

**Questions?** Reach out to your development team leads or check internal documentation.

**Ready to supercharge your testing workflow with AI?** 🤖✨