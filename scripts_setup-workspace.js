#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Promise-based question function
function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

// Check if a file exists and prompt for overwrite if necessary
async function shouldWriteFile(filePath, autoOverwrite = false) {
  if (fs.existsSync(filePath)) {
    if (autoOverwrite) return true;
    
    const answer = await askQuestion(`File ${filePath} already exists. Overwrite? (y/n): `);
    return answer.toLowerCase() === 'y';
  }
  return true;
}

// Create a directory if it doesn't exist
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dirPath}`);
    return true;
  }
  return false;
}

// Copy a file with validation
async function copyFileWithCheck(sourcePath, destPath, autoOverwrite = false) {
  if (!fs.existsSync(sourcePath)) {
    console.warn(`⚠️ Warning: Source file ${sourcePath} not found. Skipping.`);
    return false;
  }
  
  if (await shouldWriteFile(destPath, autoOverwrite)) {
    fs.copyFileSync(sourcePath, destPath);
    console.log(`✓ Configured ${destPath}`);
    return true;
  } else {
    console.log(`⏭️ Skipped ${destPath} (not overwritten)`);
    return false;
  }
}

// Write content to a file with validation
async function writeFileWithCheck(filePath, content, autoOverwrite = false) {
  if (await shouldWriteFile(filePath, autoOverwrite)) {
    const dir = path.dirname(filePath);
    ensureDir(dir);
    fs.writeFileSync(filePath, content);
    console.log(`✓ Created ${filePath}`);
    return true;
  } else {
    console.log(`⏭️ Skipped ${filePath} (not overwritten)`);
    return false;
  }
}

// Main setup function
async function setupWorkspace() {
  try {
    console.log('🚀 Setting up Cursor workspace...');
    
    // Get user configurations
    const projectName = await askQuestion('Enter project name: ');
    const projectType = await askQuestion('Enter project type (web, mobile, backend, desktop, library): ');
    const languages = (await askQuestion('Enter programming languages (comma-separated): ')).split(',').map(l => l.trim());
    const autoOverwrite = (await askQuestion('Automatically overwrite existing files? (y/n): ')).toLowerCase() === 'y';
    const includeRules = (await askQuestion('Include .cursorrules file? (y/n): ')).toLowerCase() === 'y';
    const enableEarlyAccess = (await askQuestion('Enable Early Access Program features? (y/n): ')).toLowerCase() === 'y';
    const enableBetaFeatures = (await askQuestion('Enable Beta features? (y/n): ')).toLowerCase() === 'y';
    
    // Create necessary directories
    const cursorDir = path.join(process.cwd(), '.cursor');
    const rulesDir = path.join(cursorDir, 'rules');
    const docsDir = path.join(process.cwd(), 'docs');
    
    ensureDir(cursorDir);
    ensureDir(rulesDir);
    ensureDir(docsDir);

    // Get the directory where this script is located
    const scriptDir = __dirname;
    const rootDir = path.join(scriptDir, '..');

    // Define the configuration files to copy
    const configFiles = {
      'cursor_settings.json': '.cursor/settings.json',
      'cursor_global-rules.json': '.cursor/global-rules.json',
      'cursor_rules_common-rules.json': '.cursor/rules/common-rules.json',
    };
    
    // Add web app rules only if project type is web
    if (projectType.toLowerCase() === 'web') {
      configFiles['cursor_rules_web-app-rules.json'] = '.cursor/rules/web-app-rules.json';
    }

    // Define the documentation files to copy
    const docFiles = {
      'docs_reference.md': 'docs/reference.md',
      'docs_troubleshooting.md': 'docs/troubleshooting.md'
    };
    
    // Add optional documentation files
    if (enableEarlyAccess) {
      docFiles['docs_early-access-program.md'] = 'docs/early-access-program.md';
    }
    
    if (enableBetaFeatures) {
      docFiles['docs_beta-settings.md'] = 'docs/beta-settings.md';
    }

    // Copy each configuration file
    for (const [source, dest] of Object.entries(configFiles)) {
      const sourcePath = path.join(rootDir, source);
      const destPath = path.join(process.cwd(), dest);
      
      await copyFileWithCheck(sourcePath, destPath, autoOverwrite);
    }

    // Copy each documentation file
    for (const [source, dest] of Object.entries(docFiles)) {
      const sourcePath = path.join(rootDir, source);
      const destPath = path.join(process.cwd(), dest);
      
      await copyFileWithCheck(sourcePath, destPath, autoOverwrite);
    }

    // Create or update settings.json with project-specific information
    const settingsPath = path.join(cursorDir, 'settings.json');
    if (fs.existsSync(settingsPath)) {
      try {
        const settingsContent = fs.readFileSync(settingsPath, 'utf8');
        const settings = JSON.parse(settingsContent);
        
        // Update settings with project-specific information
        if (!settings.workspace) settings.workspace = {};
        settings.workspace.name = projectName;
        settings.workspace.type = projectType;
        settings.workspace.languages = languages;
        
        // Update early access and beta settings
        if (!settings.updates) settings.updates = {};
        settings.updates.earlyAccessProgram = enableEarlyAccess;
        
        if (!settings.beta) settings.beta = {};
        settings.beta.experimentalAIFeatures = enableBetaFeatures;
        settings.beta.advancedCompletion = enableBetaFeatures;
        
        // Write updated settings
        await writeFileWithCheck(settingsPath, JSON.stringify(settings, null, 2), true);
      } catch (error) {
        console.warn(`⚠️ Warning: Could not update settings.json: ${error.message}`);
      }
    }

    // Create .cursorrules file if requested
    if (includeRules) {
      const cursorRulesPath = path.join(process.cwd(), '.cursorrules');
      const cursorRulesContent = `// Custom rules for Cursor AI for ${projectName}
// These rules will be applied to all AI interactions

Always use consistent code style
Focus on performance and readability
Prefer modern ${languages[0] || 'JavaScript'} syntax
Write comprehensive comments for complex logic
Provide example usage where appropriate`;
      
      await writeFileWithCheck(cursorRulesPath, cursorRulesContent, autoOverwrite);
    }

    console.log('✨ Workspace setup completed successfully!');
    console.log('🔍 Your Cursor workspace is now configured and ready to use.');
    console.log('');
    console.log('To start using your configured workspace:');
    console.log('1. Open your project in Cursor');
    console.log('2. Cursor will automatically detect and use your configuration');
    
    // Close the readline interface
    rl.close();
  } catch (error) {
    console.error('❌ Error setting up workspace:', error);
    rl.close();
    process.exit(1);
  }
}

// Run setup
setupWorkspace();