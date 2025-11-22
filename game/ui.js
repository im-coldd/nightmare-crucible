// ui.js — rendering & input wiring. Imports commands last to avoid circular imports.
import * as Core from './core.js';
import handleCommand from './commands.js';

const outputBox = document.getElementById('game-output');
const playerStatusBox = document.getElementById('player-status');
const enemyStatusBox = document.getElementById('enemy-status');
const inputBox = document.getElementById('command-input');

function addToOutput(text, cls='') {
  if (Array.isArray(text)) {
    text.forEach(t => addToOutput(t, cls));
    return;
  }
  const p = document.createElement('div');
  p.textContent = text;
  if (cls) p.className = cls;
  outputBox.appendChild(p);
  outputBox.scrollTop = outputBox.scrollHeight;
}

function clearOutput() {
  outputBox.innerHTML = '';
}

function updateStatus() {
  const tierName = Core.RANKS[Core.player.tier] ? Core.RANKS[Core.player.tier].name : `T:${Core.player.tier}`;
  const aspect = Core.player.aspect ? ` | Aspect: ${Core.player.aspect}` : '';
  const trueName = Core.player.trueName && Core.player.trueName !== 'Veiled Name' ? ` | True Name: ${Core.player.trueName}` : '';
  playerStatusBox.textContent = `Runes: [${tierName} | T:${Core.player.tier} | XP:${Core.player.xp}] HP: ${Core.player.health}/${Core.player.maxHealth} | Essence: ${Core.player.essence}/${Core.player.maxEssence} | Stamina: ${Core.player.stamina}/${Core.player.maxStamina}${aspect}${trueName} | Zone: ${Core.player.zone}`;
  if (Core.currentEnemy) {
    enemyStatusBox.classList.remove('hidden');
    enemyStatusBox.textContent = `[${Core.currentEnemy.name} T:${Core.currentEnemy.tier}] HP:${Core.currentEnemy.health}/${Core.currentEnemy.maxHealth}`;
  } else {
    enemyStatusBox.classList.add('hidden');
    enemyStatusBox.textContent = '';
  }
}

// Title + keep-or-restart prompt (Option C)
let waitingForKeepOrRestart = false;
function showIntro() {
  clearOutput();
  addToOutput('*** The Nightmare Crucible ***');
  // if saved data exists, offer choice
  const saved = Core.loadGame();
  if (saved && Core.player.aspect) {
    addToOutput('A previous save was found. Type "keep" to keep it or "restart" to start fresh.');
    waitingForKeepOrRestart = true;
    inputBox.placeholder = 'Type keep or restart';
  } else {
    // show original intro prompting choose aspect
    addToOutput(`You awaken as a Sleeper in the Dream Realm. You must choose an Aspect to survive.

Type 'choose <aspect>' to begin (shadow, sun, mirror, superhuman, perfection, seer). Only a 1% chance to know your True Name!

Type 'help' for more commands.`);
    inputBox.placeholder = 'Enter command...';
    waitingForKeepOrRestart = false;
  }
  updateStatus();
}

// process input lines
inputBox.addEventListener('keydown', (e) => {
  if (e.key !== 'Enter') return;
  const raw = inputBox.value.trim();
  inputBox.value = '';
  if (!raw) return;
  addToOutput('>> ' + raw, 'text-green-300');
  if (waitingForKeepOrRestart) {
    const cmd = raw.trim().toLowerCase();
    if (cmd === 'keep') {
      waitingForKeepOrRestart = false;
      Core.saveGame();
      addToOutput('Keeping save. Continue with your adventure. Type help.');
      updateStatus();
      return;
    } else if (cmd === 'restart') {
      Core.clearSave();
      waitingForKeepOrRestart = false;
      addToOutput('Save reset. New game started. Type choose <aspect> to begin.');
      updateStatus();
      return;
    } else {
      addToOutput('Type "keep" or "restart".');
      return;
    }
  }
  // normal command dispatch
  try {
    const res = handleCommand(raw);
    if (Array.isArray(res)) {
      res.forEach(r => addToOutput(r));
    } else {
      addToOutput(res);
    }
  } catch (err) {
    addToOutput('Command error: ' + err.message);
  }
  // update UI after command
  Core.saveGame();
  updateStatus();
});

// init
showIntro();

export { addToOutput, updateStatus, clearOutput };
