/**
 * CSIA x UnitDEVCON // Cyber Security Community Engine
 * Components:
 * 1. 3D Procedural Pixel Globe Engine (Canvas-based retro pixel raymarcher)
 * 2. Web Audio API 8-Bit Cyber Synthesizer
 * 3. Interactive Hacker Shell (CSIA_BASH)
 * 4. Multi-View System (Deck, Dual-Device, Matrix)
 * 5. Dynamic Dossiers & Telemetry Stream
 */

// =====================================================================
// 1. WEB AUDIO API 8-BIT CYBER SYNTHESIZER
// =====================================================================
class CyberAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // 8-bit high-frequency chirp for hover
  playHover() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.04);
    
    gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.04);
  }

  // Tactical click / trigger sound
  playClick() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  // Terminal keystroke blip
  playKeystroke() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(520 + Math.random() * 80, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(0.02, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + 0.03);
  }

  // Affirmative 8-bit melody for CTF / Modal / Join
  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.resume();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = this.ctx.currentTime + idx * 0.06;
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, startTime);
      
      gain.gain.setValueAtTime(0.04, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(startTime);
      osc.stop(startTime + 0.12);
    });
  }
}

const audio = new CyberAudio();

// =====================================================================
// 2. 3D PROCEDURAL PIXEL GLOBE ENGINE
// =====================================================================
/**
 * Renders an authentic 8-bit / 16-bit rotating pixel earth sphere with:
 * - Pixel quantization (block-based rasterization)
 * - Continuous 3D rotation & interactive mouse drag
 * - Continents & ocean dithering
 * - Glowing atmosphere halo
 * - Pulsing defense nodes & telemetry laser arcs
 */
class PixelGlobe {
  constructor(canvasId, options = {}) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.pixelSize = options.pixelSize || 6; // Size of each retro pixel block
    this.radius = options.radius || 240;
    this.autoRotateSpeed = options.autoRotateSpeed || 0.008;
    
    // Euler angles
    this.rotX = 0.25;
    this.rotY = 0;
    
    // Drag interaction
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.velocity = 0;
    
    // Global Defense Nodes (Latitude, Longitude in radians, Label)
    this.nodes = [
      { lat: 0.264, lon: 2.10, name: "Node Angeles City // CSIA (HAU) x UNITDEVCON HQ", status: "ONLINE" },
      { lat: 0.62, lon: 2.44, name: "Node Tokyo // PACIFIC-SENTINEL", status: "GUARDING" },
      { lat: 0.65, lon: -2.15, name: "Node San Francisco // SILICON-VAULT", status: "MONITORING" },
      { lat: 0.90, lon: -0.12, name: "Node London // THAMES-OPS", status: "ENCRYPTED" },
      { lat: 0.91, lon: 0.23, name: "Node Frankfurt // EUR-HUB", status: "ACTIVE" },
      { lat: 0.05, lon: 1.81, name: "Node Singapore // EQUATOR-GATEWAY", status: "ARMED" }
    ];

