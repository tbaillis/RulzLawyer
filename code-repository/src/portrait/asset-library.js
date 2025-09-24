// code-repository/src/portrait/asset-library.js
class AssetLibrary {
  constructor() {
    this.assets = new Map();
    this.templates = new Map();
    this.racialCharacteristics = new Map();
    this.equipmentAssets = new Map();
    this.loaded = false;
  }

  async loadAllAssets() {
    if (this.loaded) return;

    try {
      await Promise.all([
        this.loadBaseTemplates(),
        this.loadRacialCharacteristics(),
        this.loadEquipmentAssets(),
        this.loadCustomizationAssets()
      ]);

      this.loaded = true;
      console.log('✅ All portrait assets loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load portrait assets:', error);
      throw new AssetLibraryLoadError(error.message);
    }
  }

  async loadBaseTemplates() {
    // Base templates for different races and genders
    const templates = {
      'human-male': this.createHumanMaleTemplate(),
      'human-female': this.createHumanFemaleTemplate(),
      'elf-male': this.createElfMaleTemplate(),
      'elf-female': this.createElfFemaleTemplate(),
      'dwarf-male': this.createDwarfMaleTemplate(),
      'dwarf-female': this.createDwarfFemaleTemplate(),
      'halfling-male': this.createHalflingMaleTemplate(),
      'halfling-female': this.createHalflingFemaleTemplate(),
      'gnome-male': this.createGnomeMaleTemplate(),
      'gnome-female': this.createGnomeFemaleTemplate(),
      'half-elf-male': this.createHalfElfMaleTemplate(),
      'half-elf-female': this.createHalfElfFemaleTemplate(),
      'half-orc-male': this.createHalfOrcMaleTemplate(),
      'half-orc-female': this.createHalfOrcFemaleTemplate()
    };

    for (const [key, template] of Object.entries(templates)) {
      this.templates.set(key, template);
    }
  }

  async loadRacialCharacteristics() {
    // Racial characteristic modifications
    this.racialCharacteristics.set('human', {
      skinTone: { base: '#DEB887', variations: ['#F5DEB3', '#D2B48C', '#BC986A'] },
      hairColor: { natural: ['#8B4513', '#654321', '#2F1B14', '#000000'] },
      eyeColor: { natural: ['#4169E1', '#228B22', '#8B4513', '#2E2E2E'] },
      heightModifier: 1.0,
      buildModifier: 1.0
    });

    this.racialCharacteristics.set('elf', {
      skinTone: { base: '#F0E68C', variations: ['#FFFACD', '#F5DEB3', '#DEB887'] },
      hairColor: { natural: ['#FFD700', '#FFA500', '#FF6347', '#DC143C', '#8B0000'] },
      eyeColor: { natural: ['#98FB98', '#00CED1', '#9370DB', '#FF69B4'] },
      heightModifier: 1.05,
      buildModifier: 0.95,
      features: ['pointed-ears', 'slender-build']
    });

    this.racialCharacteristics.set('dwarf', {
      skinTone: { base: '#CD853F', variations: ['#D2691E', '#A0522D', '#8B4513'] },
      hairColor: { natural: ['#8B4513', '#654321', '#2F1B14', '#FF6347', '#FFD700'] },
      eyeColor: { natural: ['#4169E1', '#228B22', '#8B4513', '#2E2E2E'] },
      heightModifier: 0.85,
      buildModifier: 1.15,
      features: ['braided-beard', 'stocky-build', 'facial-tattoos']
    });

    this.racialCharacteristics.set('halfling', {
      skinTone: { base: '#F4A460', variations: ['#DEB887', '#D2B48C', '#BC986A'] },
      hairColor: { natural: ['#8B4513', '#654321', '#2F1B14', '#FFD700', '#FF6347'] },
      eyeColor: { natural: ['#4169E1', '#228B22', '#8B4513', '#FF69B4'] },
      heightModifier: 0.6,
      buildModifier: 0.8,
      features: ['large-eyes', 'curly-hair', 'nimble-build']
    });

    this.racialCharacteristics.set('gnome', {
      skinTone: { base: '#DDA0DD', variations: ['#BA55D3', '#9370DB', '#8A2BE2'] },
      hairColor: { natural: ['#FF6347', '#FFD700', '#FF69B4', '#00CED1', '#FFFFFF'] },
      eyeColor: { natural: ['#98FB98', '#00CED1', '#9370DB', '#FF69B4'] },
      heightModifier: 0.5,
      buildModifier: 0.7,
      features: ['large-ears', 'pointed-nose', 'colorful-clothing']
    });

    this.racialCharacteristics.set('half-elf', {
      skinTone: { base: '#E6E6FA', variations: ['#F0E68C', '#DEB887', '#D2B48C'] },
      hairColor: { natural: ['#FFD700', '#FFA500', '#FF6347', '#DC143C', '#8B0000', '#000000'] },
      eyeColor: { natural: ['#98FB98', '#00CED1', '#9370DB', '#FF69B4', '#4169E1'] },
      heightModifier: 1.0,
      buildModifier: 0.95,
      features: ['slightly-pointed-ears', 'mixed-heritage']
    });

    this.racialCharacteristics.set('half-orc', {
      skinTone: { base: '#8FBC8F', variations: ['#556B2F', '#228B22', '#006400'] },
      hairColor: { natural: ['#000000', '#2F1B14', '#654321', '#8B4513'] },
      eyeColor: { natural: ['#4169E1', '#228B22', '#8B4513', '#2E2E2E'] },
      heightModifier: 1.1,
      buildModifier: 1.2,
      features: ['prominent-teeth', 'muscular-build', 'tribal-tattoos']
    });
  }

