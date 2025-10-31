# 🔐 Authentication Implementation Guide

**Purpose:** Enable Supabase Authentication for Battalion Chief Admin Access
**Required For:** RLS security policies to function correctly
**Effort:** 1-2 days
**Priority:** 🔴 CRITICAL (Required for RLS fix)

---

## 🎯 Current State

**Existing Code Found:**
- ✅ `src/contexts/AuthContext.tsx` exists but is **UNUSED**
- ✅ `src/components/LoginModal.tsx` exists but is **UNUSED**
- ❌ Current admin mode uses **hardcoded password** in localStorage (insecure)
- ❌ All users currently use **anon key** (no authentication)

**Comment in Code** (`src/App.tsx:1-6`):
```typescript
// TECHNICAL DEBT: AuthContext and LoginModal exist but are never used - dead code
// Uses hardcoded password instead of proper Supabase authentication
// Admin mode stored in localStorage is insecure (client-side only, easily bypassed)
```

---

## 🚨 Why Authentication is Critical

**Current Problem:**
1. RLS policies require `authenticated` role for writes
2. App uses anon key for all users
3. After RLS migration, **ALL write operations will fail**
4. Battalion chiefs won't be able to assign holds, add firefighters, etc.

**Solution:**
Implement Supabase Auth so battalion chiefs can authenticate

---

## 📋 Implementation Plan

### Phase 1: Enable Supabase Auth (2 hours)

**Step 1: Configure Supabase Auth**
```bash
# In Supabase Dashboard:
# 1. Go to Authentication → Providers
# 2. Enable Email provider
# 3. Configure email templates
# 4. Set up allowed email domains (optional)
```

**Step 2: Activate AuthContext**

File: `src/main.tsx`
```typescript
import { AuthProvider } from './contexts/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

**Step 3: Review AuthContext Implementation**
```bash
# Check existing implementation
cat src/contexts/AuthContext.tsx

# Should provide:
# - signIn(email, password)
# - signOut()
# - signUp(email, password)
# - user object
# - session object
```

---

### Phase 2: Integrate Authentication (4 hours)

**Step 1: Update App.tsx**

```typescript
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, signIn, signOut } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Replace hardcoded password admin mode
  const isAdminMode = !!user; // If logged in, they're a battalion chief

  function handleToggleAdminMode() {
    if (user) {
      // Sign out
      signOut();
      showToast("Admin mode disabled", "info");
    } else {
      // Show login modal
      setShowLoginModal(true);
    }
  }

  return (
    <>
      {/* Existing app code */}

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={() => {
          setShowLoginModal(false);
          showToast("Battalion Chief mode enabled", "success");
        }}
      />
    </>
  );
}
```

**Step 2: Update LoginModal**

File: `src/components/LoginModal.tsx`
```typescript
// Review existing implementation
// Should have:
// - Email input
// - Password input
// - Sign in button
// - Error handling
// - Uses useAuth hook
```

**Step 3: Add Auth State to Supabase Client**

File: `src/lib/supabase.ts` (already correct, no changes needed)
```typescript
// Client automatically uses session when available
// Falls back to anon key for public read access
```

---

### Phase 3: Create Battalion Chief Accounts (1 hour)

**Option A: Manual Account Creation** (Recommended first)
```sql
-- In Supabase SQL Editor:
-- Create accounts for battalion chiefs

