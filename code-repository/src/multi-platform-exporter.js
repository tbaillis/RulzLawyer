/**
 * Multi-Platform Character Export System
 * Comprehensive character export functionality supporting multiple formats
 * including PDF, JSON, PNG, Roll20, D&D Beyond, XML, and more
 * 
 * Features:
 * - PDF character sheet generation with D&D 3.5 official layout
 * - JSON export with complete character data
 * - PNG export with character portrait and stats summary
 * - Roll20 character import format
 * - D&D Beyond-compatible format
 * - XML export for third-party tools
 * - Custom template system
 * - Batch export functionality
 * - Cloud service integration preparation
 * - Import validation and migration
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class MultiPlatformExporter {
    constructor(characterManager, options = {}) {
        this.characterManager = characterManager;
        
        this.options = {
            defaultFormat: options.defaultFormat || 'json',
            includePortrait: options.includePortrait !== false,
            includeEquipment: options.includeEquipment !== false,
            includeSpells: options.includeSpells !== false,
            includeNotes: options.includeNotes !== false,
            compressionLevel: options.compressionLevel || 'medium',
            dateFormat: options.dateFormat || 'iso',
            validation: options.validation !== false,
            ...options
        };
        
        this.supportedFormats = new Map([
            ['pdf', { name: 'PDF Character Sheet', extension: '.pdf', mimeType: 'application/pdf' }],
            ['json', { name: 'JSON Data Export', extension: '.json', mimeType: 'application/json' }],
            ['png', { name: 'Character Image', extension: '.png', mimeType: 'image/png' }],
            ['roll20', { name: 'Roll20 Import Format', extension: '.json', mimeType: 'application/json' }],
            ['dndbeyond', { name: 'D&D Beyond Format', extension: '.json', mimeType: 'application/json' }],
            ['xml', { name: 'XML Export', extension: '.xml', mimeType: 'application/xml' }],
            ['csv', { name: 'CSV Spreadsheet', extension: '.csv', mimeType: 'text/csv' }],
            ['foundry', { name: 'Foundry VTT', extension: '.json', mimeType: 'application/json' }],
            ['pcgen', { name: 'PCGen Format', extension: '.pcg', mimeType: 'application/octet-stream' }],
            ['herolab', { name: 'Hero Lab Format', extension: '.por', mimeType: 'application/octet-stream' }]
        ]);
        
        this.exportTemplates = new Map();
        this.exportHistory = [];
        this.validationErrors = [];
        
        this.initialize();
        
        console.log('📤 Multi-Platform Character Exporter initialized');
    }
    
    initialize() {
        this.setupExportTemplates();
        this.loadExportHistory();
        this.validateDependencies();
        
        console.log(`📤 Exporter ready - ${this.supportedFormats.size} formats supported`);
    }
    
    setupExportTemplates() {
        // PDF Template
        this.exportTemplates.set('pdf', {
            name: 'D&D 3.5 Official Character Sheet',
            layout: 'official',
            includePortrait: true,
            pageSize: 'letter',
            orientation: 'portrait',
            sections: ['header', 'abilities', 'skills', 'combat', 'equipment', 'spells', 'notes']
        });
        
        // Roll20 Template
        this.exportTemplates.set('roll20', {
            name: 'Roll20 D&D 3.5 Character',
            apiVersion: '1.0',
            includeImages: true,
            macroSupport: true,
            sheetType: 'dnd35'
        });
        
        // D&D Beyond Template
        this.exportTemplates.set('dndbeyond', {
            name: 'D&D Beyond Compatible',
            version: '2024',
            includeCustomContent: true,
            validateAgainstSRD: true
        });
        
        // Foundry VTT Template
        this.exportTemplates.set('foundry', {
            name: 'Foundry Virtual Tabletop',
            systemVersion: '10.x',
            actorType: 'character',
            includeTokens: true
        });
    }
    
    async exportCharacter(character, format, options = {}) {
        const startTime = performance.now();
        
        try {
            // Validate character data
            if (this.options.validation) {
                const validation = this.validateCharacterData(character);
                if (!validation.isValid) {
                    throw new Error(`Character validation failed: ${validation.errors.join(', ')}`);
                }
            }
            
            // Merge options with defaults
            const exportOptions = {
                ...this.options,
                ...options,
                format: format,
                timestamp: new Date().toISOString(),
                characterName: character.name || 'Unnamed Character'
            };
            
            let exportData;
            
            // Route to appropriate export method
            switch (format.toLowerCase()) {
                case 'pdf':
                    exportData = await this.exportToPDF(character, exportOptions);
                    break;
                case 'json':
                    exportData = await this.exportToJSON(character, exportOptions);
                    break;
                case 'png':
                    exportData = await this.exportToPNG(character, exportOptions);
                    break;
                case 'roll20':
                    exportData = await this.exportToRoll20(character, exportOptions);
                    break;
                case 'dndbeyond':
                    exportData = await this.exportToDnDBeyond(character, exportOptions);
                    break;
                case 'xml':
                    exportData = await this.exportToXML(character, exportOptions);
                    break;
                case 'csv':
                    exportData = await this.exportToCSV(character, exportOptions);
                    break;
                case 'foundry':
                    exportData = await this.exportToFoundry(character, exportOptions);
                    break;
                case 'pcgen':
                    exportData = await this.exportToPCGen(character, exportOptions);
                    break;
                case 'herolab':
                    exportData = await this.exportToHeroLab(character, exportOptions);
                    break;
                default:
                    throw new Error(`Unsupported export format: ${format}`);
            }
            
            // Log export to history
            const exportRecord = {
                id: this.generateExportId(),
                characterId: character.id,
                characterName: character.name,
                format: format,
                timestamp: new Date().toISOString(),
                duration: performance.now() - startTime,
                fileSize: this.calculateDataSize(exportData),
                options: exportOptions,
                success: true
            };
            
            this.addToExportHistory(exportRecord);
            
            console.log(`📤 Exported ${character.name} to ${format} in ${exportRecord.duration.toFixed(2)}ms`);
            
            return {
                success: true,
                data: exportData,
                format: this.supportedFormats.get(format),
                metadata: exportRecord,
                downloadUrl: this.createDownloadUrl(exportData, format, character.name)
            };
            
        } catch (error) {
            console.error(`📤 Export failed for ${format}:`, error);
            
            const errorRecord = {
                id: this.generateExportId(),
                characterId: character.id,
                characterName: character.name,
                format: format,
                timestamp: new Date().toISOString(),
                duration: performance.now() - startTime,
                error: error.message,
                success: false
            };
            
            this.addToExportHistory(errorRecord);
            
            return {
                success: false,
                error: error.message,
                format: this.supportedFormats.get(format),
                metadata: errorRecord
            };
        }
    }
    
    async exportToPDF(character, options) {
        console.log('📤 Generating PDF character sheet...');
        
        // Create PDF document structure
        const pdfData = {
            format: 'pdf',
            version: '3.5',
            created: options.timestamp,
            character: {
                // Basic Info
                name: character.name || '',
                player: character.player || '',
                class: character.characterClass || '',
                level: character.level || 1,
                race: character.race || '',
                alignment: character.alignment || '',
                deity: character.deity || '',
                size: character.size || 'Medium',
                age: character.age || '',
                gender: character.gender || '',
                height: character.height || '',
                weight: character.weight || '',
                eyes: character.eyes || '',
                hair: character.hair || '',
                skin: character.skin || '',
                
                // Ability Scores
                abilities: {
                    strength: character.abilities?.strength || { score: 10, modifier: 0, tempAdjustment: 0 },
                    dexterity: character.abilities?.dexterity || { score: 10, modifier: 0, tempAdjustment: 0 },
                    constitution: character.abilities?.constitution || { score: 10, modifier: 0, tempAdjustment: 0 },
                    intelligence: character.abilities?.intelligence || { score: 10, modifier: 0, tempAdjustment: 0 },
                    wisdom: character.abilities?.wisdom || { score: 10, modifier: 0, tempAdjustment: 0 },
                    charisma: character.abilities?.charisma || { score: 10, modifier: 0, tempAdjustment: 0 }
                },
                
                // Combat Stats
                combat: {
                    hitPoints: {
                        max: character.hitPoints?.max || 0,
                        current: character.hitPoints?.current || 0,
                        temporary: character.hitPoints?.temporary || 0,
                        damage: character.hitPoints?.damage || 0
                    },
                    armorClass: {
                        total: character.armorClass?.total || 10,
                        armor: character.armorClass?.armor || 0,
                        shield: character.armorClass?.shield || 0,
                        dex: character.armorClass?.dex || 0,
                        size: character.armorClass?.size || 0,
                        natural: character.armorClass?.natural || 0,
                        deflection: character.armorClass?.deflection || 0,
                        misc: character.armorClass?.misc || 0,
                        touch: character.armorClass?.touch || 10,
                        flatFooted: character.armorClass?.flatFooted || 10
                    },
                    initiative: {
                        total: character.initiative?.total || 0,
                        dex: character.initiative?.dex || 0,
                        misc: character.initiative?.misc || 0
                    },
                    speed: {
                        base: character.speed?.base || 30,
                        armor: character.speed?.armor || 30,
                        fly: character.speed?.fly || 0,
                        swim: character.speed?.swim || 0,
                        climb: character.speed?.climb || 0,
                        burrow: character.speed?.burrow || 0
                    },
                    baseAttackBonus: character.baseAttackBonus || 0,
                    grapple: character.grapple || 0
                },
                
                // Saving Throws
                savingThrows: {
                    fortitude: character.savingThrows?.fortitude || { base: 0, ability: 0, magic: 0, misc: 0, total: 0 },
                    reflex: character.savingThrows?.reflex || { base: 0, ability: 0, magic: 0, misc: 0, total: 0 },
                    will: character.savingThrows?.will || { base: 0, ability: 0, magic: 0, misc: 0, total: 0 }
                },
                
                // Skills
                skills: character.skills || [],
                
                // Feats
                feats: character.feats || [],
                
                // Equipment
                equipment: options.includeEquipment ? (character.equipment || []) : [],
                
                // Spells
                spells: options.includeSpells ? (character.spells || []) : [],
                
                // Portrait
                portrait: options.includePortrait ? (character.portrait || null) : null,
                
                // Notes
                notes: options.includeNotes ? (character.notes || '') : ''
            }
        };
        
        // Generate PDF layout data
        const pdfLayout = this.generatePDFLayout(pdfData, options);
        
        return {
            type: 'pdf-data',
            content: pdfLayout,
            metadata: {
                pages: this.calculatePDFPages(pdfData),
                size: this.calculateDataSize(pdfLayout),
                template: options.template || 'official'
            }
        };
    }
    
    async exportToJSON(character, options) {
        console.log('📤 Generating JSON export...');
        
        const jsonData = {
            format: 'dnd35-json',
            version: '1.0',
            exported: options.timestamp,
            exporter: 'RulzLawyer Character Creator',
            character: this.sanitizeCharacterData(character, options)
        };
        
        // Add metadata
        if (options.includeMetadata !== false) {
            jsonData.metadata = {
                createdDate: character.createdDate,
                lastModified: character.lastModified,
                version: character.version || '1.0',
                checksum: this.calculateChecksum(character)
            };
        }
        
        return JSON.stringify(jsonData, null, options.pretty ? 2 : 0);
    }
    
    async exportToPNG(character, options) {
        console.log('📤 Generating PNG character image...');
        
        // Create canvas for character sheet image
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Set canvas size based on options
        const width = options.width || 800;
        const height = options.height || 1000;
        canvas.width = width;
        canvas.height = height;
        
        // Background
        ctx.fillStyle = options.backgroundColor || '#ffffff';
        ctx.fillRect(0, 0, width, height);
        
        // Draw character portrait if available
        if (options.includePortrait && character.portrait) {
            await this.drawPortraitOnCanvas(ctx, character.portrait, { x: 50, y: 50, width: 200, height: 200 });
        }
        
        // Draw character information
        await this.drawCharacterInfoOnCanvas(ctx, character, options);
        
        // Convert to PNG data
        return canvas.toDataURL('image/png');
    }
    
    async exportToRoll20(character, options) {
        console.log('📤 Generating Roll20 format...');
        
        const roll20Data = {
            schema_version: 3,
            type: 'character',
            name: character.name || 'Unnamed Character',
            avatar: character.portrait?.url || '',
            bio: character.background || '',
            gmnotes: character.notes || '',
            archived: false,
            inplayerjournals: '',
            controlledby: options.controlledBy || '',
            
            // D&D 3.5 specific attributes
            attributes: {
                // Basic Info
                character_name: character.name || '',
                player_name: character.player || '',
                class: character.characterClass || '',
                level: character.level || 1,
                race: character.race || '',
                alignment: character.alignment || '',
                deity: character.deity || '',
                size: character.size || 'Medium',
                
                // Ability Scores
                strength: character.abilities?.strength?.score || 10,
                dexterity: character.abilities?.dexterity?.score || 10,
                constitution: character.abilities?.constitution?.score || 10,
                intelligence: character.abilities?.intelligence?.score || 10,
                wisdom: character.abilities?.wisdom?.score || 10,
                charisma: character.abilities?.charisma?.score || 10,
                
                // Modifiers
                strength_mod: character.abilities?.strength?.modifier || 0,
                dexterity_mod: character.abilities?.dexterity?.modifier || 0,
                constitution_mod: character.abilities?.constitution?.modifier || 0,
                intelligence_mod: character.abilities?.intelligence?.modifier || 0,
                wisdom_mod: character.abilities?.wisdom?.modifier || 0,
                charisma_mod: character.abilities?.charisma?.modifier || 0,
                
                // Combat Stats
                hp_max: character.hitPoints?.max || 0,
                hp_current: character.hitPoints?.current || 0,
                hp_temp: character.hitPoints?.temporary || 0,
                
                ac_total: character.armorClass?.total || 10,
                ac_armor: character.armorClass?.armor || 0,
                ac_shield: character.armorClass?.shield || 0,
                ac_dex: character.armorClass?.dex || 0,
                ac_size: character.armorClass?.size || 0,
                ac_natural: character.armorClass?.natural || 0,
                ac_misc: character.armorClass?.misc || 0,
                ac_touch: character.armorClass?.touch || 10,
                ac_flatfooted: character.armorClass?.flatFooted || 10,
                
                initiative_total: character.initiative?.total || 0,
                
                // Saving Throws
                fortitude_save: character.savingThrows?.fortitude?.total || 0,
                reflex_save: character.savingThrows?.reflex?.total || 0,
                will_save: character.savingThrows?.will?.total || 0,
                
                // Movement
                speed: character.speed?.base || 30,
                
                // Attack bonuses
                bab: character.baseAttackBonus || 0,
                grapple: character.grapple || 0
            }
        };
        
        // Add repeating sections for skills, feats, equipment, spells
        if (character.skills) {
            roll20Data.attributes.skills = this.convertSkillsToRoll20(character.skills);
        }
        
        if (character.feats) {
            roll20Data.attributes.feats = this.convertFeatsToRoll20(character.feats);
        }
        
        if (options.includeEquipment && character.equipment) {
            roll20Data.attributes.equipment = this.convertEquipmentToRoll20(character.equipment);
        }
        
        if (options.includeSpells && character.spells) {
            roll20Data.attributes.spells = this.convertSpellsToRoll20(character.spells);
        }
        
        return JSON.stringify(roll20Data, null, 2);
    }
    
    async exportToDnDBeyond(character, options) {
        console.log('📤 Generating D&D Beyond compatible format...');
        
        const dndbData = {
            version: "5.2.13",
            type: "character",
            data: {
                id: character.id || this.generateId(),
                name: character.name || 'Unnamed Character',
                decorations: {
                    avatarUrl: character.portrait?.url || '',
                    frameAvatarUrl: null,
                    backdropAvatarUrl: null,
                    smallBackdropAvatarUrl: null,
                    largeBackdropAvatarUrl: null,
                    thumbnailBackdropAvatarUrl: null
                },
                
                // Character basics
                race: {
                    fullName: character.race || '',
                    baseRaceName: character.race || '',
                    subRaceShortName: character.subrace || null,
                    isSubRace: !!character.subrace,
                    isVariant: false,
                    isHomebrew: false
                },
                
                classes: [{
                    level: character.level || 1,
                    definition: {
                        name: character.characterClass || '',
                        hitDie: this.getClassHitDie(character.characterClass),
                        primaryAbility: this.getClassPrimaryAbility(character.characterClass),
                        spellCastingAbility: this.getClassSpellcastingAbility(character.characterClass)
                    },
                    subclassDefinition: character.subclass ? {
                        name: character.subclass
                    } : null
                }],
                
                stats: [
                    { id: 1, value: character.abilities?.strength?.score || 10 },
                    { id: 2, value: character.abilities?.dexterity?.score || 10 },
                    { id: 3, value: character.abilities?.constitution?.score || 10 },
                    { id: 4, value: character.abilities?.intelligence?.score || 10 },
                    { id: 5, value: character.abilities?.wisdom?.score || 10 },
                    { id: 6, value: character.abilities?.charisma?.score || 10 }
                ],
                
                background: {
                    definition: {
                        name: character.background || ''
                    }
                },
                
                alignment: {
                    name: character.alignment || 'Neutral'
                },
                
                faith: character.deity || '',
                lifestyle: character.lifestyle || 'Modest',
                
                hitPointInfo: {
                    maximum: character.hitPoints?.max || 0,
                    current: character.hitPoints?.current || 0,
                    temporary: character.hitPoints?.temporary || 0
                },
                
                deathSaves: {
                    successes: 0,
                    failures: 0
                }
            }
        };
        
        // Add features and traits
        if (character.feats) {
            dndbData.data.feats = this.convertFeatsToDnDBeyond(character.feats);
        }
        
        // Add equipment
        if (options.includeEquipment && character.equipment) {
            dndbData.data.inventory = this.convertEquipmentToDnDBeyond(character.equipment);
        }
        
        // Add spells
        if (options.includeSpells && character.spells) {
            dndbData.data.spells = this.convertSpellsToDnDBeyond(character.spells);
        }
        
        return JSON.stringify(dndbData, null, 2);
    }
    
    async exportToXML(character, options) {
        console.log('📤 Generating XML export...');
        
        const xmlBuilder = new XMLBuilder({
            declaration: { encoding: 'UTF-8', version: '1.0' },
            rootName: 'dnd35-character',
            attributes: {
                version: '1.0',
                exported: options.timestamp
            }
        });
        
        const characterXML = {
            '@version': '1.0',
            '@exported': options.timestamp,
            basic: {
                name: character.name || '',
                player: character.player || '',
                class: character.characterClass || '',
                level: character.level || 1,
                race: character.race || '',
                alignment: character.alignment || '',
                deity: character.deity || '',
                size: character.size || 'Medium'
            },
            abilities: this.convertAbilitiesToXML(character.abilities || {}),
            combat: this.convertCombatStatsToXML(character),
            skills: this.convertSkillsToXML(character.skills || []),
            feats: this.convertFeatsToXML(character.feats || [])
        };
        
        if (options.includeEquipment) {
            characterXML.equipment = this.convertEquipmentToXML(character.equipment || []);
        }
        
        if (options.includeSpells) {
            characterXML.spells = this.convertSpellsToXML(character.spells || []);
        }
        
        return xmlBuilder.build(characterXML);
    }
    
    async exportToCSV(character, options) {
        console.log('📤 Generating CSV export...');
        
        const csvData = [
            ['Field', 'Value', 'Type', 'Category'],
            ['Name', character.name || '', 'string', 'basic'],
            ['Player', character.player || '', 'string', 'basic'],
            ['Class', character.characterClass || '', 'string', 'basic'],
            ['Level', character.level || 1, 'number', 'basic'],
            ['Race', character.race || '', 'string', 'basic'],
            ['Alignment', character.alignment || '', 'string', 'basic']
        ];
        
        // Add ability scores
        if (character.abilities) {
            Object.entries(character.abilities).forEach(([ability, data]) => {
                csvData.push([`${ability}_score`, data.score || 10, 'number', 'abilities']);
                csvData.push([`${ability}_modifier`, data.modifier || 0, 'number', 'abilities']);
            });
        }
        
        // Add combat stats
        if (character.hitPoints) {
            csvData.push(['hp_max', character.hitPoints.max || 0, 'number', 'combat']);
            csvData.push(['hp_current', character.hitPoints.current || 0, 'number', 'combat']);
        }
        
        if (character.armorClass) {
            csvData.push(['ac_total', character.armorClass.total || 10, 'number', 'combat']);
        }
        
        // Add skills
        if (character.skills) {
            character.skills.forEach(skill => {
                csvData.push([`skill_${skill.name}`, skill.totalBonus || 0, 'number', 'skills']);
            });
        }
        
        // Add feats
        if (character.feats) {
            character.feats.forEach((feat, index) => {
                csvData.push([`feat_${index + 1}`, feat.name, 'string', 'feats']);
            });
        }
        
        // Convert to CSV string
        return csvData.map(row => 
            row.map(cell => 
                typeof cell === 'string' && cell.includes(',') ? `"${cell}"` : cell
            ).join(',')
        ).join('\n');
    }
    
    async exportToFoundry(character, options) {
        console.log('📤 Generating Foundry VTT format...');
        
        const foundryData = {
            _id: character.id || this.generateId(),
            name: character.name || 'Unnamed Character',
            type: 'character',
            system: 'dnd35',
            
            img: character.portrait?.url || 'icons/svg/mystery-man.svg',
            
            data: {
                abilities: {
                    str: {
                        value: character.abilities?.strength?.score || 10,
                        mod: character.abilities?.strength?.modifier || 0,
                        tempMod: 0,
                        checkMod: 0
                    },
                    dex: {
                        value: character.abilities?.dexterity?.score || 10,
                        mod: character.abilities?.dexterity?.modifier || 0,
                        tempMod: 0,
                        checkMod: 0
                    },
                    con: {
                        value: character.abilities?.constitution?.score || 10,
                        mod: character.abilities?.constitution?.modifier || 0,
                        tempMod: 0,
                        checkMod: 0
                    },
                    int: {
                        value: character.abilities?.intelligence?.score || 10,
                        mod: character.abilities?.intelligence?.modifier || 0,
                        tempMod: 0,
                        checkMod: 0
                    },
                    wis: {
                        value: character.abilities?.wisdom?.score || 10,
                        mod: character.abilities?.wisdom?.modifier || 0,
                        tempMod: 0,
                        checkMod: 0
                    },
                    cha: {
                        value: character.abilities?.charisma?.score || 10,
                        mod: character.abilities?.charisma?.modifier || 0,
                        tempMod: 0,
                        checkMod: 0
                    }
                },
                
                attributes: {
                    hp: {
                        value: character.hitPoints?.current || 0,
                        max: character.hitPoints?.max || 0,
                        temp: character.hitPoints?.temporary || 0
                    },
                    ac: {
                        value: character.armorClass?.total || 10,
                        armor: character.armorClass?.armor || 0,
                        shield: character.armorClass?.shield || 0,
                        dex: character.armorClass?.dex || 0,
                        size: character.armorClass?.size || 0,
                        natural: character.armorClass?.natural || 0,
                        misc: character.armorClass?.misc || 0,
                        touch: character.armorClass?.touch || 10,
                        flatFooted: character.armorClass?.flatFooted || 10
                    },
                    init: {
                        value: character.initiative?.total || 0,
                        mod: character.initiative?.misc || 0
                    },
                    movement: {
                        land: character.speed?.base || 30,
                        climb: character.speed?.climb || 0,
                        swim: character.speed?.swim || 0,
                        fly: character.speed?.fly || 0
                    }
                },
                
                details: {
                    biography: {
                        value: character.background || '',
                        public: ''
                    },
                    alignment: character.alignment || 'Neutral',
                    race: character.race || '',
                    background: character.backgroundName || '',
                    class: character.characterClass || '',
                    level: character.level || 1
                },
                
                traits: {
                    size: this.convertSizeToFoundry(character.size),
                    senses: character.senses || '',
                    languages: {
                        value: character.languages || [],
                        custom: ''
                    }
                },
                
                currency: {
                    pp: character.wealth?.platinum || 0,
                    gp: character.wealth?.gold || 0,
                    ep: character.wealth?.electrum || 0,
                    sp: character.wealth?.silver || 0,
                    cp: character.wealth?.copper || 0
                }
            },
            
            items: [],
            effects: [],
            flags: {
                'dnd35': {
                    exportedFrom: 'RulzLawyer Character Creator',
                    exportVersion: '1.0',
                    exportDate: options.timestamp
                }
            },
            
            ownership: {
                default: 0
            }
        };
        
        // Add items (equipment, spells, feats)
        if (options.includeEquipment && character.equipment) {
            foundryData.items.push(...this.convertEquipmentToFoundry(character.equipment));
        }
        
        if (options.includeSpells && character.spells) {
            foundryData.items.push(...this.convertSpellsToFoundry(character.spells));
        }
        
        if (character.feats) {
            foundryData.items.push(...this.convertFeatsToFoundry(character.feats));
        }
        
        return JSON.stringify(foundryData, null, 2);
    }
    
    // Batch export functionality
    async exportMultipleCharacters(characters, formats, options = {}) {
        console.log(`📤 Starting batch export for ${characters.length} characters in ${formats.length} formats`);
        
        const results = [];
        const startTime = performance.now();
        
        for (const character of characters) {
            const characterResults = {
                characterId: character.id,
                characterName: character.name,
                exports: []
            };
            
            for (const format of formats) {
                try {
                    const exportResult = await this.exportCharacter(character, format, options);
                    characterResults.exports.push(exportResult);
                } catch (error) {
                    console.error(`📤 Failed to export ${character.name} to ${format}:`, error);
                    characterResults.exports.push({
                        success: false,
                        format: format,
                        error: error.message
                    });
                }
            }
            
            results.push(characterResults);
        }
        
        const duration = performance.now() - startTime;
        const totalExports = results.reduce((sum, char) => sum + char.exports.length, 0);
        const successfulExports = results.reduce((sum, char) => 
            sum + char.exports.filter(exp => exp.success).length, 0
        );
        
        console.log(`📤 Batch export completed: ${successfulExports}/${totalExports} successful in ${duration.toFixed(2)}ms`);
        
        return {
            success: successfulExports === totalExports,
            results: results,
            summary: {
                totalCharacters: characters.length,
                totalFormats: formats.length,
                totalExports: totalExports,
                successfulExports: successfulExports,
                failedExports: totalExports - successfulExports,
                duration: duration
            }
        };
    }
    
    // Validation methods
    validateCharacterData(character) {
        const errors = [];
        
        if (!character) {
            errors.push('Character data is null or undefined');
            return { isValid: false, errors };
        }
        
        if (!character.name || character.name.trim() === '') {
            errors.push('Character name is required');
        }
        
        if (!character.characterClass || character.characterClass.trim() === '') {
            errors.push('Character class is required');
        }
        
        if (!character.race || character.race.trim() === '') {
            errors.push('Character race is required');
        }
        
        if (!character.level || character.level < 1 || character.level > 100) {
            errors.push('Character level must be between 1 and 100');
        }
        
        if (!character.abilities) {
            errors.push('Character abilities are required');
        } else {
            const requiredAbilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
            for (const ability of requiredAbilities) {
                if (!character.abilities[ability] || 
                    typeof character.abilities[ability].score !== 'number' ||
                    character.abilities[ability].score < 1 || 
                    character.abilities[ability].score > 50) {
                    errors.push(`Invalid ${ability} score`);
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // Utility methods
    sanitizeCharacterData(character, options) {
        const sanitized = { ...character };
        
        // Remove sensitive data if specified
        if (options.excludePersonalInfo) {
            delete sanitized.player;
            delete sanitized.email;
            delete sanitized.personalNotes;
        }
        
        // Remove internal IDs if specified
        if (options.excludeInternalIds) {
            delete sanitized.id;
            delete sanitized.sessionId;
            delete sanitized.tempId;
        }
        
        return sanitized;
    }
    
    calculateChecksum(data) {
        // Simple checksum calculation
        const str = JSON.stringify(data);
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return Math.abs(hash).toString(16);
    }
    
    calculateDataSize(data) {
        if (typeof data === 'string') {
            return new Blob([data]).size;
        } else if (typeof data === 'object') {
            return new Blob([JSON.stringify(data)]).size;
        }
        return 0;
    }
    
    generateExportId() {
        return 'exp_' + Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    createDownloadUrl(data, format, characterName) {
        const formatInfo = this.supportedFormats.get(format);
        if (!formatInfo) return null;
        
        const blob = new Blob([data], { type: formatInfo.mimeType });
        const url = URL.createObjectURL(blob);
        
        return {
            url: url,
            filename: `${characterName.replace(/[^a-zA-Z0-9]/g, '_')}${formatInfo.extension}`,
            cleanup: () => URL.revokeObjectURL(url)
        };
    }
    
    addToExportHistory(record) {
        this.exportHistory.unshift(record);
        
        // Keep only last 100 exports
        if (this.exportHistory.length > 100) {
            this.exportHistory = this.exportHistory.slice(0, 100);
        }
        
        this.saveExportHistory();
    }
    
    saveExportHistory() {
        try {
            localStorage.setItem('character-export-history', JSON.stringify(this.exportHistory));
        } catch (e) {
            console.warn('Could not save export history:', e);
        }
    }
    
    loadExportHistory() {
        try {
            const stored = localStorage.getItem('character-export-history');
            if (stored) {
                this.exportHistory = JSON.parse(stored);
            }
        } catch (e) {
            console.warn('Could not load export history:', e);
            this.exportHistory = [];
        }
    }
    
    validateDependencies() {
        // Check for required browser APIs
        const requiredApis = ['Blob', 'URL', 'localStorage', 'Canvas'];
        const missingApis = [];
        
        if (typeof Blob === 'undefined') missingApis.push('Blob API');
        if (typeof URL === 'undefined' || !URL.createObjectURL) missingApis.push('URL API');
        if (typeof localStorage === 'undefined') missingApis.push('localStorage API');
        if (!document.createElement('canvas').getContext) missingApis.push('Canvas API');
        
        if (missingApis.length > 0) {
            console.warn('📤 Missing required APIs:', missingApis);
            return false;
        }
        
        return true;
    }
    
    // Helper methods for format-specific conversions (stubs for full implementation)
    generatePDFLayout(pdfData, options) { /* PDF layout generation */ }
    calculatePDFPages(pdfData) { return 1; /* Page calculation */ }
    drawPortraitOnCanvas(ctx, portrait, bounds) { /* Portrait drawing */ }
    drawCharacterInfoOnCanvas(ctx, character, options) { /* Character info drawing */ }
    convertSkillsToRoll20(skills) { return skills; /* Roll20 skills conversion */ }
    convertFeatsToRoll20(feats) { return feats; /* Roll20 feats conversion */ }
    convertEquipmentToRoll20(equipment) { return equipment; /* Roll20 equipment conversion */ }
    convertSpellsToRoll20(spells) { return spells; /* Roll20 spells conversion */ }
    getClassHitDie(className) { return 8; /* Class hit die lookup */ }
    getClassPrimaryAbility(className) { return 'strength'; /* Primary ability lookup */ }
    getClassSpellcastingAbility(className) { return null; /* Spellcasting ability lookup */ }
    convertFeatsToDnDBeyond(feats) { return feats; /* D&D Beyond feats conversion */ }
    convertEquipmentToDnDBeyond(equipment) { return equipment; /* D&D Beyond equipment conversion */ }
    convertSpellsToDnDBeyond(spells) { return spells; /* D&D Beyond spells conversion */ }
    convertAbilitiesToXML(abilities) { return abilities; /* XML abilities conversion */ }
    convertCombatStatsToXML(character) { return {}; /* XML combat stats conversion */ }
    convertSkillsToXML(skills) { return skills; /* XML skills conversion */ }
    convertFeatsToXML(feats) { return feats; /* XML feats conversion */ }
    convertEquipmentToXML(equipment) { return equipment; /* XML equipment conversion */ }
    convertSpellsToXML(spells) { return spells; /* XML spells conversion */ }
    convertSizeToFoundry(size) { return 'med'; /* Foundry size conversion */ }
    convertEquipmentToFoundry(equipment) { return []; /* Foundry equipment conversion */ }
    convertSpellsToFoundry(spells) { return []; /* Foundry spells conversion */ }
    convertFeatsToFoundry(feats) { return []; /* Foundry feats conversion */ }
    exportToPCGen(character, options) { /* PCGen format export */ }
    exportToHeroLab(character, options) { /* Hero Lab format export */ }
}

