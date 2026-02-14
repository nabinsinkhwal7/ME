# GitHub Pages Deployment Setup

This guide will help you deploy your portfolio website to GitHub Pages using the `gh-pages-deploy-personal` branch.

## 🚀 Quick Setup Overview

This branch (`gh-pages-deploy-personal`) is specifically configured for GitHub Pages deployment while keeping your original cPanel deployment intact on the `master` branch.

### What's Different in This Branch:
- ✅ GitHub Pages workflow (`.github/workflows/github-pages.yml`)
- ✅ Updated domain references to GitHub Pages URL
- ✅ Automated cache busting before deployment
- ✅ Same validation tests as cPanel deployment
- ✅ Optimized for GitHub Pages hosting

## 📋 Step-by-Step Setup Instructions

### Step 1: Enable GitHub Pages in Repository Settings

1. Go to your GitHub repository: `https://github.com/nabinsinkhwal7/ME`
2. Click on **Settings** tab
3. Scroll down to **Pages** section in the left sidebar
4. Under **Source**, select **"GitHub Actions"**
5. Save the settings

### Step 2: Configure Branch for Deployment

1. Make sure you're on the `gh-pages-deploy-personal` branch
2. Push this branch to GitHub:
   ```bash
   git push origin gh-pages-deploy-personal
   ```
3. The GitHub Actions workflow will automatically trigger

### Step 3: Monitor Deployment

1. Go to the **Actions** tab in your GitHub repository
2. You should see a workflow run called "Deploy to GitHub Pages"
3. Wait for it to complete (green checkmark = success)

### Step 4: Access Your Website

Once deployment is successful, your website will be available at:
**https://nabinsinkhwal7.github.io/ME/**

## 🔧 How the GitHub Pages Workflow Works

### Automatic Testing (Runs on every push and PR)
- **HTML Validation**: Checks for syntax errors using `tidy`
- **JavaScript Validation**: Verifies JS syntax with Node.js
- **CSS Validation**: Basic CSS syntax checking
- **Cache Busting**: Updates asset versions automatically

### Automatic Deployment (Only on push to `gh-pages-deploy-personal`)
- **Triggers**: Only when you push to `gh-pages-deploy-personal` branch
- **Build Process**: Runs cache busting, then deploys
- **Files Deployed**: All website files (HTML, CSS, JS, images, etc.)
- **Excluded Files**: Git files, README, workflow files, node_modules

### Workflow Status Indicators
- ✅ **Green checkmark**: Deployment successful
- ❌ **Red X**: Deployment failed (check logs in Actions tab)
- 🟡 **Yellow dot**: Deployment in progress

## 📁 Branch Structure Comparison

### Master Branch (cPanel Deployment)
```
your-repo/
├── .github/workflows/deploy.yml          # cPanel FTP deployment
├── index.html                            # Original domain references
├── package.json                          # Original homepage URL
└── ... (other files)
```

### gh-pages-deploy-personal Branch (GitHub Pages)
```
your-repo/
├── .github/workflows/
│   ├── deploy.yml                        # Original cPanel workflow
│   └── github-pages.yml                  # NEW: GitHub Pages workflow
├── index.html                            # Updated with GitHub Pages URLs
├── package.json                          # Updated homepage URL
├── README-GITHUB-PAGES.md               # This file
└── ... (other files)
```

## 🛠️ Customization Options

### Change Deployment Branch
To deploy from a different branch, edit `.github/workflows/github-pages.yml`:
```yaml
on:
  push:
    branches: [ your-new-branch-name ]
```

### Custom Domain Setup (Optional)
If you want to use a custom domain:

1. Create a `CNAME` file in the repository root:
   ```
   yourdomain.com
   ```

2. Configure your domain's DNS:
   - Add a CNAME record pointing to `nabinsinkhwal7.github.io`
   - Or add A records pointing to GitHub Pages IPs

3. Enable custom domain in GitHub Pages settings

### Add Build Steps
If you need additional build processes, add them before deployment:
```yaml
- name: Build project
  run: |
    npm install
    npm run build
```

## 🚨 Troubleshooting

### Common Issues:

1. **Deployment Failed - 404 Error**
   - Ensure GitHub Pages is enabled in repository settings
   - Check that the source is set to "GitHub Actions"
   - Verify the branch `gh-pages-deploy-personal` exists

2. **Workflow Not Triggering**
   - Make sure you're pushing to `gh-pages-deploy-personal` branch
   - Check if the workflow file has correct syntax
   - Verify repository permissions allow Actions

3. **Website Not Loading Properly**
   - Check browser console for errors
   - Verify all asset paths are relative (not absolute)
   - Clear browser cache and try again

4. **Cache Busting Issues**
   - Ensure `cache-buster.js` is working correctly
   - Check if Node.js version is compatible (workflow uses Node 18)

### Getting Help:
- Check the **Actions** tab for detailed deployment logs
- Look for error messages in the workflow steps
- Compare with successful deployments

## 🔄 Switching Between Deployments

### To Deploy to GitHub Pages:
```bash
git checkout gh-pages-deploy-personal
# Make your changes
git add .
git commit -m "Update for GitHub Pages"
git push origin gh-pages-deploy-personal
```

### To Deploy to cPanel:
```bash
git checkout master
# Make your changes
git add .
git commit -m "Update for cPanel"
git push origin master
```

### To Sync Changes Between Branches:
```bash
# From master to gh-pages-deploy-personal
git checkout gh-pages-deploy-personal
git merge master
# Resolve any conflicts (especially domain URLs)
git push origin gh-pages-deploy-personal
```

## 🎯 Benefits of This Setup

- ✅ **Free Hosting**: No cost for public repositories
- ✅ **Automatic HTTPS**: SSL certificate included
- ✅ **Global CDN**: Fast loading worldwide
- ✅ **Custom Domain Support**: Use your own domain
- ✅ **Automatic Deployments**: Deploy on every push
- ✅ **No Server Maintenance**: GitHub handles infrastructure
- ✅ **Dual Deployment**: Keep both cPanel and GitHub Pages options

## 🔒 Security Notes

- GitHub Pages sites are always public (even for private repos)
- Don't include sensitive information in your repository
- All deployment logs are visible in the Actions tab
- GitHub handles SSL certificates automatically

## 📊 Performance Optimizations

The workflow includes several optimizations:
- **Cache Busting**: Prevents browser caching issues
- **Asset Validation**: Ensures all files are error-free
- **Automated Testing**: Catches issues before deployment
- **CDN Distribution**: GitHub's global CDN for fast loading

---

## 🎉 You're All Set!

Your website should now be live at: **https://nabinsinkhwal7.github.io/ME/**

For any issues or questions, check the GitHub Actions logs or refer to the troubleshooting section above.

**Happy coding! 🚀**