-- Sign up via email (they'll get confirmation email)
-- OR use Supabase Dashboard → Authentication → Users → Invite User
```

**Option B: Sign-Up UI** (Future enhancement)
```typescript
// Add self-registration for battalion chiefs
// Include email verification
// Require admin approval before activation
```

**Initial Accounts:**
- Create 1-3 battalion chief accounts for testing
- Use department email addresses
- Set strong passwords

---

### Phase 4: Update Help Modal (30 minutes)

File: `src/components/HelpModal.tsx`

Replace hardcoded password section with:
```typescript
{!user ? (
  <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
    <h3 className="text-lg font-semibold text-blue-200 mb-2">
      🔐 Battalion Chief Login
    </h3>
    <p className="text-sm text-blue-300 mb-3">
      Battalion chiefs can log in to access admin features:
      assign holds, manage roster, and override rotation.
    </p>
    <button
      onClick={() => {
        onClose();
        onShowLogin(); // New prop
      }}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
    >
      Battalion Chief Login
    </button>
  </div>
) : (
  <div className="bg-emerald-900/30 border border-emerald-700/50 rounded-lg p-4">
    <h3 className="text-lg font-semibold text-emerald-200 mb-2">
      ✅ Logged In as Battalion Chief
    </h3>
    <p className="text-sm text-emerald-300 mb-3">
      You have full admin access to manage holds and roster.
    </p>
    <button
      onClick={signOut}
      className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 rounded-lg transition-colors"
    >
      Sign Out
    </button>
  </div>
)}
```

---

## 🔧 Technical Implementation Details

### Authentication Flow

**Public User (Firefighter):**
```
1. Visit site
2. View calendar (read-only)
3. See rotation positions
4. Check upcoming holds
5. Cannot modify anything
```

**Authenticated User (Battalion Chief):**
```
1. Click "Login" button
2. Enter email + password
3. Supabase auth validates
4. Session token stored
5. Admin features unlock
6. Can assign holds, modify roster, etc.
```

### API Request Flow

**Before (Insecure):**
```typescript
// Everyone uses anon key
const { data } = await supabase
  .from('firefighters')
  .update({ order_position: 0 })
  .eq('id', 'abc');
// Anyone can do this! 🔓
```

**After (Secure):**
```typescript
// Authenticated user's session token used automatically
const { data, error } = await supabase
  .from('firefighters')
  .update({ order_position: 0 })
  .eq('id', 'abc');

// If not authenticated:
// error: "new row violates row-level security policy"
// ✅ Secure!
```

---

## 🧪 Testing Checklist

### Test as Anonymous User
- [ ] Can view calendar
- [ ] Can see firefighter roster
- [ ] Can view scheduled holds
- [ ] **Cannot** click dates to schedule (dates disabled) ✓
- [ ] **Cannot** add firefighters (button hidden) ✓
- [ ] **Cannot** complete holds (admin-only) ✓
- [ ] Gets clear message: "Login required for modifications"

### Test as Authenticated User (Battalion Chief)
- [ ] Can log in with email/password
- [ ] Admin mode automatically enabled
- [ ] Can click calendar dates
- [ ] Can schedule holds
- [ ] Can complete holds
- [ ] Can add/edit/delete firefighters
- [ ] Can reorder roster
- [ ] All actions succeed in database

### Test Authentication Edge Cases
- [ ] Incorrect password shows error
- [ ] Session persists across page refresh
- [ ] Logout clears session
- [ ] Expired token refreshes automatically
- [ ] Network error during login handled gracefully

---

## 🎨 UI/UX Enhancements

### Header Updates

**Before:**
```
[Logo] Hold List Manager [Shift Selector] [Activity] [Help] [Menu]
```

**After:**
```
[Logo] Hold List Manager [Connection Status] [Shift Selector] [Login/Profile] [Activity] [Help]
```

### Login Button States

**Not Logged In:**
```tsx
<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg">
  <LogIn size={18} />
  <span>Battalion Chief Login</span>
</button>
```

**Logged In:**
```tsx
<div className="flex items-center gap-2 px-3 py-2 bg-emerald-900/30 border border-emerald-700 rounded-lg">
  <Shield size={16} className="text-emerald-400" />
  <span className="text-sm font-semibold text-emerald-300">
    {user.email}
  </span>
  <button onClick={signOut} className="p-1 hover:bg-emerald-800 rounded">
    <LogOut size={14} />
  </button>
</div>
```

---

## ⚠️ IMPORTANT CONSIDERATIONS

### Current Admin Password

File: `src/App.tsx:35`
```typescript
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Firerescue";
```

**This will be removed** and replaced with proper authentication.

**Migration Path for Existing Users:**
1. Current users relying on password will need to create accounts
2. Communicate change to battalion chiefs before deployment
3. Provide account creation instructions
4. Consider temporary dual-mode during transition

---

### Session Management

**Auto-login:**
```typescript
// Supabase automatically restores session on page load
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') {
    // User logged in
    setIsAdminMode(true);
  } else if (event === 'SIGNED_OUT') {
    // User logged out
    setIsAdminMode(false);
  }
});
```

**Token Refresh:**
- Supabase automatically refreshes tokens
- Sessions last 1 hour by default
- Refresh tokens last 60 days
- No manual refresh code needed

---

## 📊 Security Comparison

| Feature | Before (Hardcoded Password) | After (Supabase Auth) |
|---------|---------------------------|----------------------|
| Password security | ❌ Visible in source code | ✅ Hashed in database |
| Brute force protection | ❌ None | ✅ Rate limiting |
| Session management | ❌ localStorage only | ✅ Secure JWT tokens |
| Multi-user support | ❌ Single password | ✅ Individual accounts |
| Audit trail | ❌ No user identity | ✅ User ID in logs |
| Password reset | ❌ Code change required | ✅ Email reset flow |
| Account deactivation | ❌ Not possible | ✅ Disable accounts |
| RLS compatibility | ❌ Not compatible | ✅ Fully compatible |

---

## 🚀 Deployment Steps

### Pre-Deployment
1. Create battalion chief accounts in Supabase
2. Test login flow thoroughly
3. Verify all admin features work when authenticated
4. Test that public users can still view

### Deployment
1. Apply RLS migration
2. Deploy new app version with auth integration
3. Communicate changes to battalion chiefs
4. Provide login credentials
5. Monitor for authentication errors

### Post-Deployment
1. Verify no permission errors in logs
2. Confirm real-time updates work
3. Test admin operations
4. Gather user feedback

---

## 📝 Documentation for Users

### For Firefighters
```
What changed:
- You can still view the calendar and rotation
- No login required to see your position
- Same experience as before

What's new:
- More secure data protection
- Battalion chiefs now use individual accounts
- Audit trail shows who made changes
```

### For Battalion Chiefs
```
What changed:
- You now login with your email and password
- No more shared password
- Each chief has their own account

How to login:
1. Click "Battalion Chief Login" in header
2. Enter your department email
3. Enter your password
4. Admin features automatically unlock

First-time setup:
- Check your email for account invitation
- Set your password
- Save credentials securely
```

---

## 🔗 Resources

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Auth UI Components](https://supabase.com/docs/guides/auth/auth-helpers/auth-ui)

---

**Status:** Migration script created
**Next Step:** Activate AuthContext and integrate authentication
**Timeline:** 1-2 days for full implementation
**Testing:** 4 hours for comprehensive validation

---

*Document created: January 31, 2025*
*Required for: RLS security policy fix*
*Blocks: Secure write operations*
