# Code Generation Instructions

## Pre-Generation Checklist
Before generating any code, ensure you:

1. **Review Requirements**: Check `requirements/` folder for relevant functional and non-functional requirements
2. **Understand Context**: Review related user stories in `user-stories/` folder
3. **Check Technical Specs**: Consult `technical-specs/` for implementation guidelines
4. **Identify Tests**: Review `test-scenarios/` to understand expected behavior
5. **🚨 VERIFY CODE LOCATION**: Confirm you will place ALL code in `code-repository/` folder or its subfolders ONLY

## Code Generation Process

### 1. Analysis Phase
- Identify the specific requirement or user story being addressed
- Understand business logic and constraints
- Review technical architecture and design patterns
- Check for dependencies on other components

### 2. Design Phase
- Plan the code structure and organization
- Consider error handling and edge cases
- Design for testability and maintainability
- Plan documentation and comments

### 3. Implementation Phase
- Generate clean, readable code following project standards
- **🚨 MANDATORY: Place ALL code in `code-repository/` folder structure**
  - Source code: `code-repository/src/`
  - Tests: `code-repository/tests/`
  - Documentation: `code-repository/docs/`
  - Examples: `code-repository/examples/`
- Include comprehensive documentation
- Add appropriate error handling
- Consider performance and security implications

### 4. Validation Phase
- Generate corresponding unit tests
- Verify against acceptance criteria
- Check for potential security vulnerabilities
- Ensure code follows established patterns

## D&D Character Creator Specific Requirements

### Portrait Generation System (FR-007)
When implementing the D&D character creation tool, you MUST include the Character Portrait Designer system with the following mandatory components:

**Core Portrait Engine Requirements:**
- Layered SVG/Canvas-based graphics system
- Automatic portrait generation from character race/class/equipment choices
- Real-time synchronization with character object changes
- Manual customization tools for player personalization
- Asset library management for race-specific graphics
- Equipment visualization system with proper layering
- Export functionality in multiple formats (PNG, SVG, Data URL)

**Implementation Structure (ALL in code-repository/):**
```
code-repository/src/portrait/
├── portrait-engine.js          // Core PortraitEngine class
├── asset-library.js           // Asset management and loading
├── layer-manager.js           // SVG layer composition and z-index
├── customization-tools.js     // Manual customization interface
└── portrait-integration.js    // Character Manager integration

code-repository/src/data/portrait-assets/
├── races/                     // Race-specific base portraits and features
├── equipment/                 // Armor, weapons, accessories overlays  
├── customization/             // Hair styles, facial features, build options
└── backgrounds/               // Portrait backgrounds and themes
```

**Integration Requirements:**
- Portrait data embedded in central Character object
- Automatic updates triggered by race/class/equipment changes
- Performance targets: < 2s generation, < 500ms updates
- Cross-browser compatibility (Chrome, Firefox, Safari, Edge)
- Memory usage limits and cleanup procedures

**Technical Implementation Standards:**
- Pure JavaScript ES6+ (no external frameworks)
- SVG manipulation with proper layer management
- Event-driven architecture for real-time updates
- Comprehensive error handling and graceful degradation
- Asset lazy loading and optimization
- Export functionality with quality controls

### MANDATORY: Epic Level Progression System (FR-008)
**REQUIRED for ALL D&D Character Creator implementations:**

**Epic Level Engine Requirements:**
- Support character levels 21-100 with SRD-compliant progression rules
- Epic attack bonus calculation: +1 per odd level above 20
- Epic save bonus calculation: +1 per even level above 20  
- Epic feat selection every 3 levels (21, 24, 27, etc.)
- Epic spellcaster progression with Improved Spell Capacity feats
- Divine ascension system supporting divine ranks 0 through 21+
- Multiclass epic progression with cross-class restrictions
- Performance requirement: < 100ms calculation time per level

**Implementation Structure (ALL in code-repository/):**
```
code-repository/src/epic/
├── epic-level-engine.js        // Core EpicLevelEngine class
├── divine-ascension-manager.js // Divine rank and power management
├── epic-feat-selector.js       // Epic feat validation and selection
├── epic-spellcaster.js        // Epic spellcaster progression
└── epic-multiclass.js         // Epic multiclass rules engine

code-repository/src/data/epic-rules/
├── epic-progression-tables.js  // Level-based progression data
├── divine-abilities.js         // Divine rank powers and restrictions
├── epic-feats-database.js      // Epic feat prerequisites and effects
└── epic-spell-progression.js   // Spellcaster level advancement
```

**Integration Requirements:**
- Epic data embedded in central Character object epicProgression property
- Real-time updates for level advancement beyond 20
- Divine ascension triggers fundamental character type changes
- Epic feat prerequisites validation with existing character build
- Cross-system integration with ability scores, skills, and base classes

### MANDATORY: Story Tracker System (FR-009)
**REQUIRED for ALL D&D Character Creator implementations:**

