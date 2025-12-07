# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.6] - 2025-12-07

### Added
- Comprehensive security documentation (SECURITY.md)
- GitHub Actions workflow for automated publishing with Trusted Publishers (OIDC)
- Security audit script (`npm run audit:security`)
- Publishing quick reference guide (PUBLISHING.md)
- Migration documentation for npm security changes (NPM_SECURITY_MIGRATION.md)
- FAQ section in README
- Comparison table with alternative libraries
- Contributing guidelines
- Quick Start section with code examples
- Features & Benefits section with real-world use cases

### Changed
- Migrated to npm Trusted Publishing (OIDC) for secure, token-free publishing
- Enhanced README with SEO-optimized content and structure
- Improved package.json description for better discoverability
- Expanded keywords for better search engine indexing
- Updated .gitignore to protect sensitive files (.npmrc, .env)
- Removed all decorative emojis for professional appearance

### Security
- Implemented provenance attestation for supply chain security
- Configured GitHub Actions with minimal permissions (id-token: write, contents: read)
- Added protection against token leakage with enhanced .gitignore
- Compliant with npm September 2025 security requirements
- Classic tokens no longer supported (npm sunset November 2025)

## [2.0.5] - 2023-06-XX

### Changed
- Updated dependencies to React 18
- TypeScript configuration improvements
- Build process optimizations

## [2.0.0] - 2023-XX-XX

### Added
- TypeScript support with full type definitions
- Multiple selector patterns (string, array, object, function)
- Deep comparison for preventing unnecessary re-renders
- Comprehensive test suite with Jest

### Changed
- Refactored core implementation for better performance
- Improved API consistency
- Enhanced documentation

## [1.x.x] - Previous versions

Earlier versions focused on establishing the core functionality of selective context subscriptions.

---

## Release Notes

### v2.0.6 Highlights

This release focuses on **security, discoverability, and developer experience**:

**Security Improvements:**
- Zero long-lived tokens in CI/CD through Trusted Publishing
- Automated security auditing
- Provenance attestation for package authenticity

**Enhanced Discoverability:**
- Improved SEO with better descriptions and keywords
- Comprehensive documentation structure
- Professional appearance without decorative elements

**Developer Experience:**
- Clear quick start guide
- Detailed comparison with alternatives
- Step-by-step migration guides
- FAQ covering common questions

---

## Migration Guides

### Migrating to v2.0.6

No breaking changes. This release is backward compatible with v2.0.5.

If you maintain this package, see [NPM_SECURITY_MIGRATION.md](NPM_SECURITY_MIGRATION.md) for new publishing workflow documentation.

### Migrating to v2.0.0 from v1.x

See the main README for updated API documentation. The core API remains similar, with enhanced TypeScript support.

---

## Links

- [npm package](https://www.npmjs.com/package/use-context-hook)
- [GitHub repository](https://github.com/HussnainQuresshi/use-context-hook)
- [Issues](https://github.com/HussnainQuresshi/use-context-hook/issues)
- [Security Policy](SECURITY.md)
