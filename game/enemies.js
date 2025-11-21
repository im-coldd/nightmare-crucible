// enemies.js — definitions, spawn, abilities
import { player } from './core.js';

export const MONSTER_RANKS = [
  { name:'Dormant Beast', hp:70, stamina:100, essence:100, spawnBase:0.175, xp:35, idx:0 },
  { name:'Awakened Monster', hp:100, stamina:130, essence:130, spawnBase:0.15, xp:50, idx:1 },
  { name:'Fallen Demon', hp:130, stamina:150, essence:150, spawnBase:0.10, xp:100, idx:2 },
  { name:'Corrupted Devil', hp:150, stamina:175, essence:175, spawnBase:0.075, xp:125, idx:3 },
  { name:'Great Tyrant', hp:200, stamina:250, essence:250, spawnBase:0.05, xp:175, idx:4 },
  { name:'Cursed Terror', hp:325, stamina:350, essence:350, spawnBase:0.01, xp:275, idx:5 },
  { name:'Unholy Titan', hp:400, stamina:400, essence:400, spawnBase:0.001, xp:500, idx:6 }
];

const ENEMY_BASE_MIN_DAMAGE = 15;
const ENEMY_BASE_MAX_DAMAGE = 20;
const TIER_DAMAGE_INCREMENT = 10;

const NIGHTMARE_ABILITIES = [
  // these are templates; monsters pick 1 or 2 depending on rank
  { id:'despair', name:'Despair', effect: (enemy, target) => { enemy._despairTurns = 2; /* interpret in combat */ }, desc: '-15% player damage 2 turns; drains 20 essence' },
  { id:'lunge', name:'Lunge', effect: (enemy, target) => { /* handled in attack roll */ }, desc:'High damage lunge; drains 15 essence' },
  { id:'reinforce', name:'Reinforcement', effect: (enemy, target) => { enemy._reinforceTurns = 2; }, desc:'+15% damage reduction 2 turns' },
];

export function buildEnemyFromRank(rankIdx) {
  const def = MONSTER_RANKS[Math.max(0, Math.min(MONSTER_RANKS.length-1, rankIdx))];
  const hp = def.hp;
  const tier = def.idx;
  const minD = ENEMY_BASE_MIN_DAMAGE + tier * TIER_DAMAGE_INCREMENT;
  const maxD = ENEMY_BASE_MAX_DAMAGE + tier * TIER_DAMAGE_INCREMENT;
  // choose abilities: Dormant only 1; others 2 random (no duplicates)
  let abilities = [];
  if (tier === 0) {
    abilities = [NIGHTMARE_ABILITIES[Math.floor(Math.random()*NIGHTMARE_ABILITIES.length)].id];
  } else {
    // sample two unique
    const pool = [...NIGHTMARE_ABILITIES];
    while (abilities.length < 2 && pool.length > 0) {
      const i = Math.floor(Math.random()*pool.length);
      abilities.push(pool.splice(i,1)[0].id);
    }
  }
  return {
    name: def.name,
    tier,
    health: hp,
    maxHealth: hp,
    stamina: def.stamina,
    maxStamina: def.stamina,
    essence: def.essence,
    maxEssence: def.essence,
    minDamage: minD,
    maxDamage: maxD,
    xp: def.xp,
    abilities
  };
}

// spawn chance helpers:
// travel spawn: base 17.5% at 750m increases 0.15% per 50m
export function travelSpawnChance(distanceMeters) {
  if (distanceMeters < 750) return 0.0;
  const over = distanceMeters - 750;
  const increments = Math.floor(over / 50);
  return 0.175 + increments * 0.0015; // 0.15% = 0.0015
}

// meditating spawn: starts at 30 minutes and increases 0.15% per minute
export function meditateSpawnChance(minutes) {
  if (minutes < 30) return 0.0;
  const extra = minutes - 30;
  return 0.175 + extra * 0.0015;
}

// pick a monster rank probabilistically with weights from MONSTER_RANKS.spawnBase,
// scaled so rarer ranks still possible: we bias toward lower ranks
export function pickMonsterByWeights() {
  // simple weighted random: use spawnBase as weights
  const total = MONSTER_RANKS.reduce((s,m)=>s+m.spawnBase,0);
  let r = Math.random() * total;
  for (const m of MONSTER_RANKS) {
    r -= m.spawnBase;
    if (r <= 0) return buildEnemyFromRank(m.idx);
  }
  return buildEnemyFromRank(0);
}
