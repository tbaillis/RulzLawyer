# D&D 3.5 Character Sheet Form Field Mapping

## Complete Field Structure Analysis

Based on examination of the three PDF reference files, here is the comprehensive mapping of all form fields, their types, positions, and D&D 3.5 rule requirements.

## Page 1 - Main Character Sheet Fields

### Header Section (Character Identity)
```javascript
const characterHeaderFields = {
  characterName: {
    type: 'text',
    label: 'Character Name',
    position: { section: 'header', row: 1, col: 1 },
    width: '300px',
    required: true,
    validation: 'text'
  },
  playerName: {
    type: 'text',
    label: 'Player Name',
    position: { section: 'header', row: 1, col: 2 },
    width: '200px',
    required: false,
    validation: 'text'
  },
  classLevel: {
    type: 'composite',
    label: 'Class & Level',
    position: { section: 'header', row: 1, col: 3 },
    fields: {
      className: { type: 'select', options: 'D&D_3_5_CLASSES' },
      level: { type: 'number', min: 1, max: 20 }
    }
  },
  race: {
    type: 'select',
    label: 'Race',
    position: { section: 'header', row: 2, col: 1 },
    options: 'D&D_3_5_RACES',
    affects: ['ability_modifiers', 'special_abilities']
  },
  alignment: {
    type: 'select',
    label: 'Alignment',
    position: { section: 'header', row: 2, col: 2 },
    options: ['LG', 'NG', 'CG', 'LN', 'N', 'CN', 'LE', 'NE', 'CE']
  },
  experiencePoints: {
    type: 'number',
    label: 'Experience Points',
    position: { section: 'header', row: 2, col: 3 },
    min: 0,
    affects: ['level_progression']
  }
};
```

### Ability Scores Section (Left Column)
```javascript
const abilityScoreFields = {
  strength: {
    type: 'ability_score',
    label: 'Strength',
    position: { section: 'abilities', row: 1 },
    fields: {
      base_score: { type: 'number', min: 1, max: 25 },
      racial_modifier: { type: 'number', readonly: true, calculated: true },
      total_score: { type: 'number', readonly: true, calculated: true },
      modifier: { type: 'number', readonly: true, calculated: true, formula: '(total_score - 10) / 2' }
    }
  },
  dexterity: {
    type: 'ability_score',
    label: 'Dexterity',
    position: { section: 'abilities', row: 2 },
    affects: ['initiative', 'ac', 'reflex_save'],
    // ... same structure as strength
  },
  constitution: {
    type: 'ability_score',
    label: 'Constitution',
    position: { section: 'abilities', row: 3 },
    affects: ['hit_points', 'fortitude_save'],
    // ... same structure
  },
  intelligence: {
    type: 'ability_score',
    label: 'Intelligence',
    position: { section: 'abilities', row: 4 },
    affects: ['skill_points', 'languages'],
    // ... same structure
  },
  wisdom: {
    type: 'ability_score',
    label: 'Wisdom',
    position: { section: 'abilities', row: 5 },
    affects: ['will_save', 'perception'],
    // ... same structure
  },
  charisma: {
    type: 'ability_score',
    label: 'Charisma',
    position: { section: 'abilities', row: 6 },
    affects: ['social_skills', 'spell_save_dc'],
    // ... same structure
  }
};
```

