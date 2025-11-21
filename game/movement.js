// movement + travel / seek / rest / meditate
import { player, currentEnemy } from './core.js';
import { addToOutput } from './ui.js';
import { generateSeekEnemy as genSeek, buildEnemyFromRank, travelSpawnChance, meditateSpawnChance, pickMonsterByWeights } from './enemies.js';
import * as coreMod from './core.js';

const MOVEMENT_VECTORS = {
  north:{dx:0,dy:1}, south:{dx:0,dy:-1}, east:{dx:1,dy:0}, west:{dx:-1,dy:0},
  northeast:{dx:1,dy:1}, northwest:{dx:-1,dy:1}, southeast:{dx:1,dy:-1}, southwest:{dx:-1,dy:-1}
};

export function move(direction) {
  if (!MOVEMENT_VECTORS[direction]) { addToOutput('Unknown direction.'); return; }
  if (coreMod.currentEnemy) { addToOutput('You must defeat or hide from the enemy before moving.'); return; }
  const MIN = 750, MAX = 1500;
  const distance = Math.floor(Math.random()*(MAX-MIN+1)) + MIN;
  player.x += MOVEMENT_VECTORS[direction].dx * distance;
  player.y += MOVEMENT_VECTORS[direction].dy * distance;
  player.travelDistance += distance;
  addToOutput(`You travel ${direction} for ${distance} meters. Current travel: ${player.travelDistance}m`);
  const spawnChance = travelSpawnChance(player.travelDistance);
  if (Math.random() < spawnChance) {
    // pick monster rank with weights
    const enemy = pickMonsterByWeights();
    coreMod.currentEnemy = enemy;
    addToOutput(`A gruesome ${enemy.name} bursts from the Dream-Space! Combat initiated.`);
    coreMod.updateUI();
  } else {
    addToOutput('The path remains clear... for now.');
    coreMod.updateUI();
  }
}

export function seek() {
  if (coreMod.currentEnemy) { addToOutput('You are already in combat.'); return; }
  const enemy = pickMonsterByWeights();
  coreMod.currentEnemy = enemy;
  addToOutput(`You seek and force an encounter: ${enemy.name} appears!`);
  coreMod.updateUI();
}

export function rest(minutes) {
  if (coreMod.currentEnemy) { addToOutput('You cannot rest while a Nightmare Creature is present!'); return; }
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) { addToOutput('Rest must be 30-120 minutes.'); return; }
  // formula similar to meditate: base HP recovery at 30 minutes = 50, increases by 0.25 per minute
  const recoveryIncrease = (minutes - 30) * 0.25;
  const hpRecovered = Math.round(50 + recoveryIncrease);
  const staminaRecovered = Math.round(50 + recoveryIncrease); // rest regenerates stamina too
  player.health = Math.min(player.maxHealth, player.health + hpRecovered);
  player.stamina = Math.min(player.maxStamina, player.stamina + staminaRecovered);
  addToOutput(`You rested for ${minutes} minutes. Recovered ${hpRecovered} HP and ${staminaRecovered} Stamina.`);
  // chance for encounter during rest
  const spawnChance = meditateSpawnChance(minutes);
  if (Math.random() < spawnChance) {
    const enemy = pickMonsterByWeights();
    coreMod.currentEnemy = enemy;
    addToOutput(`While resting, a ${enemy.name} appears!`);
  }
  coreMod.updateUI();
}

export function meditate(minutes) {
  if (coreMod.currentEnemy) { addToOutput('You cannot meditate while a Nightmare Creature is present!'); return; }
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) { addToOutput('Meditation must be 30-120 minutes.'); return; }
  // essence: base 20 at 30 minutes, +0.25 per minute
  const essenceRecovered = Math.round(20 + (minutes - 30) * 0.25);
  // xp: base 20, +10 per rank (doc)
  const xpGained = Math.round(20 + (player.tier * 10));
  player.essence = Math.min(player.maxEssence, player.essence + essenceRecovered);
  player.xp += xpGained;
  addToOutput(`You meditated for ${minutes} minutes. Essence Restored: ${essenceRecovered}. Gained ${xpGained} XP.`);
  // spawn chance
  const spawnChance = meditateSpawnChance(minutes);
  if (Math.random() < spawnChance) {
    const enemy = pickMonsterByWeights();
    coreMod.currentEnemy = enemy;
    addToOutput(`While meditating, a ${enemy.name} appears!`);
  }
  coreMod.updateUI();
}

// Hide: 75% base vs Dormant, decreases by 5% per monster rank above player (monster rank - player rank)
export function hide() {
  if (!coreMod.currentEnemy) { addToOutput('You are not engaged in combat.'); return; }
  const enemy = coreMod.currentEnemy;
  const base = 0.75;
  const rankPenalty = Math.max(0, enemy.tier - player.tier) * 0.05;
  let success = base - rankPenalty;
  success = Math.max(0.10, success);
  addToOutput(`Attempting to hide… (Success chance: ${Math.round(success*100)}%)`);
  if (Math.random() < success) {
    addToOutput(`You successfully hid. The ${enemy.name} loses interest and fades away.`);
    coreMod.currentEnemy = null;
    player.travelDistance = 0;
  } else {
    addToOutput('Hide failed! The Nightmare notices you.');
    // enemy gets a free counterattack — use combat module dynamically
    import('./combat.js').then(mod => { mod.enemyCounterattack(); });
  }
  coreMod.updateUI();
}
