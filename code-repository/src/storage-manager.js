/**
 * RulzLawyer Data Persistence & Storage Manager
 * LocalStorage/IndexedDB with Character Death Permanence
 * 
 * @version 1.0
 * @date September 20, 2025
 * @location code-repository/src/storage-manager.js
 */

class StorageManager {
  constructor() {
    this.storageKey = 'rulzlawyer_data';
    this.version = '1.0';
    this.dbName = 'RulzLawyerDB';
    this.dbVersion = 1;
    this.db = null;
    this.storageType = 'localStorage'; // fallback to localStorage if IndexedDB unavailable
    this.isInitialized = false;
    
    // Storage event listeners for cross-tab synchronization
    this.listeners = [];
    
    // Character death audit log
    this.deathAuditLog = [];
  }

  /**
   * Initialize storage system
   * @returns {Promise<boolean>} Success status
   */
  async initialize() {
    try {
      // Try to initialize IndexedDB first
      if (this._supportsIndexedDB()) {
        await this._initializeIndexedDB();
        this.storageType = 'indexedDB';
        console.log('StorageManager: IndexedDB initialized');
      } else {
        // Fallback to localStorage
        this._initializeLocalStorage();
        this.storageType = 'localStorage';
        console.log('StorageManager: LocalStorage initialized (fallback)');
      }
      
      // Load death audit log
      await this._loadDeathAuditLog();
      
      // Set up cross-tab synchronization
      this._setupCrossTabSync();
      
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('StorageManager initialization failed:', error);
      // Ultimate fallback to localStorage
      this._initializeLocalStorage();
      this.storageType = 'localStorage';
      this.isInitialized = true;
      return false;
    }
  }

  /**
   * Save character data with death permanence validation
   * @param {Object} character - Character object to save
   * @returns {Promise<boolean>} Success status
   */
  async saveCharacter(character) {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    // Validate character data
    if (!this._validateCharacterData(character)) {
      throw new Error('Invalid character data');
    }

    // Check death permanence - dead characters cannot be modified
    if (character.status === 'dead') {
      // Only allow saving if this is the death event itself
      const existingChar = await this.loadCharacter(character.id);
      if (existingChar && existingChar.status === 'dead') {
        throw new Error(`Character ${character.name} is permanently dead and cannot be modified. Dead characters are immutable.`);
      }
      
      // Log the death event
      await this._logCharacterDeath(character);
    }

    try {
      // Add metadata
      character.lastSaved = Date.now();
      character.storageVersion = this.version;
      
      if (this.storageType === 'indexedDB') {
        await this._saveToIndexedDB('characters', character);
      } else {
        await this._saveToLocalStorage('characters', character.id, character);
      }
      
      // Trigger cross-tab sync
      this._triggerStorageEvent('character_saved', { characterId: character.id });
      
      return true;
    } catch (error) {
      console.error('Failed to save character:', error);
      return false;
    }
  }

  /**
   * Load character data
   * @param {string} characterId - Character ID
   * @returns {Promise<Object|null>} Character object or null
   */
  async loadCharacter(characterId) {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    try {
      let character;
      
      if (this.storageType === 'indexedDB') {
        character = await this._loadFromIndexedDB('characters', characterId);
      } else {
        character = await this._loadFromLocalStorage('characters', characterId);
      }
      
      if (!character) {
        return null;
      }

      // Validate loaded data
      if (!this._validateCharacterData(character)) {
        console.warn(`Corrupted character data for ${characterId}, attempting recovery`);
        const recovered = await this._attemptDataRecovery(characterId);
        return recovered;
      }

      // CRITICAL: Enforce death permanence
      if (character.status === 'dead') {
        // Dead characters are immutable - return as read-only
        return Object.freeze(character);
      }

      return character;
    } catch (error) {
      console.error('Failed to load character:', error);
      return null;
    }
  }

  /**
   * Load all characters (living and dead)
   * @returns {Promise<Array>} Array of character objects
   */
  async loadAllCharacters() {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    try {
      let characters;
      
      if (this.storageType === 'indexedDB') {
        characters = await this._loadAllFromIndexedDB('characters');
      } else {
        characters = await this._loadAllFromLocalStorage('characters');
      }
      
      // Validate and freeze dead characters
      return characters.map(char => {
        if (!this._validateCharacterData(char)) {
          console.warn(`Corrupted character data for ${char.id}`);
          return null;
        }
        
        // Freeze dead characters to prevent modification
        if (char.status === 'dead') {
          return Object.freeze(char);
        }
        
        return char;
      }).filter(char => char !== null);
      
    } catch (error) {
      console.error('Failed to load characters:', error);
      return [];
    }
  }

