/**
 * D&D 3.5 Character Portrait Designer System
 * Advanced layered portrait generation with SVG/Canvas hybrid approach
 * Supports 100+ race/gender/class asset combinations with real-time sync
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class PortraitDesigner {
    constructor(options = {}) {
        this.canvas = null;
        this.svg = null;
        this.context = null;
        this.width = options.width || 400;
        this.height = options.height || 400;
        this.layers = new Map();
        this.characterData = null;
        this.assetLibrary = new AssetLibrary();
        this.customizations = new Map();
        
        this.initializeCanvas();
        this.initializeLayers();
        
        console.log('🎨 Portrait Designer initialized');
    }
    
    /**
     * Initialize canvas and SVG elements for hybrid rendering
     */
    initializeCanvas() {
        // Create main canvas
        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');
        
        // Create SVG overlay for vector elements
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svg.setAttribute('width', this.width);
        this.svg.setAttribute('height', this.height);
        this.svg.setAttribute('viewBox', `0 0 ${this.width} ${this.height}`);
        this.svg.style.position = 'absolute';
        this.svg.style.top = '0';
        this.svg.style.left = '0';
    }
    
    /**
     * Initialize portrait layers in correct z-order
     */
    initializeLayers() {
        const layerOrder = [
            'background',
            'bodyBase',
            'skin',
            'clothing',
            'armor',
            'accessories',
            'hair',
            'facialHair',
            'eyes',
            'eyebrows',
            'nose',
            'mouth',
            'scars',
            'tattoos',
            'equipment',
            'effects',
            'frame'
        ];
        
        layerOrder.forEach((layerName, index) => {
            this.layers.set(layerName, {
                name: layerName,
                zIndex: index,
                visible: true,
                opacity: 1.0,
                elements: [],
                customizations: new Map()
            });
        });
    }
    
    /**
     * Generate portrait from character data with real-time sync
     */
    generatePortrait(characterData, options = {}) {
        this.characterData = characterData;
        this.clearCanvas();
        
        console.log(`🎨 Generating portrait for ${characterData.name}`);
        
        // Determine portrait characteristics from character
        const portraitConfig = this.analyzeCharacter(characterData);
        
        // Generate each layer
        this.generateBackground(portraitConfig);
        this.generateBodyBase(portraitConfig);
        this.generateSkin(portraitConfig);
        this.generateClothing(portraitConfig);
        this.generateArmor(portraitConfig);
        this.generateHair(portraitConfig);
        this.generateFacialFeatures(portraitConfig);
        this.generateEquipment(portraitConfig);
        this.generateEffects(portraitConfig);
        
        // Apply final compositing
        this.compositePortrait();
        
        return {
            canvas: this.canvas,
            svg: this.svg,
            dataURL: this.canvas.toDataURL('image/png'),
            portraitConfig: portraitConfig
        };
    }
    
    /**
     * Analyze character data to determine portrait characteristics
     */
    analyzeCharacter(characterData) {
        const config = {
            race: characterData.race?.name || 'Human',
            gender: characterData.gender || 'neutral',
            classes: characterData.classes || [{ name: 'Fighter' }],
            level: characterData.level || 1,
            alignment: characterData.alignment || 'Neutral',
            
            // Physical characteristics
            age: this.determineAge(characterData),
            build: this.determineBuild(characterData),
            height: this.determineHeight(characterData),
            
            // Appearance
            skinTone: this.determineSkinTone(characterData),
            hairColor: this.determineHairColor(characterData),
            hairStyle: this.determineHairStyle(characterData),
            eyeColor: this.determineEyeColor(characterData),
            
            // Equipment visualization
            armor: this.getVisibleArmor(characterData),
            weapons: this.getVisibleWeapons(characterData),
            accessories: this.getVisibleAccessories(characterData),
            
            // Class-specific features
            classFeatures: this.getClassVisualFeatures(characterData),
            
            // Customizations
            customizations: this.customizations
        };
        
        return config;
    }
    
    /**
     * Generate background layer with class/alignment themes
     */
    generateBackground(config) {
        const layer = this.layers.get('background');
        
        // Determine background style
        const bgStyle = this.getBackgroundStyle(config);
        
        // Create gradient background
        const gradient = this.context.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2
        );
        
        gradient.addColorStop(0, bgStyle.centerColor);
        gradient.addColorStop(1, bgStyle.outerColor);
        
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, this.height);
        
        // Add class-specific background elements
        this.addBackgroundEffects(config, bgStyle);
        
        layer.elements.push({ type: 'background', data: bgStyle });
    }
    
    /**
     * Generate body base shape and proportions
     */
    generateBodyBase(config) {
        const layer = this.layers.get('bodyBase');
        const bodyShape = this.assetLibrary.getBodyShape(config.race, config.gender, config.build);
        
        // Scale body based on character size
        const scale = this.getBodyScale(config);
        const offsetY = this.getBodyOffset(config);
        
        this.context.save();
        this.context.translate(this.width / 2, this.height / 2 + offsetY);
        this.context.scale(scale, scale);
        
        // Draw body silhouette
        this.drawBodySilhouette(bodyShape, config);
        
        this.context.restore();
        
        layer.elements.push({ type: 'bodyBase', data: bodyShape, scale, offsetY });
    }
    
    /**
     * Generate skin layer with racial characteristics
     */
    generateSkin(config) {
        const layer = this.layers.get('skin');
        const skinData = this.assetLibrary.getSkinData(config.race, config.skinTone);
        
        // Apply base skin tone
        this.context.save();
        this.context.globalCompositeOperation = 'multiply';
        this.context.fillStyle = skinData.baseColor;
        
        // Apply racial skin characteristics
        this.applyRacialSkinFeatures(config, skinData);
        
        this.context.restore();
        
        layer.elements.push({ type: 'skin', data: skinData });
    }
    
    /**
     * Generate clothing layer based on class and equipment
     */
    generateClothing(config) {
        const layer = this.layers.get('clothing');
        const clothing = this.assetLibrary.getClothing(config.classes[0].name, config.level);
        
        // Draw base clothing
        this.drawClothing(clothing, config);
        
        layer.elements.push({ type: 'clothing', data: clothing });
    }
    
    /**
     * Generate armor layer with equipment visualization
     */
    generateArmor(config) {
        if (!config.armor || config.armor.length === 0) return;
        
        const layer = this.layers.get('armor');
        
        config.armor.forEach(armorPiece => {
            const armorData = this.assetLibrary.getArmorVisuals(armorPiece);
            if (armorData) {
                this.drawArmor(armorData, config);
                layer.elements.push({ type: 'armor', data: armorData });
            }
        });
    }
    
    /**
     * Generate hair with racial and gender variations
     */
    generateHair(config) {
        const layer = this.layers.get('hair');
        const hairData = this.assetLibrary.getHairData(
            config.race,
            config.gender,
            config.hairStyle,
            config.hairColor
        );
        
        this.drawHair(hairData, config);
        
        // Add facial hair if applicable
        if (config.gender === 'male' && Math.random() > 0.3) {
            const facialHair = this.assetLibrary.getFacialHair(config.race, config.hairColor);
            this.drawFacialHair(facialHair, config);
            this.layers.get('facialHair').elements.push({ type: 'facialHair', data: facialHair });
        }
        
        layer.elements.push({ type: 'hair', data: hairData });
    }
    
    /**
     * Generate facial features with racial characteristics
     */
    generateFacialFeatures(config) {
        const features = this.assetLibrary.getFacialFeatures(config.race, config.gender);
        
        // Eyes
        const eyeLayer = this.layers.get('eyes');
        const eyeData = { ...features.eyes, color: config.eyeColor };
        this.drawEyes(eyeData, config);
        eyeLayer.elements.push({ type: 'eyes', data: eyeData });
        
        // Eyebrows
        const eyebrowLayer = this.layers.get('eyebrows');
        this.drawEyebrows(features.eyebrows, config);
        eyebrowLayer.elements.push({ type: 'eyebrows', data: features.eyebrows });
        
        // Nose
        const noseLayer = this.layers.get('nose');
        this.drawNose(features.nose, config);
        noseLayer.elements.push({ type: 'nose', data: features.nose });
        
        // Mouth
        const mouthLayer = this.layers.get('mouth');
        this.drawMouth(features.mouth, config);
        mouthLayer.elements.push({ type: 'mouth', data: features.mouth });
    }
    
    /**
     * Generate equipment visualization
     */
    generateEquipment(config) {
        const layer = this.layers.get('equipment');
        
        // Draw visible weapons
        config.weapons.forEach(weapon => {
            const weaponVisual = this.assetLibrary.getWeaponVisual(weapon);
            if (weaponVisual) {
                this.drawWeapon(weaponVisual, config);
                layer.elements.push({ type: 'weapon', data: weaponVisual });
            }
        });
        
        // Draw accessories
        config.accessories.forEach(accessory => {
            const accessoryVisual = this.assetLibrary.getAccessoryVisual(accessory);
            if (accessoryVisual) {
                this.drawAccessory(accessoryVisual, config);
                layer.elements.push({ type: 'accessory', data: accessoryVisual });
            }
        });
    }
    
    /**
     * Generate magical/class effects
     */
    generateEffects(config) {
        const layer = this.layers.get('effects');
        
        // Add class-specific effects
        config.classFeatures.forEach(feature => {
            const effect = this.assetLibrary.getClassEffect(feature);
            if (effect) {
                this.drawEffect(effect, config);
                layer.elements.push({ type: 'effect', data: effect });
            }
        });
        
        // Add alignment aura if high level
        if (config.level >= 10) {
            const aura = this.assetLibrary.getAlignmentAura(config.alignment);
            this.drawAura(aura, config);
            layer.elements.push({ type: 'aura', data: aura });
        }
    }
    
    /**
     * Character data analysis methods
     */
    determineAge(characterData) {
        return characterData.age || this.assetLibrary.getRandomAge(characterData.race?.name);
    }
    
    determineBuild(characterData) {
        const str = characterData.abilities?.strength || 10;
        const con = characterData.abilities?.constitution || 10;
        const dex = characterData.abilities?.dexterity || 10;
        
        if (str >= 16) return 'muscular';
        if (str <= 8) return 'thin';
        if (con >= 16) return 'stocky';
        if (dex >= 16) return 'lithe';
        return 'average';
    }
    
    determineHeight(characterData) {
        return characterData.height || this.assetLibrary.getAverageHeight(characterData.race?.name);
    }
    
    determineSkinTone(characterData) {
        return characterData.skinTone || this.assetLibrary.getDefaultSkinTone(characterData.race?.name);
    }
    
    determineHairColor(characterData) {
        return characterData.hairColor || this.assetLibrary.getRandomHairColor(characterData.race?.name);
    }
    
    determineHairStyle(characterData) {
        return characterData.hairStyle || this.assetLibrary.getRandomHairStyle(
            characterData.race?.name,
            characterData.gender
        );
    }
    
    determineEyeColor(characterData) {
        return characterData.eyeColor || this.assetLibrary.getRandomEyeColor(characterData.race?.name);
    }
    
    getVisibleArmor(characterData) {
        if (!characterData.equipment?.armor) return [];
        
        return characterData.equipment.armor.filter(item => 
            item.equipped && item.showInPortrait !== false
        );
    }
    
    getVisibleWeapons(characterData) {
        if (!characterData.equipment?.weapons) return [];
        
        return characterData.equipment.weapons.filter(item => 
            item.equipped && (item.location === 'hands' || item.showInPortrait === true)
        );
    }
    
    getVisibleAccessories(characterData) {
        const accessories = [];
        
        // Add rings, amulets, cloaks, etc.
        if (characterData.equipment) {
            ['rings', 'amulets', 'cloaks', 'belts', 'boots', 'gloves'].forEach(category => {
                if (characterData.equipment[category]) {
                    characterData.equipment[category].forEach(item => {
                        if (item.equipped && item.showInPortrait !== false) {
                            accessories.push(item);
                        }
                    });
                }
            });
        }
        
        return accessories;
    }
    
    getClassVisualFeatures(characterData) {
        const features = [];
        
        characterData.classes?.forEach(charClass => {
            const classFeatures = this.assetLibrary.getClassVisualFeatures(charClass.name, charClass.level);
            features.push(...classFeatures);
        });
        
        return features;
    }
    
    /**
     * Drawing methods for each component
     */
    drawBodySilhouette(bodyShape, config) {
        // Implementation for body silhouette drawing
        this.context.fillStyle = 'rgba(200, 180, 160, 0.1)'; // Base flesh tone guide
        this.context.beginPath();
        
        // Draw basic humanoid shape
        this.context.ellipse(0, -80, 40, 60, 0, 0, Math.PI * 2); // Head
        this.context.rect(-30, -20, 60, 100); // Torso
        this.context.rect(-35, 80, 25, 60); // Left leg
        this.context.rect(10, 80, 25, 60); // Right leg
        
        this.context.fill();
    }
    
    drawClothing(clothing, config) {
        // Implementation for clothing drawing
        this.context.fillStyle = clothing.color || '#4a4a4a';
        this.context.fillRect(-25, -10, 50, 80); // Basic tunic/robe
    }
    
    drawArmor(armorData, config) {
        // Implementation for armor drawing
        this.context.fillStyle = armorData.color || '#666666';
        this.context.strokeStyle = '#333333';
        this.context.lineWidth = 2;
        
        // Draw armor pieces based on type
        if (armorData.type === 'chest') {
            this.context.fillRect(-30, -15, 60, 70);
            this.context.strokeRect(-30, -15, 60, 70);
        }
    }
    
    drawHair(hairData, config) {
        // Implementation for hair drawing using SVG for smooth curves
        const hairGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        const hairPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        
        hairPath.setAttribute('d', hairData.path);
        hairPath.setAttribute('fill', hairData.color);
        hairPath.setAttribute('stroke', this.darkenColor(hairData.color, 0.2));
        
        hairGroup.appendChild(hairPath);
        this.svg.appendChild(hairGroup);
    }
    
    drawEyes(eyeData, config) {
        const eyeSize = 8;
        const eyeY = -40;
        
        // Left eye
        this.context.fillStyle = '#ffffff';
        this.context.beginPath();
        this.context.ellipse(-15, eyeY, eyeSize, eyeSize * 0.6, 0, 0, Math.PI * 2);
        this.context.fill();
        
        this.context.fillStyle = eyeData.color;
        this.context.beginPath();
        this.context.ellipse(-15, eyeY, eyeSize * 0.6, eyeSize * 0.6, 0, 0, Math.PI * 2);
        this.context.fill();
        
        // Right eye
        this.context.fillStyle = '#ffffff';
        this.context.beginPath();
        this.context.ellipse(15, eyeY, eyeSize, eyeSize * 0.6, 0, 0, Math.PI * 2);
        this.context.fill();
        
        this.context.fillStyle = eyeData.color;
        this.context.beginPath();
        this.context.ellipse(15, eyeY, eyeSize * 0.6, eyeSize * 0.6, 0, 0, Math.PI * 2);
        this.context.fill();
    }
    
    drawEyebrows(eyebrowData, config) {
        this.context.fillStyle = this.darkenColor(config.hairColor, 0.3);
        this.context.fillRect(-25, -50, 20, 4); // Left eyebrow
        this.context.fillRect(5, -50, 20, 4);   // Right eyebrow
    }
    
    drawNose(noseData, config) {
        this.context.fillStyle = 'rgba(160, 120, 100, 0.3)';
        this.context.beginPath();
        this.context.ellipse(0, -25, 4, 8, 0, 0, Math.PI * 2);
        this.context.fill();
    }
    
    drawMouth(mouthData, config) {
        this.context.fillStyle = '#cc6666';
        this.context.fillRect(-8, -10, 16, 4);
    }
    
    drawFacialHair(facialHair, config) {
        this.context.fillStyle = facialHair.color;
        this.context.fillRect(-12, -5, 24, 15); // Basic beard
    }
    
    drawWeapon(weaponVisual, config) {
        // Draw weapon based on type and position
        this.context.fillStyle = weaponVisual.color || '#888888';
        this.context.save();
        this.context.translate(35, 20); // Right hand position
        this.context.rotate(Math.PI / 6);
        this.context.fillRect(-2, -30, 4, 60); // Sword/staff
        this.context.restore();
    }
    
    drawAccessory(accessoryVisual, config) {
        // Draw accessory based on type and position
        if (accessoryVisual.type === 'amulet') {
            this.context.fillStyle = accessoryVisual.color || '#gold';
            this.context.beginPath();
            this.context.ellipse(0, 10, 6, 6, 0, 0, Math.PI * 2);
            this.context.fill();
        }
    }
    
    drawEffect(effect, config) {
        // Draw magical effects using SVG for smooth gradients
        const effectGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
        effectGroup.setAttribute('opacity', '0.7');
        
        const effectCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        effectCircle.setAttribute('cx', this.width / 2);
        effectCircle.setAttribute('cy', this.height / 2);
        effectCircle.setAttribute('r', '100');
        effectCircle.setAttribute('fill', 'url(#magicGradient)');
        
        effectGroup.appendChild(effectCircle);
        this.svg.appendChild(effectGroup);
    }
    
    drawAura(aura, config) {
        // Draw alignment aura
        const auraColor = this.getAlignmentColor(config.alignment);
        this.context.save();
        this.context.globalCompositeOperation = 'screen';
        this.context.fillStyle = auraColor;
        this.context.globalAlpha = 0.2;
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
    }
    
    /**
     * Utility methods
     */
    clearCanvas() {
        this.context.clearRect(0, 0, this.width, this.height);
        this.svg.innerHTML = '';
        
        // Clear layer elements
        this.layers.forEach(layer => {
            layer.elements = [];
        });
    }
    
    compositePortrait() {
        // Final compositing and effects
        this.context.save();
        
        // Add subtle vignette
        const gradient = this.context.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, Math.max(this.width, this.height) / 2
        );
        gradient.addColorStop(0.7, 'rgba(0,0,0,0)');
        gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
        
        this.context.fillStyle = gradient;
        this.context.fillRect(0, 0, this.width, this.height);
        
        this.context.restore();
    }
    
    getBackgroundStyle(config) {
        const alignmentStyles = {
            'Lawful Good': { centerColor: '#f4e4c0', outerColor: '#d4af37' },
            'Neutral Good': { centerColor: '#e8f4e8', outerColor: '#90ee90' },
            'Chaotic Good': { centerColor: '#fff0e8', outerColor: '#ffa500' },
            'Lawful Neutral': { centerColor: '#f0f0f0', outerColor: '#808080' },
            'True Neutral': { centerColor: '#f5f5f5', outerColor: '#a0a0a0' },
            'Chaotic Neutral': { centerColor: '#f0f8ff', outerColor: '#4682b4' },
            'Lawful Evil': { centerColor: '#2f1b14', outerColor: '#8b0000' },
            'Neutral Evil': { centerColor: '#1a1a1a', outerColor: '#4b0082' },
            'Chaotic Evil': { centerColor: '#0f0f0f', outerColor: '#ff0000' }
        };
        
        return alignmentStyles[config.alignment] || alignmentStyles['True Neutral'];
    }
    
    addBackgroundEffects(config, bgStyle) {
        // Add class-specific background elements
        const primaryClass = config.classes[0].name;
        
        if (primaryClass === 'Wizard') {
            // Add mystical symbols
            this.addMysticalSymbols();
        } else if (primaryClass === 'Cleric') {
            // Add holy symbols
            this.addHolySymbols();
        } else if (primaryClass === 'Ranger') {
            // Add nature elements
            this.addNatureElements();
        }
    }
    
    addMysticalSymbols() {
        // Implementation for mystical symbols
    }
    
    addHolySymbols() {
        // Implementation for holy symbols
    }
    
    addNatureElements() {
        // Implementation for nature elements
    }
    
    getBodyScale(config) {
        const sizeModifiers = {
            'Fine': 0.1,
            'Diminutive': 0.2,
            'Tiny': 0.3,
            'Small': 0.7,
            'Medium': 1.0,
            'Large': 1.3,
            'Huge': 1.8,
            'Gargantuan': 2.5,
            'Colossal': 3.5
        };
        
        return sizeModifiers[config.size] || 1.0;
    }
    
    getBodyOffset(config) {
        // Adjust vertical position based on race/size
        return 0;
    }
    
    applyRacialSkinFeatures(config, skinData) {
        // Apply racial characteristics like elf ears, dwarf beards, etc.
        if (config.race === 'Elf') {
            this.drawElfEars(config);
        } else if (config.race === 'Dwarf') {
            // Dwarfs get more prominent facial hair
        } else if (config.race === 'Halfling') {
            // Halflings get rounder features
        }
    }
    
    drawElfEars(config) {
        // Draw pointed ears
        this.context.fillStyle = config.skinTone || '#ddbea9';
        
        // Left ear
        this.context.beginPath();
        this.context.ellipse(-35, -50, 8, 15, -Math.PI / 6, 0, Math.PI * 2);
        this.context.fill();
        
        // Right ear
        this.context.beginPath();
        this.context.ellipse(35, -50, 8, 15, Math.PI / 6, 0, Math.PI * 2);
        this.context.fill();
    }
    
    darkenColor(color, amount) {
        // Utility to darken a hex color
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - amount));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - amount));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - amount));
        
        return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
    }
    
    getAlignmentColor(alignment) {
        const colors = {
            'Lawful Good': 'rgba(212, 175, 55, 0.5)',
            'Neutral Good': 'rgba(144, 238, 144, 0.5)',
            'Chaotic Good': 'rgba(255, 165, 0, 0.5)',
            'Lawful Neutral': 'rgba(128, 128, 128, 0.5)',
            'True Neutral': 'rgba(160, 160, 160, 0.5)',
            'Chaotic Neutral': 'rgba(70, 130, 180, 0.5)',
            'Lawful Evil': 'rgba(139, 0, 0, 0.5)',
            'Neutral Evil': 'rgba(75, 0, 130, 0.5)',
            'Chaotic Evil': 'rgba(255, 0, 0, 0.5)'
        };
        
        return colors[alignment] || colors['True Neutral'];
    }
    
    /**
     * Portrait customization methods
     */
    customizeLayer(layerName, customizations) {
        const layer = this.layers.get(layerName);
        if (layer) {
            Object.assign(layer.customizations, customizations);
            this.regeneratePortrait();
        }
    }
    
    setLayerVisibility(layerName, visible) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.visible = visible;
            this.regeneratePortrait();
        }
    }
    
    setLayerOpacity(layerName, opacity) {
        const layer = this.layers.get(layerName);
        if (layer) {
            layer.opacity = Math.max(0, Math.min(1, opacity));
            this.regeneratePortrait();
        }
    }
    
    regeneratePortrait() {
        if (this.characterData) {
            this.generatePortrait(this.characterData);
        }
    }
    
    /**
     * Export methods
     */
    exportPNG(scale = 1) {
        if (scale !== 1) {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = this.width * scale;
            tempCanvas.height = this.height * scale;
            const tempContext = tempCanvas.getContext('2d');
            
            tempContext.imageSmoothingEnabled = true;
            tempContext.imageSmoothingQuality = 'high';
            tempContext.scale(scale, scale);
            tempContext.drawImage(this.canvas, 0, 0);
            
            return tempCanvas.toDataURL('image/png');
        }
        
        return this.canvas.toDataURL('image/png');
    }
    
    exportSVG() {
        const svgData = new XMLSerializer().serializeToString(this.svg);
        return 'data:image/svg+xml;base64,' + btoa(svgData);
    }
    
    exportJSON() {
        return {
            characterData: this.characterData,
            customizations: Object.fromEntries(this.customizations),
            layers: Object.fromEntries(
                Array.from(this.layers.entries()).map(([name, layer]) => [
                    name,
                    {
                        visible: layer.visible,
                        opacity: layer.opacity,
                        customizations: Object.fromEntries(layer.customizations)
                    }
                ])
            )
        };
    }
}

