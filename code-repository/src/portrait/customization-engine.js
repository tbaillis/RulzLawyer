// code-repository/src/portrait/customization-engine.js
class CustomizationEngine {
  constructor(assetLibrary) {
    this.assetLibrary = assetLibrary;
    this.customizations = new Map();
    this.activeCustomizations = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    // Load customization presets
    await this.loadCustomizationPresets();

    this.initialized = true;
    console.log('✅ CustomizationEngine initialized successfully');
  }

  async loadCustomizationPresets() {
    // Hair customization options
    this.customizations.set('hair', {
      styles: ['short', 'medium', 'long', 'braided', 'ponytail', 'bun', 'bald'],
      colors: [
        '#8B4513', '#654321', '#2F1B14', '#000000', // browns/blacks
        '#FFD700', '#FFA500', '#FF6347', '#DC143C', '#8B0000', // reds/golds
        '#FFFFFF', '#F5F5F5', '#E6E6FA' // whites/grays
      ],
      lengths: ['very-short', 'short', 'medium', 'long', 'very-long']
    });

    // Eye customization options
    this.customizations.set('eyes', {
      colors: [
        '#4169E1', '#228B22', '#8B4513', '#2E2E2E', // natural
        '#98FB98', '#00CED1', '#9370DB', '#FF69B4', '#FF6347' // fantasy
      ],
      shapes: ['round', 'almond', 'hooded', 'wide'],
      sizes: ['small', 'normal', 'large']
    });

    // Skin customization options
    this.customizations.set('skin', {
      tones: [
        '#F5DEB3', '#DEB887', '#D2B48C', '#BC986A', '#8B7355', // light
        '#CD853F', '#D2691E', '#A0522D', '#8B4513', '#654321', // medium
        '#556B2F', '#228B22', '#006400', '#2F1B14', '#000000' // dark
      ],
      conditions: ['normal', 'scarred', 'tattooed', 'pale', 'weathered']
    });

    // Accessory customization options
    this.customizations.set('accessories', {
      jewelry: ['earrings', 'necklace', 'bracelets', 'rings', 'circlet'],
      headwear: ['cape', 'hood', 'hat', 'helmet', 'headband'],
      facial: ['piercings', 'scars', 'tattoos', 'makeup']
    });

    // Body modification options
    this.customizations.set('body-mods', {
      tattoos: ['tribal', 'geometric', 'nature', 'runes', 'custom'],
      scars: ['battle-scars', 'ritual-scars', 'accidental', 'deliberate'],
      piercings: ['ears', 'nose', 'eyebrows', 'lips', 'other']
    });
  }

  async applyCustomization(portrait, customization) {
    if (!this.initialized) await this.initialize();

    const { category, type, value, options = {} } = customization;

    try {
      switch (category) {
        case 'hair':
          return await this.applyHairCustomization(portrait, type, value, options);
        case 'eyes':
          return await this.applyEyeCustomization(portrait, type, value, options);
        case 'skin':
          return await this.applySkinCustomization(portrait, type, value, options);
        case 'accessories':
          return await this.applyAccessoryCustomization(portrait, type, value, options);
        case 'body-mods':
          return await this.applyBodyModCustomization(portrait, type, value, options);
        default:
          console.warn(`Unknown customization category: ${category}`);
          return portrait;
      }
    } catch (error) {
      console.error(`❌ Customization application failed for ${category}:${type}:`, error);
      throw new CustomizationError(error.message);
    }
  }

  async applyHairCustomization(portrait, type, value, options) {
    const hairOptions = this.customizations.get('hair');

    switch (type) {
      case 'style':
        if (!hairOptions.styles.includes(value)) {
          throw new Error(`Invalid hair style: ${value}`);
        }
        return await this.applyHairStyle(portrait, value, options);

      case 'color':
        if (!hairOptions.colors.includes(value)) {
          throw new Error(`Invalid hair color: ${value}`);
        }
        return await this.applyHairColor(portrait, value, options);

      case 'length':
        if (!hairOptions.lengths.includes(value)) {
          throw new Error(`Invalid hair length: ${value}`);
        }
        return await this.applyHairLength(portrait, value, options);

      default:
        throw new Error(`Unknown hair customization type: ${type}`);
    }
  }

  async applyEyeCustomization(portrait, type, value, options) {
    const eyeOptions = this.customizations.get('eyes');

    switch (type) {
      case 'color':
        if (!eyeOptions.colors.includes(value)) {
          throw new Error(`Invalid eye color: ${value}`);
        }
        return await this.applyEyeColor(portrait, value, options);

      case 'shape':
        if (!eyeOptions.shapes.includes(value)) {
          throw new Error(`Invalid eye shape: ${value}`);
        }
        return await this.applyEyeShape(portrait, value, options);

      case 'size':
        if (!eyeOptions.sizes.includes(value)) {
          throw new Error(`Invalid eye size: ${value}`);
        }
        return await this.applyEyeSize(portrait, value, options);

      default:
        throw new Error(`Unknown eye customization type: ${type}`);
    }
  }

