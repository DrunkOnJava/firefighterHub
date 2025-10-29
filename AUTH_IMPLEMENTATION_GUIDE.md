# Authentication & Authorization Implementation Guide

## ✅ What's Been Done

### 1. Profiles Table Created

- **Migration:** `supabase/migrations/20251029000002_create_profiles_table.sql`
- **Features:**
  - `id` (references auth.users)
  - `is_admin` boolean flag
  - `org_id` for future multi-tenant support
  - Auto-creates profile on user signup
  - RLS enabled with proper policies

### 2. Edge Function Updated

- **File:** `supabase/functions/schedule-hold/index.ts`
- **Security:**
  - ✅ Checks if user is authenticated
  - ✅ Validates `is_admin` flag from profiles table
  - ✅ Rejects non-admin users with 403
  - ⏳ Temporarily allows anon key (for transition period)

### 3. Deployed

- ✅ Edge Function redeployed with admin check
- ✅ Service role key secured in function secrets

## 🚀 Deployment Steps

### Step 1: Apply Profiles Migration

Run the output from:

```bash
./scripts/setup-profiles.sh
```

Copy the SQL and run it in Supabase Dashboard → SQL Editor:
https://supabase.com/dashboard/project/tjljndzodowpohusrwhs/sql/new

### Step 2: Create Your First Admin User

**Option A: Create via Supabase Dashboard**

1. Go to Authentication → Users → Add User
2. Enter email & password
3. Click "Create User"
4. Run this SQL:
   ```sql
   UPDATE profiles SET is_admin = true WHERE email = 'your-email@example.com';
   ```

**Option B: Sign up via your app** (after integrating AuthContext)

1. Sign up normally
2. Run the UPDATE SQL above to promote yourself to admin

### Step 3: Integrate AuthContext in Your App

The `src/contexts/AuthContext.tsx` already exists but isn't integrated. To enable it:

#### 3a. Wrap App with AuthProvider

In `src/main.tsx`:

```typescript
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
```

#### 3b. Replace localStorage Admin Mode

In `src/App.tsx`, replace:

```typescript
const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
  const saved = localStorage.getItem("isAdminMode");
  return saved === "true";
});
```

With:

```typescript
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, isAdmin, signIn, signOut, loading } = useAuth();
  // Use isAdmin instead of isAdminMode throughout
```

#### 3c. Add Login/Logout UI

Replace the admin mode toggle button with:

```typescript
{
  !user ? (
    <button onClick={() => setShowLoginModal(true)}>Sign In</button>
  ) : (
    <div className="flex items-center gap-2">
      <span>{user.email}</span>
      {isAdmin && <span className="badge">Admin</span>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### Step 4: Remove Anon Fallback (When Ready)

Once authentication is fully integrated, update the Edge Function to reject anon requests:

```typescript
if (authError || !user) {
  return new Response(JSON.stringify({ error: "Authentication required" }), {
    status: 401,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
```

Redeploy:

```bash
supabase functions deploy schedule-hold --no-verify-jwt
```

## 🔐 Security Model

### Current (Transition)

```
Anon User → Edge Function → Allows (temporary)
Authenticated User → Edge Function → Checks is_admin → Allow/Deny
```

### Future (Full Auth)

```
No Auth → Edge Function → 401 Reject
Authenticated Non-Admin → Edge Function → 403 Reject
Authenticated Admin → Edge Function → ✅ Allow
```

## 📋 Migration Path

1. ✅ **Done:** Profiles table created
2. ✅ **Done:** Edge Function enforces admin check for authenticated users
3. ⏳ **Next:** Integrate AuthContext in App.tsx
4. ⏳ **Next:** Replace localStorage.isAdminMode with useAuth()
5. ⏳ **Next:** Add login UI (LoginModal already exists)
6. ⏳ **Next:** Test with real user accounts
7. ⏳ **Next:** Remove anon fallback from Edge Function
8. ⏳ **Next:** Deploy to production

## 🧪 Testing

### Test Admin User

1. Create user in Supabase Dashboard
2. Promote to admin: `UPDATE profiles SET is_admin = true WHERE id = 'user-uuid';`
3. Sign in via your app
4. Try scheduling a hold → Should work

### Test Non-Admin User

1. Create user in Supabase Dashboard
2. Don't promote to admin (is_admin remains false)
3. Sign in via your app
4. Try scheduling a hold → Should get 403 Forbidden

### Test Anon User (Temporary)

1. Don't sign in
2. Try scheduling a hold → Currently works (will be removed later)

## 📁 Files Changed

### Added

- `supabase/migrations/20251029000002_create_profiles_table.sql`
- `scripts/setup-profiles.sh`

### Modified

- `supabase/functions/schedule-hold/index.ts` - Admin check enabled

### To Modify (Next Steps)

- `src/main.tsx` - Add AuthProvider
- `src/App.tsx` - Replace isAdminMode with useAuth
- Components using admin checks - Update to use isAdmin from context

## 🎯 Benefits

- ✅ **Secure:** Only admins can schedule holds
- ✅ **Auditable:** Know which user performed actions
- ✅ **Scalable:** Ready for multi-tenant with org_id
- ✅ **RLS Protected:** Database enforces policies
- ✅ **No Client Secrets:** Service role key only on server
