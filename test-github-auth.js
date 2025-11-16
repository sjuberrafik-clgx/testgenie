#!/usr/bin/env node

// GitHub API Authentication Test for TestGenie Analytics

const TestGenieAnalytics = require('./lib/simple-analytics');

async function testGitHubAuth() {
    console.log('🔐 TestGenie GitHub API Authentication Test\n');
    
    const analytics = new TestGenieAnalytics();
    
    // Check if token is available
    if (!analytics.githubToken) {
        console.log('❌ No GitHub token found!');
        console.log('\n📝 To fix this:');
        console.log('1. Create Personal Access Token: https://github.com/settings/tokens');
        console.log('2. Set environment variable:');
        console.log('   Windows: setx GITHUB_TOKEN "ghp_your_token_here"');
        console.log('   macOS/Linux: export GITHUB_TOKEN="ghp_your_token_here"');
        console.log('\n📖 Full guide: see GITHUB_AUTH_SETUP.md');
        return;
    }
    
    console.log('✅ GitHub token found!');
    console.log(`🔑 Token: ${analytics.githubToken.substring(0, 10)}...`);
    
    // Test GitHub API connectivity
    console.log('\n🧪 Testing GitHub API connectivity...');
    
    try {
        const response = await fetch('https://api.github.com/user', {
            headers: {
                'Authorization': `Bearer ${analytics.githubToken}`,
                'User-Agent': 'TestGenie-Auth-Test'
            }
        });
        
        if (response.ok) {
            const user = await response.json();
            console.log(`✅ API connection successful!`);
            console.log(`👤 Authenticated as: ${user.login}`);
            console.log(`📧 Email: ${user.email || 'private'}`);
        } else {
            console.log(`❌ API connection failed: ${response.status} ${response.statusText}`);
            const errorText = await response.text();
            console.log(`Error details: ${errorText}`);
            return;
        }
    } catch (error) {
        console.log(`❌ API connection error: ${error.message}`);
        return;
    }
    
    // Test repository access
    console.log('\n🏗️ Testing repository access...');
    
    try {
        const repoResponse = await fetch('https://api.github.com/repos/sjuberrafik-clgx/testgenie', {
            headers: {
                'Authorization': `Bearer ${analytics.githubToken}`,
                'User-Agent': 'TestGenie-Auth-Test'
            }
        });
        
        if (repoResponse.ok) {
            console.log('✅ Repository access confirmed!');
        } else {
            console.log(`❌ Repository access failed: ${repoResponse.status}`);
            return;
        }
    } catch (error) {
        console.log(`❌ Repository access error: ${error.message}`);
        return;
    }
    
    // Test analytics tracking
    console.log('\n📊 Testing analytics issue creation...');
    
    try {
        await analytics.track({
            action: 'auth_test',
            installMethod: 'manual',
            version: '1.2.0',
            platform: process.platform,
            testRun: true,
            timestamp: new Date().toISOString()
        });
        
        console.log('✅ Analytics test successful!');
        console.log('\n🎉 GitHub API authentication is working perfectly!');
        console.log('\n📊 Check your analytics:');
        console.log('   • Dashboard: https://sjuberrafik-clgx.github.io/testgenie');
        console.log('   • Issues: https://github.com/sjuberrafik-clgx/testgenie/issues');
        console.log('\n🚀 All TestGenie usage will now be tracked in real-time!');
        
    } catch (error) {
        console.log(`❌ Analytics test failed: ${error.message}`);
    }
}

testGitHubAuth();