# Cloud Deployment Options for TestGenie Analytics

## Option 1: Heroku (Free/Easy)

### Step 1: Prepare for Heroku
```bash
# Create Procfile
echo "web: node server.js" > analytics-dashboard/Procfile

# Update package.json to use PORT env variable
# (Already configured in server.js)
```

### Step 2: Deploy to Heroku
```bash
cd analytics-dashboard
npm init -y  # if package.json doesn't exist
git init
git add .
git commit -m "Initial commit"

# Install Heroku CLI and login
heroku create testgenie-analytics-yourname

# Deploy
git push heroku main
```

Your analytics will be available at: `https://testgenie-analytics-yourname.herokuapp.com`

## Option 2: Azure App Service (Corporate Preferred)

### Step 1: Azure Setup
```bash
# Install Azure CLI
# Login to Azure
az login

# Create resource group
az group create --name testgenie-rg --location eastus

# Create app service
az appservice plan create --name testgenie-plan --resource-group testgenie-rg --sku FREE
az webapp create --name testgenie-analytics-yourname --resource-group testgenie-rg --plan testgenie-plan --runtime "NODE|18-lts"
```

### Step 2: Deploy to Azure
```bash
cd analytics-dashboard
az webapp deployment source config-local-git --name testgenie-analytics-yourname --resource-group testgenie-rg

# Deploy
git remote add azure <your-azure-git-url>
git push azure main
```

## Option 3: Corporate VPN/Network Setup

### If CoreLogic has external access:
1. **Request Public IP**: Ask IT for external access to your machine
2. **Port Forwarding**: Router forwards port 3001 to your machine
3. **Dynamic DNS**: Use service like No-IP for consistent URL

### Corporate Network Configuration:
```bash
# Your IT team would need to:
1. Assign public IP or domain: testgenie.corelogic.com
2. Set up port forwarding: External:443 -> Your Machine:3001
3. SSL certificate for HTTPS access
```

## Option 4: Corporate Cloud (AWS/Azure)

### AWS EC2 Deployment
```bash
# Launch EC2 instance
aws ec2 run-instances --image-id ami-0abcdef1234567890 --count 1 --instance-type t2.micro

# Deploy analytics server
scp -r analytics-dashboard/ ec2-user@your-instance:/home/ec2-user/
ssh ec2-user@your-instance
cd analytics-dashboard
npm install
npm start
```

Your analytics available at: `http://your-ec2-ip:3001`

## Updated CLI Configuration

After cloud deployment, update analytics endpoint:

```javascript
// lib/analytics.js
getAnalyticsEndpoint() {
  // Use your cloud URL instead of local IP
  return 'https://testgenie-analytics-yourname.herokuapp.com/api/usage';
  // OR your corporate domain:
  // return 'https://testgenie.corelogic.com/api/usage';
}
```

## Recommended Approach for CoreLogic

1. **Short Term**: Use Heroku for immediate testing
2. **Long Term**: Deploy to Azure (Microsoft partnership)
3. **Enterprise**: Work with IT for corporate domain setup

This ensures users anywhere can send analytics data!