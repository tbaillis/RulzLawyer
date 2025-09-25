/**
 * CharacterSheetRenderer - Complete D&D 3.5 Character Sheet Display System
 * Renders fully detailed character sheets with all stats, abilities, spells, and equipment
 * 
 * Features:
 * - Complete character stat display
 * - Ability scores with modifiers
 * - Skills with ranks and modifiers
 * - Feats and class features
 * - Equipment and inventory management
 * - Spell lists for spellcasters
 * - Combat statistics (AC, HP, saves, BAB)
 * - Epic level displays
 * - Interactive sheet elements
 * - Print-friendly formatting
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class CharacterSheetRenderer {
    constructor(srdDataManager, spellManager, epicLevelManager) {
        this.srdData = srdDataManager;
        this.spellManager = spellManager;
        this.epicManager = epicLevelManager;

        console.log('📄 CharacterSheetRenderer initialized for complete character display');
    }

    /**
     * Render complete character sheet
     */
    renderCharacterSheet(character) {
        const html = `
            <div class="character-sheet-complete">
                <div class="sheet-header">
                    ${this.renderCharacterHeader(character)}
                </div>
                
                <div class="sheet-body">
                    <div class="sheet-left-column">
                        ${this.renderAbilityScores(character)}
                        ${this.renderCombatStats(character)}
                        ${this.renderSavingThrows(character)}
                        ${this.renderSkillsSection(character)}
                    </div>
                    
                    <div class="sheet-right-column">
                        ${this.renderFeatsAndFeatures(character)}
                        ${this.renderEquipmentSection(character)}
                        ${this.renderSpellsSection(character)}
                        ${this.renderEpicSection(character)}
                    </div>
                </div>
                
                <div class="sheet-footer">
                    ${this.renderCharacterNotes(character)}
                </div>
            </div>
        `;

        return html;
    }

    /**
     * Render character header with basic info
     */
    renderCharacterHeader(character) {
        const epicSummary = this.epicManager?.getEpicSummary(character);

        return `
            <div class="character-header">
                <div class="character-name-section">
                    <h1 class="character-name">${character.name}</h1>
                    <div class="character-title">
                        ${character.race} ${character.characterClass}
                        ${epicSummary ? `, ${epicSummary.divineTitle}` : ''}
                    </div>
                </div>
                
                <div class="character-level-section">
                    <div class="level-display">
                        <span class="level-label">Level</span>
                        <span class="level-value">${character.level}</span>
                        ${epicSummary ? `<span class="epic-level">(Epic ${epicSummary.epicLevel})</span>` : ''}
                    </div>
                    
                    <div class="xp-display">
                        <span class="xp-label">Experience Points</span>
                        <span class="xp-value">${character.experiencePoints || 0}</span>
                    </div>
                </div>
                
                <div class="character-vitals">
                    <div class="alignment">
                        <span class="vital-label">Alignment:</span>
                        <span class="vital-value">${character.alignment || 'Neutral'}</span>
                    </div>
                    
                    <div class="deity">
                        <span class="vital-label">Deity:</span>
                        <span class="vital-value">${character.deity || 'None'}</span>
                    </div>
                    
                    <div class="size">
                        <span class="vital-label">Size:</span>
                        <span class="vital-value">${character.size || 'Medium'}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render ability scores section
     */
    renderAbilityScores(character) {
        const abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

        let abilitiesHtml = '';
        abilities.forEach(ability => {
            const score = character.abilities[ability] || 10;
            const modifier = Math.floor((score - 10) / 2);
            const modifierText = modifier >= 0 ? `+${modifier}` : `${modifier}`;

            abilitiesHtml += `
                <div class="ability-block">
                    <div class="ability-name">${ability.toUpperCase().substring(0, 3)}</div>
                    <div class="ability-score">${score}</div>
                    <div class="ability-modifier">${modifierText}</div>
                </div>
            `;
        });

        return `
            <div class="abilities-section">
                <h3 class="section-title">Ability Scores</h3>
                <div class="abilities-grid">
                    ${abilitiesHtml}
                </div>
            </div>
        `;
    }

    /**
     * Render combat statistics
     */
    renderCombatStats(character) {
        const bab = this.calculateBAB(character);
        const ac = this.calculateArmorClass(character);
        const hp = this.calculateHitPoints(character);
        const initiative = this.calculateInitiative(character);

        return `
            <div class="combat-stats-section">
                <h3 class="section-title">Combat Statistics</h3>
                
                <div class="combat-stats-grid">
                    <div class="combat-stat">
                        <span class="stat-label">Armor Class</span>
                        <span class="stat-value">${ac.total}</span>
                        <div class="stat-breakdown">
                            (${ac.base} base + ${ac.armor} armor + ${ac.shield} shield + ${ac.dex} Dex + ${ac.size} size + ${ac.natural} natural + ${ac.deflection} deflection)
                        </div>
                    </div>
                    
                    <div class="combat-stat">
                        <span class="stat-label">Hit Points</span>
                        <span class="stat-value">${hp.current}/${hp.max}</span>
                        <div class="stat-breakdown">
                            (${hp.classHP} class + ${hp.conHP} Con + ${hp.epicHP} epic + ${hp.other} other)
                        </div>
                    </div>
                    
                    <div class="combat-stat">
                        <span class="stat-label">Initiative</span>
                        <span class="stat-value">${initiative >= 0 ? '+' : ''}${initiative}</span>
                        <div class="stat-breakdown">
                            (${this.calculateAbilityModifier(character.abilities.dexterity)} Dex + ${character.initiativeBonus || 0} misc)
                        </div>
                    </div>
                    
                    <div class="combat-stat">
                        <span class="stat-label">Base Attack</span>
                        <span class="stat-value">+${bab}</span>
                        <div class="stat-breakdown">
                            ${this.getAttackSequence(bab)}
                        </div>
                    </div>
                    
                    <div class="combat-stat">
                        <span class="stat-label">Speed</span>
                        <span class="stat-value">${character.speed || 30} ft</span>
                        <div class="stat-breakdown">
                            (${character.baseSpeed || 30} ft base)
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render saving throws
     */
    renderSavingThrows(character) {
        const saves = this.calculateSavingThrows(character);

        return `
            <div class="saves-section">
                <h3 class="section-title">Saving Throws</h3>
                
                <div class="saves-grid">
                    <div class="save-stat">
                        <div class="save-name">Fortitude</div>
                        <div class="save-value">${saves.fortitude >= 0 ? '+' : ''}${saves.fortitude}</div>
                        <div class="save-breakdown">
                            (${saves.fortitudeBase} base + ${this.calculateAbilityModifier(character.abilities.constitution)} Con + ${saves.fortitudeMisc} misc)
                        </div>
                    </div>
                    
                    <div class="save-stat">
                        <div class="save-name">Reflex</div>
                        <div class="save-value">${saves.reflex >= 0 ? '+' : ''}${saves.reflex}</div>
                        <div class="save-breakdown">
                            (${saves.reflexBase} base + ${this.calculateAbilityModifier(character.abilities.dexterity)} Dex + ${saves.reflexMisc} misc)
                        </div>
                    </div>
                    
                    <div class="save-stat">
                        <div class="save-name">Will</div>
                        <div class="save-value">${saves.will >= 0 ? '+' : ''}${saves.will}</div>
                        <div class="save-breakdown">
                            (${saves.willBase} base + ${this.calculateAbilityModifier(character.abilities.wisdom)} Wis + ${saves.willMisc} misc)
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render skills section
     */
    renderSkillsSection(character) {
        const skills = this.srdData.skills || [];
        const characterClass = this.srdData.classes?.find(c => c.name === character.characterClass);
        const classSkills = characterClass?.progression?.class_skills || [];

        let skillsHtml = '';
        skills.forEach(skill => {
            const isClassSkill = classSkills.includes(skill.name);
            const ranks = character.skills?.[skill.name] || 0;
            const abilityMod = this.calculateAbilityModifier(character.abilities[skill.ability.toLowerCase()] || 10);
            const miscMod = character.skillBonuses?.[skill.name] || 0;
            const total = ranks + abilityMod + miscMod;

            if (ranks > 0 || isClassSkill) {
                skillsHtml += `
                    <div class="skill-row ${isClassSkill ? 'class-skill' : ''}">
                        <div class="skill-name">
                            ${skill.name}
                            ${isClassSkill ? '<span class="class-skill-marker">●</span>' : ''}
                            ${skill.trained_only ? '<span class="trained-only">*</span>' : ''}
                        </div>
                        <div class="skill-total">${total >= 0 ? '+' : ''}${total}</div>
                        <div class="skill-breakdown">
                            (${ranks} ranks + ${abilityMod} ${skill.ability} ${miscMod !== 0 ? `+ ${miscMod} misc` : ''})
                        </div>
                    </div>
                `;
            }
        });

        return `
            <div class="skills-section">
                <h3 class="section-title">Skills</h3>
                <div class="skills-list">
                    ${skillsHtml || '<p class="no-skills">No trained skills</p>'}
                </div>
                <div class="skill-legend">
                    <span>● Class Skill</span>
                    <span>* Trained Only</span>
                </div>
            </div>
        `;
    }

    /**
     * Render feats and class features
     */
    renderFeatsAndFeatures(character) {
        let featsHtml = '';
        if (character.feats && character.feats.length > 0) {
            character.feats.forEach(featName => {
                const feat = this.srdData.feats?.find(f => f.name === featName);
                featsHtml += `
                    <div class="feat-item">
                        <div class="feat-name">${featName}</div>
                        ${feat ? `<div class="feat-description">${feat.description}</div>` : ''}
                    </div>
                `;
            });
        }

        // Class features
        let featuresHtml = '';
        const characterClass = this.srdData.classes?.find(c => c.name === character.characterClass);
        if (characterClass) {
            // Add basic class features here
            featuresHtml += `
                <div class="class-feature">
                    <div class="feature-name">Hit Die</div>
                    <div class="feature-description">d${characterClass.progression.hit_die}</div>
                </div>
                <div class="class-feature">
                    <div class="feature-name">Skill Points</div>
                    <div class="feature-description">${characterClass.progression.skill_points} + Int modifier per level</div>
                </div>
            `;
        }

        // Epic features
        let epicFeaturesHtml = '';
        if (character.epicFeatures && character.epicFeatures.length > 0) {
            character.epicFeatures.forEach(feature => {
                epicFeaturesHtml += `
                    <div class="epic-feature">
                        <div class="feature-name">Level ${feature.level}: ${feature.feature}</div>
                    </div>
                `;
            });
        }

        return `
            <div class="feats-features-section">
                <h3 class="section-title">Feats</h3>
                <div class="feats-list">
                    ${featsHtml || '<p class="no-feats">No feats selected</p>'}
                </div>
                
                <h3 class="section-title">Class Features</h3>
                <div class="features-list">
                    ${featuresHtml}
                </div>
                
                ${epicFeaturesHtml ? `
                    <h3 class="section-title">Epic Features</h3>
                    <div class="epic-features-list">
                        ${epicFeaturesHtml}
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render equipment section
     */
    renderEquipmentSection(character) {
        let equipmentHtml = '';

        if (character.equipment) {
            // Weapons
            if (character.equipment.weapons && character.equipment.weapons.length > 0) {
                equipmentHtml += '<h4>Weapons</h4><div class="weapons-list">';
                character.equipment.weapons.forEach(weapon => {
                    equipmentHtml += `
                        <div class="weapon-item">
                            <div class="weapon-name">${weapon.name}</div>
                            <div class="weapon-stats">
                                Damage: ${weapon.damage} | 
                                Critical: ${weapon.critical || '20/×2'} | 
                                Type: ${weapon.type || 'Melee'}
                            </div>
                        </div>
                    `;
                });
                equipmentHtml += '</div>';
            }

            // Armor
            if (character.equipment.armor && character.equipment.armor.length > 0) {
                equipmentHtml += '<h4>Armor</h4><div class="armor-list">';
                character.equipment.armor.forEach(armor => {
                    equipmentHtml += `
                        <div class="armor-item">
                            <div class="armor-name">${armor.name}</div>
                            <div class="armor-stats">
                                AC Bonus: +${armor.ac} | 
                                Type: ${armor.type} | 
                                Max Dex: ${armor.maxDex || 'unlimited'}
                            </div>
                        </div>
                    `;
                });
                equipmentHtml += '</div>';
            }

            // Gear
            if (character.equipment.gear && character.equipment.gear.length > 0) {
                equipmentHtml += '<h4>Equipment</h4><div class="gear-list">';
                character.equipment.gear.forEach(item => {
                    equipmentHtml += `
                        <div class="gear-item">
                            <span class="gear-name">${item.name}</span>
                            ${item.quantity > 1 ? `<span class="gear-quantity"> × ${item.quantity}</span>` : ''}
                        </div>
                    `;
                });
                equipmentHtml += '</div>';
            }

            // Money
            if (character.equipment.gold !== undefined) {
                equipmentHtml += `
                    <h4>Money</h4>
                    <div class="money-display">
                        <span class="money-amount">${character.equipment.gold} gp</span>
                    </div>
                `;
            }
        }

        return `
            <div class="equipment-section">
                <h3 class="section-title">Equipment & Possessions</h3>
                <div class="equipment-content">
                    ${equipmentHtml || '<p class="no-equipment">No equipment listed</p>'}
                </div>
            </div>
        `;
    }

    /**
     * Render spells section for spellcasters
     */
    renderSpellsSection(character) {
        if (!this.spellManager) {
            return '';
        }

        const spellList = this.spellManager.createSpellList(
            character.characterClass,
            character.level,
            character.abilities
        );

        if (!spellList.spellSlots || Object.keys(spellList.spellSlots).length === 0) {
            return ''; // Non-spellcaster
        }

        let spellsHtml = `
            <div class="spellcasting-info">
                <div class="casting-ability">
                    <span class="info-label">Casting Ability:</span>
                    <span class="info-value">${spellList.castingAbility}</span>
                </div>
                <div class="casting-modifier">
                    <span class="info-label">Spell Attack Bonus:</span>
                    <span class="info-value">+${spellList.castingMod}</span>
                </div>
            </div>
        `;

        // Spell slots by level
        spellsHtml += '<div class="spell-slots-grid">';
        for (let level = 0; level <= 9; level++) {
            if (spellList.spellSlots[level]) {
                const slots = spellList.spellSlots[level];
                const dc = 10 + level + spellList.castingMod;

                spellsHtml += `
                    <div class="spell-level-block">
                        <div class="spell-level-header">
                            <h4>Level ${level}</h4>
                            <div class="spell-level-info">
                                Slots: ${slots.total} | DC: ${dc}
                            </div>
                        </div>
                        
                        ${spellList.isSpontaneous ? `
                            <div class="spells-known">
                                <strong>Spells Known:</strong> ${spellList.spellsKnown[level] || 0}
                            </div>
                        ` : ''}
                        
                        <div class="available-spells">
                            ${this.renderSpellsByLevel(spellList.spells[level].available, level)}
                        </div>
                    </div>
                `;
            }
        }
        spellsHtml += '</div>';

        return `
            <div class="spells-section">
                <h3 class="section-title">Spells</h3>
                ${spellsHtml}
            </div>
        `;
    }

    /**
     * Render spells for a specific level
     */
    renderSpellsByLevel(spells, level) {
        if (!spells || spells.length === 0) {
            return '<p class="no-spells">No spells available</p>';
        }

        let spellsHtml = '';
        spells.forEach(spell => {
            spellsHtml += `
                <div class="spell-item">
                    <div class="spell-name">${spell.name}</div>
                    <div class="spell-school">${spell.school}</div>
                    <div class="spell-description">${spell.description}</div>
                </div>
            `;
        });

        return spellsHtml;
    }

    /**
     * Render epic section for epic characters
     */
    renderEpicSection(character) {
        if (!this.epicManager || character.level < 21) {
            return '';
        }

        const epicSummary = this.epicManager.getEpicSummary(character);

        return `
            <div class="epic-section">
                <h3 class="section-title">Epic Character (Level ${character.level})</h3>
                
                <div class="epic-stats">
                    <div class="epic-stat">
                        <span class="stat-label">Epic Level:</span>
                        <span class="stat-value">${epicSummary.epicLevel}</span>
                    </div>
                    
                    <div class="epic-stat">
                        <span class="stat-label">Divine Rank:</span>
                        <span class="stat-value">${epicSummary.divineRank} (${epicSummary.divineTitle})</span>
                    </div>
                    
                    <div class="epic-stat">
                        <span class="stat-label">Epic Feats Available:</span>
                        <span class="stat-value">${epicSummary.availableEpicFeats}</span>
                    </div>
                    
                    <div class="epic-stat">
                        <span class="stat-label">Epic Hit Points:</span>
                        <span class="stat-value">+${epicSummary.totalHitPoints - (character.hitPoints || 0)}</span>
                    </div>
                </div>
                
                ${epicSummary.epicSpellSlots ? `
                    <div class="epic-spells">
                        <h4>Epic Spell Slots</h4>
                        <div class="epic-spell-info">
                            Additional spell slots and access to spells of 10th level and higher.
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Render character notes section
     */
    renderCharacterNotes(character) {
        return `
            <div class="character-notes">
                <h3 class="section-title">Character Notes</h3>
                <div class="notes-content">
                    <div class="background-section">
                        <h4>Background</h4>
                        <p>${character.background || 'Character background not provided.'}</p>
                    </div>
                    
                    <div class="personality-section">
                        <h4>Personality</h4>
                        <p>${character.personality || 'Character personality not provided.'}</p>
                    </div>
                    
                    <div class="goals-section">
                        <h4>Goals & Motivations</h4>
                        <p>${character.goals || 'Character goals not provided.'}</p>
                    </div>
                </div>
            </div>
        `;
    }

    // ===================
    // CALCULATION HELPERS
    // ===================

    calculateAbilityModifier(score) {
        return Math.floor((score - 10) / 2);
    }

    calculateBAB(character) {
        const characterClass = this.srdData.classes?.find(c => c.name === character.characterClass);
        if (!characterClass) return 0;

        const progression = characterClass.progression?.bab_progression || 'medium';
        const level = character.level || 1;

        switch (progression) {
            case 'good': return level;
            case 'medium': return Math.floor(level * 3 / 4);
            case 'poor': return Math.floor(level / 2);
            default: return Math.floor(level * 3 / 4);
        }
    }

    getAttackSequence(bab) {
        const attacks = [];
        let currentBAB = bab;

        while (currentBAB > 0) {
            attacks.push(`+${currentBAB}`);
            currentBAB -= 5;
        }

        return attacks.join('/');
    }

    calculateArmorClass(character) {
        const ac = {
            base: 10,
            armor: character.armorBonus || 0,
            shield: character.shieldBonus || 0,
            dex: Math.min(
                this.calculateAbilityModifier(character.abilities.dexterity || 10),
                character.maxDexBonus !== undefined ? character.maxDexBonus : 10
            ),
            size: 0, // Would calculate based on character size
            natural: character.naturalArmor || 0,
            deflection: character.deflectionBonus || 0
        };

        ac.total = ac.base + ac.armor + ac.shield + ac.dex + ac.size + ac.natural + ac.deflection;

        return ac;
    }

    calculateHitPoints(character) {
        const characterClass = this.srdData.classes?.find(c => c.name === character.characterClass);
        const hitDie = characterClass?.progression?.hit_die || 8;
        const level = character.level || 1;
        const conMod = this.calculateAbilityModifier(character.abilities.constitution || 10);

        const classHP = hitDie + (level - 1) * Math.floor(hitDie / 2 + 1); // Average HP per level after 1st
        const conHP = level * conMod;
        const epicHP = character.epicHP || 0;
        const otherHP = character.bonusHP || 0;

        return {
            classHP,
            conHP,
            epicHP,
            other: otherHP,
            max: classHP + conHP + epicHP + otherHP,
            current: character.currentHP || (classHP + conHP + epicHP + otherHP)
        };
    }

    calculateInitiative(character) {
        const dexMod = this.calculateAbilityModifier(character.abilities.dexterity || 10);
        const miscBonus = character.initiativeBonus || 0;

        return dexMod + miscBonus;
    }

    calculateSavingThrows(character) {
        const characterClass = this.srdData.classes?.find(c => c.name === character.characterClass);
        const level = character.level || 1;

        // Base saves
        const fortitudeBase = this.calculateBaseSave(characterClass?.progression?.fort_save, level);
        const reflexBase = this.calculateBaseSave(characterClass?.progression?.ref_save, level);
        const willBase = this.calculateBaseSave(characterClass?.progression?.will_save, level);

        // Ability modifiers
        const conMod = this.calculateAbilityModifier(character.abilities.constitution || 10);
        const dexMod = this.calculateAbilityModifier(character.abilities.dexterity || 10);
        const wisMod = this.calculateAbilityModifier(character.abilities.wisdom || 10);

        // Misc bonuses
        const fortitudeMisc = character.saveBonuses?.fortitude || 0;
        const reflexMisc = character.saveBonuses?.reflex || 0;
        const willMisc = character.saveBonuses?.will || 0;

        return {
            fortitudeBase,
            reflexBase,
            willBase,
            fortitudeMisc,
            reflexMisc,
            willMisc,
            fortitude: fortitudeBase + conMod + fortitudeMisc,
            reflex: reflexBase + dexMod + reflexMisc,
            will: willBase + wisMod + willMisc
        };
    }

    calculateBaseSave(progression, level) {
        if (progression === 'good') {
            return 2 + Math.floor(level / 2);
        } else {
            return Math.floor(level / 3);
        }
    }
}

// Export for both Node.js and browser
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CharacterSheetRenderer;
} else if (typeof window !== 'undefined') {
    window.CharacterSheetRenderer = CharacterSheetRenderer;
}