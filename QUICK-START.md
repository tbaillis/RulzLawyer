# 🎲 RulzLawyer D&D 3.5 Gaming System - Quick Start Guide

## 🚀 How to Start the Game

### Option 1: PowerShell Script (Recommended)
```powershell
.\start-game.ps1
```

### Option 2: Batch Script  
```cmd
start-game.bat
```

### Option 3: Manual Start
```cmd
node game-server.js
```

## 🎮 Gaming Interfaces

Once the server is running, access these interfaces:

- **📋 Character Creator**: http://localhost:3000/character-creator.html
  - Complete D&D 3.5 character creation wizard
  - 7-step progressive character building
  - Full SRD compliance and validation

- **🎯 Adventure Engine**: http://localhost:3000/adventure-engine.html  
  - Campaign creation and management
  - Encounter generation with balanced difficulty
  - NPC generation and interaction
  - Story progression tracking

- **🎲 Dice Roller**: http://localhost:3000/dice-roller.html
  - Advanced D&D dice mechanics
  - Character-integrated rolling
  - Attack/damage/skill/save calculations
  - Roll history and analysis

- **🏠 Main Dashboard**: http://localhost:3000
  - Complete integrated gaming experience
  - Access to all gaming systems
  - Unified character and campaign management

## ✅ System Status

The RulzLawyer D&D 3.5 Gaming System includes:

- ✅ **Complete Character Creation**: Full 7-step wizard with D&D 3.5 SRD compliance
- ✅ **Equipment & Inventory Management**: Drag-and-drop interface with encumbrance
- ✅ **Spell Management**: Complete spell database with casting mechanics  
- ✅ **Adventure Engine**: AI-powered encounter and campaign generation
- ✅ **Advanced Dice Integration**: Character-aware rolling with automatic modifiers
- ✅ **Campaign Management**: Story progression and session tracking
- 🔄 **Responsive UI Polish**: Modern design with accessibility features (in progress)
- 🔄 **Enhanced Data Persistence**: Advanced save/load and backup systems (in progress)

## 🛠️ Troubleshooting

### Port Already in Use
If you see "Port 3000 is already in use":
```powershell
# PowerShell
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# Command Prompt  
taskkill /F /IM node.exe
```

### Server Won't Start
1. Make sure you're in the RulzLawyer directory
2. Check that Node.js is installed: `node --version`
3. Verify all game modules are present in `code-repository/src/`

### Browser Won't Connect
1. Wait 3-5 seconds after starting the server
2. Try refreshing the browser page
3. Check the console output for error messages

## 🎯 Quick Test

To verify everything is working:
1. Run `.\start-game.ps1`  
2. Choose option 4 (Main Dashboard)
3. Try creating a new character
4. Test the dice roller
5. Generate an encounter

## 📋 System Requirements

- **Node.js**: Version 12 or higher
- **Operating System**: Windows (tested), macOS, Linux
- **Browser**: Chrome, Firefox, Edge, Safari (modern versions)
- **Memory**: 512MB+ available RAM
- **Storage**: 100MB+ free space

## 🎮 Ready to Play!

Your complete D&D 3.5 gaming system is ready for epic adventures! 🐉⚔️🏰