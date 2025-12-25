# CI/CD Setup for cPanel Deployment

This guide will help you set up automated deployment from GitHub to your cPanel hosting.

## 🚀 Quick Setup

### Step 1: Get Your cPanel FTP Details

1. Log into your cPanel
2. Find **FTP Accounts** or **File Manager**
3. Note down these details:
   - **FTP Server**: Usually `ftp.yourdomain.com` or your hosting provider's FTP server
   - **Username**: Your cPanel username or FTP username
   - **Password**: Your cPanel password or FTP password
   - **Directory**: Usually `/public_html/` (where your website files go)

### Step 2: Set Up GitHub Repository Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add these secrets:

| Secret Name | Value | Example |
|-------------|-------|---------|
| `FTP_SERVER` | Your FTP server address | `ftp.nabinsinkhwal.com.np` |
| `FTP_USERNAME` | Your FTP username | `nabinsin` |
| `FTP_PASSWORD` | Your FTP password | `your_secure_password` |
| `FTP_SERVER_DIR` | Target directory on server | `/public_html/` |

### Step 3: Push Your Code

1. Make sure your repository has the `.github/workflows/deploy.yml` file
2. Push any changes to the `main` or `master` branch
3. GitHub Actions will automatically:
   - Test your HTML, CSS, and JavaScript
   - Deploy to your cPanel if tests pass

## 🔧 How It Works

### Automatic Testing
- **HTML Validation**: Checks for syntax errors
- **JavaScript Validation**: Verifies JS syntax
- **CSS Validation**: Basic CSS syntax checking

### Automatic Deployment
- **Triggers**: Only deploys when you push to `main`/`master` branch
- **Files Deployed**: All your website files (HTML, CSS, JS, images)
- **Excluded Files**: Git files, README, workflow files

### Workflow Status
- ✅ **Green checkmark**: Deployment successful
- ❌ **Red X**: Deployment failed (check logs)
- 🟡 **Yellow dot**: Deployment in progress

## 📁 File Structure

Your repository should look like this:
```
your-repo/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── styles.css
├── script.js
├── favicon.png
└── DEPLOYMENT_SETUP.md
```

## 🛠️ Customization Options

### Change Deployment Branch
Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [ your-branch-name ]
```

### Deploy to Subdirectory
Update your `FTP_SERVER_DIR` secret to:
- `/public_html/subdirectory/` for subdirectory
- `/public_html/` for main domain

### Add Build Steps
If you need to compile/build your code, add steps before deployment:
```yaml
- name: Build project
  run: |
    npm install
    npm run build
```

## 🚨 Troubleshooting

### Common Issues:

1. **FTP Connection Failed**
   - Check FTP server address
   - Verify username/password
   - Ensure FTP is enabled in cPanel

2. **Permission Denied**
   - Check FTP user has write permissions
   - Verify server directory path

3. **Files Not Updating**
   - Clear browser cache
   - Check if files are in correct directory
   - Verify FTP_SERVER_DIR path

### Getting Help:
- Check the **Actions** tab in GitHub for detailed logs
- Look for error messages in the deployment step
- Verify all secrets are set correctly

## 🎯 Next Steps

1. **Test the Setup**: Make a small change and push to see if it deploys
2. **Monitor Deployments**: Check the Actions tab after each push
3. **Customize**: Add more testing or build steps as needed

## 🔒 Security Notes

- Never commit FTP credentials to your repository
- Use GitHub Secrets for all sensitive information
- Consider using SSH keys if your host supports them
- Regularly update your FTP password

---

**Need help?** Check the GitHub Actions logs or contact your hosting provider for FTP details.


