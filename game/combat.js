// combat.js — attacks, enemy AI behaviors, defeat handling
import * as core from './core.js';
import { addToOutput } from './ui.js';
import * as memories from './memories.js';

const player = core.player;

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

export function computeMeleeRange() {
  const min = 7 + player.tier*10;
  const max = 18 + player.tier*10;
  return {min,max};
}

function playerDamageMultiplier() {
  let mul = 1.0;
  if (player._despairTurns && player._despairTurns > 0) mul *= 0.85;
  if (player.nextAttackBuffed) { mul *= 2; player.nextAttackBuffed = false; }
  if (player.damageBoost) { mul *= player.damageBoost; player.damageBoost = 1; }
  return mul;
}

function enemyIncomingMultiplier(e) {
  return (e._reinforceTurns && e._reinforceTurns > 0) ? 0.85 : 1.0;
}

export function performMeleeAttack() {
  if (!core.currentEnemy) { addToOutput('No enemy to attack.'); return; }
  const e = core.currentEnemy;
  const {min,max} = computeMeleeRange();
  let damage = randInt(min,max);
  const isCrit = Math.random() < player.critChanceFlat;
  if (isCrit) damage = Math.round(damage * 1.75);
  const staminaDrain = Math.max(1, damage - 2);
  player.stamina = Math.max(0, player.stamina - staminaDrain);
  if (player.stamina <= 0) {
    damage = Math.round(damage * 0.65);
    addToOutput('You are exhausted — damage reduced by 35%.');
  }
  damage += player.baseDamageBonus;
  const mul = playerDamageMultiplier();
  damage = Math.round(damage * mul);
  damage = Math.round(damage * enemyIncomingMultiplier(e));
  e.health -= damage;
  addToOutput((isCrit? '*** CRITICAL HIT! *** ':'') + `You hit for ${damage} damage. (Stamina -${staminaDrain})`);
  const essenceDrain = Math.max(0, damage - 2);
  if (player.essence >= essenceDrain) player.essence = Math.max(0, player.essence - essenceDrain);
  else {
    const used = player.essence;
    player.essence = 0;
    addToOutput(`You lacked Essence; used ${used} instead of ${essenceDrain}.`);
  }
  if (e.health <= 0) handleEnemyDefeat();
  else enemyTurn();
  core.updateUI();
}

export function performRangedAttack() {
  if (!core.currentEnemy) { addToOutput('No enemy to attack.'); return; }
  const e = core.currentEnemy;
  const {min,max} = computeMeleeRange();
  let damage = randInt(min,max);
  const isCrit = Math.random() < player.critChanceFlat;
  if (isCrit) damage = Math.round(damage * 1.75);
  damage += player.baseDamageBonus;
  addToOutput((isCrit? '*** CRITICAL HIT! *** ':'') + `You fire a ranged shot for ${damage} damage.`);
  e.health -= damage;
  if (e.health <= 0) handleEnemyDefeat();
  else {
    const dodgeChance = 0.15;
    if (Math.random() < dodgeChance) {
      addToOutput('Your ranged stance allows quick evasion — you dodge the counterattack!');
    } else {
      enemyTurn();
    }
  }
  core.updateUI();
}

export function enemyTurn() {
  const e = core.currentEnemy;
  if (!e) return;
  if (e.abilities && e.abilities.length > 0 && e.essence > 0) {
    if (Math.random() < 0.35) {
      const idx = Math.floor(Math.random() * e.abilities.length);
      const id = e.abilities[idx];
      if (id === 'despair') {
        const cost = 20;
        if (e.essence >= cost) {
          e.essence -= cost;
          player._despairTurns = Math.max(player._despairTurns || 0, 2);
          addToOutput(`The ${e.name} utters a maddening wail. Your strikes feel dull — damage -15% for 2 turns. (Enemy Essence -${cost})`);
        }
      } else if (id === 'lunge') {
        const cost = 15;
        if (e.essence >= cost) {
          e.essence -= cost;
          const raw = randInt(e.minDamage, e.maxDamage);
          const damage = Math.round(raw * 1.3);
          player.health = Math.max(0, player.health - damage);
          addToOutput(`The ${e.name} lunges with feral craving, dealing ${damage} damage. (Enemy Essence -${cost})`);
        }
      } else if (id === 'reinforce') {
        e._reinforceTurns = Math.max(e._reinforceTurns || 0, 2);
        addToOutput(`The ${e.name} hardens its form. Incoming damage to the creature is reduced for 2 turns.`);
      }
      if (Math.random() < 0.5) {
        decrementTurnFlags();
        core.updateUI();
        return;
      }
    }
  }
  enemyCounterattack();
  decrementTurnFlags();
  core.updateUI();
}

