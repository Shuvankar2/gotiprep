# GotiPrep — Open Source License Selection & Analysis Guide

> **Internal Reference**: This document provides a detailed breakdown of open source licenses and the strategic rationale for selecting the **MIT License** for GotiPrep.

---

## ⚖️ Open Source License Comparison Matrix

| License | Type | Commercial Use | Modification | Distribution | Patent Rights | Copyleft Enforcement |
|---|---|---|---|---|---|---|
| **MIT** | Permissive | ✅ Yes | ✅ Yes | ✅ Yes | Neutral | ❌ No (Permissive) |
| **Apache 2.0** | Permissive | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Explicit | ❌ No |
| **GPL v3** | Strong Copyleft | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Explicit | ⚠️ Mandatory (Derivatives must be GPL) |
| **BSD 3-Clause** | Permissive | ✅ Yes | ✅ Yes | ✅ Yes | Neutral | ❌ No |

---

## 💡 Why the MIT License is Recommended for GotiPrep

### 1. Minimal Friction & Maximum Community Adoption
The **MIT License** is the gold standard for modern Web development (React, Vite, Vue, Next.js are all MIT licensed). It allows developers and students to clone, modify, host, and contribute without legal complexity.

### 2. Commercial & Academic Freedom
- Allows educational institutions, coaching institutes, or individuals to host local instances of GotiPrep without royalty concerns.
- Protects the project maintainers from liability (`PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND`).

### 3. Simplicity
- Fits in a single short text file (`LICENSE`).
- No complex patent grant clauses or strict derivative distribution requirements.

---

## 📜 Selected License Text Summary

The root repository contains the official `LICENSE` file granting rights under MIT to all code in `website/` and root configurations.
