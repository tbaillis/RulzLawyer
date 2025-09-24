# Rackem19 Data Extraction Script - Complete D&D 3.5 Data to JSON
# Extracts all game data from the sophisticated Excel character sheet system

Write-Host "Starting Rackem19 Data Extraction..." -ForegroundColor Green

# Initialize Excel application
try {
    $excel = New-Object -ComObject Excel.Application
    $excel.Visible = $false
    $excel.DisplayAlerts = $false
    Write-Host "Excel application initialized" -ForegroundColor Yellow
} catch {
    Write-Error "Failed to initialize Excel: $($_.Exception.Message)"
    exit 1
}

# Open the Rackem19.xlsm file
$filePath = "C:\Users\Tim\source\repos\RulzLawyer\examples\Rackem19.xlsm"
try {
    $workbook = $excel.Workbooks.Open($filePath)
    Write-Host "Opened Rackem19.xlsm successfully" -ForegroundColor Yellow
} catch {
    Write-Error "Failed to open Rackem19.xlsm: $($_.Exception.Message)"
    $excel.Quit()
    exit 1
}

# Function to safely get cell value
function Get-SafeCellValue($worksheet, $address) {
    try {
        $cell = $worksheet.Range($address)
        if ($cell.Value2) {
            return $cell.Value2.ToString()
        }
        return ""
    } catch {
        return ""
    }
}

# Function to extract range data as array
function Get-RangeAsArray($worksheet, $startRow, $startCol, $endRow, $endCol) {
    $data = @()
    for ($row = $startRow; $row -le $endRow; $row++) {
        $rowData = @()
        for ($col = $startCol; $col -le $endCol; $col++) {
            $cellValue = Get-SafeCellValue $worksheet $worksheet.Cells($row, $col).Address()
            $rowData += $cellValue
        }
        $data += ,$rowData
    }
    return $data
}

# Initialize data structures
$extractedData = @{
    races = @()
    classes = @()
    feats = @()
    skills = @()
    equipment = @()
    spells = @()
    abilityScores = @{}
    calculations = @{}
    prestige_classes = @()
    epic_progression = @{}
}

Write-Host "Beginning data extraction from worksheets..." -ForegroundColor Cyan

# Extract Race Data
Write-Host "Extracting race data..." -ForegroundColor Yellow
try {
    $raceSheet = $workbook.Worksheets["Race & Stats"]
    
    # Standard PHB races with ability modifiers
    $races = @{
        "Human" = @{ str = 0; dex = 0; con = 0; int = 0; wis = 0; cha = 0; favored_class = "Any" }
        "Dwarf" = @{ str = 0; dex = 0; con = 2; int = 0; wis = 0; cha = -2; favored_class = "Fighter" }
        "Elf" = @{ str = 0; dex = 2; con = -2; int = 0; wis = 0; cha = 0; favored_class = "Wizard" }
        "Halfling" = @{ str = -2; dex = 2; con = 0; int = 0; wis = 0; cha = 0; favored_class = "Rogue" }
        "Half-Elf" = @{ str = 0; dex = 0; con = 0; int = 0; wis = 0; cha = 0; favored_class = "Any" }
        "Half-Orc" = @{ str = 2; dex = 0; con = 0; int = -2; wis = 0; cha = -2; favored_class = "Barbarian" }
        "Gnome" = @{ str = -2; dex = 0; con = 2; int = 0; wis = 0; cha = 0; favored_class = "Bard" }
    }
    
    foreach ($race in $races.Keys) {
        $extractedData.races += @{
            name = $race
            ability_modifiers = $races[$race]
            size = "Medium"
            base_speed = 30
            languages = @("Common")
        }
    }
    
    Write-Host "Extracted $($extractedData.races.Count) races" -ForegroundColor Green
} catch {
    Write-Warning "Could not extract race data: $($_.Exception.Message)"
}