  async applySkinCustomization(portrait, type, value, options) {
    const skinOptions = this.customizations.get('skin');

    switch (type) {
      case 'tone':
        if (!skinOptions.tones.includes(value)) {
          throw new Error(`Invalid skin tone: ${value}`);
        }
        return await this.applySkinTone(portrait, value, options);

      case 'condition':
        if (!skinOptions.conditions.includes(value)) {
          throw new Error(`Invalid skin condition: ${value}`);
        }
        return await this.applySkinCondition(portrait, value, options);

      default:
        throw new Error(`Unknown skin customization type: ${type}`);
    }
  }

  async applyAccessoryCustomization(portrait, type, value, options) {
    const accessoryOptions = this.customizations.get('accessories');

    switch (type) {
      case 'jewelry':
        if (!accessoryOptions.jewelry.includes(value)) {
          throw new Error(`Invalid jewelry type: ${value}`);
        }
        return await this.applyJewelry(portrait, value, options);

      case 'headwear':
        if (!accessoryOptions.headwear.includes(value)) {
          throw new Error(`Invalid headwear type: ${value}`);
        }
        return await this.applyHeadwear(portrait, value, options);

      case 'facial':
        if (!accessoryOptions.facial.includes(value)) {
          throw new Error(`Invalid facial accessory: ${value}`);
        }
        return await this.applyFacialAccessory(portrait, value, options);

      default:
        throw new Error(`Unknown accessory customization type: ${type}`);
    }
  }

  async applyBodyModCustomization(portrait, type, value, options) {
    const bodyModOptions = this.customizations.get('body-mods');

    switch (type) {
      case 'tattoos':
        if (!bodyModOptions.tattoos.includes(value)) {
          throw new Error(`Invalid tattoo type: ${value}`);
        }
        return await this.applyTattoo(portrait, value, options);

      case 'scars':
        if (!bodyModOptions.scars.includes(value)) {
          throw new Error(`Invalid scar type: ${value}`);
        }
        return await this.applyScar(portrait, value, options);

      case 'piercings':
        if (!bodyModOptions.piercings.includes(value)) {
          throw new Error(`Invalid piercing type: ${value}`);
        }
        return await this.applyPiercing(portrait, value, options);

      default:
        throw new Error(`Unknown body modification type: ${type}`);
    }
  }

  // Implementation methods (simplified placeholders)
  async applyHairStyle(portrait, style, options) {
    console.log(`Applying hair style: ${style}`);
    // In a real implementation, this would modify the portrait's hair layer
    return portrait;
  }

  async applyHairColor(portrait, color, options) {
    console.log(`Applying hair color: ${color}`);
    return portrait;
  }

  async applyHairLength(portrait, length, options) {
    console.log(`Applying hair length: ${length}`);
    return portrait;
  }

  async applyEyeColor(portrait, color, options) {
    console.log(`Applying eye color: ${color}`);
    return portrait;
  }

  async applyEyeShape(portrait, shape, options) {
    console.log(`Applying eye shape: ${shape}`);
    return portrait;
  }

  async applyEyeSize(portrait, size, options) {
    console.log(`Applying eye size: ${size}`);
    return portrait;
  }

  async applySkinTone(portrait, tone, options) {
    console.log(`Applying skin tone: ${tone}`);
    return portrait;
  }

  async applySkinCondition(portrait, condition, options) {
    console.log(`Applying skin condition: ${condition}`);
    return portrait;
  }

  async applyJewelry(portrait, jewelry, options) {
    console.log(`Applying jewelry: ${jewelry}`);
    return portrait;
  }

  async applyHeadwear(portrait, headwear, options) {
    console.log(`Applying headwear: ${headwear}`);
    return portrait;
  }

  async applyFacialAccessory(portrait, accessory, options) {
    console.log(`Applying facial accessory: ${accessory}`);
    return portrait;
  }

  async applyTattoo(portrait, tattoo, options) {
    console.log(`Applying tattoo: ${tattoo}`);
    return portrait;
  }

  async applyScar(portrait, scar, options) {
    console.log(`Applying scar: ${scar}`);
    return portrait;
  }

  async applyPiercing(portrait, piercing, options) {
    console.log(`Applying piercing: ${piercing}`);
    return portrait;
  }

  // Preset management
  async saveCustomizationPreset(name, customizations) {
    this.activeCustomizations.set(name, {
      customizations: customizations,
      created: new Date(),
      version: 1
    });
    console.log(`✅ Customization preset saved: ${name}`);
  }

  async loadCustomizationPreset(name) {
    const preset = this.activeCustomizations.get(name);
    if (!preset) {
      throw new Error(`Customization preset not found: ${name}`);
    }
    return preset.customizations;
  }

  async applyCustomizationPreset(portrait, presetName) {
    const customizations = await this.loadCustomizationPreset(presetName);

    for (const customization of customizations) {
      portrait = await this.applyCustomization(portrait, customization);
    }

    return portrait;
  }

  getAvailableCustomizations(category) {
    return this.customizations.get(category) || {};
  }

  getActiveCustomizations() {
    return Array.from(this.activeCustomizations.keys());
  }

  async resetCustomizations(portrait) {
    // Reset portrait to base state
    console.log('Resetting all customizations');
    return portrait;
  }
}

// Error Classes
class CustomizationError extends Error {
  constructor(message) { super(message); this.name = 'CustomizationError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CustomizationEngine;
} else if (typeof window !== 'undefined') {
  window.CustomizationEngine = CustomizationEngine;
}