import { player, currentEnemy } from './core.js';
import { addToOutput } from './ui.js';
import { gainXP, checkLevelUp } from './core.js';

export function performSingleAttack(base = player.baseDamage, critChance = player.critChance) {
  const min = Math.max(5, Math.floor(base * 0.5));
  const raw = Math.floor(Math.random() * (base - min + 1)) + min;
  let isCrit = Math.random() < critChance;
  let damage = isCrit ? Math.round(raw * 2.5) : raw;
  return { damage, isCrit };
}

export function attack() {
  if (!currentEnemy) { addToOutput('You must be engaged in combat to attack.'); return; }
  const { damage, isCrit } = performSingleAttack();
  currentEnemy.health -= damage;
  addToOutput((isCrit ? '*** CRITICAL HIT! *** ' : '') + `You dealt ${damage} damage to the ${currentEnemy.name}.`);
  if (currentEnemy.health <= 0) handleEnemyDefeat(); else enemyCounterattack();
}

export function enemyCounterattack() {
  if (!currentEnemy) return;
  const raw = Math.floor(Math.random() * (currentEnemy.maxDamage - currentEnemy.minDamage + 1)) + currentEnemy.minDamage;
  let dmg = Math.round(raw);
  player.health -= dmg;
  addToOutput(`The ${currentEnemy.name} strikes back for ${dmg} damage.`);
  if (player.health <= 0) {
    player.health = 0;
    addToOutput('*** Your nightmare is over. ***');
  }
}

export function handleEnemyDefeat() {
  if (!currentEnemy) return;
  addToOutput(`The ${currentEnemy.name} dissolves. You absorb ${currentEnemy.essence} Essence.`);
  player.essence = Math.min(player.maxEssence, player.essence + currentEnemy.essence);
  gainXP(100);
  checkLevelUp();
  // award memory 20% chance base
  if (Math.random() < 0.20) {
    import('./memories.js').then(mod => {
      const mem = mod.generateMemory(currentEnemy.tier);
      player.inventory.push(mem);
      if (mem.type !== 'consumable') {
        // apply permanent effects immediately
        if (mem.effect.baseDamage) player.baseDamage += mem.effect.baseDamage;
        if (mem.effect.critChance) player.critChance += mem.effect.critChance;
        if (mem.effect.maxHealth) { player.maxHealth += mem.effect.maxHealth; player.health = Math.min(player.maxHealth, player.health + mem.effect.maxHealth); }
      }
      addToOutput(`*** MEMORY ACQUIRED! *** You found a ${mem.name}`);
    });
  }
  currentEnemy = null;
}