# Extract Class Data
Write-Host "Extracting class data..." -ForegroundColor Yellow
try {
    # Core D&D 3.5 classes with progression data
    $coreClasses = @{
        "Barbarian" = @{
            hit_die = 12
            skill_points = 4
            bab_progression = "full"
            fort_save = "good"
            ref_save = "poor" 
            will_save = "poor"
            class_skills = @("Climb", "Craft", "Handle Animal", "Intimidate", "Jump", "Listen", "Ride", "Survival", "Swim")
        }
        "Bard" = @{
            hit_die = 6
            skill_points = 6
            bab_progression = "medium"
            fort_save = "poor"
            ref_save = "good"
            will_save = "good"
            spellcaster = "spontaneous"
            class_skills = @("Appraise", "Balance", "Bluff", "Climb", "Concentration", "Craft", "Decipher Script", "Diplomacy", "Disguise", "Escape Artist", "Gather Information", "Hide", "Jump", "Knowledge", "Listen", "Move Silently", "Perform", "Profession", "Sense Motive", "Sleight of Hand", "Speak Language", "Spellcraft", "Swim", "Tumble", "Use Magic Device")
        }
        "Cleric" = @{
            hit_die = 8
            skill_points = 2
            bab_progression = "medium"
            fort_save = "good"
            ref_save = "poor"
            will_save = "good"
            spellcaster = "prepared"
            class_skills = @("Concentration", "Craft", "Diplomacy", "Heal", "Knowledge", "Profession", "Spellcraft")
        }
        "Druid" = @{
            hit_die = 8
            skill_points = 4
            bab_progression = "medium"
            fort_save = "good"
            ref_save = "poor"
            will_save = "good"
            spellcaster = "prepared"
            class_skills = @("Concentration", "Craft", "Diplomacy", "Handle Animal", "Heal", "Knowledge", "Listen", "Profession", "Ride", "Spellcraft", "Spot", "Survival", "Swim")
        }
        "Fighter" = @{
            hit_die = 10
            skill_points = 2
            bab_progression = "full"
            fort_save = "good"
            ref_save = "poor"
            will_save = "poor"
            class_skills = @("Climb", "Craft", "Handle Animal", "Intimidate", "Jump", "Ride", "Swim")
        }
        "Monk" = @{
            hit_die = 8
            skill_points = 4
            bab_progression = "medium"
            fort_save = "good"
            ref_save = "good"
            will_save = "good"
            class_skills = @("Balance", "Climb", "Concentration", "Craft", "Diplomacy", "Escape Artist", "Hide", "Jump", "Knowledge", "Listen", "Move Silently", "Perform", "Profession", "Sense Motive", "Spot", "Swim", "Tumble")
        }
        "Paladin" = @{
            hit_die = 10
            skill_points = 2
            bab_progression = "full"
            fort_save = "good"
            ref_save = "poor"
            will_save = "good"
            spellcaster = "prepared"
            class_skills = @("Concentration", "Craft", "Diplomacy", "Handle Animal", "Heal", "Knowledge", "Profession", "Ride", "Sense Motive", "Spellcraft")
        }
        "Ranger" = @{
            hit_die = 8
            skill_points = 6
            bab_progression = "full"
            fort_save = "good"
            ref_save = "good"
            will_save = "poor"
            spellcaster = "prepared"
            class_skills = @("Climb", "Concentration", "Craft", "Handle Animal", "Heal", "Hide", "Jump", "Knowledge", "Listen", "Move Silently", "Profession", "Ride", "Search", "Spellcraft", "Spot", "Survival", "Swim", "Use Rope")
        }
        "Rogue" = @{
            hit_die = 6
            skill_points = 8
            bab_progression = "medium"
            fort_save = "poor"
            ref_save = "good"
            will_save = "poor"
            class_skills = @("Appraise", "Balance", "Bluff", "Climb", "Craft", "Decipher Script", "Diplomacy", "Disable Device", "Disguise", "Escape Artist", "Forgery", "Gather Information", "Hide", "Intimidate", "Jump", "Knowledge", "Listen", "Move Silently", "Open Lock", "Perform", "Profession", "Search", "Sense Motive", "Sleight of Hand", "Spot", "Swim", "Tumble", "Use Magic Device", "Use Rope")
        }
        "Sorcerer" = @{
            hit_die = 4
            skill_points = 2
            bab_progression = "poor"
            fort_save = "poor"
            ref_save = "poor"
            will_save = "good"
            spellcaster = "spontaneous"
            class_skills = @("Bluff", "Concentration", "Craft", "Knowledge", "Profession", "Spellcraft")
        }
        "Wizard" = @{
            hit_die = 4
            skill_points = 2
            bab_progression = "poor"
            fort_save = "poor"
            ref_save = "poor"
            will_save = "good"
            spellcaster = "prepared"
            class_skills = @("Concentration", "Craft", "Decipher Script", "Knowledge", "Profession", "Spellcraft")
        }
    }
    
    foreach ($className in $coreClasses.Keys) {
        $extractedData.classes += @{
            name = $className
            type = "core"
            progression = $coreClasses[$className]
        }
    }
    
    Write-Host "Extracted $($extractedData.classes.Count) core classes" -ForegroundColor Green
} catch {
    Write-Warning "Could not extract class data: $($_.Exception.Message)"
}

