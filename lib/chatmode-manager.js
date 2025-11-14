const fs = require('fs-extra');
const path = require('path');

class ChatmodeManager {
  constructor(projectPath) {
    this.projectPath = projectPath;
    this.githubDir = path.join(projectPath, '.github');
    this.chatmodesDir = path.join(this.githubDir, 'chatmodes');
    this.instructionsDir = path.join(this.githubDir, 'instructions');
  }

  async ensureDirectories() {
    await fs.ensureDir(this.chatmodesDir);
    await fs.ensureDir(this.instructionsDir);
  }

  async getInstalledChatmodes() {
    try {
      if (!fs.existsSync(this.chatmodesDir)) {
        return [];
      }
      
      const files = await fs.readdir(this.chatmodesDir);
      return files.filter(file => file.endsWith('.chatmode.md'));
    } catch (error) {
      return [];
    }
  }

  async validateProject() {
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    const gitDir = path.join(this.projectPath, '.git');
    
    return fs.existsSync(packageJsonPath) || fs.existsSync(gitDir);
  }

  async createVSCodeSettings() {
    const vscodeDir = path.join(this.projectPath, '.vscode');
    const settingsFile = path.join(vscodeDir, 'settings.json');
    
    await fs.ensureDir(vscodeDir);
    
    let settings = {};
    if (fs.existsSync(settingsFile)) {
      try {
        settings = await fs.readJson(settingsFile);
      } catch (error) {
        // If settings.json is corrupted, start fresh
        settings = {};
      }
    }
    
    // Add chatmode-related settings
    settings['chat.useNestedAgentsMdFiles'] = true;
    settings['chat.agentSessionsViewLocation'] = 'view';
    
    await fs.writeJson(settingsFile, settings, { spaces: 2 });
  }
}

module.exports = {
  ChatmodeManager
};