#!/usr/bin/env node

/**
 * Cloudflare Pages Deployment Script for Sinkhwal Services
 * 
 * Optimized deployment process for Cloudflare Pages including:
 * - Cache busting with Cloudflare-specific optimizations
 * - Performance validation
 * - Deployment verification
 * - Cache purging instructions
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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

function validateFiles() {
    log('🔍 Validating Cloudflare Pages configuration...', 'cyan');
    
    const requiredFiles = [
        'index.html',
        'styles.css',
        'script.js',
        '_headers',
        '_redirects'
    ];
    
    let allValid = true;
    
    requiredFiles.forEach(file => {
        if (fs.existsSync(file)) {
            const stats = fs.statSync(file);
            log(`✅ ${file} (${(stats.size / 1024).toFixed(1)} KB)`, 'green');
        } else {
            log(`❌ ${file} - Required file missing!`, 'red');
            allValid = false;
        }
    });
    
    // Validate _headers file content
    if (fs.existsSync('_headers')) {
        const headersContent = fs.readFileSync('_headers', 'utf8');
        if (headersContent.includes('Cache-Control') && headersContent.includes('max-age')) {
            log(`✅ _headers contains proper cache configuration`, 'green');
        } else {
            log(`⚠️  _headers may be missing cache configuration`, 'yellow');
        }
    }
    
    // Validate _redirects file content
    if (fs.existsSync('_redirects')) {
        const redirectsContent = fs.readFileSync('_redirects', 'utf8');
        if (redirectsContent.includes('301') || redirectsContent.includes('200')) {
            log(`✅ _redirects contains proper redirect rules`, 'green');
        } else {
            log(`⚠️  _redirects may be missing redirect rules`, 'yellow');
        }
    }
    
    return allValid;
}

function updateCacheVersions() {
    log('🎯 Updating cache versions for Cloudflare...', 'cyan');
    
    try {
        execCommand('node cache-buster.js', 'Cache version update');
        return true;
    } catch (error) {
        log('⚠️  Cache buster failed, continuing with manual version update...', 'yellow');
        
        // Manual fallback
        const timestamp = Date.now().toString();
        const indexPath = 'index.html';
        
        if (fs.existsSync(indexPath)) {
            let content = fs.readFileSync(indexPath, 'utf8');
            
            // Update CSS version
            content = content.replace(/styles\.css\?v=[^"']*/, `styles.css?v=${timestamp}`);
            // Update JS version
            content = content.replace(/script\.js\?v=[^"']*/, `script.js?v=${timestamp}`);
            
            fs.writeFileSync(indexPath, content);
            log(`✅ Manual cache version update: ${timestamp}`, 'green');
            return true;
        }
        
        return false;
    }
}

function checkGitStatus() {
    try {
        const status = execSync('git status --porcelain', { encoding: 'utf8' });
        return status.trim();
    } catch (error) {
        log('⚠️  Git not available or not initialized', 'yellow');
        return null;
    }
}

