# AGENTS.md

## Project Overview

RulzLawyer is a comprehensive D&D 3.5 Character Creator and Adventure Engine workspace designed for developing, documenting, and analyzing requirements for coding agents.

**Current State**: Fully functional D&D 3.5 gaming application with character creation, adventure generation, random tables, and web interface.

## Core Project Context

- **Purpose**: Requirements analysis and specification for coding agents + Complete D&D 3.5 gaming system
- **Focus Areas**: User stories, technical specifications, testing scenarios, examples, and fully implemented D&D mechanics
- **Output**: Comprehensive requirements documentation AND functional gaming application
- **Architecture**: Node.js backend with JavaScript frontend, modular engine design

## 🚨 CRITICAL CODE PLACEMENT RULES

**ALL generated code MUST be placed exclusively in `code-repository/` folder or its subfolders**
- Reference the `code-repository/README.md` for code organization guidelines
- Never place code in root directory or other folders
- Maintain the established module structure in `code-repository/src/`

## 🎯 Mandatory Agent Protocols

### BeastMode 3.1 - Autonomous Operation
- **Complete Problem Resolution**: You MUST iterate and keep going until the problem is solved
- **Mandatory Planning**: Use `manage_todo_list` tool for ALL non-trivial work
- **Extensive Research**: Use `fetch_webpage` tool to verify current package information
- **Perfect Solutions**: Test rigorously and handle all edge cases
- **No Premature Termination**: Do not end your turn until the problem is completely solved

### Required Todo List Usage
```markdown
- [ ] Step 1: Description of the first step
- [x] Step 2: Completed step description  
- [ ] Step 3: Description of the next step
```

## 🚀 Server Management Rules

**ALWAYS Clean Up Ports Before Starting Server**: Before running `node server.js`, ALWAYS check for and kill any processes using port 3000 to prevent "address already in use" errors

### Port Cleanup Commands:
- Windows PowerShell: `Get-Process -Name node | Stop-Process -Force` 
- Cross-platform: `npx kill-port 3000` (if kill-port is installed)
- **Startup Sequence**: 1) Clean ports, 2) Start server, 3) Verify functionality
- **Error Prevention**: Never attempt to start server without first ensuring port 3000 is available

## Build and Development Commands

### Core Application Commands
```bash
# Start the enhanced HTTP server
node server-enhanced.js

# Run comprehensive system validation
node -e "console.log('Testing all systems...'); /* validation script */"

# Test individual components
cd code-repository && node -e "const DiceEngine = require('./src/dice-engine.js'); console.log('DiceEngine loaded');"
```

### Port Management (CRITICAL)
```powershell
# Windows PowerShell - Clean up ports before starting
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
netstat -ano | findstr :3000

# Then start server
node server-enhanced.js
```

## System Architecture

### Core Modules (All in code-repository/src/)
1. **DiceEngine** - Advanced D&D 3.5 dice mechanics
2. **RandomTablesEngine** - All D&D 3.5 random tables (17+ tables)
3. **CharacterManager** - Complete character creation and management
4. **AdventureEngine** - Full adventure and encounter generation
5. **WebInterface** - HTML integration and user interface
6. **StorageManager** - Character persistence and data management

### Critical Integration Points
- **HTML to JavaScript**: Requires `window.*` globals for onclick handlers
- **Module Loading Order**: DiceEngine → RandomTablesEngine → CharacterManager → AdventureEngine
- **Browser vs Node.js**: Use conditional exports for dual environment support

## Testing Instructions

### System Validation Protocol
1. **Port Cleanup**: Always clean port 3000 first
2. **Server Start**: Launch enhanced server on localhost:3000
3. **Module Testing**: Test each core module individually
4. **Integration Testing**: Test complete character creation workflow
5. **End-to-End Testing**: Test full user experience

### Required Test Coverage
- Character creation wizard (7-step D&D 3.5 process)
- Dice rolling system (advantage/disadvantage, complex expressions)
- Random table generation (all 17+ D&D tables)
- Adventure engine (balanced encounters for party levels)
- Storage system (character save/load/persistence)

## Code Style and Conventions

