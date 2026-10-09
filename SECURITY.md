# Security Policy

## Supported Versions

| Version | Supported          | Status |
| :---    | :---               | :---   |
| 1.0.x   | :white_check_mark: | Production / Active |

---

## Reporting a Vulnerability

The **CSIA (Cybersecurity Intelligence Alliance)** and **UnitDEVCON** communities take security, ethics, and responsible disclosure seriously.

If you discover a security vulnerability, flaw, or data leakage within this repository or associated web endpoints, please report it responsibly:

1. **Do NOT open a public GitHub issue** describing the exploit or vulnerability.
2. Email your findings and reproduction steps to our security team or reach out privately via official channels:
   - **CSIA (Holy Angel University)**: Contact via [Facebook](https://www.facebook.com/csia.hausoc) or student leadership.
   - **DEVCON Pampanga**: Contact via [Facebook](https://www.facebook.com/devconpampanga).
3. Provide:
   - A brief description of the vulnerability.
   - Exact steps or proof-of-concept (PoC) to reproduce the issue.
   - Potential impact and recommended mitigation.
4. We will acknowledge receipt of your disclosure within 48 hours and work with you to remediate the issue promptly.

---

## Security Audit & Architecture Notes

### 1. Cross-Site Scripting (XSS) Prevention
- All user inputs processed through the built-in interactive cyber terminal (`csia@unitdevcon:~$`) are strictly sanitized via `escapeHTML()` before being rendered into the DOM.
- Codename aliases are strictly enforced using regex validation (`/^[a-z]{3,10}$/`) per Article III Section 5 of the CSIA Constitution.

### 2. Reverse Tabnabbing Protection
- All outbound external links targeting Instagram, Facebook, or external portals enforce `rel="noopener noreferrer"` and `target="_blank"`.
- Programmatic window redirects utilize `'noopener,noreferrer'` to prevent `window.opener` context tampering.

### 3. Client-Side Anonymity & Data Minimization
- The application requires zero tracking cookies and zero backend sessions.
- Operational codenames are maintained strictly within the user's local browser sandbox (`localStorage`).
- Zero secret API keys or private tokens are embedded in frontend client scripts.
