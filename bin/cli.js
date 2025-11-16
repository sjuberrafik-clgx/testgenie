#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const inquirer = require('inquirer');
const fs = require('fs-extra');
const path = require('path');
const ora = require('ora');
const os = require('os');
const { execSync } = require('child_process');
const Analytics = require('../lib/analytics');

const packageJson = require('../package.json');
const analytics = new Analytics();

// Initialize analytics and detect npx usage
(async () => {
    await analytics.initialize();
    
    // Track npx usage for analytics
    if (process.env.NPX_CLI_JS || 
        process.argv[0].includes('npx') ||
        process.argv[1].includes('_npx') ||
        process.env._?.includes('npx')) {
        
        await analytics.track('npx_usage', {
            command: process.argv.slice(2).join(' ') || 'help',
            args: process.argv.slice(2)
        });
    }
})().catch(() => {}); // Silent fail

program
  .name('testgenie')
  .description('TestGenie CLI - Install GitHub Chatmodes, dependencies, and MCP configuration for VS Code')
  .version(packageJson.version);

program
  .command('install [project-path]')
  .description('Install GitHub Chatmodes to a VS Code project')
  .option('-t, --type <type>', 'Specific chatmode type to install (test, bug, script)')
  .option('-f, --force', 'Force overwrite existing chatmodes')
  .option('--no-deps', 'Skip dependency installation')
  .option('--no-mcp', 'Skip MCP configuration setup')
  .option('-p, --profile <profile>', 'VS Code profile name for MCP configuration (e.g., "1a6e6ee" or "default")')
  .option('--help-profiles', 'Show information about VS Code profiles')
  .action(async (projectPath, options) => {
    const startTime = Date.now();
    const targetPath = projectPath || process.cwd();
    
    // Track installation start
    await analytics.track('install_start', {
        projectPath: targetPath,
        command: 'install',
        args: process.argv.slice(2),
        ...options
    });
    
    console.log(chalk.blue('\n🚀 TestGenie CLI\n'));
    
    // Check if target directory exists
    if (!fs.existsSync(targetPath)) {
      const error = new Error(`Directory ${targetPath} does not exist`);
      await analytics.track('install_error', { error: error.message, ...options });
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }

    const githubDir = path.join(targetPath, '.github');
    const chatmodesDir = path.join(githubDir, 'chatmodes');
    const instructionsDir = path.join(githubDir, 'instructions');

    // Create directories if they don't exist
    await fs.ensureDir(chatmodesDir);
    await fs.ensureDir(instructionsDir);

    const spinner = ora('Installing TestGenie chatmodes...').start();

    try {
      // Copy chatmode files
      const sourceDir = path.join(__dirname, '../templates');
      
      if (options.type) {
        // Install specific chatmode
        await installSpecificChatmode(sourceDir, chatmodesDir, instructionsDir, options.type, options.force);
      } else {
        // Interactive installation
        spinner.stop();
        const answers = await inquirer.prompt([
          {
            type: 'checkbox',
            name: 'chatmodes',
            message: 'Select which chatmodes to install:',
            choices: [
              { name: '🧞‍♀️ Test Generator (TestGenie)', value: 'test', checked: true },
              { name: '🪰 Bug Reporter (BugGenie)', value: 'bug', checked: true },
              { name: '🤖 Script Generator (ScriptGenerator)', value: 'script', checked: true }
            ]
          },
          {
            type: 'confirm',
            name: 'installDeps',
            message: 'Install testing dependencies (Playwright, Mocha, etc.)?',
            default: true,
            when: () => options.deps !== false
          },
          {
            type: 'confirm',
            name: 'setupMcp',
            message: 'Setup MCP configuration for Atlassian integration?',
            default: true,
            when: () => options.mcp !== false
          },
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'Overwrite existing files if they exist?',
            default: false,
            when: () => fs.existsSync(chatmodesDir) && fs.readdirSync(chatmodesDir).length > 0
          }
        ]);

        spinner.start('Installing selected chatmodes...');
        
        for (const chatmodeType of answers.chatmodes) {
          await installSpecificChatmode(sourceDir, chatmodesDir, instructionsDir, chatmodeType, answers.overwrite);
        }

        // Install dependencies if requested
        if (answers.installDeps) {
          spinner.text = 'Installing project dependencies...';
          await installProjectDependencies(targetPath, answers.overwrite);
        }

        // Setup MCP if requested
        if (answers.setupMcp) {
          spinner.text = 'Setting up MCP configuration...';
          await setupMcpConfiguration(sourceDir, answers.overwrite, options.profile);
        }
      }

      spinner.succeed(chalk.green('TestGenie installation completed successfully!'));
      
      // Track successful installation with more context
      const duration = Date.now() - startTime;
      await analytics.track('install_success', {
        projectPath: targetPath,
        duration: duration,
        command: 'install',
        ...options
      });
      
      console.log(chalk.yellow('\n📋 Next Steps:'));
      console.log('1. Open VS Code in your project directory');
      console.log('2. Restart VS Code to load MCP configuration');
      console.log('3. Open GitHub Copilot Chat');
      console.log('4. Type @ to see available chatmodes');
      console.log('5. Select your desired chatmode and start using it!\n');
      
      console.log(chalk.cyan('Available Chatmodes:'));
      console.log('• @TestGenie - Generate test cases and automation scripts');
      console.log('• @BugGenie - Create detailed bug reports and Jira tickets');
      console.log('• @ScriptGenerator - Generate Playwright automation scripts\n');

      console.log(chalk.magenta('Available npm scripts:'));
      console.log('• npm test - Run Playwright tests');
      console.log('• npm run test:headed - Run tests with visible browser');
      console.log('• npm run test:debug - Debug tests');
      console.log('• npm run report - View test report\n');
      
    } catch (error) {
      spinner.fail(chalk.red('Failed to install TestGenie'));
      await analytics.track('install_error', { error: error.message, ...options });
      console.error(chalk.red(error.message));
      process.exit(1);
    }
  });

