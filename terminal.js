// Configuration state
const config = {
  projectDescription: '',
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

// Default configurations for quick setup and presets
const defaultConfigs = {
  "web": {
    projectType: 'Web Application',
    programmingLanguages: ['JavaScript', 'TypeScript', 'HTML', 'CSS'],
    frameworks: ['React', 'Next.js'],
    editorSettings: {
      tabSize: 2,
      insertSpaces: true,
      formatOnSave: true
    },
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
    editorSettings: {
      tabSize: 2,
      insertSpaces: true,
      formatOnSave: true  
    },
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
    editorSettings: {
      tabSize: 2,
      insertSpaces: true,
      formatOnSave: true
    },
    aiRules: 'Use proper error handling\nImplement input validation\nFollow security best practices\nInclude comprehensive logging',
    enableEarlyAccess: true,
    betaFeatures: {
      experimentalAIFeatures: true,
      advancedCompletion: true,
      alternativeModels: false
    }
  },
  "fullstack": {
    projectType: 'Full-Stack Application',
    programmingLanguages: ['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Python'],
    frameworks: ['React', 'Next.js', 'Node.js', 'Express'],
    editorSettings: {
      tabSize: 2,
      insertSpaces: true,
      formatOnSave: true
    },
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
let setupCompleted = false;
let isSetupInProgress = false; // Add flag to track if a setup is in progress
let debugMode = false; // Add debug mode flag
let inPresetMode = false; // New flag to track if we're in preset mode

const setupOptions = [
  { prompt: 'Welcome to Cursor Workspace Setup!\n\nChoose setup mode:\n1) Quick Setup (recommended defaults)\n2) Custom Setup (answer all questions)\n3) Debug Mode (verbose logging)\nEnter number:', isOption: true }
];

const quickSetupSteps = [
  { prompt: 'What is your project description?', field: 'projectDescription' },
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
  }
];

const customSetupSteps = [
  { prompt: 'What is your project description?', field: 'projectDescription' },
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
const restartBtn = document.getElementById('restart-btn');

// Initialize
window.onload = () => {
  console.log('Window loaded, initializing application...');
  
  // Add a debug button in the header
  const debugToggle = document.createElement('button');
  debugToggle.id = 'debug-toggle';
  debugToggle.className = 'btn secondary';
  debugToggle.textContent = 'Debug Mode';
  debugToggle.style.position = 'absolute';
  debugToggle.style.top = '10px';
  debugToggle.style.right = '10px';
  debugToggle.style.zIndex = '100';
  debugToggle.addEventListener('click', toggleDebugMode);
  document.body.appendChild(debugToggle);

  // Add scroll indicator
  const scrollIndicator = document.createElement('div');
  scrollIndicator.id = 'scroll-indicator';
  scrollIndicator.innerHTML = '⬇️ More below ⬇️';
  scrollIndicator.style.position = 'absolute';
  scrollIndicator.style.bottom = '10px';
  scrollIndicator.style.left = '50%';
  scrollIndicator.style.transform = 'translateX(-50%)';
  scrollIndicator.style.backgroundColor = 'rgba(76, 175, 80, 0.8)';
  scrollIndicator.style.color = 'white';
  scrollIndicator.style.padding = '5px 10px';
  scrollIndicator.style.borderRadius = '4px';
  scrollIndicator.style.fontSize = '12px';
  scrollIndicator.style.fontWeight = 'bold';
  scrollIndicator.style.zIndex = '100';
  scrollIndicator.style.opacity = '0';
  scrollIndicator.style.transition = 'opacity 0.3s ease';
  scrollIndicator.style.pointerEvents = 'none';
  document.getElementById('terminal').appendChild(scrollIndicator);

  // Setup scroll event listener to show/hide the indicator
  const terminal = document.getElementById('terminal');
  terminal.addEventListener('scroll', checkScrollIndicator);
  
  printToTerminal(steps[currentStep].prompt);
  
  terminalInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleInput();
    }
  });
  
  // Ensure input is focused when clicking anywhere in the terminal
  document.getElementById('terminal').addEventListener('click', () => {
    terminalInput.focus();
  });
  
  restartBtn.addEventListener('click', restart);
  
  // Add export to cursor button handler
  const exportToCursorBtn = document.getElementById('export-to-cursor-btn');
  console.log('Export to Cursor button found?', !!exportToCursorBtn);
  
  if (exportToCursorBtn) {
    console.log('Adding click event listener to Export to Cursor button');
    exportToCursorBtn.addEventListener('click', showExportModal);
    
    // Make sure the button is visible and properly styled
    exportToCursorBtn.style.visibility = 'visible';
    exportToCursorBtn.style.display = 'inline-flex';
  } else {
    console.error('Export to Cursor button not found in the DOM');
  }
  
  // Add modal close handler
  const closeModalBtn = document.querySelector('.close-modal');
  console.log('Close modal button found?', !!closeModalBtn);
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', hideExportModal);
  } else {
    console.error('Close modal button not found in the DOM');
  }
  
  // Add copy button handlers
  const copyButtons = document.querySelectorAll('.copy-btn');
  console.log('Copy buttons found:', copyButtons.length);
  
  copyButtons.forEach(btn => {
    btn.addEventListener('click', copyToClipboard);
  });
  
  // Check for clipboard API support and add backup if needed
  addExportBackupSupport();
  
  // Add automation script button handlers
  const macScriptBtn = document.getElementById('mac-script-btn');
  const winScriptBtn = document.getElementById('win-script-btn');
  const linuxScriptBtn = document.getElementById('linux-script-btn');
  
  if (macScriptBtn) macScriptBtn.addEventListener('click', () => generateAutomationScript('mac'));
  if (winScriptBtn) winScriptBtn.addEventListener('click', () => generateAutomationScript('win'));
  if (linuxScriptBtn) linuxScriptBtn.addEventListener('click', () => generateAutomationScript('linux'));
  
  // Ensure the input field is focused
  terminalInput.focus();
};