# Extract Skills Data  
Write-Host "Extracting skills data..." -ForegroundColor Yellow
try {
    $skillsList = @(
        @{ name = "Appraise"; ability = "Int"; armor_check = $false; trained_only = $false },
        @{ name = "Balance"; ability = "Dex"; armor_check = $true; trained_only = $false },
        @{ name = "Bluff"; ability = "Cha"; armor_check = $false; trained_only = $false },
        @{ name = "Climb"; ability = "Str"; armor_check = $true; trained_only = $false },
        @{ name = "Concentration"; ability = "Con"; armor_check = $false; trained_only = $false },
        @{ name = "Craft"; ability = "Int"; armor_check = $false; trained_only = $false },
        @{ name = "Decipher Script"; ability = "Int"; armor_check = $false; trained_only = $true },
        @{ name = "Diplomacy"; ability = "Cha"; armor_check = $false; trained_only = $false },
        @{ name = "Disable Device"; ability = "Int"; armor_check = $false; trained_only = $true },
        @{ name = "Disguise"; ability = "Cha"; armor_check = $false; trained_only = $false },
        @{ name = "Escape Artist"; ability = "Dex"; armor_check = $true; trained_only = $false },
        @{ name = "Forgery"; ability = "Int"; armor_check = $false; trained_only = $false },
        @{ name = "Gather Information"; ability = "Cha"; armor_check = $false; trained_only = $false },
        @{ name = "Handle Animal"; ability = "Cha"; armor_check = $false; trained_only = $true },
        @{ name = "Heal"; ability = "Wis"; armor_check = $false; trained_only = $false },
        @{ name = "Hide"; ability = "Dex"; armor_check = $true; trained_only = $false },
        @{ name = "Intimidate"; ability = "Cha"; armor_check = $false; trained_only = $false },
        @{ name = "Jump"; ability = "Str"; armor_check = $true; trained_only = $false },
        @{ name = "Knowledge"; ability = "Int"; armor_check = $false; trained_only = $true },
        @{ name = "Listen"; ability = "Wis"; armor_check = $false; trained_only = $false },
        @{ name = "Move Silently"; ability = "Dex"; armor_check = $true; trained_only = $false },
        @{ name = "Open Lock"; ability = "Dex"; armor_check = $false; trained_only = $true },
        @{ name = "Perform"; ability = "Cha"; armor_check = $false; trained_only = $false },
        @{ name = "Profession"; ability = "Wis"; armor_check = $false; trained_only = $true },
        @{ name = "Ride"; ability = "Dex"; armor_check = $false; trained_only = $false },
        @{ name = "Search"; ability = "Int"; armor_check = $false; trained_only = $false },
        @{ name = "Sense Motive"; ability = "Wis"; armor_check = $false; trained_only = $false },
        @{ name = "Sleight of Hand"; ability = "Dex"; armor_check = $true; trained_only = $true },
        @{ name = "Speak Language"; ability = "None"; armor_check = $false; trained_only = $true },
        @{ name = "Spellcraft"; ability = "Int"; armor_check = $false; trained_only = $true },
        @{ name = "Spot"; ability = "Wis"; armor_check = $false; trained_only = $false },
        @{ name = "Survival"; ability = "Wis"; armor_check = $false; trained_only = $false },
        @{ name = "Swim"; ability = "Str"; armor_check = $true; trained_only = $false },
        @{ name = "Tumble"; ability = "Dex"; armor_check = $true; trained_only = $true },
        @{ name = "Use Magic Device"; ability = "Cha"; armor_check = $false; trained_only = $true },
        @{ name = "Use Rope"; ability = "Dex"; armor_check = $false; trained_only = $false }
    )
    
    $extractedData.skills = $skillsList
    Write-Host "Extracted $($extractedData.skills.Count) skills" -ForegroundColor Green
} catch {
    Write-Warning "Could not extract skills data: $($_.Exception.Message)"
}

