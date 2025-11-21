// combat.js — attacks, crits, evasion, aspect ability resolution, text animations
import * as Core from './core.js';
import { addToOutput, animateTextFrames } from './ui.js';
import * as Memories from './memories.js';

const player = Core.player;

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

export function computeMeleeRange() {
  const min = 7 + player.tier*10;
  const max = 18 + player.tier*10;
  return {min,max};
}

function rollCrit() {
  return Math.random() < (player.critChanceFlat || 0);
}

function rollEvasion(targetEvasion) {
  const ev = (targetEvasion || 0);
  return Math.random() < ev;
}

// main melee attack
export function performMeleeAttack() {
  if (!Core.currentEnemy) { addToOutput('No enemy to attack.'); return; }
  const e = Core.currentEnemy;
  const {min,max} = computeMeleeRange();
  let damage = randInt(min,max);
  const isCrit = rollCrit();
  if (isCrit) damage = Math.round(damage * (player.critMultiplier || 1.75));
  damage += player.baseDamageBonus;
  // apply buffs and despair
  if (player._despairTurns && player._despairTurns>0) damage = Math.round(damage * 0.85);
  if (player.nextAttackBuffed) { damage = damage * 2; player.nextAttackBuffed = false; }
  // apply enemy reinforcement reduction
  if (e._reinforceTurns && e._reinforceTurns>0) damage = Math.round(damage * 0.85);

  // animate
  animateTextFrames([
    `You prepare your strike...`,
    `You lunge forward!`,
    isCrit ? `*** CRITICAL! ${damage} damage! ***` : `You hit for ${damage} damage.`
  ], 180);

  e.health -= damage;
  // stamina & essence drains
  const staminaDrain = Math.max(1, Math.floor(damage / 2));
  player.stamina = Math.max(0, player.stamina - staminaDrain);
  player.essence = Math.max(0, player.essence - Math.max(0, Math.floor(damage/4)));

  if (e.health <= 0) {
    handleEnemyDefeat();
  } else {
    enemyTurn();
  }
  Core.tickCooldowns();
  Core.updateUI();
}

// ranged attack with dodge chance on counterattack
export function performRangedAttack() {
  if (!Core.currentEnemy) { addToOutput('No enemy to attack.'); return; }
  const e = Core.currentEnemy;
  const {min,max} = computeMeleeRange();
  let damage = randInt(min,max);
  const isCrit = rollCrit();
  if (isCrit) damage = Math.round(damage * (player.critMultiplier || 1.75));
  damage += player.baseDamageBonus;

  animateTextFrames([`You take aim...`, `Arrow flies!`, isCrit ? `*** RANGED CRIT! ${damage} damage! ***` : `You hit for ${damage} damage.`], 160);
  e.health -= damage;
  if (e.health <= 0) handleEnemyDefeat();
  else {
    // 15% dodge chance to avoid enemy counterattack
    if (Math.random() < 0.15) {
      addToOutput('Your range stance lets you evade the counterattack!');
    } else {
      enemyTurn();
    }
  }
  Core.tickCooldowns();
  Core.updateUI();
}

// enemy decides and acts
export function enemyTurn() {
  const e = Core.currentEnemy;
  if (!e) return;
  // enemy tries to use ability sometimes
  if (e.abilities && e.abilities.length && e.essence > 0 && Math.random() < 0.35) {
    const id = e.abilities[Math.floor(Math.random()*e.abilities.length)];
    if (id === 'despair' && e.essence >= 20) {
      e.essence -= 20;
      player._despairTurns = Math.max(player._despairTurns || 0, 2);
      addToOutput(`The ${e.name} whispers dread — your strikes feel dull for 2 turns.`);
      Core.tickCooldowns();
      Core.updateUI();
      return;
    } else if (id === 'lunge' && e.essence >= 15) {
      e.essence -= 15;
      const raw = randInt(e.minDamage,e.maxDamage);
      const dmg = Math.round(raw * 1.3);
      addToOutput(`The ${e.name} lunges desperately for ${dmg} damage!`);
      player.health = Math.max(0, player.health - dmg);
      Core.tickCooldowns();
      Core.updateUI();
      return;
    } else if (id === 'reinforce') {
      e._reinforceTurns = Math.max(e._reinforceTurns || 0, 2);
      addToOutput(`The ${e.name} hardens; it will take reduced damage for 2 turns.`);
      Core.tickCooldowns();
      Core.updateUI();
      return;
    }
  }
  // normal attack with player's evasion considered
  const enemyAttack = randInt(e.minDamage,e.maxDamage);
  // player evasion
  const playerEvade = (player.evasionFlat || 0) + (player.dodgeReady ? 0.15 : 0);
  if (rollEvasion(playerEvade)) {
    addToOutput('You evade the enemy attack!');
    player.dodgeReady = false;
    Core.tickCooldowns();
    Core.updateUI();
    return;
  }
  // apply player damage reduction
  let final = enemyAttack;
  if (player.damageReduction && player.damageReduction > 0) final = Math.round(final * (1 - player.damageReduction));
  player.health = Math.max(0, player.health - final);
  addToOutput(`The ${e.name} hits you for ${final} damage.`);
  Core.tickCooldowns();
  Core.updateUI();
}

