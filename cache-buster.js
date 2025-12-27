#!/usr/bin/env node

/**
 * Cache Buster for Static HTML Sites
 * 
 * This script automatically updates version numbers in your HTML files
 * to force browsers to load fresh CSS and JS files.
 * 
 * Usage:
 * 1. Run: node cache-buster.js
 * 2. Or add to package.json scripts: "bust-cache": "node cache-buster.js"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    htmlFiles: ['index.html', 'personal.html'], // Add your HTML files here
    cssFiles: ['styles.css'],
    jsFiles: ['script.js'],
    versionFormat: 'timestamp' // 'timestamp', 'semantic', or 'random'
};

// Generate version based on format
function generateVersion(format = 'timestamp') {
    switch (format) {
        case 'timestamp':
            return Date.now().toString();
        case 'semantic':
            const date = new Date();
            return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
        case 'random':
            return Math.random().toString(36).substring(2, 8);
        default:
            return Date.now().toString();
    }
}

// Update HTML files with new versions
function updateHtmlFiles() {
    const version = generateVersion(CONFIG.versionFormat);
    
    CONFIG.htmlFiles.forEach(htmlFile => {
        if (!fs.existsSync(htmlFile)) {
            console.log(`⚠️  ${htmlFile} not found, skipping...`);
            return;
        }

        let content = fs.readFileSync(htmlFile, 'utf8');
        let updated = false;

        // Update CSS files
        CONFIG.cssFiles.forEach(cssFile => {
            const oldPattern = new RegExp(`${cssFile}\\?v=[^"'\\s>]*`, 'g');
            const newPattern = new RegExp(`${cssFile}(?!\\?v=)`, 'g');
            
            if (oldPattern.test(content)) {
                content = content.replace(oldPattern, `${cssFile}?v=${version}`);
                updated = true;
            } else if (newPattern.test(content)) {
                content = content.replace(newPattern, `${cssFile}?v=${version}`);
                updated = true;
            }
        });

        // Update JS files
        CONFIG.jsFiles.forEach(jsFile => {
            const oldPattern = new RegExp(`${jsFile}\\?v=[^"'\\s>]*`, 'g');
            const newPattern = new RegExp(`${jsFile}(?!\\?v=)`, 'g');
            
            if (oldPattern.test(content)) {
                content = content.replace(oldPattern, `${jsFile}?v=${version}`);
                updated = true;
            } else if (newPattern.test(content)) {
                content = content.replace(newPattern, `${jsFile}?v=${version}`);
                updated = true;
            }
        });

        if (updated) {
            fs.writeFileSync(htmlFile, content);
            console.log(`✅ Updated ${htmlFile} with version: ${version}`);
        } else {
            console.log(`ℹ️  No changes needed for ${htmlFile}`);
        }
    });
}

// Main execution
console.log('🚀 Starting cache busting...\n');
updateHtmlFiles();
console.log('\n✨ Cache busting complete!');
console.log('\n📝 Next steps:');
console.log('1. Upload your updated HTML files to your server');
console.log('2. Clear any CDN cache if you\'re using one');
console.log('3. Test in an incognito/private browser window');
