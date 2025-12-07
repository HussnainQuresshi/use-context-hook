# npm Security Migration Summary

**Migration Date:** December 7, 2025  
**Package:** use-context-hook v2.0.5  
**Compliance:** npm September 2025 Security Requirements

---

## 🎯 Changes Implemented

### 1. GitHub Actions Workflow (`.github/workflows/publish.yml`)
**NEW FILE** - Automated publishing with modern security

**Key Features:**
- ✅ **Trusted Publishing (OIDC)** - Uses GitHub's OIDC token provider, no long-lived secrets needed
- ✅ **Provenance attestation** - Adds `--provenance` flag for supply chain transparency
- ✅ **Minimal permissions** - Only `id-token: write` and `contents: read`
- ✅ **Tag-based triggers** - Publishes on version tags (e.g., `v2.0.6`)
- ✅ **Full CI pipeline** - Runs type check, tests, build before publishing

**How it works:**
```yaml
permissions:
  contents: read
  id-token: write  # Required for OIDC

- uses: actions/setup-node@v4
  with:
    registry-url: 'https://registry.npmjs.org'

- run: npm publish --provenance --access public
```

### 2. Security Documentation (SECURITY.md)
**NEW FILE** - Complete publishing and security guidelines

**Contents:**
- Explanation of npm's security changes (classic token sunset, granular tokens, OIDC)
- Step-by-step Trusted Publishing setup instructions
- Local publishing guidelines using short-lived granular tokens
- Security checklist for maintainers
- WebAuthn/passkeys migration guide

### 3. Configuration Template (.npmrc.example)
**NEW FILE** - Safe configuration template

**Purpose:**
- Provides example configuration without exposing secrets
- Documents proper authentication methods
- Includes security warnings about token management

### 4. Enhanced .gitignore
**UPDATED** - Comprehensive secret protection

**Added:**
- `.npmrc` - Prevents accidental token commits
- `.env*` - Protects environment variables
- Coverage/log files
- IDE-specific files

### 5. README.md Updates
**UPDATED** - Added publishing & security section

**Changes:**
- New "Publishing & Security" section with badges
- Links to SECURITY.md for detailed instructions
- References npm's September 2025 security announcement

### 6. Security Audit Script (scripts/audit-npm-security.sh)
**NEW FILE** - Automated security verification

**Checks:**
- No hardcoded tokens in codebase
- .gitignore protection configured
- GitHub Actions workflow properly configured
- Documentation completeness
- OIDC and provenance settings

**Usage:** `npm run audit:security`

### 7. Package.json Script
**UPDATED** - Added audit command

```json
"audit:security": "bash scripts/audit-npm-security.sh"
```

---

## 📋 Manual Steps Required (One-Time Setup)

### Step 1: Configure Trusted Publishing on npmjs.com
This eliminates the need for any tokens in GitHub Actions!

1. Go to https://www.npmjs.com/package/use-context-hook/access
2. Click "Configure trusted publishers" under "Publishing access"
3. Add GitHub as a trusted publisher with these details:
   - **Provider:** GitHub
   - **Repository owner:** HussnainQuresshi
   - **Repository name:** use-context-hook
   - **Workflow name:** publish.yml
   - **Environment name:** (leave blank)
4. Save the configuration

**Once configured, GitHub Actions can publish without ANY secrets!**

### Step 2: Migrate to WebAuthn/Passkeys for 2FA
npm is phasing out TOTP in favor of more secure authentication.

1. Go to https://www.npmjs.com/settings/~/tfa
2. If using TOTP (Google Authenticator, etc.):
   - Click "Add security key or passkey"
   - Add at least one hardware key (YubiKey) or passkey (Face ID, Touch ID, Windows Hello)
3. Consider removing TOTP after WebAuthn is working

### Step 3: Clean Up Old Tokens (If Any)
Classic tokens were revoked by npm in November 2025.

1. Go to https://www.npmjs.com/settings/~/tokens
2. Delete any "Classic" tokens (already non-functional)
3. For any old granular tokens:
   - Delete if no longer needed
   - Regenerate with shorter expiration if still needed (max 90 days)