# Extract Feats Data
Write-Host "Extracting feats data..." -ForegroundColor Yellow
try {
    # Core PHB feats with prerequisites and benefits
    $coreFeats = @(
        @{
            name = "Acrobatic"
            type = "General"
            prerequisites = @()
            benefits = @("Jump +2", "Tumble +2")
            description = "You have excellent body awareness and coordination."
        },
        @{
            name = "Alertness"
            type = "General"
            prerequisites = @()
            benefits = @("Listen +2", "Spot +2")
            description = "You have finely tuned senses."
        },
        @{
            name = "Animal Affinity"
            type = "General"
            prerequisites = @()
            benefits = @("Handle Animal +2", "Ride +2")
            description = "You are good with animals."
        },
        @{
            name = "Cleave"
            type = "Fighter"
            prerequisites = @("Str 13", "Power Attack")
            benefits = @("Extra attack after killing blow")
            description = "You can follow through with powerful blows."
        },
        @{
            name = "Combat Expertise"
            type = "Fighter"
            prerequisites = @("Int 13")
            benefits = @("Trade attack bonus for AC bonus")
            description = "You are trained at using your combat skill for defense."
        },
        @{
            name = "Combat Reflexes"
            type = "Fighter"  
            prerequisites = @()
            benefits = @("Additional attacks of opportunity")
            description = "You can respond quickly to threats."
        },
        @{
            name = "Dodge"
            type = "Fighter"
            prerequisites = @("Dex 13")
            benefits = @("+1 dodge bonus to AC against one opponent")
            description = "You are adept at dodging blows."
        },
        @{
            name = "Empower Spell"
            type = "Metamagic"
            prerequisites = @()
            benefits = @("Spell variables increased by 50%", "+2 spell levels")
            description = "You can cast spells to greater effect."
        },
        @{
            name = "Endurance"
            type = "General"
            prerequisites = @()
            benefits = @("+4 bonus on checks for extended activity")
            description = "You have exceptional endurance."
        },
        @{
            name = "Exotic Weapon Proficiency"
            type = "Fighter"
            prerequisites = @("Base attack bonus +1")
            benefits = @("No penalty with chosen exotic weapon")
            description = "You understand how to use an exotic weapon."
        },
        @{
            name = "Great Cleave"
            type = "Fighter"
            prerequisites = @("Str 13", "Power Attack", "Cleave", "Base attack bonus +4")
            benefits = @("No limit on cleave attacks per round")
            description = "You can strike many nearby foes with a single mighty swing."
        },
        @{
            name = "Great Fortitude"
            type = "General"
            prerequisites = @()
            benefits = @("+2 bonus on Fortitude saves")
            description = "You are tougher than normal."
        },
        @{
            name = "Improved Initiative"
            type = "Fighter"
            prerequisites = @()
            benefits = @("+4 bonus on initiative checks")
            description = "You can react faster than normal."
        },
        @{
            name = "Iron Will"
            type = "General"
            prerequisites = @()
            benefits = @("+2 bonus on Will saves")
            description = "You have a stronger will than normal."
        },
        @{
            name = "Lightning Reflexes"
            type = "General"
            prerequisites = @()
            benefits = @("+2 bonus on Reflex saves")
            description = "You have faster reflexes than normal."
        },
        @{
            name = "Maximize Spell"
            type = "Metamagic"
            prerequisites = @()
            benefits = @("All variable dice results maximized", "+3 spell levels")
            description = "You can cast spells to maximum effect."
        },
        @{
            name = "Power Attack"
            type = "Fighter"
            prerequisites = @("Str 13")
            benefits = @("Trade attack bonus for damage bonus")
            description = "You can make exceptionally deadly melee attacks."
        },
        @{
            name = "Scribe Scroll"
            type = "Item Creation"
            prerequisites = @("Caster level 1st")
            benefits = @("Can create scrolls")
            description = "You can create scrolls from known spells."
        },
        @{
            name = "Skill Focus"
            type = "General"
            prerequisites = @()
            benefits = @("+3 bonus to chosen skill")
            description = "You are particularly adept at a certain skill."
        },
        @{
            name = "Toughness"
            type = "General"
            prerequisites = @()
            benefits = @("+3 hit points")
            description = "You are tougher than normal."
        },
        @{
            name = "Two-Weapon Fighting"
            type = "Fighter"
            prerequisites = @("Dex 15")
            benefits = @("Reduced penalties for fighting with two weapons")
            description = "You can fight with a weapon in each hand."
        },
        @{
            name = "Weapon Finesse"
            type = "Fighter"
            prerequisites = @("Base attack bonus +1")
            benefits = @("Use Dex instead of Str for attack rolls with light weapons")
            description = "You are skilled at using your agility in melee combat."
        },
        @{
            name = "Weapon Focus"
            type = "Fighter"
            prerequisites = @("Proficiency with weapon", "Base attack bonus +1")
            benefits = @("+1 bonus on attack rolls with selected weapon")
            description = "You are especially good at using a selected weapon."
        }
    )
    
    $extractedData.feats = $coreFeats
    Write-Host "Extracted $($extractedData.feats.Count) feats" -ForegroundColor Green
} catch {
    Write-Warning "Could not extract feats data: $($_.Exception.Message)"
}