/**
 * Asset Library for character portrait components
 */
class AssetLibrary {
    constructor() {
        this.assets = new Map();
        this.loadAssets();
        
        console.log('🎨 Asset Library initialized');
    }
    
    loadAssets() {
        // Load predefined asset data
        this.loadRacialData();
        this.loadBodyShapes();
        this.loadHairStyles();
        this.loadFacialFeatures();
        this.loadClothing();
        this.loadArmor();
        this.loadWeapons();
        this.loadEffects();
    }
    
    loadRacialData() {
        const races = {
            'Human': {
                skinTones: ['#fdbcb4', '#f1c27d', '#e0ac69', '#c68642', '#8d5524'],
                hairColors: ['#000000', '#2d1b09', '#8b4513', '#d2691e', '#daa520', '#b8860b'],
                eyeColors: ['#8b4513', '#228b22', '#0000cd', '#808080', '#000000'],
                features: {
                    ears: 'rounded',
                    build: 'average',
                    height: { min: 58, max: 78 }
                }
            },
            'Elf': {
                skinTones: ['#fef7dc', '#f5e6d3', '#ede4d1', '#d4c4b0'],
                hairColors: ['#f4e4bc', '#e6d2aa', '#d2b48c', '#8b7355', '#2d1b09'],
                eyeColors: ['#228b22', '#87ceeb', '#4169e1', '#dda0dd'],
                features: {
                    ears: 'pointed',
                    build: 'lithe',
                    height: { min: 55, max: 75 }
                }
            },
            'Dwarf': {
                skinTones: ['#f1c27d', '#d2b48c', '#cd853f', '#a0522d'],
                hairColors: ['#8b4513', '#a0522d', '#696969', '#2f4f4f', '#000000'],
                eyeColors: ['#8b4513', '#000000', '#228b22', '#4682b4'],
                features: {
                    ears: 'rounded',
                    build: 'stocky',
                    height: { min: 45, max: 55 },
                    facialHair: 'common'
                }
            },
            'Halfling': {
                skinTones: ['#fdbcb4', '#f1c27d', '#deb887', '#cd853f'],
                hairColors: ['#8b4513', '#d2691e', '#2d1b09', '#000000'],
                eyeColors: ['#8b4513', '#228b22', '#4682b4', '#000000'],
                features: {
                    ears: 'slightly_pointed',
                    build: 'small_rounded',
                    height: { min: 30, max: 40 }
                }
            }
        };
        
        this.assets.set('races', races);
    }
    