### Combat Statistics Section (Center Column)
```javascript
const combatStatFields = {
  armorClass: {
    type: 'composite_stat',
    label: 'Armor Class',
    position: { section: 'combat', row: 1 },
    display: 'prominent',
    fields: {
      total_ac: { type: 'number', readonly: true, calculated: true },
      base_ac: { type: 'number', default: 10 },
      armor_bonus: { type: 'number', min: 0 },
      shield_bonus: { type: 'number', min: 0 },
      dex_modifier: { type: 'number', readonly: true, linked: 'dexterity.modifier' },
      size_modifier: { type: 'number', default: 0 },
      natural_armor: { type: 'number', min: 0 },
      deflection_modifier: { type: 'number', min: 0 },
      misc_modifier: { type: 'number', default: 0 }
    }
  },
  hitPoints: {
    type: 'composite_stat',
    label: 'Hit Points',
    position: { section: 'combat', row: 2 },
    fields: {
      current_hp: { type: 'number', min: -10 },
      max_hp: { type: 'number', readonly: true, calculated: true },
      temporary_hp: { type: 'number', min: 0, default: 0 },
      damage: { type: 'number', min: 0, default: 0 }
    }
  },
  initiative: {
    type: 'calculated_stat',
    label: 'Initiative',
    position: { section: 'combat', row: 3 },
    calculation: 'dexterity.modifier + misc_modifier',
    fields: {
      total: { type: 'number', readonly: true },
      misc_modifier: { type: 'number', default: 0 }
    }
  },
  baseAttackBonus: {
    type: 'progressive_stat',
    label: 'Base Attack Bonus',
    position: { section: 'combat', row: 4 },
    calculated: true,
    depends_on: ['class', 'level']
  },
  savingThrows: {
    type: 'saving_throw_group',
    label: 'Saving Throws',
    position: { section: 'combat', rows: [5, 6, 7] },
    fields: {
      fortitude: {
        base_save: { type: 'number', readonly: true, calculated: true },
        ability_modifier: { type: 'number', readonly: true, linked: 'constitution.modifier' },
        magic_modifier: { type: 'number', default: 0 },
        misc_modifier: { type: 'number', default: 0 },
        temporary_modifier: { type: 'number', default: 0 },
        total: { type: 'number', readonly: true, calculated: true }
      },
      reflex: {
        // Same structure, linked to dexterity.modifier
      },
      will: {
        // Same structure, linked to wisdom.modifier
      }
    }
  }
};
```

### Skills Section (Right Column)
```javascript
const skillsFields = {
  skillList: {
    type: 'skill_table',
    label: 'Skills',
    position: { section: 'skills', fullHeight: true },
    columns: [
      { name: 'skill_name', type: 'text', readonly: true },
      { name: 'key_ability', type: 'text', readonly: true },
      { name: 'skill_modifier', type: 'number', readonly: true, calculated: true },
      { name: 'ability_modifier', type: 'number', readonly: true },
      { name: 'ranks', type: 'number', min: 0, editable: true },
      { name: 'misc_modifier', type: 'number', default: 0 }
    ],
    skills: [
      { name: 'Appraise', key_ability: 'Int', class_skill: false },
      { name: 'Balance', key_ability: 'Dex', class_skill: false },
      { name: 'Bluff', key_ability: 'Cha', class_skill: false },
      { name: 'Climb', key_ability: 'Str', class_skill: false },
      { name: 'Concentration', key_ability: 'Con', class_skill: false },
      { name: 'Craft', key_ability: 'Int', class_skill: false, specialty: true },
      { name: 'Decipher Script', key_ability: 'Int', class_skill: false, trained_only: true },
      { name: 'Diplomacy', key_ability: 'Cha', class_skill: false },
      { name: 'Disable Device', key_ability: 'Int', class_skill: false, trained_only: true },
      { name: 'Disguise', key_ability: 'Cha', class_skill: false },
      { name: 'Escape Artist', key_ability: 'Dex', class_skill: false },
      { name: 'Forgery', key_ability: 'Int', class_skill: false },
      { name: 'Gather Information', key_ability: 'Cha', class_skill: false },
      { name: 'Handle Animal', key_ability: 'Cha', class_skill: false, trained_only: true },
      { name: 'Heal', key_ability: 'Wis', class_skill: false },
      { name: 'Hide', key_ability: 'Dex', class_skill: false },
      { name: 'Intimidate', key_ability: 'Cha', class_skill: false },
      { name: 'Jump', key_ability: 'Str', class_skill: false },
      { name: 'Knowledge', key_ability: 'Int', class_skill: false, trained_only: true, specialty: true },
      { name: 'Listen', key_ability: 'Wis', class_skill: false },
      { name: 'Move Silently', key_ability: 'Dex', class_skill: false },
      { name: 'Open Lock', key_ability: 'Dex', class_skill: false, trained_only: true },
      { name: 'Perform', key_ability: 'Cha', class_skill: false, specialty: true },
      { name: 'Profession', key_ability: 'Wis', class_skill: false, trained_only: true, specialty: true },
      { name: 'Ride', key_ability: 'Dex', class_skill: false },
      { name: 'Search', key_ability: 'Int', class_skill: false },
      { name: 'Sense Motive', key_ability: 'Wis', class_skill: false },
      { name: 'Sleight of Hand', key_ability: 'Dex', class_skill: false, trained_only: true },
      { name: 'Spellcraft', key_ability: 'Int', class_skill: false, trained_only: true },
      { name: 'Spot', key_ability: 'Wis', class_skill: false },
      { name: 'Survival', key_ability: 'Wis', class_skill: false },
      { name: 'Swim', key_ability: 'Str', class_skill: false },
      { name: 'Tumble', key_ability: 'Dex', class_skill: false, trained_only: true },
      { name: 'Use Magic Device', key_ability: 'Cha', class_skill: false, trained_only: true },
      { name: 'Use Rope', key_ability: 'Dex', class_skill: false }
    ]
  },
  skillPointsAvailable: {
    type: 'calculated_stat',
    label: 'Skill Points Available',
    calculation: '(class_skill_points_per_level + intelligence.modifier) * level',
    readonly: true
  },
  skillPointsSpent: {
    type: 'calculated_stat',
    label: 'Skill Points Spent',
    calculation: 'sum_of_all_skill_ranks',
    readonly: true
  }
};
```

