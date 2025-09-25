/**
 * SRDDataManager - Centralized D&D 3.5 SRD Data Management
 * Handles all extracted D&D 3.5 SRD data from Rackem19.xlsm
 * 
 * Features:
 * - Race, class, skill, feat, equipment, and spell data management
 * - Calculation formulas and game mechanics
 * - Data validation and error handling
 * - Query and filter functionality
 * - Integration with character generation systems
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

const fs = require('fs');
const path = require('path');

class SRDDataManager {
    constructor(dataPath = null) {
        this.dataPath = dataPath || path.join(__dirname, '..', 'data');
        this.cache = new Map();
        this.lastModified = new Map();
        
        // Data categories
        this.dataCategories = [
            'races',
            'classes', 
            'skills',
            'feats',
            'equipment',
            'spells',
            'calculations'
        ];
        
        console.log(`📊 SRDDataManager initialized with data path: ${this.dataPath}`);
        this.validateDataDirectory();
        this.loadAllData();
    }

    /**
     * Validate that the data directory exists and contains required files
     */
    validateDataDirectory() {
        if (!fs.existsSync(this.dataPath)) {
            throw new Error(`SRD data directory not found: ${this.dataPath}`);
        }
        
        const missingFiles = [];
        for (const category of this.dataCategories) {
            const filePath = path.join(this.dataPath, `${category}.json`);
            if (!fs.existsSync(filePath)) {
                missingFiles.push(`${category}.json`);
            }
        }
        
        if (missingFiles.length > 0) {
            throw new Error(`Missing SRD data files: ${missingFiles.join(', ')}`);
        }
        
        console.log(`✅ All ${this.dataCategories.length} SRD data files found`);
    }

    /**
     * Load all SRD data into memory
     */
    loadAllData() {
        let totalEntries = 0;
        
        for (const category of this.dataCategories) {
            try {
                const data = this.loadDataFile(category);
                this.cache.set(category, data);
                
                // Count entries for reporting
                if (Array.isArray(data)) {
                    totalEntries += data.length;
                } else if (typeof data === 'object') {
                    totalEntries += Object.keys(data).length;
                }
                
                console.log(`📋 Loaded ${category}: ${this.getDataCount(data)} entries`);
                
            } catch (error) {
                console.error(`❌ Failed to load ${category}:`, error.message);
                throw error;
            }
        }
        
        console.log(`🎲 SRD Data loaded successfully: ${totalEntries} total entries`);
    }

    /**
     * Load a specific data file
     */
    loadDataFile(category) {
        const filePath = path.join(this.dataPath, `${category}.json`);
        
        // Check file modification time for cache invalidation
        const stats = fs.statSync(filePath);
        const lastMod = this.lastModified.get(category);
        
        if (lastMod && stats.mtime.getTime() === lastMod) {
            return this.cache.get(category);
        }
        
        // Load and parse file
        const rawData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(rawData);
        
        // Update cache and timestamp
        this.lastModified.set(category, stats.mtime.getTime());
        
        return data;
    }

    /**
     * Get count of entries in data structure
     */
    getDataCount(data) {
        if (Array.isArray(data)) {
            return data.length;
        } else if (typeof data === 'object' && data !== null) {
            return Object.keys(data).length;
        }
        return 1;
    }

    // ===================
    // DATA ACCESS METHODS
    // ===================

    /**
     * Get all data for a category
     */
    getData(category) {
        if (!this.dataCategories.includes(category)) {
            throw new Error(`Invalid data category: ${category}`);
        }
        
        return this.cache.get(category) || [];
    }

    /**
     * Get all available races
     */
    getRaces() {
        return this.getData('races');
    }

    /**
     * Get all available classes
     */
    getClasses() {
        return this.getData('classes');
    }

    /**
     * Get all available skills
     */
    getSkills() {
        return this.getData('skills');
    }

    /**
     * Get all available feats
     */
    getFeats() {
        return this.getData('feats');
    }

    /**
     * Get all equipment data
     */
    getEquipment() {
        return this.getData('equipment');
    }

    /**
     * Get all spell data
     */
    getSpells() {
        return this.getData('spells');
    }

    /**
     * Get calculation formulas
     */
    getCalculations() {
        return this.getData('calculations');
    }

    /**
     * Get all data categories
     */
    getAllData() {
        const result = {};
        for (const category of this.dataCategories) {
            result[category] = this.getData(category);
        }
        return result;
    }

    // ===================
    // QUERY METHODS
    // ===================

    /**
     * Find race by name
     */
    findRace(name) {
        const races = this.getRaces();
        return races.find(race => 
            race.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Find class by name
     */
    findClass(name) {
        const classes = this.getClasses();
        return classes.find(cls => 
            cls.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Find skill by name
     */
    findSkill(name) {
        const skills = this.getSkills();
        return skills.find(skill => 
            skill.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Find feat by name
     */
    findFeat(name) {
        const feats = this.getFeats();
        return feats.find(feat => 
            feat.name.toLowerCase() === name.toLowerCase()
        );
    }

    /**
     * Find equipment by name
     */
    findEquipment(name) {
        const equipment = this.getEquipment();
        if (Array.isArray(equipment)) {
            return equipment.find(item => 
                item.name && item.name.toLowerCase() === name.toLowerCase()
            );
        }
        return null;
    }

    /**
     * Find spell by name
     */
    findSpell(name) {
        const spells = this.getSpells();
        if (Array.isArray(spells)) {
            return spells.find(spell => 
                spell.name && spell.name.toLowerCase() === name.toLowerCase()
            );
        }
        return null;
    }

    // ===================
    // FILTER METHODS
    // ===================

    /**
     * Get classes available to a specific race
     */
    getClassesForRace(raceName) {
        const race = this.findRace(raceName);
        if (!race) return [];
        
        const classes = this.getClasses();
        return classes.filter(cls => {
            // Check if race has any restrictions for this class
            if (race.classRestrictions && race.classRestrictions[cls.name]) {
                return false;
            }
            return true;
        });
    }

    /**
     * Get skills available to a specific class
     */
    getSkillsForClass(className) {
        const characterClass = this.findClass(className);
        if (!characterClass || !characterClass.classSkills) {
            return this.getSkills();
        }
        
        const classSkills = characterClass.classSkills;
        const allSkills = this.getSkills();
        
        return allSkills.map(skill => ({
            ...skill,
            isClassSkill: classSkills.includes(skill.name)
        }));
    }

    /**
     * Get feats available at character level
     */
    getFeatsForLevel(level) {
        const feats = this.getFeats();
        return feats.filter(feat => {
            if (feat.prerequisites && feat.prerequisites.level) {
                return level >= feat.prerequisites.level;
            }
            return true;
        });
    }

    /**
     * Get spells for class and level
     */
    getSpellsForClassLevel(className, spellLevel) {
        const spells = this.getSpells();
        if (!Array.isArray(spells)) return [];
        
        return spells.filter(spell => {
            if (spell.classes && spell.classes[className]) {
                return spell.classes[className] === spellLevel;
            }
            return false;
        });
    }

    // ===================
    // CALCULATION METHODS
    // ===================

    /**
     * Get racial ability modifiers
     */
    getRacialAbilityModifiers(raceName) {
        const race = this.findRace(raceName);
        if (!race || !race.abilityModifiers) {
            return {
                strength: 0,
                dexterity: 0,
                constitution: 0,
                intelligence: 0,
                wisdom: 0,
                charisma: 0
            };
        }
        
        return race.abilityModifiers;
    }

    /**
     * Calculate ability modifier from ability score
     */
    getAbilityModifier(abilityScore) {
        return Math.floor((abilityScore - 10) / 2);
    }

    /**
     * Get class hit die
     */
    getClassHitDie(className) {
        const characterClass = this.findClass(className);
        return characterClass ? characterClass.hitDie : 6;
    }

    /**
     * Get class skill points per level
     */
    getClassSkillPoints(className) {
        const characterClass = this.findClass(className);
        return characterClass ? characterClass.skillPoints : 2;
    }

    /**
     * Get class base attack bonus progression
     */
    getClassBABProgression(className) {
        const characterClass = this.findClass(className);
        return characterClass ? characterClass.baseAttackBonus : 'poor';
    }

    /**
     * Get class saving throw progressions
     */
    getClassSavingThrows(className) {
        const characterClass = this.findClass(className);
        if (!characterClass || !characterClass.savingThrows) {
            return {
                fortitude: 'poor',
                reflex: 'poor',
                will: 'poor'
            };
        }
        
        return characterClass.savingThrows;
    }

    // ===================
    // VALIDATION METHODS
    // ===================

    /**
     * Validate race exists
     */
    isValidRace(raceName) {
        return this.findRace(raceName) !== undefined;
    }

    /**
     * Validate class exists
     */
    isValidClass(className) {
        return this.findClass(className) !== undefined;
    }

    /**
     * Validate skill exists
     */
    isValidSkill(skillName) {
        return this.findSkill(skillName) !== undefined;
    }

    /**
     * Validate feat exists
     */
    isValidFeat(featName) {
        return this.findFeat(featName) !== undefined;
    }

    /**
     * Validate character build
     */
    validateCharacterBuild(character) {
        const errors = [];
        
        // Validate race
        if (!this.isValidRace(character.race)) {
            errors.push(`Invalid race: ${character.race}`);
        }
        
        // Validate class
        if (!this.isValidClass(character.characterClass)) {
            errors.push(`Invalid class: ${character.characterClass}`);
        }
        
        // Validate skills
        if (character.skills) {
            for (const skillName of Object.keys(character.skills)) {
                if (!this.isValidSkill(skillName)) {
                    errors.push(`Invalid skill: ${skillName}`);
                }
            }
        }
        
        // Validate feats
        if (character.feats) {
            for (const featName of character.feats) {
                if (!this.isValidFeat(featName)) {
                    errors.push(`Invalid feat: ${featName}`);
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    // ===================
    // UTILITY METHODS
    // ===================

    /**
     * Reload data from files
     */
    reloadData() {
        this.cache.clear();
        this.lastModified.clear();
        this.loadAllData();
        console.log('🔄 SRD data reloaded successfully');
    }

    /**
     * Get data statistics
     */
    getDataStats() {
        const stats = {};
        
        for (const category of this.dataCategories) {
            const data = this.getData(category);
            stats[category] = {
                count: this.getDataCount(data),
                type: Array.isArray(data) ? 'array' : typeof data
            };
        }
        
        return stats;
    }

    /**
     * Export all data to JSON string
     */
    exportAllData() {
        return JSON.stringify(this.getAllData(), null, 2);
    }

    /**
     * Search across all data categories
     */
    search(query) {
        const results = {};
        const searchTerm = query.toLowerCase();
        
        for (const category of this.dataCategories) {
            const data = this.getData(category);
            const matches = [];
            
            if (Array.isArray(data)) {
                for (const item of data) {
                    if (item.name && item.name.toLowerCase().includes(searchTerm)) {
                        matches.push(item);
                    }
                }
            } else if (typeof data === 'object') {
                for (const [key, value] of Object.entries(data)) {
                    if (key.toLowerCase().includes(searchTerm) || 
                        (typeof value === 'string' && value.toLowerCase().includes(searchTerm))) {
                        matches.push({ key, value });
                    }
                }
            }
            
            if (matches.length > 0) {
                results[category] = matches;
            }
        }
        
        return results;
    }
}

// Dual environment compatibility
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SRDDataManager;
} else if (typeof window !== 'undefined') {
    window.SRDDataManager = SRDDataManager;
}

module.exports = SRDDataManager;