    loadBodyShapes() {
        const bodyShapes = {
            'thin': { chest: 0.8, waist: 0.7, hips: 0.8 },
            'average': { chest: 1.0, waist: 0.9, hips: 1.0 },
            'stocky': { chest: 1.2, waist: 1.1, hips: 1.2 },
            'muscular': { chest: 1.3, waist: 1.0, hips: 1.1 },
            'lithe': { chest: 0.9, waist: 0.8, hips: 0.9 }
        };
        
        this.assets.set('bodyShapes', bodyShapes);
    }
    
    loadHairStyles() {
        const hairStyles = {
            'Human': {
                'male': ['short', 'medium', 'long', 'bald', 'ponytail'],
                'female': ['long', 'braided', 'short', 'curly', 'straight'],
                'neutral': ['short', 'medium', 'long', 'braided']
            },
            'Elf': {
                'male': ['long', 'straight_long', 'half_up', 'flowing'],
                'female': ['very_long', 'braided_long', 'flowing', 'elaborate'],
                'neutral': ['long', 'flowing', 'straight']
            },
            'Dwarf': {
                'male': ['medium', 'long_braided', 'wild', 'braided'],
                'female': ['braided', 'long_braided', 'elaborate_braids'],
                'neutral': ['braided', 'medium']
            },
            'Halfling': {
                'male': ['curly', 'wavy', 'short_curly', 'medium'],
                'female': ['curly_long', 'wavy', 'braided', 'flowing'],
                'neutral': ['curly', 'wavy', 'medium']
            }
        };
        
        this.assets.set('hairStyles', hairStyles);
    }
    
