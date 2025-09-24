// code-repository/src/epic/epic-feat-database.js
class EpicFeatDatabase {
  constructor() {
    this.epicFeats = new Map();
    this.featPrerequisites = new Map();
    this.featCategories = new Map();
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;

    console.log('🎯 Initializing Epic Feat Database...');
    const startTime = performance.now();

    try {
      await this.loadEpicFeats();
      await this.buildPrerequisiteGraph();
      await this.categorizeFeats();

      const initTime = performance.now() - startTime;
      console.log(`✅ Epic Feat Database initialized in ${initTime.toFixed(2)}ms with ${this.epicFeats.size} epic feats`);

      this.initialized = true;
    } catch (error) {
      console.error('❌ Epic Feat Database initialization failed:', error);
      throw new EpicFeatDatabaseError(error.message);
    }
  }

  async loadEpicFeats() {
    // Load all epic feats from D&D 3.5 Epic Level Handbook
    const epicFeatsData = [
      // Combat Feats
      {
        id: 'additional_magic_item_space',
        name: 'Additional Magic Item Space',
        category: 'item_creation',
        minimumLevel: 21,
        description: 'You can wear one additional magic item of each type that can be worn.',
        benefit: 'You can benefit from one additional magic item of each wearable type.',
        special: 'This feat can be taken multiple times, but each time applies to a different type of magic item.'
      },
      {
        id: 'armor_skin',
        name: 'Armor Skin',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You grow natural armor, increasing your natural armor bonus.',
        benefit: '+1 natural armor bonus. This bonus increases by +1 for every 5 character levels above 20th.',
        abilityRequirements: { constitution: 13 }
      },
      {
        id: 'blinding_speed',
        name: 'Blinding Speed',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your speed becomes blindingly fast.',
        benefit: 'Your base land speed increases by 30 feet. This bonus increases by 10 feet for every 5 character levels above 20th.',
        special: 'This feat works only when you are wearing light armor or no armor.'
      },
      {
        id: 'bulwark_of_defense',
        name: 'Bulwark of Defense',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You can defend yourself against multiple opponents.',
        benefit: 'You gain a +1 dodge bonus to AC for each opponent you threaten (maximum +4).',
        prerequisites: ['Combat Reflexes']
      },
      {
        id: 'combat_archery',
        name: 'Combat Archery',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can fire a bow or crossbow as a standard action even when threatened.',
        benefit: 'You can fire a bow or crossbow as a standard action, even when threatened.',
        special: 'This feat allows you to make a full attack with a bow or crossbow as a standard action.'
      },
      {
        id: 'damage_reduction',
        name: 'Damage Reduction',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You gain damage reduction.',
        benefit: 'You gain damage reduction 1/-. This increases by 1/- for every 3 character levels above 20th.',
        abilityRequirements: { constitution: 13 }
      },
      {
        id: 'devastating_critical',
        name: 'Devastating Critical',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your critical hits are more devastating.',
        benefit: 'When you score a critical hit, you multiply the damage by ×3 instead of ×2.',
        prerequisites: ['Critical Focus', 'Weapon Focus'],
        special: 'This feat can be taken multiple times, but each time applies to a different weapon.'
      },
      {
        id: 'dire_charge',
        name: 'Dire Charge',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can charge with devastating force.',
        benefit: 'When you charge, you deal an extra 1d6 points of damage, plus an additional 1d6 for every 4 character levels above 20th.',
        prerequisites: ['Improved Bull Rush']
      },
      {
        id: 'distant_shot',
        name: 'Distant Shot',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can shoot much farther with a bow or crossbow.',
        benefit: 'You double the range increment of any bow or crossbow you use.',
        prerequisites: ['Point Blank Shot', 'Far Shot']
      },
      {
        id: 'epic_dodge',
        name: 'Epic Dodge',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You can dodge attacks with amazing speed.',
        benefit: 'You can activate a dodge bonus as a free action.',
        prerequisites: ['Dex 21', 'Dodge', 'Mobility', 'Spring Attack']
      },
      {
        id: 'epic_endurance',
        name: 'Epic Endurance',
        category: 'utility',
        minimumLevel: 21,
        description: 'You can exert yourself beyond normal limits.',
        benefit: 'You gain a +4 bonus on checks for running, swimming, and other forms of physical exertion.',
        prerequisites: ['Con 21', 'Endurance']
      },
      {
        id: 'epic_fortitude',
        name: 'Epic Fortitude',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You have amazing resistance to poisons and diseases.',
        benefit: 'You gain a +4 bonus on Fortitude saves.',
        prerequisites: ['Con 21', 'Great Fortitude']
      },
      {
        id: 'epic_initiative',
        name: 'Epic Initiative',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can react to danger with lightning speed.',
        benefit: 'You gain a +4 bonus on initiative checks.',
        prerequisites: ['Dex 21', 'Improved Initiative']
      },
      {
        id: 'epic_leadership',
        name: 'Epic Leadership',
        category: 'leadership',
        minimumLevel: 21,
        description: 'You can attract a larger number of followers.',
        benefit: 'You can attract followers as if your Leadership score were 4 points higher.',
        prerequisites: ['Cha 25', 'Leadership']
      },
      {
        id: 'epic_prowess',
        name: 'Epic Prowess',
        category: 'combat',
        minimumLevel: 21,
        description: 'You are a master of combat maneuvers.',
        benefit: 'You gain a +1 bonus on all attack rolls.',
        prerequisites: ['Str 21']
      },
      {
        id: 'epic_reflexes',
        name: 'Epic Reflexes',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You have lightning reflexes.',
        benefit: 'You gain a +4 bonus on Reflex saves.',
        prerequisites: ['Dex 21', 'Lightning Reflexes']
      },
      {
        id: 'epic_reputation',
        name: 'Epic Reputation',
        category: 'social',
        minimumLevel: 21,
        description: 'Your reputation precedes you.',
        benefit: 'You gain a +4 bonus on Bluff, Diplomacy, Gather Information, Intimidate, and Perform checks.',
        prerequisites: ['Cha 21']
      },
      {
        id: 'epic_skill_focus',
        name: 'Epic Skill Focus',
        category: 'skill',
        minimumLevel: 21,
        description: 'You are a master of a particular skill.',
        benefit: 'You gain a +10 bonus on checks with the chosen skill.',
        prerequisites: ['20 ranks in the skill', 'Skill Focus'],
        special: 'This feat can be taken multiple times, but each time applies to a different skill.'
      },
      {
        id: 'epic_speed',
        name: 'Epic Speed',
        category: 'utility',
        minimumLevel: 21,
        description: 'You move with incredible speed.',
        benefit: 'Your base land speed increases by 30 feet.',
        prerequisites: ['Dex 21']
      },
      {
        id: 'epic_spellcasting',
        name: 'Epic Spellcasting',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can cast spells as an epic spellcaster.',
        benefit: 'You can cast epic spells and develop your own epic spells.',
        prerequisites: ['Spellcraft 24 ranks', 'ability to cast 9th-level spells']
      },
      {
        id: 'epic_toughness',
        name: 'Epic Toughness',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You have incredible durability.',
        benefit: 'You gain +20 hit points.',
        prerequisites: ['Con 21', 'Toughness']
      },
      {
        id: 'epic_weapon_focus',
        name: 'Epic Weapon Focus',
        category: 'combat',
        minimumLevel: 21,
        description: 'You are a master with a particular weapon.',
        benefit: 'You gain a +2 bonus on attack rolls with the chosen weapon.',
        prerequisites: ['Weapon Focus', 'Epic Prowess'],
        special: 'This feat can be taken multiple times, but each time applies to a different weapon.'
      },
      {
        id: 'epic_weapon_specialization',
        name: 'Epic Weapon Specialization',
        category: 'combat',
        minimumLevel: 21,
        description: 'You deal devastating damage with a particular weapon.',
        benefit: 'You gain a +4 bonus on damage rolls with the chosen weapon.',
        prerequisites: ['Weapon Specialization', 'Epic Weapon Focus'],
        special: 'This feat can be taken multiple times, but each time applies to a different weapon.'
      },
      {
        id: 'epic_will',
        name: 'Epic Will',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You have incredible willpower.',
        benefit: 'You gain a +4 bonus on Will saves.',
        prerequisites: ['Wis 21', 'Iron Will']
      },
      {
        id: 'exceptional_deflection',
        name: 'Exceptional Deflection',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You can deflect arrows and other projectiles with amazing skill.',
        benefit: 'You gain a +1 bonus to your deflection AC bonus.',
        prerequisites: ['Dex 21', 'Deflect Arrows']
      },
      {
        id: 'fast_healing',
        name: 'Fast Healing',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You heal at an incredible rate.',
        benefit: 'You gain fast healing 1. This increases by 1 for every 3 character levels above 20th.',
        abilityRequirements: { constitution: 13 }
      },
      {
        id: 'great_constitution',
        name: 'Great Constitution',
        category: 'ability',
        minimumLevel: 21,
        description: 'You have amazing physical fortitude.',
        benefit: 'Your Constitution score increases by 1.',
        special: 'This feat can be taken multiple times.'
      },
      {
        id: 'great_dexterity',
        name: 'Great Dexterity',
        category: 'ability',
        minimumLevel: 21,
        description: 'You have amazing agility.',
        benefit: 'Your Dexterity score increases by 1.',
        special: 'This feat can be taken multiple times.'
      },
      {
        id: 'great_intelligence',
        name: 'Great Intelligence',
        category: 'ability',
        minimumLevel: 21,
        description: 'You have amazing intellect.',
        benefit: 'Your Intelligence score increases by 1.',
        special: 'This feat can be taken multiple times.'
      },
      {
        id: 'great_strength',
        name: 'Great Strength',
        category: 'ability',
        minimumLevel: 21,
        description: 'You have amazing physical strength.',
        benefit: 'Your Strength score increases by 1.',
        special: 'This feat can be taken multiple times.'
      },
      {
        id: 'great_wisdom',
        name: 'Great Wisdom',
        category: 'ability',
        minimumLevel: 21,
        description: 'You have amazing insight.',
        benefit: 'Your Wisdom score increases by 1.',
        special: 'This feat can be taken multiple times.'
      },
      {
        id: 'great_charisma',
        name: 'Great Charisma',
        category: 'ability',
        minimumLevel: 21,
        description: 'You have amazing personal magnetism.',
        benefit: 'Your Charisma score increases by 1.',
        special: 'This feat can be taken multiple times.'
      },
      {
        id: 'ignore_material_components',
        name: 'Ignore Material Components',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can cast spells without material components.',
        benefit: 'You can ignore the material components of spells you cast.',
        prerequisites: ['Eschew Materials', 'Spellcraft 25 ranks']
      },
      {
        id: 'improved_arrow_of_death',
        name: 'Improved Arrow of Death',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your arrows can slay with a single shot.',
        benefit: 'You can use the arrow of death ability one additional time per day.',
        prerequisites: ['Dex 19', 'Arrow of Death', 'Point Blank Shot', 'Precise Shot']
      },
      {
        id: 'improved_aura_of_courage',
        name: 'Improved Aura of Courage',
        category: 'leadership',
        minimumLevel: 21,
        description: 'Your aura of courage is more potent.',
        benefit: 'Your aura of courage extends to 60 feet.',
        prerequisites: ['Cha 21', 'Aura of Courage']
      },
      {
        id: 'improved_combat_reflexes',
        name: 'Improved Combat Reflexes',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can make attacks of opportunity more often.',
        benefit: 'You can make one additional attack of opportunity per round.',
        prerequisites: ['Dex 21', 'Combat Reflexes']
      },
      {
        id: 'improved_darkvision',
        name: 'Improved Darkvision',
        category: 'utility',
        minimumLevel: 21,
        description: 'You can see in the dark better than most.',
        benefit: 'Your darkvision range increases by 30 feet.',
        prerequisites: ['Darkvision']
      },
      {
        id: 'improved_death_attack',
        name: 'Improved Death Attack',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your death attacks are more effective.',
        benefit: 'Your death attack DC increases by 2.',
        prerequisites: ['Death Attack']
      },
      {
        id: 'improved_favored_enemy',
        name: 'Improved Favored Enemy',
        category: 'combat',
        minimumLevel: 21,
        description: 'You are particularly skilled at fighting certain creatures.',
        benefit: 'You gain an additional +2 bonus on damage rolls against your favored enemies.',
        prerequisites: ['Favored Enemy']
      },
      {
        id: 'improved_ki_strike',
        name: 'Improved Ki Strike',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your unarmed strikes can overcome damage reduction.',
        benefit: 'Your unarmed strikes count as magic weapons for overcoming damage reduction.',
        prerequisites: ['Ki Strike']
      },
      {
        id: 'improved_low_light_vision',
        name: 'Improved Low-Light Vision',
        category: 'utility',
        minimumLevel: 21,
        description: 'You can see in dim light better than most.',
        benefit: 'Your low-light vision range increases by 30 feet.',
        prerequisites: ['Low-Light Vision']
      },
      {
        id: 'improved_manifestation',
        name: 'Improved Manifestation',
        category: 'psionic',
        minimumLevel: 21,
        description: 'You can manifest psionic powers more effectively.',
        benefit: 'You gain a +4 bonus on manifester level checks.',
        prerequisites: ['Psionic ability']
      },
      {
        id: 'improved_metamagic',
        name: 'Improved Metamagic',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can apply metamagic feats more easily.',
        benefit: 'You can apply any one metamagic feat you know to a spell without increasing the spell\'s casting time.',
        prerequisites: ['Spellcraft 30 ranks', 'at least 3 metamagic feats']
      },
      {
        id: 'improved_sneak_attack',
        name: 'Improved Sneak Attack',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your sneak attacks deal more damage.',
        benefit: 'Your sneak attack damage increases by +1d6.',
        prerequisites: ['Sneak Attack']
      },
      {
        id: 'improved_spell_capacity',
        name: 'Improved Spell Capacity',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can cast spells of a higher level than normal.',
        benefit: 'You can cast one additional spell of a level 1 lower than your maximum spell level.',
        prerequisites: ['Ability to cast spells of the affected level'],
        special: 'This feat can be taken multiple times.'
      },
      {
        id: 'improved_spell_resistance',
        name: 'Improved Spell Resistance',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You have greater resistance to spells.',
        benefit: 'Your spell resistance increases by 2.',
        prerequisites: ['Spell Resistance']
      },
      {
        id: 'improved_stunning_fist',
        name: 'Improved Stunning Fist',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your stunning fist attacks are more effective.',
        benefit: 'You can use your stunning fist ability one additional time per day.',
        prerequisites: ['Dex 19', 'Wis 19', 'Stunning Fist', 'Improved Unarmed Strike']
      },
      {
        id: 'improved_turning',
        name: 'Improved Turning',
        category: 'divine',
        minimumLevel: 21,
        description: 'You can turn undead more effectively.',
        benefit: 'You can turn undead one additional time per day.',
        prerequisites: ['Ability to turn undead']
      },
      {
        id: 'instant_reload',
        name: 'Instant Reload',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can reload crossbows with amazing speed.',
        benefit: 'You can reload a crossbow as a free action.',
        prerequisites: ['Dex 21', 'Rapid Reload', 'Weapon Focus (crossbow)']
      },
      {
        id: 'legendary_climber',
        name: 'Legendary Climber',
        category: 'utility',
        minimumLevel: 21,
        description: 'You can climb any surface.',
        benefit: 'You gain a +20 bonus on Climb checks.',
        prerequisites: ['Dex 21', 'Climb 24 ranks']
      },
      {
        id: 'legendary_leaper',
        name: 'Legendary Leaper',
        category: 'utility',
        minimumLevel: 21,
        description: 'You can leap incredible distances.',
        benefit: 'You gain a +10 bonus on Jump checks.',
        prerequisites: ['Str 21', 'Power Attack', 'Jump 24 ranks']
      },
      {
        id: 'legendary_rider',
        name: 'Legendary Rider',
        category: 'utility',
        minimumLevel: 21,
        description: 'You are a master of mounted combat.',
        benefit: 'You gain a +10 bonus on Ride checks.',
        prerequisites: ['Dex 21', 'Ride 24 ranks', 'Mounted Combat']
      },
      {
        id: 'legendary_tracker',
        name: 'Legendary Tracker',
        category: 'utility',
        minimumLevel: 21,
        description: 'You can track creatures with amazing skill.',
        benefit: 'You gain a +20 bonus on Survival checks made to track.',
        prerequisites: ['Wis 21', 'Survival 30 ranks', 'Track']
      },
      {
        id: 'legendary_wrestler',
        name: 'Legendary Wrestler',
        category: 'combat',
        minimumLevel: 21,
        description: 'You are a master of grappling.',
        benefit: 'You gain a +10 bonus on grapple checks.',
        prerequisites: ['Str 25', 'Improved Grapple', 'Improved Unarmed Strike']
      },
      {
        id: 'lingering_damage',
        name: 'Lingering Damage',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your attacks cause damage that persists.',
        benefit: 'Your attacks deal 2 points of damage per round for 1 round after the initial attack.',
        prerequisites: ['Sneak Attack +8d6']
      },
      {
        id: 'multispell',
        name: 'Multispell',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can cast multiple spells simultaneously.',
        benefit: 'You can cast one additional spell of up to 4th level as part of casting another spell.',
        prerequisites: ['Spellcraft 20 ranks', 'Quicken Spell']
      },
      {
        id: 'multitude_of_missiles',
        name: 'Multitude of Missiles',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can create multiple magic missiles.',
        benefit: 'You can create one additional magic missile for every 2 caster levels above 20th.',
        prerequisites: ['Spellcraft 20 ranks', 'Magic Missile']
      },
      {
        id: 'negative_energy_burst',
        name: 'Negative Energy Burst',
        category: 'divine',
        minimumLevel: 21,
        description: 'You can unleash a burst of negative energy.',
        benefit: 'You can use a negative energy burst once per day.',
        prerequisites: ['Cha 21', 'Ability to cast inflict spells']
      },
      {
        id: 'overwhelming_critical',
        name: 'Overwhelming Critical',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your critical hits can overwhelm opponents.',
        benefit: 'When you score a critical hit, your opponent must make a Fortitude save or be stunned.',
        prerequisites: ['Str 23', 'Overwhelming Critical', 'Weapon Focus']
      },
      {
        id: 'penetrate_damage_reduction',
        name: 'Penetrate Damage Reduction',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your attacks can penetrate damage reduction.',
        benefit: 'Choose one type of damage reduction. Your attacks ignore that type of damage reduction.',
        special: 'This feat can be taken multiple times, but each time applies to a different type of damage reduction.'
      },
      {
        id: 'perfect_health',
        name: 'Perfect Health',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You are immune to diseases and poisons.',
        benefit: 'You are immune to all diseases and poisons.',
        prerequisites: ['Con 25', 'Great Fortitude', 'Epic Fortitude']
      },
      {
        id: 'perfect_multiweapon_fighting',
        name: 'Perfect Multiweapon Fighting',
        category: 'combat',
        minimumLevel: 21,
        description: 'You are a master of fighting with multiple weapons.',
        benefit: 'You take no penalties when fighting with multiple weapons.',
        prerequisites: ['Dex 25', 'Multiweapon Fighting', 'Greater Multiweapon Fighting']
      },
      {
        id: 'perfect_two_weapon_fighting',
        name: 'Perfect Two-Weapon Fighting',
        category: 'combat',
        minimumLevel: 21,
        description: 'You are a master of two-weapon fighting.',
        benefit: 'You take no penalties when fighting with two weapons.',
        prerequisites: ['Dex 25', 'Two-Weapon Fighting', 'Greater Two-Weapon Fighting']
      },
      {
        id: 'permanent_emanation',
        name: 'Permanent Emanation',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can make spell effects permanent.',
        benefit: 'Choose one emanation spell. That spell becomes permanent.',
        prerequisites: ['Spellcraft 25 ranks', 'Extend Spell']
      },
      {
        id: 'planar_turning',
        name: 'Planar Turning',
        category: 'divine',
        minimumLevel: 21,
        description: 'You can turn creatures from other planes.',
        benefit: 'You can turn outsiders as if they were undead.',
        prerequisites: ['Wis 21', 'Ability to turn undead']
      },
      {
        id: 'positive_energy_aura',
        name: 'Positive Energy Aura',
        category: 'divine',
        minimumLevel: 21,
        description: 'You radiate positive energy.',
        benefit: 'You radiate positive energy in a 30-foot radius.',
        prerequisites: ['Cha 21', 'Ability to cast cure spells']
      },
      {
        id: 'ranged_inspiration',
        name: 'Ranged Inspiration',
        category: 'leadership',
        minimumLevel: 21,
        description: 'You can inspire allies at range.',
        benefit: 'Your inspiration range increases to 180 feet.',
        prerequisites: ['Cha 21', 'Bardic music ability']
      },
      {
        id: 'reactive_countersong',
        name: 'Reactive Countersong',
        category: 'utility',
        minimumLevel: 21,
        description: 'You can use countersong reactively.',
        benefit: 'You can use countersong as an immediate action.',
        prerequisites: ['Perform 30 ranks', 'Countersong']
      },
      {
        id: 'reflect_arrows',
        name: 'Reflect Arrows',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You can reflect arrows back at attackers.',
        benefit: 'You can reflect arrows and other projectiles back at attackers.',
        prerequisites: ['Dex 25', 'Deflect Arrows', 'Improved Unarmed Strike']
      },
      {
        id: 'righteous_strike',
        name: 'Righteous Strike',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your attacks are infused with righteousness.',
        benefit: 'Your attacks deal an extra 1d6 points of damage to evil creatures.',
        prerequisites: ['Cha 21', 'Smite evil ability']
      },
      {
        id: 'ruinous_rage',
        name: 'Ruinous Rage',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your rage is incredibly destructive.',
        benefit: 'While raging, you gain an additional +4 bonus to Strength and Constitution.',
        prerequisites: ['Str 25', 'Con 25', 'Rage ability', 'Epic Toughness']
      },
      {
        id: 'self_concealment',
        name: 'Self-Concealment',
        category: 'defensive',
        minimumLevel: 21,
        description: 'You are difficult to target with attacks.',
        benefit: 'You gain 10% concealment from all attacks.',
        prerequisites: ['Dex 23', 'Hide 30 ranks', 'Move Silently 30 ranks']
      },
      {
        id: 'shattering_strike',
        name: 'Shattering Strike',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your attacks can shatter weapons and armor.',
        benefit: 'You can attempt to sunder an opponent\'s weapon or armor as a free action.',
        prerequisites: ['Str 23', 'Improved Sunder', 'Weapon Focus']
      },
      {
        id: 'sneak_attack_of_opportunity',
        name: 'Sneak Attack of Opportunity',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can make sneak attacks as attacks of opportunity.',
        benefit: 'You can make sneak attacks as attacks of opportunity.',
        prerequisites: ['Sneak Attack +8d6', 'Opportunity Sneak Attack']
      },
      {
        id: 'spectral_strike',
        name: 'Spectral Strike',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your attacks can affect incorporeal creatures.',
        benefit: 'Your attacks affect incorporeal creatures normally.',
        prerequisites: ['Cha 21', 'Ghost Touch weapon']
      },
      {
        id: 'spell_stowaway',
        name: 'Spell Stowaway',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can cast spells that persist after you leave.',
        benefit: 'Spells you cast persist for 1 round after you leave their area.',
        prerequisites: ['Spellcraft 27 ranks', 'Extend Spell']
      },
      {
        id: 'spellcasting_harrier',
        name: 'Spellcasting Harrier',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can disrupt spellcasters effectively.',
        benefit: 'You gain a +4 bonus on checks to counterspell.',
        prerequisites: ['Spellcraft 24 ranks', 'Combat Casting']
      },
      {
        id: 'spontaneous_domain_access',
        name: 'Spontaneous Domain Access',
        category: 'divine',
        minimumLevel: 21,
        description: 'You can spontaneously cast domain spells.',
        benefit: 'You can spontaneously cast any domain spell you know.',
        prerequisites: ['Wis 21', 'Access to domain spells']
      },
      {
        id: 'spontaneous_spell',
        name: 'Spontaneous Spell',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can cast spells spontaneously.',
        benefit: 'You can spontaneously cast any spell you know.',
        prerequisites: ['Spellcraft 25 ranks']
      },
      {
        id: 'storm_of_throws',
        name: 'Storm of Throws',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can throw weapons with incredible speed.',
        benefit: 'You can throw one additional weapon per round.',
        prerequisites: ['Dex 23', 'Quick Draw', 'Point Blank Shot']
      },
      {
        id: 'superior_initiative',
        name: 'Superior Initiative',
        category: 'combat',
        minimumLevel: 21,
        description: 'You always act first in combat.',
        benefit: 'You gain a +8 bonus on initiative checks.',
        prerequisites: ['Dex 25', 'Improved Initiative', 'Epic Initiative']
      },
      {
        id: 'swift_and_silent',
        name: 'Swift and Silent',
        category: 'utility',
        minimumLevel: 21,
        description: 'You move with incredible stealth.',
        benefit: 'You gain a +10 bonus on Hide and Move Silently checks.',
        prerequisites: ['Dex 23', 'Hide 30 ranks', 'Move Silently 30 ranks']
      },
      {
        id: 'tenacious_magic',
        name: 'Tenacious Magic',
        category: 'magic',
        minimumLevel: 21,
        description: 'Your spells are difficult to dispel.',
        benefit: 'Your spells have a +4 bonus on checks to resist being dispelled.',
        prerequisites: ['Spellcraft 25 ranks']
      },
      {
        id: 'terrifying_rage',
        name: 'Terrifying Rage',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your rage terrifies opponents.',
        benefit: 'Opponents within 30 feet must make a Will save or become shaken.',
        prerequisites: ['Intimidate 30 ranks', 'Rage ability']
      },
      {
        id: 'thundering_rage',
        name: 'Thundering Rage',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your rage creates sonic booms.',
        benefit: 'Your rage attacks create sonic damage in a 10-foot radius.',
        prerequisites: ['Str 23', 'Rage ability', 'Epic Toughness']
      },
      {
        id: 'trap_sense',
        name: 'Trap Sense',
        category: 'utility',
        minimumLevel: 21,
        description: 'You have an uncanny ability to detect traps.',
        benefit: 'You gain a +4 bonus on Reflex saves against traps.',
        prerequisites: ['Search 21 ranks', 'Trapfinding']
      },
      {
        id: 'two_weapon_rend',
        name: 'Two-Weapon Rend',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can rend opponents with two weapons.',
        benefit: 'You can make a rend attack with two weapons.',
        prerequisites: ['Dex 21', 'Two-Weapon Fighting', 'Improved Two-Weapon Fighting']
      },
      {
        id: 'uncanny_accuracy',
        name: 'Uncanny Accuracy',
        category: 'combat',
        minimumLevel: 21,
        description: 'You can strike with incredible precision.',
        benefit: 'You ignore up to 5 points of miss chance from concealment.',
        prerequisites: ['Dex 21', 'Point Blank Shot', 'Precise Shot']
      },
      {
        id: 'unholy_strike',
        name: 'Unholy Strike',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your attacks are infused with unholy power.',
        benefit: 'Your attacks deal an extra 1d6 points of damage to good creatures.',
        prerequisites: ['Cha 21', 'Smite good ability']
      },
      {
        id: 'unlimited_ammunition',
        name: 'Unlimited Ammunition',
        category: 'combat',
        minimumLevel: 21,
        description: 'You never run out of ammunition.',
        benefit: 'You have unlimited ammunition for one type of ranged weapon.',
        prerequisites: ['Dex 21', 'Rapid Shot', 'Endless Ammunition']
      },
      {
        id: 'vorpal_strike',
        name: 'Vorpal Strike',
        category: 'combat',
        minimumLevel: 21,
        description: 'Your attacks can sever limbs.',
        benefit: 'Your critical hits can sever limbs.',
        prerequisites: ['Str 25', 'Weapon Focus', 'Improved Critical']
      },
      {
        id: 'widen_aura_of_courage',
        name: 'Widen Aura of Courage',
        category: 'leadership',
        minimumLevel: 21,
        description: 'Your aura of courage affects a wider area.',
        benefit: 'Your aura of courage extends to 120 feet.',
        prerequisites: ['Cha 23', 'Aura of Courage', 'Improved Aura of Courage']
      },
      {
        id: 'zone_of_animation',
        name: 'Zone of Animation',
        category: 'magic',
        minimumLevel: 21,
        description: 'You can animate objects in an area.',
        benefit: 'You can animate all objects in a 30-foot radius.',
        prerequisites: ['Spellcraft 25 ranks', 'Animate Objects']
      }
    ];

    // Load feats into database
    for (const feat of epicFeatsData) {
      this.epicFeats.set(feat.id, feat);
    }

    console.log(`📚 Loaded ${this.epicFeats.size} epic feats`);
  }