    this.activeArcTime = 0;
    this.setupEvents();
    this.animate();
  }

  setupEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      audio.playClick();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      
      this.rotY += dx * 0.006;
      this.rotX -= dy * 0.006;
      this.rotX = Math.max(-1.2, Math.min(1.2, this.rotX));
      
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.velocity = dx * 0.006;
      
      // Update top coordinates in HUD
      const coordEl = document.getElementById('nodeCoords');
      if (coordEl) {
        const latDeg = (this.rotX * (180 / Math.PI)).toFixed(2);
        const lonDeg = (this.rotY * (180 / Math.PI) % 360).toFixed(2);
        coordEl.innerText = `ROT-LAT ${latDeg}° // ROT-LON ${lonDeg}°`;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Touch support for mobile / tablet frames
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!this.isDragging || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - this.lastMouseX;
      const dy = e.touches[0].clientY - this.lastMouseY;
      this.rotY += dx * 0.006;
      this.rotX -= dy * 0.006;
      this.lastMouseX = e.touches[0].clientX;
      this.lastMouseY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.isDragging = false;
    });
  }

  /**
   * Procedural Earth landmass sampling using periodic trigonometric harmonics
   * Produces authentic continental clusters (Eurasia, Americas, Africa, Australia)
   */
  sampleLand(lat, lon) {
    const s1 = Math.sin(lat * 3) * Math.cos(lon * 2);
    const s2 = Math.cos(lat * 5 + 1.2) * Math.sin(lon * 4);
    const s3 = Math.sin(lat * 8) * Math.cos(lon * 7) * 0.4;
    const s4 = Math.cos(lat * 2 - lon * 3) * 0.5;
    const value = s1 * 0.45 + s2 * 0.35 + s3 * 0.1 + s4 * 0.2;
    return value > 0.08;
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    
    if (!this.isDragging) {
      this.rotY += this.autoRotateSpeed;
      if (Math.abs(this.velocity) > 0.0001) {
        this.rotY += this.velocity;
        this.velocity *= 0.92;
      }
    }
    
    this.activeArcTime += 0.02;
    this.render();
  }

  render() {
    const { width, height } = this.canvas;
    const cx = width / 2;
    const cy = height / 2;
    const R = this.radius;
    const P = this.pixelSize;
    
    this.ctx.clearRect(0, 0, width, height);

    // 1. Pixel Art Atmosphere Glow (Tactical Threat Red Aura)
    const gradient = this.ctx.createRadialGradient(cx, cy, R * 0.7, cx, cy, R * 1.15);
    gradient.addColorStop(0, 'rgba(255, 42, 81, 0.16)');
    gradient.addColorStop(0.85, 'rgba(255, 51, 68, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, R * 1.15, 0, Math.PI * 2);
    this.ctx.fill();

    // 2. Scan Sphere Pixels
    const steps = Math.floor(R / P);
    
    for (let py = -steps; py <= steps; py++) {
      const y = py * P;
      const xRange = Math.sqrt(Math.max(0, R * R - y * y));
      const xSteps = Math.floor(xRange / P);

      for (let px = -xSteps; px <= xSteps; px++) {
        const x = px * P;
        const dSq = x * x + y * y;
        if (dSq > R * R) continue;

        const z = Math.sqrt(R * R - dSq);

        // Normalize sphere normal
        const nx = x / R;
        const ny = y / R;
        const nz = z / R;

        // Apply 3D Rotation (Pitch X, Yaw Y)
        // Rotate around X
        const cosX = Math.cos(this.rotX);
        const sinX = Math.sin(this.rotX);
        const y1 = ny * cosX - nz * sinX;
        const z1 = ny * sinX + nz * cosX;

        // Rotate around Y
        const cosY = Math.cos(this.rotY);
        const sinY = Math.sin(this.rotY);
        const x2 = nx * cosY + z1 * sinY;
        const z2 = -nx * sinY + z1 * cosY;

        // Convert rotated vector to spherical coords (lat, lon)
        const lat = Math.asin(Math.max(-1, Math.min(1, y1)));
        const lon = Math.atan2(x2, z2);

        // Sample Terrain
        const isLand = this.sampleLand(lat, lon);

        // Pixel Shading & Lighting (Directional light from top-left)
        const light = Math.max(0.15, (nx * -0.5 - ny * 0.4 + nz * 0.8));
        const edgeDither = (z / R); // Rim shading

        let r, g, b;
        if (isLand) {
          // Cyber Continent Green / Emerald
          r = Math.floor(20 + 40 * light);
          g = Math.floor(180 * light + 45 * edgeDither);
          b = Math.floor(60 + 60 * light);
        } else {
          // Cyber Threat Red / Crimson Wargame Oceans (Replaces Blue)
          r = Math.floor(140 * light + 80 * edgeDither + 35);
          g = Math.floor(14 * light + 12 * edgeDither);
          b = Math.floor(28 * light + 22 * edgeDither);
        }

        // Draw retro pixel block
        this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        this.ctx.fillRect(cx + x - P / 2, cy + y - P / 2, P - 0.5, P - 0.5);
      }
    }

    // 3. Render Cyber Defense Nodes & Arcs
    const projectedNodes = [];
    
    this.nodes.forEach((node) => {
      // Node position on unit sphere
      const nx = Math.cos(node.lat) * Math.sin(node.lon);
      const ny = Math.sin(node.lat);
      const nz = Math.cos(node.lat) * Math.cos(node.lon);

      // Rotate around Y
      const cosY = Math.cos(-this.rotY);
      const sinY = Math.sin(-this.rotY);
      const x1 = nx * cosY - nz * sinY;
      const z1 = nx * sinY + nz * cosY;

      // Rotate around X
      const cosX = Math.cos(-this.rotX);
      const sinX = Math.sin(-this.rotX);
      const y2 = ny * cosX - z1 * sinX;
      const z2 = ny * sinX + z1 * cosX;

      // If on visible hemisphere (facing front)
      if (z2 > 0.05) {
        const scrX = cx + x1 * R;
        const scrY = cy - y2 * R;
        projectedNodes.push({ x: scrX, y: scrY, name: node.name, status: node.status });

        // Draw pulsing beacon
        const pulse = (Math.sin(this.activeArcTime * 4) + 1) * 3;
        const isHQ = node.name.includes('Angeles');
        this.ctx.fillStyle = isHQ ? '#84ff00' : '#ff2a51';
        this.ctx.fillRect(scrX - 3, scrY - 3, 6, 6);

        this.ctx.strokeStyle = isHQ ? 'rgba(132, 255, 0, 0.6)' : 'rgba(255, 42, 81, 0.7)';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(scrX - 4 - pulse / 2, scrY - 4 - pulse / 2, 8 + pulse, 8 + pulse);
      }
    });

    // 4. Render Telemetry Cyber Arcs between visible nodes
    if (projectedNodes.length >= 2) {
      for (let i = 0; i < projectedNodes.length - 1; i++) {
        const nA = projectedNodes[i];
        const nB = projectedNodes[i + 1];

        this.ctx.beginPath();
        this.ctx.moveTo(nA.x, nA.y);
        const midX = (nA.x + nB.x) / 2 + (Math.sin(this.activeArcTime + i) * 20);
        const midY = (nA.y + nB.y) / 2 - 25;
        this.ctx.quadraticCurveTo(midX, midY, nB.x, nB.y);
        this.ctx.strokeStyle = 'rgba(255, 51, 68, 0.6)';
        this.ctx.setLineDash([4, 4]);
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
        this.ctx.setLineDash([]);

        // Animated packet bullet
        const t = (this.activeArcTime * 0.8 + i * 0.3) % 1;
        const packetX = (1 - t) * (1 - t) * nA.x + 2 * (1 - t) * t * midX + t * t * nB.x;
        const packetY = (1 - t) * (1 - t) * nA.y + 2 * (1 - t) * t * midY + t * t * nB.y;

        this.ctx.fillStyle = '#ffffff';
        this.ctx.fillRect(packetX - 2, packetY - 2, 4, 4);
      }
    }
  }
}