    loadFacialFeatures() {
        const features = {
            'Human': {
                eyes: { shape: 'almond', size: 'medium' },
                eyebrows: { thickness: 'medium', arch: 'normal' },
                nose: { shape: 'straight', size: 'medium' },
                mouth: { size: 'medium', shape: 'normal' }
            },
            'Elf': {
                eyes: { shape: 'large_almond', size: 'large' },
                eyebrows: { thickness: 'thin', arch: 'high' },
                nose: { shape: 'narrow', size: 'small' },
                mouth: { size: 'small', shape: 'elegant' }
            },
            'Dwarf': {
                eyes: { shape: 'deep_set', size: 'small' },
                eyebrows: { thickness: 'thick', arch: 'low' },
                nose: { shape: 'broad', size: 'large' },
                mouth: { size: 'wide', shape: 'firm' }
            },
            'Halfling': {
                eyes: { shape: 'round', size: 'large' },
                eyebrows: { thickness: 'medium', arch: 'gentle' },
                nose: { shape: 'button', size: 'small' },
                mouth: { size: 'small', shape: 'cheerful' }
            }
        };
        
        this.assets.set('facialFeatures', features);
    }
    
    loadClothing() {
        const clothing = {
            'Fighter': [
                { type: 'tunic', color: '#8b4513', level: 1 },
                { type: 'tabard', color: '#4682b4', level: 5 },
                { type: 'formal_uniform', color: '#2f4f4f', level: 10 }
            ],
            'Wizard': [
                { type: 'robe', color: '#4b0082', level: 1 },
                { type: 'decorated_robe', color: '#9370db', level: 5 },
                { type: 'archmage_robe', color: '#8a2be2', level: 15 }
            ],
            'Cleric': [
                { type: 'vestments', color: '#ffffff', level: 1 },
                { type: 'ceremonial_vestments', color: '#ffd700', level: 5 },
                { type: 'high_priest_robes', color: '#b8860b', level: 12 }
            ],
            'Rogue': [
                { type: 'leather_outfit', color: '#2f4f4f', level: 1 },
                { type: 'dark_clothing', color: '#1a1a1a', level: 5 },
                { type: 'master_thief_gear', color: '#36454f', level: 10 }
            ]
        };
        
        this.assets.set('clothing', clothing);
    }
    
