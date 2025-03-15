# Cursor Workspace Configurator

A tool for setting up and configuring [Cursor IDE](https://cursor.sh/) workspaces with optimal settings for your projects. Configure once, deploy anywhere, and keep your AI-powered development environment consistent across all your workspaces.

## Features

### Ready Features ✅

- ✅ **Web Interface**: Interactive configurator with a clean, terminal-like experience
- ✅ **Customizable Project Configuration**: Set up your workspace exactly how you need it
- ✅ **Project Type Templates**: Web, Mobile, Backend, Desktop, Library/Package
- ✅ **AI Rules Configuration**: Optimize Cursor's AI for your specific use case
- ✅ **Workspace Export Options**:
  - ✅ Export directly to Cursor with automated installation scripts
  - ✅ Download a `.code-workspace` file for immediate use with Cursor
- ✅ **Cross-Platform Automation**:
  - ✅ OS-specific installation scripts (macOS, Windows, Linux)
  - ✅ Auto-detection of Cursor installation paths
  - ✅ Automatic backup of existing settings

### Coming Soon 🚧

- 🚧 **Command-line Tool**: For direct integration into your workflow
- 🚧 **Executable Distributions**:
  - 🚧 Standalone desktop application (Windows, macOS, Linux)
  - 🚧 Offline usage capability
  - 🚧 System tray integration for quick access
- 🚧 **Enterprise Features**:
  - 🚧 Team configuration sharing
  - 🚧 Version control integration
  - 🚧 Configuration profiles for different project types

## Desktop Application 🚧

> 🚧 **IN DEVELOPMENT** - The desktop application is currently under development and will be available soon.

For those who prefer a native experience, the Cursor Workspace Configurator will be available as a downloadable executable:

### Windows (Coming Soon)
```bash
# Download the installer (link will be available when released)
curl -LO https://github.com/yourusername/cursor-workspace-configurator/releases/latest/download/CursorWorkspaceConfigurator-Setup-Windows.exe

# Or use the portable version
curl -LO https://github.com/yourusername/cursor-workspace-configurator/releases/latest/download/CursorWorkspaceConfigurator-Portable-Windows.exe
```

### macOS (Coming Soon)
```bash
# Download the .dmg file (link will be available when released)
curl -LO https://github.com/yourusername/cursor-workspace-configurator/releases/latest/download/CursorWorkspaceConfigurator-macOS.dmg

# Or install with Homebrew
brew install cursor-workspace-configurator
```

### Linux (Coming Soon)
```bash
# Download the AppImage (link will be available when released)
curl -LO https://github.com/yourusername/cursor-workspace-configurator/releases/latest/download/CursorWorkspaceConfigurator-Linux.AppImage
chmod +x CursorWorkspaceConfigurator-Linux.AppImage

# Or install with Snap
snap install cursor-workspace-configurator
```

## Web Interface

Visit the [Cursor Workspace Configurator Web App](https://fisapool.github.io/cursor-workspace-configurator/) to use the interactive web interface.

### Quick Start with Web Interface

1. Visit the web app
2. Choose setup mode (Quick Setup or Custom Setup)
3. Enter your project description and details
4. When configuration is complete, choose from the export options:
   - Export to Cursor: Get instructions and scripts to apply settings to your Cursor installation
   - Workspace File Only: Download just the `.code-workspace` file for direct import

## Command Line Usage 🚧

> 🚧 **IN DEVELOPMENT** - The command line tool is currently under development and will be available soon.

The Cursor Workspace Configurator will be usable directly from the command line for efficiency and automation:

```bash
# Install globally (not yet available)
npm install -g cursor-workspace-configurator

# Or run without installing (not yet available)
npx cursor-workspace-configurator

# In your project directory (not yet available)
cursor-workspace-setup

# With arguments for non-interactive usage (coming soon)
cursor-workspace-setup --type web --languages "javascript,typescript" --frameworks "react,next.js" --rules "custom-rules.txt" --output "./my-workspace"

# Generate configuration from existing projects (coming soon)
cursor-workspace-setup --from-project "/path/to/existing/project"

# Apply a saved profile (coming soon)
cursor-workspace-setup --profile "web-development"
```

### Planned CLI Options 🚧

```
Usage: cursor-workspace-setup [options]

Options:
  -t, --type <type>              Project type: web, mobile, backend, desktop, library
  -l, --languages <languages>     Comma-separated list of programming languages
  -f, --frameworks <frameworks>   Comma-separated list of frameworks
  -d, --description <description> Project description
  -r, --rules <file>              Path to AI rules file
  -o, --output <directory>        Output directory for configuration files
  -p, --profile <name>            Use a saved configuration profile
  --from-project <directory>      Generate config based on existing project
  --early-access                  Enable Early Access Program features
  --beta                          Enable Beta features
  --debug                         Enable verbose debug output
  --export-only                   Generate files without applying them
  -h, --help                      Display help information
  -v, --version                   Display version information
```

## Automation Scripts ✅

The Cursor Workspace Configurator provides platform-specific automation scripts to streamline the installation process:

### macOS Script ✅

The macOS automation script:
- ✅ Creates the Cursor user directory if it doesn't exist (`~/Library/Application Support/Cursor/User/`)
- ✅ Backs up any existing configuration files
- ✅ Installs the new `settings.json` with your configuration
- ✅ Creates a `.cursorrules` file in your home directory
- ✅ Provides color-coded feedback for each step

### Windows Script ✅

The Windows automation script:
- ✅ Locates the Cursor application data folder (`%APPDATA%\Cursor\User\`)
- ✅ Creates backup copies of existing configuration
- ✅ Installs the new settings and rules files
- ✅ Handles Windows-specific path requirements
- ✅ Includes detailed error reporting and success confirmation

### Linux Script ✅

The Linux automation script:
- ✅ Targets the standard Linux configuration path (`~/.config/Cursor/User/`)
- ✅ Creates necessary directories with proper permissions
- ✅ Installs configuration files with appropriate ownership
- ✅ Provides detailed execution logs
- ✅ Returns proper exit codes for integration with other tools

### Security Considerations

The automation scripts:
- ✅ Run entirely on the local machine (no remote execution)
- ✅ Do not collect or transmit any data
- ✅ Are provided as plaintext scripts you can review before running
- ✅ Require appropriate permissions to modify configuration files

To run the scripts:

```bash
# On macOS/Linux
chmod +x install-cursor-config.sh
./install-cursor-config.sh

# On Windows (PowerShell)
.\install-cursor-config.ps1
# Or Windows (Command Prompt)
install-cursor-config.bat
```

## Opening Your Workspace in Cursor

### Using the Workspace File (.code-workspace)

1. Open Cursor
2. Go to "File" → "Open Workspace..."
3. Select your downloaded `.code-workspace` file
4. Start coding with your optimized settings!

### Using Export to Cursor

1. Click "Export to Cursor" after configuration is complete
2. Choose one of the installation methods:
   - Follow the manual instructions to copy settings to your Cursor user directory
   - Download and run the automation script for your OS (macOS, Windows, or Linux)
3. Restart Cursor to apply the changes

## Configuration Options

- **Project Description**: A description of your project
- **Project Type**: Web Application, Mobile App, Backend Service, Desktop Application, Library/Package
- **Languages and Frameworks**: Configure based on your tech stack
- **Editor Settings**: Tab size, spaces/tabs, format on save
- **AI Rules**: Custom rules for Cursor's AI behavior
- **Early Access Features**: Enable cutting-edge Cursor features
- **Beta Settings**: Try experimental capabilities

## Debug Mode

Debug Mode provides additional information and troubleshooting capabilities:

- Toggle with the Debug Mode button in the top-right corner
- Adds a debug panel showing current configuration state
- Outputs detailed logs to the browser console
- Adds debug messages directly to the terminal
- Provides a debug log download option when configuration is complete
- Includes a "Dump Config to Console" button for quick inspection

## Workspace Structure

The configurator creates the following configuration for Cursor:

```
settings.json        # Main settings for Cursor
.cursorrules         # AI behavior rules for the entire workspace
```

## Advanced Settings Customization

After opening your workspace, you can further customize settings:

1. Go to "Preferences" → "Settings"
2. Search for specific settings to modify

## Local Development

To run the web interface locally:

```bash
# Clone the repository
git clone https://github.com/yourusername/cursor-workspace-configurator.git

# Navigate to the project directory
cd cursor-workspace-configurator

# Start a local server (Python example)
python -m http.server 8081

# Open in browser
# Visit http://localhost:8081
```

## Building Executables 🚧

> 🚧 **IN DEVELOPMENT** - The build process is currently under development and will be available soon.

You will be able to build standalone executables of the Cursor Workspace Configurator for distribution:

### Prerequisites

- Node.js 14+ and npm installed
- Electron for desktop builds
- Appropriate build tools for your platform

### Build Process (Coming Soon)

```bash
# Install dependencies
npm install

# Build for all platforms
npm run build:all  # Coming soon

# Build for specific platforms
npm run build:win  # Coming soon
npm run build:mac  # Coming soon
npm run build:linux  # Coming soon

# Output will be in the 'dist' directory
```

### Customizing for Your Team (Coming Soon)

Organizations will be able to customize the configurator for their specific needs:

```bash
# Clone the repository
git clone https://github.com/yourusername/cursor-workspace-configurator.git

# Create a custom configuration file (template will be available soon)
cp config.example.json config.custom.json

# Edit the configuration file
# - Add company-specific templates
# - Set default AI rules
# - Configure preferred settings

# Build with custom configuration (coming soon)
npm run build:custom -- --config=config.custom.json
```

### Integration Options (Planned)

- 🚧 **CI/CD Pipeline**: Include the configurator in your onboarding process
- 🚧 **Internal Developer Portal**: Host a customized version for your team
- 🚧 **Version Control**: Store configuration profiles in your repository
- 🚧 **IDE Extensions**: Build a direct integration with Cursor for seamless updates

### Custom Rule Sets (Planned)

Create organization-specific rule sets to enforce coding standards:

```javascript
// Example custom rules file (template): company-rules.js
module.exports = {
  naming: {
    enforceConsistentNaming: true,
    namePatterns: {
      components: '^[A-Z][a-zA-Z]+$',
      hooks: '^use[A-Z][a-zA-Z]+$'
    }
  },
  formatting: {
    tabSize: 2,
    insertSpaces: true
  },
  aiRules: [
    'Follow company code style guide',
    'Use TypeScript for all new components',
    'Document public APIs with JSDoc',
    'Write unit tests for critical functions'
  ]
};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