// Debug functions
function toggleDebugMode() {
  debugMode = !debugMode;
  debugLog(`Debug mode ${debugMode ? 'enabled' : 'disabled'}`);
  
  // Find the debug toggle button
  const debugToggleBtn = document.getElementById('debug-toggle');
  if (debugToggleBtn) {
    debugToggleBtn.textContent = debugMode ? 'Disable Debug Mode' : 'Enable Debug Mode';
  }
  
  if (debugMode) {
    // Add debug panel
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debug-panel';
    debugPanel.className = 'debug-panel';
    debugPanel.innerHTML = `
      <h3>Debug Panel</h3>
      <div class="debug-content">
        <div>Current Step: <span id="debug-step">${currentStep}</span></div>
        <div>Setup Mode: <span id="debug-mode">${isCustomSetup ? 'Custom' : 'Quick'}</span></div>
        <div>Setup Completed: <span id="debug-completed">${setupCompleted}</span></div>
        <div>Setup In Progress: <span id="debug-in-progress">${isSetupInProgress}</span></div>
        <pre id="debug-config">${JSON.stringify(config, null, 2)}</pre>
      </div>
    `;
    document.body.appendChild(debugPanel);
    
    // Add dump config button
    const dumpConfigBtn = document.createElement('button');
    dumpConfigBtn.textContent = 'Dump Config to Console';
    dumpConfigBtn.className = 'btn secondary';
    dumpConfigBtn.addEventListener('click', () => {
      console.log('Current Configuration:', config);
      debugLog('Configuration dumped to console');
    });
    document.getElementById('debug-panel').appendChild(dumpConfigBtn);
  } else {
    // Remove debug panel if it exists
    const debugPanel = document.getElementById('debug-panel');
    if (debugPanel) {
      document.body.removeChild(debugPanel);
    }
  }
}

function debugLog(message) {
  if (!debugMode) return;
  
  console.log(`[DEBUG] ${message}`);
  
  // Also print to terminal with special formatting
  const line = document.createElement('div');
  line.className = 'terminal-output debug-message';
  line.innerHTML = `<span class="debug-prefix">[DEBUG]</span> ${message}`;
  terminalContent.appendChild(line);
  
  // Auto-scroll to bottom
  const terminal = document.getElementById('terminal');
  terminal.scrollTop = terminal.scrollHeight;
  
  // Update debug panel if it exists
  updateDebugPanel();
}

