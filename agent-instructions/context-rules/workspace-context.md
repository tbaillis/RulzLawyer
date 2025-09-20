# Context-Aware Rules for Coding Agents

## Project Context Understanding

### Requirements Workspace Context
When working in this requirements workspace, agents should:

1. **Prioritize Documentation**: This is a documentation-focused environment
2. **Reference Templates**: Always use established templates from `templates/` folder
3. **Maintain Traceability**: Link all generated content back to requirements
4. **Follow Established Patterns**: Use examples in `examples/` folder as guides

### File Type Recognition

#### When Working with Requirements Documents (.md in requirements/)
- Focus on formal requirement specification
- Include all required sections from template
- Use precise, measurable language
- Reference related user stories and technical specs

#### When Working with User Stories (.md in user-stories/)
- Use "As a... I want... So that..." format
- Include clear acceptance criteria
- Reference related requirements and test scenarios
- Consider different user personas and roles

#### When Working with Technical Specifications (.md in technical-specs/)
- Include architectural diagrams and code examples
- Specify technical constraints and dependencies
- Document APIs and data models
- Reference implementation requirements

#### When Working with Test Scenarios (.md in test-scenarios/)
- Include comprehensive test steps
- Cover both positive and negative test cases
- Reference requirements and user stories being tested
- Include test data and expected results

## Contextual Adaptation

### Requirements Analysis Context
When requirements are being analyzed or prioritized:
- Use the prioritization matrix in `analysis/requirements-analysis-framework.md`
- Consider business impact, technical feasibility, and risk factors
- Reference existing gap analysis and decision logs
- Maintain consistency with established priority levels

### Code Generation Context
When generating code based on requirements:
- **🚨 CRITICAL: Place ALL code exclusively in `code-repository/` folder or its subfolders**
- Always reference the originating requirement ID
- Follow coding standards specified in quality standards
- Generate corresponding tests and documentation
- Consider the broader system architecture
- Use the established folder structure:
  - Source code: `code-repository/src/`
  - Tests: `code-repository/tests/`
  - Documentation: `code-repository/docs/`
  - Examples: `code-repository/examples/`

### Review and Validation Context
When reviewing or validating requirements:
- Check completeness against templates
- Verify traceability between related documents
- Validate against acceptance criteria
- Ensure consistency across document types

## Domain-Specific Rules

### Legal/Regulatory Requirements
If working with legal or regulatory requirements:
- Include compliance references and citations
- Document audit trails and approval processes
- Consider data privacy and security implications
- Include risk assessment and mitigation strategies

### Technical Implementation Requirements
When dealing with technical requirements:
- Specify technical constraints clearly
- Include performance and scalability requirements
- Document integration points and dependencies
- Consider security and maintenance implications

### User Experience Requirements
For UX-related requirements:
- Include user journey mapping
- Specify accessibility requirements
- Document usability criteria and metrics
- Consider different user personas and scenarios

## Consistency Rules

### Naming Conventions
- Requirement IDs: REQ-XXX (e.g., REQ-001)
- User Story IDs: US-XXX (e.g., US-001)
- Technical Spec IDs: TECH-SPEC-XXX (e.g., TECH-SPEC-001)
- Test Scenario IDs: TEST-XXX (e.g., TEST-001)

### Cross-Reference Format
When referencing related documents:
- Use consistent ID format: "[Document Type]-[Number]"
- Include brief description: "REQ-001: User Authentication"
- Link to specific sections when relevant
- Maintain bidirectional references where possible

### Version Control
- Update document version numbers when making changes
- Document change rationale in change logs
- Maintain backward compatibility with existing references
- Archive outdated versions appropriately

## Quality Assurance Rules

### Completeness Checks
Before finalizing any document:
- Verify all template sections are addressed
- Check that acceptance criteria are testable
- Ensure all dependencies are documented
- Validate that business value is clearly stated

### Consistency Checks
- Cross-reference related documents for consistency
- Verify naming conventions are followed
- Check that priority levels align with business objectives
- Ensure technical specifications match requirements

### Review Process
- Include stakeholder review requirements
- Document approval processes and sign-offs
- Maintain review history and feedback incorporation
- Schedule regular requirement review cycles

## Adaptation Guidelines

### Learning from Feedback
Agents should adapt based on:
- Stakeholder feedback on generated requirements
- Patterns in approved vs rejected requirements
- Common issues identified during reviews
- Changes in business priorities or constraints

### Continuous Improvement
- Update instructions based on project evolution
- Incorporate lessons learned from implementation
- Refine templates based on usage patterns
- Enhance traceability mechanisms over time