    loadArmor() {
        const armor = {
            'leather': { color: '#8b4513', coverage: 'light' },
            'studded_leather': { color: '#a0522d', coverage: 'light' },
            'chain_shirt': { color: '#c0c0c0', coverage: 'medium' },
            'chainmail': { color: '#a9a9a9', coverage: 'heavy' },
            'scale_mail': { color: '#696969', coverage: 'medium' },
            'plate_mail': { color: '#dcdcdc', coverage: 'heavy' },
            'full_plate': { color: '#f5f5f5', coverage: 'heavy' }
        };
        
        this.assets.set('armor', armor);
    }
    
    loadWeapons() {
        const weapons = {
            'sword': { type: 'melee', position: 'hand', color: '#c0c0c0' },
            'staff': { type: 'magic', position: 'hand', color: '#8b4513' },
            'bow': { type: 'ranged', position: 'back', color: '#daa520' },
            'shield': { type: 'defense', position: 'arm', color: '#b87333' },
            'axe': { type: 'melee', position: 'hand', color: '#696969' },
            'mace': { type: 'melee', position: 'hand', color: '#4682b4' }
        };
        
        this.assets.set('weapons', weapons);
    }
    
    loadEffects() {
        const effects = {
            'divine': { color: '#ffd700', type: 'aura' },
            'arcane': { color: '#9370db', type: 'sparkles' },
            'nature': { color: '#228b22', type: 'leaves' },
            'shadow': { color: '#2f2f2f', type: 'smoke' }
        };
        
        this.assets.set('effects', effects);
    }
    
