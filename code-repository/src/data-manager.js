/**
 * D&D 3.5 Data Manager
 * Handles loading, caching, and accessing all game data from JSON files
 * Provides unified interface for character creation and gameplay systems
 */

class DnDDataManager {
    constructor() {
        this.data = {
            races: [],
            classes: [],
            skills: [],
            feats: [],
            spells: [],
            equipment: {},
            calculations: {},
            complete: {}
        };

        this.loadPromises = {};
        this.isInitialized = false;

        // Base path for data files
        this.dataPath = './data/';

        // File mappings
        this.dataFiles = {
            races: 'races-expanded.json',
            racesFallback: 'races.json',
            classes: 'classes-expanded.json',
            classesFallback: 'classes.json',
            skills: 'skills.json',
            feats: 'feats-expanded.json',
            featsFallback: 'feats.json',
            spells: 'spells-expanded.json',
            spellsFallback: 'spells.json',
            equipment: 'equipment-expanded.json',
            equipmentFallback: 'equipment.json',
            calculations: 'calculations.json',
            complete: 'complete-dnd-data.json'
        };
    }

    /**
     * Initialize data manager by loading all data files
     * @returns {Promise<void>}
     */
    async initialize() {
        if (this.isInitialized) {
            return Promise.resolve();
        }

        try {
            // Load all data files in parallel
            const loadPromises = [
                this.loadDataFile('races'),
                this.loadDataFile('classes'),
                this.loadDataFile('skills'),
                this.loadDataFile('feats'),
                this.loadDataFile('spells'),
                this.loadDataFile('equipment'),
                this.loadDataFile('calculations')
            ];

            await Promise.all(loadPromises);
            this.isInitialized = true;

            console.log('D&D Data Manager initialized successfully');
            this.logDataSummary();
        } catch (error) {
            console.error('Failed to initialize D&D Data Manager:', error);
            throw error;
        }
    }

    /**
     * Load a specific data file with fallback support
     * @param {string} dataType - Type of data to load
     * @returns {Promise<void>}
     */
    async loadDataFile(dataType) {
        if (this.loadPromises[dataType]) {
            return this.loadPromises[dataType];
        }

        this.loadPromises[dataType] = this._loadDataFileInternal(dataType);
        return this.loadPromises[dataType];
    }

    /**
     * Internal method to load data file with error handling
     * @param {string} dataType - Type of data to load
     * @returns {Promise<void>}
     * @private
     */
    async _loadDataFileInternal(dataType) {
        const primaryFile = this.dataFiles[dataType];
        const fallbackFile = this.dataFiles[dataType + 'Fallback'];

        try {
            // Try primary (expanded) file first
            if (primaryFile) {
                const data = await this.fetchJsonFile(this.dataPath + primaryFile);
                this.data[dataType] = data;
                console.log(`Loaded ${dataType} from ${primaryFile}`);
                return;
            }
        } catch (error) {
            console.warn(`Failed to load primary ${dataType} file:`, error.message);
        }

        try {
            // Try fallback file
            if (fallbackFile) {
                const data = await this.fetchJsonFile(this.dataPath + fallbackFile);
                this.data[dataType] = data;
                console.log(`Loaded ${dataType} from fallback ${fallbackFile}`);
                return;
            }
        } catch (error) {
            console.warn(`Failed to load fallback ${dataType} file:`, error.message);
        }

        // If both fail, use empty data
        this.data[dataType] = this.getEmptyDataStructure(dataType);
        console.warn(`Using empty data structure for ${dataType}`);
    }

    /**
     * Fetch JSON file with proper error handling
     * @param {string} filePath - Path to JSON file
     * @returns {Promise<any>} Parsed JSON data
     */
    async fetchJsonFile(filePath) {
        if (typeof window !== 'undefined') {
            // Browser environment
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return response.json();
        } else if (typeof require !== 'undefined') {
            // Node.js environment
            const fs = require('fs').promises;
            const data = await fs.readFile(filePath, 'utf8');
            return JSON.parse(data);
        } else {
            throw new Error('Unsupported environment for file loading');
        }
    }

    /**
     * Get empty data structure for a given data type
     * @param {string} dataType - Type of data
     * @returns {any} Empty data structure
     */
    getEmptyDataStructure(dataType) {
        switch (dataType) {
            case 'equipment':
                return {
                    weapons: { simple_melee: [], simple_ranged: [], martial_melee: [], martial_ranged: [], exotic: [] },
                    armor: { light_armor: [], medium_armor: [], heavy_armor: [], shields: [] },
                    adventuring_gear: [],
                    tools_and_skill_kits: []
                };
            case 'calculations':
                return { formulas: {}, tables: {} };
            default:
                return [];
        }
    }

