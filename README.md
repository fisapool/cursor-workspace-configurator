# Cursor Workspace Configurator

A command-line utility for setting up and configuring Cursor IDE workspaces with optimal settings for your projects.

## What is Cursor?

[Cursor](https://cursor.sh/) is an AI-first code editor designed to help developers write, understand, and improve code quickly through AI assistance. This tool helps you configure your Cursor workspace with optimal settings based on your project requirements.

## Features

- Interactive command-line setup process
- Customizable project configuration
- Support for multiple project types (web, mobile, backend, desktop, library)
- Configuration for AI assistance rules
- Documentation generation
- Early access and beta features configuration
- Smart file handling with overwrite protection

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/cursor-workspace-configurator.git
cd cursor-workspace-configurator

# Make the script executable
chmod +x scripts_setup-workspace.js

# Optionally, link it globally
npm link
```

## Usage

Navigate to your project directory and run:

```bash
# If installed globally
cursor-workspace-setup

# Or run directly from the cloned repository
/path/to/cursor-workspace-configurator/scripts_setup-workspace.js
```

Follow the interactive prompts to configure your workspace. The tool will:

1. Ask for your project details
2. Create necessary configuration directories
3. Copy and customize configuration files
4. Generate project-specific rules for Cursor's AI
5. Create documentation for your workspace setup

## Configuration Files Created

The tool creates the following structure in your project:

```
.cursor/
├── settings.json        # Main settings for Cursor
├── global-rules.json    # Global rules for the AI
├── project-rules.json   # Project-specific rules
└── rules/
    ├── common-rules.json    # Common coding standards
    └── web-app-rules.json   # (For web projects only)
.cursorrules             # (Optional) AI behavior rules
docs/
├── reference.md         # General reference documentation
├── troubleshooting.md   # Help for common issues
├── beta-settings.md     # (Optional) Info about beta features
└── early-access-program.md  # (Optional) Info about early access
```

## Settings Customization

After running the tool, you can manually edit the configuration files to further customize your workspace:

- `editor`: Configure editor behavior
- `ai`: Configure AI assistance features
- `workspace`: Workspace-specific settings
- `updates`: Configure update behavior
- `beta`: Enable/disable beta features

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details. # cursor-workspace-configurator
