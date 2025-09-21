/**
 * Performance Optimization System
 * Advanced performance management for D&D Character Creator with lazy loading, caching, and optimization
 * 
 * Features:
 * - Lazy loading for large data sets
 * - Intelligent caching strategies
 * - Memory management and cleanup
 * - Background processing for heavy computations
 * - Performance monitoring and analytics
 * - Service worker integration
 * - Bundle optimization strategies
 * - Real-time performance tracking
 * 
 * @version 1.0.0
 * @author RulzLawyer Development Team
 */

class PerformanceManager {
    constructor(options = {}) {
        this.options = {
            enableLazyLoading: options.enableLazyLoading !== false,
            enableCaching: options.enableCaching !== false,
            enableBackground: options.enableBackground !== false,
            enableMonitoring: options.enableMonitoring !== false,
            enableServiceWorker: options.enableServiceWorker !== false,
            cacheSize: options.cacheSize || 50 * 1024 * 1024, // 50MB default
            memoryThreshold: options.memoryThreshold || 80, // 80% threshold
            performanceInterval: options.performanceInterval || 5000, // 5 seconds
            debugMode: options.debugMode || false,
            ...options
        };
        
        // Performance state
        this.cacheSystem = new Map();
        this.lazyLoadRegistry = new Map();
        this.backgroundTasks = new Map();
        this.performanceMetrics = new Map();
        this.memoryUsage = { current: 0, peak: 0, threshold: this.options.memoryThreshold };
        
        // Performance monitoring
        this.observer = null;
        this.monitoringInterval = null;
        this.isMonitoring = false;
        
        // Service worker
        this.serviceWorker = null;
        this.swRegistration = null;
        
        // Background workers
        this.workers = new Map();
        this.workerPool = [];
        
        // Event emitter functionality
        this.events = new Map();
        
        this.initialize();
        
        console.log('⚡ Performance Manager initialized');
    }
    
    async initialize() {
        try {
            // Initialize core systems
            await this.initializeCacheSystem();
            await this.initializeLazyLoading();
            await this.initializeBackgroundProcessing();
            
            // Start monitoring if enabled
            if (this.options.enableMonitoring) {
                await this.startPerformanceMonitoring();
            }
            
            // Register service worker if enabled
            if (this.options.enableServiceWorker) {
                await this.registerServiceWorker();
            }
            
            // Setup cleanup and optimization
            this.setupMemoryManagement();
            this.setupPerformanceOptimization();
            
            this.emit('initialized', { timestamp: Date.now() });
            
            console.log('⚡ Performance systems ready');
            
        } catch (error) {
            console.error('Performance Manager initialization failed:', error);
        }
    }
    
    // Cache System Implementation
    async initializeCacheSystem() {
        if (!this.options.enableCaching) return;
        
        // Initialize different cache layers
        this.cacheSystem.set('memory', new Map());
        this.cacheSystem.set('session', new Map());
        this.cacheSystem.set('persistent', new Map());
        
        // Load persistent cache from storage
        try {
            const persistentCache = localStorage.getItem('dnd-performance-cache');
            if (persistentCache) {
                const cacheData = JSON.parse(persistentCache);
                this.cacheSystem.set('persistent', new Map(Object.entries(cacheData)));
            }
        } catch (error) {
            console.warn('Failed to load persistent cache:', error);
        }
        
        console.log('⚡ Cache system initialized');
    }
    
    cache(key, value, options = {}) {
        const {
            layer = 'memory',
            ttl = 300000, // 5 minutes default
            compress = false,
            priority = 1
        } = options;
        
        const cacheEntry = {
            value,
            timestamp: Date.now(),
            ttl,
            priority,
            size: this.calculateSize(value),
            compressed: compress,
            hits: 0
        };
        
        // Compress if enabled
        if (compress && typeof value === 'object') {
            cacheEntry.value = this.compressData(value);
        }
        
        const cache = this.cacheSystem.get(layer);
        if (cache) {
            cache.set(key, cacheEntry);
            
            // Check cache size and cleanup if necessary
            this.checkCacheSize(layer);
            
            if (this.options.debugMode) {
                console.log(`⚡ Cached ${key} in ${layer} layer (${this.formatBytes(cacheEntry.size)})`);
            }
        }
        
        return value;
    }
    
