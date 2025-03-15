// Configuration state
const config = {
  projectName: '',
  projectType: '',
  programmingLanguages: [],
  frameworks: [],
  editorSettings: {
    tabSize: 2,
    insertSpaces: true,
    formatOnSave: true
  },
  aiRules: '',
  includeCursorRules: true,
  importVSCodeSettings: false,
  enableEarlyAccess: false,
  betaFeatures: {
    experimentalAIFeatures: false,
    advancedCompletion: false,
    alternativeModels: false
  }
};

// Default configurations for quick setup
const defaultConfigs = {
  "web": {
    projectType: 'Web Application',
    programmingLanguages: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
    frameworks: ['React', 'Next.js'],
    aiRules: 'Always use functional React components\nPrefer modern JavaScript syntax\nUse proper accessibility attributes\nComment complex logic',
    enableEarlyAccess: true,
    betaFeatures: {
      experimentalAIFeatures: true,
      advancedCompletion: true,
      alternativeModels: false
    }
  },
  "mobile": {
    projectType: 'Mobile App',
    programmingLanguages: ['JavaScript', 'TypeScript'],
    frameworks: ['React Native'],
    aiRules: 'Follow mobile design best practices\nOptimize for performance\nLimit bundle size\nUse platform-specific APIs when necessary',
    enableEarlyAccess: true,
    betaFeatures: {
      experimentalAIFeatures: true,
      advancedCompletion: true,
      alternativeModels: false
    }
  },
  "backend": {
    projectType: 'Backend Service',
    programmingLanguages: ['JavaScript', 'TypeScript', 'Python'],
    frameworks: ['Node.js', 'Express'],
    aiRules: 'Use proper error handling\nImplement input validation\nFollow security best practices\nInclude comprehensive logging',
    enableEarlyAccess: true,
    betaFeatures: {
      experimentalAIFeatures: true,
      advancedCompletion: true,
      alternativeModels: false
    }
  },
  "fullstack": {
    projectType: 'Web Application',
    programmingLanguages: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Python'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express'],
    aiRules: 'Always use functional React components\nPrefer modern JavaScript syntax\nUse proper error handling\nImplement input validation\nFollow security best practices',
    enableEarlyAccess: true,
    betaFeatures: {
      experimentalAIFeatures: true,
      advancedCompletion: true,
      alternativeModels: false
    }
  }
};

// Terminal state
let currentStep = 0;
let isCustomSetup = true;

const setupOptions = [
  { prompt: 'Welcome to Cursor Workspace Setup!\n\nChoose setup mode:\n1) Quick Setup (recommended defaults)\n2) Custom Setup (answer all questions)\nEnter number:', isOption: true }
];

const quickSetupSteps = [
  { prompt: 'What is your project name?', field: 'projectName' },
  { 
    prompt: 'What type of project template do you want to use?\n1) Web Frontend\n2) Mobile App\n3) Backend Service\n4) Full-Stack App\nEnter number:', 
    field: 'templateType',
    process: (input) => {
      const options = ['web', 'mobile', 'backend', 'fullstack'];
      const selection = parseInt(input);
      if (selection >= 1 && selection <= options.length) {
        return options[selection - 1];
      }
      return 'web'; // Default to web if invalid input
    }
  }
];

