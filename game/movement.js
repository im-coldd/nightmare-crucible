// core.js (or movement.js)

import { buildEnemyFromRank } from './enemies.js';

export const player = {
    name: "Veiled",
    aspect: "Shadow",
    hp: 77,
    maxHp: 100,
    essence: 95,
    maxEssence: 100,
    xp: 0,
    runes: 0
};

let currentEnemy = null;

// --- UI Functions ---
export function updateStatsUI() {
    document.getElementById("playerHP").textContent = player.hp;
    document.getElementById("playerMaxHP").textContent = player.maxHp;
    document.getElementById("playerEssence").textContent = player.essence;
    document.getElementById("playerMaxEssence").textContent = player.maxEssence;
    document.getElementById("playerRunes").textContent = player.runes;

    if (currentEnemy) {
        document.getElementById("enemy-status").classList.remove("hidden");
        document.getElementById("enemyName").textContent = currentEnemy.name;
        document.getElementById("enemyTier").textContent = currentEnemy.tier;
        document.getElementById("enemyHP").textContent = currentEnemy.health;
        document.getElementById("enemyMaxHP").textContent = currentEnemy.maxHealth;
        document.getElementById("enemyEssence").textContent = currentEnemy.essence;
        document.getElementById("enemyMaxEssence").textContent = currentEnemy.maxEssence;
        document.getElementById("enemyDMG").textContent = `${currentEnemy.minDamage}-${currentEnemy.maxDamage}`;

        document.getElementById("enemyHPBar").style.width = `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%`;
        document.getElementById("enemyEssenceBar").style.width = `${(currentEnemy.essence / currentEnemy.maxEssence) * 100}%`;

        // Enemy rank highlight
        const nameEl = document.getElementById("enemyName");
        if (currentEnemy.tier >= 5) nameEl.style.color = "#ff3300"; // Boss
        else if (currentEnemy.tier >= 3) nameEl.style.color = "#ffcc00"; // Elite
        else nameEl.style.color = "#ff4c4c"; // Normal
    }
}

export function logAction(message) {
    const log = document.getElementById("game-output");
    const p = document.createElement("p");
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

// --- Enemy Spawn & Combat ---
export function spawnEnemy(rank = 0) {
    currentEnemy = buildEnemyFromRank(rank);
    logAction(`A ${currentEnemy.name} appears!`);
    updateStatsUI();
}

export function attackEnemy() {
    if (!currentEnemy) {
        logAction("No enemy to attack.");
        return;
    }

    const dmg = Math.floor(Math.random() * (player.maxHp / 10)) + 5;
    currentEnemy.health -= dmg;
    if (currentEnemy.health < 0) currentEnemy.health = 0;

    logAction(`${player.name} hits ${currentEnemy.name} for ${dmg} damage!`);

    if (currentEnemy.health > 0) {
        const enemyDmg = Math.floor(Math.random() * (currentEnemy.maxDamage - currentEnemy.minDamage + 1)) + currentEnemy.minDamage;
        player.hp -= enemyDmg;
        if (player.hp < 0) player.hp = 0;
        logAction(`${currentEnemy.name} hits ${player.name} for ${enemyDmg} damage!`);
    } else {
        logAction(`${currentEnemy.name} is defeated!`);
        currentEnemy = null;
    }

    updateStatsUI();
}

// --- Command Handler ---
document.getElementById("command-input").addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    const cmd = e.target.value.trim().toLowerCase();
    e.target.value = "";

    if (cmd === "attack") attackEnemy();
    else if (cmd.startsWith("seek")) {
        const rank = parseInt(cmd.split(" ")[1]) || 0;
        spawnEnemy(rank);
    }
    else if (cmd === "help") logAction("Commands: attack, seek <rank>, help");
    else logAction(`Unknown command: ${cmd}`);
});

// --- Initialize UI ---
updateStatsUI();
