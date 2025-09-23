# Portrait Designer System Implementation Guide

## 🎨 SYSTEM OVERVIEW

**Purpose**: Complete SVG-based character portrait generation with equipment synchronization  
**Priority**: Phase 1 - Weeks 1-6 (8 Story Points)  
**Dependencies**: Character Manager, Asset Library  
**Code Location**: `code-repository/src/portrait/`  

## 📋 IMPLEMENTATION REQUIREMENTS

### **Core Files to Implement**
```
portrait/
├── portrait-engine.js          # Main portrait generation engine
├── asset-library.js           # SVG asset loading and management  
├── layer-manager.js           # Portrait layer composition
├── customization-tools.js     # Color/feature customization
├── svg-renderer.js            # SVG document generation
├── export-manager.js          # PNG/SVG export functionality
└── performance-monitor.js     # Performance tracking
```

### **Key Features Required**
1. **Portrait Generation** (US-CPD-001)
   - Generate base portraits for all 7 D&D races
   - Support male/female variations
   - Include 5 body build types (slim, average, stocky, muscular, heavy)

2. **Equipment Synchronization** (US-CPD-002)
   - Real-time equipment visualization updates
   - Proper layering (base → armor → weapons → accessories)
   - Equipment positioning based on body type

3. **Customization Engine** (US-CPD-003)
   - Color customization (skin, hair, eyes)
   - Facial feature variations (nose, eyes, chin)
   - Racial characteristic application

4. **Export System** (US-CPD-004)
   - SVG export for vector graphics
   - PNG export for raster images
   - WebP export for web optimization

## 🏗️ TECHNICAL ARCHITECTURE

### **Class Structure**
```javascript
// Main engine class with initialization and caching
class PortraitEngine {
  constructor(assetLibrary, characterManager) {
    this.assetLibrary = assetLibrary;
    this.characterManager = characterManager;
    this.svgRenderer = new SVGRenderer();
    this.layerManager = new LayerManager();
    this.customizationEngine = new CustomizationEngine();
    this.exportManager = new PortraitExportManager();
    this.performanceMonitor = new PortraitPerformanceMonitor();
    this.portraitCache = new Map();
    this.initialized = false;
  }
}
```

### **Performance Requirements**
- Portrait generation: <1 second
- Equipment updates: <500ms
- Export operations: <2 seconds
- Memory usage: <50MB for asset cache

### **Browser Compatibility**
- Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- SVG 1.1 support required
- Canvas 2D context for raster exports

## 📊 ASSET REQUIREMENTS

### **Asset Structure**
```
code-repository/src/data/portrait-assets/
├── races/
│   ├── human/ (male/female base templates)
│   ├── dwarf/ (with racial characteristics)
│   ├── elf/ (pointed ears, different proportions)
│   ├── gnome/ (small stature scaling)
│   ├── half-elf/ (mixed characteristics)
│   ├── half-orc/ (tusks, different build)
│   └── halfling/ (small stature, proportions)
├── equipment/
│   ├── weapons/ (all SRD weapons with positioning)
│   ├── armor/ (light/medium/heavy with layering)
│   ├── shields/ (buckler, light, heavy, tower)
│   └── accessories/ (rings, amulets, cloaks, boots)
├── customization/
│   ├── hair-styles/ (20+ options per race/gender)
│   ├── facial-features/ (nose, eyes, chin variations)
│   ├── skin-tones/ (diverse representation)
│   └── build-types/ (body type variations)
└── effects/
    ├── magical-auras/ (for magical equipment)
    ├── class-effects/ (divine glow for clerics, etc.)
    └── status-effects/ (visual indicators)
```

### **SVG Asset Guidelines**
- Use clean, optimized SVG markup
- Include proper viewBox and dimensions
- Layer elements with appropriate z-index
- Use CSS classes for colorizable elements
- Include positioning metadata in comments

## 🧪 TESTING REQUIREMENTS

### **Unit Tests Required**
- Portrait generation for all races
- Equipment synchronization accuracy
- Customization feature validation
- Export functionality verification
- Performance benchmark validation

### **Integration Tests Required**
- Character Manager data sync
- Real-time equipment updates
- Cross-browser compatibility
- Memory usage monitoring

## 🚀 IMPLEMENTATION WORKFLOW

### **Phase 1: Core Engine (Week 1-2)**
1. Implement PortraitEngine class
2. Create AssetLibrary with basic loading
3. Build SVGRenderer for composition
4. Implement basic portrait generation

### **Phase 2: Equipment System (Week 3-4)**
1. Create LayerManager for equipment layering
2. Implement equipment synchronization
3. Add positioning algorithms for different body types
4. Create equipment asset loading system

### **Phase 3: Customization (Week 5)**
1. Implement CustomizationEngine
2. Add color customization tools
3. Create facial feature variations
4. Implement undo/redo system

### **Phase 4: Export & Polish (Week 6)**
1. Create PortraitExportManager
2. Implement PNG/SVG/WebP exports
3. Add performance monitoring
4. Optimize and test complete system

## 📚 REFERENCE DOCUMENTATION

- **Primary Specification**: [ULTIMATE-IMPLEMENTATION-GUIDE.md#portrait-designer](../../ULTIMATE-IMPLEMENTATION-GUIDE.md)
- **User Stories**: [character-portrait-designer-story.md](../../user-stories/character-portrait-designer-story.md)
- **Test Scenarios**: [portrait-generation-test.md](../../test-scenarios/portrait-generation-test.md)
- **Integration Guide**: [CHARACTER_MANAGER_INTEGRATION.md](CHARACTER_MANAGER_INTEGRATION.md)

## ⚡ QUICK START CHECKLIST

- [ ] Create all required class files in `portrait/` folder
- [ ] Implement dual browser/Node.js compatibility exports
- [ ] Create comprehensive test suite in `tests/portrait/`
- [ ] Build asset loading system with caching
- [ ] Implement character-portrait synchronization
- [ ] Add performance monitoring and optimization
- [ ] Validate against all user stories and requirements
- [ ] Test cross-browser compatibility

## 🎯 SUCCESS CRITERIA

- All 7 D&D races generate unique, recognizable portraits
- Equipment synchronization works in real-time
- Customization tools provide meaningful personalization
- Export functionality produces high-quality images
- Performance meets <1 second generation requirement
- 90%+ test coverage for all functionality

---

**Next System**: Epic Level Engine (Weeks 7-14)  
**Dependencies**: This system is required for Character Manager integration