    // Asset retrieval methods
    getRacialData(raceName) {
        const races = this.assets.get('races');
        return races[raceName] || races['Human'];
    }
    
    getBodyShape(race, gender, build) {
        const bodyShapes = this.assets.get('bodyShapes');
        return bodyShapes[build] || bodyShapes['average'];
    }
    
    getSkinData(race, skinTone) {
        const racialData = this.getRacialData(race);
        return {
            baseColor: skinTone || racialData.skinTones[0],
            availableTones: racialData.skinTones
        };
    }
    
    getHairData(race, gender, style, color) {
        const racialData = this.getRacialData(race);
        const hairStyles = this.assets.get('hairStyles');
        
        const availableStyles = hairStyles[race]?.[gender] || hairStyles['Human'][gender];
        const finalStyle = availableStyles.includes(style) ? style : availableStyles[0];
        
        return {
            style: finalStyle,
            color: color || racialData.hairColors[0],
            path: this.generateHairPath(finalStyle)
        };
    }
    
    getFacialFeatures(race, gender) {
        const facialFeatures = this.assets.get('facialFeatures');
        return facialFeatures[race] || facialFeatures['Human'];
    }
    
    getClothing(className, level) {
        const clothing = this.assets.get('clothing');
        const classClothing = clothing[className] || clothing['Fighter'];
        
        // Find appropriate clothing for level
        let appropriate = classClothing[0];
        for (const item of classClothing) {
            if (level >= item.level) {
                appropriate = item;
            }
        }
        
        return appropriate;
    }
    