  async buildPrerequisiteGraph() {
    // Build prerequisite relationships
    for (const [featId, feat] of this.epicFeats) {
      const prerequisites = {
        featPrerequisites: feat.prerequisites || [],
        epicFeatPrerequisites: feat.epicFeatPrerequisites || [],
        abilityRequirements: feat.abilityRequirements || {},
        classRequirements: feat.classRequirements || [],
        skillRequirements: feat.skillRequirements || {},
        minimumLevel: feat.minimumLevel || 21
      };

      this.featPrerequisites.set(featId, prerequisites);
    }

    console.log('🔗 Built prerequisite graph for epic feats');
  }

  async categorizeFeats() {
    // Categorize feats by type
    const categories = {
      combat: [],
      defensive: [],
      magic: [],
      divine: [],
      psionic: [],
      utility: [],
      skill: [],
      ability: [],
      leadership: [],
      social: [],
      item_creation: []
    };

    for (const [featId, feat] of this.epicFeats) {
      if (categories[feat.category]) {
        categories[feat.category].push(featId);
      }
    }

    for (const [category, featIds] of Object.entries(categories)) {
      this.featCategories.set(category, featIds);
    }

    console.log('📂 Categorized epic feats by type');
  }

  // Public API methods
  async getAllEpicFeats() {
    return Array.from(this.epicFeats.values());
  }