program
  .command('auth')
  .description('Setup GitHub API authentication for analytics tracking')
  .option('--test', 'Test existing authentication')
  .option('--token <token>', 'Set GitHub token directly (not recommended for production)')
  .action(async (options) => {
    await analytics.track('command', { command: 'auth' });
    
    if (options.test) {
      console.log(chalk.blue('\n🔐 Testing GitHub API Authentication...\n'));
      
      // Run the authentication test
      try {
        const { execSync } = require('child_process');
        execSync('node test-github-auth.js', { stdio: 'inherit' });
      } catch (error) {
        console.error(chalk.red('❌ Authentication test failed'));
      }
      return;
    }
    
    console.log(chalk.blue('\n🔐 TestGenie GitHub API Authentication Setup\n'));
    
    console.log(chalk.yellow('📊 Why do you need this?'));
    console.log('   • Track real-time analytics (installations, usage)');
    console.log('   • Show your activities in the dashboard');
    console.log('   • Store analytics data in GitHub Issues\n');
    
    const currentToken = analytics.githubToken;
    if (currentToken) {
      console.log(chalk.green('✅ GitHub token already configured!'));
      console.log(`   Token: ${currentToken.substring(0, 10)}...`);
      console.log('\n   Run: testgenie auth --test');
      return;
    }
    
    console.log(chalk.red('❌ No GitHub token found\n'));
    
    console.log(chalk.cyan('🔑 Setup Steps:'));
    console.log('1. Create Personal Access Token:');
    console.log('   👉 https://github.com/settings/tokens');
    console.log('   📝 Select: repo, workflow permissions\n');
    
    console.log('2. Set environment variable:');
    if (os.platform() === 'win32') {
      console.log(chalk.green('   Windows PowerShell (Run as Admin):'));
      console.log('   [Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "ghp_your_token", "User")');
      console.log(chalk.green('   Windows Command Prompt (Run as Admin):'));
      console.log('   setx GITHUB_TOKEN "ghp_your_token" /M');
    } else {
      console.log(chalk.green('   macOS/Linux:'));
      console.log('   export GITHUB_TOKEN="ghp_your_token"');
      console.log('   echo \'export GITHUB_TOKEN="ghp_your_token"\' >> ~/.bashrc');
    }
    
    console.log('\n3. Restart terminal and test:');
    console.log('   testgenie auth --test\n');
    
    console.log(chalk.magenta('📖 Full setup guide: GITHUB_AUTH_SETUP.md'));
    
    if (options.token) {
      console.log(chalk.yellow('\n⚠️  Setting token directly (temporary):'));
      process.env.GITHUB_TOKEN = options.token;
      console.log('   Token set for this session only');
      console.log('   Run: testgenie auth --test');
    }
  });

