# 🚀 Deployment Instructions

## Prerequisites

Before deploying, ensure you have:
- Node.js (v14 or higher) installed
- npm or yarn package manager
- A code editor (VS Code recommended)

## 🔧 Setup Instructions

### 1. Install Node.js

If you don't have Node.js installed:

**Windows:**
1. Visit [nodejs.org](https://nodejs.org/)
2. Download the LTS version
3. Run the installer and follow the prompts
4. Verify installation: Open PowerShell and run `node --version`

**macOS:**
```bash
# Using Homebrew
brew install node
```

**Linux:**
```bash
# Using package manager (Ubuntu/Debian)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Dependencies

Navigate to the project directory and install dependencies:

```bash
cd micro-habit-builder
npm install
```

This will install:
- React 18
- React Router DOM
- Tailwind CSS
- PostCSS & Autoprefixer
- All other required dependencies

### 3. Development Server

Start the development server:

```bash
npm start
```

The app will open at `http://localhost:3000`

## 📦 Build for Production

### Create Production Build

```bash
npm run build
```

This creates a `build` folder with optimized production files.

### Test Production Build

```bash
# Install serve globally
npm install -g serve

# Serve the build folder
serve -s build -l 3000
```

## 🌐 Deployment Options

### Option 1: Netlify (Recommended)

**Method A: Drag & Drop**
1. Run `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag the `build` folder to the deployment area

**Method B: Git Integration**
1. Push code to GitHub
2. Connect repository to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`

### Option 2: Vercel

1. Install Vercel CLI: `npm install -g vercel`
2. Run `vercel` in project directory
3. Follow the prompts

**Or use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub
3. Deploy automatically

### Option 3: GitHub Pages

1. Install gh-pages: `npm install --save-dev gh-pages`

2. Add to package.json:
```json
{
  "homepage": "https://yourusername.github.io/micro-habit-builder",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"
  }
}
```

3. Deploy:
```bash
npm run deploy
```

### Option 4: Firebase Hosting

1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

### Option 5: AWS S3 + CloudFront

1. Build the app: `npm run build`
2. Create S3 bucket
3. Upload build folder contents
4. Configure S3 for static hosting
5. Set up CloudFront distribution

### Option 6: Traditional Web Hosting

1. Build the app: `npm run build`
2. Upload contents of `build` folder to your web server
3. Configure server to serve `index.html` for all routes

## ⚙️ Configuration

### Environment Variables (Optional)

Create `.env` file in root directory:

```env
# App Configuration
REACT_APP_NAME=Micro Habit Builder
REACT_APP_VERSION=1.0.0

# Analytics (Optional)
REACT_APP_GA_TRACKING_ID=your-google-analytics-id

# API Endpoints (Future)
REACT_APP_API_URL=https://api.your-domain.com
```

### Tailwind CSS Configuration

The app is pre-configured with Tailwind CSS. To customize:

1. Edit `tailwind.config.js`
2. Modify colors, fonts, spacing
3. Rebuild the app

### Router Configuration

For deployment on subdirectories, update `package.json`:

```json
{
  "homepage": "https://yourdomain.com/subdirectory"
}
```

## 🔍 Troubleshooting

### Common Issues

**1. Blank page after deployment**
- Check browser console for errors
- Ensure `homepage` in package.json is correct
- Verify all files are uploaded

**2. Routing issues (404 on refresh)**
- Configure server redirects to `index.html`
- For Netlify: Add `_redirects` file with `/* /index.html 200`

**3. Build fails**
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`

**4. Styling issues**
- Ensure Tailwind CSS is properly configured
- Check PostCSS configuration
- Verify all CSS imports

### Server Configuration

For proper SPA routing, configure your server:

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Express.js:**
```javascript
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
```

## 📊 Performance Optimization

### Bundle Analysis

Analyze bundle size:
```bash
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'
```

### Optimization Tips

1. **Code Splitting**: Already implemented with React.lazy()
2. **Service Worker**: Included by default for caching
3. **Compression**: Enable gzip on your server
4. **CDN**: Use CloudFront or similar for global distribution

### PWA Configuration

The app is PWA-ready. To enhance:

1. Edit `public/manifest.json`
2. Add custom icons
3. Configure service worker in `src/serviceWorker.js`

## 🔒 Security Considerations

### Content Security Policy

Add to your server configuration:
```
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';
```

### HTTPS

Always deploy with HTTPS:
- Netlify/Vercel: Automatic HTTPS
- Custom domain: Use Let's Encrypt or CloudFlare

## 📱 Mobile App Deployment (Future)

Using Capacitor for mobile apps:

```bash
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
npm run build
npx cap sync
npx cap open ios
npx cap open android
```

## 🎯 Post-Deployment Checklist

- [ ] App loads correctly
- [ ] All routes work (refresh test)
- [ ] Dark mode toggles properly
- [ ] Local storage persists data
- [ ] Mobile responsive design works
- [ ] All features functional
- [ ] Performance is acceptable
- [ ] Analytics tracking (if configured)

## 📈 Monitoring

### Analytics Setup

Add Google Analytics to `public/index.html`:

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
</script>
```

### Error Monitoring

Consider adding Sentry for error tracking:

```bash
npm install @sentry/react
```

## 🔄 Updates and Maintenance

### Regular Updates

1. Update dependencies: `npm update`
2. Check for security vulnerabilities: `npm audit`
3. Test functionality after updates
4. Rebuild and redeploy

### Backup Strategy

- Export user data regularly (built into Settings)
- Keep deployment configurations in version control
- Document any server configurations

---

**Happy Deploying! 🚀**

For additional help, check the [React deployment documentation](https://create-react-app.dev/docs/deployment/).