const customSetupSteps = [
  { prompt: 'What is your project name?', field: 'projectName' },
  { 
    prompt: 'What type of project is this?\n1) Web Application\n2) Mobile App\n3) Backend Service\n4) Desktop Application\n5) Library/Package\nEnter number:', 
    field: 'projectType',
    process: (input) => {
      const options = ['Web Application', 'Mobile App', 'Backend Service', 'Desktop Application', 'Library/Package'];
      const selection = parseInt(input);
      if (selection >= 1 && selection <= options.length) {
        return options[selection - 1];
      }
      return input;
    }
  },
  { 
    prompt: 'What programming languages will you use? (Enter comma-separated list)', 
    field: 'programmingLanguages',
    process: (input) => input.split(',').map(lang => lang.trim())
  },
  { 
    prompt: 'What frameworks will you use? (Enter comma-separated list, or "none")', 
    field: 'frameworks',
    process: (input) => input === 'none' ? [] : input.split(',').map(fw => fw.trim())
  },
  { 
    prompt: 'Tab size? (Default: 2)', 
    field: 'editorSettings.tabSize',
    process: (input) => input ? parseInt(input) : 2
  },
  { 
    prompt: 'Insert spaces instead of tabs? (y/n, Default: y)', 
    field: 'editorSettings.insertSpaces',
    process: (input) => input.toLowerCase() !== 'n'
  },
  { 
    prompt: 'Format on save? (y/n, Default: y)', 
    field: 'editorSettings.formatOnSave',
    process: (input) => input.toLowerCase() !== 'n'
  },
  {
    prompt: 'Enter AI rules for Cursor (e.g., "always use functional React, never use unwrap in rust"):', 
    field: 'aiRules',
    process: (input) => input
  },
  {
    prompt: 'Include .cursorrules files? (y/n, Default: y)', 
    field: 'includeCursorRules',
    process: (input) => input.toLowerCase() !== 'n'
  },
  {
    prompt: 'Would you like to import VS Code settings? (y/n, Default: n)', 
    field: 'importVSCodeSettings',
    process: (input) => input.toLowerCase() === 'y'
  },
  {
    prompt: 'Enable Early Access Program features? (y/n, Default: n)', 
    field: 'enableEarlyAccess',
    process: (input) => input.toLowerCase() === 'y'
  },
  {
    prompt: 'Enable experimental AI features (beta)? (y/n, Default: n)', 
    field: 'betaFeatures.experimentalAIFeatures',
    process: (input) => input.toLowerCase() === 'y'
  },
  {
    prompt: 'Enable advanced completion (beta)? (y/n, Default: n)', 
    field: 'betaFeatures.advancedCompletion',
    process: (input) => input.toLowerCase() === 'y'
  }
];

// Current active steps
let steps = setupOptions;

// DOM elements
const terminalContent = document.getElementById('terminal-content');
const terminalInput = document.getElementById('terminal-input');
const downloadSection = document.getElementById('download-section');
const downloadBtn = document.getElementById('download-btn');
const restartBtn = document.getElementById('restart-btn');
const webPresetBtn = document.getElementById('web-preset');
const mobilePresetBtn = document.getElementById('mobile-preset');
const backendPresetBtn = document.getElementById('backend-preset');
const fullstackPresetBtn = document.getElementById('fullstack-preset');

// Initialize
window.onload = () => {
  printToTerminal(steps[currentStep].prompt);
  
  terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleInput();
    }
  });
  
  downloadBtn.addEventListener('click', generateAndDownloadFiles);
  restartBtn.addEventListener('click', restart);
  
  // Setup preset buttons
  webPresetBtn.addEventListener('click', () => applyPreset('web'));
  mobilePresetBtn.addEventListener('click', () => applyPreset('mobile'));
  backendPresetBtn.addEventListener('click', () => applyPreset('backend'));
  fullstackPresetBtn.addEventListener('click', () => applyPreset('fullstack'));
};

// Terminal functions
function printToTerminal(text, isInput = false) {
  const line = document.createElement('div');
  line.className = 'terminal-output';
  
  if (isInput) {
    line.innerHTML = `<span class="prompt">></span> ${text}`;
  } else {
    line.textContent = text;
  }
  
  terminalContent.appendChild(line);
  
  // Auto-scroll to bottom
  const terminal = document.getElementById('terminal');
  terminal.scrollTop = terminal.scrollHeight;
}

function handleInput() {
  const input = terminalInput.value;
  printToTerminal(input, true);
  terminalInput.value = '';
  
  if (steps[currentStep].isOption) {
    // Handle setup mode selection
    if (input === '1') {
      isCustomSetup = false;
      steps = quickSetupSteps;
      printToTerminal('Quick Setup mode selected. You\'ll be asked for minimal information and the rest will be configured with recommended defaults.');
    } else {
      isCustomSetup = true;
      steps = customSetupSteps;
      printToTerminal('Custom Setup mode selected. You\'ll be asked for detailed configuration options.');
    }
    currentStep = 0;
    printToTerminal(steps[currentStep].prompt);
    return;
  }
  
  // Process the input
  processStep(input);
  
  // Move to next step or finish
  if (currentStep < steps.length) {
    printToTerminal(steps[currentStep].prompt);
  } else {
    if (!isCustomSetup) {
      // Apply template defaults based on selection
      applyTemplateDefaults();
    }
    finishSetup();
  }
}