  async getEpicFeat(featId) {
    return this.epicFeats.get(featId);
  }

  async getEpicFeatsByCategory(category) {
    const featIds = this.featCategories.get(category) || [];
    return featIds.map(id => this.epicFeats.get(id)).filter(feat => feat);
  }

  async getEpicFeatsByMinimumLevel(minLevel) {
    const feats = [];
    for (const [featId, feat] of this.epicFeats) {
      if (feat.minimumLevel >= minLevel) {
        feats.push(feat);
      }
    }
    return feats;
  }

  async getFeatPrerequisites(featId) {
    return this.featPrerequisites.get(featId);
  }

  async searchEpicFeats(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    for (const [featId, feat] of this.epicFeats) {
      if (feat.name.toLowerCase().includes(searchTerm) ||
        feat.description.toLowerCase().includes(searchTerm) ||
        feat.benefit.toLowerCase().includes(searchTerm)) {
        results.push(feat);
      }
    }

    return results;
  }

  async getEpicFeatsForCharacter(character) {
    const availableFeats = [];

    for (const [featId, feat] of this.epicFeats) {
      const prerequisites = this.featPrerequisites.get(featId);
      if (await this.meetsPrerequisites(character, prerequisites)) {
        availableFeats.push(feat);
      }
    }

    return availableFeats;
  }