function updateDebugPanel() {
  if (!debugMode) return;
  
  const debugStep = document.getElementById('debug-step');
  const debugMode = document.getElementById('debug-mode');
  const debugCompleted = document.getElementById('debug-completed');
  const debugInProgress = document.getElementById('debug-in-progress');
  const debugConfig = document.getElementById('debug-config');
  
  if (debugStep) debugStep.textContent = currentStep;
  if (debugMode) debugMode.textContent = isCustomSetup ? 'Custom' : 'Quick';
  if (debugCompleted) debugCompleted.textContent = setupCompleted;
  if (debugInProgress) debugInProgress.textContent = isSetupInProgress;
  if (debugConfig) debugConfig.textContent = JSON.stringify(config, null, 2);
}

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
  
  // Improved auto-scroll to bottom - ensure it's always visible
  const terminal = document.getElementById('terminal');
  
  // Add visual feedback to the terminal container itself
  terminal.classList.add('terminal-updated');
  setTimeout(() => {
    terminal.classList.remove('terminal-updated');
  }, 800);
  
  setTimeout(() => {
    terminal.scrollTop = terminal.scrollHeight;
    
    // Add a brief highlight effect to the new line
    line.classList.add('new-line');
    setTimeout(() => {
      line.classList.remove('new-line');
    }, 800);
    
    // Check if we need to show the scroll indicator
    checkScrollIndicator();
  }, 10);
  
  if (debugMode && !isInput) {
    console.log(`[TERMINAL] ${text}`);
  }
}

function handleInput() {
  const input = terminalInput.value;
  printToTerminal(input, true);
  terminalInput.value = '';
  
  // Skip regular processing if we're in preset mode
  if (inPresetMode) {
    if (debugMode) console.log(`Debug: In preset mode, skipping regular input processing`);
    return;
  }
  
  if (debugMode) console.log(`Debug: Input received: "${input}", current step: ${currentStep}`);
  
  // Special handling for setup mode selection (first step)
  if (steps === setupOptions && currentStep === 0) {
    if (input === '1') {
      isCustomSetup = false;
      steps = quickSetupSteps;
      printToTerminal('Quick Setup mode selected. You\'ll be asked for minimal information and the rest will be configured with recommended defaults.');
      if (debugMode) console.log('Debug: Quick Setup mode selected');
    } else if (input === '2') {
      isCustomSetup = true;
      steps = customSetupSteps;
      printToTerminal('Custom Setup mode selected. You\'ll be asked for detailed configuration options.');
      if (debugMode) console.log('Debug: Custom Setup mode selected');
    } else if (input === '3') {
      // Enable debug mode and restart
      debugMode = true;
      toggleDebugMode();
      printToTerminal('Debug Mode enabled. Verbose logging will be shown.');
      printToTerminal('Please select a setup mode:');
      printToTerminal('1) Quick Setup (recommended defaults)');
      printToTerminal('2) Custom Setup (answer all questions)');
      if (debugMode) console.log('Debug: Debug Mode enabled via menu');
      return;
    } else {
      printToTerminal('Invalid option. Please enter 1, 2, or 3.');
      if (debugMode) console.log(`Debug: Invalid option entered: ${input}`);
      return;
    }
    
    // Reset to start at first question of the new setup flow
    currentStep = 0;
    
    // Add a visual separator
    printToTerminal('\n' + '-'.repeat(50) + '\n');
    
    // Show the first prompt, focus input, and ensure it's visible
    printToTerminal(steps[currentStep].prompt);
    terminalInput.focus();
    
    // Force scroll to the bottom to show the prompt
    const terminal = document.getElementById('terminal');
    setTimeout(() => {
      terminal.scrollTop = terminal.scrollHeight;
    }, 50);
    
    if (debugMode) console.log(`Debug: Setup mode selected, showing first prompt: "${steps[currentStep].prompt}"`);
    return; // Important: Return here to prevent further processing
  }
  
  // Store current step number before processing to track progression
  const stepBeforeProcessing = currentStep;
  
  // Process the input - this may increment currentStep if successful
  processStep(input);
  
  // Only proceed if we've actually advanced to the next step
  if (currentStep > stepBeforeProcessing) {
    if (debugMode) console.log(`Debug: Step advanced from ${stepBeforeProcessing} to ${currentStep}`);
    
    // If we have more steps to go
    if (currentStep < steps.length) {
      // Add a visual separator instead of clearing the terminal
      printToTerminal('\n' + '-'.repeat(50) + '\n');
      printToTerminal(steps[currentStep].prompt);
      
      // Force scroll to show the new prompt
      const terminal = document.getElementById('terminal');
      setTimeout(() => {
        terminal.scrollTop = terminal.scrollHeight;
      }, 50);
      
      if (debugMode) console.log(`Debug: Showing prompt for step ${currentStep}: "${steps[currentStep].prompt}"`);
    } else {
      // We've completed all steps, apply template and finish
      if (debugMode) console.log(`Debug: All steps completed (${currentStep} >= ${steps.length})`);
      if (!isCustomSetup) {
        // Apply template defaults based on project type
        applyTemplateDefaults();
      }
      finishSetup();
    }
  } else {
    // Step didn't advance (validation failed)
    if (debugMode) console.log(`Debug: Step didn't advance, still at ${currentStep}`);
    
    // Force scroll to show error messages
    const terminal = document.getElementById('terminal');
    setTimeout(() => {
      terminal.scrollTop = terminal.scrollHeight;
    }, 50);
  }
  
  // Always focus the input field
  setTimeout(() => {
    terminalInput.focus();
  }, 100);
}

