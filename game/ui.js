// ui.js
import { handleCommand } from './commands.js';
import * as Core from './core.js';

const output = document.getElementById("game-output");
const input = document.getElementById("command-input");

export function updatePlayerStatus(text) {
  document.getElementById("player-status").innerText = text;
}

export function showEnemyStatus(text) {
  const box = document.getElementById("enemy-status");
  if (!text) {
    box.classList.add("hidden");
    return;
  }
  box.classList.remove("hidden");
  box.innerText = text;
}

export function print(msg) {
  output.innerHTML += `<div>${msg}</div>`;
  output.scrollTop = output.scrollHeight;
}

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const cmd = input.value;
    input.value = "";
    const result = handleCommand(cmd);
    if (result) print(result);
  }
});

print("The Nightmare Crucible<br>Type 'help' to begin.");
Core.updateUI();
Type 'choose <aspect>' to begin. (shadow, sun, mirror, superhuman, perfection, seer)

Only 1% of Sleepers ever awaken with a True Name.

Will you be one of them?

Type 'help' for guidance.
`;

addToOutput(introText);
