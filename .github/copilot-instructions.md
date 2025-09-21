```instructions
<!-- GitHub Copilot Instructions - Legacy Support -->

⚠️ **DEPRECATED**: This file is maintained for backward compatibility only.

## 📋 Current Instructions Location

**Primary AI Instructions**: See `AGENTS.md` in the workspace root for comprehensive AI agent guidance.

VS Code now supports the `AGENTS.md` standard (August 2025 update) which provides a unified format for all AI coding agents. All current instructions have been migrated to the workspace root `AGENTS.md` file.

## Quick Reference

For immediate guidance, the `AGENTS.md` file contains:
- Complete project overview and context
- Mandatory agent protocols and todo list usage
- Critical server management rules (port cleanup)
- Build commands and system architecture
- Testing instructions and validation protocols
- Code style conventions and error patterns
- Security considerations and deployment steps

## Legacy Content (Migrated to AGENTS.md)

- **🚨 CRITICAL: Place ALL generated code exclusively in `code-repository/` folder or its subfolders**
- **🔥 ALWAYS Clean Up Ports**: Before running server, clean port 3000 first
- Reference comprehensive documentation in `completed-work-by-agents/` folder
- Use `manage_todo_list` tool for all non-trivial work

**Recommendation**: Use the workspace root `AGENTS.md` file for all AI agent interactions in VS Code.
```