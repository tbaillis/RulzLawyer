/**
 * Advanced Testing Suite Configuration
 * Comprehensive test configuration for all testing scenarios
 * 
 * Features:
 * - Test environment setup and teardown
 * - Coverage thresholds and reporting
 * - Accessibility testing configuration
 * - Performance benchmarking settings
 * - Visual regression testing setup
 * - CI/CD integration configuration
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

const testConfig = {
    // Test Framework Configuration
    framework: {
        timeout: 5000,
        retries: 2,
        parallel: true,
        bail: false,
        verbose: true,
        colors: true,
        reporter: 'detailed'
    },
    
    // Test Environment
    environment: {
        testURL: 'http://localhost:3000',
        setupFiles: [
            './tests/setup/global-setup.js',
            './tests/setup/dom-setup.js',
            './tests/setup/mock-setup.js'
        ],
        teardownFiles: [
            './tests/teardown/cleanup.js'
        ],
        testMatch: [
            'tests/**/*.test.js',
            'src/**/__tests__/**/*.js'
        ],
        collectCoverageFrom: [
            'src/**/*.js',
            '!src/**/*.test.js',
            '!src/tests/**',
            '!src/node_modules/**'
        ]
    },
    
    // Coverage Configuration
    coverage: {
        enabled: true,
        provider: 'custom',
        reporter: ['text', 'html', 'lcov', 'json'],
        outputDirectory: './coverage',
        thresholds: {
            global: {
                statements: 85,
                branches: 80,
                functions: 90,
                lines: 85
            },
            perFile: {
                statements: 80,
                branches: 75,
                functions: 85,
                lines: 80
            }
        },
        exclude: [
            'tests/**',
            'coverage/**',
            '**/*.test.js',
            '**/node_modules/**',
            'docs/**'
        ]
    },
    
    // Accessibility Testing
    accessibility: {
        enabled: true,
        standard: 'WCAG21AA',
        includeWarnings: true,
        includeNotices: false,
        timeout: 10000,
        rules: {
            'color-contrast': {
                enabled: true,
                options: {
                    noScroll: true,
                    ignoreTransparent: true
                }
            },
            'keyboard-navigation': {
                enabled: true,
                options: {
                    skipLinks: false
                }
            },
            'aria-labels': {
                enabled: true,
                options: {
                    requiredLabels: true
                }
            },
            'focus-management': {
                enabled: true,
                options: {
                    focusableElements: true,
                    focusTraps: true
                }
            },
            'semantic-markup': {
                enabled: true,
                options: {
                    roleValidation: true
                }
            }
        },
        ignore: [
            '.test-ignore-a11y',
            '[data-testid="ignore-accessibility"]'
        ]
    },
    
    // Performance Testing
    performance: {
        enabled: true,
        metrics: {
            memory: {
                enabled: true,
                threshold: 50 * 1024 * 1024 // 50MB
            },
            timing: {
                enabled: true,
                thresholds: {
                    testExecution: 1000, // 1 second per test
                    suiteExecution: 30000, // 30 seconds per suite
                    totalExecution: 300000 // 5 minutes total
                }
            },
            fps: {
                enabled: true,
                threshold: 30 // Minimum FPS
            },
            network: {
                enabled: true,
                timeout: 5000
            }
        },
        profiling: {
            enabled: true,
            sampling: true,
            cpu: true,
            memory: true
        },
        benchmarks: {
            characterCreation: {
                name: 'Character Creation Performance',
                iterations: 100,
                threshold: 10 // ms per iteration
            },
            diceRolling: {
                name: 'Dice Rolling Performance',
                iterations: 1000,
                threshold: 1 // ms per iteration
            },
            spellLookup: {
                name: 'Spell Database Lookup',
                iterations: 500,
                threshold: 5 // ms per iteration
            },
            characterSave: {
                name: 'Character Save Performance',
                iterations: 50,
                threshold: 100 // ms per iteration
            }
        }
    },
    
    // Visual Regression Testing
    visual: {
        enabled: true,
        threshold: 0.1, // 10% difference threshold
        diffDirectory: './tests/visual-diffs',
        baselineDirectory: './tests/visual-baselines',
        animations: 'disabled',
        waitFor: {
            selector: '.app-ready',
            timeout: 5000
        },
        viewports: [
            { width: 1920, height: 1080, name: 'desktop' },
            { width: 1366, height: 768, name: 'laptop' },
            { width: 768, height: 1024, name: 'tablet' },
            { width: 375, height: 667, name: 'mobile' }
        ],
        scenarios: [
            {
                name: 'Character Sheet',
                url: '/character-sheet',
                selectors: ['.character-sheet'],
                interactions: []
            },
            {
                name: 'Character Creation',
                url: '/create-character',
                selectors: ['.character-creation-form'],
                interactions: [
                    { type: 'click', selector: '.race-selection button[data-race="elf"]' },
                    { type: 'click', selector: '.class-selection button[data-class="wizard"]' }
                ]
            },
            {
                name: 'Dice Roller',
                url: '/dice-roller',
                selectors: ['.dice-roller-interface'],
                interactions: [
                    { type: 'click', selector: '.dice-button[data-dice="d20"]' }
                ]
            }
        ]
    },
    
    // Browser Configuration
    browsers: {
        default: 'headless-chrome',
        chrome: {
            enabled: true,
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-background-timer-throttling',
                '--disable-backgrounding-occluded-windows',
                '--disable-renderer-backgrounding'
            ]
        },
        firefox: {
            enabled: false,
            headless: true
        },
        safari: {
            enabled: false
        },
        edge: {
            enabled: false
        }
    },
    
    // Test Data
    fixtures: {
        directory: './tests/fixtures',
        characters: {
            basic: './tests/fixtures/characters/basic-character.json',
            advanced: './tests/fixtures/characters/advanced-character.json',
            multiclass: './tests/fixtures/characters/multiclass-character.json'
        },
        spells: {
            cantrips: './tests/fixtures/spells/cantrips.json',
            leveledSpells: './tests/fixtures/spells/leveled-spells.json'
        },
        equipment: {
            weapons: './tests/fixtures/equipment/weapons.json',
            armor: './tests/fixtures/equipment/armor.json',
            adventuringGear: './tests/fixtures/equipment/adventuring-gear.json'
        }
    },
    
    // Mock Configuration
    mocks: {
        localStorage: true,
        sessionStorage: true,
        indexedDB: true,
        fetch: true,
        webWorkers: true,
        serviceWorker: true,
        geolocation: false,
        camera: false,
        microphone: false
    },
    
    // Reporting
    reports: {
        outputDirectory: './test-reports',
        formats: ['html', 'json', 'junit', 'lcov'],
        includeConsole: true,
        includeScreenshots: true,
        includeVideoRecording: false,
        timestampFormat: 'YYYY-MM-DD_HH-mm-ss'
    },
    
    // CI/CD Integration
    ci: {
        enabled: process.env.CI === 'true',
        providers: {
            github: {
                enabled: process.env.GITHUB_ACTIONS === 'true',
                artifactUpload: true,
                commentPR: true
            },
            jenkins: {
                enabled: process.env.JENKINS === 'true',
                publishResults: true
            },
            azure: {
                enabled: process.env.AZURE_DEVOPS === 'true',
                publishResults: true
            }
        },
        notifications: {
            slack: {
                enabled: false,
                webhook: process.env.SLACK_WEBHOOK,
                channels: ['#development', '#testing']
            },
            email: {
                enabled: false,
                smtp: {
                    host: process.env.SMTP_HOST,
                    port: process.env.SMTP_PORT,
                    secure: true,
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS
                    }
                }
            }
        }
    },
    
    // Parallel Execution
    parallel: {
        workers: process.env.CI ? 2 : require('os').cpus().length,
        threshold: 10, // Minimum tests to run in parallel
        maxConcurrency: 4
    },
    
    // Watch Mode
    watch: {
        enabled: process.env.NODE_ENV === 'development',
        patterns: [
            'src/**/*.js',
            'tests/**/*.js'
        ],
        ignore: [
            'node_modules/**',
            'coverage/**',
            'test-reports/**'
        ],
        runAllOnStart: false,
        clearScreen: true
    },
    
    // Debugging
    debug: {
        enabled: process.env.DEBUG === 'true',
        breakpoints: false,
        devtools: false,
        slowmo: 0,
        headful: false
    },
    
    // Advanced Options
    advanced: {
        retryFailedTests: true,
        failFast: false,
        randomizeOrder: false,
        seed: null,
        maxWorkers: '50%',
        workerIdleMemoryLimit: '512MB',
        detectOpenHandles: true,
        forceExit: false,
        logHeapUsage: false
    }
};

// Environment-specific overrides
if (process.env.NODE_ENV === 'development') {
    testConfig.framework.timeout = 10000;
    testConfig.framework.verbose = true;
    testConfig.debug.enabled = true;
    testConfig.coverage.thresholds.global.statements = 70;
}

if (process.env.NODE_ENV === 'production') {
    testConfig.framework.parallel = true;
    testConfig.coverage.thresholds.global.statements = 90;
    testConfig.performance.enabled = true;
    testConfig.visual.enabled = true;
}

if (process.env.CI) {
    testConfig.browsers.chrome.headless = true;
    testConfig.framework.bail = true;
    testConfig.reports.includeVideoRecording = false;
    testConfig.parallel.workers = 2;
}

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = testConfig;
} else if (typeof window !== 'undefined') {
    window.testConfig = testConfig;
}

console.log('🧪 Test configuration loaded');
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`CI Mode: ${process.env.CI ? 'enabled' : 'disabled'}`);
console.log(`Coverage Threshold: ${testConfig.coverage.thresholds.global.statements}%`);
console.log(`Parallel Workers: ${testConfig.parallel.workers}`);