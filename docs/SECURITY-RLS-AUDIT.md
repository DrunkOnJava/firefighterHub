# 🚨 CRITICAL SECURITY AUDIT: Supabase RLS Policies

**Audit Date:** January 31, 2025
**Auditor:** Claude Code (Automated Security Scan)
**Severity:** 🔴 **CRITICAL - IMMEDIATE ACTION REQUIRED**

---

## Executive Summary

**FINDING: All data is publicly accessible with NO access controls**

The Supabase Row Level Security (RLS) policies are configured to allow **unrestricted access** to all users for all operations. While RLS is enabled on all tables, the policies grant full public access without any authentication or authorization checks.

**Risk Level:** 🔴 **CRITICAL**
**Impact:** Any user can read, modify, or delete ANY firefighter data across ALL shifts

---

## Current RLS Policy Configuration

### 1. `firefighters` Table

| Operation | Policy Name | Allowed Users | Restriction |
|-----------|------------|---------------|-------------|
| SELECT | "Enable read access for all users" | `public` (anyone) | None (`qual: true`) |
| INSERT | "Enable insert access for all users" | `public` (anyone) | None (`with_check: true`) |
| UPDATE | "Enable update access for all users" | `public` (anyone) | None (`qual: true`) |
| DELETE | "Enable delete access for all users" | `public` (anyone) | None (`qual: true`) |

**Translation:** Anyone can:
- ✅ View all firefighters from all shifts
- ✅ Add new firefighters to any shift
- ✅ Modify any firefighter's data (name, station, position, etc.)
- ✅ Delete any firefighter from the system

---

### 2. `scheduled_holds` Table

| Operation | Policy Name | Allowed Users | Restriction |
|-----------|------------|---------------|-------------|
| SELECT | "Enable read access for all users" | `public` (anyone) | None (`qual: true`) |
| INSERT | "Enable insert access for all users" | `public` (anyone) | None (`with_check: true`) |
| UPDATE | "Enable update access for all users" | `public` (anyone) | None (`qual: true`) |
| DELETE | "Enable delete access for all users" | `public` (anyone) | None (`qual: true`) |

**Translation:** Anyone can:
- ✅ View all scheduled holds from all shifts
- ✅ Schedule holds for any firefighter
- ✅ Modify any scheduled hold (change dates, stations, etc.)
- ✅ Delete any scheduled hold from the system

---

### 3. `activity_log` Table

| Operation | Policy Name | Allowed Users | Restriction |
|-----------|------------|---------------|-------------|
| SELECT | "Enable read access for all users" | `public` (anyone) | None (`qual: true`) |
| INSERT | "Enable insert access for all users" | `public` (anyone) | None (`with_check: true`) |

**Translation:** Anyone can:
- ✅ View all activity logs from all shifts
- ✅ Insert fake activity log entries

---

## Security Implications

### 🔴 CRITICAL Risks

1. **Cross-Shift Data Tampering**
   - Shift A members can modify Shift B and C data
   - No data isolation between shifts
   - Malicious actors could sabotage other shifts

2. **Unauthorized Deletion**
   - Anyone can delete entire rosters
   - Scheduled holds can be removed by anyone
   - No audit trail protection

3. **Data Integrity Compromise**
   - Order positions can be manipulated
   - Last hold dates can be falsified
   - Station assignments can be changed arbitrarily

4. **Privacy Violation**
   - All firefighter personal data exposed
   - No access control whatsoever
   - Anyone with the anon key has full database access

---

## Recommended RLS Policy Fixes

### Option 1: Public Read, Admin Write (Simplest)

**Use Case:** Single fire department, trusted users, simple access model

```sql
-- Drop existing overly-permissive policies
DROP POLICY IF EXISTS "Enable insert access for all users" ON firefighters;
DROP POLICY IF EXISTS "Enable update access for all users" ON firefighters;
DROP POLICY IF EXISTS "Enable delete access for all users" ON firefighters;

-- Allow public read access (existing policy is fine)
-- Keep: "Enable read access for all users"

-- Restrict write access to authenticated admin users only
CREATE POLICY "Enable insert for authenticated users only"
  ON firefighters FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only"
  ON firefighters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable delete for authenticated users only"
  ON firefighters FOR DELETE
  TO authenticated
  USING (true);

-- Repeat for scheduled_holds and activity_log
```

---

### Option 2: Shift-Based Isolation (Recommended)

**Use Case:** Multiple shifts need data isolation, prevents cross-contamination

```sql
-- Create user metadata table for shift assignments
CREATE TABLE IF NOT EXISTS user_shifts (
  user_id UUID REFERENCES auth.users(id),
  shift VARCHAR(1) CHECK (shift IN ('A', 'B', 'C')),
  is_admin BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (user_id, shift)
);

-- Firefighters: Users can only modify their assigned shift
CREATE POLICY "Users can view firefighters from their shift"
  ON firefighters FOR SELECT
  TO authenticated
  USING (
    shift IN (
      SELECT shift FROM user_shifts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert firefighters to their shift"
  ON firefighters FOR INSERT
  TO authenticated
  WITH CHECK (
    shift IN (
      SELECT shift FROM user_shifts WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update firefighters in their shift"
  ON firefighters FOR UPDATE
  TO authenticated
  USING (
    shift IN (
      SELECT shift FROM user_shifts WHERE user_id = auth.uid()
    )
  )
  WITH CHECK (
    shift IN (
      SELECT shift FROM user_shifts WHERE user_id = auth.uid()
    )
  );

-- Admins can delete any firefighter
CREATE POLICY "Admins can delete firefighters"
  ON firefighters FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_shifts
      WHERE user_id = auth.uid() AND is_admin = TRUE
    )
  );

-- Repeat similar policies for scheduled_holds and activity_log
```

