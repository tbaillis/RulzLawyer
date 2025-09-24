# RulzLawyer File Organization Structure

## Overview
This document describes the organized file structure implemented to improve project maintainability and clarity.

## Directory Structure

### Root Directory
- `index.html` - Main application entry point (updated with new file paths)
- `README.md` - Project documentation  
- `start-server.js` - Node.js server launcher (NEW)
- `start-game.ps1` - PowerShell startup script (UPDATED)

### `code-repository/` - Main Application Code
#### `code-repository/server/`
- `server-enhanced.js` - Enhanced HTTP server (MOVED from root)
- `server-simple.js` - Simple HTTP server (MOVED from root)

#### `code-repository/web/` - Web Application Files
##### `code-repository/web/character-sheets/`
- `new-character-creator.html` - Main character creator (MOVED from root)
- `complete-character-sheet.html` - Complete character sheet (MOVED from root)  
- `exact-pdf-character-sheet.html` - PDF-matched sheet (MOVED from root)
- `pdf-matched-character-sheet.html` - PDF reference sheet (MOVED from root)

##### `code-repository/web/tools/`
- `dice-roller.html` - Dice rolling interface (MOVED from root)

#### `code-repository/tests/` - Testing and Development
##### `code-repository/tests/navigation/`
- `minimal-nav-test.html` - Minimal navigation test (MOVED from root)
- `nav-test.html` - Navigation functionality test (MOVED from root)

##### `code-repository/tests/pdf-analysis/`
- `pdf-viewer.html` - PDF viewing tool (MOVED from root)
- `pdf-content-analyzer.html` - PDF analysis tool (MOVED from root)
- `comprehensive-pdf-analyzer.html` - Advanced PDF analyzer (MOVED from root)

##### `code-repository/tests/` (root level)
- `debug-game-system.js` - Game system debugging (MOVED from root)

## File Path Updates

### Updated References in index.html
- Character Creator: `./new-character-creator.html` → `./code-repository/web/character-sheets/new-character-creator.html`
- Dice Roller: `./dice-roller.html` → `./code-repository/web/tools/dice-roller.html`

### Updated Server References
- Start Script: `server-enhanced.js` → `code-repository/server/server-enhanced.js`
- Node Launcher: New `start-server.js` file created for organized startup

## Benefits of This Organization

### 1. **Clear Separation of Concerns**
- **Web files** are in `code-repository/web/`
- **Server files** are in `code-repository/server/`  
- **Test files** are in `code-repository/tests/`

### 2. **Logical Grouping**
- **Character sheets** grouped together
- **Tools** (dice roller, etc.) grouped together
- **Analysis tools** grouped in test directory

### 3. **Better Maintainability**
- Easier to find specific file types
- Reduced root directory clutter
- Clear development vs. production file separation

### 4. **Professional Structure**
- Follows standard web application organization patterns
- Easier for new developers to understand
- Better version control organization

## Migration Notes

### Files Moved
- ✅ `minimal-nav-test.html` → `code-repository/tests/navigation/`
- ✅ `nav-test.html` → `code-repository/tests/navigation/`
- ✅ `server-enhanced.js` → `code-repository/server/`
- ✅ `server-simple.js` → `code-repository/server/`
- ✅ `new-character-creator.html` → `code-repository/web/character-sheets/`
- ✅ `complete-character-sheet.html` → `code-repository/web/character-sheets/`
- ✅ `exact-pdf-character-sheet.html` → `code-repository/web/character-sheets/`
- ✅ `pdf-matched-character-sheet.html` → `code-repository/web/character-sheets/`
- ✅ `dice-roller.html` → `code-repository/web/tools/`
- ✅ `pdf-viewer.html` → `code-repository/tests/pdf-analysis/`
- ✅ `pdf-content-analyzer.html` → `code-repository/tests/pdf-analysis/`
- ✅ `comprehensive-pdf-analyzer.html` → `code-repository/tests/pdf-analysis/`
- ✅ `debug-game-system.js` → `code-repository/tests/`

### References Updated
- ✅ All `index.html` links updated to new paths
- ✅ `start-game.ps1` updated to use organized server path
- ✅ New `start-server.js` launcher created

## Usage

### Starting the Server
```bash
# Option 1: Use the new Node.js launcher
node start-server.js

# Option 2: Use PowerShell script (updated)
.\start-game.ps1

# Option 3: Direct server launch
node code-repository/server/server-enhanced.js
```

### Accessing Applications
- **Main Interface**: http://localhost:3000
- **Character Creator**: http://localhost:3000/code-repository/web/character-sheets/new-character-creator.html
- **Dice Roller**: http://localhost:3000/code-repository/web/tools/dice-roller.html

## Future Organization

This structure provides a foundation for further organization:
- Additional tools can be added to `code-repository/web/tools/`
- New character sheet variants can go in `code-repository/web/character-sheets/`
- Test files can be organized by category in `code-repository/tests/`
- Server modules can be added to `code-repository/server/`

---

**Organization completed**: September 24, 2025  
**Status**: ✅ Active and functional