// =====================================================================
// 3. INTERACTIVE TERMINAL SHELL (CSIA_BASH)
// =====================================================================
// HTML sanitization helper to prevent DOM XSS
function escapeHTML(str) {
  if (typeof str !== 'string') return '';
  return str.replace(/[&<>'"]/g, tag => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[tag] || tag));
}

class CyberTerminal {
  constructor() {
    this.drawer = document.getElementById('terminalDrawer');
    this.output = document.getElementById('terminalOutput');
    this.input = document.getElementById('terminalInput');
    this.toggleBtn = document.getElementById('terminalToggleBtn');
    this.closeBtn = document.getElementById('termCloseBtn');
    this.isOpen = false;

    this.history = [];
    this.historyIdx = -1;

    this.setupEvents();
  }

  setupEvents() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        audio.playKeystroke();

        if (e.key === 'Enter') {
          const val = this.input.value.trim();
          if (val) {
            this.execute(val);
            this.history.push(val);
            this.historyIdx = this.history.length;
            this.input.value = '';
          }
        } else if (e.key === 'ArrowUp') {
          if (this.historyIdx > 0) {
            this.historyIdx--;
            this.input.value = this.history[this.historyIdx] || '';
          }
        } else if (e.key === 'ArrowDown') {
          if (this.historyIdx < this.history.length - 1) {
            this.historyIdx++;
            this.input.value = this.history[this.historyIdx] || '';
          } else {
            this.historyIdx = this.history.length;
            this.input.value = '';
          }
        }
      });
    }

    // Hotkey: press '~' or '`' to toggle terminal
    window.addEventListener('keydown', (e) => {
      if ((e.key === '`' || e.key === '~') && document.activeElement !== this.input) {
        e.preventDefault();
        this.toggle();
      }
    });
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.drawer.classList.add('open');
    this.drawer.setAttribute('aria-hidden', 'false');
    setTimeout(() => this.input.focus(), 150);
    audio.playClick();
  }

  close() {
    this.isOpen = false;
    this.drawer.classList.remove('open');
    this.drawer.setAttribute('aria-hidden', 'true');
    audio.playClick();
  }

  printLine(text, className = '') {
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerHTML = text;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  execute(rawCmd) {
    this.printLine(`<span class="term-prompt">csia@unitdevcon:~$</span> <span class="term-user-input">${escapeHTML(rawCmd)}</span>`);
    const cmd = rawCmd.toLowerCase().trim();
    const args = cmd.split(' ');

    switch (args[0]) {
      case 'help':
        this.printLine('----------------------------------------------------', 'term-res-info');
        this.printLine('AVAILABLE COMMANDS:', 'term-res-success');
        this.printLine('  <span class="term-cmd">help</span>            - Display this command dossier', '');
        this.printLine('  <span class="term-cmd">whoami</span>          - Reveal active operator identity & CTF clearance flag', '');
        this.printLine('  <span class="term-cmd">codename &lt;alias&gt;</span> - Register your Cyberfox Codename (CSIA Protocol)', '');
        this.printLine('  <span class="term-cmd">unitdevcon</span>      - Inspect UnitDEVCON background (DEVCON x UNIT2000)', '');
        this.printLine('  <span class="term-cmd">workshops</span>       - List 100% free cybersecurity workshops', '');
        this.printLine('  <span class="term-cmd">join</span>            - Register for CSIA x UnitDEVCON Discord & CTF', '');
        this.printLine('  <span class="term-cmd">ctf</span>             - Show active wargames, flags, and schedule', '');
        this.printLine('  <span class="term-cmd">skills</span>          - Switch to the Cybersecurity Skill Matrix', '');
        this.printLine('  <span class="term-cmd">gallery</span>         - View past events & workshop photo intel', '');
        this.printLine('  <span class="term-cmd">wall</span>            - Inspect Community Wall & CTF Hall of Fame', '');
        this.printLine('  <span class="term-cmd">nodes</span>           - Display live defense nodes & telemetry status', '');
        this.printLine('  <span class="term-cmd">scan</span>            - Run simulated cyberspace vulnerability audit', '');
        this.printLine('  <span class="term-cmd">audio</span>           - Toggle 8-bit synthesizer audio ON/OFF', '');
        this.printLine('  <span class="term-cmd">banner</span>          - Print retro ASCII insignia', '');
        this.printLine('  <span class="term-cmd">clear</span>           - Clear terminal screen', '');
        this.printLine('----------------------------------------------------', 'term-res-info');
        audio.playClick();
        break;

      case 'whoami':
      case 'who':
        this.printLine('UNITCSIA{TECHORIZON2026}', 'term-res-success');
        audio.playSuccess();
        break;

      case 'codename':
        const alias = args[1];
        if (!alias) {
          const current = localStorage.getItem('csia_codename');
          if (current) {
            this.printLine(`[*] ACTIVE CODENAME: <span class="text-neon">@${escapeHTML(current)}</span> (Verified Cyberfox)`, 'term-res-info');
          } else {
            this.printLine('[!] Usage: codename &lt;alias&gt; (e.g. codename cipher)', 'term-res-warn');
            this.printLine('    Per CSIA Article III Sec 5: 3-10 lowercase chars, single word, no numbers only.', '');
          }
          return;
        }

        // Validate per CSIA Constitution Article III Section 5
        if (!/^[a-z]{3,10}$/.test(alias)) {
          this.printLine(`[X] INVALID CODENAME: "${escapeHTML(alias)}"`, 'term-res-err');
          this.printLine('    Must be 3-10 characters, all lowercase letters, single word.', 'term-res-warn');
          audio.playClick();
          return;
        }

        localStorage.setItem('csia_codename', alias);
        this.printLine(`[+] AUTHENTICATION GRANTED: Cyberfox @${escapeHTML(alias)}`, 'term-res-success');
        this.printLine(`[+] Registered under Holy Angel University CSIA Registry. Operational anonymity armed.`, 'term-res-info');
        audio.playSuccess();
        break;

      case 'unitdevcon':
        this.printLine('=== UNITDEVCON // COMMUNITY OVERVIEW ===', 'term-res-success');
        this.printLine('Founding: Joint collaborative initiative by DEVCON & UNIT2000.', 'term-res-info');
        this.printLine('Headquarters: Angeles City, Pampanga, Philippines.', 'term-res-info');
        this.printLine('Ethos: <span class="text-neon">"CYBERSECURITY NOT GATEKEPT"</span>', 'term-res-success');
        this.printLine('Mission: Free hands-on workshops, interactive security clinics, and CTF wargames with zero paywalls.', '');
        audio.playClick();
        break;

      case 'workshops':
      case 'events':
        this.printLine('=== UPCOMING FREE WORKSHOPS // ANGELES CITY ===', 'term-res-success');
        this.printLine('&lt;STAYTUNE&gt; - FREE', 'term-res-info');
        audio.playClick();
        break;

      case 'join':
      case 'devcon':
      case 'discord':
        this.printLine('[+] INITIALIZING REGISTRATION HANDSHAKE...', 'term-res-success');
        this.printLine('[+] DEVCON PAMPANGA FB: https://www.facebook.com/devconpampanga', 'term-res-info');
        this.printLine('[+] CSIA FB: https://www.facebook.com/csia.hausoc', 'term-res-info');
        this.printLine('[+] ASSIGNED ROLE: Trainee Defender [Level 1]', 'term-res-success');
        audio.playSuccess();
        window.open('https://www.facebook.com/devconpampanga', '_blank', 'noopener,noreferrer');
        break;

      case 'ctf':
      case 'wargames':
        this.printLine('=== CSIA x UNITDEVCON WARGAMES ARENA ===', 'term-res-success');
        this.printLine('Current Active Challenge: <span class="text-neon">Heap Spray & Double-Free [Pwn 300]</span>', '');
        this.printLine('Current 1st Place: Team 0xBadF00d (2,450 pts)', 'term-res-info');
        this.printLine('Flag Format: CSIA{...}', 'term-res-warn');
        this.printLine('Next Arena Open: Saturday 14:00 UTC (Free for all students & devs)', 'term-res-info');
        audio.playClick();
        break;

      case 'skills':
      case 'matrix':
      case 'curriculum':
        this.printLine('[+] Switching viewport to SKILLS MATRIX...', 'term-res-success');
        switchView('matrix');
        this.close();
        audio.playSuccess();
        break;

      case 'gallery':
      case 'photos':
        this.printLine('[+] Switching viewport to EVENT GALLERY & DISPATCHES...', 'term-res-success');
        switchView('gallery');
        this.close();
        audio.playSuccess();
        break;

      case 'wall':
      case 'halloffame':
      case 'champions':
        this.printLine('[+] Switching viewport to COMMUNITY WALL & HALL OF FAME...', 'term-res-success');
        switchView('halloffame');
        this.close();
        audio.playSuccess();
        break;

      case 'nodes':
        this.printLine('ACTIVE DEFENSE HUBS:', 'term-res-success');
        this.printLine('  ▪ Angeles City HQ   [LAT 15.1450°N] - ONLINE (100.0%) [CSIA x UNITDEVCON]', 'term-res-success');
        this.printLine('  ▪ Tokyo Sentinel    [LAT 35.6762°N] - ONLINE (100.0%)', '');
        this.printLine('  ▪ San Francisco     [LAT 37.7749°N] - ACTIVE (99.95%)', '');
        this.printLine('  ▪ Frankfurt Mesh    [LAT 50.1109°N] - ACTIVE (99.99%)', '');
        this.printLine('  ▪ Singapore Gateway [LAT 1.3521°N]  - ARMED (100.0%)', '');
        audio.playClick();
        break;

      case 'scan':
        this.printLine('[*] RUNNING SHODAN / NMAP RECONNAISSANCE SCAN...', 'term-res-warn');
        setTimeout(() => {
          this.printLine('[+] Port 443/TCP: TLS 1.3 Strict Mode Verified', 'term-res-success');
          this.printLine('[+] Port 22/TCP: ED25519 Key Auth Only', 'term-res-success');
          this.printLine('[+] 0 Vulnerabilities Detected in Perimeter. Defenses Solid.', 'term-res-info');
          audio.playSuccess();
        }, 600);
        break;

      case 'audio':
        const state = audio.toggle();
        this.printLine(`[!] Audio synthesizer set to: ${state ? 'ENABLED' : 'MUTED'}`, 'term-res-info');
        updateAudioButtonUI(state);
        break;

      case 'banner':
        this.printLine(`
   ______ _____ _____ ___          _   _ _   _ ___ _____ _____  _______     _______ _____  _   _ 
  / _____/ ____|_   _/ _ \\        | | | | \\ | |_ _|_   _|  __ \\| ____\\ \\   / / ____/ _ \\| \\ | |
 | |    | (___   | || /_\\ |  __  | | | |  \\| || |  | | | |  | | |__   \\ \\_/ / |   | | | |  \\| |
 | |     \\___ \\  | ||  _  | |__| | | | | . \` || |  | | | |  | |  __|   \\   /| |   | | | | . \` |
 | |____ ____) |_| || | | |      | |_| | |\\  || |  | | | |__| | |___    | | | |___| |_| | |\\  |
  \\_____|_____/|___\\_| |_/       \\___/|_| \\_|___| |_| |_____/|_____|   |_|  \\_____\\___/|_| \\_|
`, 'term-res-success');
        break;

      case 'clear':
        this.output.innerHTML = '';
        break;

      default:
        this.printLine(`Command not found: "${escapeHTML(cmd)}". Type <span class="term-cmd">help</span> for assistance.`, 'term-res-err');
        break;
    }
  }
}

