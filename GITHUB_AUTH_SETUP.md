# 🔐 GitHub API Authentication Setup for TestGenie Analytics

This guide explains how to set up GitHub API authentication to enable real-time analytics tracking.

## 🎯 **Why Authentication is Needed**

TestGenie analytics creates GitHub Issues to track:
- 📦 Package installations (`npm install -g testgenie-cli`)
- ⚡ NPX usage (`npx testgenie-cli install`) 
- 💻 CLI command usage
- 📊 Dashboard analytics

Without authentication, the GitHub API returns **401 Unauthorized** errors.

## 🔑 **Step 1: Create Personal Access Token**

1. **Go to GitHub Settings**: https://github.com/settings/tokens
2. **Click "Generate new token"** → "Generate new token (classic)"
3. **Configure Token**:
   - **Note**: `TestGenie Analytics Token`
   - **Expiration**: `90 days` (or custom)
   - **Scopes**: Select these permissions:
     ```
     ✅ repo (Full control of private repositories)
       ✅ repo:status
       ✅ public_repo  
     ✅ workflow (Update GitHub Action workflows)
     ```

4. **Generate and Copy Token**: `ghp_xxxxxxxxxxxxxxxxxxxx`

## 🔧 **Step 2: Configure Environment Variables**

### **Option A: System Environment Variable (Recommended)**
```bash
# Windows (PowerShell - Run as Administrator)
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_your_token_here", "User")

# Windows (Command Prompt - Run as Administrator)  
setx GITHUB_TOKEN "ghp_your_token_here" /M

# macOS/Linux
export GITHUB_TOKEN="ghp_your_token_here"
echo 'export GITHUB_TOKEN="ghp_your_token_here"' >> ~/.bashrc
source ~/.bashrc
```

### **Option B: Project-Specific .env File**
```bash
# Create .env file in your project
echo "GITHUB_TOKEN=ghp_your_token_here" > .env
echo "TESTGENIE_GITHUB_TOKEN=ghp_your_token_here" >> .env
```

### **Option C: Alternative Environment Variables**
TestGenie checks multiple environment variables:
- `GITHUB_TOKEN` (preferred)
- `GH_TOKEN` (GitHub CLI compatible)
- `TESTGENIE_GITHUB_TOKEN` (TestGenie specific)

## 🧪 **Step 3: Test Authentication**

Run this test to verify authentication works:

```bash
# Test GitHub API authentication
node -e "
const analytics = require('./lib/simple-analytics');
const a = new analytics();
console.log('🔐 Testing GitHub API authentication...');
console.log('Token found:', a.githubToken ? 'YES ✅' : 'NO ❌');

if (a.githubToken) {
  a.track({
    action: 'auth_test',
    installMethod: 'manual',
    version: '1.2.0'
  }).then(() => {
    console.log('🎉 Authentication successful!');
    console.log('📊 Check: https://github.com/sjuberrafik-clgx/testgenie/issues');
  }).catch(e => console.log('❌ Auth failed:', e.message));
} else {
  console.log('⚠️ No GitHub token found. Set GITHUB_TOKEN environment variable.');
}
"
```

## 📊 **Step 4: Verify Dashboard Updates**

Once authenticated, your installations should appear in real-time:

1. **Install TestGenie**: `npm install -g testgenie-cli`
2. **Use CLI**: `testgenie install`
3. **Check Dashboard**: https://sjuberrafik-clgx.github.io/testgenie
4. **Verify Issues**: https://github.com/sjuberrafik-clgx/testgenie/issues

## 🔒 **Security Best Practices**

### ✅ **Do:**
- Use minimal required permissions
- Set token expiration (90 days recommended)
- Use environment variables (never hardcode tokens)
- Use project-specific `.env` files for development

### ❌ **Don't:**
- Commit tokens to version control
- Share tokens in chat/email
- Use tokens with excessive permissions
- Set tokens as global variables in code

## 🚀 **Alternative: GitHub Actions Integration**

For organizational deployment, use GitHub Actions:

```yaml
# .github/workflows/analytics.yml
name: TestGenie Analytics
on: 
  repository_dispatch:
    types: [analytics_data]

jobs:
  track-analytics:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Create Analytics Issue
        uses: actions/github-script@v6
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          script: |
            const payload = context.payload.client_payload;
            await github.rest.issues.create({
              owner: 'sjuberrafik-clgx',
              repo: 'testgenie',
              title: `[Analytics] ${payload.action}`,
              body: `Analytics data: ${JSON.stringify(payload, null, 2)}`,
              labels: ['analytics', payload.action]
            });
```

## 🔧 **Troubleshooting**

### **Problem**: `401 Unauthorized`
```bash
# Check token is set
echo $GITHUB_TOKEN

# Verify token permissions at:
# https://github.com/settings/tokens
```

### **Problem**: `403 Forbidden`  
```bash
# Token may lack required permissions
# Add 'repo' scope to your token
```

### **Problem**: `Rate Limited`
```bash
# Check rate limit status
curl -H "Authorization: Bearer $GITHUB_TOKEN" \
  https://api.github.com/rate_limit
```

## 📞 **Support**

If you need help:
1. Check GitHub token permissions
2. Verify environment variables are set
3. Test with the provided test script
4. Check GitHub Issues for error details

---

**🎯 Once configured, all TestGenie usage will be tracked in real-time with proper GitHub Issues! 📊**