function processStep(input) {
  const step = steps[currentStep - 1];
  if (!step) return;
  
  // Process the input if needed
  const value = step.process ? step.process(input) : input;
  
  // Update the configuration
  if (step.field === 'templateType') {
    // Store the template choice for later
    config.templateType = value;
  } else if (step.field.includes('.')) {
    const [obj, prop] = step.field.split('.');
    config[obj][prop] = value;
  } else {
    config[step.field] = value;
  }
  
  currentStep++;
}

function applyTemplateDefaults() {
  const templateType = config.templateType || 'web';
  const template = defaultConfigs[templateType];
  
  // Apply template settings to config
  config.projectType = template.projectType;
  config.programmingLanguages = template.programmingLanguages;
  config.frameworks = template.frameworks;
  config.aiRules = template.aiRules;
  config.enableEarlyAccess = template.enableEarlyAccess;
  config.betaFeatures = template.betaFeatures;
  
  // Print a summary of applied settings
  printToTerminal('');
  printToTerminal('Applied recommended settings:');
  printToTerminal(`• Project type: ${config.projectType}`);
  printToTerminal(`• Languages: ${config.programmingLanguages.join(', ')}`);
  printToTerminal(`• Frameworks: ${config.frameworks.join(', ')}`);
  printToTerminal(`• Early Access features: ${config.enableEarlyAccess ? 'Enabled' : 'Disabled'}`);
  printToTerminal(`• Beta features: ${Object.entries(config.betaFeatures)
    .filter(([_, v]) => v)
    .map(([k, _]) => k)
    .join(', ') || 'None'}`);
  printToTerminal('');
}

function finishSetup() {
  printToTerminal('✅ Configuration complete! Here\'s your setup:');
  printToTerminal(JSON.stringify(config, null, 2));
  printToTerminal('Preparing your workspace files...');
  
  setTimeout(() => {
    printToTerminal('✨ Done! Your files are ready to download.');
    printToTerminal('');
    printToTerminal('To use your configured workspace:');
    printToTerminal('1. Download and extract the ZIP file to your project directory');
    printToTerminal('2. Open Cursor and select "Open Folder..." from the menu');
    printToTerminal('3. Navigate to and select your project directory');
    printToTerminal('4. Start coding with your optimized settings!');
    
    // Show download section
    downloadSection.classList.remove('hidden');
    
    // Hide input line
    document.querySelector('.terminal-input-line').style.display = 'none';
  }, 1500);
}

// Generate and download files
async function generateAndDownloadFiles() {
  const zip = new JSZip();
  
  // Create the .cursor directory structure directly
  zip.folder('.cursor');
  zip.folder('.cursor/rules');
  
  // Add cursor settings
  const settings = generateSettings();
  zip.file('.cursor/settings.json', JSON.stringify(settings, null, 2));
  
  // Add global rules
  const globalRules = generateGlobalRules();
  zip.file('.cursor/global-rules.json', JSON.stringify(globalRules, null, 2));
  
  // Add common rules
  const commonRules = generateCommonRules();
  zip.file('.cursor/rules/common-rules.json', JSON.stringify(commonRules, null, 2));
  
  // Add web app rules if applicable
  if (config.projectType === 'Web Application') {
    const webAppRules = generateWebAppRules();
    zip.file('.cursor/rules/web-app-rules.json', JSON.stringify(webAppRules, null, 2));
  }
  
  // Add project rules
  const projectRules = generateProjectRules();
  zip.file('.cursor/project-rules.json', JSON.stringify(projectRules, null, 2));
  
  // Add .cursorrules file if enabled
  if (config.includeCursorRules) {
    zip.file('.cursorrules', generateCursorRulesFile());
  }
  
  // Add documentation
  zip.folder('docs');
  zip.file('docs/reference.md', generateReferenceDocs());
  zip.file('docs/troubleshooting.md', generateTroubleshootingDocs());
  zip.file('docs/beta-settings.md', generateBetaSettingsDocs());
  zip.file('docs/early-access-program.md', generateEarlyAccessDocs());
  
  // Add README
  zip.file('README.md', generateReadme());
  
  // Generate the zip file
  const content = await zip.generateAsync({ type: 'blob' });
  
  // Save the file
  saveAs(content, `${config.projectName.replace(/\s+/g, '-').toLowerCase()}-cursor-workspace.zip`);
}

