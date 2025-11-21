import { player, updateStatsUI, logAction, rankUp } from './core.js';
import { buildEnemyFromRank } from './enemies.js';

let currentEnemy = null;

export function spawnEnemy(rank=1) {
    currentEnemy = buildEnemyFromRank(rank);
    logAction(`${currentEnemy.name} appears!`);
    updateStatsUI(currentEnemy);
}

export function attackEnemy() {
    if(!currentEnemy) return logAction("No enemy to attack.");
    
    // Melee attack
    const dmg = Math.floor(Math.random()*(18-7+1))+7;
    const staminaDrain = dmg-2;
    player.stamina -= staminaDrain;
    currentEnemy.health -= dmg;
    logAction(`${player.name} hits ${currentEnemy.name} for ${dmg} damage (-${staminaDrain} stamina).`);
    
    // Enemy counter
    if(currentEnemy.health>0) {
        enemyAction(currentEnemy);
    } else {
        logAction(`${currentEnemy.name} is defeated!`);
        player.xp += currentEnemy.xp;
        currentEnemy = null;
        updateStatsUI();
        if(player.xp>=calcNextRankXP(player.rank)) rankUp();
    }

    updateStatsUI(currentEnemy);
}

function enemyAction(enemy) {
    const ability = enemy.abilities[Math.floor(Math.random()*enemy.abilities.length)];
    switch(ability) {
        case "despair":
            const essLoss = Math.floor(enemy.maxDamage*0.5);
            player.essence -= essLoss;
            logAction(`${enemy.name} uses Despair! Player loses ${essLoss} essence.`);
            break;
        case "lunge":
            const dmg = Math.floor(Math.random()*(enemy.maxDamage-enemy.minDamage+1))+enemy.minDamage+5;
            player.hp -= dmg;
            logAction(`${enemy.name} lunges for ${dmg} damage.`);
            break;
        case "reinforce":
            const heal = Math.floor(enemy.maxHealth*0.15);
            enemy.health = Math.min(enemy.maxHealth, enemy.health+heal);
            logAction(`${enemy.name} reinforces, restoring ${heal} HP.`);
            break;
    }
}

function calcNextRankXP(rank) {
    const ranksXP = [200,400,800,1200,1500,2000];
    return ranksXP[rank-1] || Infinity;
}

export { currentEnemy };
import { player, updateStatsUI, logAction } from './core.js';
import { currentEnemy } from './combat.js';
import { ASPECT_ABILITIES } from './abilities.js';

export function useAbility(name) {
    const ability = player.abilities.find(a=>a.name.toLowerCase()===name.toLowerCase());
    if(!ability) return logAction("Ability not found or not unlocked!");
    if(player.essence < ability.essenceCost) return logAction("Not enough essence!");

    // Execute ability effect
    ability.effect();
    updateStatsUI(currentEnemy);
}