// =====================================================================
// 4. MULTI-VIEW CONTROLLER & INTERACTIVE CARDS
// =====================================================================
const views = {
  deck: document.getElementById('commandDeckSection'),
  dual: document.getElementById('dualDeviceSection'),
  matrix: document.getElementById('skillsMatrixSection'),
  gallery: document.getElementById('eventGallerySection'),
  halloffame: document.getElementById('communityWallSection')
};

const modeButtons = document.querySelectorAll('.mode-btn');

function switchView(targetViewKey) {
  Object.keys(views).forEach((key) => {
    if (views[key]) {
      if (key === targetViewKey) {
        views[key].classList.add('active');
      } else {
        views[key].classList.remove('active');
      }
    }
  });

  modeButtons.forEach((btn) => {
    if (btn.dataset.view === targetViewKey) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  audio.playClick();
}

modeButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    switchView(btn.dataset.view);
  });
});

// Sound Toggle Button Handler
const soundToggleBtn = document.getElementById('soundToggleBtn');
function updateAudioButtonUI(enabled) {
  const icon = document.getElementById('soundIcon');
  const text = document.getElementById('soundText');
  if (icon && text) {
    icon.innerText = enabled ? '🔊' : '🔇';
    text.innerText = enabled ? 'AUDIO: ON' : 'AUDIO: MUTED';
  }
}

if (soundToggleBtn) {
  soundToggleBtn.addEventListener('click', () => {
    const enabled = audio.toggle();
    updateAudioButtonUI(enabled);
    if (enabled) audio.playClick();
  });
}

