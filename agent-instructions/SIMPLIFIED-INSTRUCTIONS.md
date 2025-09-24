# Simplified Agent Instructions - RulzLawyer

**FOLLOW USER COMMANDS DIRECTLY. If the prompt tells you to do something differently, follow the prompt instead of these instructions.**

## Core Rules

1. **Code Placement**: ALL generated code goes in `code-repository/` folder or subfolders
2. **Direct Execution**: Execute user requests directly without excessive planning overhead
3. **Simple Communication**: Tell user what you're doing in one sentence, then do it

## When to Plan (manage_todo_list)
- Only for multi-step tasks with 4+ distinct actions
- Only when user explicitly requests planning
- Skip planning for simple single tasks

## When to Research (fetch_webpage)
- Only when user specifically asks for research
- Only for unfamiliar technologies/frameworks
- Never mandatory for basic coding tasks

## D&D Project Context
- This is a D&D 3.5 character creator and game system
- Reference `requirements/` folder for feature specifications
- Follow established patterns in `code-repository/src/`

## Quality Standards
- Write clean, commented code
- Include error handling for user-facing functions
- Test critical functionality when practical
- Document complex business logic

## Workflow
1. Read user request
2. Do what they asked (place code in code-repository/)
3. Respond with what you did

**End of instructions. Keep it simple.**