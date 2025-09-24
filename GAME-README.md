# RulzLawyer - D&D 3.5 Character Survival Game

**Complete D&D 3.5 Gaming System with Character Creation and Adventure Engine**

## 🎮 Game Overview

RulzLawyer is a fully functional D&D 3.5 character creator and adventure system where players create characters that must survive progressively challenging adventures. This is a complete gaming experience, not just a utility tool.

### 🎯 Core Features

- **Complete Character Creation**: 7-step wizard with full D&D 3.5 SRD compliance
- **Advanced Dice Engine**: Cryptographically secure randomness with complex expression parsing
- **Dynamic Adventure System**: Procedurally generated adventures with scaling difficulty
- **Character Sheet Interface**: Authentic D&D character sheet design based on PDF examples
- **Survival Mechanics**: Characters must survive encounters to advance and grow stronger
- **Epic Level Support**: Characters can progress from level 1 to 100+ with divine ascension

## 🚀 Quick Start

### Running the Game

1. **Start the Server**:
   ```powershell
   # Clean any existing processes
   Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
   
   # Start the game server
   node server-enhanced.js
   ```
    
2. **Open Your Browser**:
   - Go to `http://localhost:3000`
   - The game interface will load automatically

3. **Create Your Character**:
   - Click "Generate Character" to create a random D&D 3.5 character
   - Review ability scores, race, class, and equipment
   - Save your character when satisfied

4. **Start Your Adventure**:
   - Click "Start Adventure" to begin your survival journey
   - Navigate through encounters using the adventure log
   - Survive to gain experience and treasure

## 🎲 Game Systems

### Dice Engine
- **Location**: `code-repository/src/dice/dice-engine.js`
- **Features**: 
  - Cryptographically secure random number generation
  - Complex expression parsing (4d6dl1, 2d20kh1, advantage/disadvantage)
  - Performance optimized (<1ms individual rolls)
  - Statistical validation and bias detection

### Character Generator
- **Location**: `code-repository/src/character/character-generator.js`
- **Features**:
  - Full D&D 3.5 SRD compliance (7 races, 6+ classes)
  - Automatic ability score generation using 4d6 drop lowest
  - Complete skill and equipment assignment
  - Racial modifiers and class features
  - Starting wealth calculation

### Adventure Engine
- **Location**: `code-repository/src/adventure/adventure-engine.js`
- **Features**:
  - Dynamic encounter generation (17+ encounter tables)
  - Environment-based adventures (wilderness, dungeon, urban)
  - Challenge Rating scaling based on party level
  - Treasure generation with level-appropriate rewards
  - Experience point calculation and advancement

### Game Interface
- **Location**: `index.html`
- **Design**: Based on authentic D&D 3.5 character sheet PDFs
- **Features**:
  - Responsive character sheet layout
  - Real-time ability score display with modifiers
  - Equipment and skill management
  - Adventure log with encounter resolution
  - Dice rolling interface

## 📋 Character Creation Process

### 1. Basic Information
- **Race Selection**: Human, Elf, Dwarf, Halfling, Gnome, Half-Elf, Half-Orc
- **Class Selection**: Fighter, Wizard, Rogue, Cleric, Ranger, Paladin, etc.
- **Ability Scores**: Generated using 4d6 drop lowest method
- **Racial Modifiers**: Automatically applied based on race selection

### 2. Derived Statistics
- **Hit Points**: Based on class hit die + Constitution modifier
- **Armor Class**: 10 + Dexterity modifier + armor/shield bonuses
- **Saving Throws**: Fortitude, Reflex, Will based on class progression
- **Base Attack Bonus**: Full, Medium, or Poor progression based on class

### 3. Skills and Equipment
- **Class Skills**: Automatically determined by character class
- **Starting Equipment**: Class-appropriate weapons, armor, and gear
- **Starting Wealth**: Rolled based on class wealth progression
- **Skill Points**: Intelligence modifier + class skill points per level

## 🗡️ Adventure System

### Adventure Types
1. **Goblin Raid**: Combat-focused wilderness adventure
2. **Ancient Tomb**: Dungeon exploration with traps and undead
3. **City Investigation**: Urban social encounters and mysteries

### Encounter Types
- **Combat**: Direct confrontation requiring tactical decisions
- **Social**: Diplomacy, negotiation, and roleplay opportunities
- **Exploration**: Discovery of secrets, treasures, and hidden areas
- **Traps**: Skill challenges requiring careful navigation
- **Treasure**: Rewards for successful adventure completion

### Difficulty Scaling
- Encounters scale with character level
- Challenge Ratings adjust automatically
- Experience rewards increase with difficulty
- Treasure values scale appropriately

## 🎲 Dice Rolling System

### Supported Expressions
- **Basic Dice**: `1d20`, `3d6`, `2d10+5`
- **Drop/Keep Modifiers**: `4d6dl1`, `2d20kh1`
- **Advantage/Disadvantage**: `advantage`, `disadvantage`
- **Complex Expressions**: `1d20+5+1d4`, `3d6+2d4-1`

