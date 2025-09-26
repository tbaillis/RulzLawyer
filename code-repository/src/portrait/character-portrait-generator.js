/**
 * CharacterPortraitGenerator - AI-Powered D&D Character Portrait System
 * 
 * Advanced character portrait generation system featuring:
 * - AI-powered portrait generation based on character attributes
 * - Multiple art styles (realistic, fantasy art, anime, pixel art)
 * - Dynamic visual updates based on level, equipment, and conditions
 * - Customizable appearance traits and racial features
 * - Equipment visualization and magical effect overlays
 * - Portrait export in multiple formats (PNG, SVG, PDF)
 * - Integration with character sheet rendering
 * 
 * @version 2.0.0
 * @author RulzLawyer Development Team
 */

class CharacterPortraitGenerator {
    constructor(characterSystem, inventorySystem) {
        this.characterSystem = characterSystem;
        this.inventorySystem = inventorySystem;
        
        // Portrait generation configuration
        this.config = {
            defaultStyle: 'fantasy_art',
            defaultSize: { width: 512, height: 512 },
            supportedFormats: ['png', 'jpg', 'svg', 'webp'],
            maxCacheSize: 100,
            aiProvider: 'stable_diffusion', // Could be DALL-E, Midjourney, etc.
            enableEquipmentVisualization: true,
            enableConditionEffects: true
        };
        
        // Available art styles
        this.artStyles = {
            'realistic': {
                name: 'Photorealistic',
                description: 'Lifelike, detailed portraits',
                promptModifiers: ['photorealistic', 'highly detailed', 'professional photography'],
                aspectRatio: '1:1'
            },
            'fantasy_art': {
                name: 'Fantasy Art',
                description: 'Traditional fantasy illustration style',
                promptModifiers: ['fantasy art', 'detailed illustration', 'epic fantasy'],
                aspectRatio: '3:4'
            },
            'anime': {
                name: 'Anime Style',
                description: 'Japanese animation inspired artwork',
                promptModifiers: ['anime style', 'manga artwork', 'cel shading'],
                aspectRatio: '3:4'
            },
            'oil_painting': {
                name: 'Oil Painting',
                description: 'Classical oil painting technique',
                promptModifiers: ['oil painting', 'renaissance style', 'masterpiece'],
                aspectRatio: '4:5'
            },
            'pixel_art': {
                name: 'Pixel Art',
                description: '16-bit retro gaming style',
                promptModifiers: ['pixel art', '16-bit style', 'retro gaming'],
                aspectRatio: '1:1'
            },
            'sketch': {
                name: 'Pencil Sketch',
                description: 'Hand-drawn pencil artwork',
                promptModifiers: ['pencil sketch', 'hand drawn', 'artistic sketch'],
                aspectRatio: '3:4'
            }
        };
        
        // Racial appearance traits
        this.racialTraits = {
            'Human': {
                skin_tones: ['pale', 'fair', 'olive', 'tan', 'brown', 'dark'],
                hair_colors: ['blonde', 'brown', 'black', 'red', 'auburn', 'gray', 'white'],
                eye_colors: ['blue', 'brown', 'green', 'hazel', 'gray', 'amber'],
                height_range: [5.0, 6.5],
                build_options: ['slim', 'average', 'muscular', 'stocky']
            },
            'Elf': {
                skin_tones: ['pale', 'fair', 'olive', 'golden'],
                hair_colors: ['blonde', 'silver', 'white', 'auburn', 'brown', 'black'],
                eye_colors: ['blue', 'green', 'violet', 'silver', 'gold'],
                height_range: [5.0, 6.0],
                build_options: ['slim', 'lithe', 'graceful'],
                special_features: ['pointed ears', 'elegant features', 'ethereal beauty']
            },
            'Dwarf': {
                skin_tones: ['fair', 'ruddy', 'tan', 'bronze'],
                hair_colors: ['brown', 'black', 'red', 'gray', 'white'],
                eye_colors: ['brown', 'blue', 'green', 'gray'],
                height_range: [3.5, 4.5],
                build_options: ['stocky', 'muscular', 'broad'],
                special_features: ['full beard', 'braided hair', 'robust build']
            },
            'Halfling': {
                skin_tones: ['fair', 'tan', 'ruddy'],
                hair_colors: ['brown', 'blonde', 'auburn', 'black'],
                eye_colors: ['brown', 'blue', 'green', 'hazel'],
                height_range: [2.5, 3.5],
                build_options: ['slim', 'plump', 'nimble'],
                special_features: ['curly hair', 'large feet', 'cheerful expression']
            },
            'Half-Elf': {
                skin_tones: ['pale', 'fair', 'olive', 'tan'],
                hair_colors: ['blonde', 'brown', 'black', 'auburn', 'silver'],
                eye_colors: ['blue', 'brown', 'green', 'hazel', 'violet'],
                height_range: [4.5, 6.0],
                build_options: ['slim', 'average', 'graceful'],
                special_features: ['slightly pointed ears', 'mixed heritage features']
            },
            'Half-Orc': {
                skin_tones: ['green-tinged', 'gray-green', 'tan', 'brown'],
                hair_colors: ['black', 'brown', 'dark brown'],
                eye_colors: ['red', 'brown', 'black', 'yellow'],
                height_range: [5.5, 7.0],
                build_options: ['muscular', 'powerful', 'imposing'],
                special_features: ['tusks', 'prominent jaw', 'intimidating presence']
            },
            'Gnome': {
                skin_tones: ['fair', 'tan', 'ruddy', 'bronze'],
                hair_colors: ['brown', 'blonde', 'white', 'gray', 'colorful'],
                eye_colors: ['blue', 'brown', 'green', 'violet'],
                height_range: [3.0, 3.5],
                build_options: ['slim', 'wiry', 'energetic'],
                special_features: ['large nose', 'bright eyes', 'animated expression']
            },
            'Tiefling': {
                skin_tones: ['red', 'crimson', 'dark red', 'bronze', 'purple'],
                hair_colors: ['black', 'dark red', 'purple', 'silver'],
                eye_colors: ['red', 'silver', 'gold', 'black'],
                height_range: [5.0, 6.5],
                build_options: ['slim', 'average', 'imposing'],
                special_features: ['horns', 'tail', 'demonic features', 'glowing eyes']
            }
        };
        
        // Class-specific visual elements
        this.classVisualTraits = {
            'Barbarian': {
                clothing: ['fur clothing', 'tribal armor', 'savage attire'],
                weapons: ['greataxe', 'two-handed sword', 'war hammer'],
                accessories: ['tribal tattoos', 'bone jewelry', 'war paint'],
                pose: 'fierce and wild'
            },
            'Bard': {
                clothing: ['colorful clothing', 'fine garments', 'performer attire'],
                weapons: ['rapier', 'longbow', 'musical instrument'],
                accessories: ['musical instrument', 'decorative hat', 'elegant jewelry'],
                pose: 'charismatic and artistic'
            },
            'Cleric': {
                clothing: ['holy robes', 'plate armor', 'religious vestments'],
                weapons: ['mace', 'war hammer', 'holy symbol'],
                accessories: ['holy symbol', 'prayer beads', 'divine aura'],
                pose: 'divine and authoritative'
            },
            'Druid': {
                clothing: ['natural robes', 'leather armor', 'earth tones'],
                weapons: ['staff', 'scimitar', 'sling'],
                accessories: ['nature symbols', 'animal companion', 'plant motifs'],
                pose: 'natural and wise'
            },
            'Fighter': {
                clothing: ['plate armor', 'chain mail', 'military uniform'],
                weapons: ['sword and shield', 'two-handed weapon', 'crossbow'],
                accessories: ['military insignia', 'weapon harness', 'battle scars'],
                pose: 'martial and disciplined'
            },
            'Monk': {
                clothing: ['simple robes', 'martial arts gi', 'eastern clothing'],
                weapons: ['unarmed', 'staff', 'nunchaku'],
                accessories: ['meditation beads', 'martial arts belt', 'serene expression'],
                pose: 'balanced and centered'
            },
            'Paladin': {
                clothing: ['shining armor', 'holy plate mail', 'divine symbols'],
                weapons: ['holy sword', 'blessed weapon', 'shield with symbol'],
                accessories: ['holy symbol', 'divine aura', 'righteous bearing'],
                pose: 'noble and righteous'
            },
            'Ranger': {
                clothing: ['forest clothing', 'leather armor', 'camouflage'],
                weapons: ['longbow', 'dual weapons', 'hunting knife'],
                accessories: ['quiver', 'survival gear', 'animal companion'],
                pose: 'alert and woodsy'
            },
            'Rogue': {
                clothing: ['dark clothing', 'leather armor', 'hooded cloak'],
                weapons: ['daggers', 'short sword', 'crossbow'],
                accessories: ['lockpicks', 'throwing knives', 'mysterious demeanor'],
                pose: 'stealthy and cunning'
            },
            'Sorcerer': {
                clothing: ['robes', 'simple clothing', 'arcane symbols'],
                weapons: ['staff', 'dagger', 'arcane focus'],
                accessories: ['magical aura', 'spell components', 'innate power'],
                pose: 'magically charged'
            },
            'Wizard': {
                clothing: ['wizard robes', 'scholarly attire', 'pointed hat'],
                weapons: ['quarterstaff', 'dagger', 'spellbook'],
                accessories: ['spellbook', 'spell components', 'arcane symbols'],
                pose: 'scholarly and wise'
            }
        };
        
        // Portrait cache
        this.portraitCache = new Map();
        this.generationQueue = [];
        this.isGenerating = false;
        
        console.log('🎨 Character Portrait Generator initialized');
    }

