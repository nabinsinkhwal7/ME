#!/usr/bin/env node

/**
 * Advanced Cache Buster for Static HTML Sites
 * 
 * This script automatically updates version numbers in your HTML files
 * to force browsers to load fresh CSS and JS files. It's specifically
 * designed to handle in-app browsers like Messenger, WhatsApp, etc.
 * 
 * Features:
 * - Template-based versioning with placeholders
 * - Automatic backup creation
 * - File integrity checking
 * - Deployment-ready output
 * 
 * Usage:
 * 1. Run: node cache-buster.js
 * 2. Or add to package.json: "bust-cache": "node cache-buster.js"
 * 3. For CI/CD: npm run bust-cache && git add . && git commit -m "chore: update cache versions"
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Configuration
const CONFIG = {
    htmlFiles: ['index.html'],
    cssFiles: ['styles.css'],
    jsFiles: ['script.js'],
    versionFormat: 'timestamp', // 'timestamp', 'hash', 'semantic'
    createBackups: true,
    backupDir: '.cache-backups'
};

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Generate version based on format
function generateVersion(format = 'timestamp', filePath = null) {
    switch (format) {
        case 'timestamp':
            return Date.now().toString();
        case 'hash':
            if (filePath && fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath);
                return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
            }
            return Math.random().toString(36).substring(2, 10);
        case 'semantic':
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hour = String(date.getHours()).padStart(2, '0');
            const minute = String(date.getMinutes()).padStart(2, '0');
            return `${year}.${month}.${day}.${hour}${minute}`;
        default:
            return Date.now().toString();
    }
}

// Create backup directory if it doesn't exist
function ensureBackupDir() {
    if (CONFIG.createBackups && !fs.existsSync(CONFIG.backupDir)) {
        fs.mkdirSync(CONFIG.backupDir, { recursive: true });
        log(`📁 Created backup directory: ${CONFIG.backupDir}`, 'blue');
    }
}

// Create backup of file
function createBackup(filePath) {
    if (!CONFIG.createBackups || !fs.existsSync(filePath)) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(CONFIG.backupDir, `${path.basename(filePath)}.${timestamp}.backup`);
    
    try {
        fs.copyFileSync(filePath, backupPath);
        log(`💾 Backup created: ${backupPath}`, 'blue');
    } catch (error) {
        log(`⚠️  Failed to create backup for ${filePath}: ${error.message}`, 'yellow');
    }
}

// Check if file exists and get its hash for integrity
function getFileInfo(filePath) {
    if (!fs.existsSync(filePath)) {
        return { exists: false, hash: null, size: 0 };
    }
    
    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('md5').update(content).digest('hex');
    
    return {
        exists: true,
        hash: hash,
        size: content.length
    };
}

// Update HTML files with new versions
function updateHtmlFiles() {
    const cssVersion = generateVersion(CONFIG.versionFormat, CONFIG.cssFiles[0]);
    const jsVersion = generateVersion(CONFIG.versionFormat, CONFIG.jsFiles[0]);
    
    log(`🎯 Generated versions:`, 'cyan');
    log(`   CSS: ${cssVersion}`, 'cyan');
    log(`   JS:  ${jsVersion}`, 'cyan');
    log('', 'reset');

    let totalUpdated = 0;

    CONFIG.htmlFiles.forEach(htmlFile => {
        if (!fs.existsSync(htmlFile)) {
            log(`⚠️  ${htmlFile} not found, skipping...`, 'yellow');
            return;
        }

        // Get file info before changes
        const beforeInfo = getFileInfo(htmlFile);
        
        // Create backup
        createBackup(htmlFile);

        let content = fs.readFileSync(htmlFile, 'utf8');
        let updated = false;

        // Replace template placeholders
        const originalContent = content;
        
        // Replace CSS version placeholder
        content = content.replace(/\{\{CSS_VERSION\}\}/g, cssVersion);
        
        // Replace JS version placeholder  
        content = content.replace(/\{\{JS_VERSION\}\}/g, jsVersion);

        // Also handle existing versioned files (fallback)
        CONFIG.cssFiles.forEach(cssFile => {
            const oldPattern = new RegExp(`${cssFile}\\?v=[^"'\\s>]*`, 'g');
            const newPattern = new RegExp(`${cssFile}(?!\\?v=)(?=["'\\s>])`, 'g');
            
            if (oldPattern.test(content)) {
                content = content.replace(oldPattern, `${cssFile}?v=${cssVersion}`);
                updated = true;
            } else if (newPattern.test(content)) {
                content = content.replace(newPattern, `${cssFile}?v=${cssVersion}`);
                updated = true;
            }
        });

        CONFIG.jsFiles.forEach(jsFile => {
            const oldPattern = new RegExp(`${jsFile}\\?v=[^"'\\s>]*`, 'g');
            const newPattern = new RegExp(`${jsFile}(?!\\?v=)(?=["'\\s>])`, 'g');
            
            if (oldPattern.test(content)) {
                content = content.replace(oldPattern, `${jsFile}?v=${jsVersion}`);
                updated = true;
            } else if (newPattern.test(content)) {
                content = content.replace(newPattern, `${jsFile}?v=${jsVersion}`);
                updated = true;
            }
        });

        // Check if template placeholders were replaced
        if (content !== originalContent) {
            updated = true;
        }

        if (updated) {
            fs.writeFileSync(htmlFile, content, 'utf8');
            
            // Verify the update
            const afterInfo = getFileInfo(htmlFile);
            
            log(`✅ Updated ${htmlFile}`, 'green');
            log(`   Size: ${beforeInfo.size} → ${afterInfo.size} bytes`, 'blue');
            log(`   Hash: ${beforeInfo.hash.substring(0, 8)}... → ${afterInfo.hash.substring(0, 8)}...`, 'blue');
            
            totalUpdated++;
        } else {
            log(`ℹ️  No changes needed for ${htmlFile}`, 'blue');
        }
    });

    return { totalUpdated, cssVersion, jsVersion };
}

// Validate that referenced files exist
function validateFiles() {
    log('🔍 Validating referenced files...', 'cyan');
    
    let allValid = true;
    
    [...CONFIG.cssFiles, ...CONFIG.jsFiles].forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            log(`✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`, 'green');
        } else {
            log(`❌ ${file} - File not found!`, 'red');
            allValid = false;
        }
    });
    
    return allValid;
}

// Clean old backups (keep last 10)
function cleanOldBackups() {
    if (!CONFIG.createBackups || !fs.existsSync(CONFIG.backupDir)) return;
    
    try {
        const files = fs.readdirSync(CONFIG.backupDir)
            .filter(file => file.endsWith('.backup'))
            .map(file => ({
                name: file,
                path: path.join(CONFIG.backupDir, file),
                time: fs.statSync(path.join(CONFIG.backupDir, file)).mtime
            }))
            .sort((a, b) => b.time - a.time);
        
        if (files.length > 10) {
            const toDelete = files.slice(10);
            toDelete.forEach(file => {
                fs.unlinkSync(file.path);
                log(`🗑️  Cleaned old backup: ${file.name}`, 'yellow');
            });
        }
    } catch (error) {
        log(`⚠️  Failed to clean old backups: ${error.message}`, 'yellow');
    }
}

// Main execution
function main() {
    log('🚀 Advanced Cache Buster Starting...', 'bright');
    log('', 'reset');
    
    // Ensure backup directory exists
    ensureBackupDir();
    
    // Validate files exist
    if (!validateFiles()) {
        log('', 'reset');
        log('❌ Validation failed! Please check that all CSS and JS files exist.', 'red');
        process.exit(1);
    }
    
    log('', 'reset');
    
    // Update HTML files
    const result = updateHtmlFiles();
    
    // Clean old backups
    cleanOldBackups();
    
    log('', 'reset');
    log('✨ Cache busting complete!', 'bright');
    log(`📊 Updated ${result.totalUpdated} file(s)`, 'green');
    
    if (result.totalUpdated > 0) {
        log('', 'reset');
        log('📝 Next steps:', 'cyan');
        log('1. Test your site locally to ensure everything works', 'blue');
        log('2. Commit and push your changes:', 'blue');
        log('   git add . && git commit -m "chore: update cache versions" && git push', 'magenta');
        log('3. Wait for deployment to complete', 'blue');
        log('4. Test in incognito/private browser window', 'blue');
        log('5. Share updated links - cache issues should be resolved!', 'blue');
        
        log('', 'reset');
        log('🎯 Version Summary:', 'cyan');
        log(`   CSS Version: ${result.cssVersion}`, 'green');
        log(`   JS Version:  ${result.jsVersion}`, 'green');
    }
    
    log('', 'reset');
    log('💡 Tip: Run this script every time you update CSS or JS files!', 'yellow');
}

// Handle errors gracefully
process.on('uncaughtException', (error) => {
    log('', 'reset');
    log('💥 Unexpected error occurred:', 'red');
    log(error.message, 'red');
    log('', 'reset');
    log('Please check your files and try again.', 'yellow');
    process.exit(1);
});

// Run the script
if (require.main === module) {
    main();
}

module.exports = { generateVersion, updateHtmlFiles, validateFiles };