// =====================================================================
// 5. DOSSIER MODAL & SYLLABUS DATA
// =====================================================================
const dossierData = {
  'red-team': {
    title: 'OFFENSIVE & DEFENSIVE LABS // ZERO GATEKEEPING',
    badge: '100% FREE LABS',
    content: `
      <p><strong>Powered by UNIT2000 & CSIA:</strong> Hands-on cybersecurity drills designed to break the corporate barrier. No gatekeeping, no expensive paywalls — open to all students and local developers.</p>
      <br>
      <h4>Core Operational Drills:</h4>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li><strong>Adversary Emulation:</strong> Real-world offensive tradecraft, lateral movement, and privilege escalation.</li>
        <li><strong>Binary Analysis & Memory Safety:</strong> Disassembly with Ghidra, buffer overflow exploitation, and heap inspection.</li>
        <li><strong>Web & Cloud Defense:</strong> Exploiting and securing modern API endpoints, OAuth configurations, and container environments.</li>
        <li><strong>Purple Teaming:</strong> Seamlessly pairing offensive exploitation with defensive SIEM detection and event analysis.</li>
      </ul>
      <p><strong>Access:</strong> 100% Free for the community in Angeles City, Pampanga.</p>
    `
  },
  'governance': {
    title: 'OUR CORE BELIEFS // CYBERSECURITY NOT GATEKEPT',
    badge: 'WHAT WE BELIEVE',
    btnText: 'JOIN THIS WORKSHOP',
    confirmUrl: 'https://www.facebook.com/devconpampanga',
    content: `
      <p><strong>Democratizing Information Security:</strong> At CSIA x UnitDEVCON, we believe cybersecurity should never be locked behind expensive certifications or elitist paywalls. Knowledge is a public good, and every aspiring defender deserves access.</p>
      <br>
      <h4>What We Believe:</h4>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li><strong>Cybersecurity Not Gatekept:</strong> Security knowledge belongs to everyone. We break down financial, institutional, and corporate barriers so anyone with curiosity can learn to defend.</li>
        <li><strong>100% Free & Hands-On First:</strong> True mastery is forged through real terminal labs, CTF wargames, and practical attack/defense drills — never behind course fees or paywalls.</li>
        <li><strong>Ethical White-Hat Integrity:</strong> Inspired by the Cyberfox legacy, we believe in using offensive and defensive tradecraft strictly to protect systems, user privacy, and society.</li>
        <li><strong>Grassroots Community Synergy:</strong> Uniting student defenders (Holy Angel University), software engineers (DEVCON), and security operators (UNIT2000) so no one defends alone.</li>
      </ul>
      <p>Workshops are free.</p>
    `
  },
  'analytics': {
    title: 'CONVERGENCE WORKSHOP SERIES // ANGELES CITY',
    badge: 'DEVCON x UNIT2000',
    btnText: 'JOIN THIS WORKSHOP',
    confirmUrl: 'https://www.facebook.com/devconpampanga',
    content: `
      <p><strong>The Convergence Gathering:</strong> Regular in-person and hybrid technical meetups hosted right in Angeles City, Pampanga.</p>
      <br>
      <h4>What Happens at Convergence:</h4>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li><strong>Live Defense Demos:</strong> Watch senior security engineers dissect live attack vectors and implement real-time remediations.</li>
        <li><strong>Purple Teaming Labs:</strong> Hands-on capture-the-flag exercises where attendees defend simulated enterprise infrastructure.</li>
        <li><strong>Hands-On Security Workshops:</strong> Interactive masterclasses teaching developers and students how to build secure apps, spot vulnerabilities, and write exploit-resistant code.</li>
        <li><strong>Mentorship Circles:</strong> Direct 1-on-1 networking with cybersecurity practitioners from Central Luzon and nationwide.</li>
      </ul>
    `
  },
  'sentinel': {
    title: 'CYBERFOX CODENAME REGISTRY // CSIA PROTOCOL',
    badge: 'HAU CSIA',
    content: `
      <p><strong>Holy Angel University CSIA Tradition:</strong> Per Article III, Section 5 of the CSIA Constitution, every member operates under an ethical hacker persona known as a <strong>Codename</strong>.</p>
      <br>
      <h4>Codename Standards (Article III Sec 5):</h4>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li><strong>Format:</strong> 3 to 10 characters, single word, lowercase letters only (e.g., <code>cipher</code>, <code>phantom</code>, <code>zeroday</code>).</li>
        <li><strong>Ethical Persona:</strong> Simulates operational anonymity and professional privacy for white-hat competition.</li>
        <li><strong>Terminal Integration:</strong> You can set your own codename right now in our terminal using <code>codename &lt;alias&gt;</code>!</li>
      </ul>
      <p><strong>Mascot Symbolism:</strong> The White-Hatted Fox symbolizes vigilance, tactical wisdom, and unwavering adherence to ethical cybersecurity.</p>
    `
  },
  'offensive': {
    title: 'SYLLABUS: RED TEAM & OFFENSIVE OPS',
    badge: 'TRACK 01',
    content: `
      <p>A comprehensive 12-week immersive curriculum covering modern adversary tradecraft.</p>
      <br>
      <h4>Week-by-Week Breakdown:</h4>
      <ol style="padding-left: 20px; margin: 10px 0;">
        <li>Weeks 1-3: Modern C/C++ Assembly, Stack Frames, Shellcoding & GDB</li>
        <li>Weeks 4-6: Advanced Web Security (GraphQL, Deserialization, OAuth Flaws)</li>
        <li>Weeks 7-9: Windows Internals, PE Format, Syscalls, Token Impersonation</li>
        <li>Weeks 10-12: Full Attack Simulation, Cobalt Strike Beaconing & Final CTF</li>
      </ol>
    `
  },
  'defensive': {
    title: 'SYLLABUS: BLUE TEAM & SIEM DEFENSE',
    badge: 'TRACK 02',
    content: `
      <p>Master enterprise defense, enterprise triage, SIEM telemetry, and forensic analysis.</p>
      <br>
      <h4>Week-by-Week Breakdown:</h4>
      <ol style="padding-left: 20px; margin: 10px 0;">
        <li>Weeks 1-3: Network Packets with Wireshark, Zeek, and Suricata IDS</li>
        <li>Weeks 4-6: Splunk & ELK SIEM Querying, Detection Engineering</li>
        <li>Weeks 7-9: Windows Event Logs, Sysmon, and Memory Dump Triage (Volatility)</li>
        <li>Weeks 10-12: Incident Response Playbooks, Ransomware Remediation & Tabletop Drills</li>
      </ol>
    `
  },
  'malware': {
    title: 'SYLLABUS: REVERSE ENGINEERING & MALWARE',
    badge: 'TRACK 03',
    content: `
      <p>Disassemble real-world binaries and dissect malicious payloads in safe sandboxed environments.</p>
      <br>
      <h4>Week-by-Week Breakdown:</h4>
      <ol style="padding-left: 20px; margin: 10px 0;">
        <li>Weeks 1-3: Static Analysis with Ghidra & x64dbg</li>
        <li>Weeks 4-6: Dynamic Triage, API Monitoring, and Behavioral Sandboxing</li>
        <li>Weeks 7-9: Defeating Anti-Analysis, Packing, and Crypters</li>
        <li>Weeks 10-12: Ransomware Decryption Analysis and Zero-Day Root Cause Discovery</li>
      </ol>
    `
  },
  'wargames': {
    title: 'SYLLABUS: CTF WARGAMES & SPEEDRUNNING',
    badge: 'TRACK 04',
    content: `
      <p>Sharpen your reflexes and cryptographic problem solving through competitive wargames.</p>
      <br>
      <h4>Categories Trained:</h4>
      <ul style="padding-left: 20px; margin: 10px 0;">
        <li><strong>Cryptography:</strong> RSA attacks, AES CBC bit-flipping, Elliptic Curves.</li>
        <li><strong>Binary Exploitation (Pwn):</strong> Format string exploits, ROP, GOT overwrite.</li>
        <li><strong>Forensics & Steganography:</strong> PCAP analysis, disk images, hidden data extraction.</li>
        <li><strong>Speedrunning Drills:</strong> Fast flag discovery under tournament time pressure.</li>
      </ul>
    `
  }
};

const modal = document.getElementById('cyberModal');
const modalTitle = document.getElementById('modalTitle');
const modalBody = document.getElementById('modalBody');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const modalConfirmBtnText = document.getElementById('modalConfirmBtnText');

let activeModalKey = null;

