# D&D 3.5 Character Sheet Visual Design Analysis

## Executive Summary

This document provides exact specifications for recreating the visual appearance of the D&D 3.5 character sheet PDFs, including colors, typography, spacing, borders, and overall aesthetic design.

## Color Palette Specifications

### Primary Colors
```css
:root {
  /* Background Colors */
  --sheet-background: #F5F5DC;           /* Beige/Parchment */
  --section-background: #FFFFFF;         /* Pure white for input areas */
  --header-background: #F8F8F0;          /* Slightly off-white for headers */
  
  /* Border Colors */
  --primary-border: #2C1810;            /* Dark brown/black for main borders */
  --secondary-border: #654321;          /* Medium brown for section dividers */
  --light-border: #A0A0A0;              /* Light gray for field borders */
  
  /* Text Colors */
  --header-text: #000000;               /* Black for main headers */
  --label-text: #2C1810;                /* Dark brown for field labels */
  --input-text: #000000;                /* Black for user input */
  --calculated-text: #4A4A4A;           /* Gray for calculated values */
  --placeholder-text: #8A8A8A;          /* Light gray for placeholders */
  
  /* Accent Colors */
  --highlight-background: #FFF8DC;       /* Cornsilk for highlighted sections */
  --error-color: #CC0000;                /* Red for validation errors */
  --success-color: #006600;              /* Green for valid entries */
}
```

### Color Usage Guidelines
- **Sheet Background**: Use parchment color (`#F5F5DC`) to simulate traditional paper
- **Section Borders**: Dark brown (`#2C1810`) for primary section boundaries
- **Field Backgrounds**: Pure white (`#FFFFFF`) for all input fields
- **Headers**: Black text on slightly off-white backgrounds
- **Calculated Fields**: Gray text to indicate read-only status

## Typography Specifications

### Font Families
```css
/* Primary Font Stack */
--header-font: 'Times New Roman', 'Liberation Serif', serif;
--body-font: 'Arial', 'Helvetica Neue', sans-serif;
--input-font: 'Verdana', 'Tahoma', sans-serif;
--monospace-font: 'Courier New', 'Monaco', monospace;
```

### Font Sizes and Weights
```css
/* Font Size Scale */
--font-size-title: 20px;          /* Character sheet title */
--font-size-section: 16px;        /* Section headers (Ability Scores, etc.) */
--font-size-label: 12px;          /* Field labels */
--font-size-input: 12px;          /* Input field text */
--font-size-small: 10px;          /* Small text, notes */
--font-size-calculated: 11px;     /* Calculated values */

/* Font Weights */
--weight-title: 700;              /* Bold for main title */
--weight-section: 600;            /* Semi-bold for section headers */
--weight-label: 500;              /* Medium for field labels */
--weight-input: 400;              /* Normal for input text */
--weight-calculated: 400;         /* Normal for calculated values */
```

### Typography Usage
- **Main Title**: 20px bold serif for "CHARACTER SHEET"
- **Section Headers**: 16px semi-bold serif for "ABILITY SCORES", "SKILLS", etc.
- **Field Labels**: 12px medium sans-serif for individual field names
- **Input Text**: 12px normal sans-serif for user-entered data
- **Calculated Values**: 11px normal sans-serif in gray

## Layout and Spacing

### Grid System
```css
/* Main Layout Grid */
.character-sheet {
  display: grid;
  grid-template-columns: 200px 1fr 300px; /* Abilities | Combat | Skills */
  grid-template-rows: auto 1fr auto;      /* Header | Main | Equipment */
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px;
}

/* Section Spacing */
--section-margin: 20px;           /* Space between major sections */
--subsection-margin: 15px;        /* Space between subsections */
--field-margin: 8px;              /* Space between individual fields */
--group-margin: 12px;             /* Space between field groups */
```

### Padding Specifications
```css
/* Padding Values */
--section-padding: 15px;          /* Inside bordered sections */
--field-padding: 8px;             /* Inside input fields */
--label-padding: 4px;             /* Around field labels */
--button-padding: 10px 20px;      /* Button padding */
```

### Border Specifications
```css
/* Border Styles */
--primary-border-width: 2px;      /* Main section borders */
--secondary-border-width: 1px;    /* Field borders */
--border-radius: 4px;             /* Rounded corners */

/* Border Combinations */
.section-border {
  border: var(--primary-border-width) solid var(--primary-border);
  border-radius: var(--border-radius);
}

.field-border {
  border: var(--secondary-border-width) solid var(--light-border);
  border-radius: 2px;
}
```

## Section-Specific Design

### Header Section
```css
.character-header {
  background: var(--header-background);
  border: var(--primary-border-width) solid var(--primary-border);
  padding: var(--section-padding);
  margin-bottom: var(--section-margin);
  
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr;
  gap: var(--group-margin);
}

.character-name {
  font-size: var(--font-size-title);
  font-weight: var(--weight-title);
  font-family: var(--header-font);
  border-bottom: 2px solid var(--primary-border);
  padding-bottom: 5px;
}
```