// handle defeat
export function handleEnemyDefeat() {
  const e = Core.currentEnemy;
  if (!e) return;
  addToOutput(`The ${e.name} dissolves. You absorb ${e.essence} Essence.`);
  player.essence = Math.min(player.maxEssence, player.essence + e.essence);
  Core.gainXP(e.xp || 0);
  // memory / legendary drop chance
  if (Math.random() < 0.20) {
    const mem = Memories.generateMemory(e.tier || 0);
    player.inventory.push(mem);
    if (mem.rarity === 'legendary') addToOutput('*** LEGENDARY MEMORY ACQUIRED! *** ' + mem.name);
    else addToOutput(`*** MEMORY ACQUIRED! *** You found ${mem.name}`);
  } else {
    addToOutput('No memories imprinted this time.');
  }
  // true name chance incremental
  const base = 0.01;
  const tierBonus = (e.tier || 0) * 0.05;
  const acc = (player.trueNameAccumulatedChance || 0) / 100.0;
  const trueChance = base + tierBonus + acc;
  if (!player.trueName && Math.random() < trueChance) {
    player.trueName = player.aspect ? `${player.aspect} True` : 'Revealed Name';
    addToOutput('*** TRUE NAME REVEALED! *** ' + player.trueName);
  }
  player.trueNameAccumulatedChance = (player.trueNameAccumulatedChance || 0) + 0.25;
  Core.currentEnemy = null;
  Core.checkLevelUp();
  Core.updateUI();
}

// apply aspect ability
export function useAspectAbility(aspectKey, ability) {
  // ability: {key,name,desc,cost,cooldown,type}
  if (!ability) { addToOutput('Ability not found.'); return; }
  if (player.essence < (ability.cost || 0)) { addToOutput('Not enough Essence to use ability.'); return; }
  // consume cost already deducted by commands; apply effects
  switch (ability.key) {
    // Shadow
    case 'shadow_slave':
      player.nextAttackBuffed = true;
      addToOutput('Shadows gather — your next attacks deal double damage for 2 turns.');
      break;
    case 'shadow_step':
      player.dodgeReady = true;
      addToOutput('You step into the shadow; you will attempt to evade the next attack.');
      break;
    case 'shadow_avatar':
      player.doubleAttackReady = true;
      addToOutput('A shadowy avatar stands beside you — you will strike twice next turn.');
      break;

    // Sun
    case 'soul_flame':
      // choice: buff or heal — for simplicity buff if in combat, heal if not
      if (Core.currentEnemy) {
        player.nextAttackBuffed = true;
        addToOutput('Soul Flame: your next attack will be doubled by light.');
      } else {
        player.health = Math.min(player.maxHealth, player.health + 40);
        addToOutput('Soul Flame: you are healed for 40 HP.');
      }
      break;
    case 'flame_manipulation':
      if (!Core.currentEnemy) { addToOutput('No target.'); return; }
      const dmg = randInt(15,25) + player.baseDamageBonus;
      Core.currentEnemy.health -= dmg;
      addToOutput(`You launch a blazing fireball for ${dmg} damage.`);
      if (Core.currentEnemy.health <= 0) handleEnemyDefeat();
      break;

    // Mirror
    case 'split_personality':
      if (!Core.currentEnemy) { addToOutput('No target.'); return; }
      // two attacks
      addToOutput('You split and strike twice!');
      performMeleeAttack();
      if (Core.currentEnemy) performMeleeAttack();
      break;

    // Superhuman & others: simplified actions
    case 'overpower':
      player.damageBoost = 1.25;
      addToOutput('You feel stronger: 25% increased damage for 2 turns.');
      break;

    default:
      addToOutput(`${ability.name} activated (effect TBD).`);
  }
  Core.tickCooldowns();
  Core.updateUI();
}
