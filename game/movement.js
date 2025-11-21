// movement.js
import * as Core from './core.js';
import { generateSeekEnemy } from './enemies.js';
import { updateUI } from './core.js';

export function move(direction) {
  if (Core.currentEnemy) {
    return "You cannot move while in combat!";
  }

  switch (direction) {
    case 'north': Core.player.y++; break;
    case 'south': Core.player.y--; break;
    case 'east':  Core.player.x++; break;
    case 'west':  Core.player.x--; break;
    default: return "Unknown direction.";
  }

  Core.player.travelDistance++;
  Core.player.trueNameAccumulatedChance += 0.25; // 0.25% buildup

  updateUI();
  return `You move ${direction}.`;
}

export function seek() {
  if (Core.currentEnemy) {
    return "You are already in combat!";
  }

  const enemy = generateSeekEnemy(Core.player.tier);
  Core.currentEnemy = enemy;

  updateUI();
  return `You sense a presence... **${enemy.name}** emerges!`;
}

export function meditate() {
  if (Core.currentEnemy) {
    return "You cannot meditate in combat.";
  }

  const healed = Math.min(25, Core.player.maxHealth - Core.player.health);
  Core.player.health += healed;

  Core.player.essence = Math.min(Core.player.maxEssence, Core.player.essence + 20);
  Core.player.stamina = Math.min(Core.player.maxStamina, Core.player.stamina + 20);

  updateUI();
  return `You meditate and recover ${healed} HP, 20 Essence, and 20 Stamina.`;
}
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
