# RulzLawyer D&D 3.5 Character Creator - AI Agent Build Instructions

## 📋 MANDATORY: Task List Management
**Every AI agent working on this project MUST:**
1. **Create a task list** using the `manage_todo_list` tool for any multi-step work
2. **Mark each item as in-progress** before starting work on it
3. **Mark items as completed** immediately after finishing each task
4. **Never end a turn** without completing all tasks or explicitly explaining blockers

Example task list format:
```markdown
- [ ] Setup server infrastructure
- [ ] Implement character creation system
- [ ] Test D&D 3.5 wizard functionality  
- [ ] Validate all console errors are resolved
```

## 🎯 Project Overview
**RulzLawyer** is a complete D&D 3.5 Character Creator web application with:
- **Complete SRD Compliance**: All official D&D 3.5 races, classes, feats, spells
- **7-Step Character Wizard**: Guided character creation process
- **Professional Character Sheets**: Full stat display and management
- **Adventure Engine**: Complete encounter and campaign generation
- **Real-time Dice Rolling**: Advanced dice mechanics with advantage/disadvantage
- **Character Progression**: Level-up system through all 20 levels

## 🏗️ Architecture Overview

### **Core Components**
```
RulzLawyer/
├── code-repository/src/          # All game logic and engines
│   ├── dice-engine.js           # Dice rolling system
│   ├── dnd35-srd-data.js        # Official D&D 3.5 SRD data
│   ├── dnd-character-model.js   # Character data structure
│   ├── dnd35-character-wizard.js # 7-step creation wizard
│   ├── dnd35-character-sheet.js # Character sheet display
│   ├── dnd35-level-up.js        # Character advancement
│   ├── character-manager.js     # Character CRUD operations
│   ├── adventure-engine.js      # Adventure generation
│   ├── random-tables-index.js   # D&D random tables
│   ├── spell-manager.js         # Spell system
│   ├── equipment-manager.js     # Equipment and inventory
│   ├── storage-manager.js       # Data persistence
│   └── web-interface.js         # UI controller
├── app.js                       # Game engine initialization
├── server-enhanced.js           # HTTP server (PREFERRED)
├── server.js                    # Backup server
├── init-fix.js                  # Initialization helper
└── index.html                   # Main application page
```

## 🚀 Step-by-Step Build Process

### **Phase 1: Environment Setup**
```markdown
- [ ] Verify Node.js is installed
- [ ] Check port 3000 availability  
- [ ] Validate all core files exist
- [ ] Test file serving capabilities
```

**Commands:**
```bash
# Check Node.js
node --version

# Clean port 3000 (Windows PowerShell)
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
netstat -ano | findstr :3000

# Start enhanced server (RECOMMENDED)
node server-enhanced.js
```

### **Phase 2: Core System Validation**
```markdown  
- [ ] Test dice engine functionality
- [ ] Validate SRD data loading
- [ ] Verify character model structure
- [ ] Test storage manager methods
- [ ] Validate adventure engine
```

**Validation Test:**
```javascript
// Run this test to verify core systems
node -e "
const DiceEngine = require('./code-repository/src/dice-engine.js');
const dice = new DiceEngine();
const result = dice.rollExpression('3d6+2');
console.log('✅ Dice test:', result.total);
"
```

### **Phase 3: Web Interface Setup**
```markdown
- [ ] Verify all JavaScript modules load
- [ ] Test character wizard initialization  
- [ ] Validate UI event handlers
- [ ] Check global function exports
- [ ] Test modal functionality
```

**Critical Global Exports Check:**
- `DiceEngine` ✅
- `RandomTablesEngine` ✅  
- `AdventureEngine` ✅
- `CharacterManager` ✅
- `StorageManager` ✅
- `DnD35CharacterWizard` ✅

### **Phase 4: Character Creation System**
```markdown
- [ ] Test Create Character button
- [ ] Validate D&D 3.5 wizard steps
- [ ] Verify race/class selection
- [ ] Test ability score generation
- [ ] Check skill point allocation
- [ ] Validate feat selection
- [ ] Test character sheet display
```

### **Phase 5: Integration Testing**
```markdown
- [ ] Test character saving/loading
- [ ] Verify level-up functionality
- [ ] Test adventure generation
- [ ] Validate dice rolling integration
- [ ] Check equipment management
- [ ] Test spell system
```

## 🔧 Common Issues & Solutions

### **Issue 1: Server Won't Start**
```markdown
- [ ] Check if port 3000 is in use
- [ ] Kill existing Node processes
- [ ] Use server-enhanced.js instead of server.js
- [ ] Verify file permissions
```

