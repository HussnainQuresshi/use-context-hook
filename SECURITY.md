# Security Policy

## npm Publishing Security - Updated December 2025

This project has been updated to comply with [npm's new security requirements](https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/) announced September 29, 2025.

### Key Changes

 **Classic npm tokens are NO LONGER USED** - All classic tokens were sunset by npm in November 2025  
 **GitHub Actions uses Trusted Publishers (OIDC)** - No long-lived tokens in CI/CD  
 **Local publishing requires short-lived granular tokens** - Maximum 90-day expiration  
 **WebAuthn/Passkeys recommended** - TOTP being phased out  

---

## Publishing Methods

### 🤖 Automated Publishing via GitHub Actions (Recommended)

**Status:** Workflow created at `.github/workflows/publish.yml`

This project uses **npm Trusted Publishing (OIDC)** for secure, token-free publishing from GitHub Actions.

#### How it works:
1. Push a version tag (e.g., `v2.0.6`)
2. GitHub Actions automatically builds, tests, and publishes
3. No manual token management required
4. Includes provenance attestation for supply chain security

#### Required one-time setup on npmjs.com:

1. **Enable Trusted Publishing:**
   - Go to https://www.npmjs.com/package/use-context-hook/access
   - Under "Publishing access", click "Configure trusted publishers"
   - Add GitHub as a trusted publisher:
     - **Provider:** GitHub
     - **Repository owner:** HussnainQuresshi
     - **Repository name:** use-context-hook
     - **Workflow name:** publish.yml
     - **Environment name:** (leave blank)

2. **Enable 2FA with WebAuthn/Passkeys:**
   - Go to https://www.npmjs.com/settings/~/tfa
   - If using TOTP, migrate to WebAuthn/passkeys
   - Add at least one hardware key or passkey

#### To publish a new version:
```bash
# Update version in package.json
npm version patch  # or minor, major

# Push the tag
git push && git push --tags

# GitHub Actions handles the rest!
```

---

### [Local] Manual Local Publishing (Alternative)

If you need to publish manually (e.g., from your local machine), follow these guidelines:

#### WARNING: IMPORTANT: Use only short-lived granular tokens

1. **Generate a new granular access token** (NOT classic):
   - Go to https://www.npmjs.com/settings/~/tokens
   - Click "Generate New Token" → "Granular Access Token"
   - **Name:** `use-context-hook-local-publish-[DATE]`
   - **Expiration:** Maximum 90 days (7 days recommended for CI/CD)
   - **Packages and scopes:**
     - Select "Only select packages and scopes"
     - Choose `use-context-hook`
     - Permission: **Read and write**
   - Save the token securely (password manager recommended)

2. **Configure npm authentication:**
   ```bash
   # Login with your granular token
   npm login
   
   # Or set token directly (replace TOKEN with your actual token)
   npm config set //registry.npmjs.org/:_authToken=TOKEN
   ```

3. **Publish:**
   ```bash
   npm run build
   npm test
   npm publish --access public
   ```

4. **Security best practices:**
   -  **NEVER** commit tokens to git
   -  Use a password manager to store tokens
   -  Rotate tokens every 30-90 days
   -  Delete tokens after use if one-time
   -  Enable WebAuthn/passkeys on your npm account

---

## .npmrc Configuration

**DO NOT commit authentication tokens to git!**

If you need a local `.npmrc` file for configuration, create it manually:

```bash
# Example .npmrc (authentication should be done via npm login)
registry=https://registry.npmjs.org/
```

See `.npmrc.example` for a safe template. The actual `.npmrc` file is git-ignored.

---

## Security Checklist for Maintainers

- [ ] Configure Trusted Publishing on npmjs.com (see instructions above)
- [ ] Migrate from TOTP to WebAuthn/passkeys for 2FA
- [ ] Delete any old classic npm tokens (revoked by npm in November 2025)
- [ ] If using granular tokens locally, ensure they expire within 90 days
- [ ] Verify `.npmrc` is in `.gitignore` and never committed
- [ ] Review GitHub Actions workflow permissions are minimal (`id-token: write`, `contents: read`)

---

## Token Security Timeline (npm Platform Changes)

- **September 29, 2025:** Announcement of security changes
- **Early October 2025:** Token lifetime limits took effect (max 90 days)
- **Mid-November 2025:** Classic tokens revoked and disabled
- **Ongoing:** TOTP being phased out in favor of WebAuthn/passkeys

**Reference:** https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/

---

## Reporting Security Issues

If you discover a security vulnerability in this package, please email the maintainer directly rather than opening a public issue.

---

## Additional Resources

- [npm Trusted Publishers Documentation](https://docs.npmjs.com/trusted-publishers)
- [npm Granular Access Tokens](https://docs.npmjs.com/about-access-tokens#granular-access-tokens)
- [Configuring Two-Factor Authentication](https://docs.npmjs.com/configuring-two-factor-authentication)
- [npm Community Discussion on Security Changes](https://github.com/orgs/community/discussions/174507)