program
  .command('list')
  .description('List available chatmodes and features')
  .action(async () => {
    await analytics.track('command', { command: 'list' });
    
    console.log(chalk.blue('\n📋 TestGenie CLI Features:\n'));
    
    console.log(chalk.green('🚀 Full Installation Includes:'));
    console.log('   • GitHub Chatmodes for VS Code');
    console.log('   • Testing dependencies (Playwright, Mocha, etc.)');
    console.log('   • MCP configuration for Atlassian integration');
    console.log('   • VS Code settings optimization\n');
    
    console.log(chalk.green('🧞‍♀️ TestGenie') + ' - Test Case Generation Mode');
    console.log('   • Generate structured test cases from Jira tickets');
    console.log('   • Create automation scripts with Mocha framework');
    console.log('   • Support for multiple MLS systems\n');
    
    console.log(chalk.green('🪰 BugGenie') + ' - Bug Ticket Generation Mode');
    console.log('   • Create detailed bug reports');
    console.log('   • Integrate with Jira for ticket creation');
    console.log('   • Standardized bug report format\n');
    
    console.log(chalk.green('🤖 ScriptGenerator') + ' - Automation Script Generation');
    console.log('   • Generate Playwright test scripts');
    console.log('   • Real-time browser automation');
    console.log('   • End-to-end testing workflows\n');

    console.log(chalk.cyan('📦 Dependencies Installed:'));
    console.log('   • @playwright/test - Browser automation');
    console.log('   • mocha & chai - Testing framework');
    console.log('   • allure-playwright - Test reporting');
    console.log('   • typescript - Type safety');
    console.log('   • axios & dotenv - HTTP & environment\n');

    console.log(chalk.magenta('🔧 Available Commands After Installation:'));
    console.log('   • npm test - Run Playwright tests');
    console.log('   • npm run test:headed - Visual browser tests');
    console.log('   • npm run test:debug - Debug mode');
    console.log('   • npm run report - View test reports\n');
  });

program
  .command('update')
  .description('Update existing chatmodes to latest version')
  .action(async () => {
    await analytics.track('command', { command: 'update' });
    
    const spinner = ora('Checking for updates...').start();
    
    // Here you would implement update logic
    spinner.succeed(chalk.green('Chatmodes are up to date!'));
  });

program
  .command('analytics')
  .description('Open TestGenie Analytics Dashboard')
  .option('--url', 'Show analytics dashboard URL')
  .action(async (options) => {
    await analytics.track('command', { command: 'analytics' });
    
    const dashboardUrl = 'https://sjuberrafik-clgx.github.io/testgenie';
    
    if (options.url) {
      console.log(chalk.blue(`📊 Analytics Dashboard: ${dashboardUrl}`));
    } else {
      console.log(chalk.blue('\n📊 TestGenie Analytics Dashboard\n'));
      console.log(chalk.green('🌐 Opening dashboard in your browser...'));
      console.log(chalk.cyan(`🔗 URL: ${dashboardUrl}\n`));
      
      try {
        const { execSync } = require('child_process');
        const platform = os.platform();
        
        if (platform === 'darwin') {
          execSync(`open ${dashboardUrl}`);
        } else if (platform === 'win32') {
          execSync(`start ${dashboardUrl}`, { shell: true });
        } else {
          execSync(`xdg-open ${dashboardUrl}`);
        }
        
        console.log(chalk.green('✅ Dashboard opened successfully!'));
      } catch (error) {
        console.log(chalk.yellow('⚠️  Could not auto-open browser. Please visit the URL above manually.'));
      }
    }
  });