### Equipment Section (Bottom)
```javascript
const equipmentFields = {
  weapons: {
    type: 'equipment_table',
    label: 'Weapons',
    position: { section: 'equipment', subsection: 'weapons' },
    columns: [
      { name: 'weapon_name', type: 'text', width: '150px' },
      { name: 'attack_bonus', type: 'number', calculated: true },
      { name: 'damage', type: 'text', width: '100px' },
      { name: 'critical', type: 'text', width: '80px' },
      { name: 'range', type: 'text', width: '80px' },
      { name: 'type', type: 'text', width: '60px' },
      { name: 'notes', type: 'text', width: '120px' }
    ],
    max_rows: 6
  },
  armor: {
    type: 'equipment_table',
    label: 'Armor',
    position: { section: 'equipment', subsection: 'armor' },
    columns: [
      { name: 'armor_name', type: 'text', width: '150px' },
      { name: 'ac_bonus', type: 'number', affects: 'armorClass.armor_bonus' },
      { name: 'max_dex_bonus', type: 'number', affects: 'armorClass.max_dex' },
      { name: 'armor_check_penalty', type: 'number', affects: 'skills.armor_check_penalty' },
      { name: 'arcane_spell_failure', type: 'percentage' },
      { name: 'speed_30ft', type: 'text' },
      { name: 'speed_20ft', type: 'text' },
      { name: 'weight', type: 'number' },
      { name: 'notes', type: 'text' }
    ]
  },
  gear: {
    type: 'equipment_list',
    label: 'Gear',
    position: { section: 'equipment', subsection: 'gear' },
    fields: {
      items: {
        type: 'dynamic_list',
        item_structure: {
          name: { type: 'text' },
          quantity: { type: 'number', min: 0 },
          weight: { type: 'number', min: 0 },
          notes: { type: 'text' }
        }
      },
      total_weight: { type: 'number', readonly: true, calculated: true },
      carrying_capacity: {
        light_load: { type: 'number', readonly: true, calculated: true },
        medium_load: { type: 'number', readonly: true, calculated: true },
        heavy_load: { type: 'number', readonly: true, calculated: true },
        max_load: { type: 'number', readonly: true, calculated: true }
      }
    }
  }
};
```

## Page 2 - Extended Character Information

