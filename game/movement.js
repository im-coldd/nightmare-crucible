import { player, updateStatsUI, logAction } from './core.js';
import { buildEnemyFromRank } from './enemies.js';
import { attackEnemy, spawnEnemy as combatSpawn } from './combat.js';

export function move(direction) {
    const distance = Math.floor(Math.random()*750)+750; // 750-1500m
    logAction(`${player.name} moves ${direction} ${distance} meters.`);
}

export function seek(rank=1) {
    const enemy = buildEnemyFromRank(rank);
    combatSpawn(rank);
    updateStatsUI(enemy);
}

export function rest() {
    const time = Math.floor(Math.random()*90)+30; // 30-120 minutes
    const hpRecovered = Math.min(player.maxHp - player.hp, 20 + time*0.25);
    const staminaRecovered = Math.min(player.maxStamina - player.stamina, 20 + time*0.25);
    player.hp += hpRecovered;
    player.stamina += staminaRecovered;
    logAction(`${player.name} rests for ${time} minutes and recovers ${hpRecovered.toFixed(0)} HP and ${staminaRecovered.toFixed(0)} stamina.`);
    updateStatsUI();
}

export function meditate() {
    const time = Math.floor(Math.random()*90)+30;
    const essenceRecovered = Math.min(player.maxEssence - player.essence, 20 + time*0.25);
    const xpGained = 20 + (player.rank-1)*10;
    player.essence += essenceRecovered;
    player.xp += xpGained;
    logAction(`${player.name} meditates for ${time} minutes, recovers ${essenceRecovered.toFixed(0)} Essence and gains ${xpGained} XP.`);
    updateStatsUI();
}