### Performance Features
- Individual rolls: <1ms execution time
- Batch operations: <10ms for multiple expressions
- Cryptographically secure randomness
- Statistical validation and testing

## 💾 Data Persistence

### Character Storage
- **Local Storage**: Characters saved to browser localStorage
- **JSON Format**: Full character data serialization
- **Auto-Save**: Characters automatically saved on changes
- **Load/Export**: Import/export character files

### Session Management
- **Adventure Progress**: Active adventures persist across sessions
- **Experience Tracking**: Cumulative experience and level progression
- **Equipment Changes**: Dynamic inventory management
- **Statistics**: Game statistics and performance metrics

## 🏗️ Architecture

### File Structure
```
RulzLawyer/
├── index.html                          # Main game interface
├── server-enhanced.js                  # HTTP server
├── code-repository/src/
│   ├── dice/
│   │   └── dice-engine.js             # Dice rolling system
│   ├── character/
│   │   └── character-generator.js     # Character creation
│   ├── adventure/
│   │   └── adventure-engine.js        # Adventure generation
│   └── integrated-character-creator.js # Main game controller
└── examples/
    ├── Example Sheet.pdf              # Character sheet reference
    ├── Example Sheet page 2.pdf       # Additional sheet pages
    └── Example Sheet page 3.pdf       # Final sheet reference
```

### Module Dependencies
- **DiceEngine**: Core randomization for all systems
- **CharacterGenerator**: Depends on DiceEngine for ability scores
- **AdventureEngine**: Uses DiceEngine for encounters and treasure
- **IntegratedCharacterCreator**: Orchestrates all systems

## 🔧 Configuration

### Server Settings
- **Port**: 3000 (configurable in server-enhanced.js)
- **Host**: localhost (configurable)
- **MIME Types**: Full support for web assets
- **Health Check**: Available at `/health` endpoint

### Game Settings
- **Max History**: 50 log entries (configurable)
- **Auto-Save**: Enabled by default
- **Performance Targets**: <1ms dice rolls, <2s character generation

## 🧪 Testing and Validation

### Manual Testing
1. **Character Generation**: Create multiple characters, verify stats
2. **Dice Rolling**: Test various expressions and modifiers
3. **Adventure Flow**: Complete full adventure cycles
4. **Data Persistence**: Save/load characters across sessions

### Performance Monitoring
- Dice engine performance statistics
- Character generation timing
- Adventure encounter resolution speed
- Memory usage tracking

## 🎨 User Interface

### Design Philosophy
- **Authentic D&D Look**: Based on official character sheets
- **Responsive Design**: Works on desktop and tablet devices
- **Accessibility**: Clear fonts, good contrast, logical tab order
- **Intuitive Navigation**: Logical flow from character creation to adventure

### Visual Elements
- **Color Scheme**: Brown/tan parchment theme
- **Typography**: Times New Roman serif fonts for authenticity
- **Layout**: Grid-based responsive design
- **Interactive Elements**: Hover effects and visual feedback

## 📖 Game Rules

### D&D 3.5 SRD Compliance
- **Ability Scores**: Standard 3-18 range with racial modifiers
- **Classes**: Core classes with accurate progression tables
- **Skills**: Full skill list with ability-based modifiers
- **Equipment**: Standard equipment lists and pricing
- **Spells**: Spellcasting classes with appropriate spell progression

### Character Advancement
- **Experience Points**: Standard D&D 3.5 advancement table
- **Level Benefits**: Automatic hit point increases, saves, BAB
- **Multiclassing**: Supported with appropriate penalties
- **Epic Levels**: Progression beyond 20th level available

## 🚀 Future Enhancements

### Planned Features
1. **Multiplayer Support**: Multiple characters in same adventure
2. **Campaign Management**: Long-term character progression
3. **Custom Adventures**: User-created adventure content
4. **Extended SRD Content**: Additional races, classes, spells
5. **Combat System**: Detailed tactical combat resolution

### Technical Improvements
1. **Database Integration**: Persistent character storage
2. **Real-time Updates**: WebSocket-based multiplayer
3. **Mobile Optimization**: Touch-friendly interface
4. **Offline Support**: Service worker for offline play
5. **Performance Optimization**: Web Worker dice engine

## 🐛 Known Issues

### Current Limitations
- Adventure encounters are simulated automatically
- Limited spell system implementation
- Basic equipment interaction
- Single-player only

### Workarounds
- Manual encounter resolution via adventure log
- Equipment changes through character sheet interface
- Save frequently to preserve progress

## 📄 License and Credits

### D&D 3.5 SRD Content
This game uses content from the System Reference Document 3.5, which is Open Game Content.

### Development Credits
- **Game Engine**: Custom JavaScript implementation
- **Character Sheet Design**: Based on official D&D 3.5 character sheets
- **Random Tables**: Derived from D&D 3.5 SRD encounter tables
- **Dice Engine**: Original cryptographically secure implementation

---

**Ready to create your character and begin your survival adventure?**

Start the server with `node server-enhanced.js` and navigate to `http://localhost:3000` to begin your D&D 3.5 journey in RulzLawyer!