function restart() {
  // Reset configuration
  Object.assign(config, {
    projectName: '',
    projectType: '',
    programmingLanguages: [],
    frameworks: [],
    editorSettings: {
      tabSize: 2,
      insertSpaces: true,
      formatOnSave: true
    },
    aiRules: '',
    includeCursorRules: true,
    importVSCodeSettings: false,
    enableEarlyAccess: false,
    betaFeatures: {
      experimentalAIFeatures: false,
      advancedCompletion: false,
      alternativeModels: false
    }
  });
  
  // Reset terminal
  currentStep = 0;
  steps = setupOptions;
  terminalContent.innerHTML = '';
  document.querySelector('.terminal-input-line').style.display = 'flex';
  downloadSection.classList.add('hidden');
  
  // Start over
  printToTerminal(steps[currentStep].prompt);
}

// Generate configuration files
function generateSettings() {
  return {
    editor: {
      formatOnSave: config.editorSettings.formatOnSave,
      tabSize: config.editorSettings.tabSize,
      insertSpaces: config.editorSettings.insertSpaces,
      defaultFormatter: "cursor",
      fontFamily: "Menlo, Monaco, 'Courier New', monospace",
      fontSize: 14,
      lineHeight: 1.5,
      wordWrap: "on"
    },
    ai: {
      enabled: true,
      model: "default",
      suggestions: true,
      rules: config.aiRules,
      includeCursorRulesFile: config.includeCursorRules,
      autoComplete: true
    },
    workspace: {
      name: config.projectName,
      type: config.projectType,
      languages: config.programmingLanguages,
      frameworks: config.frameworks,
      importVSCodeSettings: config.importVSCodeSettings
    },
    updates: {
      earlyAccessProgram: config.enableEarlyAccess,
      automaticUpdates: true,
      checkForUpdatesOnStartup: true
    },
    beta: {
      experimentalAIFeatures: config.betaFeatures.experimentalAIFeatures,
      advancedCompletion: config.betaFeatures.advancedCompletion,
      alternativeModels: config.betaFeatures.alternativeModels
    }
  };
}

function generateGlobalRules() {
  return {
    rules: [
      {
        name: "Code Quality",
        description: "Basic code quality rules",
        enabled: true,
        patterns: [
          "**/*.{js,ts,jsx,tsx}",
          "**/*.{py,rb}",
          "**/*.{java,c,cpp,h,hpp}"
        ]
      },
      {
        name: "Documentation Standards",
        description: "Enforce documentation standards",
        enabled: true,
        patterns: [
          "**/*.{js,ts,jsx,tsx,py,java,c,cpp}"
        ]
      },
      {
        name: "Security Best Practices",
        description: "Follow security best practices",
        enabled: true,
        patterns: [
          "**/*.{js,ts,jsx,tsx,py,rb,php}"
        ]
      }
    ]
  };
}

function generateCommonRules() {
  return {
    rules: [
      {
        name: "Naming Conventions",
        description: "Enforce consistent naming conventions",
        enabled: true,
        conventions: [
          "Use camelCase for variables and functions",
          "Use PascalCase for classes and components",
          "Use UPPER_CASE for constants"
        ]
      },
      {
        name: "Documentation",
        description: "Encourage documentation for public APIs",
        enabled: true,
        conventions: [
          "Document all public functions and methods",
          "Include parameter descriptions",
          "Include return value descriptions"
        ]
      },
      {
        name: "Error Handling",
        description: "Ensure proper error handling",
        enabled: true,
        conventions: [
          "Use try/catch for error-prone operations",
          "Provide meaningful error messages",
          "Log errors appropriately"
        ]
      }
    ]
  };
}