    /**
     * Get all races
     * @returns {Array} Array of race objects
     */
    getRaces() {
        return this.data.races || [];
    }

    /**
     * Get race by name
     * @param {string} raceName - Name of the race
     * @returns {Object|null} Race object or null if not found
     */
    getRace(raceName) {
        return this.data.races.find(race => race.name === raceName) || null;
    }

    /**
     * Get all classes
     * @returns {Array} Array of class objects
     */
    getClasses() {
        return this.data.classes || [];
    }

    /**
     * Get class by name
     * @param {string} className - Name of the class
     * @returns {Object|null} Class object or null if not found
     */
    getClass(className) {
        return this.data.classes.find(cls => cls.name === className) || null;
    }

    /**
     * Get all skills
     * @returns {Array} Array of skill objects
     */
    getSkills() {
        return this.data.skills || [];
    }

    /**
     * Get skill by name
     * @param {string} skillName - Name of the skill
     * @returns {Object|null} Skill object or null if not found
     */
    getSkill(skillName) {
        return this.data.skills.find(skill => skill.name === skillName) || null;
    }

    /**
     * Get all feats
     * @returns {Array} Array of feat objects
     */
    getFeats() {
        return this.data.feats || [];
    }

    /**
     * Get feat by name
     * @param {string} featName - Name of the feat
     * @returns {Object|null} Feat object or null if not found
     */
    getFeat(featName) {
        return this.data.feats.find(feat => feat.name === featName) || null;
    }

    /**
     * Get feats by type
     * @param {string} type - Type of feat (General, Combat, Metamagic, etc.)
     * @returns {Array} Array of matching feat objects
     */
    getFeatsByType(type) {
        return this.data.feats.filter(feat => feat.type === type) || [];
    }

    /**
     * Get all spells
     * @returns {Array} Array of spell objects
     */
    getSpells() {
        return this.data.spells || [];
    }

    /**
     * Get spell by name
     * @param {string} spellName - Name of the spell
     * @returns {Object|null} Spell object or null if not found
     */
    getSpell(spellName) {
        return this.data.spells.find(spell => spell.name === spellName) || null;
    }

    /**
     * Get spells by class and level
     * @param {string} className - Spellcasting class name
     * @param {number} spellLevel - Spell level (0-9)
     * @returns {Array} Array of matching spell objects
     */
    getSpellsByClassAndLevel(className, spellLevel) {
        return this.data.spells.filter(spell => {
            const classLevel = spell.level && spell.level[className];
            return classLevel !== undefined && classLevel === spellLevel;
        }) || [];
    }

    /**
     * Get spells by school
     * @param {string} school - School of magic
     * @returns {Array} Array of matching spell objects
     */
    getSpellsBySchool(school) {
        return this.data.spells.filter(spell => spell.school === school) || [];
    }

    /**
     * Get all equipment
     * @returns {Object} Equipment object with categorized items
     */
    getEquipment() {
        return this.data.equipment || this.getEmptyDataStructure('equipment');
    }

    /**
     * Get weapons by category
     * @param {string} category - Weapon category (simple_melee, martial_ranged, etc.)
     * @returns {Array} Array of weapon objects
     */
    getWeapons(category = null) {
        const equipment = this.getEquipment();
        if (!equipment.weapons) return [];

        if (category) {
            return equipment.weapons[category] || [];
        }

        // Return all weapons
        const allWeapons = [];
        for (const [cat, weapons] of Object.entries(equipment.weapons)) {
            allWeapons.push(...weapons);
        }
        return allWeapons;
    }

    /**
     * Get armor by category
     * @param {string} category - Armor category (light_armor, shields, etc.)
     * @returns {Array} Array of armor objects
     */
    getArmor(category = null) {
        const equipment = this.getEquipment();
        if (!equipment.armor) return [];

        if (category) {
            return equipment.armor[category] || [];
        }

        // Return all armor
        const allArmor = [];
        for (const [cat, armor] of Object.entries(equipment.armor)) {
            allArmor.push(...armor);
        }
        return allArmor;
    }

    /**
     * Get adventuring gear
     * @returns {Array} Array of gear objects
     */
    getAdventuringGear() {
        const equipment = this.getEquipment();
        return equipment.adventuring_gear || [];
    }