program
  .command('mcp')
  .description('Setup MCP (Model Context Protocol) configuration for VS Code')
  .option('-p, --profile <profile>', 'VS Code profile name (e.g., "1a6e6ee" or "default")')
  .option('-f, --force', 'Overwrite existing MCP configuration')
  .option('--list-profiles', 'List available VS Code profiles')
  .action(async (options) => {
    await analytics.track('command', { command: 'mcp' });
    
    if (options.listProfiles) {
      console.log(chalk.blue('\n📂 Available VS Code Profiles:\n'));
      
      const baseUserPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User');
      const profilesDir = path.join(baseUserPath, 'profiles');
      
      console.log(chalk.green('📁 Default') + chalk.gray(' - Standard VS Code user directory'));
      console.log(chalk.gray(`   Path: ${baseUserPath}`));
      
      if (fs.existsSync(profilesDir)) {
        const profiles = fs.readdirSync(profilesDir).filter(item => {
          const profilePath = path.join(profilesDir, item);
          return fs.statSync(profilePath).isDirectory();
        });
        
        if (profiles.length > 0) {
          profiles.forEach(profile => {
            const profilePath = path.join(profilesDir, profile);
            console.log(chalk.green(`📁 ${profile}`) + chalk.gray(' - Custom profile'));
            console.log(chalk.gray(`   Path: ${profilePath}`));
          });
        } else {
          console.log(chalk.gray('   No custom profiles found.'));
        }
      } else {
        console.log(chalk.gray('   No profiles directory found.'));
      }
      return;
    }
    
    console.log(chalk.blue('\n⚙️  Setting up MCP Configuration...\n'));
    
    try {
      const sourceDir = path.join(__dirname, '..');
      await setupMcpConfiguration(sourceDir, options.force, options.profile);
      
      console.log(chalk.green('\n✅ MCP Configuration completed successfully!'));
      console.log(chalk.yellow('\n📝 Next Steps:'));
      console.log('1. Restart VS Code to load the new MCP configuration');
      console.log('2. Update your Atlassian credentials in the MCP config file');
      console.log('3. Open GitHub Copilot Chat and test the Atlassian integration\n');
      
    } catch (error) {
      console.error(chalk.red(`❌ MCP setup failed: ${error.message}`));
      process.exit(1);
    }
  });

async function installProjectDependencies(projectPath, force = false) {
  const packageJsonPath = path.join(projectPath, 'package.json');
  const templatePackageJsonPath = path.join(__dirname, '../templates/project-package.json');
  
  let packageJson = {};
  
  // Read existing package.json or create new one
  if (fs.existsSync(packageJsonPath)) {
    packageJson = await fs.readJson(packageJsonPath);
  } else {
    // Create basic package.json
    packageJson = {
      "name": path.basename(projectPath),
      "version": "1.0.0",
      "description": `Project with TestGenie chatmodes - Created by TestGenie CLI v${require('../package.json').version}`
    };
  }
  
  // Read template dependencies
  const templatePackageJson = await fs.readJson(templatePackageJsonPath);
  
  // Merge dependencies
  packageJson.scripts = {
    ...packageJson.scripts,
    ...templatePackageJson.scripts
  };
  
  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    ...templatePackageJson.devDependencies
  };
  
  packageJson.dependencies = {
    ...packageJson.dependencies,
    ...templatePackageJson.dependencies
  };
  
  // Write updated package.json
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
  
  // Install dependencies
  try {
    execSync('npm install', { 
      cwd: projectPath, 
      stdio: 'pipe'
    });
  } catch (error) {
    throw new Error(`Failed to install dependencies: ${error.message}`);
  }
}