  /**
   * Delete character (only if not permanently dead)
   * @param {string} characterId - Character ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteCharacter(characterId) {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    try {
      // Check if character is dead
      const character = await this.loadCharacter(characterId);
      if (character && character.status === 'dead') {
        throw new Error(`Cannot delete dead character ${character.name}. Dead characters must remain for audit purposes.`);
      }

      let success;
      if (this.storageType === 'indexedDB') {
        success = await this._deleteFromIndexedDB('characters', characterId);
      } else {
        success = await this._deleteFromLocalStorage('characters', characterId);
      }
      
      if (success) {
        this._triggerStorageEvent('character_deleted', { characterId });
      }
      
      return success;
    } catch (error) {
      console.error('Failed to delete character:', error);
      return false;
    }
  }

  /**
   * Save application settings
   * @param {Object} settings - Settings object
   * @returns {Promise<boolean>} Success status
   */
  async saveSettings(settings) {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    try {
      settings.lastSaved = Date.now();
      settings.version = this.version;
      
      if (this.storageType === 'indexedDB') {
        await this._saveToIndexedDB('settings', settings, 'app_settings');
      } else {
        await this._saveToLocalStorage('settings', 'app_settings', settings);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }

  /**
   * Load application settings
   * @returns {Promise<Object>} Settings object
   */
  async loadSettings() {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    try {
      let settings;
      
      if (this.storageType === 'indexedDB') {
        settings = await this._loadFromIndexedDB('settings', 'app_settings');
      } else {
        settings = await this._loadFromLocalStorage('settings', 'app_settings');
      }
      
      return settings || this._getDefaultSettings();
    } catch (error) {
      console.error('Failed to load settings:', error);
      return this._getDefaultSettings();
    }
  }

  /**
   * Get character death audit log
   * @returns {Promise<Array>} Death audit log
   */
  async getDeathAuditLog() {
    return [...this.deathAuditLog]; // Return copy to prevent modification
  }

  /**
   * Export all data for backup
   * @returns {Promise<Object>} Complete data export
   */
  async exportData() {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    try {
      const characters = await this.loadAllCharacters();
      const settings = await this.loadSettings();
      const deathLog = await this.getDeathAuditLog();
      
      return {
        version: this.version,
        exportDate: new Date().toISOString(),
        characters,
        settings,
        deathAuditLog: deathLog,
        metadata: {
          storageType: this.storageType,
          totalCharacters: characters.length,
          deadCharacters: characters.filter(c => c.status === 'dead').length,
          livingCharacters: characters.filter(c => c.status !== 'dead').length
        }
      };
    } catch (error) {
      console.error('Failed to export data:', error);
      throw error;
    }
  }

  /**
   * Import data from backup
   * @param {Object} data - Data to import
   * @returns {Promise<boolean>} Success status
   */
  async importData(data) {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    try {
      // Validate import data
      if (!data || !data.characters || !Array.isArray(data.characters)) {
        throw new Error('Invalid import data format');
      }

      // Import characters
      for (const character of data.characters) {
        if (this._validateCharacterData(character)) {
          await this.saveCharacter(character);
        }
      }

      // Import settings
      if (data.settings) {
        await this.saveSettings(data.settings);
      }

      // Import death audit log
      if (data.deathAuditLog && Array.isArray(data.deathAuditLog)) {
        this.deathAuditLog = [...this.deathAuditLog, ...data.deathAuditLog];
        await this._saveDeathAuditLog();
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Get storage statistics
   * @returns {Promise<Object>} Storage statistics
   */
  async getStorageStats() {
    if (!this.isInitialized) {
      throw new Error('StorageManager not initialized');
    }

    try {
      const characters = await this.loadAllCharacters();
      
      let storageUsed = 0;
      let storageQuota = 0;
      
      if (this.storageType === 'localStorage') {
        // Estimate localStorage usage
        const data = JSON.stringify(characters);
        storageUsed = new Blob([data]).size;
        storageQuota = 5 * 1024 * 1024; // 5MB typical localStorage limit
      } else if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        storageUsed = estimate.usage || 0;
        storageQuota = estimate.quota || 0;
      }
      
      return {
        storageType: this.storageType,
        storageUsed,
        storageQuota,
        storageUsedPercent: storageQuota > 0 ? ((storageUsed / storageQuota) * 100).toFixed(2) : 0,
        totalCharacters: characters.length,
        deadCharacters: characters.filter(c => c.status === 'dead').length,
        deathAuditEntries: this.deathAuditLog.length,
        isInitialized: this.isInitialized
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return { error: error.message };
    }
  }

  /**
   * Add storage event listener
   * @param {Function} callback - Callback function
   */
  addStorageListener(callback) {
    this.listeners.push(callback);
  }

  /**
   * Remove storage event listener
   * @param {Function} callback - Callback function to remove
   */
  removeStorageListener(callback) {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Check if IndexedDB is supported
   * @private
   */
  _supportsIndexedDB() {
    return typeof window !== 'undefined' && 
           'indexedDB' in window && 
           indexedDB !== null;
  }

  /**
   * Initialize IndexedDB
   * @private
   */
  async _initializeIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Characters object store
        if (!db.objectStoreNames.contains('characters')) {
          const characterStore = db.createObjectStore('characters', { keyPath: 'id' });
          characterStore.createIndex('status', 'status', { unique: false });
          characterStore.createIndex('name', 'name', { unique: false });
        }
        
        // Settings object store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }
        
        // Death audit log object store
        if (!db.objectStoreNames.contains('deathLog')) {
          const deathLogStore = db.createObjectStore('deathLog', { keyPath: 'id', autoIncrement: true });
          deathLogStore.createIndex('timestamp', 'timestamp', { unique: false });
          deathLogStore.createIndex('characterId', 'characterId', { unique: false });
        }
      };
    });
  }

  /**
   * Initialize localStorage
   * @private
   */
  _initializeLocalStorage() {
    if (typeof window === 'undefined' || !window.localStorage) {
      throw new Error('localStorage not available');
    }
    
    // Test localStorage availability
    try {
      const testKey = '__rulzlawyer_test__';
      localStorage.setItem(testKey, 'test');
      localStorage.removeItem(testKey);
    } catch (error) {
      throw new Error('localStorage not accessible');
    }
  }

  /**
   * Validate character data structure
   * @private
   */
  _validateCharacterData(character) {
    if (!character || typeof character !== 'object') {
      return false;
    }
    
    const requiredFields = ['id', 'name', 'race', 'class', 'level', 'abilities', 'status'];
    
    for (const field of requiredFields) {
      if (!(field in character)) {
        return false;
      }
    }
    
    // Validate abilities object
    if (!character.abilities || typeof character.abilities !== 'object') {
      return false;
    }
    
    const requiredAbilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
    for (const ability of requiredAbilities) {
      if (typeof character.abilities[ability] !== 'number') {
        return false;
      }
    }
    
    // Validate status
    const validStatuses = ['alive', 'unconscious', 'dying', 'dead'];
    if (!validStatuses.includes(character.status)) {
      return false;
    }
    
    return true;
  }

  /**
   * Log character death event
   * @private
   */
  async _logCharacterDeath(character) {
    const deathEntry = {
      id: Date.now().toString() + '_' + character.id,
      characterId: character.id,
      characterName: character.name,
      characterLevel: character.level,
      characterClass: character.class,
      characterRace: character.race,
      causeOfDeath: character.causeOfDeath || 'Unknown',
      timestamp: Date.now(),
      deathCount: character.deaths || 1
    };
    
    this.deathAuditLog.push(deathEntry);
    await this._saveDeathAuditLog();
  }

  /**
   * Load death audit log
   * @private
   */
  async _loadDeathAuditLog() {
    try {
      let deathLog;
      
      if (this.storageType === 'indexedDB') {
        deathLog = await this._loadAllFromIndexedDB('deathLog');
      } else {
        deathLog = await this._loadFromLocalStorage('deathLog', 'audit_log');
      }
      
      this.deathAuditLog = deathLog || [];
    } catch (error) {
      console.error('Failed to load death audit log:', error);
      this.deathAuditLog = [];
    }
  }

  /**
   * Save death audit log
   * @private
   */
  async _saveDeathAuditLog() {
    try {
      if (this.storageType === 'indexedDB') {
        // Save each entry individually in IndexedDB
        for (const entry of this.deathAuditLog) {
          await this._saveToIndexedDB('deathLog', entry);
        }
      } else {
        await this._saveToLocalStorage('deathLog', 'audit_log', this.deathAuditLog);
      }
    } catch (error) {
      console.error('Failed to save death audit log:', error);
    }
  }

  /**
   * Setup cross-tab synchronization
   * @private
   */
  _setupCrossTabSync() {
    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('storage', (event) => {
        if (event.key && event.key.startsWith(this.storageKey)) {
          this._notifyListeners('storage_changed', {
            key: event.key,
            oldValue: event.oldValue,
            newValue: event.newValue
          });
        }
      });
    }
  }

  /**
   * Trigger storage event for cross-tab sync
   * @private
   */
  _triggerStorageEvent(type, data) {
    this._notifyListeners(type, data);
  }

  /**
   * Notify all listeners of storage events
   * @private
   */
  _notifyListeners(type, data) {
    this.listeners.forEach(listener => {
      try {
        listener(type, data);
      } catch (error) {
        console.error('Error in storage listener:', error);
      }
    });
  }

  /**
   * Get default settings
   * @private
   */
  _getDefaultSettings() {
    return {
      id: 'app_settings',
      theme: 'default',
      autoSave: true,
      soundEnabled: true,
      animationsEnabled: true,
      confirmCharacterDeletion: true,
      showDeadCharacters: true,
      backupReminders: true,
      version: this.version,
      created: Date.now()
    };
  }

  // IndexedDB operations
  async _saveToIndexedDB(storeName, data, key = null) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const request = key ? store.put({...data, id: key}) : store.put(data);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async _loadFromIndexedDB(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async _loadAllFromIndexedDB(storeName) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();
      
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async _deleteFromIndexedDB(storeName, key) {
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);
      
      request.onsuccess = () => resolve(true);
      request.onerror = () => reject(request.error);
    });
  }

  // LocalStorage operations
  async _saveToLocalStorage(category, key, data) {
    const storageKey = `${this.storageKey}_${category}_${key}`;
    localStorage.setItem(storageKey, JSON.stringify(data));
  }

  async _loadFromLocalStorage(category, key) {
    const storageKey = `${this.storageKey}_${category}_${key}`;
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : null;
  }

  async _loadAllFromLocalStorage(category) {
    const prefix = `${this.storageKey}_${category}_`;
    const results = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        try {
          const data = JSON.parse(localStorage.getItem(key));
          results.push(data);
        } catch (error) {
          console.warn(`Failed to parse localStorage item: ${key}`);
        }
      }
    }
    
    return results;
  }

  async _deleteFromLocalStorage(category, key) {
    const storageKey = `${this.storageKey}_${category}_${key}`;
    localStorage.removeItem(storageKey);
    return true;
  }

  /**
   * Save generic data to storage
   * @param {string} key - Storage key
   * @param {*} data - Data to save
   * @returns {Promise<boolean>}
   */
  async saveData(key, data) {
    try {
      const storageData = {
        data: data,
        timestamp: Date.now(),
        version: this.version
      };
      
      const serializedData = JSON.stringify(storageData);
      
      if (this.useIndexedDB && this.isIndexedDBAvailable()) {
        await this._saveToIndexedDB(`${this.storageKey}_data_${key}`, serializedData);
      } else {
        localStorage.setItem(`${this.storageKey}_data_${key}`, serializedData);
      }
      
      console.log(`💾 Data saved: ${key}`);
      return true;
      
    } catch (error) {
      console.error('❌ Save data error:', error);
      throw new Error(`Failed to save data: ${error.message}`);
    }
  }
  
  /**
   * Load generic data from storage
   * @param {string} key - Storage key
   * @returns {Promise<*>}
   */
  async loadData(key) {
    try {
      let serializedData;
      
      if (this.useIndexedDB && this.isIndexedDBAvailable()) {
        serializedData = await this._loadFromIndexedDB(`${this.storageKey}_data_${key}`);
      } else {
        serializedData = localStorage.getItem(`${this.storageKey}_data_${key}`);
      }
      
      if (!serializedData) {
        return null;
      }
      
      const storageData = JSON.parse(serializedData);
      
      // Validate data structure
      if (!storageData.data || !storageData.timestamp) {
        throw new Error('Invalid data structure');
      }
      
      console.log(`📁 Data loaded: ${key}`);
      return storageData.data;
      
    } catch (error) {
      console.error('❌ Load data error:', error);
      return null;
    }
  }
  
  /**
   * Delete generic data from storage
   * @param {string} key - Storage key
   * @returns {Promise<boolean>}
   */
  async deleteData(key) {
    try {
      if (this.useIndexedDB && this.isIndexedDBAvailable()) {
        await this._deleteFromIndexedDB(`${this.storageKey}_data_${key}`);
      } else {
        localStorage.removeItem(`${this.storageKey}_data_${key}`);
      }
      
      console.log(`🗑️ Data deleted: ${key}`);
      return true;
      
    } catch (error) {
      console.error('❌ Delete data error:', error);
      throw new Error(`Failed to delete data: ${error.message}`);
    }
  }

  /**
   * Attempt data recovery for corrupted character
   * @private
   */
  async _attemptDataRecovery(characterId) {
    console.log(`Attempting data recovery for character ${characterId}`);
    
    // Basic recovery - return null if unable to recover
    // In a production system, this could involve more sophisticated recovery
    return null;
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = StorageManager;
} else if (typeof window !== 'undefined') {
  window.StorageManager = StorageManager;
}