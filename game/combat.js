// combat.js — attack rules, stamina/essence drains, crits, ranged dodge, enemy ability behaviour
import * as core from './core.js';
import { addToOutput } from './ui.js';
import * as memories from './memories.js';

const player = core.player;

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

// compute melee range factoring tier
export function computeMeleeRange() {
  const min = 7 + player.tier*10;
  const max = 18 + player.tier*10;
  return {min,max};
}

// apply active temporary debuffs on player (despair)
function playerDamageMultiplier() {
  let mul = 1.0;
  if (player._despairTurns && player._despairTurns > 0) mul *= 0.85; // -15%
  if (player.nextAttackBuffed) { mul *= 2; player.nextAttackBuffed = false; }
  if (player.damageBoost) { mul *= player.damageBoost; player.damageBoost = 1; }
  return mul;
}

// apply enemy reinforcement: reduce incoming damage to enemy
function enemyIncomingMultiplier(e) {
  return (e._reinforceTurns && e._reinforceTurns > 0) ? 0.85 : 1.0;
}

// PERFORM MELEE ATTACK (considers stamina, essence drain)
export function performMeleeAttack() {
  if (!core.currentEnemy) { addToOutput('No enemy to attack.'); return; }
  const e = core.currentEnemy;
  const {min,max} = computeMeleeRange();
  let damage = randInt(min,max);
  const isCrit = Math.random() < player.critChanceFlat;
  if (isCrit) damage = Math.round(damage * 1.75);
  // stamina drain = damage - 2 (min 1)
  const staminaDrain = Math.max(1, damage - 2);
  player.stamina = Math.max(0, player.stamina - staminaDrain);
  if (player.stamina <= 0) {
    damage = Math.round(damage * 0.65);
    addToOutput('You are exhausted — damage reduced by 35%.');
  }
  damage += player.baseDamageBonus;
  // account for despair, buffs
  const mul = playerDamageMultiplier();
  damage = Math.round(damage * mul);
  // enemy reinforcement reduces incoming
  damage = Math.round(damage * enemyIncomingMultiplier(e));
  e.health -= damage;
  addToOutput((isCrit? '*** CRITICAL HIT! *** ':'') + `You hit for ${damage} damage. (Stamina -${staminaDrain})`);
  // consume essence proportional to damage per doc: drain = damage - 2 (minimum 1), but for aspects different
  const essenceDrain = Math.max(0, damage - 2);
  if (player.essence >= essenceDrain) player.essence = Math.max(0, player.essence - essenceDrain);
  else {
    const used = player.essence;
    player.essence = 0;
    addToOutput(`You lacked Essence; used ${used} instead of ${essenceDrain}.`);
  }
  // check enemy death
  if (e.health <= 0) handleEnemyDefeat();
  else enemyTurn();
  core.updateUI();
}

