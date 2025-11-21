// movement.js — travel, seek, rest, meditate, hide
import { player } from './core.js';
import { addToOutput } from './ui.js';
import { generateSeekEnemy } from './enemies.js';
import * as core from './core.js';

const MOVEMENT_VECTORS = {
  north:{dx:0,dy:1}, south:{dx:0,dy:-1}, east:{dx:1,dy:0}, west:{dx:-1,dy:0},
  northeast:{dx:1,dy:1}, northwest:{dx:-1,dy:1}, southeast:{dx:1,dy:-1}, southwest:{dx:-1,dy:-1}
};

function travelSpawnChance(distanceMeters) {
  if (distanceMeters < 750) return 0.0;
  const over = Math.max(0, distanceMeters - 750);
  const increments = Math.floor(over / 50);
  return 0.175 + increments * 0.0015;
}

function meditateSpawnChance(minutes) {
  if (minutes < 30) return 0.0;
  const extra = minutes - 30;
  return 0.175 + extra * 0.0015;
}

export function move(direction) {
  if (!MOVEMENT_VECTORS[direction]) { addToOutput('Unknown direction.'); return; }
  if (core.currentEnemy) { addToOutput('You must defeat or hide from the enemy before moving.'); return; }
  const MIN = 750, MAX = 1500;
  const distance = Math.floor(Math.random()*(MAX-MIN+1)) + MIN;
  player.x += MOVEMENT_VECTORS[direction].dx * distance;
  player.y += MOVEMENT_VECTORS[direction].dy * distance;
  player.travelDistance += distance;
  addToOutput(`You travel ${direction} for ${distance} meters. Current travel: ${player.travelDistance}m`);
  const spawnChance = travelSpawnChance(player.travelDistance);
  if (Math.random() < spawnChance) {
    const enemy = generateSeekEnemy();
    core.currentEnemy = enemy;
    addToOutput(`A gruesome ${enemy.name} bursts from the Dream-Space! Combat initiated.`);
    core.updateUI();
  } else {
    addToOutput('The path remains eerily quiet... for now.');
    core.updateUI();
  }
}

export function seek() {
  if (core.currentEnemy) { addToOutput('You are already in combat.'); return; }
  const enemy = generateSeekEnemy();
  core.currentEnemy = enemy;
  addToOutput(`You seek and force an encounter: ${enemy.name} appears!`);
  core.updateUI();
}

export function rest(minutes) {
  if (core.currentEnemy) { addToOutput('You cannot rest while a Nightmare Creature is present!'); return; }
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) { addToOutput('Rest must be 30-120 minutes.'); return; }
  const recoveryIncrease = (minutes - 30) * 0.25;
  const hpRecovered = Math.round(50 + recoveryIncrease);
  const staminaRecovered = Math.round(50 + recoveryIncrease);
  player.health = Math.min(player.maxHealth, player.health + hpRecovered);
  player.stamina = Math.min(player.maxStamina, player.stamina + staminaRecovered);
  addToOutput(`You rested for ${minutes} minutes. Recovered ${hpRecovered} HP and ${staminaRecovered} Stamina.`);
  const spawnChance = meditateSpawnChance(minutes);
  if (Math.random() < spawnChance) {
    const enemy = generateSeekEnemy();
    core.currentEnemy = enemy;
    addToOutput(`While resting, a ${enemy.name} appears!`);
  }
  core.updateUI();
}

export function meditate(minutes) {
  if (core.currentEnemy) { addToOutput('You cannot meditate while a Nightmare Creature is present!'); return; }
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) { addToOutput('Meditation must be 30-120 minutes.'); return; }
  const essenceRecovered = Math.round(20 + (minutes - 30) * 0.25);
  const xpGained = Math.round(20 + (player.tier * 10));
  player.essence = Math.min(player.maxEssence, player.essence + essenceRecovered);
  player.xp += xpGained;
  addToOutput(`You meditated for ${minutes} minutes. Essence Restored: ${essenceRecovered}. Gained ${xpGained} XP.`);
  const spawnChance = meditateSpawnChance(minutes);
  if (Math.random() < spawnChance) {
    const enemy = generateSeekEnemy();
    core.currentEnemy = enemy;
    addToOutput(`While meditating, a ${enemy.name} appears!`);
  }
  core.updateUI();
}

export function hide() {
  if (!core.currentEnemy) { addToOutput('You are not engaged in combat.'); return; }
  const enemy = core.currentEnemy;
  const base = 0.75;
  const rankPenalty = Math.max(0, enemy.tier - player.tier) * 0.05;
  let success = base - rankPenalty;
  success = Math.max(0.10, success);
  addToOutput(`Attempting to hide… (Success chance: ${Math.round(success*100)}%)`);
  if (Math.random() < success) {
    addToOutput(`You successfully hid. The ${enemy.name} loses interest and fades away.`);
    core.currentEnemy = null;
    player.travelDistance = 0;
  } else {
    addToOutput('Hide failed! The Nightmare notices you.');
    import('./combat.js').then(mod => { mod.enemyCounterattack(); });
  }
  core.updateUI();
}
