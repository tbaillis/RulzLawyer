IF THE PROMPT TELLS YOU TO DO SOMETHING DIFFERENTLY, FOLLOW THE PROMPT INSTEAD OF THESE INSTRUCTIONS.

# GitHub Copilot Instructions - RulzLawyer D&D 3.5 Character Creator

## 🎯 Project Overview
RulzLawyer is a comprehensive **D&D 3.5 GAME** - not just a toolset or utility, but a complete gaming experience with Character Creator and Adventure Engine. This is a fully-featured D&D game with modular architecture and complete SRD compliance, designed for immersive gameplay sessions. The project is in active development with extensive documentation-driven requirements.

## 🚨 Critical Code Placement Rules
**ALL generated code MUST be placed exclusively in `code-repository/` folder or its subfolders**
- Never place code in root directory or other folders  
- Follow established module structure in `code-repository/src/`
- Reference `code-repository/README.md` for organization guidelines

## 🏗️ Architecture Patterns
### Modular System Design
```javascript
// Standard module pattern with dual browser/Node.js compatibility
class SystemName {
  constructor(dependencies, options = {}) {
    // Dependency injection pattern
    this.dependencies = dependencies;
    this.options = { defaults: true, ...options };
    this.initialize();
  }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SystemName;
} else if (typeof window !== 'undefined') {
  window.SystemName = SystemName;
}
```

### D&D 3.5 SRD Compliance Pattern
```javascript
// All D&D mechanics must reference SRD rules with validation
validatePrerequisites(requirements, character) {
  const validation = { valid: true, reasons: [] };
  // Comprehensive D&D 3.5 rule validation
  return validation;
}
```

## 🔧 Development Workflow
### Server Management (CRITICAL)
```powershell
# ALWAYS clean ports before starting server
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
# Then start server (when server files exist)
node server-enhanced.js
```

### Table System Integration
- Import modular tables from `code-repository/tables/`
- Use `RandomTablesData` unified interface
- Follow established table data structure patterns

### Character System Integration
- Character data flows through central `CharacterManager`
- All systems validate against D&D 3.5 SRD rules
- Equipment, spells, feats integrate with character stats

## 📋 Planning & Documentation
### Mandatory Todo Usage
- Use `manage_todo_list` tool for ALL non-trivial work
- Reference comprehensive documentation in `completed-work-by-agents/`
- Follow established phase-based implementation patterns

### Key Documentation Files
- `AGENTS.md` - Complete AI agent guidance (primary reference)
- `IMPLEMENTATION_GUIDE.md` - Technical implementation roadmap
- `COMPREHENSIVE_GAME_PLAN.md` - 18-day development plan
- `completed-work-by-agents/` - Detailed work history and patterns

## 🎲 Domain-Specific Patterns
### Complete D&D 3.5 Game Implementation
- **Full Game Experience**: This is a complete D&D game, not a utility or toolset
- All calculations must match SRD specifications exactly for authentic gameplay
- Implement prerequisites validation for feats, spells, equipment
- Support multiclass characters and epic levels (21-100) for complete campaigns

### Web Interface Standards  
- **Gaming-Focused UI**: Design for immersive D&D gaming sessions, not just character management
- Modern drag-and-drop inventory management for in-game equipment handling
- Responsive design with accessibility compliance for all players
- Global window exports for HTML integration (`window.systemName`)

### Testing & Validation
- **Complete Gaming Workflows**: Test full D&D gameplay scenarios, not just individual features
- Test complete character creation workflows (7-step wizard)
- Validate D&D rule compliance with actual gameplay scenarios
- Browser compatibility testing for all generated HTML

## 🔄 Integration Points
- **Tables System**: `code-repository/tables/random-tables-index.js`
- **Character Data**: Centralized through `CharacterManager` class
- **Equipment System**: Drag-and-drop with encumbrance calculation
- **Spell System**: Class-based spellcasting with metamagic support

## 📖 Reference Priority
1. **Primary**: `AGENTS.md` for complete guidance
2. **Implementation**: `IMPLEMENTATION_GUIDE.md` for technical details  
3. **History**: `completed-work-by-agents/COMPLETED-WORK-LOG.md` for patterns
4. **Specifications**: Files in `technical-specs/` for detailed requirements