  async loadEquipmentAssets() {
    // Equipment visualization assets
    this.equipmentAssets.set('weapons', {
      'longsword': { svg: this.createLongswordSVG(), position: { x: 20, y: 30 } },
      'shortsword': { svg: this.createShortswordSVG(), position: { x: 15, y: 35 } },
      'dagger': { svg: this.createDaggerSVG(), position: { x: 10, y: 40 } },
      'bow': { svg: this.createBowSVG(), position: { x: 25, y: 20 } },
      'staff': { svg: this.createStaffSVG(), position: { x: 30, y: 15 } }
    });

    this.equipmentAssets.set('armor', {
      'leather': { svg: this.createLeatherArmorSVG(), layer: 'body' },
      'chainmail': { svg: this.createChainmailSVG(), layer: 'body' },
      'platemail': { svg: this.createPlatemailSVG(), layer: 'body' },
      'robe': { svg: this.createRobeSVG(), layer: 'body' }
    });

    this.equipmentAssets.set('shields', {
      'buckler': { svg: this.createBucklerSVG(), position: { x: -10, y: 25 } },
      'heater': { svg: this.createHeaterShieldSVG(), position: { x: -15, y: 20 } },
      'tower': { svg: this.createTowerShieldSVG(), position: { x: -20, y: 15 } }
    });
  }

  async loadCustomizationAssets() {
    // Customization options
    this.assets.set('hair-styles', [
      'short', 'medium', 'long', 'braided', 'ponytail', 'bun', 'bald'
    ]);

    this.assets.set('facial-hair', [
      'none', 'mustache', 'beard', 'goatee', 'sideburns'
    ]);

    this.assets.set('accessories', [
      'cape', 'hood', 'hat', 'helmet', 'circlet', 'earrings', 'necklace'
    ]);
  }