    /**
     * Generate character portrait based on character data
     */
    async generatePortrait(character, options = {}) {
        console.log(`🎨 Generating portrait for ${character.name}`);
        
        const portraitOptions = {
            style: options.style || this.config.defaultStyle,
            size: options.size || this.config.defaultSize,
            format: options.format || 'png',
            includeEquipment: options.includeEquipment !== false,
            includeConditions: options.includeConditions !== false,
            customization: options.customization || {}
        };
        
        // Check cache first
        const cacheKey = this.generateCacheKey(character, portraitOptions);
        if (this.portraitCache.has(cacheKey) && !options.forceRegenerate) {
            console.log('📸 Using cached portrait');
            return this.portraitCache.get(cacheKey);
        }
        
        try {
            // Generate prompt based on character
            const prompt = this.generateCharacterPrompt(character, portraitOptions);
            
            // Generate portrait using AI
            const portraitData = await this.generateAIPortrait(prompt, portraitOptions);
            
            // Post-process portrait
            const processedPortrait = await this.postProcessPortrait(portraitData, character, portraitOptions);
            
            // Cache result
            this.cachePortrait(cacheKey, processedPortrait);
            
            console.log(`✅ Portrait generated for ${character.name}`);
            
            return processedPortrait;
            
        } catch (error) {
            console.error(`❌ Failed to generate portrait for ${character.name}:`, error);
            return this.generateFallbackPortrait(character, portraitOptions);
        }
    }

