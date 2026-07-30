# GotiPrep — Open-Source Fast-Track Exam Preparation Platform

[![Live App](https://img.shields.io/badge/Live_App-gotiprep.shuvankar.qzz.io-0054fa?style=for-the-badge&logo=vercel)](https://gotiprep.shuvankar.qzz.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-purple)](https://vitejs.dev/)

> **GotiPrep** is an open-source assessment-grade examination preparation platform tailored for Indian competitive exams including **TCS NQT, Banking (IBPS, RBI), SSC (CGL, CHSL), and Government typing tests**.
> 
> 🌐 **Live Web Application**: [https://gotiprep.shuvankar.qzz.io](https://gotiprep.shuvankar.qzz.io)

---

## 🌟 Features

- **Typing Arena**: Real-time WPM, Net/Gross accuracy calculator, tab-switch anti-cheat, 3 test modes (Practice, Exam Simulation, Challenge Mode), and customizable durations.
- **Instagram Achievement Poster**: Dynamic, high-resolution shareable performance card with customizable user name, live domain link (`gotiprep.shuvankar.qzz.io`), and direct download/sharing options.
- **Unseen Passage Practice**: 30-second reading phase + 90-second context writing phase with semantic meaning evaluation, alongside 2-Mark detailed assessment MCQs.
- **Sentence Cloze Practice**: Fill-in-the-blanks grammar, vocabulary, and contextual cloze exercises with instant feedback.
- **Email Drafting**: 9-minute timed exam simulator requiring 100+ words, checklist verification, and split-flap countdown timer.
- **Theme Customization**: Cyberpunk dark mode and accessible light mode (`#F8EEEE` soft rose theme).
- **Responsive Layout**: Mobile-first responsive navigation drawer with smooth backdrop animations.

---

## 📁 Repository Architecture

```text
GotiPrep/
├── website/              # Main React + Vite + TypeScript web application
│   ├── src/
│   │   ├── components/   # Modular React components (Navbar, Footer, AdSlot)
│   │   ├── pages/        # Application routes (TypingPractice, PassagePractice, etc.)
│   │   ├── store/        # Zustand global state management
│   │   └── data/         # Mock data and test passages
│   └── package.json
├── LICENSE               # MIT Open Source License
├── README.md             # Project documentation overview
├── CONTRIBUTING.md       # Open-source contribution guidelines
├── CODE_OF_CONDUCT.md    # Contributor Covenant Code of Conduct
└── SECURITY.md           # Security vulnerability reporting policy
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Shuvankar2/gotiprep.git
   cd GotiPrep/website
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`.

---

## 🤝 Contributing to GotiPrep

We welcome contributions from the community! Whether you want to fix a bug, add new exam passages, optimize performance, or propose new features:

1. Review our [Contributing Guidelines](CONTRIBUTING.md) to understand our workflow.
2. Check out open issues or open a new discussion.
3. Submit a Pull Request following our PR template.

Please adhere to our [Code of Conduct](CODE_OF_CONDUCT.md) in all interactions.

---

## 📄 License

This project is open source under the terms of the [MIT License](LICENSE).
