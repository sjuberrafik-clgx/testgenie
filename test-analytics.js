#!/usr/bin/env node

// Test script to manually trigger analytics and verify the system

const GitHubAnalytics = require('./lib/simple-analytics');

async function testAnalytics() {
    console.log('🧪 Testing TestGenie Analytics System...\n');
    
    try {
        const analytics = new GitHubAnalytics();
        
        console.log('📊 Creating test analytics event...');
        
        // Create a test event that should appear in the dashboard
        const testData = {
            action: 'manual_test',
            command: 'test-analytics',
            version: '1.1.0',
            installLocation: process.cwd(),
            success: true,
            timestamp: new Date().toISOString(),
            testUser: true
        };

        await analytics.track(testData);
        
        console.log('\n✅ Analytics test completed!');
        console.log('🔍 Check the dashboard in a few minutes to see if the event appears.');
        console.log('📊 Dashboard: https://sjuberrafik-clgx.github.io/testgenie');
        
    } catch (error) {
        console.error('\n❌ Analytics test failed:', error.message);
        console.log('\n🔧 This might explain why your installation isn\'t showing up.');
        console.log('📝 Possible issues:');
        console.log('   • GitHub API rate limits');
        console.log('   • Network connectivity issues'); 
        console.log('   • Repository permissions');
    }
}

testAnalytics();