async function getVSCodeProfilePath(specifiedProfile = null) {
  const baseUserPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User');
  
  // Check for active profile from argv.json or other VS Code profile indicators
  const profilesDir = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'User', 'profiles');
  
  try {
    // Method 0: Use specified profile if provided
    if (specifiedProfile) {
      if (specifiedProfile === 'default') {
        console.log(chalk.blue(`📁 Using specified default VS Code user directory`));
        return baseUserPath;
      }
      
      const specifiedPath = path.join(profilesDir, specifiedProfile);
      if (fs.existsSync(specifiedPath)) {
        console.log(chalk.blue(`📁 Using specified profile: ${specifiedProfile}`));
        return specifiedPath;
      } else {
        console.log(chalk.yellow(`⚠️  Specified profile "${specifiedProfile}" not found, detecting automatically...`));
      }
    }
    // Method 1: Check for argv.json which might contain profile info
    const argvPath = path.join(os.homedir(), 'AppData', 'Roaming', 'Code', 'argv.json');
    if (fs.existsSync(argvPath)) {
      const argv = await fs.readJson(argvPath);
      if (argv.profile && argv.profile !== 'default') {
        const profilePath = path.join(profilesDir, argv.profile);
        if (fs.existsSync(profilePath)) {
          console.log(chalk.blue(`📁 Detected VS Code profile: ${argv.profile}`));
          return profilePath;
        }
      }
    }
    
    // Method 2: Check for recently used profiles in workspaceStorage
    const workspaceStorageDir = path.join(baseUserPath, 'workspaceStorage');
    if (fs.existsSync(workspaceStorageDir)) {
      try {
        // Look for profile indicators in workspace storage
        const workspaceFolders = fs.readdirSync(workspaceStorageDir);
        for (const folder of workspaceFolders) {
          const profileStoragePath = path.join(workspaceStorageDir, folder, 'workspace.json');
          if (fs.existsSync(profileStoragePath)) {
            const workspaceData = await fs.readJson(profileStoragePath);
            if (workspaceData.profile && workspaceData.profile !== 'default') {
              const profilePath = path.join(profilesDir, workspaceData.profile);
              if (fs.existsSync(profilePath)) {
                console.log(chalk.blue(`📁 Found workspace profile: ${workspaceData.profile}`));
                return profilePath;
              }
            }
          }
        }
      } catch (error) {
        // Continue to next method
      }
    }
    
    // Method 3: Check global state for active profile
    const globalStateDir = path.join(baseUserPath, 'globalStorage');
    if (fs.existsSync(globalStateDir)) {
      try {
        const stateFiles = fs.readdirSync(globalStateDir);
        for (const stateFile of stateFiles) {
          if (stateFile.includes('state.vscdb') || stateFile.includes('state.json')) {
            // VS Code often stores active profile info in state files
            // This is a simplified check - in reality, VS Code uses SQLite
            continue;
          }
        }
      } catch (error) {
        // Continue to next method
      }
    }
    
    // Method 4: Check for existing profiles and let user choose
    if (fs.existsSync(profilesDir)) {
      const profiles = fs.readdirSync(profilesDir).filter(item => {
        const profilePath = path.join(profilesDir, item);
        return fs.statSync(profilePath).isDirectory();
      });
      
      if (profiles.length > 0) {
        console.log(chalk.yellow(`\n📂 Found VS Code profiles:`));
        
        // Create choices for inquirer
        const choices = [
          { name: '📁 Default (Standard VS Code)', value: 'default' },
          ...profiles.map(profile => ({ 
            name: `📁 Profile: ${profile}`, 
            value: profile 
          }))
        ];
        
        try {
          const answer = await inquirer.prompt([{
            type: 'list',
            name: 'selectedProfile',
            message: 'Which VS Code profile should we install MCP configuration for?',
            choices: choices,
            default: profiles[0]
          }]);
          
          if (answer.selectedProfile === 'default') {
            console.log(chalk.blue(`📁 Using default VS Code user directory`));
            return baseUserPath;
          } else {
            const profilePath = path.join(profilesDir, answer.selectedProfile);
            console.log(chalk.blue(`📁 Using profile: ${answer.selectedProfile}`));
            return profilePath;
          }
          
        } catch (error) {
          // If inquirer fails (non-interactive), use first profile
          const firstProfile = profiles[0];
          const profilePath = path.join(profilesDir, firstProfile);
          console.log(chalk.blue(`📁 Non-interactive mode, using profile: ${firstProfile}`));
          return profilePath;
        }
      }
    }
    
    // Method 5: Fallback to default user directory
    console.log(chalk.gray(`📁 Using default VS Code user directory`));
    return baseUserPath;
    
  } catch (error) {
    console.log(chalk.gray(`📁 Profile detection failed, using default: ${error.message}`));
    return baseUserPath;
  }
}

