import { player, logAction, updateStatsUI, rankUp, attemptTrueName } from './core.js';
import { generateEnemy } from './enemies.js';
import { generateMemory } from './memories.js';

export let currentEnemy = null;

export function attackEnemy(){
    if(!currentEnemy) return logAction("No enemy to attack.");
    let attacks = 1 + (player._extraAttacks || 0);
    for(let i=0;i<attacks;i++){
        let dmg=Math.floor(Math.random()*12)+7;
        dmg *= player._damageMultiplier;
        dmg += player._damageBuff;
        if(currentEnemy._damageReduction) dmg*=(1-currentEnemy._damageReduction);
        const staminaDrain=dmg-2;
        player.stamina=Math.max(0,player.stamina-staminaDrain);
        currentEnemy.health-=dmg;
        player._lastDamage=dmg;
        logAction(`${player.name} hits ${currentEnemy.name} for ${dmg.toFixed(0)} (-${staminaDrain} stamina).`);
        if(currentEnemy.health<=0) break;
    }
    if(player._damageBuffTurns){player._damageBuffTurns--; if(player._damageBuffTurns<=0) player._damageMultiplier=1;}
    if(player._buffTurns){player._buffTurns--; if(player._buffTurns<=0) player._damageReduction=0;}
    if(currentEnemy.health>0) enemyAction();
    else {defeatEnemy();}
    updateStatsUI(currentEnemy);
}

function enemyAction(){
    if(!currentEnemy) return;
    const dmg=Math.floor(Math.random()*(currentEnemy.maxDamage-currentEnemy.minDamage+1))+currentEnemy.minDamage;
    const finalDmg=dmg*(1-player._damageReduction||1);
    player.hp=Math.max(0,player.hp-finalDmg);
    logAction(`${currentEnemy.name} hits ${player.name} for ${finalDmg.toFixed(0)} damage.`);
}

function defeatEnemy(){
    logAction(`${currentEnemy.name} is defeated!`);
    player.xp += currentEnemy.xp;
    // Memory drop
    if(Math.random()<0.1 + currentEnemy.tier*0.05){
        const memory = generateMemory(currentEnemy.tier);
        player.memories.push(memory);
        logAction(`Memory found: ${memory.name} (${memory.type})`);
    }
    attemptTrueName();
    rankUp();
    currentEnemy=null;
    updateStatsUI();
}
