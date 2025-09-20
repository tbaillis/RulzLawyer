# Code Repository

**🚨 IMPORTANT: This is the ONLY designated location for AI-generated code in this workspace.**

All coding agents and AI assistants must place generated code exclusively within this `code-repository` folder or its subfolders. No code should be generated or placed in any other location within the workspace.

## 🎲 Primary Project: D&D Character Creator with Adventure Engine

This code repository contains the implementation for a comprehensive **D&D 3.5 Character Creator** with integrated **AI-powered Adventure Engine**.

### 🏗️ System Architecture Overview

```
code-repository/src/
├── character/             # Character creation and management system
│   ├── character-manager.js      # Core character data management
│   ├── ability-scores.js         # Ability score generation methods
│   ├── race-manager.js           # Race selection and bonuses
│   ├── class-manager.js          # Class selection and progression
│   └── multiclass-engine.js      # Multiclass rule implementation
├── adventure/             # 🚨 AI-Powered Adventure Engine
│   ├── adventure-engine.js       # Core adventure orchestration
│   ├── ai-integration.js         # ChatGPT/Copilot API integration
│   ├── encounter-engine.js       # Combat simulation and encounters
│   ├── spell-management.js       # Spell system and slot tracking
│   ├── equipment-engine.js       # Dynamic equipment stat calculation
│   ├── narrative-generator.js    # AI story generation in character voice
│   └── world-state-manager.js    # Adventure state persistence
├── epic/                  # Epic level progression system
│   ├── epic-level-engine.js      # Levels 21-100 progression
│   ├── divine-ascension.js       # Divine rank and powers
│   └── epic-feat-selector.js     # Epic feat selection and validation
├── portrait/              # Character portrait generation
│   ├── portrait-engine.js        # SVG/Canvas portrait system
│   ├── asset-library.js          # Portrait asset management
│   └── customization-tools.js    # Manual customization interface
├── story/                 # Story tracker and backstory system
│   ├── story-tracker.js          # Character backstory management
│   ├── backstory-generator.js    # Automatic story generation
│   └── relationship-manager.js   # NPC and PC relationships
├── dice/                  # High-performance dice engine
│   └── dice-engine.js            # Optimized random number generation
└── data/                  # SRD data and rule databases
    ├── srd-database.js           # Complete SRD 3.5 rules
    ├── spell-database.js         # All SRD spells with effects
    └── monster-database.js       # Monster stats and AI behaviors
```

### 🎯 Core System Priorities

1. **Adventure Engine** - AI-powered DM with full SRD compliance
2. **Character Management** - Complete D&D 3.5 character creation
3. **Epic Level Support** - Levels 21-100 with divine ascension
4. **Portrait System** - Dynamic character visualization
5. **Story Tracker** - Backstory generation and relationship management

## Directory Structure

```
code-repository/
├── src/                    # Source code implementations
│   ├── adventure/         # 🚨 AI Adventure Engine (CORE SYSTEM)
│   ├── character/         # Character creation and management
│   ├── epic/              # Epic level progression (21-100)
│   ├── portrait/          # Character portrait generation
│   ├── story/             # Story tracker and backstory system
│   ├── dice/              # High-performance dice engine
│   ├── data/              # SRD databases and rule data
│   └── utils/             # Utility functions and helpers
├── tests/                 # Test files and test suites
│   ├── unit/              # Unit tests
│   ├── integration/       # Integration tests
│   └── e2e/               # End-to-end tests
├── docs/                  # Code documentation and API docs
│   ├── api/               # API documentation
│   └── guides/            # Implementation guides
├── examples/              # Code examples and demos
└── README.md             # This file
```

## Code Organization Guidelines

### Source Code (`src/`)
- **Purpose**: All production code implementations
- **Structure**: Organized by feature/module/domain
- **Requirements**: Must reference originating requirement IDs in comments
- **Quality**: Must follow quality standards from `agent-instructions/quality-standards/`

### Tests (`tests/`)
- **Purpose**: All test code and test suites
- **Structure**: Mirror the `src/` structure for easy navigation
- **Coverage**: Tests must cover all generated source code
- **Traceability**: Link tests to specific requirements and user stories

### Documentation (`docs/`)
- **Purpose**: Technical documentation for generated code
- **Content**: API documentation, implementation guides, architecture diagrams
- **Maintenance**: Updated automatically when code is generated or modified