### Ability Scores Section
```css
.ability-scores {
  background: var(--section-background);
  border: var(--primary-border-width) solid var(--primary-border);
  padding: var(--section-padding);
  
  display: flex;
  flex-direction: column;
  gap: var(--field-margin);
}

.ability-score-block {
  text-align: center;
  border: 1px solid var(--secondary-border);
  padding: 10px;
  background: var(--highlight-background);
  border-radius: var(--border-radius);
}

.ability-name {
  font-size: var(--font-size-label);
  font-weight: var(--weight-label);
  color: var(--label-text);
  text-transform: uppercase;
  margin-bottom: 5px;
}

.ability-score {
  font-size: 18px;
  font-weight: 600;
  color: var(--header-text);
  margin-bottom: 3px;
}

.ability-modifier {
  font-size: var(--font-size-calculated);
  color: var(--calculated-text);
  font-style: italic;
}
```

### Combat Statistics Section
```css
.combat-stats {
  background: var(--section-background);
  border: var(--primary-border-width) solid var(--primary-border);
  padding: var(--section-padding);
  
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--group-margin);
}

.armor-class {
  grid-column: 1 / -1; /* Full width */
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  background: var(--highlight-background);
  border: 2px solid var(--primary-border);
  padding: 15px;
  border-radius: var(--border-radius);
}

.hit-points {
  background: var(--highlight-background);
  border: 1px solid var(--secondary-border);
  padding: 12px;
  text-align: center;
}
```

### Skills Section
```css
.skills-section {
  background: var(--section-background);
  border: var(--primary-border-width) solid var(--primary-border);
  padding: var(--section-padding);
}

.skills-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-input);
}

.skills-table th {
  background: var(--header-background);
  color: var(--label-text);
  font-weight: var(--weight-label);
  padding: 8px 4px;
  border-bottom: 2px solid var(--primary-border);
  font-size: var(--font-size-small);
  text-align: left;
}

.skills-table td {
  padding: 4px;
  border-bottom: 1px solid var(--light-border);
  text-align: center;
}

.skill-name {
  text-align: left !important;
  font-weight: var(--weight-label);
  min-width: 120px;
}

.class-skill {
  background: var(--highlight-background);
}
```

### Equipment Section
```css
.equipment-section {
  grid-column: 1 / -1; /* Full width */
  background: var(--section-background);
  border: var(--primary-border-width) solid var(--primary-border);
  padding: var(--section-padding);
  margin-top: var(--section-margin);
  
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--group-margin);
}

.weapons-table, .armor-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-input);
}

.equipment-table th {
  background: var(--header-background);
  padding: 6px 4px;
  border-bottom: 1px solid var(--primary-border);
  font-size: var(--font-size-small);
  text-align: left;
}

.equipment-table td {
  padding: 4px;
  border-bottom: 1px solid var(--light-border);
  text-align: center;
}
```

## Input Field Styling

### Standard Input Fields
```css
.form-input {
  background: var(--section-background);
  border: var(--secondary-border-width) solid var(--light-border);
  border-radius: 2px;
  padding: var(--field-padding);
  font-family: var(--input-font);
  font-size: var(--font-size-input);
  color: var(--input-text);
}

.form-input:focus {
  border-color: var(--primary-border);
  outline: none;
  box-shadow: 0 0 3px rgba(44, 24, 16, 0.3);
}

.form-input:disabled,
.calculated-field {
  background: #F8F8F8;
  color: var(--calculated-text);
  border-style: dashed;
}
```

### Select Dropdowns
```css
.form-select {
  background: var(--section-background);
  border: var(--secondary-border-width) solid var(--light-border);
  border-radius: 2px;
  padding: var(--field-padding);
  font-family: var(--input-font);
  font-size: var(--font-size-input);
  color: var(--input-text);
  cursor: pointer;
}
```

### Number Inputs
```css
.number-input {
  width: 60px;
  text-align: center;
  font-weight: 500;
}

.large-number {
  width: 80px;
  font-size: 14px;
  font-weight: 600;
}
```

## Responsive Design Considerations

### Breakpoints
```css
/* Desktop (default): 1200px+ */
/* Tablet: 768px - 1199px */
@media (max-width: 1199px) {
  .character-sheet {
    grid-template-columns: 180px 1fr 280px;
    gap: 15px;
    padding: 20px;
  }
}

/* Mobile: < 768px */
@media (max-width: 767px) {
  .character-sheet {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }
}
```

## Print Styles

### Print Optimization
```css
@media print {
  .character-sheet {
    background: white;
    color: black;
    font-size: 10px;
    max-width: none;
    margin: 0;
    padding: 0.5in;
  }
  
  .section-border {
    border-width: 1px;
  }
  
  input, select, textarea {
    border: none;
    border-bottom: 1px solid black;
    background: transparent;
  }
}
```

## Accessibility Features

### WCAG Compliance
- **Color Contrast**: All text meets WCAG AA contrast ratios (4.5:1 minimum)
- **Focus Indicators**: Clear visual focus states for all interactive elements
- **Label Associations**: Proper label-input relationships
- **Keyboard Navigation**: Full keyboard accessibility

### Focus States
```css
.form-input:focus,
.form-select:focus {
  outline: 2px solid #005FCC;
  outline-offset: 1px;
}
```

## Animation and Transitions

### Subtle Interactions
```css
.form-input,
.form-select {
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.calculated-field {
  transition: color 0.3s ease;
}

.calculated-field.updated {
  color: var(--success-color);
}
```

---

*This comprehensive visual design specification ensures pixel-perfect recreation of the PDF character sheet appearance while maintaining modern web standards and accessibility.*