    getFromCache(key, layer = 'memory') {
        const cache = this.cacheSystem.get(layer);
        if (!cache) return null;
        
        const entry = cache.get(key);
        if (!entry) return null;
        
        // Check TTL
        if (Date.now() - entry.timestamp > entry.ttl) {
            cache.delete(key);
            return null;
        }
        
        // Update hit count
        entry.hits++;
        
        // Decompress if needed
        let value = entry.value;
        if (entry.compressed) {
            value = this.decompressData(value);
        }
        
        if (this.options.debugMode) {
            console.log(`⚡ Cache hit for ${key} in ${layer} layer (${entry.hits} hits)`);
        }
        
        return value;
    }
    
    checkCacheSize(layer) {
        const cache = this.cacheSystem.get(layer);
        if (!cache) return;
        
        let totalSize = 0;
        for (const [key, entry] of cache) {
            totalSize += entry.size;
        }
        
        // If over cache size limit, remove least recently used items
        if (totalSize > this.options.cacheSize) {
            const entries = Array.from(cache.entries());
            
            // Sort by priority and hits (lower priority, fewer hits first)
            entries.sort((a, b) => {
                const priorityDiff = a[1].priority - b[1].priority;
                if (priorityDiff !== 0) return priorityDiff;
                return a[1].hits - b[1].hits;
            });
            
            // Remove entries until under threshold
            const targetSize = this.options.cacheSize * 0.8; // Remove to 80% of limit
            while (totalSize > targetSize && entries.length > 0) {
                const [key, entry] = entries.shift();
                cache.delete(key);
                totalSize -= entry.size;
                
                if (this.options.debugMode) {
                    console.log(`⚡ Removed ${key} from cache (size: ${this.formatBytes(entry.size)})`);
                }
            }
        }
    }
    
