# Super Admin Login Flow

## Overview
According to the SUPER_ADMIN_JOURNEY.md, Super Admins follow the standard authentication flow with role-based redirects.

## Current Implementation

Super Admins use the **same login flow as all other users**, with automatic role-based routing after successful authentication.

---

## Complete Login Flow

### Step 1: Access Login Page
- Navigate to `/login`
- System checks if any organizations exist
- If **no organizations exist**: **Automatically redirects to `/onboarding`**

### Step 2: Select Organization
- Choose organization from dropdown
- All existing organizations are displayed
- Organization selection is **required** for login

### Step 3: Enter Credentials
- Email address
- Password
- (Optional) Remember me

### Step 4: Authentication
- **API Call**: `POST /api/v1/auth/login`
- **Request Body**:
  ```json
  {
    "email": "superadmin@example.com",
    "password": "securePassword123",
    "organizationId": "org123"
  }
  ```

### Step 5: Role-Based Redirect
After successful authentication, system automatically redirects based on user role:

| Role | Redirects To |
|------|-------------|
| **SUPER_ADMIN** | `/super-admin` |
| **ADMIN** | `/admin` |
| **INSTRUCTOR** | `/instructor` |
| **STUDENT** | `/dashboard` |

### Step 6: Access Super Admin Dashboard
- View system-wide statistics
- Manage organizations
- Monitor global health
- Access all platform features

---

## First-Time Setup (If No Organizations Exist)

### Option 1: Via Onboarding Page
1. Visit `/login` → See "No organizations found" message
2. Click "Create your first organization"
3. Fill in organization details on `/onboarding`
4. Submit → Organization created
5. **Important**: First user must be created via backend API or database seeding
6. Then login with created credentials

### Option 2: Via Backend API
1. Create organization via API:
   ```bash
   curl -X POST https://lms-backend-k5t6.onrender.com/api/v1/organizations \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Your Organization",
       "slug": "your-org",
       "domain": "yourdomain.com",
       "description": "Organization description"
     }'
   ```

2. Create first Super Admin user (via backend/database)

3. Login with credentials

---

## Key Points

✅ **Super Admins belong to an organization** - They are organization members with elevated privileges

✅ **Same login flow** - No special Super Admin login page

✅ **Automatic routing** - Role-based redirect after login

✅ **Multi-organization support** - Super Admins can belong to multiple orgs

✅ **Cross-org access** - Super Admin dashboard shows data from all organizations

---

## API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/organizations` | GET | List organizations for login dropdown |
| `/api/v1/auth/login` | POST | Authenticate user |
| `/api/v1/auth/refresh` | POST | Refresh access token |
| `/api/v1/organizations` | POST | Create first organization |

---

## Security Features

- **JWT Tokens**: Access token (15 min) + Refresh token (30 days)
- **Automatic Token Refresh**: Handled by interceptors
- **Organization Scoping**: All operations scoped to user's organization
- **Role-Based Access**: Routes protected by role guards
- **Token Storage**: Secure localStorage management

---

## Current Flow Issues & Solutions

### Issue 1: First User Creation
**Problem**: Public registration typically creates STUDENT role, not SUPER_ADMIN

**Solution**: First Super Admin must be created via:
- Backend API admin endpoint
- Database seeding script
- Or backend admin panel

### Issue 2: Organization Creation without User
**Problem**: `/onboarding` creates org but no user account

**Current Workaround**: Alert message guides user to create account via backend

**Future Enhancement**: Could create first Super Admin user during onboarding

---

## Example Walkthrough

1. **Initial State**: No organizations exist
2. Visit `/login` → See message with link
3. Click link → Go to `/onboarding`
4. Create organization "Acme University"
5. Alert shown: "Create first user via backend"
6. Create Super Admin user via backend API
7. Return to `/login`
8. Select "Acme University"
9. Enter email/password
10. Click "Login"
11. Redirected to `/super-admin` dashboard
12. Access all Super Admin features

---

## Related Files

- **Login Form**: `src/components/login-form.tsx`
- **Auth Context**: `src/contexts/AuthContext.tsx`
- **API Client**: `src/lib/api.ts`
- **Super Admin Layout**: `src/app/super-admin/layout.tsx`
- **Super Admin Dashboard**: `src/app/super-admin/page.tsx`
- **Onboarding**: `src/app/onboarding/page.tsx`

---

_This flow is implemented and matches the architecture described in SUPER_ADMIN_JOURNEY.md and FLOW_README.md_

