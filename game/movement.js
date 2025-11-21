// movement.js
import { player, updateStatsUI, logAction } from './core.js';
import { buildEnemyFromRank } from './enemies.js';
import { attackEnemy, spawnEnemy as spawnCombatEnemy } from './combat.js';

let currentEnemy = null;

// --- Movement Commands ---

/**
 * Move in a direction
 * @param {string} direction
 */
export function move(direction) {
    logAction(`${player.name} moves ${direction}.`);
    // Here you could add actual map logic or random events
}

/**
 * Seek an enemy of a given rank
 * @param {number} rank
 */
export function seek(rank = 0) {
    currentEnemy = buildEnemyFromRank(rank);
    logAction(`${player.name} seeks and encounters a ${currentEnemy.name}!`);
    document.getElementById("enemy-status").classList.remove("hidden");
    updateStatsUI();
}

/**
 * Rest to regain HP
 */
export function rest() {
    const hpRecovered = Math.min(player.maxHp - player.hp, 10);
    player.hp += hpRecovered;
    logAction(`${player.name} rests and recovers ${hpRecovered} HP.`);
    updateStatsUI();
}

/**
 * Meditate to regain HP & Essence
 */
export function meditate() {
    const hpRecovered = Math.min(player.maxHp - player.hp, 20);
    const essenceRecovered = Math.min(player.maxEssence - player.essence, 20);
    player.hp += hpRecovered;
    player.essence += essenceRecovered;
    logAction(`${player.name} meditates, restoring ${hpRecovered} HP and ${essenceRecovered} Essence.`);
    updateStatsUI();
}

// --- Combat Integration ---

/**
 * Spawn an enemy for combat
 * @param {number} rank
 */
export function spawnEnemy(rank = 0) {
    spawnCombatEnemy(rank);
    currentEnemy = buildEnemyFromRank(rank);
    document.getElementById("enemy-status").classList.remove("hidden");
    updateStatsUI();
}

// --- Attack Command ---
export { attackEnemy };

// Optional: export currentEnemy for other modules
export { currentEnemy };