### Examples (`examples/`)
- **Purpose**: Working code examples and demonstrations
- **Usage**: Show how to use generated code and APIs
- **Testing**: Examples must be tested and validated

## AI Code Generation Rules

### 🚨 MANDATORY REQUIREMENTS

1. **Location Enforcement**: ALL generated code must be placed in `code-repository/` or its subfolders
2. **No External Code**: Do not create code files anywhere else in the workspace
3. **Folder Structure**: Follow the established directory structure
4. **Naming Conventions**: Use clear, descriptive file and folder names
5. **Requirement Traceability**: Include requirement references in all generated code

### Code Placement Matrix

| Code Type | Location | Example |
|-----------|----------|---------|
| Business Logic | `src/core/` | `src/core/user_authentication.py` |
| API Endpoints | `src/services/` | `src/services/auth_service.py` |
| Utility Functions | `src/utils/` | `src/utils/validation_helpers.py` |
| Unit Tests | `tests/unit/` | `tests/unit/test_user_authentication.py` |
| Integration Tests | `tests/integration/` | `tests/integration/test_auth_flow.py` |
| API Documentation | `docs/api/` | `docs/api/authentication_api.md` |
| Code Examples | `examples/` | `examples/authentication_example.py` |

### Required Code Headers

All generated code files must include this header:

```python
"""
[Brief description of the file's purpose]

Requirements Traceability:
- REQ-XXX: [Requirement description]
- US-XXX: [User story description]
- TEST-XXX: [Related test scenario]

Generated: [Date]
Last Modified: [Date]
"""
```

### Quality Assurance

#### Before Code Generation
- [ ] Identify the correct subfolder for the code type
- [ ] Review related requirements and user stories
- [ ] Check for existing similar implementations
- [ ] Plan the file structure and naming

#### During Code Generation
- [ ] Include requirement traceability in comments
- [ ] Follow established coding standards
- [ ] Generate corresponding tests
- [ ] Create or update documentation

#### After Code Generation
- [ ] Verify code is in correct location
- [ ] Run tests to ensure functionality
- [ ] Update related documentation
- [ ] Link to originating requirements

## Integration with Requirements

### Requirement Implementation Tracking

| Requirement ID | Implementation File | Test File | Documentation | Status |
|----------------|-------------------|-----------|---------------|--------|
| REQ-001 | `src/auth/authentication.py` | `tests/unit/test_authentication.py` | `docs/api/auth.md` | ✅ Complete |
| REQ-002 | `src/core/user_management.py` | `tests/unit/test_user_management.py` | `docs/api/users.md` | 🔄 In Progress |

### Cross-Reference System
- **From Requirements**: Reference implementation files in requirements documents
- **From Code**: Include requirement IDs in code comments and docstrings
- **From Tests**: Link test cases to specific requirements and code modules
- **From Documentation**: Connect API docs to business requirements

## Development Workflow

### 1. Requirement Analysis
- Review requirement in `requirements/` folder
- Identify implementation approach
- Plan code structure and location

### 2. Code Generation
- Generate code in appropriate `code-repository` subfolder
- Include requirement traceability
- Follow naming conventions and quality standards

### 3. Testing
- Generate corresponding tests in `tests/` folder
- Ensure test coverage meets requirements
- Validate against acceptance criteria

### 4. Documentation
- Generate or update API documentation
- Create usage examples if needed
- Update implementation tracking

### 5. Integration
- Update requirement documents with implementation references
- Link user stories to completed implementations
- Update technical specifications with actual implementation details

## Maintenance and Updates

### Version Control
- All code in this repository should be version controlled
- Use clear commit messages with requirement references
- Maintain branch structure for feature development

### Code Reviews
- All generated code should go through review process
- Validate against requirements and quality standards
- Ensure proper placement and organization

### Refactoring
- When refactoring, maintain file locations unless restructuring is necessary
- Update all references and documentation
- Preserve requirement traceability

---

## 🚨 ENFORCEMENT NOTICE

**This code repository is the EXCLUSIVE location for all AI-generated code.**

Any code generated outside of this folder structure violates workspace organization standards and must be moved to the appropriate subfolder within `code-repository/`.

**Violations will result in:**
- Code organization issues
- Broken requirement traceability
- Failed quality assurance checks
- Difficulty in maintenance and updates

**Always verify code placement before completing any code generation task.**

---

**Created**: September 20, 2025  
**Last Updated**: September 20, 2025  
**Maintained By**: AI Development Team