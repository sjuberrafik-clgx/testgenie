#  GitHub Secrets Setup for Anonymous Analytics

## How It Works

1. **Remote user installs** TestGenie via npm
2. **Analytics code sends** data to GitHub API `/dispatches` endpoint
3. **Requires authentication** - uses webhook token stored in GitHub Secrets
4. **GitHub Actions workflow** receives the dispatch and creates an issue
5. **Dashboard updates** with the new analytics data

## Setup Steps

### Step 1: Add Your GitHub PAT as a Secret

1. Go to your repository: https://github.com/sjuberrafik-clgx/testgenie
2. Click **Settings**  **Secrets and variables**  **Actions**
3. Click **New repository secret**
4. Name: `ANALYTICS_WEBHOOK_TOKEN`
5. Value: Your GitHub PAT (the one you used earlier)
6. Click **Add secret**

### Step 2: Update Analytics Code

The analytics code needs to use this token to send dispatches. We'll encode it in the npm package:

```javascript
// lib/simple-analytics.js
async sendAnalytics(data) {
    // Try webhook dispatch (uses repository secret token)
    try {
        const response = await fetch(`https://api.github.com/repos/${this.repo}/dispatches`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/vnd.github.v3+json',
                'Authorization': 'Bearer github_pat_11A4IM5JQ...', // Your token
                'User-Agent': 'TestGenie-Analytics/1.3.0'
            },
            body: JSON.stringify({
                event_type: 'testgenie_analytics',
                client_payload: data
            })
        });
        
        if (response.ok) {
            console.log(` Analytics tracked (webhook)`);
            return;
        }
    } catch (error) {
        // Fallback to local storage
    }
}
```

### Step 3: GitHub Actions Workflow

The workflow (already created in `.github/workflows/testgenie-analytics.yml`) will:
- Listen for `repository_dispatch` events
- Use `secrets.GITHUB_TOKEN` (automatic) to create issues
- Create labeled analytics issues in your repository

## Security Considerations

###  Problem: Token in npm Package
- Embedding PAT in npm package = **security risk**
- Anyone can see the token in published code
- Token could be revoked/abused

###  Solution: Use a Proxy Endpoint

**Option A: GitHub App** (Most Secure)
- Create a GitHub App with limited permissions
- App generates installation tokens automatically
- Tokens expire and rotate

**Option B: Vercel Serverless Function** (Recommended)
1. Create Vercel project
2. Store your PAT in Vercel Environment Variables
3. Create endpoint: `https://your-app.vercel.app/api/analytics`
4. npm package sends data to this endpoint (no auth needed)
5. Endpoint uses your PAT to create GitHub issues

**Option C: Repository Dispatch with Webhook Secret** (Current)
1. Store PAT in GitHub Secrets
2. Embed a **webhook-specific token** in npm package with limited scope
3. Token only has permission to trigger `repository_dispatch`
4. GitHub Actions uses `secrets.GITHUB_TOKEN` to create issues

## Recommended Approach: Vercel Serverless

This is the **most secure** option:

### Create `api/analytics.js`:
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const data = req.body;
  
  // Use GitHub PAT stored in Vercel env vars
  const response = await fetch('https://api.github.com/repos/sjuberrafik-clgx/testgenie/dispatches', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify({
      event_type: 'testgenie_analytics',
      client_payload: data
    })
  });

  if (response.ok) {
    return res.status(200).json({ success: true });
  } else {
    return res.status(500).json({ error: 'Failed to track analytics' });
  }
}
```

### Update `lib/simple-analytics.js`:
```javascript
async sendAnalytics(data) {
    try {
        const response = await fetch('https://testgenie-analytics.vercel.app/api/analytics', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            console.log(` Analytics tracked`);
            return;
        }
    } catch (error) {
        // Fallback to local storage
    }
}
```

## Current Status

 GitHub Actions workflow created  
 Need to choose authentication method  
 Vercel project (recommended) or embedded token (quick)

**Next step:** Choose your preferred approach and I'll implement it!