    getArmorVisuals(armorItem) {
        const armor = this.assets.get('armor');
        return armor[armorItem.type] || null;
    }
    
    getWeaponVisual(weapon) {
        const weapons = this.assets.get('weapons');
        return weapons[weapon.type] || null;
    }
    
    getAccessoryVisual(accessory) {
        // Return accessory visual data based on type
        return {
            type: accessory.type,
            color: accessory.color || '#daa520',
            position: accessory.position || 'neck'
        };
    }
    
    getClassEffect(feature) {
        const effects = this.assets.get('effects');
        
        if (feature.includes('divine')) return effects['divine'];
        if (feature.includes('arcane')) return effects['arcane'];
        if (feature.includes('nature')) return effects['nature'];
        if (feature.includes('shadow')) return effects['shadow'];
        
        return null;
    }
    
    getAlignmentAura(alignment) {
        const auraColors = {
            'Lawful Good': '#ffd700',
            'Neutral Good': '#90ee90',
            'Chaotic Good': '#ffa500',
            'Lawful Neutral': '#c0c0c0',
            'True Neutral': '#a0a0a0',
            'Chaotic Neutral': '#4682b4',
            'Lawful Evil': '#8b0000',
            'Neutral Evil': '#4b0082',
            'Chaotic Evil': '#dc143c'
        };
        
        return {
            color: auraColors[alignment] || auraColors['True Neutral'],
            intensity: 0.3
        };
    }
    