function openModal(key) {
  const data = dossierData[key];
  if (!data) return;

  activeModalKey = key;
  modalTitle.innerText = data.title;
  modalBody.innerHTML = data.content;
  if (modalConfirmBtnText) {
    modalConfirmBtnText.innerText = data.btnText || 'JOIN THIS WORKSHOP';
  }
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  audio.playSuccess();
}

function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  audio.playClick();
}

if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
if (modalConfirmBtn) {
  modalConfirmBtn.addEventListener('click', () => {
    closeModal();
    const targetUrl = (activeModalKey && dossierData[activeModalKey]?.confirmUrl)
      || 'https://www.facebook.com/devconpampanga';
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  });
}

// Attach click events to tactical cards
document.querySelectorAll('.tactical-hud-card').forEach((card) => {
  card.addEventListener('mouseenter', () => audio.playHover());
  card.addEventListener('click', () => {
    const skillKey = card.dataset.skill;
    if (skillKey) openModal(skillKey);
  });
});

window.openTrackDetails = function(trackKey) {
  openModal(trackKey);
};

// Curriculum button in hero
const launchLabBtn = document.getElementById('launchLabBtn');
if (launchLabBtn) {
  launchLabBtn.addEventListener('click', () => switchView('matrix'));
}

// Hero "FOLLOW OUR SOCIALS" Button
const followSocialsBtn = document.getElementById('joinDiscordBtn');
if (followSocialsBtn) {
  followSocialsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    audio.playSuccess();
    switchView('dual');
    const target = document.getElementById('dualDeviceSection');
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
}

// Cyber Toast HUD Notification
function showCyberToast(html) {
  let toast = document.getElementById('cyberToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'cyberToastNotification';
    toast.className = 'cyber-hud-toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = html;
  toast.classList.add('visible');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('visible');
  }, 4500);
}

const enterCtfBtn = document.getElementById('enterCtfBtn');
if (enterCtfBtn) {
  enterCtfBtn.addEventListener('mouseenter', () => audio.playHover());
  enterCtfBtn.addEventListener('click', () => {
    audio.playSuccess();
    const sshTarget = 'ssh level0@192.168.100.52 -p 2222';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(sshTarget).catch(() => {});
    }
    showCyberToast(`
      <div style="display:flex;align-items:center;gap:10px;">
        <span style="font-size:18px;">⚡</span>
        <div>
          <div style="color:var(--neon-green);font-weight:700;font-family:var(--font-pixel);font-size:10px;letter-spacing:0.5px;">LAUNCHING TERMINAL PROTOCOL</div>
          <div style="font-size:11px;color:#ffffff;font-family:var(--font-mono);margin-top:2px;">ssh://level0@192.168.100.52:2222</div>
          <div style="font-size:10px;color:var(--text-muted);font-family:var(--font-mono);margin-top:2px;">[✓] Command also copied to clipboard!</div>
        </div>
      </div>
    `);
  });
}

// Attach audio synthesis to all social links across the UI
document.querySelectorAll('.social-pill-btn, .btn-phone-social, .btn-tablet-social').forEach((btn) => {
  btn.addEventListener('mouseenter', () => audio.playHover());
  btn.addEventListener('click', () => audio.playSuccess());
});

// Live Member Counter & UTC Clocks
function updateClocks() {
  const now = new Date();
  const timeString = now.toTimeString().split(' ')[0] + ' UTC';
  
  const tickerClock = document.getElementById('liveTickerClock');
  const tabletClock = document.getElementById('tabletClock');
  
  if (tickerClock) tickerClock.innerText = timeString;
  if (tabletClock) tabletClock.innerText = timeString;
}
setInterval(updateClocks, 1000);
updateClocks();

// =====================================================================
// 7. EVENT GALLERY DATA & LIGHTBOX CONTROLLER
// (You can easily add new events and photos by adding items to this list!)
// =====================================================================
const eventGalleryData = [
  {
    id: 'csia-ctf-bootcamp',
    org: 'HAU CSIA',
    category: 'csia',
    title: 'CTF B00TC4MP: L3VEL Z3R0',
    date: 'Official HAU CSIA Event',
    location: 'Holy Angel University, Angeles City',
    status: 'COMPLETED',
    attendees: 'Cyberfox Cadets',
    link: 'https://www.facebook.com/share/p/19gi4BGDVe/',
    recap: 'Specialized capture-the-flag intensive training for university defenders. Covered foundational jeopardy challenges, crypto mechanics, forensics triage, and ethical exploitation frameworks.',
    photos: [
      {
        url: 'assets/events/ctf_bootcamp_zero.jpg',
        caption: 'CTF B00TC4MP: L3VEL Z3R0 Live Session // CSIA.STUDIO',
        tag: 'LIVE TRAINING'
      }
    ]
  },
  {
    id: 'csia-kali-workshop',
    org: 'HAU CSIA',
    category: 'csia',
    title: 'KALI LINUX TUTORIAL & HANDS-ON WORKSHOP',
    date: 'Official HAU CSIA Event',
    location: 'Holy Angel University, Angeles City',
    status: 'COMPLETED',
    attendees: 'Cyberfox Students',
    link: 'https://www.facebook.com/share/p/18GAXxenam/',
    recap: 'Hands-on Linux CLI and offensive tooling clinic. Students built sandbox environments, mastered core Debian/Kali utilities, and explored network discovery and vulnerability scanning fundamentals.',
    photos: [
      {
        url: 'assets/events/kali_linux_workshop.jpg',
        caption: 'Kali Linux Workshop & Environment Setup',
        tag: 'HANDS-ON WORKSHOP'
      }
    ]
  },
  {
    id: 'convergence-3',
    org: 'DEVCON x UNIT2000',
    category: 'unitdevcon',
    subCategory: 'convergence',
    title: 'Convergence III: From Policy to People: The Governance and Human Side of Cyber Risk',
    date: 'Convergence Series',
    location: 'Angeles City, Pampanga',
    status: 'COMPLETED',
    attendees: 'Developers & IT Leaders',
    link: 'https://www.facebook.com/share/p/1BRbMeb28g/',
    recap: 'Comprehensive session examining cyber risk governance, Philippine data privacy compliance, human factors in social engineering, and actionable defensive frameworks for tech enterprises.',
    photos: [
      {
        url: 'assets/events/convergence_3.jpg',
        caption: 'Convergence III: From Policy to People Official Dispatch',
        tag: 'CONVERGENCE III'
      }
    ]
  },
  {
    id: 'convergence-2',
    org: 'DEVCON x UNIT2000',
    category: 'unitdevcon',
    subCategory: 'convergence',
    title: 'Convergence II: Operation Deep Dive',
    date: 'Convergence Series',
    location: 'Angeles City, Pampanga',
    status: 'COMPLETED',
    attendees: 'Security Practitioners',
    link: 'https://www.facebook.com/share/p/19ieP9Ncpp/',
    recap: 'Advanced technical deep dive into offensive workflows, adversary emulation, live defense mechanics, and threat modeling for developers and security analysts.',
    photos: [
      {
        url: 'assets/events/convergence_2.jpg',
        caption: 'Convergence II: Operation Deep Dive Technical Briefing',
        tag: 'CONVERGENCE II'
      }
    ]
  },
  {
    id: 'convergence-1',
    org: 'DEVCON x UNIT2000',
    category: 'unitdevcon',
    subCategory: 'convergence',
    title: 'Convergence I: Inside the Mind of a Penetration Tester',
    date: 'Convergence Series',
    location: 'Angeles City, Pampanga',
    status: 'COMPLETED',
    attendees: 'Developers & White-Hats',
    link: 'https://www.facebook.com/share/p/1HGsgx5RKp/',
    recap: 'The kickoff gathering of the Convergence series. Senior practitioners unveiled the attacker mindset, common application security oversights, and practical remediation methods.',
    photos: [
      {
        url: 'assets/events/convergence_1.jpg',
        caption: 'Convergence I: Inside the Mind of a Penetration Tester',
        tag: 'CONVERGENCE I'
      }
    ]
  },
  {
    id: 'zero-day-cafe',
    org: 'DEVCON x UNIT2000',
    category: 'unitdevcon',
    subCategory: 'zeroday',
    title: 'ZERO DAY CAFE',
    date: 'Community Mixer',
    location: 'Angeles City, Pampanga',
    status: 'COMPLETED',
    attendees: 'Builders & Hackers',
    link: 'https://www.facebook.com/share/p/1bnzW6DE6S/',
    recap: 'Informal cyber cafe and meetup in Angeles City. Tech enthusiasts and security researchers gathered over coffee for open discussions on zero-days, bug hunting, and community projects.',
    photos: [
      {
        url: 'assets/events/zeroday_cafe.jpg',
        caption: 'Zero Day Cafe: Informal Cyber Meetup & Tech Exchange',
        tag: 'ZERO DAY CAFE'
      }
    ]
  }
];

