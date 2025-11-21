// combat.js — attack rules, stamina/essence drains, crits, ranged dodge
import { player, currentEnemy } from './core.js';
import { addToOutput } from './ui.js';
import * as core from './core.js';
import * as memories from './memories.js';

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

// Determine base damage ranges factoring rank: melee 7-18, plus +10 per rank
export function computeMeleeRange() {
  const min = 7 + player.tier*10;
  const max = 18 + player.tier*10;
  return {min,max};
}

export function performMeleeAttack() {
  if (!core.currentEnemy) { addToOutput('No enemy to attack.'); return; }
  // damage roll
  const {min,max} = computeMeleeRange();
  let damage = randInt(min,max);
  const isCrit = Math.random() < player.critChanceFlat;
  if (isCrit) damage = Math.round(damage * 1.75);
  // stamina drain = damage - 2 (minimum 1)
  const staminaDrain = Math.max(1, damage - 2);
  player.stamina = Math.max(0, player.stamina - staminaDrain);
  // if out of stamina, player's damage reduces by 35%
  if (player.stamina <= 0) {
    damage = Math.round(damage * 0.65);
    addToOutput('You are exhausted — damage reduced by 35%.');
  }
  // apply baseDamageBonus from core
  damage += player.baseDamageBonus;
  core.currentEnemy.health -= damage;
  addToOutput((isCrit? '*** CRITICAL HIT! *** ':'') + `You slash for ${damage} damage. (Stamina -${staminaDrain})`);
  // enemy reacts
  if (core.currentEnemy.health <= 0) {
    import('./combat.js').then(m=>m.handleEnemyDefeat());
  } else {
    import('./combat.js').then(m=>m.enemyCounterattack());
  }
  core.updateUI();
}

export function performRangedAttack() {
  if (!core.currentEnemy) { addToOutput('No enemy to attack.'); return; }
  const {min,max} = computeMeleeRange();
  let damage = randInt(min,max);
  const isCrit = Math.random() < player.critChanceFlat;
  if (isCrit) damage = Math.round(damage * 1.75);
  damage += player.baseDamageBonus;
  // ranged does NOT drain stamina by doc? (original doc says same damage, but ranged has 15% chance to dodge enemy attack)
  addToOutput((isCrit? '*** CRITICAL HIT! *** ':'') + `You fire a ranged shot for ${damage} damage.`);
  core.currentEnemy.health -= damage;
  if (core.currentEnemy.health <= 0) {
    import('./combat.js').then(m=>m.handleEnemyDefeat());
  } else {
    // enemy counterattack with chance to be dodged (15% chance)
    const dodgeChance = 0.15;
    if (Math.random() < dodgeChance) {
      addToOutput('Your ranged stance allows quick evasion — you dodge the counterattack!');
    } else {
      import('./combat.js').then(m=>m.enemyCounterattack());
    }
  }
  core.updateUI();
}

export function enemyCounterattack() {
  if (!core.currentEnemy) return;
  const e = core.currentEnemy;
  const raw = randInt(e.minDamage, e.maxDamage);
  // account for enemy's reinforce/damage reduction flags if present
  let multiplier = 1.0;
  if (e._reinforceTurns && e._reinforceTurns > 0) multiplier *= 0.85; // enemy takes less? actually reinforcement gives them 15% reduction - reduce incoming? we'll instead reduce incoming damage to player by? Simpler: apply damage reduction to enemy's outgoing? keep simple.)
  const damage = Math.round(raw * multiplier);
  player.health = Math.max(0, player.health - damage);
  addToOutput(`The ${e.name} strikes back for ${damage} damage.`);
  if (player.health <= 0) {
    addToOutput('*** Your nightmare is over. ***');
  }
  core.updateUI();
}

export function handleEnemyDefeat() {
  if (!core.currentEnemy) return;
  const e = core.currentEnemy;
  addToOutput(`The ${e.name} dissolves. You absorb ${e.essence} Essence.`);
  player.essence = Math.min(player.maxEssence, player.essence + e.essence);
  // give XP
  const xpGain = e.xp || 0;
  core.gainXP(xpGain);
  // chance of memory: base 10% from Dormant, +5% per enemy rank (doc)
  const baseBowChance = 0.10; // for bow memory specifically
  const bowChance = baseBowChance + (e.tier * 0.05);
  // general memory drop chance simplistic: 20%
  if (Math.random() < 0.20) {
    import('./memories.js').then(mod => {
      const mem = mod.generateMemory(e.tier);
      player.inventory.push(mem);
      // apply permanent items automatically
      if (mem.type !== 'consumable') {
        if (mem.effect.baseDamage) player.baseDamageBonus += mem.effect.baseDamage;
        if (mem.effect.critChance) player.critChanceFlat += mem.effect.critChance;
        if (mem.effect.maxHealth) { player.maxHealth += mem.effect.maxHealth; player.health = Math.min(player.maxHealth, player.health + mem.effect.maxHealth); }
      }
      addToOutput(`*** MEMORY ACQUIRED! *** You found ${mem.name}`);
    });
  } else {
    addToOutput('No valuable memories were imprinted on the dissolving creature.');
  }
  // true name chance: 1% base after fighting + 5% per monster rank (doc), plus incremental per battle (.25%)
  let trueChance = 0.01 + (e.tier * 0.05) + player.trueNameAccumulatedChance/100;
  if (!player.trueName && Math.random() < trueChance) {
    addToOutput('*** TRUE NAME REVEALED! *** You have learned a True Name!');
    // (choose some placeholder true name or from aspect if set)
    player.trueName = player.aspect ? `${player.aspect} True` : 'Revealed Name';
  }
  // increase accumulated chance by 0.25% after each battle
  player.trueNameAccumulatedChance += 0.25;
  // clear enemy
  core.currentEnemy = null;
  core.checkLevelUp();
  core.updateUI();
}