---

## 🚀 How to Publish Now

### Option A: GitHub Actions (Recommended)
This is the secure, automated way:

```bash
# 1. Update version
npm version patch  # or minor, major

# 2. Push with tags
git push && git push --tags

# 3. GitHub Actions automatically:
#    - Runs tests
#    - Builds package
#    - Publishes to npm with provenance
#    - Uses OIDC token (no secrets!)
```

**Status:** Check https://github.com/HussnainQuresshi/use-context-hook/actions

### Option B: Manual Local Publishing (Alternative)
For emergency situations or preference:

```bash
# 1. Generate a short-lived granular token (if needed)
#    → https://www.npmjs.com/settings/~/tokens
#    → Type: Granular Access Token
#    → Expiration: 7-90 days (recommend 7 for one-time use)
#    → Package: use-context-hook
#    → Permission: Read and write

# 2. Authenticate
npm login  # Use granular token when prompted

# 3. Build and publish
npm run build
npm test
npm publish --access public

# 4. Delete token after use (if one-time)
```

---

## 🔒 Security Improvements

### Before (Vulnerable):
- ❌ No CI/CD automation
- ❌ Likely using long-lived or classic tokens
- ❌ No provenance attestation
- ❌ Risk of token leakage
- ❌ Manual publish process prone to errors

### After (Secure):
- ✅ Automated CI/CD with GitHub Actions
- ✅ Trusted Publishing (OIDC) - no long-lived tokens
- ✅ Provenance attestation enabled
- ✅ Comprehensive .gitignore protection
- ✅ Short-lived granular tokens only (if manual)
- ✅ WebAuthn/passkeys recommended
- ✅ Security audit tooling
- ✅ Complete documentation

---

## 🧪 Verification

Run the security audit:
```bash
npm run audit:security
```

Expected output: All ✅ checks passed

---

## 📚 Reference Documents

- **npm Security Announcement:** https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/
- **Trusted Publishers Docs:** https://docs.npmjs.com/trusted-publishers
- **Granular Tokens Docs:** https://docs.npmjs.com/about-access-tokens#granular-access-tokens
- **WebAuthn Setup:** https://docs.npmjs.com/configuring-two-factor-authentication
- **Community Discussion:** https://github.com/orgs/community/discussions/174507

---

## 📝 Migration Timeline

### npm Platform Changes:
- **September 29, 2025:** Security requirements announced
- **Early October 2025:** Token lifetime limits enforced (max 90 days)
- **Mid-November 2025:** Classic tokens revoked and creation disabled
- **Ongoing:** TOTP deprecation in progress

### This Repository:
- **December 7, 2025:** Full migration completed
- **Next steps:** Configure Trusted Publishing on npmjs.com (see Step 1)

---

## ✅ Checklist for Maintainers

- [x] GitHub Actions workflow created (`.github/workflows/publish.yml`)
- [x] Security documentation written (SECURITY.md)
- [x] .npmrc.example template created
- [x] .gitignore updated to protect secrets
- [x] README.md updated with security section
- [x] Security audit script created
- [x] All files committed to repository
- [ ] **Configure Trusted Publishing on npmjs.com** (see Step 1 above)
- [ ] **Enable WebAuthn/passkeys** (see Step 2 above)
- [ ] **Delete old tokens** (see Step 3 above)
- [ ] **Test workflow** by creating a version tag

---

## 🆘 Troubleshooting

### "OIDC token not found" error in GitHub Actions
**Cause:** Trusted Publishing not configured on npmjs.com  
**Fix:** Complete Step 1 (Configure Trusted Publishing)

### "Authentication required" during local publish
**Cause:** No npm authentication configured  
**Fix:** Run `npm login` with a granular token

### "Classic token" error
**Cause:** Trying to use a classic token (revoked by npm)  
**Fix:** Generate a new granular access token at https://www.npmjs.com/settings/~/tokens

---

**Questions?** See SECURITY.md or open an issue on GitHub.