  async meetsPrerequisites(character, prerequisites) {
    // Check level requirement
    if (character.level < prerequisites.minimumLevel) {
      return false;
    }

    // Check ability requirements
    for (const [ability, requirement] of Object.entries(prerequisites.abilityRequirements)) {
      const charAbility = character.abilities[ability.toLowerCase()];
      if (!charAbility || charAbility.totalScore < requirement) {
        return false;
      }
    }

    // Check feat prerequisites
    for (const requiredFeat of prerequisites.featPrerequisites) {
      if (!this.characterHasFeat(character, requiredFeat)) {
        return false;
      }
    }

    // Check epic feat prerequisites
    for (const requiredEpicFeat of prerequisites.epicFeatPrerequisites) {
      if (!this.characterHasEpicFeat(character, requiredEpicFeat)) {
        return false;
      }
    }

    // Check class requirements
    for (const classReq of prerequisites.classRequirements) {
      const classLevel = this.getCharacterClassLevel(character, classReq.className);
      if (classLevel < classReq.minimumLevel) {
        return false;
      }
    }

    // Check skill requirements
    for (const [skill, requirement] of Object.entries(prerequisites.skillRequirements)) {
      const charSkill = character.skills[skill.toLowerCase()];
      if (!charSkill || charSkill.ranks < requirement) {
        return false;
      }
    }

    return true;
  }