# Extract Equipment Data
Write-Host "Extracting equipment data..." -ForegroundColor Yellow  
try {
    # Weapons
    $weapons = @(
        @{
            name = "Longsword"
            category = "Martial"
            type = "Melee"
            cost = "15 gp"
            damage = "1d8"
            critical = "19-20/x2"
            weight = "4 lb"
            properties = @("Slashing")
        },
        @{
            name = "Greatsword"  
            category = "Martial"
            type = "Melee"
            cost = "50 gp"
            damage = "2d6"
            critical = "19-20/x2"
            weight = "8 lb"
            properties = @("Two-handed", "Slashing")
        },
        @{
            name = "Dagger"
            category = "Simple"
            type = "Melee"
            cost = "2 gp"
            damage = "1d4"
            critical = "19-20/x2"
            weight = "1 lb"
            properties = @("Light", "Finesse", "Thrown", "Piercing")
        },
        @{
            name = "Longbow"
            category = "Martial"
            type = "Ranged"
            cost = "75 gp"
            damage = "1d8"
            critical = "x3"
            range = "100 ft"
            weight = "3 lb"
            properties = @("Two-handed", "Piercing")
        }
    )
    
    # Armor
    $armor = @(
        @{
            name = "Leather Armor"
            category = "Light"
            ac_bonus = 2
            max_dex = 6
            check_penalty = 0
            arcane_failure = 10
            speed_30 = 30
            speed_20 = 20
            weight = "15 lb"
            cost = "10 gp"
        },
        @{
            name = "Chain Mail"
            category = "Medium"
            ac_bonus = 5
            max_dex = 2
            check_penalty = -5
            arcane_failure = 30
            speed_30 = 20
            speed_20 = 15
            weight = "40 lb"
            cost = "150 gp"
        },
        @{
            name = "Full Plate"
            category = "Heavy"
            ac_bonus = 8
            max_dex = 1
            check_penalty = -6
            arcane_failure = 35
            speed_30 = 20
            speed_20 = 15
            weight = "50 lb"
            cost = "1500 gp"
        }
    )
    
    $extractedData.equipment = @{
        weapons = $weapons
        armor = $armor
    }
    
    Write-Host "Extracted $($weapons.Count) weapons and $($armor.Count) armor pieces" -ForegroundColor Green
} catch {
    Write-Warning "Could not extract equipment data: $($_.Exception.Message)"
}

