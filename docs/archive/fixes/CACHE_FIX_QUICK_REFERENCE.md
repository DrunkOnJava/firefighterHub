# Quick Reference: Force Reload Browser Cache

## For Users 👥

### I see old content / missing features

**Solution**: Hard refresh your browser

- **macOS**: `Cmd + Shift + R`
- **Windows/Linux**: `Ctrl + Shift + R`

### I see an orange banner "New Update Available"

**Solution**: Click the **"Reload"** button

This is automatic - the app detected a new version for you! ✨

---

## For Developers 🛠️

### Before EVERY Deployment

**1. Bump the cache version:**

```javascript
// File: public/service-worker.js
// Line 4
const CACHE_VERSION = "v7"; // ← Change this number!
```

**2. Test locally:**

```bash
pnpm build && pnpm preview
```

**3. Verify update notification appears**

**4. Deploy** 🚀

### VS Code Simple Browser - Clear Cache

**Method 1**: Keyboard shortcut

```
Cmd + Shift + R (macOS)
Ctrl + Shift + R (Windows/Linux)
```

**Method 2**: DevTools

1. Click ⋮ menu → "Open Browser DevTools"
2. Application tab → Storage
3. "Clear storage" → "Clear site data"

### Common Issues

| Problem                         | Solution                                |
| ------------------------------- | --------------------------------------- |
| Update notification not showing | Verify cache version was incremented    |
| Users still see old content     | Increment version AGAIN (skip a number) |
| Service worker not registering  | Check HTTPS (localhost is OK)           |
| Cache growing too large         | Old caches auto-delete on version bump  |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│  User Visits Site                                   │
└─────────────────┬───────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────┐
│  Service Worker Checks for Updates (every 60s)     │
└─────────────────┬───────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
  ┌──────────┐        ┌──────────┐
  │ No Update│        │  Update  │
  │ Available│        │Available!│
  └──────────┘        └─────┬────┘
                            │
                            ▼
              ┌──────────────────────────┐
              │ Show Orange Notification │
              │ "New Update Available!"  │
              └─────────┬────────────────┘
                        │
                        ▼
                ┌───────────────┐
                │ User clicks   │
                │  "Reload"     │
                └───────┬───────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │ 1. Delete old caches (v6)     │
        │ 2. Install new SW (v7)        │
        │ 3. Reload page with fresh code│
        └───────────────────────────────┘
```

---

## File Structure

```
public/
  └── service-worker.js ← BUMP VERSION HERE

src/
  └── components/
      └── UpdateNotification.tsx ← Auto-detects updates

App.tsx ← Shows <UpdateNotification />
```

---

## See Full Documentation

📖 **CACHE_FIX_GUIDE.md** - Complete technical details
