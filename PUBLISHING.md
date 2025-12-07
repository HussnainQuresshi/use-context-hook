# Quick Reference: Publishing use-context-hook

## [Publishing] Publish via GitHub Actions (Recommended)

```bash
# Update version and create tag
npm version patch        # 2.0.5 → 2.0.6
# or
npm version minor        # 2.0.5 → 2.1.0
# or  
npm version major        # 2.0.5 → 3.0.0

# Push commits and tags
git push && git push --tags

# ✨ GitHub Actions takes over automatically!
# View progress: https://github.com/HussnainQuresshi/use-context-hook/actions
```

**Requirements:**
- [x] Trusted Publishing configured on npmjs.com (see SECURITY.md)

---

## [Local] Manual Publish (Alternative)

```bash
# 1. Get a short-lived token
# Go to: https://www.npmjs.com/settings/~/tokens
# Create: Granular Access Token (7-90 days)
# Scope: use-context-hook (read & write)

# 2. Authenticate
npm login

# 3. Build, test, publish
npm run build
npm test
npm publish --access public
```

---

## [Audit] Security Audit

```bash
npm run audit:security
```

---

## 📋 One-Time Setup Checklist

Still need to do these on npmjs.com?

- [ ] Configure Trusted Publishing → https://www.npmjs.com/package/use-context-hook/access
- [ ] Enable WebAuthn/Passkeys → https://www.npmjs.com/settings/~/tfa
- [ ] Delete old classic tokens → https://www.npmjs.com/settings/~/tokens

---

##  What NOT to Do

-  DON'T use classic tokens (revoked by npm)
-  DON'T commit .npmrc files with tokens
-  DON'T create tokens longer than 90 days
-  DON'T share tokens between projects

---

## [Docs] Full Documentation

- **Complete guide:** SECURITY.md
- **Migration details:** NPM_SECURITY_MIGRATION.md
- **npm changes:** https://github.blog/changelog/2025-09-29-strengthening-npm-security-important-changes-to-authentication-and-token-management/