**Solution:**
```powershell
Get-Process -Name node | Stop-Process -Force
node server-enhanced.js
```

### **Issue 2: Character Creation Button Not Working**
```markdown
- [ ] Check web-interface.js for createNewCharacter method
- [ ] Verify DnD35CharacterWizard is globally available  
- [ ] Ensure wizard is stored as window.characterWizard
- [ ] Check console for JavaScript errors
```

**Fix Pattern:**
```javascript
// In web-interface.js createNewCharacter method:
const wizard = new DnD35CharacterWizard(this.gameEngine);
window.characterWizard = wizard; // CRITICAL: Global reference
wizard.startCreation();
```

### **Issue 3: Missing Dependencies**
```markdown
- [ ] Check init-fix.js dependency validation
- [ ] Verify all classes export to window object
- [ ] Update required vs optional function lists
- [ ] Test global function availability
```

**Required Global Classes:**
```javascript
// Each module MUST export to window:
if (typeof window !== 'undefined') {
    window.ClassName = ClassName;
}
```

### **Issue 4: Storage Manager Errors**
```markdown
- [ ] Verify getAllCharacters method exists
- [ ] Check storage manager initialization
- [ ] Test character saving/loading
- [ ] Validate localStorage functionality
```

**Fix:**
```javascript
// In storage-manager.js - ensure this alias exists:
async getAllCharacters() {
    return this.loadAllCharacters();
}
```

## 🎮 Application Testing Checklist

### **Functional Tests**
```markdown
- [ ] Server starts without errors
- [ ] Index page loads completely
- [ ] All JavaScript modules load successfully  
- [ ] Create Character button works
- [ ] D&D 3.5 wizard opens and displays
- [ ] All wizard navigation buttons work (Next/Previous/Finish)
- [ ] Character creation completes successfully
- [ ] Character appears in character list
- [ ] Character sheet displays correctly
- [ ] Level-up system functions
- [ ] Dice rolling works in all contexts
- [ ] Adventure generation produces results
- [ ] Random tables generate encounters
- [ ] Equipment and spells are accessible
```

### **Error Verification**
```markdown
- [ ] No console errors on page load
- [ ] No 404 errors for JavaScript files
- [ ] No undefined function errors
- [ ] No null reference errors in wizard
- [ ] All global functions properly defined
```

## 📝 Development Workflow for AI Agents

### **1. Assessment Phase**
```markdown
- [ ] Read current application state
- [ ] Identify specific issues or requirements
- [ ] Create detailed task list using manage_todo_list tool
- [ ] Plan implementation approach
```

### **2. Implementation Phase**
```markdown
- [ ] Mark first task as in-progress
- [ ] Implement changes incrementally
- [ ] Test each change immediately
- [ ] Mark completed tasks immediately
- [ ] Move to next task
```

### **3. Validation Phase**
```markdown
- [ ] Start server and verify functionality
- [ ] Test in browser environment
- [ ] Check for console errors
- [ ] Validate all features work
- [ ] Mark all tasks as completed
```

### **4. Documentation Phase**
```markdown
- [ ] Document any changes made
- [ ] Update relevant configuration
- [ ] Note any issues discovered
- [ ] Provide status summary
```

## 🚨 Critical Success Factors

### **Always Use Enhanced Server**
- `server-enhanced.js` has better error handling and logging
- Provides detailed request/response information
- Handles file serving more reliably

### **Maintain Global References**
- Character wizard MUST be stored as `window.characterWizard`
- All engine classes MUST export to window object
- Global functions required for HTML onclick handlers

### **Validate Dependencies**
- Check that all required classes are available before use
- Use typeof checks: `typeof DnD35CharacterWizard !== 'undefined'`
- Handle missing dependencies gracefully

### **Test Incrementally**
- Test each component as you build it
- Use browser console to verify functionality
- Check network tab for failed resource loads

## 📊 Success Metrics

**Application is ready when:**
- ✅ Server starts without errors
- ✅ All JavaScript modules load successfully
- ✅ Character creation wizard launches properly
- ✅ All wizard steps navigate correctly
- ✅ Characters can be created and saved
- ✅ Character sheets display completely
- ✅ No console errors during normal operation
- ✅ All major features function as expected

## 🔄 Continuous Validation

**Run these tests regularly:**
```bash
# Server health check
curl -I http://localhost:3000

# Core system test
node -e "console.log('Testing...'); /* Add core tests here */"

# Browser console check (no errors)
# Manual testing of Create Character button
```

---

**Remember: Every AI agent must use the manage_todo_list tool and mark progress on all multi-step work. This ensures visibility and proper task completion tracking.**