export function enemyCounterattack() {
  const e = core.currentEnemy;
  if (!e) return;
  if (player.dodgeReady) {
    player.dodgeReady = false;
    if (Math.random() < 0.15) {
      addToOutput("You phase and evade the enemy's strike.");
      return;
    }
  }
  const raw = randInt(e.minDamage, e.maxDamage);
  const ENEMY_ATTACK_ESSENCE_COST = 10;
  let dmg = raw;
  if (e.essence >= ENEMY_ATTACK_ESSENCE_COST) {
    e.essence = Math.max(0, e.essence - ENEMY_ATTACK_ESSENCE_COST);
  } else {
    dmg = Math.round(dmg * 0.5);
    e.essence = 0;
  }
  if (player.damageReduction && player.damageReduction > 0) {
    dmg = Math.round(dmg * (1 - player.damageReduction));
  }
  player.health = Math.max(0, player.health - dmg);
  addToOutput(`The ${e.name} strikes back for ${dmg} damage.`);
  if (player.health <= 0) addToOutput('*** Your nightmare is over. ***');
}

function decrementTurnFlags() {
  if (player._despairTurns && player._despairTurns > 0) player._despairTurns--;
  if (player._reinforceTurns && player._reinforceTurns > 0) player._reinforceTurns--;
  const e = core.currentEnemy;
  if (e && e._reinforceTurns && e._reinforceTurns > 0) e._reinforceTurns--;
}

export function handleEnemyDefeat() {
  const e = core.currentEnemy;
  if (!e) return;
  addToOutput(`The ${e.name} dissolves. You absorb ${e.essence} Essence.`);
  player.essence = Math.min(player.maxEssence, player.essence + e.essence);
  const xpGain = e.xp || 0;
  core.gainXP(xpGain);
  if (Math.random() < 0.20) {
    const mem = memories.generateMemory(e.tier || 0);
    player.inventory.push(mem);
    if (mem.type && mem.type !== 'consumable') {
      if (mem.effect.baseDamage) player.baseDamageBonus += mem.effect.baseDamage;
      if (mem.effect.critChance) player.critChanceFlat += mem.effect.critChance;
      if (mem.effect.maxHealth) { player.maxHealth += mem.effect.maxHealth; player.health = Math.min(player.maxHealth, player.health + mem.effect.maxHealth); }
    }
    addToOutput(`*** MEMORY ACQUIRED! *** You found ${mem.name}`);
  } else {
    addToOutput('No memories imprinted this time.');
  }
  const base = 0.01;
  const tierBonus = (e.tier || 0) * 0.05;
  const acc = (player.trueNameAccumulatedChance || 0) / 100.0;
  const trueChance = base + tierBonus + acc;
  if (!player.trueName && Math.random() < trueChance) {
    player.trueName = player.aspect ? `${player.aspect} True` : 'Revealed Name';
    addToOutput('*** TRUE NAME REVEALED! *** ' + (player.trueName || 'A True Name is revealed.'));
  }
  player.trueNameAccumulatedChance = (player.trueNameAccumulatedChance || 0) + 0.25;
  core.currentEnemy = null;
  core.checkLevelUp();
  core.saveGame?.();
  core.updateUI();
}
