// movement.js — travel, seek, rest, meditate, hide, zones & minibosses
import * as Core from './core.js';
import { generateSeekEnemy, generateMinibossForZone } from './enemies.js';
import { addToOutput } from './ui.js';

const MOVEMENT_VECTORS = {
  north:{dx:0,dy:1}, south:{dx:0,dy:-1}, east:{dx:1,dy:0}, west:{dx:-1,dy:0},
  northeast:{dx:1,dy:1}, northwest:{dx:-1,dy:1}, southeast:{dx:1,dy:-1}, southwest:{dx:-1,dy:-1}
};

// update zone based on coordinates (simple grid)
function determineZone(x,y) {
  if (x < -2000) return 'Abyss';
  if (y > 2000) return 'Forest';
  if (x > 2000) return 'Wastes';
  return 'Wastes';
}

export function move(direction) {
  if (!MOVEMENT_VECTORS[direction]) { addToOutput('Unknown direction.'); return; }
  if (Core.currentEnemy) { addToOutput('You must defeat or hide from the enemy before moving.'); return; }
  const MIN = 750, MAX = 1500;
  const distance = Math.floor(Math.random()*(MAX-MIN+1)) + MIN;
  Core.player.x += MOVEMENT_VECTORS[direction].dx * distance;
  Core.player.y += MOVEMENT_VECTORS[direction].dy * distance;
  Core.player.travelDistance += distance;
  Core.player.zone = determineZone(Core.player.x, Core.player.y);
  addToOutput(`You travel ${direction} for ${distance} meters. Current travel: ${Core.player.travelDistance}m. Zone: ${Core.player.zone}`);
  // miniboss spawn chance in special zones
  const minibossChance = Core.player.zone === 'Abyss' ? 0.06 : 0.01;
  if (Math.random() < minibossChance) {
    const mb = generateMinibossForZone(Core.player.zone);
    Core.currentEnemy = mb;
    addToOutput(`A MINIBOSS appears: ${mb.name}! Prepare yourself.`);
    Core.updateUI();
    return;
  }
  // normal spawn (kept smaller to not spam)
  const spawnChance = 0.12 + Math.min(0.4, Core.player.travelDistance/10000);
  if (Math.random() < spawnChance) {
    const enemy = generateSeekEnemy(Core.player.tier);
    Core.currentEnemy = enemy;
    addToOutput(`A ${enemy.name} emerges from the Dream-Space! Combat initiated.`);
    Core.updateUI();
  } else {
    addToOutput('The path remains eerie but clear... for now.');
    Core.updateUI();
  }
}

export function seek() {
  if (Core.currentEnemy) { addToOutput('You are already in combat.'); return; }
  // 10% chance miniboss when seeking in dangerous zones
  if (Core.player.zone === 'Abyss' && Math.random() < 0.10) {
    const mb = generateMinibossForZone(Core.player.zone);
    Core.currentEnemy = mb;
    addToOutput(`You force an encounter and awaken a MINIBOSS: ${mb.name}!`);
    Core.updateUI();
    return;
  }
  const enemy = generateSeekEnemy(Core.player.tier);
  Core.currentEnemy = enemy;
  addToOutput(`You seek and force an encounter: ${enemy.name} appears!`);
  Core.updateUI();
}

export function rest(minutes) {
  if (Core.currentEnemy) { addToOutput('You cannot rest while a Nightmare Creature is present!'); return; }
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) { addToOutput('Rest must be 30-120 minutes.'); return; }
  const recoveryIncrease = (minutes - 30) * 0.25;
  const hpRecovered = Math.round(50 + recoveryIncrease);
  const staminaRecovered = Math.round(50 + recoveryIncrease);
  Core.player.health = Math.min(Core.player.maxHealth, Core.player.health + hpRecovered);
  Core.player.stamina = Math.min(Core.player.maxStamina, Core.player.stamina + staminaRecovered);
  addToOutput(`You rested for ${minutes} minutes. Recovered ${hpRecovered} HP and ${staminaRecovered} Stamina.`);
  Core.updateUI();
}

export function meditate(minutes) {
  if (Core.currentEnemy) { addToOutput('You cannot meditate while a Nightmare Creature is present!'); return; }
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) { addToOutput('Meditation must be 30-120 minutes.'); return; }
  const essenceRecovered = Math.round(20 + (minutes - 30) * 0.25);
  const xpGained = Math.round(20 + (Core.player.tier * 10));
  Core.player.essence = Math.min(Core.player.maxEssence, Core.player.essence + essenceRecovered);
  Core.player.xp += xpGained;
  addToOutput(`You meditated for ${minutes} minutes. Essence Restored: ${essenceRecovered}. Gained ${xpGained} XP.`);
  Core.updateUI();
}

export function hide() {
  if (!Core.currentEnemy) { addToOutput('You are not engaged in combat.'); return; }
  const enemy = Core.currentEnemy;
  const base = 0.75;
  const rankPenalty = Math.max(0, enemy.tier - Core.player.tier) * 0.05;
  let success = base - rankPenalty;
  success = Math.max(0.10, success);
  addToOutput(`Attempting to hide… (Success chance: ${Math.round(success*100)}%)`);
  if (Math.random() < success) {
    addToOutput(`You successfully hid. The ${enemy.name} loses interest and fades away.`);
    Core.currentEnemy = null;
    Core.player.travelDistance = 0;
  } else {
    addToOutput('Hide failed! The Nightmare notices you.');
    // enemy immediate counterattack handled in combat
    import('./combat.js').then(m => { m.enemyCounterattack(); });
  }
  Core.updateUI();
}
