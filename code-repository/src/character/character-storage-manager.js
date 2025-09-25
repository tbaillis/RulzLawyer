/**
 * CharacterStorageManager - Complete Save/Load Character System
 * Provides comprehensive character persistence with local storage and export/import
 * 
 * Features:
 * - Local storage for character persistence
 * - Export characters to JSON files
 * - Import characters from JSON files
 * - Character validation and error handling
 * - Backup and restore functionality
 * - Auto-save capabilities
 * - Character library management
 * - Search and filter saved characters
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class CharacterStorageManager {
    constructor() {
        this.storageKey = 'rulzlawyer_characters';
        this.settingsKey = 'rulzlawyer_settings';
        this.autoSaveInterval = null;
        this.autoSaveEnabled = true;
        this.maxCharacters = 100; // Prevent excessive storage usage

        this.initializeStorage();

        console.log('💾 CharacterStorageManager initialized with auto-save and export capabilities');
    }

    /**
     * Initialize storage and load settings
     */
    initializeStorage() {
        try {
            // Ensure localStorage is available
            if (!this.isLocalStorageAvailable()) {
                console.warn('⚠️ LocalStorage not available, using in-memory storage');
                this.characters = new Map();
                this.settings = {};
                return;
            }

            // Load existing characters
            this.loadCharacters();

            // Load settings
            this.loadSettings();

            // Setup auto-save if enabled
            if (this.autoSaveEnabled) {
                this.setupAutoSave();
            }

        } catch (error) {
            console.error('❌ Error initializing storage:', error);
            this.characters = new Map();
            this.settings = {};
        }
    }

    /**
     * Check if localStorage is available
     */
    isLocalStorageAvailable() {
        try {
            const test = 'storage_test';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Load all characters from storage
     */
    loadCharacters() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const data = JSON.parse(stored);
                this.characters = new Map(Object.entries(data));
                console.log(`📚 Loaded ${this.characters.size} characters from storage`);
            } else {
                this.characters = new Map();
                console.log('📚 No saved characters found, starting fresh');
            }
        } catch (error) {
            console.error('❌ Error loading characters:', error);
            this.characters = new Map();
        }
    }

    /**
     * Load settings from storage
     */
    loadSettings() {
        try {
            const stored = localStorage.getItem(this.settingsKey);
            if (stored) {
                this.settings = JSON.parse(stored);
            } else {
                this.settings = {
                    autoSave: true,
                    autoSaveInterval: 30000, // 30 seconds
                    maxBackups: 5,
                    exportFormat: 'detailed'
                };
            }
        } catch (error) {
            console.error('❌ Error loading settings:', error);
            this.settings = {};
        }
    }

    /**
     * Save a character
     */
    saveCharacter(character, options = {}) {
        try {
            // Validate character data
            const validationResult = this.validateCharacter(character);
            if (!validationResult.valid) {
                throw new Error(`Character validation failed: ${validationResult.errors.join(', ')}`);
            }

            // Generate unique ID if not provided
            if (!character.characterId) {
                character.characterId = this.generateCharacterId();
            }

            // Add metadata
            const characterData = {
                ...character,
                metadata: {
                    ...character.metadata,
                    lastSaved: new Date().toISOString(),
                    version: '1.0.0',
                    creator: 'RulzLawyer Character Creator',
                    saveCount: (character.metadata?.saveCount || 0) + 1
                }
            };

            // Check storage limits
            if (this.characters.size >= this.maxCharacters && !this.characters.has(character.characterId)) {
                throw new Error(`Maximum character limit (${this.maxCharacters}) reached`);
            }

            // Save to memory
            this.characters.set(character.characterId, characterData);

            // Persist to localStorage
            if (this.isLocalStorageAvailable()) {
                const dataToStore = Object.fromEntries(this.characters);
                localStorage.setItem(this.storageKey, JSON.stringify(dataToStore));
            }

            // Create backup if this is a significant save
            if (options.createBackup || characterData.metadata.saveCount % 5 === 0) {
                this.createBackup(character.characterId);
            }

            console.log(`💾 Character '${character.name}' saved successfully (ID: ${character.characterId})`);

            return {
                success: true,
                characterId: character.characterId,
                message: `Character '${character.name}' saved successfully`
            };

        } catch (error) {
            console.error('❌ Error saving character:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Load a character by ID
     */
    loadCharacter(characterId) {
        try {
            if (!this.characters.has(characterId)) {
                throw new Error(`Character with ID '${characterId}' not found`);
            }

            const character = this.characters.get(characterId);

            // Update last accessed
            character.metadata = {
                ...character.metadata,
                lastAccessed: new Date().toISOString()
            };

            this.characters.set(characterId, character);

            console.log(`📖 Character '${character.name}' loaded successfully`);

            return {
                success: true,
                character: character,
                message: `Character '${character.name}' loaded successfully`
            };

        } catch (error) {
            console.error('❌ Error loading character:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Delete a character
     */
    deleteCharacter(characterId, options = {}) {
        try {
            if (!this.characters.has(characterId)) {
                throw new Error(`Character with ID '${characterId}' not found`);
            }

            const character = this.characters.get(characterId);
            const characterName = character.name;

            // Create backup before deletion if requested
            if (options.createBackup !== false) {
                this.createBackup(characterId);
            }

            // Remove from memory
            this.characters.delete(characterId);

            // Update localStorage
            if (this.isLocalStorageAvailable()) {
                const dataToStore = Object.fromEntries(this.characters);
                localStorage.setItem(this.storageKey, JSON.stringify(dataToStore));
            }

            console.log(`🗑️ Character '${characterName}' deleted successfully`);

            return {
                success: true,
                message: `Character '${characterName}' deleted successfully`
            };

        } catch (error) {
            console.error('❌ Error deleting character:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get all saved characters with optional filtering
     */
    getAllCharacters(filter = {}) {
        try {
            let characters = Array.from(this.characters.values());

            // Apply filters
            if (filter.name) {
                characters = characters.filter(char =>
                    char.name.toLowerCase().includes(filter.name.toLowerCase())
                );
            }

            if (filter.race) {
                characters = characters.filter(char =>
                    char.race.toLowerCase() === filter.race.toLowerCase()
                );
            }

            if (filter.characterClass) {
                characters = characters.filter(char =>
                    char.characterClass.toLowerCase() === filter.characterClass.toLowerCase()
                );
            }

            if (filter.levelMin !== undefined) {
                characters = characters.filter(char => char.level >= filter.levelMin);
            }

            if (filter.levelMax !== undefined) {
                characters = characters.filter(char => char.level <= filter.levelMax);
            }

            // Sort by last saved (most recent first)
            characters.sort((a, b) => {
                const aTime = new Date(a.metadata?.lastSaved || 0);
                const bTime = new Date(b.metadata?.lastSaved || 0);
                return bTime - aTime;
            });

            console.log(`📋 Retrieved ${characters.length} characters (filtered from ${this.characters.size} total)`);

            return {
                success: true,
                characters: characters,
                total: this.characters.size,
                filtered: characters.length
            };

        } catch (error) {
            console.error('❌ Error retrieving characters:', error);
            return {
                success: false,
                error: error.message,
                characters: []
            };
        }
    }

    /**
     * Export character to JSON file
     */
    exportCharacter(characterId, format = 'detailed') {
        try {
            if (!this.characters.has(characterId)) {
                throw new Error(`Character with ID '${characterId}' not found`);
            }

            const character = this.characters.get(characterId);
            let exportData;

            switch (format) {
                case 'minimal':
                    exportData = this.createMinimalExport(character);
                    break;
                case 'detailed':
                    exportData = this.createDetailedExport(character);
                    break;
                case 'complete':
                    exportData = character; // Full character object
                    break;
                default:
                    exportData = this.createDetailedExport(character);
            }

            // Create export metadata
            const exportObject = {
                exportInfo: {
                    exportedAt: new Date().toISOString(),
                    exportFormat: format,
                    exportVersion: '1.0.0',
                    application: 'RulzLawyer Character Creator'
                },
                character: exportData
            };

            // Generate filename
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
            const filename = `${character.name.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.json`;

            // Create download
            const blob = new Blob([JSON.stringify(exportObject, null, 2)], {
                type: 'application/json'
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            console.log(`📤 Character '${character.name}' exported as ${filename}`);

            return {
                success: true,
                filename: filename,
                message: `Character '${character.name}' exported successfully`
            };

        } catch (error) {
            console.error('❌ Error exporting character:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Import character from JSON file
     */
    importCharacter(file) {
        return new Promise((resolve) => {
            try {
                const reader = new FileReader();

                reader.onload = (e) => {
                    try {
                        const jsonData = JSON.parse(e.target.result);

                        // Extract character data
                        let characterData;
                        if (jsonData.character) {
                            // Standard export format
                            characterData = jsonData.character;
                        } else if (jsonData.name && jsonData.characterClass) {
                            // Direct character format
                            characterData = jsonData;
                        } else {
                            throw new Error('Invalid character file format');
                        }

                        // Validate imported character
                        const validationResult = this.validateCharacter(characterData);
                        if (!validationResult.valid) {
                            throw new Error(`Invalid character data: ${validationResult.errors.join(', ')}`);
                        }

                        // Generate new ID to avoid conflicts
                        const originalId = characterData.characterId;
                        characterData.characterId = this.generateCharacterId();

                        // Add import metadata
                        characterData.metadata = {
                            ...characterData.metadata,
                            importedAt: new Date().toISOString(),
                            originalId: originalId,
                            importSource: file.name
                        };

                        // Save the imported character
                        const saveResult = this.saveCharacter(characterData);

                        if (saveResult.success) {
                            console.log(`📥 Character '${characterData.name}' imported successfully from ${file.name}`);
                            resolve({
                                success: true,
                                character: characterData,
                                message: `Character '${characterData.name}' imported successfully`
                            });
                        } else {
                            resolve(saveResult);
                        }

                    } catch (error) {
                        console.error('❌ Error parsing imported file:', error);
                        resolve({
                            success: false,
                            error: `Error parsing file: ${error.message}`
                        });
                    }
                };

                reader.onerror = () => {
                    resolve({
                        success: false,
                        error: 'Error reading file'
                    });
                };

                reader.readAsText(file);

            } catch (error) {
                console.error('❌ Error importing character:', error);
                resolve({
                    success: false,
                    error: error.message
                });
            }
        });
    }

    /**
     * Create backup of character
     */
    createBackup(characterId) {
        try {
            if (!this.characters.has(characterId)) {
                return;
            }

            const character = this.characters.get(characterId);
            const backupKey = `${this.storageKey}_backup_${characterId}`;

            const backupData = {
                character: character,
                backupCreated: new Date().toISOString(),
                version: '1.0.0'
            };

            if (this.isLocalStorageAvailable()) {
                localStorage.setItem(backupKey, JSON.stringify(backupData));
                console.log(`💾 Backup created for character '${character.name}'`);
            }

        } catch (error) {
            console.error('❌ Error creating backup:', error);
        }
    }

    /**
     * Setup auto-save functionality
     */
    setupAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
        }

        const interval = this.settings.autoSaveInterval || 30000;

        this.autoSaveInterval = setInterval(() => {
            this.performAutoSave();
        }, interval);

        console.log(`⏰ Auto-save enabled with ${interval / 1000}s interval`);
    }

    /**
     * Perform auto-save if there's a current character
     */
    performAutoSave() {
        try {
            // This would be called by the character creator when there's an active character
            if (window.currentCharacter && window.currentCharacter.characterId) {
                const result = this.saveCharacter(window.currentCharacter, { silent: true });
                if (result.success) {
                    console.log('💾 Auto-save completed');
                }
            }
        } catch (error) {
            console.error('❌ Auto-save error:', error);
        }
    }

    // ===================
    // UTILITY METHODS
    // ===================

    /**
     * Generate unique character ID
     */
    generateCharacterId() {
        return 'char_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Validate character data
     */
    validateCharacter(character) {
        const errors = [];

        // Required fields
        if (!character.name || character.name.trim() === '') {
            errors.push('Character name is required');
        }

        if (!character.race) {
            errors.push('Character race is required');
        }

        if (!character.characterClass) {
            errors.push('Character class is required');
        }

        if (!character.level || character.level < 1) {
            errors.push('Valid character level is required');
        }

        if (!character.abilities) {
            errors.push('Character abilities are required');
        } else {
            const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
            abilities.forEach(ability => {
                if (character.abilities[ability] === undefined || character.abilities[ability] < 1) {
                    errors.push(`Valid ${ability} score is required`);
                }
            });
        }

        return {
            valid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Create minimal export (basic character info only)
     */
    createMinimalExport(character) {
        return {
            name: character.name,
            race: character.race,
            characterClass: character.characterClass,
            level: character.level,
            abilities: character.abilities,
            characterId: character.characterId
        };
    }

    /**
     * Create detailed export (most character data)
     */
    createDetailedExport(character) {
        const { metadata, ...characterData } = character;
        return characterData;
    }

    /**
     * Clear all storage (with confirmation)
     */
    clearAllData(confirm = false) {
        if (!confirm) {
            console.warn('⚠️ clearAllData requires confirm=true parameter');
            return {
                success: false,
                error: 'Confirmation required'
            };
        }

        try {
            this.characters.clear();

            if (this.isLocalStorageAvailable()) {
                localStorage.removeItem(this.storageKey);
                localStorage.removeItem(this.settingsKey);

                // Clear backups
                const keys = Object.keys(localStorage);
                keys.forEach(key => {
                    if (key.startsWith(this.storageKey + '_backup_')) {
                        localStorage.removeItem(key);
                    }
                });
            }

            console.log('🗑️ All character data cleared');

            return {
                success: true,
                message: 'All character data cleared successfully'
            };

        } catch (error) {
            console.error('❌ Error clearing data:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get storage statistics
     */
    getStorageStats() {
        try {
            const stats = {
                totalCharacters: this.characters.size,
                storageAvailable: this.isLocalStorageAvailable(),
                autoSaveEnabled: this.autoSaveEnabled,
                settings: this.settings
            };

            if (this.isLocalStorageAvailable()) {
                const used = localStorage.getItem(this.storageKey)?.length || 0;
                stats.storageUsed = used;
                stats.storageUsedMB = (used / 1024 / 1024).toFixed(2);
            }

            return stats;

        } catch (error) {
            console.error('❌ Error getting storage stats:', error);
            return null;
        }
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterStorageManager;
} else if (typeof window !== 'undefined') {
    window.CharacterStorageManager = CharacterStorageManager;
}