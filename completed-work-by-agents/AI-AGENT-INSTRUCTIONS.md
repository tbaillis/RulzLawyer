# AI Agent Instructions for RulzLawyer Development

## 🤖 Critical Instructions for AI Agents

### **MANDATORY TASK MANAGEMENT PROTOCOL**

Every AI agent working on RulzLawyer MUST follow this protocol:

1. **CREATE TASK LIST IMMEDIATELY**
   - Use `manage_todo_list` tool for ANY multi-step work
   - Break down complex requests into specific, actionable items
   - Include implementation details and acceptance criteria

2. **TRACK PROGRESS CONTINUOUSLY** 
   - Mark ONE task as `in-progress` before starting work
   - Complete the work for that specific task
   - Mark task as `completed` IMMEDIATELY after finishing
   - Move to next task and repeat

3. **NEVER ABANDON INCOMPLETE WORK**
   - Do not end your turn with tasks marked `in-progress`
   - Complete ALL tasks or explicitly explain blockers
   - Provide clear status updates on remaining work

### **Example Task Management Flow**

**Initial Task Creation:**
```markdown
- [ ] Analyze current application state
- [ ] Identify specific issues to fix
- [ ] Implement character wizard fixes
- [ ] Test fixes in browser environment
- [ ] Validate all console errors resolved
```

**Progress Updates:**
```markdown  
- [x] Analyze current application state
- [x] Identify specific issues to fix
- [in-progress] Implement character wizard fixes
- [ ] Test fixes in browser environment
- [ ] Validate all console errors resolved
```

**Completion:**
```markdown
- [x] Analyze current application state
- [x] Identify specific issues to fix  
- [x] Implement character wizard fixes
- [x] Test fixes in browser environment
- [x] Validate all console errors resolved
```

## 🎯 Development Guidelines

### **Code Modification Patterns**

#### **1. Adding Global Exports**
When creating new classes, ALWAYS add both exports:
```javascript
// At end of file
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ClassName;
}
if (typeof window !== 'undefined') {
    window.ClassName = ClassName;
}
```

#### **2. Fixing Event Handlers**
HTML onclick handlers need global references:
```javascript
// In web interface when creating instances:
const wizard = new DnD35CharacterWizard(this.gameEngine);
window.characterWizard = wizard; // CRITICAL
wizard.startCreation();
```

#### **3. Storage Manager Methods**
Always check for missing methods and add aliases:
```javascript  
// Common pattern for compatibility:
async getAllCharacters() {
    return this.loadAllCharacters();
}
```

#### **4. Dependency Checking**
Use proper existence checks:
```javascript
if (typeof DnD35CharacterWizard !== 'undefined') {
    // Safe to use
} else {
    console.log('⚠️ Wizard not available');
}
```

### **Testing Protocol**

#### **1. Server Testing**
```markdown
Task List for Server Issues:
- [ ] Check if port 3000 is available
- [ ] Kill existing Node processes if needed
- [ ] Start server-enhanced.js (preferred)
- [ ] Verify all files serve correctly
- [ ] Test basic HTTP requests
```

#### **2. Module Loading Testing**
```markdown
Task List for Module Issues:  
- [ ] Check browser Network tab for 404 errors
- [ ] Verify all script tags in index.html
- [ ] Test global variable availability
- [ ] Check console for syntax errors
- [ ] Validate module export patterns
```

#### **3. Feature Testing**  
```markdown
Task List for Feature Issues:
- [ ] Test Create Character button click
- [ ] Verify wizard modal appears
- [ ] Test wizard navigation buttons
- [ ] Check character creation completion
- [ ] Validate character appears in list
```

### **Common Issue Resolution**

#### **Issue: Character Wizard Not Working**
```markdown
Task List:
- [ ] Check if DnD35CharacterWizard is globally available
- [ ] Verify wizard creation in createNewCharacter method
- [ ] Ensure window.characterWizard reference is set
- [ ] Test wizard navigation button functionality
- [ ] Check for JavaScript console errors
```

**Solution Pattern:**
```javascript
// In web-interface.js
createNewCharacter() {
    if (typeof DnD35CharacterWizard !== 'undefined') {
        const wizard = new DnD35CharacterWizard(this.gameEngine);
        window.characterWizard = wizard; // Essential!
        wizard.startCreation();
        return;
    }
    // Fallback code...
}
```

#### **Issue: Storage Manager Errors**
```markdown
Task List:
- [ ] Check if getAllCharacters method exists
- [ ] Verify storage manager initialization
- [ ] Test character loading functionality
- [ ] Add missing method aliases if needed
- [ ] Validate storage operations work
```

#### **Issue: Random Tables Not Available**
```markdown
Task List:  
- [ ] Check class name in app.js (should be RandomTablesEngine)
- [ ] Verify proper constructor parameters
- [ ] Test random table generation
- [ ] Check global export pattern
- [ ] Validate integration with game engine
```

### **Performance Considerations**

#### **File Loading Optimization**
```markdown
Task List for Performance:
- [ ] Minimize HTTP requests
- [ ] Use server-enhanced.js for better caching
- [ ] Check file sizes and loading times
- [ ] Optimize JavaScript execution order
- [ ] Test on slower network connections
```

#### **Browser Compatibility**
```markdown
Task List for Compatibility:
- [ ] Test in Chrome (primary)
- [ ] Verify in Firefox
- [ ] Check Safari compatibility  
- [ ] Test mobile browser functionality
- [ ] Validate responsive design
```

### **Error Handling Patterns**

#### **Graceful Degradation**
```javascript
try {
    // Primary functionality
    const result = primaryFunction();
    console.log('✅ Success:', result);
} catch (error) {
    console.error('❌ Error:', error);
    // Fallback functionality
    fallbackFunction();
}
```

#### **User Feedback**
```javascript
// Always provide user feedback
console.log('🔍 Starting character creation...');
// ... do work ...
console.log('✅ Character created successfully!');
```

### **Documentation Requirements**

#### **Code Comments**
- Add clear comments explaining complex logic
- Document any workarounds or special cases
- Include performance considerations
- Note dependencies and requirements

#### **Change Tracking**
```markdown
Task List for Documentation:
- [ ] Document what was changed
- [ ] Explain why change was necessary
- [ ] Note any side effects or dependencies
- [ ] Update relevant configuration files
- [ ] Record testing performed
```

### **Quality Assurance Checklist**

#### **Before Marking Tasks Complete**
```markdown
- [ ] Code compiles/loads without errors
- [ ] Feature works in browser environment
- [ ] No new console errors introduced
- [ ] All related functionality still works
- [ ] Performance is acceptable
- [ ] Mobile responsiveness maintained
```

#### **Before Ending Development Session**
```markdown
- [ ] All tasks marked as completed or blocked
- [ ] Server tested and functional
- [ ] Application tested end-to-end
- [ ] No critical errors remaining
- [ ] Status summary provided
- [ ] Next steps identified if applicable
```

## 🚨 Critical Success Factors

### **1. Always Use Enhanced Server**
- `server-enhanced.js` provides better logging and error handling
- Shows detailed request/response information  
- More reliable file serving

### **2. Maintain Global References**
- HTML onclick handlers require global variables
- Store wizard instances as `window.characterWizard`
- Export all classes to window object

### **3. Test Incrementally**
- Test each change immediately
- Use browser console for validation
- Check network tab for failed loads

### **4. Follow Task Management Protocol**
- Create task lists for all multi-step work
- Update progress continuously
- Complete all tasks before ending

---

**Remember: The manage_todo_list tool is not optional. It's a critical part of the development process that ensures proper task tracking and completion visibility.**