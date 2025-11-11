# Progressive Web App Setup Guide

Your Hold List Manager is now configured as a Progressive Web App (PWA)!

## What's Been Implemented

### 1. Manifest File (`/public/manifest.json`)
- **App Name**: Hold List Manager - Firefighter Rotation
- **Short Name**: Hold Manager
- **Display Mode**: Standalone (runs like a native app)
- **Theme Color**: #ea580c (orange to match your app)
- **Background Color**: #0f172a (dark slate to match your app theme)
- **Orientation**: Portrait-primary (optimized for vertical viewing)

### 2. Service Worker (`/public/service-worker.js`)
- Caches essential app resources for offline access
- Automatically updates when new versions are deployed
- Implements cache-first strategy for faster loading

### 3. HTML Meta Tags (Updated `index.html`)
- PWA-specific meta tags for better mobile experience
- Apple iOS compatibility tags
- Theme color for browser UI
- Service worker registration script

### 4. Icon Template (`/public/icon-template.svg`)
- SVG template with flame icon and orange gradient
- Ready to be converted to PNG files at various sizes

## Required Icon Sizes

You need to create PNG icons from the SVG template at these sizes:

- 72x72
- 96x96
- 128x128
- 144x144
- 152x152 (Apple Touch Icon)
- 192x192 (Android)
- 384x384
- 512x512 (Android, maskable)

### Converting SVG to PNG Icons

**Option 1: Using Online Tools**
1. Go to https://cloudconvert.com/svg-to-png
2. Upload `/public/icon-template.svg`
3. Set desired dimensions for each size
4. Download and save as `/public/icon-[SIZE].png`

**Option 2: Using ImageMagick (Command Line)**
```bash
# Install ImageMagick first, then run:
for size in 72 96 128 144 152 192 384 512; do
  convert -background none -resize ${size}x${size} public/icon-template.svg public/icon-${size}x${size}.png
done
```

**Option 3: Using Figma/Adobe Illustrator**
1. Open the SVG in your design tool
2. Export at each required size
3. Save to `/public/` directory

## Testing Your PWA

### Desktop (Chrome/Edge)
1. Open your app in the browser
2. Look for the install icon in the address bar
3. Click "Install" to add to your desktop
4. Open DevTools → Application → Manifest to verify

### Mobile (Android)
1. Open your app in Chrome
2. Tap the menu (⋮)
3. Select "Add to Home Screen"
4. Confirm the installation

### Mobile (iOS)
1. Open your app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"
4. Confirm and name the app

## Verification Checklist

Use this checklist to ensure proper PWA implementation:

- [ ] All icon files are created and placed in `/public/` directory
- [ ] Manifest.json is accessible at `/manifest.json`
- [ ] Service worker registers successfully (check browser console)
- [ ] App is installable (install prompt appears)
- [ ] Theme color appears in browser UI
- [ ] App runs in standalone mode after installation
- [ ] App works offline after first visit
- [ ] Icons display correctly on home screen

## Testing Tools

### Chrome DevTools Audit
1. Open DevTools (F12)
2. Go to "Lighthouse" tab
3. Select "Progressive Web App" category
4. Run audit and fix any issues

### PWA Builder
Visit https://www.pwabuilder.com and enter your site URL to:
- Validate manifest
- Check service worker
- Get improvement suggestions
- Generate app store packages

## Features Included

### App Shortcuts
Two shortcuts are pre-configured in the manifest:
1. **View Calendar** - Opens directly to calendar view
2. **Manage Team** - Opens edit mode for team management

### Screenshots (Optional)
The manifest includes placeholder references for:
- Wide screenshot (1280x720) for desktop
- Narrow screenshot (750x1334) for mobile

These help users preview your app before installing. Create them by:
1. Taking screenshots of your app at those dimensions
2. Saving as `/public/screenshot-wide.png` and `/public/screenshot-narrow.png`

## Offline Functionality

The service worker caches:
- Main HTML file
- Manifest file
- App icons
- JavaScript and CSS bundles

The app will work offline after the first visit, though Supabase database operations require internet connectivity.

## Customization Options

### Changing Theme Colors
Edit `manifest.json`:
```json
"theme_color": "#YOUR_COLOR",
"background_color": "#YOUR_BACKGROUND"
```

### Adding More Shortcuts
Edit `manifest.json` shortcuts array:
```json
{
  "name": "Shortcut Name",
  "url": "/?param=value",
  "icons": [{"src": "/icon-96x96.png", "sizes": "96x96"}]
}
```

### Modifying Cache Strategy
Edit `service-worker.js` to change what gets cached or how caching works.

## Deployment Notes

After deploying to production:
1. Test the install prompt on actual devices
2. Verify HTTPS is enabled (required for PWAs)
3. Check that all paths resolve correctly
4. Test offline functionality
5. Monitor service worker updates

## Support & Browser Compatibility

- ✅ Chrome/Edge (Full support)
- ✅ Safari iOS 11.3+ (With limitations)
- ✅ Firefox (Full support)
- ✅ Samsung Internet (Full support)
- ⚠️ Safari Desktop (Limited, no install prompt)

## Next Steps

1. Create all required icon PNG files from the SVG template
2. Deploy to production with HTTPS
3. Run Lighthouse audit to verify PWA score
4. Test installation on real devices
5. Share install instructions with your team

Your app is now ready to be installed like a native application on users' devices!