function generateWebAppRules() {
  return {
    rules: [
      {
        name: "Accessibility",
        description: "Ensure web accessibility standards",
        enabled: true,
        conventions: [
          "Use semantic HTML elements",
          "Include alt text for images",
          "Ensure keyboard navigation support",
          "Maintain proper color contrast"
        ]
      },
      {
        name: "Performance",
        description: "Optimize for performance",
        enabled: true,
        conventions: [
          "Minimize bundle size",
          "Lazy load components when appropriate",
          "Optimize images and assets",
          "Avoid unnecessary re-renders"
        ]
      },
      {
        name: "Responsive Design",
        description: "Ensure responsive design principles",
        enabled: true,
        conventions: [
          "Use relative units (rem, em, %)",
          "Implement mobile-first design",
          "Use media queries for breakpoints",
          "Test on multiple device sizes"
        ]
      }
    ]
  };
}

function generateProjectRules() {
  // Generate project rules based on project type and languages
  const rules = [];
  
  if (config.programmingLanguages.includes('JavaScript') || 
      config.programmingLanguages.includes('TypeScript')) {
    rules.push({
      name: "JS/TS Conventions",
      description: "Follow project JavaScript/TypeScript conventions",
      pattern: "**/*.{js,ts,jsx,tsx}",
      rules: [
        "Use ES6+ features when available",
        "Prefer const over let when variable is not reassigned",
        "Use camelCase for variables and functions"
      ]
    });
  }
  
  if (config.programmingLanguages.includes('Python')) {
    rules.push({
      name: "Python Conventions",
      description: "Follow project Python conventions",
      pattern: "**/*.py",
      rules: [
        "Follow PEP 8 style guide",
        "Use snake_case for variables and functions",
        "Use docstrings for functions and classes"
      ]
    });
  }
  
  if (config.projectType === 'Web Application') {
    rules.push({
      name: "Web App Structure",
      description: "Follow web application architecture conventions",
      pattern: "**/*",
      rules: [
        "Separate concerns between frontend and backend",
        "Use components for UI elements",
        "Follow RESTful API design principles"
      ]
    });
  }
  
  return { rules };
}

function generateCursorRulesFile() {
  let content = `// Custom rules for Cursor AI\n// These rules will be applied to all AI interactions\n\n`;
  
  if (config.aiRules) {
    content += config.aiRules;
  } else {
    content += `Always use consistent code style
Focus on performance and readability
Prefer modern JavaScript syntax
Write comprehensive comments for complex logic
Provide example usage where appropriate`;
  }
  
  return content;
}

function generateReferenceDocs() {
  return `# ${config.projectName} Cursor Workspace Reference

## Project Details
- **Project Type**: ${config.projectType}
- **Languages**: ${config.programmingLanguages.join(', ')}
- **Frameworks**: ${config.frameworks.length > 0 ? config.frameworks.join(', ') : 'None'}

## Configuration Files

The setup includes the following structure in your project:

\`\`\`
.cursor/
├── settings.json
├── global-rules.json
├── project-rules.json
└── rules/
    ├── common-rules.json
    ${config.projectType === 'Web Application' ? '└── web-app-rules.json\n' : ''}
${config.includeCursorRules ? '.cursorrules\n' : ''}
\`\`\`

### Settings Customization

You can customize your workspace by modifying the \`.cursor/settings.json\` file:

- \`editor\`: Configure editor behavior
- \`ai\`: Configure AI assistance features
- \`workspace\`: Workspace-specific settings
- \`updates\`: Configure update behavior
- \`beta\`: Enable/disable beta features

## Early Access Program

${config.enableEarlyAccess ? 'This workspace has Early Access Program features enabled.' : 'You can enable Early Access Program features in the settings.'}

For more information, see the [Early Access Program documentation](./early-access-program.md).

## Beta Features

${config.betaFeatures.experimentalAIFeatures || config.betaFeatures.advancedCompletion || config.betaFeatures.alternativeModels ? 'This workspace has beta features enabled:' : 'No beta features are currently enabled.'}
${config.betaFeatures.experimentalAIFeatures ? '- Experimental AI Features' : ''}
${config.betaFeatures.advancedCompletion ? '- Advanced Completion' : ''}
${config.betaFeatures.alternativeModels ? '- Alternative Models' : ''}

For more information, see the [Beta Settings documentation](./beta-settings.md).
`;
}

