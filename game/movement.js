import { player } from './core.js';
import { addToOutput } from './ui.js';
import { generateSeekEnemy, generateTimeBasedEncounter } from './enemies.js';

const SAFE_TRAVEL_DISTANCE = 500;
const RISK_INCREMENT_DISTANCE = 250;
const MIN_TRAVEL_DISTANCE = 750;
const MAX_TRAVEL_DISTANCE = 1500;

const MOVEMENT_VECTORS = {
  north: { dx: 0, dy: 1 },
  south: { dx: 0, dy: -1 },
  east: { dx: 1, dy: 0 },
  west: { dx: -1, dy: 0 },
  northeast: { dx: 1, dy: 1 },
  northwest: { dx: -1, dy: 1 },
  southeast: { dx: 1, dy: -1 },
  southwest: { dx: -1, dy: -1 }
};

export function move(direction) {
  if (!MOVEMENT_VECTORS[direction]) { addToOutput('Unknown direction.'); return; }
  const distance = Math.floor(Math.random() * (MAX_TRAVEL_DISTANCE - MIN_TRAVEL_DISTANCE + 1)) + MIN_TRAVEL_DISTANCE;
  player.x += MOVEMENT_VECTORS[direction].dx * distance;
  player.y += MOVEMENT_VECTORS[direction].dy * distance;
  player.travelDistance += distance;
  addToOutput(`You travel ${direction} for ${distance} meters. Current travel: ${player.travelDistance}m`);
  // Chance to spawn based on travelDistance
  if (player.travelDistance > SAFE_TRAVEL_DISTANCE && Math.random() < 0.35) {
    const enemy = generateSeekEnemy();
    import('./core.js').then(mod => { mod.currentEnemy = enemy; addToOutput(`A ${enemy.name} appears!`); mod.updateUI(); });
  }
}

export function seek() {
  const enemy = generateSeekEnemy();
  import('./core.js').then(mod => { mod.currentEnemy = enemy; addToOutput(`You seek and found a ${enemy.name}.`); mod.updateUI(); });
}

export function rest(minutes) {
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 30 || minutes > 120) { addToOutput('Rest minutes must be between 30 and 120.'); return; }
  import('./core.js').then(mod => {
    const player = mod.player;
    const recoveryIncrease = (minutes - 30) * 0.25;
    const hpRecovered = Math.round(50 + recoveryIncrease);
    const essenceRecovered = Math.round(25 + recoveryIncrease);
    player.health = Math.min(player.maxHealth, player.health + hpRecovered);
    player.essence = Math.min(player.maxEssence, player.essence + essenceRecovered);
    addToOutput(`You rested for ${minutes} minutes. Recovered ${hpRecovered} HP and ${essenceRecovered} Essence.`);
    const enemy = generateTimeBasedEncounter(minutes);
    if (enemy) { mod.currentEnemy = enemy; addToOutput(`While resting, a ${enemy.name} appears!`); }
    mod.updateUI();
  });
}

export function meditate(minutes) {
  minutes = parseInt(minutes,10);
  if (isNaN(minutes) || minutes < 5 || minutes > 30) { addToOutput('Meditation minutes must be between 5 and 30.'); return; }
  import('./core.js').then(mod => {
    const player = mod.player;
    const baseEssence = 5 + (5 * player.tier);
    const essenceRecovered = Math.round(baseEssence + (minutes * 0.5));
    player.essence = Math.min(player.maxEssence, player.essence + essenceRecovered);
    const xpGained = Math.round(minutes * (1 + (player.tier * 0.5)));
    player.xp += xpGained;
    addToOutput(`You meditated for ${minutes} minutes. Essence Restored: ${essenceRecovered}. Gained ${xpGained} XP.`);
    const enemy = generateTimeBasedEncounter(minutes);
    if (enemy) { mod.currentEnemy = enemy; addToOutput(`While meditating, a ${enemy.name} appears!`); }
    mod.updateUI();
  });
}