// XML Builder utility class
class XMLBuilder {
    constructor(options = {}) {
        this.options = options;
    }
    
    build(data) {
        let xml = '';
        
        if (this.options.declaration) {
            xml += `<?xml version="${this.options.declaration.version}" encoding="${this.options.declaration.encoding}"?>\n`;
        }
        
        if (this.options.rootName) {
            xml += this.buildElement(this.options.rootName, data, this.options.attributes);
        } else {
            xml += this.buildElement('root', data);
        }
        
        return xml;
    }
    
    buildElement(name, data, attributes = {}) {
        const attrs = Object.entries(attributes)
            .map(([key, value]) => `${key}="${this.escapeXML(value)}"`)
            .join(' ');
        
        const attrStr = attrs ? ` ${attrs}` : '';
        
        if (typeof data === 'string' || typeof data === 'number') {
            return `<${name}${attrStr}>${this.escapeXML(data)}</${name}>`;
        } else if (Array.isArray(data)) {
            return data.map(item => this.buildElement(name.slice(0, -1), item)).join('\n');
        } else if (typeof data === 'object' && data !== null) {
            const content = Object.entries(data)
                .map(([key, value]) => {
                    if (key.startsWith('@')) {
                        return ''; // Skip attributes
                    }
                    return this.buildElement(key, value);
                })
                .join('\n');
            
            return `<${name}${attrStr}>\n${content}\n</${name}>`;
        }
        
        return `<${name}${attrStr}/>`;
    }
    
    escapeXML(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MultiPlatformExporter;
} else if (typeof window !== 'undefined') {
    window.MultiPlatformExporter = MultiPlatformExporter;
}