// =====================================================================
// 8. COMMUNITY WALL / HALL OF FAME DATA
// =====================================================================
const communityWallData = {
  champions: [
    { rank: '🥇', team: 'Team 0xBadF00d', score: '2,450 PTS', meta: 'DEVCON Cyber Brawl 2026 Champions // 1st Place' },
    { rank: '🥈', team: 'Team KernelPanic', score: '2,180 PTS', meta: 'Reverse Engineering Speedrun Masters // 2nd Place' },
    { rank: '🥉', team: 'Team WhiteHatFoxes', score: '1,940 PTS', meta: 'HAU SoC Flag Hunters // 3rd Place' },
    { rank: '🎖️', team: 'Team ByteBandits', score: '1,620 PTS', meta: 'Web Exploitation & OAuth Pwners // Top 4' }
  ],
  mentors: [
    {
      name: 'Rairolf Rabang',
      title: 'President of CSIA',
      org: 'CSIA',
      badgeClass: 'csia',
      avatar: 'assets/avatars/person_csia.svg',
      bio: 'Leading the Holy Angel University Cybersecurity student body, championing ethical hacking labs, CTF workshops, and zero-gatekeeping cybersecurity education.'
    },
    {
      name: 'Carl Henson',
      title: 'Founder of UNIT2000',
      org: 'UNIT2000',
      badgeClass: 'unit2000',
      avatar: 'assets/avatars/person_unit2000.svg',
      bio: 'Pioneering active defense wargames, red/purple team operations, and adversary emulation clinics for technical builders across Central Luzon.'
    },
    {
      name: 'Alexandra Sofia Flores',
      title: 'One of Heads of UNITDEVCON',
      org: 'UNITDEVCON',
      badgeClass: 'devcon',
      avatar: 'assets/avatars/person_devcon.svg',
      bio: 'Spearheading developer security culture, Convergence community workshops, and open technology collaboration throughout the region.'
    }
  ],
  honors: [
    { codename: '@cipher_fox', role: 'CTF Challenge Architect', dept: 'HAU BS Cybersecurity' },
    { codename: '@net_sentinel', role: 'Network Defense Lead', dept: 'HAU NetAd Track' },
    { codename: '@shadow_audit', role: 'Web Security Specialist', dept: 'HAU WebDev Track' },
    { codename: '@byte_guardian', role: 'Study Jam Coordinator', dept: 'HAU CS Track' }
  ],
  transmissions: [
    { text: '"The hands-on purple teaming session in Angeles City taught me more about real-world incident response in one afternoon than months of reading theory. Zero gatekeeping."', author: 'Defensive Trainee, Convergence Attendee' },
    { text: '"Having industry engineers from DEVCON sit down with university students to dissect exploit payloads without charging tuition is what tech communities should always be about."', author: 'HAU Cybersecurity Junior' },
    { text: '"CTF Cyber Brawl pushed our team to solve memory vulnerabilities under real clock pressure. Best wargame in Central Luzon."', author: 'Captain, Team 0xBadF00d' }
  ]
};

// =====================================================================
// 9. LIGHTBOX CONTROLLER
// =====================================================================
let currentPhotoAlbum = [];
let currentPhotoIndex = 0;
let currentLightboxTitle = '';

window.openLightbox = function(album, index, eventTitle) {
  currentPhotoAlbum = album;
  currentPhotoIndex = index;
  currentLightboxTitle = eventTitle;

  const lightbox = document.getElementById('photoLightbox');
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const titleEl = document.getElementById('lightboxEventTitle');
  const tagEl = document.getElementById('lightboxTag');

  if (!lightbox || !imgEl || !album[index]) return;

  const photo = album[index];
  imgEl.src = photo.url;
  if (captionEl) captionEl.innerText = `${photo.caption} [${index + 1}/${album.length}]`;
  if (titleEl) titleEl.innerText = eventTitle;
  if (tagEl) tagEl.innerText = photo.tag || 'EVENT INTEL';

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  audio.playSuccess();
};