function generateTroubleshootingDocs() {
  return `# Troubleshooting

## Common Issues

### Configuration Files Not Applied

1. Ensure the \`.cursor\` directory is at the root of your project
2. Restart Cursor after opening the project
3. Check file permissions
4. Verify JSON files are correctly formatted

### AI Features Not Working

1. Ensure you are logged in to Cursor
2. Check your internet connection
3. Verify that AI is enabled in settings (ai.enabled: true)
4. Try switching AI models in settings

${config.enableEarlyAccess ? `
### Early Access Features Not Available

1. Verify you've joined the Early Access Program (see [Early Access Program](./early-access-program.md))
2. Update to the latest version of Cursor
3. Restart Cursor after enabling Early Access Program
` : ''}

${config.betaFeatures.experimentalAIFeatures || config.betaFeatures.advancedCompletion || config.betaFeatures.alternativeModels ? `
### Beta Features Issues

1. Beta features may cause unexpected behavior
2. If experiencing issues, try disabling beta features in settings
3. Report any issues to the Cursor team
` : ''}

### Editor Performance Issues

1. ${config.betaFeatures.experimentalAIFeatures || config.betaFeatures.advancedCompletion || config.betaFeatures.alternativeModels ? 'Disable beta features if enabled' : 'Consider disabling beta features if you enable them later'}
2. Close unused files and tabs
3. Reduce the size of the workspace by excluding large directories

## Getting Help

If you continue to experience issues:

1. Check the [Cursor documentation](https://cursor.sh/docs)
2. Join the [Cursor community](https://discord.gg/cursor)
3. File an issue on GitHub
4. Contact Cursor support via the Help menu
`;
}

function generateBetaSettingsDocs() {
  return `# Beta Settings

Cursor includes beta features that may still be under development. These can be enabled in your \`.cursor/settings.json\` file.

## Available Beta Features

\`\`\`json
{
  "beta": {
    "experimentalAIFeatures": ${config.betaFeatures.experimentalAIFeatures},
    "advancedCompletion": ${config.betaFeatures.advancedCompletion},
    "alternativeModels": ${config.betaFeatures.alternativeModels}
  }
}
\`\`\`

### experimentalAIFeatures
Enables experimental AI features that are still being tested. These may change or be removed in future updates.

### advancedCompletion
Enables more advanced code completion algorithms that may provide better suggestions but might be less stable.

### alternativeModels
Allows using alternative AI models for code generation and assistance.

## Enabling Beta Features

To enable a beta feature, set its value to \`true\` in your settings file. For example:

\`\`\`json
{
  "beta": {
    "experimentalAIFeatures": true
  }
}
\`\`\`

## Early Access Program

Beta features are often available first through the Early Access Program. For more information, see the [Early Access Program documentation](./early-access-program.md).

Note: Beta features may impact performance or stability. Use with caution in production environments.
`;
}

function generateEarlyAccessDocs() {
  return `# Early Access Program

The Cursor Early Access Program gives you access to new features before they're generally available.

## How to Join

1. Open Cursor
2. Go to Settings
3. Navigate to the "Updates" section
4. Enable "Early Access Program"
5. Restart Cursor

## Benefits

- Try new features before they're released
- Provide feedback directly to the Cursor team
- Help shape the future of the editor
- Access to exclusive features

## Current Early Access Features

- Advanced AI code review
- Multi-file refactoring
- Context-aware code explanations
- Performance optimizations

## Providing Feedback

Your feedback helps improve Cursor for everyone. To provide feedback on Early Access features:

1. Click the feedback button in the lower right corner
2. Select "Early Access Feedback"
3. Describe your experience and suggestions

## Leaving the Program

You can leave the Early Access Program at any time:

1. Open Cursor
2. Go to Settings
3. Navigate to the "Updates" section
4. Disable "Early Access Program"
5. Restart Cursor

Note: After leaving, you'll return to the latest stable release.
`;
}