    /**
     * Generate AI prompt based on character attributes
     */
    generateCharacterPrompt(character, options) {
        const promptParts = [];
        
        // Base character description
        const race = character.race || 'Human';
        const gender = character.gender || 'neutral';
        const primaryClass = this.getPrimaryClass(character);
        
        // Racial traits
        const racialData = this.racialTraits[race] || this.racialTraits['Human'];
        const appearance = character.appearance || this.generateRandomAppearance(racialData);
        
        // Base description
        promptParts.push(
            `A ${gender} ${race.toLowerCase()} ${primaryClass.toLowerCase()}`,
            `with ${appearance.skin_tone} skin`,
            `${appearance.hair_color} hair`,
            `and ${appearance.eye_color} eyes`
        );
        
        // Racial features
        if (racialData.special_features) {
            promptParts.push(...racialData.special_features);
        }
        
        // Class-specific elements
        const classTraits = this.classVisualTraits[primaryClass];
        if (classTraits) {
            if (classTraits.clothing.length > 0) {
                promptParts.push(`wearing ${this.randomChoice(classTraits.clothing)}`);
            }
            
            if (options.includeEquipment && classTraits.weapons.length > 0) {
                promptParts.push(`wielding ${this.randomChoice(classTraits.weapons)}`);
            }
            
            if (classTraits.accessories.length > 0) {
                promptParts.push(`with ${this.randomChoice(classTraits.accessories)}`);
            }
            
            if (classTraits.pose) {
                promptParts.push(`${classTraits.pose} pose`);
            }
        }
        
        // Equipment visualization
        if (options.includeEquipment && character.equipment) {
            const equipmentDescriptions = this.generateEquipmentDescriptions(character.equipment);
            promptParts.push(...equipmentDescriptions);
        }
        
        // Level-based modifications
        if (character.level >= 10) {
            promptParts.push('experienced and battle-hardened');
        }
        if (character.level >= 20) {
            promptParts.push('legendary and heroic');
        }
        if (character.level >= 30) {
            promptParts.push('epic and godlike');
        }
        
        // Condition effects
        if (options.includeConditions && character.conditions) {
            const conditionEffects = this.generateConditionEffects(character.conditions);
            promptParts.push(...conditionEffects);
        }
        
        // Art style modifiers
        const styleData = this.artStyles[options.style];
        if (styleData && styleData.promptModifiers) {
            promptParts.push(...styleData.promptModifiers);
        }
        
        // Quality modifiers
        promptParts.push(
            'high quality',
            'detailed',
            'professional artwork',
            'fantasy RPG character'
        );
        
        return promptParts.join(', ');
    }

