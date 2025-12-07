#!/bin/bash
# Security audit script for npm publishing setup
# Verifies compliance with npm's September 2025 security requirements

echo "🔍 npm Security Audit for use-context-hook"
echo "==========================================="
echo ""

# Check for dangerous token patterns
echo "1. Checking for hardcoded tokens..."
if grep -r "_authToken" --include="*.js" --include="*.json" --include="*.yml" --include=".npmrc" . 2>/dev/null | grep -v "node_modules" | grep -v ".git"; then
    echo "   ⚠️  WARNING: Found _authToken references"
else
    echo "   ✅ No hardcoded tokens found"
fi

if grep -r "NPM_TOKEN\|NODE_AUTH_TOKEN" --include="*.js" --include="*.md" --exclude="SECURITY.md" . 2>/dev/null | grep -v "node_modules" | grep -v ".git" | grep -v ".github/workflows"; then
    echo "   ⚠️  WARNING: Found legacy token references"
else
    echo "   ✅ No legacy token references found"
fi

echo ""
echo "2. Checking .gitignore protection..."
if grep -q ".npmrc" .gitignore; then
    echo "   ✅ .npmrc is git-ignored"
else
    echo "   ⚠️  WARNING: .npmrc not in .gitignore"
fi

if grep -q ".env" .gitignore; then
    echo "   ✅ .env files are git-ignored"
else
    echo "   ⚠️  WARNING: .env files not in .gitignore"
fi

echo ""
echo "3. Checking GitHub Actions workflow..."
if [ -f ".github/workflows/publish.yml" ]; then
    echo "   ✅ Publish workflow exists"
    
    if grep -q "id-token: write" .github/workflows/publish.yml; then
        echo "   ✅ OIDC permissions configured"
    else
        echo "   ⚠️  WARNING: Missing id-token: write permission"
    fi
    
    if grep -q "provenance" .github/workflows/publish.yml; then
        echo "   ✅ Provenance attestation enabled"
    else
        echo "   ⚠️  WARNING: Missing --provenance flag"
    fi
else
    echo "   ❌ No publish workflow found"
fi

echo ""
echo "4. Checking documentation..."
if [ -f "SECURITY.md" ]; then
    echo "   ✅ SECURITY.md exists"
else
    echo "   ❌ SECURITY.md missing"
fi

if [ -f ".npmrc.example" ]; then
    echo "   ✅ .npmrc.example exists"
else
    echo "   ⚠️  WARNING: No .npmrc.example template"
fi

echo ""
echo "5. Checking for committed .npmrc..."
if [ -f ".npmrc" ] && ! git check-ignore .npmrc >/dev/null 2>&1; then
    echo "   ⚠️  WARNING: .npmrc exists and is NOT git-ignored!"
elif [ -f ".npmrc" ]; then
    echo "   ⚠️  .npmrc exists locally (but is git-ignored - OK)"
else
    echo "   ✅ No .npmrc file (clean)"
fi

echo ""
echo "==========================================="
echo "📋 Manual Steps Required on npmjs.com:"
echo ""
echo "1. Configure Trusted Publishing:"
echo "   → https://www.npmjs.com/package/use-context-hook/access"
echo "   → Add GitHub (HussnainQuresshi/use-context-hook, publish.yml)"
echo ""
echo "2. Enable WebAuthn/Passkeys:"
echo "   → https://www.npmjs.com/settings/~/tfa"
echo "   → Migrate from TOTP if still using it"
echo ""
echo "3. Delete any classic tokens:"
echo "   → https://www.npmjs.com/settings/~/tokens"
echo "   → Remove all classic tokens (already revoked by npm)"
echo ""
echo "📚 See SECURITY.md for complete instructions"
echo "==========================================="
