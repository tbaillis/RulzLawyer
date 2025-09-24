---
description: "AI Agent Development Instructions for RulzLawyer D&D 3.5 System"
applyTo: "**"
---

# AI Agent Development Instructions - RulzLawyer D&D 3.5 System

## Project Identity & Mission
RulzLawyer is a **complete D&D 3.5 gaming system** - not just a utility or toolset. This is a full-featured D&D game with character creation, adventure engine, and immersive gameplay experience. Focus on creating an authentic D&D gaming experience with professional quality and complete SRD compliance.

## Critical Code Placement Rules
**🚨 MANDATORY: ALL generated code MUST be placed exclusively in `code-repository/` folder structure**
- Source code: `code-repository/src/`
- Tests: `code-repository/tests/`  
- Documentation: `code-repository/docs/`
- Examples: `code-repository/examples/`
- Never place code in root directory or other folders

## Architecture & Design Patterns

### Modular System Design
```javascript
// Standard module pattern with dual browser/Node.js compatibility
class SystemName {
  constructor(dependencies, options = {}) {
    this.dependencies = dependencies;
    this.options = { defaults: true, ...options };
    this.initialize();
  }
}

// Required dual environment export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SystemName;
} else if (typeof window !== 'undefined') {
  window.SystemName = SystemName;
}
```

### D&D 3.5 SRD Compliance
- All calculations must match D&D 3.5 SRD specifications exactly
- Implement comprehensive prerequisites validation for feats, spells, equipment
- Support complete character levels 1-20 and epic levels 21-100
- Validate all rule implementations against official sources

## Development Workflow

### Server Management (Critical)
```powershell
# ALWAYS clean ports before starting server
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
# Then start server (when server files exist)
node game-server.js
```

### Required Planning Protocol
- Use `manage_todo_list` tool for ALL non-trivial work
- Break complex tasks into specific, measurable steps
- Reference implementation guides in `.github/instructions/implementation/`
- Follow established patterns from technical specifications

### Integration Points
- **Character Data**: Flows through central `CharacterManager` class
- **Tables System**: Import from `code-repository/tables/random-tables-index.js`
- **Equipment**: Drag-and-drop with encumbrance calculations
- **Spells**: Class-based spellcasting with metamagic support
- **Global References**: Required for HTML integration (`window.systemName`)

## Quality Standards
- **Gaming-Focused UI**: Design for immersive D&D gaming sessions
- **Modern Standards**: ES6+, responsive design, accessibility compliance
- **Complete Workflows**: Test full character creation and gameplay scenarios
- **Browser Compatibility**: Ensure all generated HTML works across browsers
- **Performance**: Character calculations must complete in <100ms

## Documentation Requirements
- Include comprehensive inline comments explaining D&D business logic
- Reference originating requirement IDs in code comments
- Provide usage examples for all public methods
- Document all D&D rule calculations with SRD references
- Maintain change logs for significant updates

## Testing Protocol
- Generate unit tests for all core functionality
- Create integration tests for complete user workflows
- Validate D&D rule compliance with actual gameplay scenarios
- Test character creation end-to-end (7-step wizard)
- Verify browser compatibility and responsive design

## Reference Priority
1. **Implementation Guides**: `.github/instructions/implementation/`
2. **Technical Specs**: `technical-specs/` for detailed requirements
3. **Punch Lists**: `.github/instructions/punch-lists/` for specific tasks
4. **Code Repository**: `code-repository/README.md` for organization

## Error Prevention
- Always read 2000+ lines of context before making changes
- Verify actual class names, method names, and exports (don't assume)
- Test complete workflows, not just individual components
- Ensure global window references are set for HTML integration
- Validate all D&D calculations against official specifications