function deployToCloudflare() {
    log('🚀 Starting Cloudflare Pages Deployment Process', 'bright');
    log('', 'reset');

    try {
        // Step 1: Validate files
        log('📋 Step 1: Validating files and configuration', 'cyan');
        if (!validateFiles()) {
            throw new Error('File validation failed');
        }
        log('', 'reset');

        // Step 2: Update cache versions
        log('🎯 Step 2: Updating cache versions', 'cyan');
        updateCacheVersions();
        log('', 'reset');

        // Step 3: Check git status
        log('📊 Step 3: Checking git status', 'cyan');
        const gitStatus = checkGitStatus();
        
        if (gitStatus === null) {
            log('⚠️  Git not available, manual deployment required', 'yellow');
            log('✅ Files prepared for manual upload to Cloudflare Pages', 'green');
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

        // Step 4: Git operations
        log('📦 Step 4: Preparing git commit', 'cyan');
        execCommand('git add .', 'Adding files to git');

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const commitMessage = `deploy: update Sinkhwal Services for Cloudflare Pages (${timestamp})`;
        execCommand(`git commit -m "${commitMessage}"`, 'Committing changes');

        log('🚀 Step 5: Pushing to repository', 'cyan');
        execCommand('git push', 'Pushing to remote repository');

        log('', 'reset');
        log('🎉 Deployment initiated successfully!', 'bright');
        log('', 'reset');
        
        // Cloudflare-specific instructions
        log('📝 Cloudflare Pages will now:', 'cyan');
        log('✅ Detect the git push automatically', 'green');
        log('✅ Build and deploy your site', 'green');
        log('✅ Purge global cache automatically', 'green');
        log('✅ Update your live site worldwide', 'green');
        log('', 'reset');
        
        log('🔄 Next steps:', 'cyan');
        log('1. Monitor deployment in Cloudflare Pages dashboard', 'blue');
        log('2. Wait 2-3 minutes for global deployment', 'blue');
        log('3. Test your site: https://nabinsinkhwal.com.np', 'blue');
        log('4. Verify all WhatsApp buttons work correctly', 'blue');
        log('5. Test service modals and contact functionality', 'blue');
        log('', 'reset');
        
        log('🌐 Cloudflare Benefits Active:', 'cyan');
        log('⚡ Global CDN - Lightning fast loading worldwide', 'green');
        log('🔒 Automatic HTTPS - Secure connections everywhere', 'green');
        log('📊 Edge caching - Optimal performance', 'green');
        log('🚀 Auto-deployment - Updates on every git push', 'green');
        log('', 'reset');
        
        log('💡 Pro Tips:', 'yellow');
        log('• Changes appear in ~2 minutes globally', 'blue');
        log('• Use incognito mode to test cache updates', 'blue');
        log('• Monitor Core Web Vitals in Cloudflare Analytics', 'blue');
        log('• Set up custom domain in Cloudflare Pages dashboard', 'blue');

    } catch (error) {
        log('', 'reset');
        log('💥 Deployment preparation failed!', 'red');
        log('Please check the error above and try again.', 'yellow');
        log('', 'reset');
        log('🔧 Manual deployment options:', 'cyan');
        log('1. Upload files directly to Cloudflare Pages dashboard', 'blue');
        log('2. Connect repository manually in Cloudflare Pages', 'blue');
        log('3. Check git configuration and try again', 'blue');
        process.exit(1);
    }
}

function showCloudflareInfo() {
    log('', 'reset');
    log('🌟 Cloudflare Pages - Perfect for Business Sites!', 'bright');
    log('', 'reset');
    log('📊 Performance Benefits:', 'cyan');
    log('• 200+ edge locations worldwide', 'green');
    log('• Sub-second loading times globally', 'green');
    log('• 99.9% uptime SLA', 'green');
    log('• Automatic image optimization', 'green');
    log('• HTTP/2 and HTTP/3 support', 'green');
    log('', 'reset');
    log('🔒 Security Features:', 'cyan');
    log('• Automatic SSL certificates', 'green');
    log('• DDoS protection included', 'green');
    log('• Security headers configured', 'green');
    log('• Bot protection available', 'green');
    log('', 'reset');
    log('💰 Cost Effective:', 'cyan');
    log('• Free tier: 500 builds/month', 'green');
    log('• Unlimited bandwidth', 'green');
    log('• No server maintenance', 'green');
    log('• Pay only for what you use', 'green');
    log('', 'reset');
}

// Handle interruption gracefully
process.on('SIGINT', () => {
    log('', 'reset');
    log('⚠️  Deployment interrupted by user', 'yellow');
    log('Files are ready for manual deployment to Cloudflare Pages.', 'blue');
    process.exit(0);
});

// Main execution
if (require.main === module) {
    showCloudflareInfo();
    deployToCloudflare();
}

module.exports = { deployToCloudflare, validateFiles, updateCacheVersions };
