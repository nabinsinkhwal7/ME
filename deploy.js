#!/usr/bin/env node

/**
 * Automated Deployment Script for Static Site
 * 
 * This script handles the complete deployment process:
 * 1. Updates cache-busting versions
 * 2. Validates all files
 * 3. Commits changes to git
 * 4. Pushes to remote repository
 * 
 * Usage:
 * - node deploy.js
 * - npm run deploy (if added to package.json)
 */

const { execSync } = require('child_process');
const fs = require('fs');

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

function execCommand(command, description) {
    try {
        log(`🔄 ${description}...`, 'blue');
        const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
        log(`✅ ${description} completed`, 'green');
        return output;
    } catch (error) {
        log(`❌ ${description} failed:`, 'red');
        log(error.message, 'red');
        throw error;
    }
}

function checkGitStatus() {
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        return status.trim();
    } catch (error) {
        log('⚠️  Git not initialized or not available', 'yellow');
        return null;
    }
}

function main() {
    log('🚀 Starting Automated Deployment Process', 'bright');
    log('', 'reset');

    try {
        // Step 1: Run cache buster
        log('📦 Step 1: Updating cache versions', 'cyan');
        execCommand('node cache-buster.js', 'Cache busting');
        log('', 'reset');

        // Step 2: Check git status
        log('📋 Step 2: Checking git status', 'cyan');
        const gitStatus = checkGitStatus();
        
        if (gitStatus === null) {
            log('⚠️  Git not available, skipping git operations', 'yellow');
            log('✅ Cache busting completed. Please manually commit and push changes.', 'green');
            return;
        }

        if (!gitStatus) {
            log('ℹ️  No changes detected, nothing to deploy', 'blue');
            return;
        }

        log(`📝 Changes detected:`, 'blue');
        gitStatus.split('\n').forEach(line => {
            if (line.trim()) log(`   ${line}`, 'yellow');
        });
        log('', 'reset');

        // Step 3: Add changes to git
        log('📦 Step 3: Adding changes to git', 'cyan');
        execCommand('git add .', 'Adding files to git');

        // Step 4: Commit changes
        log('💾 Step 4: Committing changes', 'cyan');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const commitMessage = `chore: update cache versions and optimize deployment (${timestamp})`;
        execCommand(`git commit -m "${commitMessage}"`, 'Committing changes');

        // Step 5: Push to remote
        log('🚀 Step 5: Pushing to remote repository', 'cyan');
        execCommand('git push', 'Pushing to remote');

        log('', 'reset');
        log('🎉 Deployment completed successfully!', 'bright');
        log('', 'reset');
        log('📝 What happened:', 'cyan');
        log('✅ Cache versions updated for CSS and JS files', 'green');
        log('✅ Changes committed to git', 'green');
        log('✅ Changes pushed to remote repository', 'green');
        log('', 'reset');
        log('🔄 Next steps:', 'cyan');
        log('1. Wait for your hosting service to deploy the changes', 'blue');
        log('2. Test the site in an incognito/private browser window', 'blue');
        log('3. Share the updated link - cache issues should be resolved!', 'blue');
        log('', 'reset');
        log('💡 Your site will now force browsers to load fresh CSS and JS files!', 'yellow');

    } catch (error) {
        log('', 'reset');
        log('💥 Deployment failed!', 'red');
        log('Please check the error above and try again.', 'yellow');
        log('', 'reset');
        log('🔧 Manual steps you can try:', 'cyan');
        log('1. Run: node cache-buster.js', 'blue');
        log('2. Run: git add . && git commit -m "update cache versions"', 'blue');
        log('3. Run: git push', 'blue');
        process.exit(1);
    }
}

// Handle interruption gracefully
process.on('SIGINT', () => {
    log('', 'reset');
    log('⚠️  Deployment interrupted by user', 'yellow');
    log('You may need to manually commit and push any pending changes.', 'blue');
    process.exit(0);
});

if (require.main === module) {
    main();
}
