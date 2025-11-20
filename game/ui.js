// UI MODULE — DO NOT REMOVE
const outputBox = document.getElementById("game-output");
const inputBox = document.getElementById("command-input");
const playerStatusBox = document.getElementById("player-status");
const enemyStatusBox = document.getElementById("enemy-status");

// Append text to console
export function addToOutput(text, cls = "") {
    const p = document.createElement("p");
    p.textContent = text;
    if (cls) p.classList.add(cls);
    outputBox.appendChild(p);
    outputBox.scrollTop = outputBox.scrollHeight;
}

// Hook input to command parser
import { handleCommand } from "./commands.js";

inputBox.addEventListener("keydown", e => {
    if (e.key === "Enter") {
        const cmd = inputBox.value.trim();
        inputBox.value = "";
        if (cmd !== "") {
            addToOutput(">> " + cmd, "text-green-300");
            handleCommand(cmd);
        }
    }
});
