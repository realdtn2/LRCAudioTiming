# Building LRC Audio Timing as a Single Executable

This guide will help you create a single executable file from your LRCAudioTiming project using Electron.

## Prerequisites

1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/) (version 16 or higher)
2. **npm**: Comes with Node.js

## Installation Steps

### 1. Install Dependencies

Open a terminal/command prompt in your project directory and run:

```bash
npm install
```

This will install Electron and electron-builder, which are needed to create the executable.

### 2. Test the Application

Before building, you can test the application in development mode:

```bash
npm start
```

This will open the application in a desktop window.

### 3. Build the Executable

#### For Windows (creates .exe file):
```bash
npm run build-win
```

#### For Linux (creates .AppImage file):
```bash
npm run build-linux
```

#### For all platforms:
```bash
npm run build
```

## Output

The built executables will be in the `dist/` folder:

- **Windows**: `LRC Audio Timing Setup.exe` (installer) and `win-unpacked/` folder
- **Linux**: `LRC Audio Timing.AppImage` (portable executable)

## Features

The desktop application includes:

- ✅ **Standalone executable** - No need for Python/Go server
- ✅ **Native file dialogs** - Better file opening experience
- ✅ **Keyboard shortcuts** - Ctrl+O (Open), Ctrl+L (Load LRC), Ctrl+E (Export)
- ✅ **Application menu** - Standard desktop app menu
- ✅ **Auto-updater ready** - Can be extended with auto-update functionality
- ✅ **Cross-platform** - Works on Windows and Linux

## Distribution

The generated executable can be distributed to users without requiring them to:
- Install Node.js
- Run a server
- Have Python or Go installed
- Open a web browser

Users simply download and run the executable file.

## Troubleshooting

### Build fails with "electron not found"
```bash
npm install electron --save-dev
```

### Build fails with "electron-builder not found"
```bash
npm install electron-builder --save-dev
```

### Application won't start
Make sure all files in the `src/` directory are present and the `index.html` file is accessible.

## Customization

You can modify the following files to customize the application:

- `package.json` - App metadata, build configuration
- `main.js` - Main process logic, window settings, menus
- `src/` - Your existing web application files

## Advanced Configuration

The `package.json` file includes build configuration for:
- App icons
- Installer options
- File inclusion/exclusion
- Platform-specific settings

Modify the `build` section in `package.json` to customize the build process.
