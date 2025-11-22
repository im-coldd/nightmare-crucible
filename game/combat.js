// combat.js — combat logic; returns string or array-of-frames
import * as Core from './core.js';
import * as Memories from './memories.js';
import { generateSeekEnemy } from './enemies.js';

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
  // apply despair / buffs
  if (Core.player._despairTurns && Core.player._despairTurns>0) damage = Math.round(damage * 0.85);
  if (Core.player.nextAttackBuffed) { damage = damage * 2; Core.player.nextAttackBuffed = false; }

  // stamina/essence drains
  Core.player.stamina = Math.max(0, Core.player.stamina - Math.max(1, Math.floor(damage/3)));
  Core.player.essence = Math.max(0, Core.player.essence - Math.max(0, Math.floor(damage/4)));

  e.health -= damage;

  // animate frames (UI will detect array)
  const frames = [`You prepare to strike...`, `You strike!`, isCrit ? `*** CRITICAL — ${damage} dmg! ***` : `You hit for ${damage} damage.`];

  if (e.health <= 0) {
    // defeat flow
    const out = handleEnemyDefeat();
    return frames.concat([out]);
  } else {
    // enemy turn
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
  const frames = [`You take aim...`, `Arrow flies!`, isCrit ? `*** RANGED CRIT ${damage}! ***` : `You hit for ${damage}.`];
  if (e.health <= 0) { return frames.concat([ handleEnemyDefeat() ]); }
  // 15% evade on ranged counter chance handled in enemyTurn
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
      return `The ${e.name} wails—your strikes feel dull for 2 turns.`;
    } else if (id === 'lunge' && e.essence >= 15) {
      e.essence -= 15;
      const dmg = Math.round(randInt(e.minDamage,e.maxDamage) * 1.3);
      Core.player.health = Math.max(0, Core.player.health - dmg);
      return `The ${e.name} lunges and deals ${dmg} damage.`;
    } else if (id === 'reinforce') {
      e._reinforceTurns = Math.max(e._reinforceTurns||0,2);
      return `The ${e.name} hardens and will take reduced damage for 2 turns.`;
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
  // true name accumulation
  Core.player.trueNameAccumulatedChance = (Core.player.trueNameAccumulatedChance || 0) + 0.25;
  Core.currentEnemy = null;
  Core.checkLevelUp();
  Core.saveGame();
  return msg;
}

// Apply Aspect ability effects (returns string)
export function useAspectAbility(aspectKey, ability) {
  // perform ability effects; ability object contains key & type
  if (!ability) return "Ability not found.";
  // some generic examples:
  switch (ability.key) {
    case 'shadow_slave':
      Core.player.nextAttackBuffed = true;
      return "Shadows gather. Your next attacks will be doubled for 2 turns.";
    case 'shadow_step':
      Core.player.dodgeReady = true;
      return "You slip into shadow; you'll attempt to evade the next attack.";
    case 'shadow_avatar':
      Core.player.doubleAttackReady = true;
      return "A shadow avatar rises — you'll strike twice on your next attack.";
    case 'soul_flame':
      if (Core.currentEnemy) { Core.player.nextAttackBuffed = true; return "Soul Flame: your next attack will be doubled."; }
      Core.player.health = Math.min(Core.player.maxHealth, Core.player.health + 40);
      return "Soul Flame: healed 40 HP.";
    case 'flame_manipulation':
      if (!Core.currentEnemy) return "No target.";
      const dmg = randInt(15,25) + Core.player.baseDamageBonus;
      Core.currentEnemy.health -= dmg;
      if (Core.currentEnemy.health <= 0) return handleEnemyDefeat();
      return `You hurled a fireball dealing ${dmg} damage.`;
    case 'split_personality':
      if (!Core.currentEnemy) return "No target.";
      // two attacks via performMeleeAttack calls; but those return frames/strings — call raw damage logic here to avoid recursion
      const min = 7 + Core.player.tier*10, max = 18 + Core.player.tier*10;
      let d1 = randInt(min,max)+Core.player.baseDamageBonus;
      let d2 = randInt(min,max)+Core.player.baseDamageBonus;
      Core.currentEnemy.health -= (d1+d2);
      return `You split and strike twice for ${d1} and ${d2} damage (total ${d1+d2}).`;
    default:
      return `${ability.name} activated.`;
  }
}
