// movement.js — travel, seek, rest, meditate, hide
import * as Core from './core.js';
import { generateSeekEnemy, generateMinibossForZone } from './enemies.js';
const MOVEMENT_VECTORS = {
  north:{dx:0,dy:1}, south:{dx:0,dy:-1}, east:{dx:1,dy:0}, west:{dx:-1,dy:0},
  northeast:{dx:1,dy:1}, northwest:{dx:-1,dy:1}, southeast:{dx:1,dy:-1}, southwest:{dx:-1,dy:-1}
};

function determineZone(x,y) {
  if (x < -2000) return 'Abyss';
  if (y > 2000) return 'Forest';
  if (x > 2000) return 'Wastes';
  return 'Wastes';
}

export function move(direction) {
  if (!MOVEMENT_VECTORS[direction]) return 'Unknown direction.';
  if (Core.currentEnemy) return 'You must finish or hide from the enemy before moving.';
  const MIN = 750, MAX = 1500;
  const distance = Math.floor(Math.random()*(MAX-MIN+1))+MIN;
  Core.player.x += MOVEMENT_VECTORS[direction].dx * distance;
  Core.player.y += MOVEMENT_VECTORS[direction].dy * distance;
  Core.player.travelDistance += distance;
  Core.player.zone = determineZone(Core.player.x, Core.player.y);
  Core.player.trueNameAccumulatedChance = (Core.player.trueNameAccumulatedChance||0) + 0.25;
  // miniboss chance
  if (Core.player.zone === 'Abyss' && Math.random() < 0.06) {
    const mb = generateMinibossForZone(Core.player.zone);
    Core.currentEnemy = mb;
    Core.saveGame();
    return `You travel ${distance}m into ${Core.player.zone}. A MINIBOSS emerges: ${mb.name}!`;
  }
  // normal spawn
  const spawnChance = 0.12 + Math.min(0.4, Core.player.travelDistance/10000);
  if (Math.random() < spawnChance) {
    const e = generateSeekEnemy(Core.player.tier);
    Core.currentEnemy = e;
    Core.saveGame();
    return `You travel ${distance}m into ${Core.player.zone}. A ${e.name} appears!`;
  }
  Core.saveGame();
  return `You travel ${distance}m into ${Core.player.zone}. The way is quiet.`;
}

export function seek() {
  if (Core.currentEnemy) return 'Already in combat.';
  if (Core.player.zone === 'Abyss' && Math.random() < 0.10) {
    const mb = generateMinibossForZone(Core.player.zone);
    Core.currentEnemy = mb;
    Core.saveGame();
    return `You seek and awaken a MINIBOSS: ${mb.name}!`;
  }
  const e = generateSeekEnemy(Core.player.tier);
  Core.currentEnemy = e;
  Core.saveGame();
  return `You seek and find: ${e.name}.`;
}

export function rest(minutes) {
  if (Core.currentEnemy) return 'Cannot rest during combat.';
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) return 'Rest must be 30-120 minutes.';
  const hpRecovered = Math.round(50 + ((minutes-30)*0.25));
  Core.player.health = Math.min(Core.player.maxHealth, Core.player.health + hpRecovered);
  Core.player.stamina = Math.min(Core.player.maxStamina, Core.player.stamina + hpRecovered);
  Core.saveGame();
  return `You rested ${minutes} minutes and recovered ${hpRecovered} HP and Stamina.`;
}

export function meditate(minutes) {
  if (Core.currentEnemy) return 'Cannot meditate during combat.';
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) return 'Meditation must be 30-120 minutes.';
  const essenceRecovered = Math.round(20 + ((minutes-30)*0.25));
  Core.player.essence = Math.min(Core.player.maxEssence, Core.player.essence + essenceRecovered);
  Core.player.xp += Math.round(20 + (Core.player.tier * 10));
  Core.saveGame();
  return `You meditated ${minutes} minutes, recovered ${essenceRecovered} Essence and gained XP.`;
}

export function hide() {
  if (!Core.currentEnemy) return 'Not in combat.';
  const e = Core.currentEnemy;
  const base = 0.75;
  const penalty = Math.max(0, e.tier - Core.player.tier) * 0.05;
  const success = Math.max(0.10, base - penalty);
  if (Math.random() < success) {
    Core.currentEnemy = null;
    Core.player.travelDistance = 0;
    Core.saveGame();
    return 'You successfully hid; the enemy fades away.';
  } else {
    // failed — enemy counterattack (call combat.enemyTurn indirectly)
    const res = 'Hide failed! The enemy attacks you.';
    // enemy immediate attack handled in combat.perform... when player attacks next; for now just return message
    return res;
  }
}
