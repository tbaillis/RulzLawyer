/**
 * Environment Tables
 * Random tables for weather conditions and environmental events
 * 
 * @version 1.1
 * @date September 20, 2025
 * @location code-repository/tables/environment-tables.js
 */

const EnvironmentTables = {
  category: "environment",
  description: "Tables for generating weather, events, and environmental conditions",
  
  tables: {
    "weather-conditions": {
      id: "weather-conditions",
      name: "Weather Conditions",
      description: "Random weather for outdoor adventures",
      diceExpression: "2d6",
      category: "weather",
      results: [
        { range: [2, 2], result: "Severe storm", description: "Heavy rain, strong winds, possible lightning" },
        { range: [3, 4], result: "Rain", description: "Steady rainfall, muddy conditions" },
        { range: [5, 6], result: "Overcast", description: "Cloudy skies, no precipitation" },
        { range: [7, 8], result: "Clear", description: "Pleasant weather, good visibility" },
        { range: [9, 10], result: "Partly cloudy", description: "Some clouds, mostly pleasant" },
        { range: [11, 11], result: "Fog", description: "Heavy mist reduces visibility" },
        { range: [12, 12], result: "Extreme weather", description: "Blizzard, hurricane, or supernatural weather" }
      ]
    },

    "random-events": {
      id: "random-events",
      name: "Random Events",
      description: "Unexpected events during travel or downtime",
      diceExpression: "1d20",
      category: "events",
      results: [
        { range: [1, 2], result: "Festival or celebration in nearby settlement" },
        { range: [3, 4], result: "Messenger arrives with urgent news" },
        { range: [5, 6], result: "Strange lights appear in the sky" },
        { range: [7, 8], result: "Local wildlife acts unusually" },
        { range: [9, 10], result: "Old friend or ally appears unexpectedly" },
        { range: [11, 12], result: "Merchant offers rare trade opportunity" },
        { range: [13, 14], result: "Natural disaster threatens area" },
        { range: [15, 16], result: "Mysterious stranger asks for help" },
        { range: [17, 18], result: "Evidence of recent magical activity" },
        { range: [19, 19], result: "Portal to another plane opens nearby" },
        { range: [20, 20], result: "Time loop or temporal anomaly occurs" }
      ]
    },

    "seasonal-events": {
      id: "seasonal-events",
      name: "Seasonal Events",
      description: "Events tied to specific seasons and times of year",
      diceExpression: "1d12",
      category: "events",
      results: [
        { range: [1, 1], result: "Spring: Flowers bloom with magical properties" },
        { range: [2, 2], result: "Spring: Migratory creatures return en masse" },
        { range: [3, 3], result: "Spring: Rivers flood from melting snow" },
        { range: [4, 4], result: "Summer: Drought affects water sources" },
        { range: [5, 5], result: "Summer: Forest fires threaten settlements" },
        { range: [6, 6], result: "Summer: Excessive heat causes strange phenomena" },
        { range: [7, 7], result: "Autumn: Harvest festivals celebrate abundance" },
        { range: [8, 8], result: "Autumn: Leaves fall in unnatural patterns" },
        { range: [9, 9], result: "Autumn: Animals prepare for harsh winter" },
        { range: [10, 10], result: "Winter: Blizzards isolate communities" },
        { range: [11, 11], result: "Winter: Ice creates treacherous conditions" },
        { range: [12, 12], result: "Winter: Aurora displays hint at magical activity" }
      ]
    },

    "natural-disasters": {
      id: "natural-disasters",
      name: "Natural Disasters",
      description: "Major environmental catastrophes and their effects",
      diceExpression: "1d10",
      category: "events",
      results: [
        { range: [1, 1], result: "Earthquake splits the ground, revealing hidden caves" },
        { range: [2, 2], result: "Volcanic eruption threatens entire region" },
        { range: [3, 3], result: "Massive flood changes landscape permanently" },
        { range: [4, 4], result: "Tornado destroys everything in its path" },
        { range: [5, 5], result: "Wildfire spreads rapidly through dry terrain" },
        { range: [6, 6], result: "Avalanche buries mountain paths" },
        { range: [7, 7], result: "Sinkhole opens, swallowing nearby structures" },
        { range: [8, 8], result: "Meteor impact creates new crater lake" },
        { range: [9, 9], result: "Magical storm with unpredictable effects" },
        { range: [10, 10], result: "Planar rift causes reality distortions" }
      ]
    },

    "atmospheric-phenomena": {
      id: "atmospheric-phenomena",
      name: "Atmospheric Phenomena",
      description: "Unusual weather and sky events",
      diceExpression: "1d20",
      category: "weather",
      results: [
        { range: [1, 2], result: "Double rainbow after sudden storm" },
        { range: [3, 4], result: "Blood red sunset that lasts for hours" },
        { range: [5, 6], result: "Green lightning with no thunder" },
        { range: [7, 8], result: "Hail shaped like geometric patterns" },
        { range: [9, 10], result: "Snow that falls upward into the sky" },
        { range: [11, 12], result: "Clouds that form recognizable shapes" },
        { range: [13, 14], result: "Rain that changes color as it falls" },
        { range: [15, 16], result: "Wind that whispers in ancient languages" },
        { range: [17, 17], result: "Aurora visible during daylight hours" },
        { range: [18, 18], result: "Two suns appear in the sky simultaneously" },
        { range: [19, 19], result: "Stars visible despite bright daylight" },
        { range: [20, 20], result: "Sky appears as if made of crystalline glass" }
      ]
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnvironmentTables;
}

// Global namespace for browser use
if (typeof window !== 'undefined') {
  window.EnvironmentTables = EnvironmentTables;
}