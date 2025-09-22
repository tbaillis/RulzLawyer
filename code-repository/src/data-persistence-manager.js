/**
 * Enhanced Data Persistence Manager for RulzLawyer D&D 3.5 Game
 * Handles character/campaign storage, backup/restore, export, and offline support
 */

class DataPersistenceManager {
    constructor() {
        this.storageKey = 'dnd35_game_data';
        this.backupKey = 'dnd35_backup_data';
        this.versionKey = 'dnd35_data_version';
        this.currentVersion = '1.0.0';
        this.maxBackups = 5;
        this.compressionEnabled = true;
        
        this.initialize();
    }

    initialize() {
        this.migrateData();
        this.setupAutoBackup();
        console.log('📊 Data Persistence Manager initialized');
    }

    // Core Storage Operations
    saveCharacter(characterData) {
        try {
            const gameData = this.loadGameData();
            const characterId = characterData.id || this.generateId();
            
            characterData.id = characterId;
            characterData.lastModified = new Date().toISOString();
            characterData.version = this.currentVersion;
            
            gameData.characters[characterId] = characterData;
            this.saveGameData(gameData);
            
            console.log('✅ Character saved:', characterData.name);
            return { success: true, id: characterId };
        } catch (error) {
            console.error('❌ Error saving character:', error);
            return { success: false, error: error.message };
        }
    }

    loadCharacter(characterId) {
        try {
            const gameData = this.loadGameData();
            const character = gameData.characters[characterId];
            
            if (character) {
                return { success: true, data: character };
            } else {
                return { success: false, error: 'Character not found' };
            }
        } catch (error) {
            console.error('❌ Error loading character:', error);
            return { success: false, error: error.message };
        }
    }

    deleteCharacter(characterId) {
        try {
            const gameData = this.loadGameData();
            
            if (gameData.characters[characterId]) {
                delete gameData.characters[characterId];
                this.saveGameData(gameData);
                return { success: true };
            } else {
                return { success: false, error: 'Character not found' };
            }
        } catch (error) {
            console.error('❌ Error deleting character:', error);
            return { success: false, error: error.message };
        }
    }

    // Campaign Management
    saveCampaign(campaignData) {
        try {
            const gameData = this.loadGameData();
            const campaignId = campaignData.id || this.generateId();
            
            campaignData.id = campaignId;
            campaignData.lastModified = new Date().toISOString();
            campaignData.version = this.currentVersion;
            
            gameData.campaigns[campaignId] = campaignData;
            this.saveGameData(gameData);
            
            console.log('✅ Campaign saved:', campaignData.name);
            return { success: true, id: campaignId };
        } catch (error) {
            console.error('❌ Error saving campaign:', error);
            return { success: false, error: error.message };
        }
    }

    loadCampaign(campaignId) {
        try {
            const gameData = this.loadGameData();
            const campaign = gameData.campaigns[campaignId];
            
            if (campaign) {
                return { success: true, data: campaign };
            } else {
                return { success: false, error: 'Campaign not found' };
            }
        } catch (error) {
            console.error('❌ Error loading campaign:', error);
            return { success: false, error: error.message };
        }
    }

    // Backup and Restore
    createBackup() {
        try {
            const gameData = this.loadGameData();
            const backup = {
                timestamp: new Date().toISOString(),
                version: this.currentVersion,
                data: gameData
            };

            const existingBackups = this.loadBackups();
            existingBackups.unshift(backup);
            
            // Limit number of backups
            if (existingBackups.length > this.maxBackups) {
                existingBackups.splice(this.maxBackups);
            }
            
            localStorage.setItem(this.backupKey, JSON.stringify(existingBackups));
            console.log('💾 Backup created successfully');
            
            return { success: true, timestamp: backup.timestamp };
        } catch (error) {
            console.error('❌ Error creating backup:', error);
            return { success: false, error: error.message };
        }
    }

    restoreFromBackup(timestamp) {
        try {
            const backups = this.loadBackups();
            const backup = backups.find(b => b.timestamp === timestamp);
            
            if (!backup) {
                return { success: false, error: 'Backup not found' };
            }
            
            this.saveGameData(backup.data);
            console.log('🔄 Data restored from backup:', timestamp);
            
            return { success: true };
        } catch (error) {
            console.error('❌ Error restoring backup:', error);
            return { success: false, error: error.message };
        }
    }

    listBackups() {
        try {
            const backups = this.loadBackups();
            return {
                success: true,
                backups: backups.map(b => ({
                    timestamp: b.timestamp,
                    version: b.version,
                    characterCount: Object.keys(b.data.characters || {}).length,
                    campaignCount: Object.keys(b.data.campaigns || {}).length
                }))
            };
        } catch (error) {
            console.error('❌ Error listing backups:', error);
            return { success: false, error: error.message };
        }
    }

    // Import/Export Functionality
    exportData(format = 'json') {
        try {
            const gameData = this.loadGameData();
            const exportData = {
                metadata: {
                    exportDate: new Date().toISOString(),
                    version: this.currentVersion,
                    source: 'RulzLawyer D&D 3.5'
                },
                data: gameData
            };

            switch (format.toLowerCase()) {
                case 'json':
                    return {
                        success: true,
                        data: JSON.stringify(exportData, null, 2),
                        filename: `rulzlawyer_export_${new Date().toISOString().split('T')[0]}.json`
                    };
                case 'compressed':
                    const compressed = this.compressData(exportData);
                    return {
                        success: true,
                        data: compressed,
                        filename: `rulzlawyer_export_${new Date().toISOString().split('T')[0]}.rlz`
                    };
                default:
                    return { success: false, error: 'Unsupported export format' };
            }
        } catch (error) {
            console.error('❌ Error exporting data:', error);
            return { success: false, error: error.message };
        }
    }

