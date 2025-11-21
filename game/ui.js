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

export function clearOutput() {
  outputBox.textContent = '';
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

// registration function: commands module should call this to receive input
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
  if (commandHandler) commandHandler(raw.toLowerCase());
});

// initial welcome
addToOutput('*** The Nightmare Crucible ***');
addToOutput("Type 'help' to begin.");