  characterHasFeat(character, featName) {
    return character.feats && character.feats.some(feat => feat.name === featName);
  }

  characterHasEpicFeat(character, epicFeatName) {
    return character.epicFeats && character.epicFeats.some(feat => feat.name === epicFeatName);
  }

  getCharacterClassLevel(character, className) {
    const classInfo = character.classes.find(c => c.name === className);
    return classInfo ? classInfo.level : 0;
  }

  // Get feat power level for sorting
  getFeatPowerLevel(feat) {
    let power = 0;

    // Combat bonuses
    if (feat.combatBonus) power += feat.combatBonus * 2;
    if (feat.damageBonus) power += feat.damageBonus * 3;

    // Magic bonuses
    if (feat.magicBonus) power += feat.magicBonus * 4;

    // Save bonuses
    if (feat.saveBonus) power += feat.saveBonus * 2;

    // Special abilities
    if (feat.specialAbilities) power += feat.specialAbilities.length * 5;

    // Prerequisites (more prerequisites = more powerful)
    const prereqs = this.featPrerequisites.get(feat.id);
    if (prereqs) {
      power += prereqs.featPrerequisites.length * 2;
      power += prereqs.epicFeatPrerequisites.length * 5;
      power += Object.keys(prereqs.abilityRequirements).length * 3;
    }

    return power;
  }

  // Export feat data
  async exportFeatData() {
    const exportData = {
      feats: Object.fromEntries(this.epicFeats),
      prerequisites: Object.fromEntries(this.featPrerequisites),
      categories: Object.fromEntries(this.featCategories),
      exportedAt: new Date().toISOString(),
      version: '1.0'
    };

    return exportData;
  }
}

// Error Classes
class EpicFeatDatabaseError extends Error {
  constructor(message) { super(message); this.name = 'EpicFeatDatabaseError'; }
}

// Browser/Node.js compatibility exports
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EpicFeatDatabase;
} else if (typeof window !== 'undefined') {
  window.EpicFeatDatabase = EpicFeatDatabase;
}