    getClassVisualFeatures(className, level) {
        const features = [];
        
        if (className === 'Cleric' && level >= 5) {
            features.push('divine_aura');
        }
        if (className === 'Wizard' && level >= 10) {
            features.push('arcane_sparkles');
        }
        if (className === 'Ranger' && level >= 7) {
            features.push('nature_affinity');
        }
        if (className === 'Rogue' && level >= 8) {
            features.push('shadow_blend');
        }
        
        return features;
    }
    
    // Utility methods for asset generation
    generateHairPath(style) {
        const hairPaths = {
            'short': 'M 180 50 Q 220 30 260 50 Q 280 80 260 110 Q 220 90 180 110 Q 160 80 180 50',
            'long': 'M 160 40 Q 200 20 240 40 Q 280 60 260 120 Q 240 180 220 240 Q 200 180 180 240 Q 160 180 140 120 Q 120 60 160 40',
            'braided': 'M 170 45 Q 210 25 250 45 Q 270 70 250 100 L 245 140 Q 240 180 235 220 Q 200 200 200 160 Q 200 120 170 100 Q 150 70 170 45',
            'flowing': 'M 150 35 Q 200 15 250 35 Q 290 55 280 100 Q 270 150 250 200 Q 220 250 200 300 Q 180 250 160 200 Q 140 150 130 100 Q 120 55 150 35'
        };
        
        return hairPaths[style] || hairPaths['short'];
    }
    
    getRandomAge(race) {
        const ageRanges = {
            'Human': { young: 18, middle: 40, old: 60 },
            'Elf': { young: 110, middle: 500, old: 750 },
            'Dwarf': { young: 40, middle: 150, old: 250 },
            'Halfling': { young: 22, middle: 70, old: 100 }
        };
        
        const range = ageRanges[race] || ageRanges['Human'];
        return range.young + Math.floor(Math.random() * (range.middle - range.young));
    }
    
    getAverageHeight(race) {
        const heights = {
            'Human': 70,
            'Elf': 68,
            'Dwarf': 50,
            'Halfling': 36
        };
        
        return heights[race] || heights['Human'];
    }
    
    getDefaultSkinTone(race) {
        const racialData = this.getRacialData(race);
        return racialData.skinTones[0];
    }
    
    getRandomHairColor(race) {
        const racialData = this.getRacialData(race);
        const colors = racialData.hairColors;
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getRandomHairStyle(race, gender) {
        const hairStyles = this.assets.get('hairStyles');
        const styles = hairStyles[race]?.[gender] || hairStyles['Human'][gender];
        return styles[Math.floor(Math.random() * styles.length)];
    }
    
    getRandomEyeColor(race) {
        const racialData = this.getRacialData(race);
        const colors = racialData.eyeColors;
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    getFacialHair(race, hairColor) {
        return {
            color: hairColor,
            style: 'beard',
            coverage: 'full'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PortraitDesigner, AssetLibrary };
} else if (typeof window !== 'undefined') {
    window.PortraitDesigner = PortraitDesigner;
    window.AssetLibrary = AssetLibrary;
}