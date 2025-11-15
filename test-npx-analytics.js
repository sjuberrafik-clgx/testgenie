#!/usr/bin/env node

// Test script to simulate npx usage and verify analytics

console.log('🧪 Testing NPX Analytics Detection...\n');

// Simulate npx environment
process.env.NPX_CLI_JS = 'true';
process.argv[0] = '/path/to/npx';

const TestGenieAnalytics = require('./lib/simple-analytics');

async function testNpxDetection() {
    try {
        const analytics = new TestGenieAnalytics();
        
        console.log('📊 Simulating npx testgenie-cli install command...');
        
        // Test npx usage tracking
        await analytics.trackNpxUsage({
            command: 'install',
            args: ['install'],
            projectPath: process.cwd()
        });
        
        console.log('✅ NPX usage tracked successfully!');
        console.log('🔍 This should appear in the dashboard as "NPX Command" with ⚡🏃‍♂️ icon');
        
        // Test install tracking with npx context
        await analytics.trackInstallStart({
            command: 'install',
            installMethod: 'npx',
            projectPath: process.cwd()
        });
        
        console.log('✅ Install start tracked with NPX context!');
        
        // Simulate successful installation
        await analytics.trackInstallSuccess({
            command: 'install',
            installMethod: 'npx',
            duration: 5000,
            projectPath: process.cwd()
        });
        
        console.log('✅ Install success tracked with NPX context!');
        
        console.log('\n📊 Dashboard should now show:');
        console.log('   • NPX Command usage (⚡🏃‍♂️)');
        console.log('   • Installation events with "via npx" indicator');
        console.log('   • Updated install method statistics\n');
        
        console.log('🌐 Check dashboard: https://sjuberrafik-clgx.github.io/testgenie');
        
    } catch (error) {
        console.error('❌ NPX analytics test failed:', error.message);
    }
}

testNpxDetection();