### Character Background Fields
```javascript
const characterBackgroundFields = {
  personality: {
    type: 'textarea',
    label: 'Personality',
    position: { section: 'background', row: 1 },
    height: '100px'
  },
  ideals: {
    type: 'textarea',
    label: 'Ideals',
    position: { section: 'background', row: 2 },
    height: '80px'
  },
  bonds: {
    type: 'textarea',
    label: 'Bonds',
    position: { section: 'background', row: 3 },
    height: '80px'
  },
  flaws: {
    type: 'textarea',
    label: 'Flaws',
    position: { section: 'background', row: 4 },
    height: '80px'
  },
  backstory: {
    type: 'textarea',
    label: 'Backstory',
    position: { section: 'background', row: 5 },
    height: '200px'
  }
};
```

### Features and Traits
```javascript
const featuresAndTraitsFields = {
  classFeatures: {
    type: 'feature_list',
    label: 'Class Features',
    position: { section: 'features', col: 1 },
    dynamic: true,
    depends_on: ['class', 'level']
  },
  feats: {
    type: 'feat_list',
    label: 'Feats',
    position: { section: 'features', col: 2 },
    fields: {
      feat_name: { type: 'select', options: 'D&D_3_5_FEATS' },
      feat_description: { type: 'textarea', readonly: true },
      prerequisites_met: { type: 'boolean', readonly: true, calculated: true }
    }
  },
  specialAbilities: {
    type: 'ability_list',
    label: 'Special Abilities',
    position: { section: 'features', col: 3 },
    source: ['race', 'class', 'feats', 'equipment']
  }
};
```

## Page 3 - Spells and Magic

### Spellcasting Fields
```javascript
const spellcastingFields = {
  spellSaveDC: {
    type: 'calculated_stat',
    label: 'Spell Save DC',
    calculation: '10 + spell_level + casting_ability_modifier',
    readonly: true
  },
  spellsPerDay: {
    type: 'spell_slots_table',
    label: 'Spells per Day',
    levels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    depends_on: ['class', 'level', 'casting_ability_modifier']
  },
  spellsKnown: {
    type: 'spell_table',
    label: 'Spells Known/Prepared',
    organization: 'by_level',
    fields: {
      spell_name: { type: 'select', options: 'CLASS_SPELL_LIST' },
      spell_level: { type: 'number', min: 0, max: 9, readonly: true },
      school: { type: 'text', readonly: true },
      casting_time: { type: 'text', readonly: true },
      range: { type: 'text', readonly: true },
      duration: { type: 'text', readonly: true },
      components: { type: 'text', readonly: true },
      description: { type: 'textarea', readonly: true }
    }
  }
};
```

## Field Relationships and Calculations

### Critical Calculations
```javascript
const calculationRules = {
  ability_modifier: '(ability_score - 10) / 2 (rounded down)',
  armor_class: 'base(10) + armor + shield + dex_mod + size + natural + deflection + misc',
  initiative: 'dex_modifier + misc_modifier',
  skill_modifier: 'ability_modifier + ranks + misc_modifier + (class_skill_bonus if ranks > 0)',
  base_attack_bonus: 'class_progression[class][level]',
  saving_throws: 'base_save + ability_modifier + magic_modifier + misc_modifier + temporary_modifier',
  hit_points: 'class_hit_die * level + con_modifier * level + misc_bonuses',
  carrying_capacity: 'strength_based_table[strength_score]',
  spell_save_dc: '10 + spell_level + casting_ability_modifier'
};
```

## Implementation Priority

### Phase 1: Core Structure
1. Basic character information fields
2. Ability scores with auto-calculation
3. Combat statistics (AC, HP, Initiative, BAB)
4. Saving throws

### Phase 2: Skills and Equipment  
1. Complete skills table with D&D 3.5 skill list
2. Weapons table with attack/damage calculations
3. Armor and equipment tracking
4. Carrying capacity calculations

### Phase 3: Advanced Features
1. Feats and class features
2. Spellcasting system
3. Character background and notes
4. Multi-page navigation

---

*This comprehensive field mapping provides the exact structure needed to rebuild the character creator to match the PDF references perfectly.*