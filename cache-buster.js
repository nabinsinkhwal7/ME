#!/usr/bin/env node

/**
 * Cache Buster for Sinkhwal Services
 * 
 * Automatically updates version numbers in HTML files to bust browser cache
 * when CSS/JS files are modified. Essential for Cloudflare Pages deployment.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateFileHash(filePath) {
    try {
        const fileContent = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(fileContent).digest('hex').substring(0, 10);
    } catch (error) {
        log(`⚠️  Could not read ${filePath}: ${error.message}`, 'yellow');
        return Date.now().toString();
    }
}

function updateCacheVersions() {
    log('🎯 Starting cache version update...', 'cyan');
    
    const htmlFiles = ['index.html', 'preview.html'];
    const staticFiles = [
        { file: 'styles.css', pattern: /styles\.css\?v=[^"']*/g },
        { file: 'script.js', pattern: /script\.js\?v=[^"']*/g }
    ];
    
    let updatedFiles = 0;
    
    htmlFiles.forEach(htmlFile => {
        if (!fs.existsSync(htmlFile)) {
            log(`❌ ${htmlFile} not found`, 'red');
            return;
        }
        
        let content = fs.readFileSync(htmlFile, 'utf8');
        let fileModified = false;
        
        staticFiles.forEach(({ file, pattern }) => {
            if (fs.existsSync(file)) {
                // Generate hash based on file content
                const fileHash = generateFileHash(file);
                const newVersion = `${file}?v=${fileHash}`;
                
                // Count matches before replacement
                const matches = content.match(pattern);
                if (matches && matches.length > 0) {
                    const oldVersion = matches[0];
                    content = content.replace(pattern, newVersion);
                    
                    if (oldVersion !== newVersion) {
                        log(`✅ Updated ${file}: ${oldVersion} → ${newVersion}`, 'green');
                        fileModified = true;
                    } else {
                        log(`ℹ️  ${file}: No changes needed`, 'blue');
                    }
                } else {
                    log(`⚠️  No version pattern found for ${file} in ${htmlFile}`, 'yellow');
                }
            } else {
                log(`❌ ${file} not found`, 'red');
            }
        });
        
        if (fileModified) {
            fs.writeFileSync(htmlFile, content);
            updatedFiles++;
            log(`💾 Saved ${htmlFile}`, 'green');
        }
    });
    
    if (updatedFiles > 0) {
        log(`🎉 Cache busting completed! Updated ${updatedFiles} file(s)`, 'bright');
        log('', 'reset');
        log('📝 Next steps:', 'cyan');
        log('1. Test your changes locally', 'blue');
        log('2. Deploy to Cloudflare Pages', 'blue');
        log('3. Clear browser cache or test in incognito mode', 'blue');
        log('4. Verify new resources load correctly', 'blue');
    } else {
        log('ℹ️  No files needed updating', 'blue');
    }
    
    return updatedFiles > 0;
}

function showCacheInfo() {
    log('', 'reset');
    log('🔄 Cache Buster for Sinkhwal Services', 'bright');
    log('', 'reset');
    log('📊 How it works:', 'cyan');
    log('• Generates unique hash for each CSS/JS file', 'green');
    log('• Updates version parameters in HTML files', 'green');
    log('• Forces browsers to download new resources', 'green');
    log('• Works perfectly with Cloudflare Pages caching', 'green');
    log('', 'reset');
    log('🎯 Benefits:', 'cyan');
    log('• No more "hard refresh" needed for users', 'green');
    log('• Instant updates when you deploy changes', 'green');
    log('• Optimal caching performance', 'green');
    log('• SEO-friendly resource loading', 'green');
    log('', 'reset');
}

// Main execution
if (require.main === module) {
    showCacheInfo();
    const updated = updateCacheVersions();
    process.exit(updated ? 0 : 1);
}

module.exports = { updateCacheVersions, generateFileHash };
