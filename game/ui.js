const outputBox = document.getElementById('game-output');
const playerStatusBox = document.getElementById('player-status');
const enemyStatusBox = document.getElementById('enemy-status');
const inputBox = document.getElementById('command-input');

export function addToOutput(text, style = '') {
    const p = document.createElement('p');
    p.textContent = text;
    p.className = 'py-0.5 terminal-font ' + style;
    outputBox.appendChild(p);
    outputBox.scrollTop = outputBox.scrollHeight;
}

export function updatePlayerStatus(text) {
    playerStatusBox.textContent = text;
}

export function showEnemyStatus(text) {
    if (!text) {
        enemyStatusBox.classList.add('hidden');
        enemyStatusBox.textContent = '';
    } else {
        enemyStatusBox.classList.remove('hidden');
        enemyStatusBox.textContent = text;
    }
}

// === Command Handler Registration ===
let commandHandler = null;
export function registerCommandHandler(fn) {
    commandHandler = fn;
}

inputBox.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;

    const raw = inputBox.value.trim();
    inputBox.value = '';
    if (!raw) return;

    addToOutput('>> ' + raw, 'text-green-300');

    if (commandHandler) {
        commandHandler(raw.toLowerCase());
    }
});

// === Shadow Slave-Style Intro ===
const introText = `
*** The Nightmare Crucible ***

You awaken to darkness.

A chill clings to your skin as the Dream Realm settles around you—endless, silent, watching.
Shadows breathe at the edges of your vision, waiting to see if you will stand… or break.

You are a Sleeper.
Tierless. Unknown. Unclaimed.

Somewhere deep within you, a spark stirs—faint, fragile, hungry.

Choose an Aspect, and the nightmare will shape itself around your path.
Fail to choose, and the Realm will choose for you.

Type 'choose <aspect>' to begin. (shadow, sun)

Only 1% of Sleepers ever awaken with a True Name.

Will you be one of them?

Type 'help' for guidance.
`;

addToOutput(introText);
