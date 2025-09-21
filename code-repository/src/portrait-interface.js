/**
 * D&D 3.5 Portrait Customization Interface
 * Interactive UI for portrait designer with real-time preview
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class PortraitInterface {
    constructor(portraitDesigner, options = {}) {
        this.designer = portraitDesigner;
        this.container = null;
        this.previewPanel = null;
        this.customizationPanel = null;
        this.toolsPanel = null;
        
        this.currentCharacter = null;
        this.previewMode = 'live'; // 'live' or 'static'
        
        this.initializeInterface(options);
        this.setupEventListeners();
        
        console.log('🎨 Portrait Interface initialized');
    }
    
    /**
     * Initialize the complete portrait interface
     */
    initializeInterface(options = {}) {
        this.container = this.createElement('div', 'portrait-interface');
        
        // Create main layout panels
        this.createPreviewPanel();
        this.createCustomizationPanel();
        this.createToolsPanel();
        
        // Apply container to specified element or body
        const targetElement = options.container || document.body;
        targetElement.appendChild(this.container);
        
        // Load default styles
        this.injectStyles();
    }
    
    /**
     * Create preview panel with portrait display
     */
    createPreviewPanel() {
        this.previewPanel = this.createElement('div', 'preview-panel');
        
        // Portrait display area
        const portraitDisplay = this.createElement('div', 'portrait-display');
        
        // Canvas container
        const canvasContainer = this.createElement('div', 'canvas-container');
        canvasContainer.appendChild(this.designer.canvas);
        canvasContainer.appendChild(this.designer.svg);
        
        // Preview controls
        const previewControls = this.createElement('div', 'preview-controls');
        
        const zoomSlider = this.createElement('input', 'zoom-slider');
        zoomSlider.type = 'range';
        zoomSlider.min = 0.5;
        zoomSlider.max = 3.0;
        zoomSlider.step = 0.1;
        zoomSlider.value = 1.0;
        
        const zoomLabel = this.createElement('label', null, 'Zoom:');
        zoomLabel.appendChild(zoomSlider);
        
        const backgroundToggle = this.createElement('input', 'bg-toggle');
        backgroundToggle.type = 'checkbox';
        backgroundToggle.checked = true;
        
        const backgroundLabel = this.createElement('label', null, 'Background:');
        backgroundLabel.appendChild(backgroundToggle);
        
        previewControls.appendChild(zoomLabel);
        previewControls.appendChild(backgroundLabel);
        
        portraitDisplay.appendChild(canvasContainer);
        portraitDisplay.appendChild(previewControls);
        
        this.previewPanel.appendChild(portraitDisplay);
        this.container.appendChild(this.previewPanel);
    }
    
    /**
     * Create customization panel with layer controls
     */
    createCustomizationPanel() {
        this.customizationPanel = this.createElement('div', 'customization-panel');
        
        // Panel header
        const header = this.createElement('div', 'panel-header');
        header.innerHTML = '<h3>Portrait Customization</h3>';
        
        // Tabs for different customization categories
        const tabContainer = this.createElement('div', 'tab-container');
        
        const tabs = [
            { id: 'appearance', name: 'Appearance', icon: '👤' },
            { id: 'clothing', name: 'Clothing', icon: '👕' },
            { id: 'equipment', name: 'Equipment', icon: '⚔️' },
            { id: 'effects', name: 'Effects', icon: '✨' },
            { id: 'layers', name: 'Layers', icon: '📚' }
        ];
        
        tabs.forEach(tab => {
            const tabButton = this.createElement('button', `tab-${tab.id}`);
            tabButton.innerHTML = `${tab.icon} ${tab.name}`;
            tabButton.addEventListener('click', () => this.showTab(tab.id));
            tabContainer.appendChild(tabButton);
        });
        
        // Tab content area
        const tabContent = this.createElement('div', 'tab-content');
        
        this.customizationPanel.appendChild(header);
        this.customizationPanel.appendChild(tabContainer);
        this.customizationPanel.appendChild(tabContent);
        this.container.appendChild(this.customizationPanel);
        
        // Initialize with appearance tab
        this.showTab('appearance');
    }
    
    /**
     * Create tools panel with export and action buttons
     */
    createToolsPanel() {
        this.toolsPanel = this.createElement('div', 'tools-panel');
        
        // Export tools
        const exportSection = this.createElement('div', 'export-section');
        exportSection.innerHTML = '<h4>Export Portrait</h4>';
        
        const exportButtons = this.createElement('div', 'export-buttons');
        
        const exportPNG = this.createElement('button', 'export-png');
        exportPNG.innerHTML = '📷 Export PNG';
        exportPNG.addEventListener('click', () => this.exportPNG());
        
        const exportSVG = this.createElement('button', 'export-svg');
        exportSVG.innerHTML = '🎨 Export SVG';
        exportSVG.addEventListener('click', () => this.exportSVG());
        
        const exportJSON = this.createElement('button', 'export-json');
        exportJSON.innerHTML = '📄 Export Data';
        exportJSON.addEventListener('click', () => this.exportJSON());
        
        exportButtons.appendChild(exportPNG);
        exportButtons.appendChild(exportSVG);
        exportButtons.appendChild(exportJSON);
        exportSection.appendChild(exportButtons);
        
        // Action tools
        const actionSection = this.createElement('div', 'action-section');
        actionSection.innerHTML = '<h4>Actions</h4>';
        
        const actionButtons = this.createElement('div', 'action-buttons');
        
        const randomizeBtn = this.createElement('button', 'randomize');
        randomizeBtn.innerHTML = '🎲 Randomize';
        randomizeBtn.addEventListener('click', () => this.randomizeAppearance());
        
        const resetBtn = this.createElement('button', 'reset');
        resetBtn.innerHTML = '🔄 Reset';
        resetBtn.addEventListener('click', () => this.resetToDefault());
        
        const savePresetBtn = this.createElement('button', 'save-preset');
        savePresetBtn.innerHTML = '💾 Save Preset';
        savePresetBtn.addEventListener('click', () => this.savePreset());
        
        actionButtons.appendChild(randomizeBtn);
        actionButtons.appendChild(resetBtn);
        actionButtons.appendChild(savePresetBtn);
        actionSection.appendChild(actionButtons);
        
        this.toolsPanel.appendChild(exportSection);
        this.toolsPanel.appendChild(actionSection);
        this.container.appendChild(this.toolsPanel);
    }
    
    /**
     * Show specific customization tab
     */
    showTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.tab-container button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`#tab-${tabId}`).classList.add('active');
        
        // Show tab content
        const tabContent = document.querySelector('.tab-content');
        tabContent.innerHTML = '';
        
        switch (tabId) {
            case 'appearance':
                this.createAppearanceTab(tabContent);
                break;
            case 'clothing':
                this.createClothingTab(tabContent);
                break;
            case 'equipment':
                this.createEquipmentTab(tabContent);
                break;
            case 'effects':
                this.createEffectsTab(tabContent);
                break;
            case 'layers':
                this.createLayersTab(tabContent);
                break;
        }
    }
    
    /**
     * Create appearance customization tab
     */
    createAppearanceTab(container) {
        // Physical features section
        const physicalSection = this.createElement('div', 'customization-section');
        physicalSection.innerHTML = '<h5>Physical Features</h5>';
        
        // Skin tone
        const skinToneGroup = this.createColorPicker('Skin Tone', 'skinTone', [
            '#fdbcb4', '#f1c27d', '#e0ac69', '#c68642', '#8d5524', '#6b4423'
        ]);
        physicalSection.appendChild(skinToneGroup);
        
        // Hair color
        const hairColorGroup = this.createColorPicker('Hair Color', 'hairColor', [
            '#000000', '#2d1b09', '#8b4513', '#d2691e', '#daa520', '#b8860b', '#dc143c'
        ]);
        physicalSection.appendChild(hairColorGroup);
        
        // Hair style
        const hairStyleGroup = this.createDropdown('Hair Style', 'hairStyle', [
            'short', 'medium', 'long', 'braided', 'ponytail', 'bald', 'curly'
        ]);
        physicalSection.appendChild(hairStyleGroup);
        
        // Eye color
        const eyeColorGroup = this.createColorPicker('Eye Color', 'eyeColor', [
            '#8b4513', '#228b22', '#0000cd', '#808080', '#000000', '#4169e1', '#dda0dd'
        ]);
        physicalSection.appendChild(eyeColorGroup);
        
        container.appendChild(physicalSection);
        
        // Facial features section
        const facialSection = this.createElement('div', 'customization-section');
        facialSection.innerHTML = '<h5>Facial Features</h5>';
        
        // Facial hair (for applicable genders/races)
        if (this.currentCharacter?.gender === 'male' || this.currentCharacter?.race === 'Dwarf') {
            const facialHairGroup = this.createDropdown('Facial Hair', 'facialHair', [
                'none', 'mustache', 'goatee', 'beard', 'full_beard'
            ]);
            facialSection.appendChild(facialHairGroup);
        }
        
        // Scars and markings
        const scarsGroup = this.createCheckboxGroup('Scars & Markings', [
            { id: 'face_scar', label: 'Facial Scar' },
            { id: 'tattoo', label: 'Facial Tattoo' },
            { id: 'birthmark', label: 'Birthmark' }
        ]);
        facialSection.appendChild(scarsGroup);
        
        container.appendChild(facialSection);
        
        // Body type section
        const bodySection = this.createElement('div', 'customization-section');
        bodySection.innerHTML = '<h5>Body Type</h5>';
        
        const buildGroup = this.createRadioGroup('Build', 'build', [
            'thin', 'average', 'stocky', 'muscular', 'lithe'
        ]);
        bodySection.appendChild(buildGroup);
        
        container.appendChild(bodySection);
    }
    
    /**
     * Create clothing customization tab
     */
    createClothingTab(container) {
        const clothingSection = this.createElement('div', 'customization-section');
        clothingSection.innerHTML = '<h5>Clothing Options</h5>';
        
        // Base clothing
        const baseClothingGroup = this.createDropdown('Base Clothing', 'baseClothing', [
            'tunic', 'robe', 'dress', 'shirt', 'vestments', 'leather_outfit'
        ]);
        clothingSection.appendChild(baseClothingGroup);
        
        // Clothing color
        const clothingColorGroup = this.createColorPicker('Clothing Color', 'clothingColor', [
            '#8b4513', '#4682b4', '#228b22', '#dc143c', '#4b0082', '#2f4f4f', '#000000'
        ]);
        clothingSection.appendChild(clothingColorGroup);
        
        // Cloak/Cape
        const cloakGroup = this.createDropdown('Cloak', 'cloak', [
            'none', 'short_cloak', 'long_cloak', 'cape', 'hooded_cloak'
        ]);
        clothingSection.appendChild(cloakGroup);
        
        container.appendChild(clothingSection);
    }
    
    /**
     * Create equipment customization tab
     */
    createEquipmentTab(container) {
        const equipmentSection = this.createElement('div', 'customization-section');
        equipmentSection.innerHTML = '<h5>Visible Equipment</h5>';
        
        // Armor display
        const armorGroup = this.createCheckboxGroup('Show Armor', [
            { id: 'show_helmet', label: 'Helmet' },
            { id: 'show_chest', label: 'Chest Armor' },
            { id: 'show_gauntlets', label: 'Gauntlets' },
            { id: 'show_boots', label: 'Boots' }
        ]);
        equipmentSection.appendChild(armorGroup);
        
        // Weapon display
        const weaponGroup = this.createCheckboxGroup('Show Weapons', [
            { id: 'show_main_weapon', label: 'Main Hand Weapon' },
            { id: 'show_off_weapon', label: 'Off Hand Weapon' },
            { id: 'show_shield', label: 'Shield' },
            { id: 'show_ranged', label: 'Ranged Weapon' }
        ]);
        equipmentSection.appendChild(weaponGroup);
        
        // Accessories
        const accessoryGroup = this.createCheckboxGroup('Show Accessories', [
            { id: 'show_amulet', label: 'Amulet' },
            { id: 'show_rings', label: 'Rings' },
            { id: 'show_belt', label: 'Belt' },
            { id: 'show_backpack', label: 'Backpack' }
        ]);
        equipmentSection.appendChild(accessoryGroup);
        
        container.appendChild(equipmentSection);
    }
    
    /**
     * Create effects customization tab
     */
    createEffectsTab(container) {
        const effectsSection = this.createElement('div', 'customization-section');
        effectsSection.innerHTML = '<h5>Magical Effects</h5>';
        
        // Aura effects
        const auraGroup = this.createCheckboxGroup('Auras', [
            { id: 'alignment_aura', label: 'Alignment Aura' },
            { id: 'divine_aura', label: 'Divine Aura' },
            { id: 'arcane_aura', label: 'Arcane Aura' },
            { id: 'elemental_aura', label: 'Elemental Aura' }
        ]);
        effectsSection.appendChild(auraGroup);
        
        // Spell effects
        const spellGroup = this.createCheckboxGroup('Spell Effects', [
            { id: 'mage_armor', label: 'Mage Armor' },
            { id: 'shield', label: 'Shield Spell' },
            { id: 'blur', label: 'Blur Effect' },
            { id: 'haste', label: 'Haste Shimmer' }
        ]);
        effectsSection.appendChild(spellGroup);
        
        // Background effects
        const bgEffectGroup = this.createDropdown('Background Effect', 'bgEffect', [
            'none', 'divine_light', 'arcane_symbols', 'nature_elements', 'shadow_tendrils'
        ]);
        effectsSection.appendChild(bgEffectGroup);
        
        container.appendChild(effectsSection);
    }
    
    /**
     * Create layers management tab
     */
    createLayersTab(container) {
        const layersSection = this.createElement('div', 'customization-section');
        layersSection.innerHTML = '<h5>Layer Management</h5>';
        
        // Create layer controls for each layer
        this.designer.layers.forEach((layer, layerName) => {
            const layerControl = this.createElement('div', 'layer-control');
            
            // Layer visibility toggle
            const visibilityCheck = this.createElement('input', `layer-${layerName}-visibility`);
            visibilityCheck.type = 'checkbox';
            visibilityCheck.checked = layer.visible;
            visibilityCheck.addEventListener('change', (e) => {
                this.designer.setLayerVisibility(layerName, e.target.checked);
            });
            
            // Layer opacity slider
            const opacitySlider = this.createElement('input', `layer-${layerName}-opacity`);
            opacitySlider.type = 'range';
            opacitySlider.min = 0;
            opacitySlider.max = 1;
            opacitySlider.step = 0.1;
            opacitySlider.value = layer.opacity;
            opacitySlider.addEventListener('input', (e) => {
                this.designer.setLayerOpacity(layerName, parseFloat(e.target.value));
            });
            
            // Layer label
            const layerLabel = this.createElement('label', null, layerName);
            
            layerControl.appendChild(visibilityCheck);
            layerControl.appendChild(layerLabel);
            layerControl.appendChild(opacitySlider);
            
            layersSection.appendChild(layerControl);
        });
        
        container.appendChild(layersSection);
    }
    
    /**
     * UI Component creation helpers
     */
    createColorPicker(label, property, colors) {
        const group = this.createElement('div', 'form-group');
        const labelEl = this.createElement('label', null, label + ':');
        const colorContainer = this.createElement('div', 'color-picker');
        
        colors.forEach(color => {
            const colorBtn = this.createElement('button', 'color-option');
            colorBtn.style.backgroundColor = color;
            colorBtn.addEventListener('click', () => {
                this.updateProperty(property, color);
                this.updateColorSelection(colorContainer, colorBtn);
            });
            colorContainer.appendChild(colorBtn);
        });
        
        group.appendChild(labelEl);
        group.appendChild(colorContainer);
        return group;
    }
    
    createDropdown(label, property, options) {
        const group = this.createElement('div', 'form-group');
        const labelEl = this.createElement('label', null, label + ':');
        const select = this.createElement('select');
        
        options.forEach(option => {
            const optionEl = this.createElement('option');
            optionEl.value = option;
            optionEl.textContent = option.replace('_', ' ');
            select.appendChild(optionEl);
        });
        
        select.addEventListener('change', (e) => {
            this.updateProperty(property, e.target.value);
        });
        
        group.appendChild(labelEl);
        group.appendChild(select);
        return group;
    }
    
    createRadioGroup(label, property, options) {
        const group = this.createElement('div', 'form-group');
        const labelEl = this.createElement('label', null, label + ':');
        const radioContainer = this.createElement('div', 'radio-group');
        
        options.forEach(option => {
            const radioLabel = this.createElement('label', 'radio-label');
            const radio = this.createElement('input');
            radio.type = 'radio';
            radio.name = property;
            radio.value = option;
            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.updateProperty(property, option);
                }
            });
            
            radioLabel.appendChild(radio);
            radioLabel.appendChild(document.createTextNode(option.replace('_', ' ')));
            radioContainer.appendChild(radioLabel);
        });
        
        group.appendChild(labelEl);
        group.appendChild(radioContainer);
        return group;
    }
    
    createCheckboxGroup(label, options) {
        const group = this.createElement('div', 'form-group');
        const labelEl = this.createElement('label', null, label + ':');
        const checkContainer = this.createElement('div', 'checkbox-group');
        
        options.forEach(option => {
            const checkLabel = this.createElement('label', 'checkbox-label');
            const checkbox = this.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = option.id;
            checkbox.addEventListener('change', (e) => {
                this.updateFeature(option.id, e.target.checked);
            });
            
            checkLabel.appendChild(checkbox);
            checkLabel.appendChild(document.createTextNode(option.label));
            checkContainer.appendChild(checkLabel);
        });
        
        group.appendChild(labelEl);
        group.appendChild(checkContainer);
        return group;
    }
    
    /**
     * Utility methods
     */
    createElement(tagName, className = null, textContent = null) {
        const element = document.createElement(tagName);
        if (className) element.className = className;
        if (textContent) element.textContent = textContent;
        return element;
    }
    
    updateColorSelection(container, selectedBtn) {
        container.querySelectorAll('.color-option').forEach(btn => {
            btn.classList.remove('selected');
        });
        selectedBtn.classList.add('selected');
    }
    
    /**
     * Character and property management
     */
    loadCharacter(characterData) {
        this.currentCharacter = characterData;
        this.designer.generatePortrait(characterData);
        this.refreshInterface();
    }
    
    updateProperty(property, value) {
        if (!this.currentCharacter) return;
        
        // Update character data
        this.currentCharacter[property] = value;
        
        // Regenerate portrait with live preview
        if (this.previewMode === 'live') {
            this.designer.generatePortrait(this.currentCharacter);
        }
        
        console.log(`Updated ${property} to ${value}`);
    }
    
    updateFeature(featureId, enabled) {
        if (!this.currentCharacter.portraitFeatures) {
            this.currentCharacter.portraitFeatures = {};
        }
        
        this.currentCharacter.portraitFeatures[featureId] = enabled;
        
        if (this.previewMode === 'live') {
            this.designer.generatePortrait(this.currentCharacter);
        }
    }
    
    refreshInterface() {
        // Update interface controls to match current character
        if (this.currentCharacter) {
            // Update form controls with character values
            this.syncFormControls();
        }
    }
    
    syncFormControls() {
        // Sync form controls with character data
        // This would update sliders, dropdowns, etc. to match current values
    }
    
    /**
     * Action methods
     */
    randomizeAppearance() {
        if (!this.currentCharacter) return;
        
        // Randomize appearance properties
        const assetLibrary = this.designer.assetLibrary;
        
        this.currentCharacter.skinTone = assetLibrary.getRandomSkinTone(this.currentCharacter.race?.name);
        this.currentCharacter.hairColor = assetLibrary.getRandomHairColor(this.currentCharacter.race?.name);
        this.currentCharacter.hairStyle = assetLibrary.getRandomHairStyle(
            this.currentCharacter.race?.name,
            this.currentCharacter.gender
        );
        this.currentCharacter.eyeColor = assetLibrary.getRandomEyeColor(this.currentCharacter.race?.name);
        
        this.designer.generatePortrait(this.currentCharacter);
        this.refreshInterface();
        
        console.log('🎲 Appearance randomized');
    }
    
    resetToDefault() {
        if (!this.currentCharacter) return;
        
        // Reset customizations to default
        this.designer.customizations.clear();
        this.designer.layers.forEach(layer => {
            layer.customizations.clear();
            layer.visible = true;
            layer.opacity = 1.0;
        });
        
        this.designer.generatePortrait(this.currentCharacter);
        this.refreshInterface();
        
        console.log('🔄 Portrait reset to default');
    }
    
    savePreset() {
        const presetData = {
            characterSettings: { ...this.currentCharacter },
            customizations: this.designer.exportJSON(),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage
        const presetKey = `portrait_preset_${Date.now()}`;
        localStorage.setItem(presetKey, JSON.stringify(presetData));
        
        console.log('💾 Preset saved as', presetKey);
        
        // Show user feedback
        this.showNotification('Portrait preset saved!');
    }
    
    /**
     * Export methods
     */
    exportPNG() {
        const dataURL = this.designer.exportPNG(2); // 2x scale for high quality
        this.downloadFile(dataURL, `${this.currentCharacter?.name || 'character'}_portrait.png`);
        
        console.log('📷 PNG exported');
    }
    
    exportSVG() {
        const svgData = this.designer.exportSVG();
        this.downloadFile(svgData, `${this.currentCharacter?.name || 'character'}_portrait.svg`);
        
        console.log('🎨 SVG exported');
    }
    
    exportJSON() {
        const jsonData = this.designer.exportJSON();
        const dataURL = 'data:application/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonData, null, 2));
        this.downloadFile(dataURL, `${this.currentCharacter?.name || 'character'}_portrait.json`);
        
        console.log('📄 JSON exported');
    }
    
    downloadFile(dataURL, filename) {
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    /**
     * UI feedback methods
     */
    showNotification(message, type = 'info') {
        const notification = this.createElement('div', `notification ${type}`);
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 20px;
            background: #4CAF50;
            color: white;
            border-radius: 4px;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => document.body.removeChild(notification), 300);
        }, 3000);
    }
    
    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Zoom control
        const zoomSlider = document.querySelector('.zoom-slider');
        if (zoomSlider) {
            zoomSlider.addEventListener('input', (e) => {
                const scale = parseFloat(e.target.value);
                this.setCanvasScale(scale);
            });
        }
        
        // Background toggle
        const bgToggle = document.querySelector('.bg-toggle');
        if (bgToggle) {
            bgToggle.addEventListener('change', (e) => {
                this.designer.setLayerVisibility('background', e.target.checked);
            });
        }
    }
    
    setCanvasScale(scale) {
        const canvasContainer = document.querySelector('.canvas-container');
        if (canvasContainer) {
            canvasContainer.style.transform = `scale(${scale})`;
            canvasContainer.style.transformOrigin = 'center center';
        }
    }
    
    /**
     * Inject CSS styles for the interface
     */
    injectStyles() {
        const styles = `
            .portrait-interface {
                display: grid;
                grid-template-columns: 1fr 300px 200px;
                gap: 20px;
                padding: 20px;
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background: #f5f5f5;
                min-height: 100vh;
            }
            
            .preview-panel {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            
            .portrait-display {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 20px;
            }
            
            .canvas-container {
                position: relative;
                border: 2px solid #ddd;
                border-radius: 8px;
                overflow: hidden;
                background: #fff;
            }
            
            .preview-controls {
                display: flex;
                gap: 20px;
                align-items: center;
            }
            
            .customization-panel {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 20px;
                overflow-y: auto;
                max-height: 80vh;
            }
            
            .panel-header h3 {
                margin: 0 0 20px 0;
                color: #333;
            }
            
            .tab-container {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-bottom: 20px;
            }
            
            .tab-container button {
                padding: 8px 12px;
                border: 1px solid #ddd;
                background: #f8f8f8;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .tab-container button.active {
                background: #007cba;
                color: white;
                border-color: #007cba;
            }
            
            .customization-section {
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            }
            
            .customization-section h5 {
                margin: 0 0 15px 0;
                color: #555;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: #333;
            }
            
            .color-picker {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
            }
            
            .color-option {
                width: 30px;
                height: 30px;
                border: 2px solid #ddd;
                border-radius: 50%;
                cursor: pointer;
                transition: transform 0.2s;
            }
            
            .color-option:hover {
                transform: scale(1.1);
            }
            
            .color-option.selected {
                border-color: #007cba;
                transform: scale(1.1);
            }
            
            .radio-group, .checkbox-group {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .radio-label, .checkbox-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
            }
            
            .layer-control {
                display: grid;
                grid-template-columns: auto 1fr auto;
                gap: 10px;
                align-items: center;
                padding: 10px;
                background: #f8f8f8;
                border-radius: 4px;
                margin-bottom: 5px;
            }
            
            .tools-panel {
                background: white;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                padding: 20px;
                height: fit-content;
            }
            
            .export-section, .action-section {
                margin-bottom: 25px;
            }
            
            .export-section h4, .action-section h4 {
                margin: 0 0 15px 0;
                color: #333;
            }
            
            .export-buttons, .action-buttons {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            
            .export-buttons button, .action-buttons button {
                padding: 10px 15px;
                border: 1px solid #ddd;
                background: white;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background 0.2s;
            }
            
            .export-buttons button:hover, .action-buttons button:hover {
                background: #f0f0f0;
            }
            
            select, input[type="range"] {
                padding: 5px;
                border: 1px solid #ddd;
                border-radius: 4px;
                width: 100%;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            
            @media (max-width: 1200px) {
                .portrait-interface {
                    grid-template-columns: 1fr;
                    grid-template-rows: auto auto auto;
                }
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortraitInterface;
} else if (typeof window !== 'undefined') {
    window.PortraitInterface = PortraitInterface;
}