function processStep(input) {
  // Get the current step we're processing
  const step = steps[currentStep];
  
  if (!step) {
    if (debugMode) console.log(`Debug: No step found at currentStep=${currentStep}`);
    return;
  }
  
  if (debugMode) {
    console.log(`Debug: Processing step ${currentStep}:`);
    console.log(`Debug: Field: ${step.field}, Input: "${input}"`);
  }
  
  // Process the input if needed
  const value = step.process ? step.process(input) : input;
  
  // Special handling for project description validation
  if (step.field === 'projectDescription') {
    // Trim any whitespace
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    
    // Check if project description is empty
    if (!trimmedValue) {
      // Make error message more visible
      printToTerminal('\n⚠️ ERROR: Project description cannot be empty. Please try again. ⚠️\n');
      
      // Re-focus the input field but DO NOT advance to next step
      setTimeout(() => {
        terminalInput.focus();
      }, 100);
      
      if (debugMode) console.log(`Debug: Empty project description detected, not advancing step`);
      return; // Don't increment currentStep, so we'll ask the same question again
    }
    
    // Update with trimmed value and log it
    config[step.field] = trimmedValue;
    if (debugMode) console.log(`Debug: Set project description to "${trimmedValue}" and advancing to next step`);
    
    // Increment step here for project description
    currentStep++;
    return;
  } 
  
  // For all other fields
  if (step.field && step.field.includes('.')) {
    const [obj, prop] = step.field.split('.');
    config[obj][prop] = value;
    if (debugMode) console.log(`Debug: Set config.${obj}.${prop} = ${JSON.stringify(value)}`);
  } else if (step.field) {
    config[step.field] = value;
    if (debugMode) console.log(`Debug: Set config.${step.field} = ${JSON.stringify(value)}`);
  }
  
  // Increment step for non-project description fields
  currentStep++;
  if (debugMode) console.log(`Debug: Advanced to step ${currentStep}`);
}

function applyTemplateDefaults() {
  // Map project type to preset key
  let presetKey = 'web'; // default
  
  if (config.projectType === 'Web Application') {
    presetKey = 'web';
  } else if (config.projectType === 'Mobile App') {
    presetKey = 'mobile';
  } else if (config.projectType === 'Backend Service') {
    presetKey = 'backend';
  } else if (config.projectType === 'Full-Stack Application') {
    presetKey = 'fullstack';
  }
  
  debugLog(`Applying template defaults for preset: ${presetKey}`);
  
  const template = defaultConfigs[presetKey];
  
  // Apply template settings to config
  config.programmingLanguages = template.programmingLanguages;
  config.frameworks = template.frameworks;
  config.editorSettings = template.editorSettings;
  config.aiRules = template.aiRules;
  config.enableEarlyAccess = template.enableEarlyAccess;
  config.betaFeatures = template.betaFeatures;
  
  debugLog('Template defaults applied to configuration');
  
  // Print a summary of applied settings
  printToTerminal('');
  printToTerminal('Applied recommended settings:');
  printToTerminal(`• Languages: ${config.programmingLanguages.join(', ')}`);
  printToTerminal(`• Frameworks: ${config.frameworks.join(', ')}`);
  printToTerminal(`• Editor settings: Tab size ${config.editorSettings.tabSize}, ${config.editorSettings.insertSpaces ? 'Spaces' : 'Tabs'}, Format on save ${config.editorSettings.formatOnSave ? 'enabled' : 'disabled'}`);
  printToTerminal(`• Early Access features: ${config.enableEarlyAccess ? 'Enabled' : 'Disabled'}`);
  printToTerminal(`• Beta features: ${Object.entries(config.betaFeatures)
    .filter(([_, v]) => v)
    .map(([k, _]) => k)
    .join(', ') || 'None'}`);
  printToTerminal('');
}

