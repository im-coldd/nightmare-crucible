// ui.js — UI helpers, intro/title screen, and small text animation engine
import handleCommand from './commands.js';
import * as Core from './core.js';

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
  outputBox.innerHTML = '';
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

// animate a sequence of text frames, delay ms between frames
export function animateTextFrames(frames = [], delay = 200) {
  let i = 0;
  function step() {
    if (i >= frames.length) return;
    addToOutput(frames[i]);
    i++;
    if (i < frames.length) setTimeout(step, delay);
  }
  step();
}

// Title / intro handling
let started = false;
function showTitle() {
  clearOutput();
  addToOutput('*** THE NIGHTMARE CRUCIBLE ***', 'text-red-300');
  addToOutput('A Sleeper\'s journey into the Dream Realm. Press Enter to begin.', 'text-gray-400');
  inputBox.placeholder = 'Press Enter to start...';
  inputBox.addEventListener('keydown', onTitleKeydown);
}
function onTitleKeydown(e) {
  if (e.key !== 'Enter') return;
  inputBox.removeEventListener('keydown', onTitleKeydown);
  startGame();
}
function startGame() {
  started = true;
  clearOutput();
  const intro = `You awaken to darkness.

A chill clings to your skin as the Dream Realm settles around you—endless, silent, watching.
Shadows breathe at the edges of your vision, waiting to see if you will stand… or break.

Type 'help' for commands.`;
  addToOutput(intro);
  inputBox.placeholder = "Enter command...";
  Core.updateUI();
}

// wire input to commands if started
inputBox.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = inputBox.value.trim();
  inputBox.value = '';
  if (!started) {
    startGame();
    return;
  }
  if (!raw) return;
  addToOutput('>> ' + raw, 'text-green-300');
  try {
    const maybe = handleCommand(raw.toLowerCase());
    if (maybe) addToOutput(maybe);
  } catch (err) {
    addToOutput('Command error: ' + err.message);
  }
});

// init
showTitle();
