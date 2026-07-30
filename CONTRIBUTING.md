# Contributing to GotiPrep

Thank you for your interest in contributing to **GotiPrep**! We welcome contributions from developers, educators, designers, and exam aspirants.

This document outlines the guidelines and procedure for contributing to GotiPrep.

---

## 🛠 How You Can Contribute

- **Report Bugs**: Open an issue detailing steps to reproduce, expected vs actual behavior, and environment details.
- **Propose Features**: Suggest new exam modes, passages, UI improvements, or performance optimizations via GitHub Issues.
- **Submit Pull Requests**: Fix reported bugs, implement new features, or refine documentation.
- **Add Exam Content**: Add high-quality unseen passages, typing passages, cloze test sentences, or email writing prompts tailored for TCS NQT, Banking, or SSC exams.

---

## 🚀 Getting Started

1. **Fork the Repository**: Click the **Fork** button on the top right of the repository page.
2. **Clone your Fork**:
   ```bash
   git clone https://github.com/your-username/GotiPrep.git
   cd GotiPrep/website
   ```
3. **Install Dependencies**:
   ```bash
   npm install
   ```
4. **Create a Feature Branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

---

## 📐 Development & Coding Guidelines

- **TypeScript**: Use strict types. Avoid using `any` unless absolutely necessary.
- **Component Architecture**: Keep components modular, accessible, and self-contained.
- **Design & Styling**: Follow GotiPrep's design tokens in `website/src/index.css`. Support both Dark and Light mode (`#F8EEEE`).
- **State Management**: Use Zustand (`adminStore.ts`) for global state.
- **Verification**: Run `npx tsc --noEmit` before submitting to ensure zero type errors.

---

## 📬 Submitting a Pull Request (PR)

1. Commit your changes with descriptive commit messages:
   ```bash
   git commit -m "feat(typing): add banking exam passage set"
   ```
2. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```
3. Open a Pull Request on the main repository.
4. Fill out the PR description template detailing:
   - What changes were made.
   - Why the change is necessary.
   - Screenshots/video proof of UI changes (if applicable).
5. Ensure continuous integration (CI) checks pass.

---

## 📜 Code of Conduct

All contributors are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md) in all community interactions.