### JavaScript Standards
- ES6+ modern JavaScript syntax
- Modular architecture with clear separation of concerns
- Comprehensive error handling and logging
- Browser/Node.js dual compatibility patterns

### D&D 3.5 Compliance
- Strict adherence to D&D 3.5 SRD rules
- Accurate stat calculations and progression
- Proper spell, feat, and skill implementations
- Balanced encounter generation

### Documentation Standards
- Inline comments explaining business logic
- README files for each major module
- Change logs for significant updates
- API documentation for public methods

## Critical Error Patterns to Avoid

### From Debugging Session Analysis:
1. **Insufficient Context Reading**: Always read 2000+ lines of context before changes
2. **Class Name Assumptions**: Verify actual class names (e.g., `RandomTablesEngine` not `RandomTablesIndex`)
3. **Method Name Guessing**: Check actual method signatures (e.g., `startCreation()` not `startWizard()`)
4. **Missing Global References**: HTML requires `window.characterWizard` for onclick handlers
5. **Inadequate Testing**: Test complete workflows, not just individual components

### Browser Integration Requirements
```javascript
// CRITICAL: Global references for HTML integration
window.characterWizard = wizard;  // For HTML onclick handlers
window.diceEngine = diceEngine;   // For HTML dice rolling
window.gameActions = gameActions; // For HTML game interactions
```

## Security Considerations

- Never execute untrusted code without validation
- Validate all user inputs in character creation
- Sanitize data before storage operations
- Use secure random number generation for dice rolling
- Protect against XSS in HTML generation

## Deployment Steps

1. **Pre-deployment Checklist**:
   - All ports cleaned and available
   - All modules tested and functional
   - No console errors in browser
   - Complete user workflows validated

2. **Production Deployment**:
   - Use enhanced server (`server-enhanced.js`)
   - Verify all static assets load correctly
   - Test character creation end-to-end
   - Validate adventure generation works
   - Confirm data persistence functions

## Documentation and Knowledge Transfer

### Comprehensive Work Logs
All major changes documented in `completed-work-by-agents/`:
- `COMPLETED-WORK-LOG.md` - Chronological change tracking
- `AI-AGENT-BUILD-INSTRUCTIONS.md` - Step-by-step build process
- `AI-AGENT-INSTRUCTIONS.md` - Comprehensive agent guidelines
- `TASK-LIST-EXAMPLES.md` - Todo management templates

### User Story Integration
Reference user stories in `user-stories/` folder:
- Systematic debugging methodology (US-011)
- Context gathering requirements (US-012) 
- Testing and validation protocols (US-013)
- Browser compatibility patterns (US-014)
- Documentation standards (US-015)

## Agent-Specific Instructions

### For GitHub Copilot in VS Code
- Always use the `manage_todo_list` tool for multi-step work
- Reference existing documentation before making changes
- Test changes in actual browser, not just Node.js
- Follow the established module architecture
- Document decisions and rationale in code comments

### For Other AI Coding Agents
- This workspace follows RulzLawyer conventions established in documentation
- Prioritize functionality and D&D 3.5 compliance
- Maintain backward compatibility with existing systems
- Create comprehensive test coverage for new features

## Quick Start for New Agents

1. **Read This File**: Complete understanding of project structure and requirements
2. **Review Documentation**: Check `completed-work-by-agents/` for detailed guidance  
3. **Examine Codebase**: Explore `code-repository/` to understand implementation
4. **Test Existing System**: Run validation scripts to confirm current functionality
5. **Plan Changes**: Use todo list tool for any non-trivial work
6. **Implement Carefully**: Follow established patterns and test thoroughly

## Need Help?

- **Architecture Questions**: See `completed-work-by-agents/AI-AGENT-BUILD-INSTRUCTIONS.md`
- **Debugging Issues**: Reference user stories US-011 through US-015
- **Code Standards**: Check existing implementations in `code-repository/src/`
- **Testing Guidance**: Review `COMPLETED-WORK-LOG.md` for validation examples

---

**Remember**: This is a fully functional D&D 3.5 gaming system. Maintain the high quality and comprehensive functionality that users expect from a complete gaming application.