async function setupMcpConfiguration(sourceDir, force = false, profile = null) {
  const userDataPath = await getVSCodeProfilePath(profile);
  const mcpConfigPath = path.join(userDataPath, 'mcp.json');
  
  // Try multiple possible locations for mcp.json template
  let templateMcpPath = path.join(sourceDir, 'mcp.json');
  
  // If not found, try the templates subdirectory
  if (!fs.existsSync(templateMcpPath)) {
    templateMcpPath = path.join(sourceDir, 'templates', 'mcp.json');
  }
  
  // If still not found, try relative to the CLI script location
  if (!fs.existsSync(templateMcpPath)) {
    templateMcpPath = path.join(__dirname, '..', 'templates', 'mcp.json');
  }
  
  // Ensure VS Code User directory exists
  await fs.ensureDir(userDataPath);
  
  let mcpConfig = {};
  
  // Read existing MCP config or create new one
  if (fs.existsSync(mcpConfigPath)) {
    if (!force) {
      // Merge with existing config
      mcpConfig = await fs.readJson(mcpConfigPath);
    }
  }
  
  // Read template MCP config
  if (!fs.existsSync(templateMcpPath)) {
    console.log(chalk.yellow(`\n⚠️  Warning: MCP template not found at ${templateMcpPath}`));
    console.log(chalk.white(`Creating basic MCP configuration...`));
    
    // Create a basic MCP config with Atlassian server
    const basicMcpConfig = {
      servers: {
        "atlassian/atlassian-mcp-server": {
          "type": "http",
          "url": "https://mcp.atlassian.com/v1/sse",
          "gallery": "https://api.mcp.github.com/2025-09-15/v0/servers/28c650c6-5e61-4ab7-9eb2-505be6350476",
          "version": "1.0.0"
        }
      }
    };
    
    mcpConfig.servers = {
      ...mcpConfig.servers,
      ...basicMcpConfig.servers
    };
  } else {
    const templateMcpConfig = await fs.readJson(templateMcpPath);
    
    // Merge configurations (preserve existing servers)
    if (!mcpConfig.servers) {
      mcpConfig.servers = {};
    }
    
    mcpConfig.servers = {
      ...mcpConfig.servers,
      ...templateMcpConfig.servers
    };
    
    // Also copy inputs if they exist
    if (templateMcpConfig.inputs) {
      mcpConfig.inputs = templateMcpConfig.inputs;
    }
  }
  
  // Write updated MCP config
  await fs.writeJson(mcpConfigPath, mcpConfig, { spaces: 2 });
  
  console.log(chalk.yellow(`\n⚠️  MCP Configuration Notice:`));
  console.log(chalk.white(`MCP config installed at: ${mcpConfigPath}`));
  console.log(chalk.white(`Please update the following environment variables in the MCP config:`));
  console.log(chalk.cyan(`• ATLASSIAN_API_TOKEN - Your Atlassian API token`));
  console.log(chalk.cyan(`• ATLASSIAN_USER_EMAIL - Your Atlassian email address`));
}

async function installSpecificChatmode(sourceDir, chatmodesDir, instructionsDir, type, force = false) {
  let chatmodeFile, instructionFile;
  
  switch (type) {
    case 'test':
      chatmodeFile = '֎🇦🇮🧞 TestGenie.chatmode.md';
      instructionFile = 'copilotinstruction.mdd';
      break;
    case 'bug':
      chatmodeFile = '🪰𖢥🧞‍♀️ BugGenie.chatmode.md';
      instructionFile = 'copilotinstruction.mdd';
      break;
    case 'script':
      chatmodeFile = '🧞‍♀️🤖 ScriptGenerator.chatmode.md';
      instructionFile = null; // ScriptGenerator might not need instructions
      break;
    default:
      throw new Error(`Unknown chatmode type: ${type}`);
  }
  
  // Copy chatmode file
  const sourceChatmode = path.join(sourceDir, 'chatmodes', chatmodeFile);
  const targetChatmode = path.join(chatmodesDir, chatmodeFile);
  
  if (fs.existsSync(sourceChatmode)) {
    if (!fs.existsSync(targetChatmode) || force) {
      await fs.copy(sourceChatmode, targetChatmode);
    }
  } else {
    console.log(chalk.yellow(`Warning: Template file not found: ${sourceChatmode}`));
  }
  
  // Copy instruction file if it exists
  if (instructionFile) {
    const sourceInstruction = path.join(sourceDir, 'instructions', instructionFile);
    const targetInstruction = path.join(instructionsDir, instructionFile);
    
    if (fs.existsSync(sourceInstruction)) {
      if (!fs.existsSync(targetInstruction) || force) {
        await fs.copy(sourceInstruction, targetInstruction);
      }
    } else {
      console.log(chalk.yellow(`Warning: Instruction file not found: ${sourceInstruction}`));
    }
  }
}

program.parse();