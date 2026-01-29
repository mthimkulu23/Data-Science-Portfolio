// --- Clock Functionality ---
function updateClock() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    document.getElementById('clock').textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

// --- Window Management ---
let zIndexCounter = 100;

function openWindow(appId) {
    const win = document.getElementById(`window-${appId}`);
    if (win) {
        win.style.display = 'flex';
        bringToFront(win);
    } else {
        alert("App not implemented yet: " + appId);
    }
}

function closeWindow(appId) {
    const win = document.getElementById(`window-${appId}`);
    if (win) {
        win.style.display = 'none';
        // Reset content if needed, e.g., terminal
    }
}

function minimizeWindow(appId) {
    const win = document.getElementById(`window-${appId}`);
    if (win) {
        win.style.display = 'none';
    }
}

let maximizedStates = {};

function toggleMaximize(appId) {
    const win = document.getElementById(`window-${appId}`);
    if (!win) return;

    bringToFront(win);

    if (maximizedStates[appId]) {
        // Restore
        const state = maximizedStates[appId];
        win.style.top = state.top;
        win.style.left = state.left;
        win.style.width = state.width;
        win.style.height = state.height;
        delete maximizedStates[appId];
    } else {
        // Maximize
        maximizedStates[appId] = {
            top: win.style.top,
            left: win.style.left,
            width: win.style.width,
            height: win.style.height
        };
        win.style.top = '28px'; // Height of top bar
        win.style.left = '0';
        win.style.width = '100%';
        win.style.height = 'calc(100vh - 28px)';
    }
}

function bringToFront(element) {
    zIndexCounter++;
    element.style.zIndex = zIndexCounter;
}

// Global listener for bringing windows to front on click
document.querySelectorAll('.window').forEach(win => {
    win.addEventListener('mousedown', () => {
        bringToFront(win);
    });
});

// --- Draggable Windows ---
let isDragging = false;
let currentWindow = null;
let offset = { x: 0, y: 0 };

function startDrag(e, windowId) {
    isDragging = true;
    currentWindow = document.getElementById(windowId);
    bringToFront(currentWindow);

    // Calculate offset
    const rect = currentWindow.getBoundingClientRect();
    offset.x = e.clientX - rect.left;
    offset.y = e.clientY - rect.top;

    // Prevent text selection during drag
    e.preventDefault();
}