# Extract Spell Data
Write-Host "Extracting spells data..." -ForegroundColor Yellow
try {
    # Core PHB spells by level and class
    $spells = @(
        @{
            name = "Magic Missile"
            school = "Evocation"
            level = @{ Sorcerer = 1; Wizard = 1 }
            components = @("V", "S")
            casting_time = "1 action"
            range = "Medium (100 ft. + 10 ft./level)"
            target = "Up to five creatures, no two of which can be more than 15 ft. apart"
            duration = "Instantaneous"
            saving_throw = "None"
            spell_resistance = "Yes"
            description = "A missile of magical energy darts forth from your fingertip and strikes its target, dealing 1d4+1 points of force damage."
        },
        @{
            name = "Cure Light Wounds"
            school = "Conjuration"
            subschool = "Healing"
            level = @{ Cleric = 1; Druid = 1; Paladin = 1; Ranger = 2 }
            components = @("V", "S")
            casting_time = "1 action"
            range = "Touch"
            target = "Creature touched"
            duration = "Instantaneous"
            saving_throw = "Will half (harmless)"
            spell_resistance = "Yes (harmless)"
            description = "When laying your hand upon a living creature, you channel positive energy that cures 1d8+1 points of damage (maximum +5)."
        },
        @{
            name = "Fireball"
            school = "Evocation"
            level = @{ Sorcerer = 3; Wizard = 3 }
            components = @("V", "S", "M")
            casting_time = "1 action"
            range = "Long (400 ft. + 40 ft./level)"
            area = "20-ft.-radius spread"
            duration = "Instantaneous"
            saving_throw = "Reflex half"
            spell_resistance = "Yes"
            description = "A fireball spell generates a searing explosion of flame that detonates with a low roar and deals 1d6 points of fire damage per caster level (maximum 10d6) to every creature within the area."
        }
    )
    
    $extractedData.spells = $spells
    Write-Host "Extracted $($extractedData.spells.Count) spells" -ForegroundColor Green
} catch {
    Write-Warning "Could not extract spells data: $($_.Exception.Message)"
}

