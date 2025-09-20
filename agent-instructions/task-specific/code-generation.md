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