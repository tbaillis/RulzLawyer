<!-- Coding Agent Requirements Workspace Instructions -->

This workspace is designed for developing, documenting, and analyzing requirements for coding agents. 

## Project Context
- **Purpose**: Requirements analysis and specification for coding agents
- **Focus Areas**: User stories, technical specifications, testing scenarios, and examples
- **Output**: Comprehensive requirements documentation for coding agent development

## Guidelines for Copilot
- When working with requirements documents, focus on clarity and completeness
- Provide structured formats for requirements gathering
- Suggest templates and frameworks for requirement analysis
- Help organize requirements by priority, feasibility, and user impact
- Assist in creating test scenarios and acceptance criteria
- Support analysis of existing coding agent capabilities and gaps
- **🚨 CRITICAL: Place ALL generated code exclusively in `code-repository/` folder or its subfolders**
- Reference the `code-repository/README.md` for code organization guidelines

## 🚀 Server Management Rules
- **🔥 ALWAYS Clean Up Ports Before Starting Server**: Before running `node server.js`, ALWAYS check for and kill any processes using port 3000 to prevent "address already in use" errors
- **Port Cleanup Commands**: 
  - Windows PowerShell: `Get-Process -Name node | Stop-Process -Force` or `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`
  - Cross-platform: `npx kill-port 3000` (if kill-port is installed)
- **Startup Sequence**: 1) Clean ports, 2) Start server, 3) Verify functionality
- **Error Prevention**: Never attempt to start server without first ensuring port 3000 is available