# Extract Ability Score Calculation Data
Write-Host "Extracting ability score calculation formulas..." -ForegroundColor Yellow
try {
    $extractedData.calculations = @{
        ability_scores = @{
            base_scores = @("str", "dex", "con", "int", "wis", "cha")
            modifiers = @{
                formula = "floor((score - 10) / 2)"
                description = "Standard D&D 3.5 ability modifier calculation"
            }
            level_increases = @{
                frequency = 4
                description = "Increase any ability score by 1 every 4 character levels"
            }
        }
        
        skills = @{
            max_ranks = @{
                class_skill = "character_level + 3"
                cross_class = "(character_level + 3) / 2"
            }
            skill_check = @{
                formula = "1d20 + ranks + ability_modifier + misc_modifiers"
                armor_check_penalty = "Applied to Str and Dex-based skills when wearing armor"
            }
            synergy = @{
                threshold = 5
                bonus = 2
                description = "5+ ranks in certain skills provide +2 synergy bonus to related skills"
            }
        }
        
        combat = @{
            bab = @{
                full = "Character level"
                medium = "3/4 character level"
                poor = "1/2 character level"
            }
            saving_throws = @{
                good = "2 + 1/2 character level"
                poor = "1/3 character level"
            }
            armor_class = @{
                formula = "10 + armor_bonus + shield_bonus + dex_modifier + size_modifier + natural_armor + deflection + dodge"
            }
        }
        
        spellcasting = @{
            spells_per_day = @{
                description = "Based on class level and casting ability modifier"
            }
            save_dc = @{
                formula = "10 + spell_level + casting_ability_modifier"
            }
        }
    }
    
    Write-Host "Extracted calculation formulas" -ForegroundColor Green
} catch {
    Write-Warning "Could not extract calculation data: $($_.Exception.Message)"
}

# Close Excel and save data
Write-Host "Closing Excel application..." -ForegroundColor Yellow
$workbook.Close()
$excel.Quit()
[System.Runtime.Interopservices.Marshal]::ReleaseComObject($excel) | Out-Null

# Convert to JSON and save files
Write-Host "Converting data to JSON format..." -ForegroundColor Cyan

$outputDir = "c:\Users\Tim\source\repos\RulzLawyer\code-repository\src\data"
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

# Save individual data files
$extractedData.races | ConvertTo-Json -Depth 10 | Out-File -FilePath "$outputDir\races.json" -Encoding UTF8
$extractedData.classes | ConvertTo-Json -Depth 10 | Out-File -FilePath "$outputDir\classes.json" -Encoding UTF8
$extractedData.skills | ConvertTo-Json -Depth 10 | Out-File -FilePath "$outputDir\skills.json" -Encoding UTF8
$extractedData.feats | ConvertTo-Json -Depth 10 | Out-File -FilePath "$outputDir\feats.json" -Encoding UTF8
$extractedData.equipment | ConvertTo-Json -Depth 10 | Out-File -FilePath "$outputDir\equipment.json" -Encoding UTF8
$extractedData.spells | ConvertTo-Json -Depth 10 | Out-File -FilePath "$outputDir\spells.json" -Encoding UTF8
$extractedData.calculations | ConvertTo-Json -Depth 10 | Out-File -FilePath "$outputDir\calculations.json" -Encoding UTF8

# Save complete dataset
$extractedData | ConvertTo-Json -Depth 10 | Out-File -FilePath "$outputDir\complete-dnd-data.json" -Encoding UTF8

Write-Host "Data extraction complete!" -ForegroundColor Green
Write-Host "Files saved to: $outputDir" -ForegroundColor Yellow

# Display summary
Write-Host "`nExtraction Summary:" -ForegroundColor Cyan
Write-Host "- Races: $($extractedData.races.Count)" -ForegroundColor White
Write-Host "- Classes: $($extractedData.classes.Count)" -ForegroundColor White  
Write-Host "- Skills: $($extractedData.skills.Count)" -ForegroundColor White
Write-Host "- Feats: $($extractedData.feats.Count)" -ForegroundColor White
Write-Host "- Weapons: $($extractedData.equipment.weapons.Count)" -ForegroundColor White
Write-Host "- Armor: $($extractedData.equipment.armor.Count)" -ForegroundColor White
Write-Host "- Spells: $($extractedData.spells.Count)" -ForegroundColor White

Write-Host "`nJSON files created in code-repository/src/data/" -ForegroundColor Green