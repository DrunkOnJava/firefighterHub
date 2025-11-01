# 🚨 URGENT: You're on the Wrong Port! 🚨

## The Problem
You visited: **http://localhost:5174/**
But the server is actually running on: **http://localhost:5173/**

## Solution
1. **Close the tab at port 5174**
2. **Open a new tab and visit:** http://localhost:5173/
3. **Do a hard refresh:**
   - **Mac:** `Cmd + Shift + R`
   - **Windows/Linux:** `Ctrl + Shift + F5`

---

## What You Should See

✅ **Dark graphite background** (gray-900 to black gradient)
✅ **No blue colors** anywhere
✅ **All UI elements** in gray tones
✅ **Both light and dark mode** showing graphite colors

---

## If You Still See Blue

### Option 1: Clear Browser Cache
1. Open DevTools (F12)
2. Go to Application tab
3. Click "Clear storage"
4. Click "Clear site data"
5. Refresh page

### Option 2: Disable Cache
1. Open DevTools (F12)
2. Go to Network tab
3. Check "Disable cache"
4. Keep DevTools open
5. Refresh page

### Option 3: Hard Refresh (Multiple Times)
Sometimes you need to refresh 2-3 times to clear all cached assets.

---

## Dev Server Status

```bash
✅ Server is running
✅ Port: 5173 (default Vite port)
✅ URL: http://localhost:5173/
❌ NOT on port 5174
```

To verify, check your terminal output - it should say:
```
➜  Local:   http://localhost:5173/
```

---

## What Was Changed

### 1. Theme System (Dark Graphite)
- **App background:** `gray-900` → `black` gradient
- **Cards:** `gray-800` gradient
- **Text:** Light gray shades
- **All blue colors:** Replaced with gray

### 2. Best Practices Applied
- ✅ Constants extracted to `/src/config/constants.ts`
- ✅ Dark mode hook created `/src/hooks/useDarkMode.ts`
- ✅ No hardcoded colors in App.tsx
- ✅ No magic numbers
- ✅ Type-safe configuration

### 3. Files Modified
1. `src/App.tsx` - Uses theme and constants
2. `src/utils/theme.ts` - Graphite color palette
3. `src/index.css` - Gray focus rings
4. `src/config/constants.ts` - New (configuration)
5. `src/hooks/useDarkMode.ts` - New (state management)

---

## Troubleshooting

### "I still don't see changes"

1. **Verify you're on the right port:** http://localhost:5173/
2. **Check the URL bar** - should say `localhost:5173` not `5174`
3. **Clear all caches** (see instructions above)
4. **Try incognito/private mode** (Cmd+Shift+N or Ctrl+Shift+N)
5. **Check terminal** - make sure dev server is running

### "Page won't load"

```bash
# Kill any old processes
pkill -f "vite"

# Clear caches
rm -rf .vite node_modules/.vite dist

# Restart dev server
pnpm run dev
```

---

## Quick Test

Open your browser console (F12) and run:

```javascript
localStorage.getItem('isDarkMode')
```

Should return: `"true"` (if you're in dark mode)

---

**Bottom line:** Visit **http://localhost:5173/** and hard refresh! 🎯