    /**
     * Generate portrait using AI service
     */
    async generateAIPortrait(prompt, options) {
        // In a real implementation, this would call an AI service like:
        // - OpenAI DALL-E
        // - Stability AI (Stable Diffusion)
        // - Midjourney API
        // - Local AI model
        
        console.log(`🤖 AI Prompt: ${prompt}`);
        
        // Simulated AI generation
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    imageData: this.generateSimulatedPortrait(options),
                    prompt: prompt,
                    model: this.config.aiProvider,
                    generatedAt: Date.now(),
                    metadata: {
                        style: options.style,
                        size: options.size,
                        format: options.format
                    }
                });
            }, 2000); // Simulate AI generation time
        });
    }

    /**
     * Simulate portrait generation for demo purposes
     */
    generateSimulatedPortrait(options) {
        // Generate a simple SVG placeholder portrait
        const { width, height } = options.size;
        const style = options.style;
        
        const colors = this.getStyleColors(style);
        
        const svg = `
            <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
                <!-- Background -->
                <rect width="100%" height="100%" fill="${colors.background}"/>
                
                <!-- Head -->
                <ellipse cx="${width/2}" cy="${height*0.35}" 
                         rx="${width*0.15}" ry="${height*0.2}" 
                         fill="${colors.skin}" stroke="${colors.outline}" stroke-width="2"/>
                
                <!-- Eyes -->
                <circle cx="${width*0.45}" cy="${height*0.3}" r="${width*0.02}" fill="${colors.eyes}"/>
                <circle cx="${width*0.55}" cy="${height*0.3}" r="${width*0.02}" fill="${colors.eyes}"/>
                
                <!-- Body -->
                <rect x="${width*0.4}" y="${height*0.5}" 
                      width="${width*0.2}" height="${height*0.4}" 
                      fill="${colors.clothing}" stroke="${colors.outline}" stroke-width="2"/>
                
                <!-- Style indicator -->
                <text x="${width/2}" y="${height*0.95}" 
                      text-anchor="middle" font-family="Arial, sans-serif" 
                      font-size="12" fill="${colors.text}">
                    ${style.replace('_', ' ').toUpperCase()}
                </text>
            </svg>
        `;
        
        return {
            type: 'svg',
            data: svg,
            width: width,
            height: height
        };
    }

    /**
     * Get color scheme for art style
     */
    getStyleColors(style) {
        const colorSchemes = {
            'realistic': {
                background: '#f5f5f5',
                skin: '#fdbcb4',
                eyes: '#4a4a4a',
                clothing: '#2c3e50',
                outline: '#2c3e50',
                text: '#2c3e50'
            },
            'fantasy_art': {
                background: '#1a1a2e',
                skin: '#f4c2a1',
                eyes: '#3498db',
                clothing: '#8b0000',
                outline: '#ffd700',
                text: '#ffd700'
            },
            'anime': {
                background: '#ffb3d9',
                skin: '#ffccb3',
                eyes: '#ff1493',
                clothing: '#4169e1',
                outline: '#000000',
                text: '#000000'
            },
            'oil_painting': {
                background: '#8b4513',
                skin: '#deb887',
                eyes: '#654321',
                clothing: '#800000',
                outline: '#654321',
                text: '#654321'
            },
            'pixel_art': {
                background: '#000080',
                skin: '#ffdbac',
                eyes: '#ffffff',
                clothing: '#ff0000',
                outline: '#000000',
                text: '#ffffff'
            },
            'sketch': {
                background: '#ffffff',
                skin: '#f0f0f0',
                eyes: '#808080',
                clothing: '#d3d3d3',
                outline: '#000000',
                text: '#000000'
            }
        };
        
        return colorSchemes[style] || colorSchemes['fantasy_art'];
    }

    /**
     * Post-process generated portrait
     */
    async postProcessPortrait(portraitData, character, options) {
        const portrait = {
            id: this.generatePortraitId(character),
            characterId: character.id,
            characterName: character.name,
            imageData: portraitData.imageData,
            style: options.style,
            size: options.size,
            format: options.format,
            prompt: portraitData.prompt,
            generatedAt: portraitData.generatedAt,
            metadata: {
                ...portraitData.metadata,
                level: character.level,
                race: character.race,
                class: this.getPrimaryClass(character),
                version: '2.0.0'
            }
        };
        
        // Add equipment overlays if requested
        if (options.includeEquipment && character.equipment) {
            portrait.equipmentOverlays = this.generateEquipmentOverlays(character.equipment);
        }
        
        // Add condition effects if requested
        if (options.includeConditions && character.conditions) {
            portrait.conditionEffects = this.generateConditionVisualEffects(character.conditions);
        }
        
        return portrait;
    }

    /**
     * Generate equipment descriptions for prompt
     */
    generateEquipmentDescriptions(equipment) {
        const descriptions = [];
        
        if (equipment.armor) {
            descriptions.push(`wearing ${equipment.armor.name.toLowerCase()}`);
        }
        
        if (equipment.weapon) {
            descriptions.push(`wielding ${equipment.weapon.name.toLowerCase()}`);
        }
        
        if (equipment.shield) {
            descriptions.push(`carrying ${equipment.shield.name.toLowerCase()}`);
        }
        
        // Magical items get special treatment
        Object.values(equipment).forEach(item => {
            if (item && item.magical && item.visualEffect) {
                descriptions.push(item.visualEffect);
            }
        });
        
        return descriptions;
    }

    /**
     * Generate condition visual effects
     */
    generateConditionEffects(conditions) {
        const effects = [];
        
        conditions.forEach(condition => {
            switch (condition.name) {
                case 'poisoned':
                    effects.push('sickly green tint');
                    break;
                case 'charmed':
                    effects.push('glazed expression');
                    break;
                case 'frightened':
                    effects.push('fearful expression');
                    break;
                case 'invisible':
                    effects.push('translucent and ghostly');
                    break;
                case 'blessed':
                    effects.push('divine golden aura');
                    break;
                case 'cursed':
                    effects.push('dark shadowy aura');
                    break;
            }
        });
        
        return effects;
    }

    /**
     * Update portrait for character changes
     */
    async updatePortraitForChanges(character, changes, options = {}) {
        console.log(`🔄 Updating portrait for ${character.name} (changes: ${changes.join(', ')})`);
        
        // Determine if regeneration is needed
        const needsRegeneration = this.requiresRegeneration(changes);
        
        if (needsRegeneration) {
            return this.generatePortrait(character, { ...options, forceRegenerate: true });
        } else {
            // Apply minor updates to existing portrait
            return this.applyPortraitUpdates(character, changes, options);
        }
    }

    /**
     * Export portrait in various formats
     */
    async exportPortrait(portrait, format, options = {}) {
        console.log(`📤 Exporting portrait in ${format} format`);
        
        const exportOptions = {
            quality: options.quality || 0.9,
            backgroundColor: options.backgroundColor || 'transparent',
            ...options
        };
        
        switch (format.toLowerCase()) {
            case 'png':
                return this.exportToPNG(portrait, exportOptions);
            case 'jpg':
            case 'jpeg':
                return this.exportToJPEG(portrait, exportOptions);
            case 'svg':
                return this.exportToSVG(portrait, exportOptions);
            case 'pdf':
                return this.exportToPDF(portrait, exportOptions);
            case 'webp':
                return this.exportToWebP(portrait, exportOptions);
            default:
                throw new Error(`Unsupported export format: ${format}`);
        }
    }

    /**
     * Get available art styles
     */
    getAvailableStyles() {
        return Object.entries(this.artStyles).map(([key, style]) => ({
            id: key,
            name: style.name,
            description: style.description,
            aspectRatio: style.aspectRatio
        }));
    }

    /**
     * Get portrait generation status
     */
    getGenerationStatus() {
        return {
            isGenerating: this.isGenerating,
            queueLength: this.generationQueue.length,
            cacheSize: this.portraitCache.size,
            maxCacheSize: this.config.maxCacheSize
        };
    }

    // ===== UTILITY METHODS =====

    getPrimaryClass(character) {
        if (!character.classes || character.classes.length === 0) {
            return 'Fighter';
        }
        
        // Return class with highest level
        return character.classes.reduce((primary, current) => 
            current.level > primary.level ? current : primary
        ).name;
    }

    generateRandomAppearance(racialData) {
        return {
            skin_tone: this.randomChoice(racialData.skin_tones),
            hair_color: this.randomChoice(racialData.hair_colors),
            eye_color: this.randomChoice(racialData.eye_colors),
            build: this.randomChoice(racialData.build_options),
            height: this.randomInRange(racialData.height_range[0], racialData.height_range[1])
        };
    }

    randomChoice(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    randomInRange(min, max) {
        return min + Math.random() * (max - min);
    }

    generateCacheKey(character, options) {
        const keyData = {
            characterId: character.id,
            level: character.level,
            race: character.race,
            class: this.getPrimaryClass(character),
            style: options.style,
            size: `${options.size.width}x${options.size.height}`,
            equipment: character.equipment ? Object.keys(character.equipment).sort().join(',') : '',
            conditions: character.conditions ? character.conditions.map(c => c.name).sort().join(',') : ''
        };
        
        return btoa(JSON.stringify(keyData)).replace(/[^a-zA-Z0-9]/g, '');
    }

    generatePortraitId(character) {
        return `portrait_${character.id}_${Date.now()}`;
    }

    cachePortrait(key, portrait) {
        // Implement LRU cache
        if (this.portraitCache.size >= this.config.maxCacheSize) {
            const firstKey = this.portraitCache.keys().next().value;
            this.portraitCache.delete(firstKey);
        }
        
        this.portraitCache.set(key, portrait);
    }

    requiresRegeneration(changes) {
        const majorChanges = ['race', 'class', 'level_up', 'equipment_change'];
        return changes.some(change => majorChanges.includes(change));
    }

    generateFallbackPortrait(character, options) {
        return {
            id: this.generatePortraitId(character),
            characterId: character.id,
            characterName: character.name,
            imageData: this.generateSimulatedPortrait(options),
            style: options.style,
            size: options.size,
            format: options.format,
            isFallback: true,
            generatedAt: Date.now()
        };
    }
}

// Export for both browser and Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterPortraitGenerator;
} else if (typeof window !== 'undefined') {
    window.CharacterPortraitGenerator = CharacterPortraitGenerator;
}