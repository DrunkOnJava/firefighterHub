# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Update the URL
Edit `firefighterhub-visual-tests.spec.js` and change the BASE_URL:
```javascript
const BASE_URL = 'http://localhost:3000'; // Your FirefighterHub URL
```

### 2. Run Your First Test
```bash
npm run test:visual
```

This will:
- ✅ Open your FirefighterHub application
- ✅ Capture screenshots of all UI components
- ✅ Save them to `screenshots/current/`

### 3. Review Screenshots
```bash
open screenshots/current/
```

Look at the captured images to verify they look correct.

---

## 📋 Common Commands

| Command | What it does |
|---------|-------------|
| `npm run test:visual` | Run all visual tests and capture screenshots |
| `npm run test:ui` | Run tests in interactive UI mode (best for debugging) |
| `npm run compare` | Compare current screenshots with baseline |
| `npm run test:update-baseline` | Update baseline screenshots after confirming changes |
| `npm run test:report` | View detailed HTML test report |

---

## 📸 First Time Setup

1. **Capture initial baseline:**
   ```bash
   npm run test:visual
   ```

2. **Move screenshots to baseline:**
   ```bash
   mkdir -p screenshots/baseline
   cp screenshots/current/*.png screenshots/baseline/
   ```

3. **Commit baselines to git:**
   ```bash
   git add screenshots/baseline/
   git commit -m "Add visual regression baselines"
   ```

---

## 🔄 Workflow for UI Changes

1. **Make your UI changes** in FirefighterHub

2. **Run tests:**
   ```bash
   npm run test:visual
   ```

3. **Compare with baseline:**
   ```bash
   npm run compare
   ```

4. **Review differences** - Check `screenshots/current/` vs `screenshots/baseline/`

5. **If changes are correct:**
   ```bash
   npm run test:update-baseline
   git add screenshots/baseline/
   git commit -m "Update visual baselines for [feature name]"
   ```

6. **If changes are incorrect:** Fix the UI and go back to step 2

---

## 🎯 What Gets Tested

- ✅ Full page (desktop, tablet, mobile)
- ✅ Header and navigation
- ✅ Logo and branding
- ✅ Shift buttons (A, B, C)
- ✅ Toolbar (Print, Activity, Light, BC Mode, Help)
- ✅ Calendar view
- ✅ Calendar navigation
- ✅ Hold event pills
- ✅ Next Up section
- ✅ Individual shift panels
- ✅ Firefighter roster table
- ✅ Filter and export controls
- ✅ Filter modal
- ✅ Week timeline view

---

## 🐛 Troubleshooting

**"Cannot find element"**
- Check if your app is running at the correct URL
- Add `data-testid` attributes to your components
- Run with `npm run test:ui` to debug selectors

**"Tests are too slow"**
- Tests wait for page to fully load
- This is intentional to get consistent screenshots
- You can reduce timeout in `playwright.config.js` if needed

**"Screenshots look different on my machine"**
- Font rendering varies by OS
- Use Docker for consistency across machines
- Or increase `maxDiffPixels` tolerance

---

## 📚 Need More Help?

See the full [README.md](README.md) for:
- Detailed configuration options
- CI/CD integration examples
- Adding custom component tests
- Best practices

---

## 💡 Pro Tips

1. **Run in UI mode first** (`npm run test:ui`) - much easier to debug!
2. **Add `data-testid` attributes** to your components for reliable selection
3. **Commit baseline screenshots** to version control
4. **Review changes visually** - don't just trust the file size comparison
5. **Update baselines intentionally** - only when UI changes are correct
