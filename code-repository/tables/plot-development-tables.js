/**
 * Plot Development Tables
 * Random tables for generating plot hooks, complications, and story elements
 * 
 * @version 1.1
 * @date September 20, 2025
 * @location code-repository/tables/plot-development-tables.js
 */

const PlotDevelopmentTables = {
  category: "plot-development",
  description: "Tables for generating story elements, plot hooks, and narrative complications",
  
  tables: {
    "adventure-hooks": {
      id: "adventure-hooks",
      name: "Adventure Plot Hooks",
      description: "Story seeds to start new adventures",
      diceExpression: "1d12",
      category: "plot-hooks",
      results: [
        { range: [1, 1], result: "Ancient tomb has been unsealed, releasing unknown dangers" },
        { range: [2, 2], result: "Local children are disappearing near the old forest" },
        { range: [3, 3], result: "Merchant caravan needs protection through dangerous territory" },
        { range: [4, 4], result: "Strange plague affects only magic users in the city" },
        { range: [5, 5], result: "Dragon has claimed local mountain, demanding tribute" },
        { range: [6, 6], result: "Rival adventuring party seeks same artifact as heroes" },
        { range: [7, 7], result: "Cult is performing ritual to summon extraplanar entity" },
        { range: [8, 8], result: "Noble's heir has been replaced by doppelganger" },
        { range: [9, 9], result: "Magic academy students have unleashed dangerous experiment" },
        { range: [10, 10], result: "Pirates have established base threatening trade routes" },
        { range: [11, 11], result: "Ancient prophecy suggests heroes are key to preventing disaster" },
        { range: [12, 12], result: "Gods themselves seek mortal agents for cosmic conflict" }
      ]
    },

    "complications": {
      id: "complications",
      name: "Adventure Complications",
      description: "Things that make adventures more interesting",
      diceExpression: "1d10",
      category: "complications",
      results: [
        { range: [1, 1], result: "Important NPC has hidden agenda" },
        { range: [2, 2], result: "Weather turns severe at worst possible moment" },
        { range: [3, 3], result: "Key information was deliberately false" },
        { range: [4, 4], result: "Local authority opposes heroes' mission" },
        { range: [5, 5], result: "Required item is owned by former enemy" },
        { range: [6, 6], result: "Time limit is shorter than originally thought" },
        { range: [7, 7], result: "Innocent bystanders are in danger" },
        { range: [8, 8], result: "Heroes' reputation precedes them negatively" },
        { range: [9, 9], result: "Equipment failure at critical moment" },
        { range: [10, 10], result: "Moral dilemma requires choosing between two goods" }
      ]
    },

    "story-twists": {
      id: "story-twists",
      name: "Story Twists",
      description: "Unexpected revelations that change everything",
      diceExpression: "1d20",
      category: "plot-hooks",
      results: [
        { range: [1, 1], result: "The quest giver is actually the main villain" },
        { range: [2, 2], result: "The artifact they seek doesn't exist" },
        { range: [3, 3], result: "One party member is not who they claim to be" },
        { range: [4, 4], result: "The heroes are actually in an alternate reality" },
        { range: [5, 5], result: "The 'monster' they're hunting is innocent" },
        { range: [6, 6], result: "The heroes' actions caused the problem they're solving" },
        { range: [7, 7], result: "Time travel is involved somehow" },
        { range: [8, 8], result: "The entire adventure was someone's dream or illusion" },
        { range: [9, 9], result: "The heroes are descendants of their enemies" },
        { range: [10, 10], result: "The world they know is ending soon" },
        { range: [11, 11], result: "Magic is failing or changing fundamentally" },
        { range: [12, 12], result: "The gods are not what mortals believe them to be" },
        { range: [13, 13], result: "The heroes must become what they oppose" },
        { range: [14, 14], result: "Every choice leads to the same inevitable outcome" },
        { range: [15, 15], result: "The real treasure was friendship all along... or was it?" },
        { range: [16, 16], result: "Death in this realm isn't permanent" },
        { range: [17, 17], result: "The heroes are the reincarnation of ancient enemies" },
        { range: [18, 18], result: "Everything happens in reverse order" },
        { range: [19, 19], result: "The adventure takes place inside someone's mind" },
        { range: [20, 20], result: "The heroes are fictional characters who gained sentience" }
      ]
    },

    "quest-objectives": {
      id: "quest-objectives",
      name: "Quest Objectives",
      description: "Primary goals and missions for adventures",
      diceExpression: "1d20",
      category: "plot-hooks",
      results: [
        { range: [1, 1], result: "Retrieve a stolen artifact from bandits" },
        { range: [2, 2], result: "Rescue kidnapped noble from monster lair" },
        { range: [3, 3], result: "Escort important person through dangerous territory" },
        { range: [4, 4], result: "Investigate mysterious disappearances in town" },
        { range: [5, 5], result: "Stop ritual that will summon great evil" },
        { range: [6, 6], result: "Find cure for magical plague" },
        { range: [7, 7], result: "Negotiate peace between warring factions" },
        { range: [8, 8], result: "Explore newly discovered ancient ruins" },
        { range: [9, 9], result: "Defend settlement from incoming monster army" },
        { range: [10, 10], result: "Gather rare components for powerful spell" },
        { range: [11, 11], result: "Expose corruption in local government" },
        { range: [12, 12], result: "Hunt down dangerous escaped prisoner" },
        { range: [13, 13], result: "Deliver message to distant ally" },
        { range: [14, 14], result: "Clear trade route of monster infestations" },
        { range: [15, 15], result: "Locate entrance to legendary hidden city" },
        { range: [16, 16], result: "Prevent assassination of important figure" },
        { range: [17, 17], result: "Recover lost knowledge from abandoned library" },
        { range: [18, 18], result: "Seal portal to prevent planar invasion" },
        { range: [19, 19], result: "Unite scattered clues to solve ancient mystery" },
        { range: [20, 20], result: "Confront and defeat legendary monster" }
      ]
    },

    "moral-dilemmas": {
      id: "moral-dilemmas",
      name: "Moral Dilemmas",
      description: "Ethical challenges that test character values",
      diceExpression: "1d12",
      category: "complications",
      results: [
        { range: [1, 1], result: "Save many strangers or one beloved friend" },
        { range: [2, 2], result: "Tell truth that will cause harm or lie to protect" },
        { range: [3, 3], result: "Uphold law that is unjust or break it for justice" },
        { range: [4, 4], result: "Use enemy's tactics to defeat greater evil" },
        { range: [5, 5], result: "Sacrifice personal desires for greater good" },
        { range: [6, 6], result: "Forgive unforgivable acts or seek righteous vengeance" },
        { range: [7, 7], result: "Share resources equally or reward those who earned them" },
        { range: [8, 8], result: "Preserve ancient tradition or embrace necessary change" },
        { range: [9, 9], result: "Respect someone's wishes even if they're harmful" },
        { range: [10, 10], result: "Take credit for another's work or let them be overlooked" },
        { range: [11, 11], result: "End suffering through mercy killing or preserve life" },
        { range: [12, 12], result: "Trust reformed enemy or remain suspicious" }
      ]
    },

    "quest-complication": {
      id: "quest-complication",
      name: "Quest Complications",
      description: "Unexpected obstacles that complicate ongoing adventures",
      diceExpression: "1d20",
      category: "complications",
      results: [
        { range: [1, 1], result: "Key ally is revealed as double agent" },
        { range: [2, 2], result: "Important information was deliberately false" },
        { range: [3, 3], result: "Rival adventuring party pursues same goal" },
        { range: [4, 4], result: "Target has already been moved or hidden" },
        { range: [5, 5], result: "Natural disaster blocks primary route" },
        { range: [6, 6], result: "Local authorities declare party outlaws" },
        { range: [7, 7], result: "Quest giver disappears under mysterious circumstances" },
        { range: [8, 8], result: "Magical barrier prevents access to objective" },
        { range: [9, 9], result: "Key NPC is captured by enemies" },
        { range: [10, 10], result: "Resource depletion forces difficult choices" },
        { range: [11, 11], result: "Time limit becomes more urgent than expected" },
        { range: [12, 12], result: "Innocent bystanders become involved" },
        { range: [13, 13], result: "Weather conditions severely hamper progress" },
        { range: [14, 14], result: "Equipment failure at critical moment" },
        { range: [15, 15], result: "Ancient curse activates due to party's actions" },
        { range: [16, 16], result: "Political situation changes dramatically" },
        { range: [17, 17], result: "Monster migration forces detour" },
        { range: [18, 18], result: "Key location is under siege by hostile forces" },
        { range: [19, 19], result: "Party member's past catches up with them" },
        { range: [20, 20], result: "True objective was different than originally stated" }
      ]
    },

    "plot-twist": {
      id: "plot-twist",
      name: "Plot Twists",
      description: "Unexpected revelations that change adventure direction",
      diceExpression: "1d20",
      category: "plot-development",
      results: [
        { range: [1, 1], result: "Trusted ally has been working for the enemy all along" },
        { range: [2, 2], result: "The villain is actually the party's patron in disguise" },
        { range: [3, 3], result: "The artifact they seek is already in their possession" },
        { range: [4, 4], result: "One party member is revealed to be of noble birth" },
        { range: [5, 5], result: "The mission was a test set up by a secret organization" },
        { range: [6, 6], result: "The real treasure was the friends they made along the way" },
        { range: [7, 7], result: "The location they seek exists in multiple dimensions" },
        { range: [8, 8], result: "The enemy they fight is their future self" },
        { range: [9, 9], result: "The curse can only be broken by making things worse" },
        { range: [10, 10], result: "The prophecy was deliberately mistranslated" },
        { range: [11, 11], result: "The monster they hunt is protecting something innocent" },
        { range: [12, 12], result: "Their actions have been fulfilling the villain's plan" },
        { range: [13, 13], result: "The quest giver is already dead, replaced by illusion" },
        { range: [14, 14], result: "Time loops have made this the same adventure repeatedly" },
        { range: [15, 15], result: "The map they follow leads to a trap, not treasure" },
        { range: [16, 16], result: "The party has been transported to alternate reality" },
        { range: [17, 17], result: "Their memories of why they started have been altered" },
        { range: [18, 18], result: "The solution requires sacrificing their greatest strength" },
        { range: [19, 19], result: "The ancient evil was actually keeping worse evil contained" },
        { range: [20, 20], result: "Victory will fulfill dark prophecy they tried to prevent" }
      ]
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PlotDevelopmentTables;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.PlotDevelopmentTables = PlotDevelopmentTables;
}