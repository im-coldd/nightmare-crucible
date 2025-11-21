import { player, logAction } from './core.js';
import { generateEnemy } from './enemies.js';
import { attackEnemy } from './combat.js';

export function move(direction){
    const distance=Math.floor(Math.random()*750)+750;
    logAction(`${player.name} travels ${distance} meters ${direction}.`);
    attemptSpawn(distance);
}

export function seek(){
    if(currentEnemy) return logAction("Already in combat!");
    currentEnemy = generateEnemy(Math.floor(Math.random()*6));
    logAction(`You encounter ${currentEnemy.name} (Tier ${currentEnemy.tier})!`);
    updateStatsUI(currentEnemy);
}

export function meditate(){
    const duration=Math.floor(Math.random()*90)+30; // minutes
    const essenceGain=Math.floor(20+duration*0.25);
    const xpGain=Math.floor(20+player.rank*10);
    player.essence=Math.min(player.maxEssence, player.essence+essenceGain);
    player.xp+=xpGain;
    logAction(`Meditated for ${duration} minutes, gained ${essenceGain} essence & ${xpGain} XP`);
    rankUp();
    updateStatsUI();
}

export function rest(){
    const duration=Math.floor(Math.random()*90)+30;
    const hpGain=Math.floor(20+duration*0.25);
    const staminaGain=Math.floor(20+duration*0.25);
    player.hp=Math.min(player.maxHp,player.hp+hpGain);
    player.stamina=Math.min(player.maxStamina,player.stamina+staminaGain);
    logAction(`Rested for ${duration} minutes, recovered ${hpGain} HP & ${staminaGain} Stamina`);
    updateStatsUI();
}

export function hide(){
    const chance=0.75-(player.rank-1)*0.05;
    const success=Math.random()<chance;
    logAction(success ? "Hide successful!" : "Hide failed!");
}

function attemptSpawn(distance){
    const baseChance=0.175+(distance/50)*0.0015;
    if(Math.random()<baseChance) seek();
}