function closeLightbox() {
  const lightbox = document.getElementById('photoLightbox');
  if (lightbox) {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  audio.playClick();
}

function nextLightboxPhoto() {
  if (currentPhotoAlbum.length === 0) return;
  currentPhotoIndex = (currentPhotoIndex + 1) % currentPhotoAlbum.length;
  updateLightboxContent();
}

function prevLightboxPhoto() {
  if (currentPhotoAlbum.length === 0) return;
  currentPhotoIndex = (currentPhotoIndex - 1 + currentPhotoAlbum.length) % currentPhotoAlbum.length;
  updateLightboxContent();
}

function updateLightboxContent() {
  const photo = currentPhotoAlbum[currentPhotoIndex];
  if (!photo) return;
  const imgEl = document.getElementById('lightboxImg');
  const captionEl = document.getElementById('lightboxCaption');
  const tagEl = document.getElementById('lightboxTag');
  if (imgEl) imgEl.src = photo.url;
  if (captionEl) captionEl.innerText = `${photo.caption} [${currentPhotoIndex + 1}/${currentPhotoAlbum.length}]`;
  if (tagEl) tagEl.innerText = photo.tag || 'EVENT INTEL';
  audio.playClick();
}

// Lightbox Event Listeners
const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
const lightboxBackdrop = document.getElementById('lightboxBackdrop');
const lightboxPrevBtn = document.getElementById('lightboxPrevBtn');
const lightboxNextBtn = document.getElementById('lightboxNextBtn');

if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', prevLightboxPhoto);
if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', nextLightboxPhoto);

document.addEventListener('keydown', (e) => {
  const lightbox = document.getElementById('photoLightbox');
  if (lightbox && lightbox.classList.contains('open')) {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') prevLightboxPhoto();
    if (e.key === 'ArrowRight') nextLightboxPhoto();
  }
});

window.openEventPhoto = function(eventId, idx) {
  const ev = eventGalleryData.find(e => e.id === eventId);
  if (!ev || !ev.photos) return;
  openLightbox(ev.photos, idx, ev.title);
};

// =====================================================================
// 10. RENDERING FUNCTIONS FOR GALLERY & COMMUNITY WALL
// =====================================================================
function renderEventGallery(filter = 'all') {
  const container = document.getElementById('eventsContainer');
  if (!container) return;

  const filtered = filter === 'all' 
    ? eventGalleryData 
    : eventGalleryData.filter(e => e.category === filter || e.subCategory === filter);

  if (filtered.length === 0) {
    container.innerHTML = `<div class="event-dispatch-card" style="text-align:center;color:var(--text-muted);padding:30px;">[!] No events found under this operational filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(ev => {
    const isCsia = ev.category === 'csia';
    const badgeClass = isCsia ? 'event-org-badge csia' : 'event-org-badge';
    const photo = ev.photos && ev.photos.length > 0 ? ev.photos[0] : null;

    const photoHtml = photo ? `
      <div class="event-featured-image-frame ${isCsia ? 'csia' : ''}" onclick="openEventPhoto('${ev.id}', 0)">
        <span class="photo-overlay-tag">${photo.tag || 'EVENT INTEL'}</span>
        <img src="${photo.url}" alt="${photo.caption}" loading="lazy" onerror="this.src='assets/events/convergence_1.svg'">
        <div class="photo-caption-bar">
          <span class="caption-text">${photo.caption}</span>
          <span class="zoom-hint">🔍 CLICK TO EXPAND INTEL</span>
        </div>
      </div>
    ` : '';

    return `
      <article class="event-dispatch-card ${isCsia ? 'csia-card' : ''}">
        <div class="event-card-header">
          <div class="event-meta-cluster">
            <span class="${badgeClass}">${ev.org}</span>
            <span class="event-date-tag">📅 ${ev.date}</span>
            <span class="event-loc-tag">📍 ${ev.location}</span>
          </div>
          <span class="event-attendee-pill">👥 ${ev.attendees}</span>
        </div>

        <h3 class="event-dispatch-title">${ev.title}</h3>
        <p class="event-dispatch-recap">${ev.recap}</p>

        ${photoHtml}

        <div class="event-dispatch-footer">
          ${ev.link ? `
            <a href="${ev.link}" target="_blank" rel="noopener noreferrer" class="btn-event-redirect-post ${isCsia ? 'csia' : ''}">
              <span class="btn-pulse-dot"></span>
              <span class="btn-label">VIEW OFFICIAL EVENT POST ON FACEBOOK ↗</span>
            </a>
          ` : ''}
          <button type="button" class="btn-event-zoom-trigger" onclick="openEventPhoto('${ev.id}', 0)">
            🔍 ENLARGE IMAGE
          </button>
        </div>
      </article>
    `;
  }).join('');
}

function renderCommunityWall() {
  const leadersEl = document.getElementById('mentorsList');
  if (leadersEl && communityWallData.mentors) {
    leadersEl.innerHTML = communityWallData.mentors.map(m => `
      <div class="alliance-leader-card ${m.badgeClass || ''}">
        <div class="leader-avatar-frame">
          <img src="${m.avatar}" alt="${m.name}" class="leader-avatar-img" onerror="this.src='assets/avatars/person_csia.svg'">
          <span class="leader-org-badge ${m.badgeClass || ''}">${m.org}</span>
        </div>
        <div class="leader-card-body">
          <h3 class="leader-name">${m.name}</h3>
          <div class="leader-role-tag ${m.badgeClass || ''}">${m.title}</div>
          <p class="leader-bio">${m.bio}</p>
        </div>
        <div class="leader-card-footer">
          <span class="leader-status-dot"></span>
          <span class="leader-status-text">OFFICIAL LEADERSHIP</span>
        </div>
      </div>
    `).join('');
  }
}

// Gallery Filter Tab Buttons
const galleryFilterBtns = document.querySelectorAll('.gallery-filter-btn');
galleryFilterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    galleryFilterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderEventGallery(btn.dataset.filter);
    audio.playClick();
  });
});

// =====================================================================
// 11. INITIALIZATION
// =====================================================================
window.addEventListener('DOMContentLoaded', () => {
  // Initialize main 3D Pixel Globe
  const mainGlobe = new PixelGlobe('pixelGlobeCanvas', {
    pixelSize: 6,
    radius: 235,
    autoRotateSpeed: 0.007
  });

  // Initialize tablet mini pixel globe
  const tabletGlobe = new PixelGlobe('tabletGlobeCanvas', {
    pixelSize: 4,
    radius: 120,
    autoRotateSpeed: 0.012
  });

  // Initialize terminal
  const terminal = new CyberTerminal();

  // Render Event Gallery and Community Wall
  renderEventGallery('all');
  renderCommunityWall();

  console.log("%c[CSIA x UnitDEVCON]%c Initialized Cyber Engine with Event Gallery & Community Wall.", "color:#84ff00;font-weight:bold", "color:#ff2a51");
});