---

### Option 3: Anon Read, Auth Write (Current Workaround)

**Use Case:** If authentication not yet implemented

```sql
-- Allow anonymous read access (for viewing without login)
CREATE POLICY "Enable read access for all users"
  ON firefighters FOR SELECT
  TO public
  USING (true);

-- Require authentication for ALL write operations
CREATE POLICY "Require auth for insert"
  ON firefighters FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Require auth for update"
  ON firefighters FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Require auth for delete"
  ON firefighters FOR DELETE
  TO authenticated
  USING (true);
```

---

## Immediate Action Items

### 🚨 EMERGENCY MITIGATION (Do Now)

1. **Decide on Security Model**
   - [ ] Public read + admin write? (simplest)
   - [ ] Shift-based isolation? (most secure)
   - [ ] Anonymous read + auth write? (middle ground)

2. **Implement Authentication (if not done)**
   - [ ] Review `src/contexts/AuthContext.tsx` (exists but unused!)
   - [ ] Integrate Supabase Auth UI
   - [ ] Require login for admin operations
   - [ ] Add user role management

3. **Update RLS Policies**
   - [ ] Choose policy strategy above
   - [ ] Write migration script
   - [ ] Test with multiple users
   - [ ] Verify isolation works

4. **Test Security**
   - [ ] Try to access other shift data
   - [ ] Try to delete without admin
   - [ ] Verify read-only for non-admins
   - [ ] Test with anonymous users

---

## Testing Checklist

### Security Validation Tests

- [ ] **Unauthenticated User**
  - [ ] Can view firefighters? (Should: YES)
  - [ ] Can add firefighters? (Should: NO)
  - [ ] Can delete firefighters? (Should: NO)
  - [ ] Can modify firefighters? (Should: NO)

- [ ] **Authenticated Regular User**
  - [ ] Can view own shift? (Should: YES)
  - [ ] Can view other shifts? (Should: NO or YES depending on model)
  - [ ] Can modify own shift? (Should: YES)
  - [ ] Can modify other shifts? (Should: NO)
  - [ ] Can delete firefighters? (Should: NO)

- [ ] **Authenticated Admin User**
  - [ ] Can view all shifts? (Should: YES)
  - [ ] Can modify all shifts? (Should: YES)
  - [ ] Can delete firefighters? (Should: YES)
  - [ ] Can access activity log? (Should: YES)

---

## Compliance & Best Practices

### OWASP Top 10 Violations

Current configuration violates:
- **A01:2021 – Broken Access Control** 🔴
  - No access control at all
  - All users have admin privileges

- **A07:2021 – Identification and Authentication Failures** 🟠
  - No authentication required for writes
  - No user identification

### Supabase Best Practices Violations

- ❌ **Never use `qual: true` for write operations**
- ❌ **Always require authentication for mutations**
- ❌ **Implement principle of least privilege**
- ❌ **Use policy qual to filter by user context**

### Recommended Reading

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL RLS Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [OWASP Broken Access Control](https://owasp.org/Top10/A01_2021-Broken_Access_Control/)

---

## Migration Script Template

```sql
-- File: supabase/migrations/YYYYMMDDHHMMSS_fix_rls_policies.sql

-- Remove overly permissive policies
DROP POLICY IF EXISTS "Enable insert access for all users" ON firefighters;
DROP POLICY IF EXISTS "Enable update access for all users" ON firefighters;
DROP POLICY IF EXISTS "Enable delete access for all users" ON firefighters;

DROP POLICY IF EXISTS "Enable insert access for all users" ON scheduled_holds;
DROP POLICY IF EXISTS "Enable update access for all users" ON scheduled_holds;
DROP POLICY IF EXISTS "Enable delete access for all users" ON scheduled_holds;

DROP POLICY IF EXISTS "Enable insert access for all users" ON activity_log;

-- Implement secure policies
-- (Choose from Option 1, 2, or 3 above)

-- Add user_shifts table if using Option 2
-- Add auth checks if using Option 1 or 3

-- Test the policies
-- (Include test queries here)
```

---

## Decision Matrix

| Security Model | Pros | Cons | Best For |
|----------------|------|------|----------|
| **Option 1: Public Read + Admin Write** | Simple to implement, maintains current UX | Single admin account, not multi-tenant | Small single-station departments |
| **Option 2: Shift-Based Isolation** | Most secure, prevents cross-shift tampering | More complex, requires user management | Large departments with multiple shifts |
| **Option 3: Anon Read + Auth Write** | Balances security and UX, easy to implement | All authenticated users have equal access | Medium departments with trusted staff |

---

## Conclusion

**SEVERITY: 🔴 CRITICAL**

The current RLS configuration provides **NO SECURITY** despite RLS being enabled. This is equivalent to having no RLS at all. Any user with the publicly available anon key can perform ANY operation on the database.

**RECOMMENDATION: Implement Option 3 (Anon Read + Auth Write) immediately as a temporary fix, then migrate to Option 2 (Shift-Based Isolation) for long-term security.**

**Timeline:**
- Emergency Fix (Option 3): 4 hours
- Proper Fix (Option 2): 2-3 days
- Testing & Validation: 1 day

---

*Audit completed: January 31, 2025*
*Status: AWAITING IMMEDIATE ACTION*
*Priority: BLOCK ALL OTHER WORK UNTIL FIXED*