**Story Tracker Requirements:**
- Automatic backstory generation based on character stats, race, class, and background
- Template-based guided creation with pre-defined narrative elements
- Free-form story editing with rich text and media support
- Story event tracking with timeline organization
- Character relationship management with NPCs and other PCs
- Plot hook generation tied to character background and goals
- Integration with character sheet as dedicated story tab/section
- Export capabilities for story elements and complete narratives

**Implementation Structure (ALL in code-repository/):**
```
code-repository/src/story/
├── story-tracker.js           // Core StoryTracker class
├── backstory-generator.js     // Automatic story generation engine
├── story-event-manager.js     // Timeline and event tracking
├── relationship-manager.js    // Character relationship system
├── narrative-templates.js     // Template-based story construction
└── story-integration.js      // Character sheet integration

code-repository/src/data/story-templates/
├── race-based-stories.js      // Race-specific narrative templates
├── class-based-stories.js     // Class-specific background elements
├── background-stories.js      // Background-specific story hooks
├── relationship-templates.js  // NPC and PC relationship frameworks
└── plot-hook-generators.js    // Automatic plot hook creation
```

**Integration Requirements:**
- Story data embedded in central Character object backstory property
- Automatic story generation triggers on character creation completion
- Template selection based on character's race, class, background, and ability scores
- Media asset management for character portraits, location images, and story illustrations
- Real-time story updates synchronized with character progression
- Story export functionality integrated with character sheet export system

## Code Templates

### Function Template
```python
# File: code-repository/src/[module]/[filename].py
# REQ-XXX: Related requirement description

def function_name(param: Type) -> ReturnType:
    """
    Brief description of function purpose.
    
    References:
    - REQ-XXX: Related requirement
    - US-XXX: Related user story
    
    Args:
        param: Description of parameter
        
    Returns:
        ReturnType: Description of return value
        
    Raises:
        SpecificException: When specific condition occurs
    """
    # TODO: Implement according to REQ-XXX
    pass
```

### Class Template
```python
# File: code-repository/src/[module]/[filename].py
# REQ-XXX: Related requirement description

class ClassName:
    """
    Brief description of class purpose.
    
    This class implements functionality described in:
    - REQ-XXX: Primary requirement
    - US-XXX: User story
    - TECH-SPEC-XXX: Technical specification
    
    Attributes:
        attribute_name: Description of attribute
    """
    
    def __init__(self, param: Type) -> None:
        """Initialize the class with required parameters."""
        self.attribute_name = param
    
    def method_name(self, param: Type) -> ReturnType:
        """Method description with reference to requirements."""
        pass
```

## Language-Specific Guidelines

### Python
- Follow PEP 8 style guidelines
- Use type hints for all parameters and return values
- Include comprehensive docstrings
- Use appropriate exception handling

### JavaScript/TypeScript
- Use consistent naming conventions (camelCase)
- Include JSDoc comments for functions and classes
- Use TypeScript for type safety when possible
- Follow modern ES6+ patterns

### Java
- Follow standard Java naming conventions
- Use appropriate access modifiers
- Include Javadoc comments
- Handle exceptions appropriately

## Testing Integration

### Unit Test Generation
When generating code, also create corresponding unit tests in `code-repository/tests/`:

```python
# File: code-repository/tests/unit/test_[module]_[filename].py
import unittest
from unittest.mock import Mock, patch
from code_repository.src.[module].[filename] import ClassName

class TestClassName(unittest.TestCase):
    """
    Unit tests for ClassName functionality.
    
    Tests validate requirements:
    - REQ-XXX: Primary requirement being tested
    - US-XXX: User story acceptance criteria
    """
    
    def setUp(self):
        """Set up test fixtures."""
        self.instance = ClassName()
    
    def test_method_name_success(self):
        """Test successful execution of method_name."""
        # Arrange
        expected_result = "expected_value"
        
        # Act
        result = self.instance.method_name("input")
        
        # Assert
        self.assertEqual(result, expected_result)
    
    def test_method_name_error_handling(self):
        """Test error handling in method_name."""
        # Test error scenarios from requirements
        with self.assertRaises(SpecificException):
            self.instance.method_name(invalid_input)
```

## Documentation Requirements

### Inline Documentation
- Include requirement references in comments
- Explain business logic and decisions
- Document assumptions and constraints
- Add TODO items for future enhancements

### API Documentation
- Generate API documentation for public interfaces
- Include usage examples
- Document error conditions and responses
- Reference related requirements and user stories

## Security Considerations
- Never hardcode secrets or credentials
- Validate all input parameters
- Use secure coding practices
- Follow security requirements from technical specifications
- Include appropriate logging for security events

## Performance Guidelines
- Consider performance requirements from technical specifications
- Use efficient algorithms and data structures
- Include performance-related comments when relevant
- Generate code that can be easily optimized later