document.addEventListener('mousemove', (e) => {
    if (isDragging && currentWindow) {
        currentWindow.style.left = `${e.clientX - offset.x}px`;
        currentWindow.style.top = `${e.clientY - offset.y}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    currentWindow = null;
});

// --- Terminal Logic ---
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

// Initial Welcome Message
const welcomeMessage = `
Hi, my name is <b>Thabang Mthimkulu</b>.
<br>
I'm a <b>Data Scientist</b> & <b>Cybersecurity Practitioner</b>.
<br>
I am passionate about leveraging data for insights and securing systems. I also enjoy Full Stack Development.
<br><br>
`;
terminalOutput.innerHTML = welcomeMessage;

terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = terminalInput.value.trim();
        processCommand(command);
        terminalInput.value = '';
    }
});

function getPromptHTML() {
    return `<span class="prompt-user">kali</span><span class="prompt-at">@</span><span class="prompt-host">kali</span><span class="prompt-colon">:</span><span class="prompt-path">~</span><span class="prompt-dollar">$</span>`;
}

function processCommand(cmd) {
    // Echo the command
    const cmdLine = document.createElement('div');
    cmdLine.innerHTML = `${getPromptHTML()} <span style="color: white;">${cmd}</span>`;
    terminalOutput.appendChild(cmdLine);

    const lowerCmd = cmd.toLowerCase();

    switch (lowerCmd) {
        case 'help':
            addToTerminalHTML(`
            <div class="cmd-help-table">
                <div class="cmd-row"><span class="cmd-cell-cmd">about</span><span class="cmd-cell-desc">- about Thabang Mthimkulu</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">clear</span><span class="cmd-cell-desc">- clear the terminal</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">echo</span><span class="cmd-cell-desc">- print out anything</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">education</span><span class="cmd-cell-desc">- my education background</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">experience</span><span class="cmd-cell-desc">- my work history</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">email</span><span class="cmd-cell-desc">- send me an email</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">resume</span><span class="cmd-cell-desc">- open my resume</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">help</span><span class="cmd-cell-desc">- check available commands</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">projects</span><span class="cmd-cell-desc">- view projects I've coded</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">socials</span><span class="cmd-cell-desc">- check out my social accounts</span></div>
                <div class="cmd-row"><span class="cmd-cell-cmd">whoami</span><span class="cmd-cell-desc">- about current user</span></div>
            </div>
            `);
            break;
        case 'about':
        case 'whoami':
            addToTerminal("Thabang Mthimkulu - Data Scientist | Full Stack Developer | Cybersecurity Practitioner");
            break;
        case 'socials':
            addToTerminal("GitHub: github.com/mthimkulu23\nLinkedIn: linkedin.com/in/thabang-mthimkulu-b27316241");
            openLinkedin();
            openGithub();
            break;
        case 'resume':
            openWindow('resume');
            addToTerminal("Opening Resume...");
            break;
        case 'projects':
            openWindow('projects');
            addToTerminal("Opening Projects Explorer...");
            break;
        case 'clear':
            terminalOutput.innerHTML = '';
            break;
        case 'education': // Alias for cat education.txt
        case 'cat education.txt':
            addToTerminal(`
EDUCATION:
----------
• Design Thinking Practitioner (SpecCon, Oct 2025)
• Generic Management (SpecCon, 2024-2025)
• IT Systems Support (SpecCon, Sep 2024)
• N1-N3 Electrical Eng. (Ekurhuleni East TVET, 2020)

CERTIFICATIONS:
---------------
• CISCO: CCST Cybersecurity, Ethical Hacker, Cyber Threat Mgmt, Network Defense, Endpoint Security.
• IBM: Python for Data Science, Cybersecurity Fundamentals.
• LINUX FOUNDATION: Secure Software, Cyber Essentials.
• FORTINET: Certified Associate Cybersecurity, FortiGate Operator.
• FNB: Full Stack App Dev Academy.
• FREECODECAMP: Machine Learning with Python.
• TESTDOME: Programming in C#.
• EC-COUNCIL: Android Bug Bounty Hunting.
• SECURITY BLUE TEAM: Intro to Penetration Testing.
• ASHOKA UNIV: Data Analytics for Climate & Health.
            `);
            break;
        case 'experience':
        case 'cat experience.txt':
            addToTerminal(`
WORK EXPERIENCE:
----------------
• Data Scientist @ Shaper (Oct 2025 - Present)
• Jr Cyber Security Support Tech @ City of Joburg (Oct 2024 - Oct 2025)
• Jr Software Dev Intern @ SpecCon Holdings (Aug 2025 - Sep 2025)
  - Stack: C#, Blazor, .NET Core
• Full-stack Dev Intern @ City of Joburg (Oct 2023 - Sep 2024)
            `);
            break;
        case 'cat bio.txt':
            addToTerminal("--------------------------------------------------\n🔍 Aspiring Data Scientist with a Strong Cybersecurity & Development Background\n\nI am a data science enthusiast with a growing focus on leveraging data to drive actionable insights and smarter decision making. With a strong foundation in cybersecurity and full-stack development, I bring a unique, security-conscious perspective to data analysis and problem-solving.\n--------------------------------------------------");
            break;
        case 'ls':
            addToTerminal(`
Directory: /home/kali
  projects/
    passguard.py
    phishing_detector/
    hulahula_ohs/
    task_mgmt/
    chatbot_ai/
    ai_resume/
    siem_pro/
  labs/
    soc_lab_setup.md
    siem_lab.md
    forensics_crime.case
    tryhackme_notes.txt
  experience.txt
  education.txt
  skills.txt
  bio.txt
  contact.md
            `);
            break;
        case 'cat skills.txt':
            addToTerminal("Data Analytics, Python, SQL, Machine Learning, Cybersecurity, DevOps, CI/CD, Full Stack Development.");
            break;
        default:
            if (lowerCmd.startsWith('cat ')) {
                addToTerminal(`cat: ${lowerCmd.split(' ')[1]}: No such file or directory`);
            } else if (lowerCmd.startsWith('echo ')) {
                addToTerminal(cmd.substring(5));
            } else if (cmd !== "") {
                addToTerminal(`bash: ${cmd}: command not found`);
            }
            break;
    }

    // Auto scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

function addToTerminal(text, className = '') {
    const p = document.createElement('div');
    p.className = `terminal-line ${className}`;
    p.innerText = text;
    terminalOutput.appendChild(p);
}

function addToTerminalHTML(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    terminalOutput.appendChild(div);
}

// --- App Grid Logic ---
function toggleAppGrid() {
    const grid = document.getElementById('app-grid');
    if (grid.style.display === 'flex') {
        grid.classList.remove('active');
        setTimeout(() => { grid.style.display = 'none'; }, 300);
    } else {
        grid.style.display = 'flex';
        // forced reflow
        void grid.offsetWidth;
        grid.classList.add('active');
    }
}

// Close grid when clicking outside
const gridEl = document.getElementById('app-grid');
if (gridEl) {
    gridEl.addEventListener('click', (e) => {
        if (e.target === gridEl) {
            toggleAppGrid();
        }
    });
}

function openTerminalCommand(cmd) {
    const grid = document.getElementById('app-grid');
    if (grid && grid.style.display === 'flex') {
        toggleAppGrid(); // Close grid
    }
    openWindow('terminal');

    // Simulate typing or running the command
    setTimeout(() => {
        const cmdLine = document.createElement('div');
        cmdLine.innerHTML = `${getPromptHTML()} <span style="color: white;">${cmd}</span>`;
        terminalOutput.appendChild(cmdLine);

        // Mock responses for security tools
        if (cmd === 'msfconsole') {
            addToTerminalHTML(`
            <pre style="color: #d70; font-weight: bold;">
 ____________
< metasploit >
 ------------
       \\   ,__,
        \\  (oo)____
           (__)    )\\
              ||--|| *
            </pre>
            `);
            addToTerminal("Metasploit Framework Console... Starting...");
        } else if (cmd === 'nmap -h') {
            addToTerminal("Nmap 7.94 ( https://nmap.org )\nUsage: nmap [Scan Type(s)] [Options] {target specification}");
        } else if (cmd.startsWith('whois')) {
            addToTerminal(`Domain Name: ${cmd.split(' ')[1].toUpperCase()}\nRegistry Domain ID: ...\n[MOCKED WHOIS DATA]`);
        } else if (cmd === 'burpsuite') {
            addToTerminal("Starting Burp Suite Community Edition...\n[JAVA] Loading Process...\n(Mock: Burp GUI would open here)");
        } else if (cmd === 'sqlmap -h') {
            addToTerminal("        ___n__n__\n(_____|__________|\n      |__________|\n\nsqlmap - automatic SQL injection and database takeover tool");
        } else if (cmd === 'commix') {
            addToTerminal("Commix - Automated All-in-One OS Command Injection and Exploitation Tool");
        } else if (cmd === 'nikto -h') {
            addToTerminal("Nikto - Web Server Scanner\nUsage: nikto [options] -h [hostname]");
        } else if (cmd === 'recon-ng') {
            addToTerminal("[recon-ng][default] > ");
        } else if (cmd === 'wireshark') {
            addToTerminal("Initializing Wireshark... [GUI Mock]");
        } else if (cmd === 'autopsy') {
            addToTerminal("Starting Autopsy Forensic Browser...");
        } else if (cmd === 'theharvester') {
            addToTerminalHTML(`<pre style="color: #0f0;">
  _   _          _   _                                _            
 | |_| |__   ___| | | | __ _ _ ____   _____  ___| |_ ___ _ __ 
 | __| '_ \\ / _ \\ |_| |/ _\` | '__\\ \\ / / _ \\/ __| __/ _ \\ '__|
 | |_| | | |  __/  _  | (_| | |   \\ V /  __/\\__ \\ ||  __/ |   
  \\__|_| |_|\\___|_| |_|\\__,_|_|    \\_/ \\___||___/\\__\\___|_|   
            </pre>`);
            addToTerminal("theHarvester - E-mail, subdomain and people harvesting tool\n[+] Searching sources: baidu, bing, google, linkedin...");
        } else if (cmd === 'maltego') {
            addToTerminal("Starting Maltego Community Edition... [GUI Mock]");
        } else if (cmd === 'openvas') {
            addToTerminal("OpenVAS Security Scanner... Connecting to Feed Server... Done.");
        } else if (cmd === 'zaproxy') {
            addToTerminal("OWASP ZAP (Zed Attack Proxy) starting... [GUI Mock]");
        } else if (cmd === 'ettercap') {
            addToTerminalHTML(`<pre>
            ettercap 0.8.3.1 copyright 2001-2020 ALoR & NaGA
            </pre>`);
            addToTerminal("Listening on interface eth0...");
        } else if (cmd === 'binwalk') {
            addToTerminal("Binwalk v2.3.3\nDecimal       Hexadecimal     Description\n--------------------------------------------------------------------------------\n0             0x0             ELF, 32-bit LSB executable, MIPS, MIPS32 rel2 version 1 (SYSV)");
        } else {
            addToTerminal(`[MOCK] Starting ${cmd}...`);
        }

        terminalOutput.scrollTop = terminalOutput.scrollHeight;

    }, 500);
}

// --- Volume & Power Logic ---
let isMuted = false;
function toggleVolume() {
    const icon = document.getElementById('volume-icon');
    if (!icon) return;
    if (isMuted) {
        icon.className = 'fas fa-volume-up';
    } else {
        icon.className = 'fas fa-volume-mute';
    }
    isMuted = !isMuted;
}

function showPowerMenu() {
    const menu = document.getElementById('power-menu');
    if (menu) menu.style.display = 'flex';
}

// --- Live Threat Map Logic ---
let threatInterval;
function startThreatMap() {
    if (document.getElementById('app-grid').style.display === 'flex') {
        toggleAppGrid();
    }

    const canvas = document.getElementById('attack-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const log = document.getElementById('threat-log');

    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;

    if (threatInterval) clearInterval(threatInterval);

    const attacks = [];

    function createAttack() {
        const startX = Math.random() * canvas.width;
        const startY = Math.random() * canvas.height;
        const endX = Math.random() * canvas.width;
        const endY = Math.random() * canvas.height;
        const color = Math.random() > 0.5 ? '#ff0000' : '#ffff00';

        attacks.push({
            sx: startX, sy: startY,
            ex: endX, ey: endY,
            progress: 0,
            speed: 0.01 + Math.random() * 0.02,
            color: color
        });

        const types = ['DDoS', 'SQLi', 'Brute Force', 'Malware', 'Port Scan'];
        const type = types[Math.floor(Math.random() * types.length)];
        const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
        if (log) log.innerHTML = `<span style="color:${color}">[${type}]</span> ${ip} -> TARGET <br>` + log.innerHTML.substring(0, 100);
    }

    function animate() {
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.lineWidth = 2;

        for (let i = 0; i < attacks.length; i++) {
            const a = attacks[i];
            a.progress += a.speed;

            const currentX = a.sx + (a.ex - a.sx) * a.progress;
            const currentY = a.sy + (a.ey - a.sy) * a.progress;

            ctx.beginPath();
            ctx.moveTo(a.sx, a.sy);
            ctx.lineTo(currentX, currentY);
            ctx.strokeStyle = a.color;
            ctx.stroke();

            if (a.progress >= 1) {
                attacks.splice(i, 1);
                i--;
            }
        }

        if (Math.random() < 0.1) createAttack();
        requestAnimationFrame(animate);
    }
    animate();
}

// --- KaliBot AI Logic ---
function handleAIInput(event) {
    if (event.key === 'Enter') {
        const input = document.getElementById('ai-input');
        const text = input.value.trim();
        if (text) {
            addAIMessage('USER', text);
            input.value = '';
            processAICommand(text);
        }
    }
}

function addAIMessage(sender, text) {
    const output = document.getElementById('ai-chat-output');
    if (!output) return;
    const div = document.createElement('div');
    div.style.marginBottom = '10px';
    div.style.color = sender === 'USER' ? '#fff' : '#00ffcc';
    div.innerHTML = `<strong>[${sender}]:</strong> ${text}`;
    output.appendChild(div);
    output.scrollTop = output.scrollHeight;
}

function processAICommand(cmd) {
    const lower = cmd.toLowerCase();
    let response = "I am processing your request...";

    setTimeout(() => {
        if (lower.includes('thabang') || lower.includes('bio')) {
            response = "Thabang Mthimkulu is a multi-skilled <strong>Data Scientist and Cybersecurity Specialist</strong>. <br>He specializes in Machine Learning, Python, CI/CD, and Secure Infrastructure.";
        } else if (lower.includes('skill') || lower.includes('stack')) {
            response = "<strong>Skills:</strong> Python, SQL, JavaScript, Bash, Pandas, TensorFlow, Network Security, SIEM, Docker, Git.";
        } else if (lower.includes('experience') || lower.includes('work')) {
            response = "<strong>Experience:</strong><br>- Data Scientist (Freelance)<br>- IT Support Intern (SITA)<br>- Data Annotator (Remotasks)";
        } else if (lower.includes('project')) {
            openWindow('projects');
            response = "Opening Project Database...<br>Thabang has built PassGuard, Phishing Detectors, Chatbots, and SIEM Solutions.";
        } else if (lower.includes('contact') || lower.includes('email')) {
            response = "Email: thabang23mthimkulu@gmail.com<br>Phone: 060 764 7642";
        } else if (lower.includes('hello') || lower === 'hi' || lower.startsWith('hi ')) {
            response = "Greetings. I am KaliBot v1.0, ready to assist.";
        } else if (lower.includes('status')) {
            response = "System Integrity: STABLE.<br>Network: SECURE.";
        } else {
            response = "Command not recognized. Try asking about 'Thabang', 'Skills', 'Projects' or 'Contact'.";
        }
        addAIMessage('SYSTEM', response);
    }, 600);
}