function generateReadme() {
  return `# ${config.projectName} - Cursor Workspace

This package contains pre-configured workspace settings for Cursor editor to speed up development for this ${config.projectType} project.

## Quick Start

1. Extract this ZIP file to your project directory
2. Open Cursor and select "Open Folder..." from the menu
3. Navigate to and select your project directory
4. Start coding with your optimized settings!

## What's Included

- Editor settings (tab size: ${config.editorSettings.tabSize}, ${config.editorSettings.insertSpaces ? 'spaces' : 'tabs'}, format on save: ${config.editorSettings.formatOnSave ? 'enabled' : 'disabled'})
- AI assistance configurations with custom rules
- Project-specific rules that help the AI understand your codebase
- ${config.includeCursorRules ? '.cursorrules file for AI behavior' : 'No .cursorrules file included (disabled)'}
- ${config.importVSCodeSettings ? 'VS Code settings import enabled' : 'VS Code settings import disabled'}
- ${config.enableEarlyAccess ? 'Early Access Program features enabled' : 'Early Access Program features disabled'}
- ${config.betaFeatures.experimentalAIFeatures || config.betaFeatures.advancedCompletion || config.betaFeatures.alternativeModels ? 'Beta features enabled' : 'Beta features disabled'}

## AI Rules

The following AI rules have been configured:
\`\`\`
${config.aiRules || 'No specific AI rules configured'}
\`\`\`

## Languages & Frameworks

- Languages: ${config.programmingLanguages.join(', ')}
- Frameworks: ${config.frameworks.length > 0 ? config.frameworks.join(', ') : 'None'}

## Documentation

See the \`docs\` directory for detailed reference and troubleshooting information:
- reference.md - General reference for your workspace configuration
- troubleshooting.md - Solutions for common issues
- beta-settings.md - Information about beta features
- early-access-program.md - Details about early access features
`;
}

// Apply preset configuration and jump to final step
function applyPreset(presetType) {
  // Reset terminal
  terminalContent.innerHTML = '';
  
  // Reset configuration
  Object.assign(config, {
    projectName: '',
    projectType: '',
    programmingLanguages: [],
    frameworks: [],
    editorSettings: {
      tabSize: 2,
      insertSpaces: true,
      formatOnSave: true
    },
    aiRules: '',
    includeCursorRules: true,
    importVSCodeSettings: false,
    enableEarlyAccess: false,
    betaFeatures: {
      experimentalAIFeatures: false,
      advancedCompletion: false,
      alternativeModels: false
    }
  });
  
  // Print welcome message for preset
  printToTerminal(`Welcome to Cursor Workspace Setup - ${presetType.charAt(0).toUpperCase() + presetType.slice(1)} Preset!`);
  
  // Ask for project name
  printToTerminal('What is your project name?');
  
  // Setup one-time event listener for project name
  const onProjectNameEntered = (e) => {
    if (e.key === 'Enter') {
      const projectName = terminalInput.value;
      printToTerminal(projectName, true);
      terminalInput.value = '';
      
      // Remove this event listener after use
      terminalInput.removeEventListener('keypress', onProjectNameEntered);
      
      // Set project name
      config.projectName = projectName;
      
      // Apply preset defaults
      const template = defaultConfigs[presetType];
      config.projectType = template.projectType;
      config.programmingLanguages = template.programmingLanguages;
      config.frameworks = template.frameworks;
      config.aiRules = template.aiRules;
      config.enableEarlyAccess = template.enableEarlyAccess;
      config.betaFeatures = template.betaFeatures;
      
      // Print summary
      printToTerminal('');
      printToTerminal(`Applying ${presetType} preset with recommended settings:`);
      printToTerminal(`• Project type: ${config.projectType}`);
      printToTerminal(`• Languages: ${config.programmingLanguages.join(', ')}`);
      printToTerminal(`• Frameworks: ${config.frameworks.join(', ')}`);
      printToTerminal(`• Early Access features: ${config.enableEarlyAccess ? 'Enabled' : 'Disabled'}`);
      printToTerminal(`• Beta features: ${Object.entries(config.betaFeatures)
        .filter(([_, v]) => v)
        .map(([k, _]) => k)
        .join(', ') || 'None'}`);
      printToTerminal('');
      
      // Complete setup
      finishSetup();
    }
  };
  
  // Add the one-time event listener
  terminalInput.addEventListener('keypress', onProjectNameEntered);
  
  // Focus input
  terminalInput.focus();
} 