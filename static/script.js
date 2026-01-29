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