    /**
     * Search for items by name across all equipment categories
     * @param {string} searchTerm - Search term
     * @param {boolean} exactMatch - Whether to require exact match
     * @returns {Array} Array of matching equipment objects
     */
    searchEquipment(searchTerm, exactMatch = false) {
        const results = [];
        const equipment = this.getEquipment();

        const searchFunction = exactMatch
            ? (item) => item.name === searchTerm
            : (item) => item.name.toLowerCase().includes(searchTerm.toLowerCase());

        // Search weapons
        for (const weapons of Object.values(equipment.weapons || {})) {
            results.push(...weapons.filter(searchFunction));
        }

        // Search armor
        for (const armor of Object.values(equipment.armor || {})) {
            results.push(...armor.filter(searchFunction));
        }

        // Search other gear
        if (equipment.adventuring_gear) {
            results.push(...equipment.adventuring_gear.filter(searchFunction));
        }

        return results;
    }

    /**
     * Get class skills for a specific class
     * @param {string} className - Name of the class
     * @returns {Array} Array of skill names that are class skills
     */
    getClassSkills(className) {
        const classData = this.getClass(className);
        return classData ? classData.class_skills || [] : [];
    }

    /**
     * Check if a skill is a class skill for given classes
     * @param {string} skillName - Name of the skill
     * @param {Array} classes - Array of class names
     * @returns {boolean} True if skill is a class skill for any of the classes
     */
    isClassSkill(skillName, classes) {
        for (const className of classes) {
            const classSkills = this.getClassSkills(className);
            if (classSkills.includes(skillName)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Get complete game data object
     * @returns {Object} Complete D&D 3.5 game data
     */
    getAllData() {
        return {
            races: this.getRaces(),
            classes: this.getClasses(),
            skills: this.getSkills(),
            feats: this.getFeats(),
            spells: this.getSpells(),
            equipment: this.getEquipment()
        };
    }

    /**
     * Get data loading status
     * @returns {Object} Status information
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            dataLoaded: {
                races: this.data.races.length > 0,
                classes: this.data.classes.length > 0,
                skills: this.data.skills.length > 0,
                feats: this.data.feats.length > 0,
                spells: this.data.spells.length > 0,
                equipment: Object.keys(this.data.equipment).length > 0
            },
            counts: {
                races: this.data.races.length,
                classes: this.data.classes.length,
                skills: this.data.skills.length,
                feats: this.data.feats.length,
                spells: this.data.spells.length,
                weapons: this.getWeapons().length,
                armor: this.getArmor().length
            }
        };
    }

    /**
     * Log data summary to console
     */
    logDataSummary() {
        const status = this.getStatus();
        console.log('=== D&D Data Manager Summary ===');
        console.log(`Races: ${status.counts.races}`);
        console.log(`Classes: ${status.counts.classes}`);
        console.log(`Skills: ${status.counts.skills}`);
        console.log(`Feats: ${status.counts.feats}`);
        console.log(`Spells: ${status.counts.spells}`);
        console.log(`Weapons: ${status.counts.weapons}`);
        console.log(`Armor: ${status.counts.armor}`);
        console.log('================================');
    }

    /**
     * Reload all data (useful for development/testing)
     * @returns {Promise<void>}
     */
    async reload() {
        this.isInitialized = false;
        this.loadPromises = {};
        this.data = {
            races: [],
            classes: [],
            skills: [],
            feats: [],
            spells: [],
            equipment: {},
            calculations: {},
            complete: {}
        };

        await this.initialize();
    }

    /**
     * Validate data integrity
     * @returns {Object} Validation results
     */
    validateData() {
        const issues = [];

        // Check for required fields in races
        for (const race of this.data.races) {
            if (!race.name || !race.size || !race.ability_adjustments) {
                issues.push(`Race missing required fields: ${race.name}`);
            }
        }

        // Check for required fields in classes
        for (const cls of this.data.classes) {
            if (!cls.name || !cls.hit_die || !cls.skill_points_per_level) {
                issues.push(`Class missing required fields: ${cls.name}`);
            }
        }

        // Check for orphaned references
        for (const cls of this.data.classes) {
            if (cls.class_skills) {
                for (const skill of cls.class_skills) {
                    if (!this.getSkill(skill)) {
                        issues.push(`Class ${cls.name} references unknown skill: ${skill}`);
                    }
                }
            }
        }

        return {
            valid: issues.length === 0,
            issues
        };
    }
}

// Create singleton instance
const dndDataManager = new DnDDataManager();

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DnDDataManager, dndDataManager };
} else if (typeof window !== 'undefined') {
    window.DnDDataManager = DnDDataManager;
    window.dndDataManager = dndDataManager;
}