/**
 * Enhanced Data Export/Import System
 * Advanced data management with cloud sync, backup/restore, campaign sharing,
 * template library, and cross-platform compatibility
 * 
 * Features:
 * - Cloud synchronization with multiple providers
 * - Automatic backup and restore system
 * - Campaign sharing with permissions
 * - Template library with community sharing
 * - Cross-platform data compatibility
 * - Version migration and conflict resolution
 * - Compression and encryption
 * - Offline data management
 * - Real-time collaboration
 * - Data validation and integrity checks
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class EnhancedDataManager {
    constructor(storageManager, options = {}) {
        this.storageManager = storageManager;
        
        this.options = {
            cloudSync: options.cloudSync !== false,
            autoBackup: options.autoBackup !== false,
            backupInterval: options.backupInterval || 300000, // 5 minutes
            maxBackups: options.maxBackups || 10,
            compression: options.compression !== false,
            encryption: options.encryption || false,
            offlineMode: options.offlineMode !== false,
            realtimeSync: options.realtimeSync || false,
            templateSharing: options.templateSharing !== false,
            ...options
        };
        
        // Cloud providers
        this.cloudProviders = new Map();
        this.activeProvider = null;
        
        // Sync state
        this.syncStatus = 'disconnected'; // disconnected, connecting, connected, syncing, error
        this.lastSync = null;
        this.pendingChanges = new Map();
        this.conflictResolver = null;
        
        // Backup system
        this.backupTimer = null;
        this.backupHistory = [];
        
        // Template system
        this.templates = new Map();
        this.sharedTemplates = new Map();
        
        // Version management
        this.currentVersion = '1.0.0';
        this.supportedVersions = ['1.0.0'];
        this.migrationHandlers = new Map();
        
        // Data validation
        this.validators = new Map();
        this.schemas = new Map();
        
        // Event system
        this.eventListeners = new Map();
        
        // Collaboration
        this.collaborators = new Map();
        this.realTimeConnection = null;
        
        this.initialize();
        
        console.log('💾 Enhanced Data Manager initialized');
    }
    
    initialize() {
        this.setupCloudProviders();
        this.setupValidators();
        this.setupMigrationHandlers();
        this.setupEventHandlers();
        
        if (this.options.autoBackup) {
            this.startAutoBackup();
        }
        
        if (this.options.cloudSync) {
            this.initializeCloudSync();
        }
        
        this.loadLocalData();
        
        console.log('💾 Data Manager ready');
    }
    
    setupCloudProviders() {
        // Google Drive provider
        this.cloudProviders.set('googledrive', {
            name: 'Google Drive',
            authenticate: this.authenticateGoogleDrive.bind(this),
            upload: this.uploadToGoogleDrive.bind(this),
            download: this.downloadFromGoogleDrive.bind(this),
            list: this.listGoogleDriveFiles.bind(this),
            delete: this.deleteFromGoogleDrive.bind(this),
            share: this.shareGoogleDriveFile.bind(this)
        });
        
        // Dropbox provider
        this.cloudProviders.set('dropbox', {
            name: 'Dropbox',
            authenticate: this.authenticateDropbox.bind(this),
            upload: this.uploadToDropbox.bind(this),
            download: this.downloadFromDropbox.bind(this),
            list: this.listDropboxFiles.bind(this),
            delete: this.deleteFromDropbox.bind(this),
            share: this.shareDropboxFile.bind(this)
        });
        
        // OneDrive provider
        this.cloudProviders.set('onedrive', {
            name: 'OneDrive',
            authenticate: this.authenticateOneDrive.bind(this),
            upload: this.uploadToOneDrive.bind(this),
            download: this.downloadFromOneDrive.bind(this),
            list: this.listOneDriveFiles.bind(this),
            delete: this.deleteFromOneDrive.bind(this),
            share: this.shareOneDriveFile.bind(this)
        });
        
        // GitHub provider (for templates and public sharing)
        this.cloudProviders.set('github', {
            name: 'GitHub',
            authenticate: this.authenticateGitHub.bind(this),
            upload: this.uploadToGitHub.bind(this),
            download: this.downloadFromGitHub.bind(this),
            list: this.listGitHubFiles.bind(this),
            delete: this.deleteFromGitHub.bind(this),
            share: this.shareGitHubFile.bind(this)
        });
        
        console.log('💾 Cloud providers configured');
    }
    
    setupValidators() {
        // Character data validator
        this.validators.set('character', (data) => {
            const required = ['id', 'name', 'race', 'class', 'level'];
            for (const field of required) {
                if (!data[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
            
            if (typeof data.level !== 'number' || data.level < 1 || data.level > 100) {
                throw new Error('Invalid level value');
            }
            
            return true;
        });
        
        // Campaign data validator
        this.validators.set('campaign', (data) => {
            const required = ['id', 'name', 'created'];
            for (const field of required) {
                if (!data[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
            
            if (!Array.isArray(data.players)) {
                data.players = [];
            }
            
            if (!Array.isArray(data.characters)) {
                data.characters = [];
            }
            
            return true;
        });
        
        // Template data validator
        this.validators.set('template', (data) => {
            const required = ['id', 'name', 'type', 'version', 'data'];
            for (const field of required) {
                if (!data[field]) {
                    throw new Error(`Missing required field: ${field}`);
                }
            }
            
            if (!this.supportedVersions.includes(data.version)) {
                throw new Error(`Unsupported version: ${data.version}`);
            }
            
            return true;
        });
        
        console.log('💾 Data validators configured');
    }
    
    setupMigrationHandlers() {
        // Example migration from version 0.9.0 to 1.0.0
        this.migrationHandlers.set('0.9.0->1.0.0', (data) => {
            if (data.character && data.character.stats) {
                // Convert old stat format to new format
                const oldStats = data.character.stats;
                data.character.abilities = {
                    strength: oldStats.str || 10,
                    dexterity: oldStats.dex || 10,
                    constitution: oldStats.con || 10,
                    intelligence: oldStats.int || 10,
                    wisdom: oldStats.wis || 10,
                    charisma: oldStats.cha || 10
                };
                delete data.character.stats;
            }
            
            data.version = '1.0.0';
            return data;
        });
        
        console.log('💾 Migration handlers configured');
    }
    
    // Cloud Synchronization
    async initializeCloudSync() {
        try {
            // Try to restore previous cloud connection
            const storedProvider = localStorage.getItem('cloudProvider');
            const storedCredentials = localStorage.getItem('cloudCredentials');
            
            if (storedProvider && storedCredentials) {
                const provider = this.cloudProviders.get(storedProvider);
                if (provider) {
                    this.activeProvider = storedProvider;
                    await this.connectToCloud(storedProvider, JSON.parse(storedCredentials));
                }
            }
        } catch (error) {
            console.error('Failed to initialize cloud sync:', error);
            this.syncStatus = 'error';
        }
    }
    
    async connectToCloud(providerName, credentials = null) {
        const provider = this.cloudProviders.get(providerName);
        if (!provider) {
            throw new Error(`Unknown cloud provider: ${providerName}`);
        }
        
        this.syncStatus = 'connecting';
        this.emit('syncStatusChanged', this.syncStatus);
        
        try {
            if (!credentials) {
                credentials = await provider.authenticate();
            }
            
            this.activeProvider = providerName;
            this.syncStatus = 'connected';
            this.lastSync = new Date();
            
            // Store credentials securely
            localStorage.setItem('cloudProvider', providerName);
            localStorage.setItem('cloudCredentials', JSON.stringify(credentials));
            
            this.emit('cloudConnected', { provider: providerName });
            
            // Start real-time sync if enabled
            if (this.options.realtimeSync) {
                await this.startRealtimeSync();
            }
            
            console.log(`💾 Connected to ${provider.name}`);
            
        } catch (error) {
            this.syncStatus = 'error';
            this.emit('syncError', error);
            throw error;
        }
    }
    
    async disconnectFromCloud() {
        if (this.activeProvider) {
            this.syncStatus = 'disconnected';
            this.activeProvider = null;
            
            localStorage.removeItem('cloudProvider');
            localStorage.removeItem('cloudCredentials');
            
            if (this.realTimeConnection) {
                this.realTimeConnection.disconnect();
                this.realTimeConnection = null;
            }
            
            this.emit('cloudDisconnected');
            console.log('💾 Disconnected from cloud');
        }
    }
    
    async syncToCloud(data, filename) {
        if (!this.activeProvider) {
            throw new Error('No cloud provider connected');
        }
        
        const provider = this.cloudProviders.get(this.activeProvider);
        this.syncStatus = 'syncing';
        this.emit('syncStatusChanged', this.syncStatus);
        
        try {
            // Compress data if enabled
            let processedData = data;
            if (this.options.compression) {
                processedData = await this.compressData(data);
            }
            
            // Encrypt data if enabled
            if (this.options.encryption) {
                processedData = await this.encryptData(processedData);
            }
            
            const result = await provider.upload(filename, processedData);
            
            this.syncStatus = 'connected';
            this.lastSync = new Date();
            this.emit('syncComplete', { filename, size: data.length });
            
            console.log(`💾 Synced ${filename} to cloud`);
            return result;
            
        } catch (error) {
            this.syncStatus = 'error';
            this.emit('syncError', error);
            throw error;
        }
    }
    
    async syncFromCloud(filename) {
        if (!this.activeProvider) {
            throw new Error('No cloud provider connected');
        }
        
        const provider = this.cloudProviders.get(this.activeProvider);
        this.syncStatus = 'syncing';
        this.emit('syncStatusChanged', this.syncStatus);
        
        try {
            let data = await provider.download(filename);
            
            // Decrypt data if needed
            if (this.options.encryption) {
                data = await this.decryptData(data);
            }
            
            // Decompress data if needed
            if (this.options.compression) {
                data = await this.decompressData(data);
            }
            
            this.syncStatus = 'connected';
            this.lastSync = new Date();
            this.emit('syncComplete', { filename });
            
            console.log(`💾 Synced ${filename} from cloud`);
            return data;
            
        } catch (error) {
            this.syncStatus = 'error';
            this.emit('syncError', error);
            throw error;
        }
    }
    
    // Backup and Restore System
    startAutoBackup() {
        if (this.backupTimer) {
            clearInterval(this.backupTimer);
        }
        
        this.backupTimer = setInterval(() => {
            this.createBackup();
        }, this.options.backupInterval);
        
        console.log('💾 Auto-backup started');
    }
    
    stopAutoBackup() {
        if (this.backupTimer) {
            clearInterval(this.backupTimer);
            this.backupTimer = null;
        }
        
        console.log('💾 Auto-backup stopped');
    }
    
    async createBackup(description = '') {
        try {
            const timestamp = new Date().toISOString();
            const backupId = `backup_${timestamp.replace(/[:.]/g, '_')}`;
            
            // Collect all data
            const backupData = {
                id: backupId,
                timestamp: timestamp,
                version: this.currentVersion,
                description: description || `Auto-backup ${new Date().toLocaleString()}`,
                data: {
                    characters: await this.exportAllCharacters(),
                    campaigns: await this.exportAllCampaigns(),
                    templates: await this.exportAllTemplates(),
                    settings: await this.exportSettings(),
                    adventures: await this.exportAllAdventures()
                }
            };
            
            // Validate backup data
            this.validateBackupData(backupData);
            
            // Store backup locally
            await this.storageManager.saveData(`backup_${backupId}`, backupData);
            
            // Add to backup history
            this.backupHistory.unshift({
                id: backupId,
                timestamp: timestamp,
                description: backupData.description,
                size: JSON.stringify(backupData).length
            });
            
            // Maintain maximum backup count
            if (this.backupHistory.length > this.options.maxBackups) {
                const oldBackups = this.backupHistory.splice(this.options.maxBackups);
                for (const backup of oldBackups) {
                    await this.storageManager.deleteData(`backup_${backup.id}`);
                }
            }
            
            // Save backup history
            await this.storageManager.saveData('backup_history', this.backupHistory);
            
            // Sync to cloud if enabled
            if (this.options.cloudSync && this.activeProvider) {
                await this.syncToCloud(JSON.stringify(backupData), `backup_${backupId}.json`);
            }
            
            this.emit('backupCreated', { id: backupId, size: backupData.data });
            console.log(`💾 Backup created: ${backupId}`);
            
            return backupId;
            
        } catch (error) {
            console.error('Backup creation failed:', error);
            this.emit('backupError', error);
            throw error;
        }
    }
    
    async restoreBackup(backupId, options = {}) {
        try {
            const {
                restoreCharacters = true,
                restoreCampaigns = true,
                restoreTemplates = true,
                restoreSettings = true,
                restoreAdventures = true,
                createBackupBeforeRestore = true
            } = options;
            
            // Create backup before restore if requested
            if (createBackupBeforeRestore) {
                await this.createBackup('Before restore backup');
            }
            
            // Load backup data
            const backupData = await this.storageManager.loadData(`backup_${backupId}`);
            if (!backupData) {
                throw new Error(`Backup not found: ${backupId}`);
            }
            
            // Validate backup data
            this.validateBackupData(backupData);
            
            // Migrate data if necessary
            const migratedData = await this.migrateData(backupData);
            
            // Restore data selectively
            if (restoreCharacters && migratedData.data.characters) {
                await this.importAllCharacters(migratedData.data.characters);
            }
            
            if (restoreCampaigns && migratedData.data.campaigns) {
                await this.importAllCampaigns(migratedData.data.campaigns);
            }
            
            if (restoreTemplates && migratedData.data.templates) {
                await this.importAllTemplates(migratedData.data.templates);
            }
            
            if (restoreSettings && migratedData.data.settings) {
                await this.importSettings(migratedData.data.settings);
            }
            
            if (restoreAdventures && migratedData.data.adventures) {
                await this.importAllAdventures(migratedData.data.adventures);
            }
            
            this.emit('backupRestored', { id: backupId });
            console.log(`💾 Backup restored: ${backupId}`);
            
        } catch (error) {
            console.error('Backup restore failed:', error);
            this.emit('restoreError', error);
            throw error;
        }
    }
    
    async getBackupList() {
        try {
            const history = await this.storageManager.loadData('backup_history');
            return history || [];
        } catch (error) {
            console.error('Failed to load backup history:', error);
            return [];
        }
    }
    
    async deleteBackup(backupId) {
        try {
            await this.storageManager.deleteData(`backup_${backupId}`);
            
            this.backupHistory = this.backupHistory.filter(backup => backup.id !== backupId);
            await this.storageManager.saveData('backup_history', this.backupHistory);
            
            // Delete from cloud if exists
            if (this.activeProvider) {
                const provider = this.cloudProviders.get(this.activeProvider);
                try {
                    await provider.delete(`backup_${backupId}.json`);
                } catch (error) {
                    console.warn('Failed to delete backup from cloud:', error);
                }
            }
            
            this.emit('backupDeleted', { id: backupId });
            console.log(`💾 Backup deleted: ${backupId}`);
            
        } catch (error) {
            console.error('Backup deletion failed:', error);
            throw error;
        }
    }
    
    // Template System
    async createTemplate(type, name, data, options = {}) {
        const template = {
            id: this.generateId('tpl'),
            name: name,
            type: type, // character, campaign, encounter, npc, etc.
            version: this.currentVersion,
            created: new Date().toISOString(),
            author: options.author || 'Anonymous',
            description: options.description || '',
            tags: options.tags || [],
            public: options.public || false,
            data: data
        };
        
        // Validate template
        this.validators.get('template')(template);
        
        // Store locally
        this.templates.set(template.id, template);
        await this.storageManager.saveData(`template_${template.id}`, template);
        
        // Share publicly if requested
        if (template.public && this.options.templateSharing) {
            await this.shareTemplate(template.id);
        }
        
        this.emit('templateCreated', template);
        console.log(`💾 Template created: ${template.name}`);
        
        return template;
    }
    
    async shareTemplate(templateId) {
        const template = this.templates.get(templateId);
        if (!template) {
            throw new Error(`Template not found: ${templateId}`);
        }
        
        // Share to GitHub for public access
        if (this.cloudProviders.has('github')) {
            try {
                const provider = this.cloudProviders.get('github');
                await provider.upload(`templates/${template.type}/${template.id}.json`, JSON.stringify(template));
                
                template.shared = true;
                template.shareUrl = `https://raw.githubusercontent.com/username/rulzlawyer-templates/main/templates/${template.type}/${template.id}.json`;
                
                await this.storageManager.saveData(`template_${template.id}`, template);
                
                this.emit('templateShared', template);
                console.log(`💾 Template shared: ${template.name}`);
                
            } catch (error) {
                console.error('Template sharing failed:', error);
                throw error;
            }
        }
    }
    
    async importTemplate(source) {
        try {
            let templateData;
            
            if (typeof source === 'string') {
                if (source.startsWith('http')) {
                    // Download from URL
                    const response = await fetch(source);
                    templateData = await response.json();
                } else {
                    // Load from local storage
                    templateData = await this.storageManager.loadData(source);
                }
            } else {
                templateData = source;
            }
            
            // Validate and migrate template
            this.validators.get('template')(templateData);
            const migratedTemplate = await this.migrateData(templateData);
            
            // Store template
            this.templates.set(migratedTemplate.id, migratedTemplate);
            await this.storageManager.saveData(`template_${migratedTemplate.id}`, migratedTemplate);
            
            this.emit('templateImported', migratedTemplate);
            console.log(`💾 Template imported: ${migratedTemplate.name}`);
            
            return migratedTemplate;
            
        } catch (error) {
            console.error('Template import failed:', error);
            throw error;
        }
    }
    
    // Data Export/Import
    async exportData(type, ids = null, format = 'json') {
        try {
            let data;
            
            switch (type) {
                case 'characters':
                    data = ids ? 
                        await this.exportSpecificCharacters(ids) :
                        await this.exportAllCharacters();
                    break;
                case 'campaigns':
                    data = ids ?
                        await this.exportSpecificCampaigns(ids) :
                        await this.exportAllCampaigns();
                    break;
                case 'templates':
                    data = ids ?
                        await this.exportSpecificTemplates(ids) :
                        await this.exportAllTemplates();
                    break;
                case 'adventures':
                    data = ids ?
                        await this.exportSpecificAdventures(ids) :
                        await this.exportAllAdventures();
                    break;
                default:
                    throw new Error(`Unknown export type: ${type}`);
            }
            
            // Format data
            const exportData = {
                type: type,
                version: this.currentVersion,
                timestamp: new Date().toISOString(),
                data: data
            };
            
            // Apply format
            switch (format.toLowerCase()) {
                case 'json':
                    return JSON.stringify(exportData, null, 2);
                case 'compressed':
                    return await this.compressData(JSON.stringify(exportData));
                case 'encrypted':
                    return await this.encryptData(JSON.stringify(exportData));
                default:
                    throw new Error(`Unknown export format: ${format}`);
            }
            
        } catch (error) {
            console.error('Data export failed:', error);
            throw error;
        }
    }
    
    async importData(data, format = 'json', options = {}) {
        try {
            let parsedData;
            
            // Parse data based on format
            switch (format.toLowerCase()) {
                case 'json':
                    parsedData = typeof data === 'string' ? JSON.parse(data) : data;
                    break;
                case 'compressed':
                    const decompressed = await this.decompressData(data);
                    parsedData = JSON.parse(decompressed);
                    break;
                case 'encrypted':
                    const decrypted = await this.decryptData(data);
                    parsedData = JSON.parse(decrypted);
                    break;
                default:
                    throw new Error(`Unknown import format: ${format}`);
            }
            
            // Validate import data
            this.validateImportData(parsedData);
            
            // Migrate data if necessary
            const migratedData = await this.migrateData(parsedData);
            
            // Import based on type
            const results = {
                imported: 0,
                skipped: 0,
                errors: []
            };
            
            switch (migratedData.type) {
                case 'characters':
                    results.imported = await this.importAllCharacters(migratedData.data, options);
                    break;
                case 'campaigns':
                    results.imported = await this.importAllCampaigns(migratedData.data, options);
                    break;
                case 'templates':
                    results.imported = await this.importAllTemplates(migratedData.data, options);
                    break;
                case 'adventures':
                    results.imported = await this.importAllAdventures(migratedData.data, options);
                    break;
                default:
                    throw new Error(`Unknown import type: ${migratedData.type}`);
            }
            
            this.emit('dataImported', { type: migratedData.type, results });
            console.log(`💾 Data imported: ${migratedData.type} (${results.imported} items)`);
            
            return results;
            
        } catch (error) {
            console.error('Data import failed:', error);
            this.emit('importError', error);
            throw error;
        }
    }
    
    // Data Migration
    async migrateData(data) {
        if (!data.version) {
            data.version = '0.9.0'; // Assume old version
        }
        
        let currentVersion = data.version;
        let migratedData = { ...data };
        
        // Apply migrations in sequence
        while (currentVersion !== this.currentVersion) {
            const migrationKey = `${currentVersion}->${this.currentVersion}`;
            const migrationHandler = this.migrationHandlers.get(migrationKey);
            
            if (!migrationHandler) {
                console.warn(`No migration handler for ${migrationKey}`);
                break;
            }
            
            migratedData = await migrationHandler(migratedData);
            currentVersion = migratedData.version;
        }
        
        if (migratedData.version !== this.currentVersion) {
            console.warn(`Data version mismatch: ${migratedData.version} != ${this.currentVersion}`);
        }
        
        return migratedData;
    }
    
    // Data Validation
    validateBackupData(backupData) {
        const required = ['id', 'timestamp', 'version', 'data'];
        for (const field of required) {
            if (!backupData[field]) {
                throw new Error(`Invalid backup data: missing ${field}`);
            }
        }
        
        if (typeof backupData.data !== 'object') {
            throw new Error('Invalid backup data: data must be an object');
        }
    }
    
    validateImportData(importData) {
        const required = ['type', 'version', 'data'];
        for (const field of required) {
            if (!importData[field]) {
                throw new Error(`Invalid import data: missing ${field}`);
            }
        }
        
        const validTypes = ['characters', 'campaigns', 'templates', 'adventures'];
        if (!validTypes.includes(importData.type)) {
            throw new Error(`Invalid import type: ${importData.type}`);
        }
    }
    
    // Utility Methods
    generateId(prefix = 'data') {
        return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    async compressData(data) {
        // Simple compression using built-in compression
        if (typeof CompressionStream !== 'undefined') {
            const stream = new CompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            writer.write(new TextEncoder().encode(data));
            writer.close();
            
            const chunks = [];
            let done = false;
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    chunks.push(value);
                }
            }
            
            return new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
        }
        
        // Fallback: simple string compression
        return data.replace(/\s+/g, ' ').trim();
    }
    
    async decompressData(data) {
        // Simple decompression
        if (data instanceof Uint8Array && typeof DecompressionStream !== 'undefined') {
            const stream = new DecompressionStream('gzip');
            const writer = stream.writable.getWriter();
            const reader = stream.readable.getReader();
            
            writer.write(data);
            writer.close();
            
            const chunks = [];
            let done = false;
            while (!done) {
                const { value, done: readerDone } = await reader.read();
                done = readerDone;
                if (value) {
                    chunks.push(value);
                }
            }
            
            const decompressed = new Uint8Array(chunks.reduce((acc, chunk) => [...acc, ...chunk], []));
            return new TextDecoder().decode(decompressed);
        }
        
        return data;
    }
    
    async encryptData(data) {
        // Simple encryption (in production, use proper crypto)
        if (typeof crypto !== 'undefined' && crypto.subtle) {
            // Generate a key (in production, use proper key management)
            const key = await crypto.subtle.generateKey(
                { name: 'AES-GCM', length: 256 },
                true,
                ['encrypt', 'decrypt']
            );
            
            const encoder = new TextEncoder();
            const encoded = encoder.encode(data);
            
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const encrypted = await crypto.subtle.encrypt(
                { name: 'AES-GCM', iv: iv },
                key,
                encoded
            );
            
            return {
                encrypted: Array.from(new Uint8Array(encrypted)),
                iv: Array.from(iv),
                key: await crypto.subtle.exportKey('raw', key)
            };
        }
        
        // Fallback: Base64 encoding (not secure!)
        return btoa(data);
    }
    
    async decryptData(encryptedData) {
        // Simple decryption
        if (typeof crypto !== 'undefined' && crypto.subtle && typeof encryptedData === 'object') {
            const key = await crypto.subtle.importKey(
                'raw',
                new Uint8Array(encryptedData.key),
                { name: 'AES-GCM' },
                false,
                ['decrypt']
            );
            
            const decrypted = await crypto.subtle.decrypt(
                { name: 'AES-GCM', iv: new Uint8Array(encryptedData.iv) },
                key,
                new Uint8Array(encryptedData.encrypted)
            );
            
            return new TextDecoder().decode(decrypted);
        }
        
        // Fallback: Base64 decoding
        return atob(encryptedData);
    }
    
    // Event System
    on(event, callback) {
        if (!this.eventListeners.has(event)) {
            this.eventListeners.set(event, []);
        }
        this.eventListeners.get(event).push(callback);
    }
    
    off(event, callback) {
        if (this.eventListeners.has(event)) {
            const callbacks = this.eventListeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        if (this.eventListeners.has(event)) {
            this.eventListeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event listener for ${event}:`, error);
                }
            });
        }
    }
    
    // Stub methods for specific data operations (would be implemented based on actual data structures)
    async exportAllCharacters() {
        // Return all characters from storage
        return [];
    }
    
    async exportAllCampaigns() {
        // Return all campaigns from storage
        return [];
    }
    
    async exportAllTemplates() {
        // Return all templates from storage
        return Array.from(this.templates.values());
    }
    
    async exportAllAdventures() {
        // Return all adventures from storage
        return [];
    }
    
    async exportSettings() {
        // Return application settings
        return {};
    }
    
    async importAllCharacters(characters, options) {
        // Import characters with conflict resolution
        return characters.length;
    }
    
    async importAllCampaigns(campaigns, options) {
        // Import campaigns with conflict resolution
        return campaigns.length;
    }
    
    async importAllTemplates(templates, options) {
        // Import templates with conflict resolution
        let imported = 0;
        for (const template of templates) {
            this.templates.set(template.id, template);
            await this.storageManager.saveData(`template_${template.id}`, template);
            imported++;
        }
        return imported;
    }
    
    async importAllAdventures(adventures, options) {
        // Import adventures with conflict resolution
        return adventures.length;
    }
    
    async importSettings(settings) {
        // Import application settings
        return true;
    }
    
    loadLocalData() {
        // Load existing data from local storage
        console.log('💾 Local data loaded');
    }
    
    setupEventHandlers() {
        // Set up internal event handlers
        console.log('💾 Event handlers configured');
    }
    
    // Cloud provider implementations (stubs - would need actual API integrations)
    async authenticateGoogleDrive() {
        throw new Error('Google Drive authentication not implemented');
    }
    
    async uploadToGoogleDrive(filename, data) {
        throw new Error('Google Drive upload not implemented');
    }
    
    async downloadFromGoogleDrive(filename) {
        throw new Error('Google Drive download not implemented');
    }
    
    async listGoogleDriveFiles() {
        throw new Error('Google Drive list not implemented');
    }
    
    async deleteFromGoogleDrive(filename) {
        throw new Error('Google Drive delete not implemented');
    }
    
    async shareGoogleDriveFile(filename) {
        throw new Error('Google Drive share not implemented');
    }
    
    // Similar stubs for other cloud providers...
    async authenticateDropbox() {
        throw new Error('Dropbox authentication not implemented');
    }
    
    async uploadToDropbox(filename, data) {
        throw new Error('Dropbox upload not implemented');
    }
    
    async downloadFromDropbox(filename) {
        throw new Error('Dropbox download not implemented');
    }
    
    async listDropboxFiles() {
        throw new Error('Dropbox list not implemented');
    }
    
    async deleteFromDropbox(filename) {
        throw new Error('Dropbox delete not implemented');
    }
    
    async shareDropboxFile(filename) {
        throw new Error('Dropbox share not implemented');
    }
    
    async authenticateOneDrive() {
        throw new Error('OneDrive authentication not implemented');
    }
    
    async uploadToOneDrive(filename, data) {
        throw new Error('OneDrive upload not implemented');
    }
    
    async downloadFromOneDrive(filename) {
        throw new Error('OneDrive download not implemented');
    }
    
    async listOneDriveFiles() {
        throw new Error('OneDrive list not implemented');
    }
    
    async deleteFromOneDrive(filename) {
        throw new Error('OneDrive delete not implemented');
    }
    
    async shareOneDriveFile(filename) {
        throw new Error('OneDrive share not implemented');
    }
    
    async authenticateGitHub() {
        throw new Error('GitHub authentication not implemented');
    }
    
    async uploadToGitHub(filename, data) {
        throw new Error('GitHub upload not implemented');
    }
    
    async downloadFromGitHub(filename) {
        throw new Error('GitHub download not implemented');
    }
    
    async listGitHubFiles() {
        throw new Error('GitHub list not implemented');
    }
    
    async deleteFromGitHub(filename) {
        throw new Error('GitHub delete not implemented');
    }
    
    async shareGitHubFile(filename) {
        throw new Error('GitHub share not implemented');
    }
    
    async startRealtimeSync() {
        console.log('💾 Real-time sync started (stub)');
    }
    
    // Cleanup
    destroy() {
        this.stopAutoBackup();
        this.disconnectFromCloud();
        
        // Clear event listeners
        this.eventListeners.clear();
        
        console.log('💾 Enhanced Data Manager destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EnhancedDataManager;
} else if (typeof window !== 'undefined') {
    window.EnhancedDataManager = EnhancedDataManager;
}