    // Lazy Loading System
    async initializeLazyLoading() {
        if (!this.options.enableLazyLoading) return;
        
        // Set up intersection observer for lazy loading
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const loadConfig = this.lazyLoadRegistry.get(element);
                    
                    if (loadConfig) {
                        this.loadLazyContent(element, loadConfig);
                    }
                }
            });
        }, {
            rootMargin: '50px',
            threshold: 0.1
        });
        
        console.log('⚡ Lazy loading system initialized');
    }
    
    registerLazyLoad(element, config) {
        const {
            loader,
            placeholder = 'Loading...',
            priority = 1,
            cache = true,
            retries = 3
        } = config;
        
        this.lazyLoadRegistry.set(element, {
            loader,
            placeholder,
            priority,
            cache,
            retries,
            loaded: false,
            loading: false
        });
        
        // Add placeholder content
        element.innerHTML = `<div class="lazy-placeholder">${placeholder}</div>`;
        
        // Start observing
        this.observer.observe(element);
        
        if (this.options.debugMode) {
            console.log('⚡ Registered lazy load for element:', element);
        }
    }
    
    async loadLazyContent(element, config) {
        if (config.loading || config.loaded) return;
        
        config.loading = true;
        element.classList.add('lazy-loading');
        
        try {
            // Check cache first
            let content = null;
            if (config.cache) {
                content = this.getFromCache(`lazy-${element.id || element.className}`);
            }
            
            // Load content if not cached
            if (!content) {
                content = await config.loader();
                
                if (config.cache) {
                    this.cache(`lazy-${element.id || element.className}`, content, {
                        layer: 'session',
                        ttl: 600000 // 10 minutes
                    });
                }
            }
            
            // Update element
            if (typeof content === 'string') {
                element.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                element.innerHTML = '';
                element.appendChild(content);
            }
            
            config.loaded = true;
            element.classList.remove('lazy-loading');
            element.classList.add('lazy-loaded');
            
            // Stop observing this element
            this.observer.unobserve(element);
            
            if (this.options.debugMode) {
                console.log('⚡ Lazy loaded content for element:', element);
            }
            
        } catch (error) {
            console.error('Failed to lazy load content:', error);
            
            if (config.retries > 0) {
                config.retries--;
                setTimeout(() => {
                    config.loading = false;
                    this.loadLazyContent(element, config);
                }, 1000);
            } else {
                element.innerHTML = '<div class="lazy-error">Failed to load content</div>';
                element.classList.remove('lazy-loading');
                element.classList.add('lazy-error');
            }
        }
    }
    
    // Background Processing System
    async initializeBackgroundProcessing() {
        if (!this.options.enableBackground) return;
        
        // Create worker pool
        const workerCount = navigator.hardwareConcurrency || 4;
        for (let i = 0; i < Math.min(workerCount, 4); i++) {
            try {
                const worker = new Worker(this.createWorkerScript());
                worker.onmessage = (event) => this.handleWorkerMessage(event);
                worker.onerror = (error) => this.handleWorkerError(error);
                this.workerPool.push({ worker, busy: false });
            } catch (error) {
                console.warn('Failed to create web worker:', error);
            }
        }
        
        console.log(`⚡ Background processing initialized with ${this.workerPool.length} workers`);
    }
    
    createWorkerScript() {
        const script = `
            // Background worker for heavy computations
            self.onmessage = function(event) {
                const { taskId, type, data } = event.data;
                
                try {
                    let result;
                    
                    switch (type) {
                        case 'calculate-character-stats':
                            result = calculateCharacterStats(data);
                            break;
                        case 'generate-random-tables':
                            result = generateRandomTables(data);
                            break;
                        case 'process-spell-data':
                            result = processSpellData(data);
                            break;
                        case 'compress-data':
                            result = compressData(data);
                            break;
                        case 'validate-character':
                            result = validateCharacter(data);
                            break;
                        default:
                            throw new Error('Unknown task type: ' + type);
                    }
                    
                    self.postMessage({ taskId, success: true, result });
                } catch (error) {
                    self.postMessage({ taskId, success: false, error: error.message });
                }
            };
            
            // Helper functions for background processing
            function calculateCharacterStats(data) {
                // Complex stat calculations
                const stats = {};
                for (const [stat, value] of Object.entries(data.baseStats || {})) {
                    stats[stat] = value + (data.racialModifiers?.[stat] || 0) + 
                                 (data.classModifiers?.[stat] || 0);
                }
                return stats;
            }
            
            function generateRandomTables(data) {
                // Generate random encounter/treasure tables
                const tables = {};
                for (const tableType of data.types || []) {
                    tables[tableType] = generateTable(tableType, data.parameters || {});
                }
                return tables;
            }
            
            function generateTable(type, params) {
                const entries = [];
                const count = params.count || 20;
                
                for (let i = 0; i < count; i++) {
                    entries.push({
                        roll: i + 1,
                        result: generateEntry(type, params)
                    });
                }
                
                return entries;
            }
            
            function generateEntry(type, params) {
                // Generate random entry based on type
                const templates = {
                    'treasure': ['Gold coins', 'Magic item', 'Gem', 'Art object'],
                    'encounter': ['Goblin patrol', 'Wild animal', 'Merchant caravan', 'Bandit group'],
                    'weather': ['Clear skies', 'Light rain', 'Heavy storm', 'Fog']
                };
                
                const options = templates[type] || ['Random event'];
                return options[Math.floor(Math.random() * options.length)];
            }
            
            function processSpellData(data) {
                // Process and organize spell data
                const processed = {
                    byLevel: {},
                    bySchool: {},
                    byClass: {}
                };
                
                for (const spell of data.spells || []) {
                    // Group by level
                    if (!processed.byLevel[spell.level]) {
                        processed.byLevel[spell.level] = [];
                    }
                    processed.byLevel[spell.level].push(spell);
                    
                    // Group by school
                    if (!processed.bySchool[spell.school]) {
                        processed.bySchool[spell.school] = [];
                    }
                    processed.bySchool[spell.school].push(spell);
                    
                    // Group by class
                    for (const className of spell.classes || []) {
                        if (!processed.byClass[className]) {
                            processed.byClass[className] = [];
                        }
                        processed.byClass[className].push(spell);
                    }
                }
                
                return processed;
            }
            
            function compressData(data) {
                // Simple compression algorithm
                const jsonString = JSON.stringify(data);
                const compressed = [];
                let current = '';
                let count = 1;
                
                for (let i = 0; i < jsonString.length; i++) {
                    if (jsonString[i] === current) {
                        count++;
                    } else {
                        if (current) {
                            compressed.push(count > 1 ? count + current : current);
                        }
                        current = jsonString[i];
                        count = 1;
                    }
                }
                
                if (current) {
                    compressed.push(count > 1 ? count + current : current);
                }
                
                return compressed.join('');
            }
            
            function validateCharacter(data) {
                const errors = [];
                const warnings = [];
                
                // Basic validation
                if (!data.name || data.name.trim() === '') {
                    errors.push('Character name is required');
                }
                
                if (!data.race) {
                    errors.push('Character race is required');
                }
                
                if (!data.class || data.class.length === 0) {
                    errors.push('At least one class is required');
                }
                
                // Stat validation
                for (const [stat, value] of Object.entries(data.stats || {})) {
                    if (value < 3 || value > 25) {
                        warnings.push('Unusual ' + stat + ' value: ' + value);
                    }
                }
                
                return { errors, warnings, valid: errors.length === 0 };
            }
        `;
        
        return URL.createObjectURL(new Blob([script], { type: 'application/javascript' }));
    }
    
    async runBackgroundTask(type, data, options = {}) {
        return new Promise((resolve, reject) => {
            const taskId = this.generateTaskId();
            const {
                priority = 1,
                timeout = 30000
            } = options;
            
            // Find available worker
            const workerInfo = this.workerPool.find(w => !w.busy);
            if (!workerInfo) {
                reject(new Error('No available workers'));
                return;
            }
            
            workerInfo.busy = true;
            
            // Set up timeout
            const timeoutId = setTimeout(() => {
                workerInfo.busy = false;
                this.backgroundTasks.delete(taskId);
                reject(new Error('Task timeout'));
            }, timeout);
            
            // Store task info
            this.backgroundTasks.set(taskId, {
                resolve,
                reject,
                timeoutId,
                workerInfo,
                startTime: Date.now()
            });
            
            // Send task to worker
            workerInfo.worker.postMessage({ taskId, type, data });
            
            if (this.options.debugMode) {
                console.log(`⚡ Started background task ${taskId} (${type})`);
            }
        });
    }
    
    handleWorkerMessage(event) {
        const { taskId, success, result, error } = event.data;
        const task = this.backgroundTasks.get(taskId);
        
        if (!task) return;
        
        // Clean up
        clearTimeout(task.timeoutId);
        task.workerInfo.busy = false;
        this.backgroundTasks.delete(taskId);
        
        // Resolve or reject
        if (success) {
            task.resolve(result);
            
            if (this.options.debugMode) {
                const duration = Date.now() - task.startTime;
                console.log(`⚡ Background task ${taskId} completed in ${duration}ms`);
            }
        } else {
            task.reject(new Error(error));
        }
    }
    
    handleWorkerError(error) {
        console.error('Worker error:', error);
    }
    
    // Performance Monitoring System
    async startPerformanceMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        
        // Start performance observer
        if ('PerformanceObserver' in window) {
            const observer = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                    this.recordPerformanceMetric(entry);
                }
            });
            
            observer.observe({ entryTypes: ['measure', 'navigation', 'resource', 'paint'] });
        }
        
        // Start periodic monitoring
        this.monitoringInterval = setInterval(() => {
            this.collectPerformanceData();
        }, this.options.performanceInterval);
        
        console.log('⚡ Performance monitoring started');
    }
    
    recordPerformanceMetric(entry) {
        const metricType = entry.entryType;
        
        if (!this.performanceMetrics.has(metricType)) {
            this.performanceMetrics.set(metricType, []);
        }
        
        const metrics = this.performanceMetrics.get(metricType);
        metrics.push({
            name: entry.name,
            duration: entry.duration,
            startTime: entry.startTime,
            timestamp: Date.now()
        });
        
        // Keep only recent metrics (last 100)
        if (metrics.length > 100) {
            metrics.shift();
        }
        
        // Emit performance event if significant
        if (entry.duration > 100) { // More than 100ms
            this.emit('performanceIssue', {
                type: metricType,
                name: entry.name,
                duration: entry.duration
            });
        }
    }
    
    collectPerformanceData() {
        const data = {
            timestamp: Date.now(),
            memory: this.getMemoryUsage(),
            timing: this.getTimingData(),
            dom: this.getDOMMetrics(),
            cache: this.getCacheMetrics()
        };
        
        // Check for performance issues
        if (data.memory.usedJSHeapSize > this.options.memoryThreshold * 1024 * 1024) {
            this.emit('memoryWarning', data.memory);
        }
        
        if (this.options.debugMode) {
            console.log('⚡ Performance data:', data);
        }
        
        return data;
    }
    
    getMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            return {
                used: memory.usedJSHeapSize,
                total: memory.totalJSHeapSize,
                limit: memory.jsHeapSizeLimit,
                percentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
            };
        }
        
        return { used: 0, total: 0, limit: 0, percentage: 0 };
    }
    
    getTimingData() {
        const timing = performance.timing;
        return {
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            loadComplete: timing.loadEventEnd - timing.navigationStart,
            firstPaint: performance.getEntriesByType('paint')
                .find(entry => entry.name === 'first-paint')?.startTime || 0
        };
    }
    
    getDOMMetrics() {
        return {
            elements: document.getElementsByTagName('*').length,
            scripts: document.scripts.length,
            stylesheets: document.styleSheets.length,
            images: document.images.length
        };
    }
    
    getCacheMetrics() {
        const metrics = {};
        
        for (const [layer, cache] of this.cacheSystem) {
            let totalSize = 0;
            let totalHits = 0;
            
            for (const [key, entry] of cache) {
                totalSize += entry.size;
                totalHits += entry.hits;
            }
            
            metrics[layer] = {
                entries: cache.size,
                totalSize,
                totalHits,
                hitRate: totalHits / Math.max(cache.size, 1)
            };
        }
        
        return metrics;
    }
    
    // Service Worker Registration
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.warn('Service Worker not supported');
            return;
        }
        
        try {
            const swScript = this.createServiceWorkerScript();
            const swBlob = new Blob([swScript], { type: 'application/javascript' });
            const swUrl = URL.createObjectURL(swBlob);
            
            this.swRegistration = await navigator.serviceWorker.register(swUrl, {
                scope: '/'
            });
            
            this.swRegistration.addEventListener('updatefound', () => {
                console.log('⚡ Service Worker update found');
            });
            
            navigator.serviceWorker.addEventListener('message', (event) => {
                this.handleServiceWorkerMessage(event);
            });
            
            console.log('⚡ Service Worker registered');
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
    
    createServiceWorkerScript() {
        return `
            const CACHE_NAME = 'dnd-creator-v1';
            const CACHE_URLS = [
                '/',
                '/index.html',
                '/app.js',
                '/styles.css',
                '/src/character-manager.js',
                '/src/dice-engine.js',
                '/src/spell-manager.js'
            ];
            
            self.addEventListener('install', (event) => {
                event.waitUntil(
                    caches.open(CACHE_NAME)
                        .then(cache => cache.addAll(CACHE_URLS))
                );
            });
            
            self.addEventListener('fetch', (event) => {
                event.respondWith(
                    caches.match(event.request)
                        .then(response => {
                            if (response) {
                                return response;
                            }
                            
                            return fetch(event.request);
                        })
                );
            });
            
            self.addEventListener('activate', (event) => {
                event.waitUntil(
                    caches.keys().then(cacheNames => {
                        return Promise.all(
                            cacheNames.map(cacheName => {
                                if (cacheName !== CACHE_NAME) {
                                    return caches.delete(cacheName);
                                }
                            })
                        );
                    })
                );
            });
        `;
    }
    
    handleServiceWorkerMessage(event) {
        const { type, data } = event.data;
        
        switch (type) {
            case 'cache-updated':
                this.emit('cacheUpdated', data);
                break;
            case 'offline-mode':
                this.emit('offlineMode', data);
                break;
        }
    }
    
    // Memory Management
    setupMemoryManagement() {
        // Periodic memory cleanup
        setInterval(() => {
            this.performMemoryCleanup();
        }, 60000); // Every minute
        
        // Low memory handler
        if ('memory' in performance) {
            setInterval(() => {
                const memory = this.getMemoryUsage();
                if (memory.percentage > this.options.memoryThreshold) {
                    this.handleLowMemory();
                }
            }, 10000); // Every 10 seconds
        }
    }
    
    performMemoryCleanup() {
        // Clean up expired cache entries
        for (const [layer, cache] of this.cacheSystem) {
            const now = Date.now();
            for (const [key, entry] of cache) {
                if (now - entry.timestamp > entry.ttl) {
                    cache.delete(key);
                }
            }
        }
        
        // Clean up completed background tasks
        for (const [taskId, task] of this.backgroundTasks) {
            if (Date.now() - task.startTime > 300000) { // 5 minutes
                clearTimeout(task.timeoutId);
                task.workerInfo.busy = false;
                this.backgroundTasks.delete(taskId);
            }
        }
        
        if (this.options.debugMode) {
            console.log('⚡ Memory cleanup completed');
        }
    }
    
    handleLowMemory() {
        console.warn('⚡ Low memory detected, performing aggressive cleanup');
        
        // Clear all memory caches
        this.cacheSystem.get('memory')?.clear();
        
        // Cancel low-priority background tasks
        for (const [taskId, task] of this.backgroundTasks) {
            if (task.priority < 2) {
                task.reject(new Error('Cancelled due to low memory'));
                clearTimeout(task.timeoutId);
                task.workerInfo.busy = false;
                this.backgroundTasks.delete(taskId);
            }
        }
        
        // Force garbage collection if available
        if ('gc' in window) {
            window.gc();
        }
        
        this.emit('lowMemory', this.getMemoryUsage());
    }
    
    // Performance Optimization
    setupPerformanceOptimization() {
        // Debounce heavy operations
        this.debouncedOperations = new Map();
        
        // Optimize DOM operations
        this.setupDOMOptimization();
        
        // Optimize event handlers
        this.setupEventOptimization();
    }
    
    setupDOMOptimization() {
        // Batch DOM updates
        this.domUpdates = [];
        this.domUpdateScheduled = false;
        
        // Virtual DOM for complex updates
        this.virtualDOM = new Map();
    }
    
    batchDOMUpdate(element, updates) {
        this.domUpdates.push({ element, updates });
        
        if (!this.domUpdateScheduled) {
            this.domUpdateScheduled = true;
            requestAnimationFrame(() => {
                this.flushDOMUpdates();
            });
        }
    }
    
    flushDOMUpdates() {
        for (const { element, updates } of this.domUpdates) {
            for (const update of updates) {
                if (update.property) {
                    element[update.property] = update.value;
                } else if (update.attribute) {
                    element.setAttribute(update.attribute, update.value);
                } else if (update.style) {
                    element.style[update.style] = update.value;
                }
            }
        }
        
        this.domUpdates = [];
        this.domUpdateScheduled = false;
    }
    
    setupEventOptimization() {
        // Passive event listeners where possible
        this.passiveEvents = ['scroll', 'touchstart', 'touchmove', 'wheel'];
        
        // Event delegation optimization
        this.delegatedEvents = new Map();
    }
    
    // Utility Methods
    debounce(func, wait, key) {
        if (this.debouncedOperations.has(key)) {
            clearTimeout(this.debouncedOperations.get(key));
        }
        
        const timeoutId = setTimeout(func, wait);
        this.debouncedOperations.set(key, timeoutId);
    }
    
    throttle(func, limit, key) {
        if (!this.throttledOperations) {
            this.throttledOperations = new Map();
        }
        
        if (!this.throttledOperations.has(key)) {
            this.throttledOperations.set(key, true);
            func();
            setTimeout(() => {
                this.throttledOperations.delete(key);
            }, limit);
        }
    }
    
    calculateSize(obj) {
        let size = 0;
        
        if (typeof obj === 'string') {
            size = obj.length * 2; // UTF-16 characters
        } else if (typeof obj === 'object' && obj !== null) {
            size = JSON.stringify(obj).length * 2;
        } else {
            size = 8; // Approximate size for other types
        }
        
        return size;
    }
    
    compressData(data) {
        // Simple compression for demonstration
        return JSON.stringify(data);
    }
    
    decompressData(compressed) {
        try {
            return JSON.parse(compressed);
        } catch {
            return compressed;
        }
    }
    
    formatBytes(bytes) {
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        if (bytes === 0) return '0 Bytes';
        const i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    generateTaskId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Event Emitter Methods
    on(event, callback) {
        if (!this.events.has(event)) {
            this.events.set(event, []);
        }
        this.events.get(event).push(callback);
    }
    
    off(event, callback) {
        if (this.events.has(event)) {
            const callbacks = this.events.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }
    
    emit(event, data) {
        if (this.events.has(event)) {
            for (const callback of this.events.get(event)) {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in event handler for ${event}:`, error);
                }
            }
        }
    }
    
    // Public API Methods
    getPerformanceReport() {
        return {
            cache: this.getCacheMetrics(),
            memory: this.getMemoryUsage(),
            backgroundTasks: this.backgroundTasks.size,
            lazyLoadedItems: Array.from(this.lazyLoadRegistry.values()).filter(c => c.loaded).length,
            performanceMetrics: Object.fromEntries(this.performanceMetrics)
        };
    }
    
    optimizeNow() {
        this.performMemoryCleanup();
        this.flushDOMUpdates();
        
        // Clear low-priority caches
        const memoryCache = this.cacheSystem.get('memory');
        for (const [key, entry] of memoryCache) {
            if (entry.priority < 2) {
                memoryCache.delete(key);
            }
        }
        
        return this.getPerformanceReport();
    }
    
    // Cleanup
    destroy() {
        // Clear intervals
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
        }
        
        // Clear timeouts
        for (const timeoutId of this.debouncedOperations.values()) {
            clearTimeout(timeoutId);
        }
        
        // Terminate workers
        for (const { worker } of this.workerPool) {
            worker.terminate();
        }
        
        // Clear observers
        if (this.observer) {
            this.observer.disconnect();
        }
        
        // Unregister service worker
        if (this.swRegistration) {
            this.swRegistration.unregister();
        }
        
        // Clear caches
        this.cacheSystem.clear();
        this.events.clear();
        
        console.log('⚡ Performance Manager destroyed');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PerformanceManager;
} else if (typeof window !== 'undefined') {
    window.PerformanceManager = PerformanceManager;
}