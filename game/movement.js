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
  Core.player.trueNameAccumulatedChance += 0.25;

  updateUI();
  return `You move ${direction}.`;
}

export function seek() {
  if (Core.currentEnemy) {
    return "You are already in combat!";
  }

  const enemy = generateSeekEnemy(Core.player.tier);

  // **FIXED writable reference**
  Core.currentEnemy = enemy;

  updateUI();
  return `A presence stirs... **${enemy.name}** appears!`;
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