// PERFORM RANGED ATTACK
export function performRangedAttack() {
  if (!core.currentEnemy) { addToOutput('No enemy to attack.'); return; }
  const e = core.currentEnemy;
  const {min,max} = computeMeleeRange();
  let damage = randInt(min,max);
  const isCrit = Math.random() < player.critChanceFlat;
  if (isCrit) damage = Math.round(damage * 1.75);
  damage += player.baseDamageBonus;
  // ranged dodges counterattack 15% chance
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

// enemy decides and acts (abilities + counterattack). Called after player actions when enemy still alive.
export function enemyTurn() {
  const e = core.currentEnemy;
  if (!e) return;
  // decrement player/debuff durations at start of enemy turn handled after attack; we'll decrement at end of this function.
  // Enemy may choose to use one of its abilities if it has essence and ability entries
  if (e.abilities && e.abilities.length > 0 && e.essence > 0) {
    // small chance to use an ability: 35%
    if (Math.random() < 0.35) {
      const idx = Math.floor(Math.random() * e.abilities.length);
      const id = e.abilities[idx];
      // handle ability id
      if (id === 'despair') {
        // enemy drains 20 essence, apply -15% player damage for 2 turns
        const cost = 20;
        if (e.essence >= cost) {
          e.essence -= cost;
          player._despairTurns = Math.max(player._despairTurns || 0, 2);
          addToOutput(`The ${e.name} utters a maddening wail. Your strikes feel dull — damage -15% for 2 turns. (Enemy Essence -${cost})`);
        }
      } else if (id === 'lunge') {
        // lunge: spend 15 essence to do a heavy attack now (+30% damage)
        const cost = 15;
        if (e.essence >= cost) {
          e.essence -= cost;
          const raw = randInt(e.minDamage, e.maxDamage);
          const damage = Math.round(raw * 1.3);
          player.health = Math.max(0, player.health - damage);
          addToOutput(`The ${e.name} lunges with feral craving, dealing ${damage} damage. (Enemy Essence -${cost})`);
        }
      } else if (id === 'reinforce') {
        // reinforcement: spend 0 essence but set reinforce turns
        e._reinforceTurns = Math.max(e._reinforceTurns || 0, 2);
        addToOutput(`The ${e.name} hardens its form. Incoming damage to the creature is reduced for 2 turns.`);
      }
      // if ability used, continue to reduce durations later, and maybe skip a normal attack
      // small chance ability replaces normal attack
      if (Math.random() < 0.5) {
        decrementTurnFlags(); // still decrement durations
        core.updateUI();
        return;
      }
    }
  }
  // standard enemy attack
  enemyCounterattack();
  // decrement turn flags at end
  decrementTurnFlags();
  core.updateUI();
}

// enemy counterattack (normal attack)
export function enemyCounterattack() {
  const e = core.currentEnemy;
  if (!e) return;
  // early: if player has dodgeReady (Shadow Step / Seer), evaluate dodge
  if (player.dodgeReady) {
    player.dodgeReady = false;
    if (Math.random() < 0.15) { // 15% passive dodge (T1 as doc says 15%)
      addToOutput("You phase and evade the enemy's strike.");
      return;
    } // else falls through
  }
  // base damage
  const raw = randInt(e.minDamage, e.maxDamage);
  // if enemy has essence, consumes some per attack (optional)
  const ENEMY_ATTACK_ESSENCE_COST = 10;
  let dmg = raw;
  if (e.essence >= ENEMY_ATTACK_ESSENCE_COST) {
    e.essence = Math.max(0, e.essence - ENEMY_ATTACK_ESSENCE_COST);
  } else {
    dmg = Math.round(dmg * 0.5); // essence-depleted penalty
    e.essence = 0;
  }
  // player damage reduction buffs (from Sun Longing, Superhuman defense, etc.)
  if (player.damageReduction && player.damageReduction > 0) {
    dmg = Math.round(dmg * (1 - player.damageReduction));
  }
  // apply damage
  player.health = Math.max(0, player.health - dmg);
  addToOutput(`The ${e.name} strikes back for ${dmg} damage.`);
  if (player.health <= 0) {
    addToOutput('*** Your nightmare is over. ***');
  }
}

// decrement turn counters for temporary effects
function decrementTurnFlags() {
  if (player._despairTurns && player._despairTurns > 0) player._despairTurns--;
  if (player._reinforceTurns && player._reinforceTurns > 0) player._reinforceTurns--; // if any (rare)
  // enemy reinforce turns
  const e = core.currentEnemy;
  if (e && e._reinforceTurns && e._reinforceTurns > 0) e._reinforceTurns--;
  // avatar/double attack flags are triggered by abilities; do not auto-clear here unless you want single-use.
}

// handle enemy defeat: xp, essence, memory drops, true name chance, save
export function handleEnemyDefeat() {
  const e = core.currentEnemy;
  if (!e) return;
  addToOutput(`The ${e.name} dissolves. You absorb ${e.essence} Essence.`);
  player.essence = Math.min(player.maxEssence, player.essence + e.essence);
  // grant xp
  const xpGain = e.xp || 0;
  core.gainXP(xpGain);
  // memory drop: base 20% (configurable); bow chance handled inside memories generator optionally
  if (Math.random() < 0.20) {
    const mem = memories.generateMemory(e.tier || 0);
    player.inventory.push(mem);
    // apply permanent memories immediately if desired
    if (mem.type && mem.type !== 'consumable') {
      if (mem.effect.baseDamage) player.baseDamageBonus += mem.effect.baseDamage;
      if (mem.effect.critChance) player.critChanceFlat += mem.effect.critChance;
      if (mem.effect.maxHealth) { player.maxHealth += mem.effect.maxHealth; player.health = Math.min(player.maxHealth, player.health + mem.effect.maxHealth); }
    }
    addToOutput(`*** MEMORY ACQUIRED! *** You found ${mem.name}`);
  } else {
    addToOutput('No memories imprinted this time.');
  }
  // true name chance: 1% base + 5% * enemyTier + accumulated per-battle (.25%)
  const base = 0.01;
  const tierBonus = (e.tier || 0) * 0.05;
  const acc = (player.trueNameAccumulatedChance || 0) / 100.0;
  const trueChance = base + tierBonus + acc;
  if (!player.trueName && Math.random() < trueChance) {
    player.trueName = player.aspect ? `${player.aspect} True` : 'Revealed Name';
    addToOutput('*** TRUE NAME REVEALED! *** ' + (player.trueName || 'A True Name is revealed.'));
  }
  // increase accumulated chance by 0.25% after each battle
  player.trueNameAccumulatedChance = (player.trueNameAccumulatedChance || 0) + 0.25;
  core.currentEnemy = null;
  core.checkLevelUp();
  core.saveGame?.();
  core.updateUI();
}
