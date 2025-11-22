// combat.js — combat logic; returns strings or array-of-frames
import * as Core from './core.js';
import * as Memories from './memories.js';

function randInt(min,max){ return Math.floor(Math.random()*(max-min+1))+min; }

function rollCrit() { return Math.random() < (Core.player.critChanceFlat || 0); }
function rollEvasion(evasion) { return Math.random() < (evasion || 0); }

export function performMeleeAttack() {
  if (!Core.currentEnemy) return "No enemy to attack.";
  const e = Core.currentEnemy;
  const min = 7 + Core.player.tier*10;
  const max = 18 + Core.player.tier*10;
  let damage = randInt(min,max) + Core.player.baseDamageBonus;
  const isCrit = rollCrit();
  if (isCrit) damage = Math.round(damage * (Core.player.critMultiplier || 1.75));
  if (Core.player._despairTurns && Core.player._despairTurns>0) damage = Math.round(damage * 0.85);
  if (Core.player.nextAttackBuffed) { damage = damage * 2; Core.player.nextAttackBuffed = false; }

  Core.player.stamina = Math.max(0, Core.player.stamina - Math.max(1, Math.floor(damage/3)));
  Core.player.essence = Math.max(0, Core.player.essence - Math.max(0, Math.floor(damage/4)));

  e.health -= damage;

  const frames = [`You ready your blade...`, `You strike!`, isCrit ? `*** CRITICAL! ${damage} damage! ***` : `You hit for ${damage} damage.`];

  if (e.health <= 0) {
    const out = handleEnemyDefeat();
    return frames.concat([out]);
  } else {
    const enemyRes = enemyTurn();
    return frames.concat([enemyRes]);
  }
}

export function performRangedAttack() {
  if (!Core.currentEnemy) return "No enemy to attack.";
  const e = Core.currentEnemy;
  const min = 7 + Core.player.tier*10;
  const max = 18 + Core.player.tier*10;
  let damage = randInt(min,max) + Core.player.baseDamageBonus;
  const isCrit = rollCrit();
  if (isCrit) damage = Math.round(damage * (Core.player.critMultiplier || 1.75));
  e.health -= damage;
  Core.player.essence = Math.max(0, Core.player.essence - Math.max(0, Math.floor(damage/4)));
  const frames = [`You fire...`, isCrit ? `*** RANGED CRIT! ${damage} ***` : `You hit for ${damage}.`];
  if (e.health <= 0) return frames.concat([ handleEnemyDefeat() ]);
  const enemyRes = enemyTurn();
  return frames.concat([enemyRes]);
}

export function enemyTurn() {
  const e = Core.currentEnemy;
  if (!e) return "No enemy present.";
  // ability chance
  if (e.abilities && e.abilities.length && e.essence > 0 && Math.random() < 0.35) {
    const id = e.abilities[Math.floor(Math.random()*e.abilities.length)];
    if (id === 'despair' && e.essence >= 20) {
      e.essence -= 20;
      Core.player._despairTurns = Math.max(Core.player._despairTurns || 0, 2);
      return `The ${e.name} utters a maddening wail — your strikes hurt less for 2 turns.`;
    } else if (id === 'lunge' && e.essence >= 15) {
      e.essence -= 15;
      const dmg = Math.round(randInt(e.minDamage,e.maxDamage) * 1.3);
      Core.player.health = Math.max(0, Core.player.health - dmg);
      return `The ${e.name} lunges for ${dmg} damage!`;
    } else if (id === 'reinforce') {
      e._reinforceTurns = Math.max(e._reinforceTurns||0,2);
      return `The ${e.name} hardens; it will take less damage for 2 turns.`;
    }
  }
  // normal attack
  const attack = randInt(e.minDamage,e.maxDamage);
  const playerEvade = (Core.player.evasionFlat || 0) + (Core.player.dodgeReady ? 0.15 : 0);
  if (rollEvasion(playerEvade)) {
    Core.player.dodgeReady = false;
    return `You evade the ${e.name}'s attack!`;
  }
  let final = attack;
  if (Core.player.damageReduction && Core.player.damageReduction > 0) final = Math.round(final * (1 - Core.player.damageReduction));
  Core.player.health = Math.max(0, Core.player.health - final);
  return `The ${e.name} hits you for ${final} damage.`;
}

export function handleEnemyDefeat() {
  const e = Core.currentEnemy;
  if (!e) return "No enemy to defeat.";
  Core.player.essence = Math.min(Core.player.maxEssence, Core.player.essence + e.essence);
  Core.gainXP(e.xp || 0);
  // memory / legendary
  let msg = `The ${e.name} dissolves. You absorb ${e.essence} Essence.`;
  if (Math.random() < (e.rarity === 'miniboss' ? 0.6 : 0.20)) {
    const mem = Memories.generateMemory(e.tier || 0, e.rarity || 'common');
    Core.player.inventory.push(mem);
    msg += `\n*** MEMORY ACQUIRED! *** ${mem.name} (${mem.rarity||'common'})`;
  } else {
    msg += `\nNo memories imprinted this time.`;
  }
  Core.player.trueNameAccumulatedChance = (Core.player.trueNameAccumulatedChance || 0) + 0.25;
  Core.currentEnemy = null;
  Core.checkLevelUp();
  Core.saveGame();
  return msg;
}

export function useAspectAbility(aspectKey, ability) {
  if (!ability) return "Ability not found.";
  switch (ability.key) {
    case 'shadow_slave':
      Core.player.nextAttackBuffed = true;
      return "Shadows gather. Your next attacks are doubled for 2 turns.";
    case 'shadow_step':
      Core.player.dodgeReady = true;
      return "You step into shadow — you'll attempt to evade the next attack.";
    case 'shadow_avatar':
      Core.player.doubleAttackReady = true;
      return "A shadow avatar rises — you'll strike twice on your next attack.";
    case 'soul_flame':
      if (Core.currentEnemy) { Core.player.nextAttackBuffed = true; return "Soul Flame: next attack doubled."; }
      Core.player.health = Math.min(Core.player.maxHealth, Core.player.health + 40);
      return "Soul Flame: healed 40 HP.";
    case 'flame_manipulation':
      if (!Core.currentEnemy) return "No target.";
      const dmg = randInt(15,25) + Core.player.baseDamageBonus;
      Core.currentEnemy.health -= dmg;
      if (Core.currentEnemy.health <= 0) return handleEnemyDefeat();
      return `You launched a fireball dealing ${dmg} damage.`;
    case 'split_personality':
      if (!Core.currentEnemy) return "No target.";
      const min = 7 + Core.player.tier*10, max = 18 + Core.player.tier*10;
      let d1 = randInt(min,max)+Core.player.baseDamageBonus;
      let d2 = randInt(min,max)+Core.player.baseDamageBonus;
      Core.currentEnemy.health -= (d1+d2);
      if (Core.currentEnemy.health <= 0) return handleEnemyDefeat();
      return `You split and strike twice for ${d1} and ${d2} damage (total ${d1+d2}).`;
    default:
      return `${ability.name} activated.`;
  }
}

/* ✔ ADD THIS: unified attack command */
export function attack() {
  return performMeleeAttack();
}