function restart() {
  debugLog('Restarting setup process');
  
  // Reset all flags
  inPresetMode = false;
  setupCompleted = false;
  isSetupInProgress = false;
  
  // Reset configuration
  Object.assign(config, {
    projectDescription: '',
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
  
  // Remove any additional download buttons
  const buttons = downloadSection.querySelector('.buttons');
  while (buttons.children.length > 2) { // Keep only the original 2 buttons
    buttons.removeChild(buttons.lastChild);
  }
  
  // Start over
  printToTerminal(steps[currentStep].prompt);
  debugLog('Setup restarted');
  
  updateDebugPanel();
}

// Helper function to toggle UI elements during setup
function toggleUIElements(enable) {
  if (debugMode) console.log(`Debug: Toggling UI elements: ${enable ? 'enabled' : 'disabled'}`);
  
  // You can add any UI elements that need to be disabled during setup here
  // For example, you might want to disable certain buttons or fields
}

function finishSetup() {
  // Only proceed if setup hasn't been completed yet
  if (setupCompleted) {
    debugLog('Setup already completed, ignoring finishSetup call');
    return;
  }
  
  // Mark setup as completed and ensure preset mode is reset
  setupCompleted = true;
  inPresetMode = false;
  
  if (debugMode) console.log('Debug: Setup completed, flags reset: setupCompleted=true, inPresetMode=false');
  
  printToTerminal('✅ Configuration complete! Here\'s your setup:');
  printToTerminal(JSON.stringify(config, null, 2));
  printToTerminal('Preparing your workspace files...');
  
  setTimeout(() => {
    printToTerminal('✨ Done! Your files are ready to download.');
    printToTerminal('');
    printToTerminal('To use your configured workspace:');
    printToTerminal('1. Choose "Export to Cursor" to apply your configuration');
    printToTerminal('2. Or use the workspace file option that will appear');
    printToTerminal('3. Open Cursor and start coding with your optimized settings!');
    
    // Generate the workspace file and create download options
    generateWorkspaceFiles();
    
    // Show download section
    downloadSection.classList.remove('hidden');
    debugLog('Showing download section');
    
    // Hide input line
    document.querySelector('.terminal-input-line').style.display = 'none';
    
    // Enable UI elements again
    isSetupInProgress = false;
    toggleUIElements(true);
    debugLog('Setup process completed, UI elements re-enabled');
    
    updateDebugPanel();
  }, 1500);
}

// New function to generate workspace files and add download options
async function generateWorkspaceFiles() {
  debugLog('Starting workspace file generation process');
  
  try {
    // Create the workspace configuration
    const settings = generateSettings();
    
    // Generate cursor-workspace.code-workspace file for Cursor
    const workspaceConfig = {
      folders: [
        {
          path: "."
        }
      ],
      settings: {
        ...settings.editor,
        "editor.defaultFormatter": settings.editor.defaultFormatter,
        "cursor.ai": {
          enabled: settings.ai.enabled,
          model: settings.ai.model,
          suggestions: settings.ai.suggestions,
          rules: settings.ai.rules,
          includeCursorRulesFile: settings.ai.includeCursorRulesFile,
          autoComplete: settings.ai.autoComplete
        },
        "cursor.workspace": {
          name: config.projectDescription,
          type: settings.workspace.type,
          languages: settings.workspace.languages,
          frameworks: settings.workspace.frameworks,
          importVSCodeSettings: settings.workspace.importVSCodeSettings
        },
        "cursor.updates": settings.updates,
        "cursor.beta": settings.beta
      },
      extensions: {
        recommendations: []
      }
    };
    
    // Create a Blob for the workspace file
    const workspaceFileName = `${config.projectDescription.replace(/\s+/g, '-').toLowerCase()}.code-workspace`;
    const workspaceBlob = new Blob([JSON.stringify(workspaceConfig, null, 2)], {type: 'application/json'});
    const workspaceUrl = URL.createObjectURL(workspaceBlob);
    
    // Add workspace file download option
    const workspaceDownloadOption = document.createElement('div');
    workspaceDownloadOption.className = 'download-option';
    workspaceDownloadOption.innerHTML = `
      <h3>Option 2: Workspace File Only</h3>
      <p>Download just the .code-workspace file for direct import into Cursor.</p>
      <a href="${workspaceUrl}" download="${workspaceFileName}" class="btn primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="12" y1="18" x2="12" y2="12"></line>
          <line x1="9" y1="15" x2="15" y2="15"></line>
        </svg>
        Workspace File Only
      </a>
    `;
    
    // Add to download options section
    const downloadOptions = document.querySelector('.download-options');
    if (downloadOptions) {
      downloadOptions.appendChild(workspaceDownloadOption);
      debugLog('Added workspace file download option');
    }
    
    // Add debug log download if in debug mode
    if (debugMode) {
      // Collect all debug messages
      const debugMessages = Array.from(document.querySelectorAll('.debug-message'))
        .map(el => el.textContent)
        .join('\n');
      
      const debugLogBlob = new Blob([
        `# Debug Log for ${config.projectDescription}\n`,
        `Generated: ${new Date().toISOString()}\n\n`,
        `## Configuration\n\`\`\`json\n${JSON.stringify(config, null, 2)}\n\`\`\`\n\n`,
        `## Log Messages\n${debugMessages}\n`
      ], {type: 'text/plain'});
      
      const debugLogUrl = URL.createObjectURL(debugLogBlob);
      
      // Add debug download
      const debugDownloadOption = document.createElement('div');
      debugDownloadOption.className = 'download-option debug-download';
      debugDownloadOption.innerHTML = `
        <h3>Debug Log</h3>
        <p>Download the debug log with configuration details and messages.</p>
        <a href="${debugLogUrl}" download="${config.projectDescription.replace(/\s+/g, '-').toLowerCase()}-debug-log.txt" class="btn secondary">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Download Debug Log
        </a>
      `;
      
      if (downloadOptions) {
        downloadOptions.appendChild(debugDownloadOption);
        debugLog('Added debug log download option');
      }
    }
  } catch (error) {
    console.error('Error generating files:', error);
    debugLog(`ERROR generating files: ${error.message}`);
    printToTerminal(`⚠️ Error generating files: ${error.message}`);
  }
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
      name: config.projectDescription,
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
  let content = `// Custom rules for Cursor AI for ${config.projectDescription}\n// These rules will be applied to all AI interactions\n\n`;
  
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
  return `# ${config.projectDescription} Cursor Workspace Reference

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
  if (!config.enableEarlyAccess) {
    return ''; // Return empty string if Early Access is not enabled
  }
  
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
  return `# ${config.projectDescription} - Cursor Workspace

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
${config.betaFeatures.experimentalAIFeatures || config.betaFeatures.advancedCompletion || config.betaFeatures.alternativeModels ? '- beta-settings.md - Information about beta features' : ''}
${config.enableEarlyAccess ? '- early-access-program.md - Details about early access features' : ''}
`;
}

// Function to show the export modal
function showExportModal() {
  console.log('Export to Cursor button clicked');
  
  // Generate the settings and rules for display
  const settingsJson = generateSettings();
  const rulesContent = generateCursorRulesFile();
  
  console.log('Generated settings and rules content');
  
  // Check if the pre elements exist
  const settingsElement = document.getElementById('export-settings');
  const rulesElement = document.getElementById('export-rules');
  const modalElement = document.getElementById('export-modal');
  
  console.log('Export modal elements exist?', {
    settingsElement: !!settingsElement,
    rulesElement: !!rulesElement,
    modalElement: !!modalElement
  });
  
  // Populate the pre elements if they exist
  if (settingsElement && rulesElement) {
    settingsElement.textContent = JSON.stringify(settingsJson, null, 2);
    rulesElement.textContent = rulesContent;
    console.log('Settings and rules content populated in the modal');
  } else {
    console.error('Could not find one or more export elements:',
      settingsElement ? 'settings found' : 'settings missing',
      rulesElement ? 'rules found' : 'rules missing');
  }
  
  // Show the modal
  if (modalElement) {
    modalElement.classList.remove('hidden');
    console.log('Modal displayed (hidden class removed)');
  } else {
    console.error('Could not find export-modal element');
  }
}

// Function to hide the export modal
function hideExportModal() {
  if (debugMode) console.log('Debug: Hiding export to Cursor modal');
  document.getElementById('export-modal').classList.add('hidden');
}

// Function to copy text to clipboard
function copyToClipboard(e) {
  const targetId = e.target.getAttribute('data-target');
  const textToCopy = document.getElementById(targetId).textContent;
  
  navigator.clipboard.writeText(textToCopy)
    .then(() => {
      // Visual indication that copy was successful
      e.target.textContent = 'Copied!';
      e.target.classList.add('copied');
      
      // Reset after 2 seconds
      setTimeout(() => {
        e.target.textContent = 'Copy';
        e.target.classList.remove('copied');
      }, 2000);
      
      if (debugMode) console.log(`Debug: Copied ${targetId} to clipboard`);
    })
    .catch(err => {
      console.error('Error copying text: ', err);
      if (debugMode) console.log(`Debug: Failed to copy ${targetId} to clipboard: ${err}`);
    });
}

// Add this to the end of the file to support feature detection for clipboard API
function isClipboardSupported() {
  return 'clipboard' in navigator;
}

// Add support for export if clipboard API is not available
function addExportBackupSupport() {
  if (!isClipboardSupported()) {
    // Add backup export method (e.g., download as text files)
    document.querySelectorAll('.copy-btn').forEach(btn => {
      btn.textContent = 'Download';
      btn.removeEventListener('click', copyToClipboard);
      btn.addEventListener('click', downloadExportFile);
    });
  }
}

// Backup method to download files if clipboard is not supported
function downloadExportFile(e) {
  const targetId = e.target.getAttribute('data-target');
  const textToDownload = document.getElementById(targetId).textContent;
  const filename = targetId === 'export-settings' ? 'settings.json' : '.cursorrules';
  
  const blob = new Blob([textToDownload], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  if (debugMode) console.log(`Debug: Downloaded ${filename}`);
}

// Function to generate and download an OS-specific automation script
function generateAutomationScript(osType) {
  if (debugMode) console.log(`Debug: Generating ${osType} automation script`);
  
  // Get the configuration content
  const settingsJson = generateSettings();
  const rulesContent = generateCursorRulesFile();
  
  let scriptContent = '';
  let scriptFilename = '';
  
  switch (osType) {
    case 'mac':
      scriptContent = generateMacScript(settingsJson, rulesContent);
      scriptFilename = 'install-cursor-config.sh';
      break;
    case 'win':
      scriptContent = generateWindowsScript(settingsJson, rulesContent);
      scriptFilename = 'install-cursor-config.bat';
      break;
    case 'linux':
      scriptContent = generateLinuxScript(settingsJson, rulesContent);
      scriptFilename = 'install-cursor-config.sh';
      break;
    default:
      console.error('Unknown OS type:', osType);
      return;
  }
  
  // Create and download the script file
  const blob = new Blob([scriptContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = scriptFilename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  if (debugMode) console.log(`Debug: Downloaded ${scriptFilename}`);
}

// Generate macOS installation script
function generateMacScript(settingsJson, rulesContent) {
  return `#!/bin/bash
# Cursor Configuration Installation Script for macOS
# Generated by Cursor Workspace Configurator

# Color codes for output
GREEN="\\033[0;32m"
YELLOW="\\033[1;33m"
RED="\\033[0;31m"
NC="\\033[0m" # No Color

echo "\\n${YELLOW}Cursor Configuration Installation Script${NC}"
echo "=======================================\\n"

# Create the Cursor user directory if it doesn't exist
CURSOR_DIR="$HOME/Library/Application Support/Cursor/User"
echo "Creating Cursor user directory (if it doesn't exist)..."
mkdir -p "$CURSOR_DIR"

if [ ! -d "$CURSOR_DIR" ]; then
  echo "${RED}Failed to create Cursor directory at $CURSOR_DIR${NC}"
  exit 1
fi

# Write settings.json
echo "Writing settings.json..."
cat > "$CURSOR_DIR/settings.json" << 'EOL'
${JSON.stringify(settingsJson, null, 2)}
EOL

if [ $? -ne 0 ]; then
  echo "${RED}Failed to write settings.json${NC}"
  exit 1
fi

# Write .cursorrules
echo "Writing .cursorrules..."
cat > "$HOME/.cursorrules" << 'EOL'
${rulesContent}
EOL

if [ $? -ne 0 ]; then
  echo "${RED}Failed to write .cursorrules${NC}"
  exit 1
fi

echo "\\n${GREEN}✓ Configuration files installed successfully!${NC}"
echo "\\nYou may need to restart Cursor for the changes to take effect."
echo "\\nEnjoy your new Cursor configuration!"
`;
}

// Generate Windows installation script
function generateWindowsScript(settingsJson, rulesContent) {
  // Windows needs escaped JSON with double quotes
  const escapedSettings = JSON.stringify(settingsJson, null, 2).replace(/"/g, '\\"');
  const escapedRules = rulesContent.replace(/"/g, '\\"');
  
  return `@echo off
:: Cursor Configuration Installation Script for Windows
:: Generated by Cursor Workspace Configurator

echo.
echo Cursor Configuration Installation Script
echo =======================================
echo.

:: Create the Cursor user directory if it doesn't exist
set CURSOR_DIR=%APPDATA%\\Cursor\\User
echo Creating Cursor user directory (if it doesn't exist)...
if not exist "%CURSOR_DIR%" mkdir "%CURSOR_DIR%"

if not exist "%CURSOR_DIR%" (
  echo Failed to create Cursor directory at %CURSOR_DIR%
  exit /b 1
)

:: Write settings.json
echo Writing settings.json...
(
  echo ${escapedSettings}
) > "%CURSOR_DIR%\\settings.json"

if %ERRORLEVEL% neq 0 (
  echo Failed to write settings.json
  exit /b 1
)

:: Write .cursorrules
echo Writing .cursorrules...
(
  echo ${escapedRules}
) > "%USERPROFILE%\\.cursorrules"

if %ERRORLEVEL% neq 0 (
  echo Failed to write .cursorrules
  exit /b 1
)

echo.
echo Configuration files installed successfully!
echo.
echo You may need to restart Cursor for the changes to take effect.
echo.
echo Enjoy your new Cursor configuration!

pause
`;
}

// Generate Linux installation script
function generateLinuxScript(settingsJson, rulesContent) {
  return `#!/bin/bash
# Cursor Configuration Installation Script for Linux
# Generated by Cursor Workspace Configurator

# Color codes for output
GREEN="\\033[0;32m"
YELLOW="\\033[1;33m"
RED="\\033[0;31m"
NC="\\033[0m" # No Color

echo -e "\\n${YELLOW}Cursor Configuration Installation Script${NC}"
echo -e "=======================================\\n"

# Create the Cursor user directory if it doesn't exist
CURSOR_DIR="$HOME/.config/Cursor/User"
echo "Creating Cursor user directory (if it doesn't exist)..."
mkdir -p "$CURSOR_DIR"

if [ ! -d "$CURSOR_DIR" ]; then
  echo -e "${RED}Failed to create Cursor directory at $CURSOR_DIR${NC}"
  exit 1
fi

# Write settings.json
echo "Writing settings.json..."
cat > "$CURSOR_DIR/settings.json" << 'EOL'
${JSON.stringify(settingsJson, null, 2)}
EOL

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to write settings.json${NC}"
  exit 1
fi

# Write .cursorrules
echo "Writing .cursorrules..."
cat > "$HOME/.cursorrules" << 'EOL'
${rulesContent}
EOL

if [ $? -ne 0 ]; then
  echo -e "${RED}Failed to write .cursorrules${NC}"
  exit 1
fi

echo -e "\\n${GREEN}✓ Configuration files installed successfully!${NC}"
echo -e "\\nYou may need to restart Cursor for the changes to take effect."
echo -e "\\nEnjoy your new Cursor configuration!"
`;
}

// Function to check if scroll indicator should be shown
function checkScrollIndicator() {
  const terminal = document.getElementById('terminal');
  const scrollIndicator = document.getElementById('scroll-indicator');
  
  if (!terminal || !scrollIndicator) return;
  
  // Check if we can scroll down more
  const canScrollMore = terminal.scrollHeight > terminal.clientHeight && 
                        terminal.scrollTop + terminal.clientHeight < terminal.scrollHeight - 20;
  
  if (canScrollMore) {
    scrollIndicator.style.opacity = '1';
  } else {
    scrollIndicator.style.opacity = '0';
  }
} 