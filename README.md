# CSIA x UnitDEVCON // Cyber Security Community & Wargames Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Vanilla-HTML5%20%7C%20CSS3%20%7C%20JS-84ff00.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20%280%29-00e5ff.svg)](#architecture)
[![Cybersecurity Not Gatekept](https://img.shields.io/badge/Ethos-Cybersecurity%20Not%20Gatekept-ff2a51.svg)](#mission)

> A grassroots alliance between **CSIA** (Cybersecurity Intelligence Alliance of Holy Angel University) and **UnitDEVCON** (collaborative initiative of **DEVCON** and **UNIT2000**) in Angeles City, Pampanga, Philippines.  
> **Mission:** 100% free hands-on workshops, active defense clinics, and CTF wargames — *cybersecurity skills are not gatekept.*

---

## 🚀 Live Hosting on GitHub Pages (Quick Start)

This project is built purely with **Vanilla Web Standards (HTML5, CSS3, JavaScript)** with zero build steps, zero node_modules, and zero compilation required. It is ready for instant hosting on **GitHub Pages**:

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "feat: initial commit of CSIA x UnitDEVCON platform"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Open your repository on GitHub.
2. Go to **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, choose **Deploy from a branch**.
4. Set **Branch** to `main` and folder to `/ (root)`.
5. Click **Save**.
6. Your site will be live in ~30 seconds at:  
   `https://<YOUR-USERNAME>.github.io/<YOUR-REPO-NAME>/`

---

## ⚡ Core Features

- **🌐 Interactive 3D Pixel Globe Canvas**: Real-time rendering of rotating cyber threat nodes and defense hubs with smooth mouse/touch rotation controls.
- **🛡️ 5-View Tactical Command Deck**:
  - `HUD DECK`: Interactive hero command center with active defense status, direct CTF wargame links, and core pillar briefings.
  - `DUAL DEVICE`: Interactive smartphone and tablet device frames previewing real-time dispatches and official community social links.
  - `SKILLS MATRIX`: Dedicated technical track breakdown covering Offensive Security, Cyber Risk Governance, Purple Teaming, and AppSec.
  - `EVENT GALLERY`: Full dispatch logs of live operations with category filters (`All`, `CSIA HAU`, `UnitDEVCON`, `Convergence`) and high-res lightbox modals.
  - `THE ALLIANCE`: Featured leadership showcase honoring the founders and heads behind CSIA, UNIT2000, and UnitDEVCON.
- **💻 Interactive Cyber Terminal (`CSIA_BASH`)**:
  - Accessible via the **TERMINAL [~]** button or by pressing the `` ` `` / `~` key anywhere.
  - Supports commands: `help`, `whoami`, `codename <alias>`, `unitdevcon`, `workshops`, `ctf`, `skills`, `gallery`, `wall`, `nodes`, `scan`, `audio`, `banner`, `clear`.
  - Implements the official **CSIA Cyberfox Codename Protocol** with regex validation (`/^[a-z]{3,10}$/`) per Article III Section 5 of the CSIA Constitution.
- **🔊 8-Bit Web Audio Synthesizer**: Pure Web Audio API procedural sound engine with click, keypress, success, alert, and laser sounds (no external audio files required, toggleable ON/OFF).
- **📢 Live Community Marquee Ticker**: Continuous seamless footer ticker dispatching free seminars, hands-on workshops, and upcoming meetup announcements with pause-on-hover.
- **📱 Mobile-First Responsive Design**:
  - Two-tier sticky mobile header with horizontal view-mode carousel.
  - Touch-friendly 44px+ tap targets.
  - Optimized layouts for desktop, tablet, and mobile (down to 320px).

---

## 📂 Repository File Tree

```
├── index.html            # Main semantic HTML structure & viewports
├── style.css             # Cyberpunk design system, HUD styling, responsive media queries
├── app.js                # Globe engine, terminal, sound synthesizer, and view routing
├── assets/
│   ├── avatars/          # Tactical ? reticle avatars for alliance leaders
│   │   ├── person_csia.svg
│   │   ├── person_devcon.svg
│   │   └── person_unit2000.svg
│   └── events/           # Dispatch imagery for workshops and seminars
│       ├── ctf_bootcamp_zero.jpg
│       ├── kali_linux_workshop.jpg
│       ├── convergence_1.svg
│       ├── convergence_2.svg
│       ├── convergence_3.svg
│       └── zeroday_cafe.svg
├── research/             # Organizational research dossiers & bylaws summary
│   ├── csia_research.md
│   └── unitdevcon_research.md
├── .gitignore            # Git exclusion for OS files, IDE tools, and secrets
├── SECURITY.md           # Security policy and OWASP audit summary
├── LICENSE               # MIT Open Source License
└── README.md             # Project documentation
```

---

## 🔒 Security Hardening

This platform has been audited against the **OWASP Top 10** standards:
1. **DOM XSS Sanitization**: User inputs entered via the terminal console are sanitized via an `escapeHTML()` entity encoder before rendering to the DOM.
2. **Reverse Tabnabbing Protection**: All outbound links targeting social platforms enforce `rel="noopener noreferrer"` and `target="_blank"`.
3. **No External CDN Vulnerabilities**: All logic and styles reside in local files. Zero runtime npm packages or untrusted third-party scripts.
4. **Content Security**: Security meta headers (`X-Content-Type-Options: nosniff`, `referrer: strict-origin-when-cross-origin`) are embedded directly in the document head.

---

## 💻 Local Development

No build tools or Node.js installations are necessary. To run locally:

### Option A: Python Built-in Server
```bash
python3 -m http.server 8080
```
Then visit `http://localhost:8080` in your web browser.

### Option B: Direct Browser Open
Simply double-click `index.html` to open it in Chrome, Safari, Firefox, or Edge.

---

## 🤝 Community & Attribution

- **CSIA (Cybersecurity Intelligence Alliance)**: School of Computing (SoC), Holy Angel University, Angeles City, Pampanga.
  - Facebook: [https://www.facebook.com/csia.hausoc](https://www.facebook.com/csia.hausoc)
  - Instagram: [https://www.instagram.com/csia.hausoc/](https://www.instagram.com/csia.hausoc/)
- **UnitDEVCON**: Joint initiative by **DEVCON** and **UNIT2000**.
  - DEVCON Pampanga: [https://www.facebook.com/devconpampanga](https://www.facebook.com/devconpampanga)
  - UNIT2000: [https://www.facebook.com/profile.php?id=61587485291140](https://www.facebook.com/profile.php?id=61587485291140)

---

## 📄 License

Distributed under the [MIT License](LICENSE).