    importData(dataString, format = 'json') {
        try {
            let importData;
            
            switch (format.toLowerCase()) {
                case 'json':
                    importData = JSON.parse(dataString);
                    break;
                case 'compressed':
                    importData = this.decompressData(dataString);
                    break;
                default:
                    return { success: false, error: 'Unsupported import format' };
            }

            if (!importData.data || !importData.metadata) {
                return { success: false, error: 'Invalid import file format' };
            }

            // Create backup before importing
            this.createBackup();
            
            // Import data
            this.saveGameData(importData.data);
            
            console.log('📥 Data imported successfully from:', importData.metadata.exportDate);
            return {
                success: true,
                imported: {
                    characters: Object.keys(importData.data.characters || {}).length,
                    campaigns: Object.keys(importData.data.campaigns || {}).length
                }
            };
        } catch (error) {
            console.error('❌ Error importing data:', error);
            return { success: false, error: error.message };
        }
    }

    // Data Validation
    validateCharacterData(characterData) {
        const errors = [];
        
        if (!characterData.name || typeof characterData.name !== 'string') {
            errors.push('Character name is required and must be a string');
        }
        
        if (!characterData.race || typeof characterData.race !== 'string') {
            errors.push('Character race is required');
        }
        
        if (!characterData.characterClass || typeof characterData.characterClass !== 'string') {
            errors.push('Character class is required');
        }
        
        if (!characterData.abilityScores || typeof characterData.abilityScores !== 'object') {
            errors.push('Ability scores are required');
        } else {
            const requiredAbilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
            for (const ability of requiredAbilities) {
                if (!characterData.abilityScores[ability] || isNaN(characterData.abilityScores[ability])) {
                    errors.push(`${ability} score is required and must be a number`);
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // Utility Methods
    loadGameData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (data) {
                return JSON.parse(data);
            } else {
                return this.getDefaultGameData();
            }
        } catch (error) {
            console.warn('⚠️ Error loading game data, using defaults');
            return this.getDefaultGameData();
        }
    }

    saveGameData(gameData) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(gameData));
            localStorage.setItem(this.versionKey, this.currentVersion);
        } catch (error) {
            throw new Error('Failed to save game data: ' + error.message);
        }
    }

    loadBackups() {
        try {
            const backups = localStorage.getItem(this.backupKey);
            return backups ? JSON.parse(backups) : [];
        } catch (error) {
            console.warn('⚠️ Error loading backups');
            return [];
        }
    }

    getDefaultGameData() {
        return {
            characters: {},
            campaigns: {},
            settings: {
                autoBackup: true,
                backupInterval: 300000, // 5 minutes
                compression: true
            },
            metadata: {
                version: this.currentVersion,
                created: new Date().toISOString()
            }
        };
    }

    generateId() {
        return 'rlz_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
    }

    compressData(data) {
        // Simple compression using JSON.stringify with reduced whitespace
        return btoa(JSON.stringify(data));
    }

    decompressData(compressedData) {
        return JSON.parse(atob(compressedData));
    }

    migrateData() {
        const currentVersion = localStorage.getItem(this.versionKey);
        if (currentVersion !== this.currentVersion) {
            console.log('🔄 Migrating data to version:', this.currentVersion);
            // Add migration logic here as needed
            localStorage.setItem(this.versionKey, this.currentVersion);
        }
    }

    setupAutoBackup() {
        const gameData = this.loadGameData();
        if (gameData.settings.autoBackup) {
            setInterval(() => {
                this.createBackup();
            }, gameData.settings.backupInterval);
            console.log('🔄 Auto-backup enabled');
        }
    }

    // Statistics and Analytics
    getStorageStats() {
        try {
            const gameData = this.loadGameData();
            const backups = this.loadBackups();
            
            return {
                characters: Object.keys(gameData.characters || {}).length,
                campaigns: Object.keys(gameData.campaigns || {}).length,
                backups: backups.length,
                storageUsed: this.calculateStorageSize(),
                lastBackup: backups.length > 0 ? backups[0].timestamp : null
            };
        } catch (error) {
            console.error('❌ Error getting storage stats:', error);
            return null;
        }
    }

    calculateStorageSize() {
        try {
            const gameData = JSON.stringify(this.loadGameData());
            return Math.round((gameData.length * 2) / 1024) + ' KB'; // Approximate size in KB
        } catch (error) {
            return 'Unknown';
        }
    }

    clearAllData() {
        try {
            this.createBackup(); // Create final backup
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem(this.versionKey);
            console.log('🗑️ All game data cleared');
            return { success: true };
        } catch (error) {
            console.error('❌ Error clearing data:', error);
            return { success: false, error: error.message };
        }
    }
}

// Browser/Node.js compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataPersistenceManager;
} else if (typeof window !== 'undefined') {
    window.DataPersistenceManager = DataPersistenceManager;
}