  // Template creation methods
  createHumanMaleTemplate() {
    return {
      base: {
        head: { shape: 'oval', size: 'medium' },
        body: { shape: 'athletic', size: 'medium' },
        limbs: { proportion: 'standard' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'facial-hair', 'accessories', 'weapons']
    };
  }

  createHumanFemaleTemplate() {
    return {
      base: {
        head: { shape: 'oval', size: 'medium' },
        body: { shape: 'athletic', size: 'medium' },
        limbs: { proportion: 'standard' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'accessories', 'weapons']
    };
  }

  createElfMaleTemplate() {
    return {
      base: {
        head: { shape: 'oval', size: 'medium' },
        body: { shape: 'slender', size: 'medium' },
        limbs: { proportion: 'elongated' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'facial-hair', 'pointed-ears', 'accessories', 'weapons']
    };
  }

  createElfFemaleTemplate() {
    return {
      base: {
        head: { shape: 'oval', size: 'medium' },
        body: { shape: 'slender', size: 'medium' },
        limbs: { proportion: 'elongated' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'pointed-ears', 'accessories', 'weapons']
    };
  }

  createDwarfMaleTemplate() {
    return {
      base: {
        head: { shape: 'round', size: 'large' },
        body: { shape: 'stocky', size: 'medium' },
        limbs: { proportion: 'short' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'beard', 'facial-tattoos', 'accessories', 'weapons']
    };
  }

  createDwarfFemaleTemplate() {
    return {
      base: {
        head: { shape: 'round', size: 'large' },
        body: { shape: 'stocky', size: 'medium' },
        limbs: { proportion: 'short' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'beard', 'facial-tattoos', 'accessories', 'weapons']
    };
  }

  createHalflingMaleTemplate() {
    return {
      base: {
        head: { shape: 'round', size: 'small' },
        body: { shape: 'nimble', size: 'small' },
        limbs: { proportion: 'short' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'curly-hair', 'facial-hair', 'large-eyes', 'accessories', 'weapons']
    };
  }

  createHalflingFemaleTemplate() {
    return {
      base: {
        head: { shape: 'round', size: 'small' },
        body: { shape: 'nimble', size: 'small' },
        limbs: { proportion: 'short' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'curly-hair', 'large-eyes', 'accessories', 'weapons']
    };
  }

  createGnomeMaleTemplate() {
    return {
      base: {
        head: { shape: 'round', size: 'small' },
        body: { shape: 'nimble', size: 'small' },
        limbs: { proportion: 'short' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'facial-hair', 'large-ears', 'pointed-nose', 'accessories', 'weapons']
    };
  }

  createGnomeFemaleTemplate() {
    return {
      base: {
        head: { shape: 'round', size: 'small' },
        body: { shape: 'nimble', size: 'small' },
        limbs: { proportion: 'short' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'large-ears', 'pointed-nose', 'accessories', 'weapons']
    };
  }

  createHalfElfMaleTemplate() {
    return {
      base: {
        head: { shape: 'oval', size: 'medium' },
        body: { shape: 'athletic', size: 'medium' },
        limbs: { proportion: 'standard' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'facial-hair', 'slightly-pointed-ears', 'accessories', 'weapons']
    };
  }

  createHalfElfFemaleTemplate() {
    return {
      base: {
        head: { shape: 'oval', size: 'medium' },
        body: { shape: 'athletic', size: 'medium' },
        limbs: { proportion: 'standard' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'slightly-pointed-ears', 'accessories', 'weapons']
    };
  }

  createHalfOrcMaleTemplate() {
    return {
      base: {
        head: { shape: 'square', size: 'large' },
        body: { shape: 'muscular', size: 'large' },
        limbs: { proportion: 'standard' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'facial-hair', 'prominent-teeth', 'tribal-tattoos', 'accessories', 'weapons']
    };
  }

  createHalfOrcFemaleTemplate() {
    return {
      base: {
        head: { shape: 'square', size: 'large' },
        body: { shape: 'muscular', size: 'large' },
        limbs: { proportion: 'standard' }
      },
      layers: ['background', 'body', 'clothing', 'head', 'hair', 'prominent-teeth', 'tribal-tattoos', 'accessories', 'weapons']
    };
  }

  // Equipment SVG creation methods (simplified placeholders)
  createLongswordSVG() { return '<g><path d="M0,0 L0,40 L5,45 L5,5 Z" fill="#C0C0C0"/></g>'; }
  createShortswordSVG() { return '<g><path d="M0,0 L0,30 L4,34 L4,4 Z" fill="#C0C0C0"/></g>'; }
  createDaggerSVG() { return '<g><path d="M0,0 L0,20 L3,23 L3,3 Z" fill="#C0C0C0"/></g>'; }
  createBowSVG() { return '<g><path d="M0,0 Q10,20 0,40" stroke="#8B4513" fill="none"/><line x1="0" y1="10" x2="0" y2="30" stroke="#D2691E"/></g>'; }
  createStaffSVG() { return '<g><line x1="0" y1="0" x2="0" y2="50" stroke="#8B4513"/><circle cx="0" cy="5" r="3" fill="#654321"/><circle cx="0" cy="45" r="3" fill="#654321"/></g>'; }

  createLeatherArmorSVG() { return '<g><path d="M10,20 L30,20 L35,40 L5,40 Z" fill="#8B4513"/></g>'; }
  createChainmailSVG() { return '<g><rect x="5" y="15" width="30" height="30" fill="#708090"/></g>'; }
  createPlatemailSVG() { return '<g><rect x="5" y="15" width="30" height="30" fill="#C0C0C0"/><rect x="10" y="20" width="20" height="20" fill="#F5F5F5"/></g>'; }
  createRobeSVG() { return '<g><path d="M15,20 L25,20 L30,45 L10,45 Z" fill="#4B0082"/></g>'; }

  createBucklerSVG() { return '<g><circle cx="0" cy="0" r="8" fill="#8B4513"/><circle cx="0" cy="0" r="6" fill="#D2691E"/></g>'; }
  createHeaterShieldSVG() { return '<g><path d="M-8,-10 L8,-10 L10,10 L-10,10 Z" fill="#8B4513"/><path d="M-6,-8 L6,-8 L8,8 L-8,8 Z" fill="#D2691E"/></g>'; }
  createTowerShieldSVG() { return '<g><rect x="-12" y="-15" width="24" height="30" fill="#8B4513"/><rect x="-10" y="-13" width="20" height="26" fill="#654321"/></g>'; }

  // Public API methods
  getBaseTemplate(race, gender) {
    const key = `${race.toLowerCase()}-${gender.toLowerCase()}`;
    return this.templates.get(key);
  }

  getRacialCharacteristics(race) {
    return this.racialCharacteristics.get(race.toLowerCase()) || this.racialCharacteristics.get('human');
  }

  getEquipmentAsset(type, name) {
    const category = this.equipmentAssets.get(type);
    return category ? category[name] : null;
  }

  getCustomizationOptions(category) {
    return this.assets.get(category) || [];
  }
}

// Error Classes
class AssetLibraryLoadError extends Error {
  constructor(message) { super(message); this.name = 'AssetLibraryLoadError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AssetLibrary;
} else if (typeof window !== 'undefined') {
  window.AssetLibrary = AssetLibrary;
}