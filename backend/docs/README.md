# Backend Documentation

This directory contains technical documentation for the FeelGPT backend.

## Available Documents

### [MEMORY_STORAGE_ISSUE.md](./MEMORY_STORAGE_ISSUE.md)
**Critical Issue Documentation**

Comprehensive analysis of memory management concerns related to profile picture storage in the backend. This document covers:

- Current implementation using `multer.memoryStorage()`
- Technical issues and security concerns
- Performance implications and scalability problems
- Detailed recommendations for fixing the issue
- Implementation roadmap and migration plan
- Testing strategies and monitoring guidelines

**Status:** ⚠️ HIGH PRIORITY - Needs immediate attention

**Key Findings:**
- Current 50MB in-memory storage is not production-ready
- Risk of server crashes under concurrent upload load
- Security vulnerabilities (DoS potential)
- Scalability bottlenecks

**Recommended Actions:**
1. Immediate: Switch to disk-based storage
2. Short-term: Migrate to cloud storage (AWS S3)
3. Add image optimization pipeline
4. Implement proper security measures

---

## Contributing

When adding new documentation:

1. Create a new `.md` file in this directory
2. Use clear, descriptive filenames (e.g., `FEATURE_NAME_ISSUE.md`)
3. Add an entry to this README
4. Include the following sections in your document:
   - Executive Summary
   - Problem Description
   - Technical Analysis
   - Recommendations
   - Implementation Plan

## Issue Templates

For creating GitHub issues related to backend concerns, see the issue templates in `.github/ISSUE_TEMPLATE/`.

---

## Quick Links

- [Main README](../../README.md)
- [Backend Package.json](../package.json)
- [Prisma Schema](../prisma/schema.prisma)
- [GitHub Issues](https://github.com/AntonioMisic77/FeelGPT/issues)

---

*Last Updated: 2025-11-07*
