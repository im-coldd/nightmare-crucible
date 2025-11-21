import { player } from './core.js';

export const ENCOUNTER_CHANCES = [
  { name: 'Dormant Beast', baseChance: 0.15, perMinuteIncrease: 0.0025, tier: 0, hpBase: 70 },
  { name: 'Awakened Monster', baseChance: 0.10, perMinuteIncrease: 0.0020, tier: 1, hpBase: 80 },
  { name: 'Fallen Demon', baseChance: 0.07, perMinuteIncrease: 0.0016, tier: 2, hpBase: 100 },
  { name: 'Corrupted Devil', baseChance: 0.05, perMinuteIncrease: 0.0012, tier: 3, hpBase: 120 },
  { name: 'Great Tyrant', baseChance: 0.01, perMinuteIncrease: 0.0008, tier: 4, hpBase: 150 },
  { name: 'Cursed Terror', baseChance: 0.005, perMinuteIncrease: 0.0003, tier: 5, hpBase: 200 },
  { name: 'Unholy Titan', baseChance: 0.001, perMinuteIncrease: 0.0001, tier: 6, hpBase: 250 }
].reverse();

const ENEMY_BASE_MIN_DAMAGE = 15;
const ENEMY_BASE_MAX_DAMAGE = 20;
const TIER_DAMAGE_INCREMENT = 10;

export function spawnFromDef(def) {
  const hp = def.hpBase + (player.tier * 20);
  const tier = def.tier;
  const minD = ENEMY_BASE_MIN_DAMAGE + (tier * TIER_DAMAGE_INCREMENT);
  const maxD = ENEMY_BASE_MAX_DAMAGE + (tier * TIER_DAMAGE_INCREMENT);
  return {
    name: def.name,
    tier,
    health: hp,
    maxHealth: hp,
    minDamage: minD,
    maxDamage: maxD,
    essence: 100,
    maxEssence: 100
  };
}

export function generateTimeBasedEncounter(minutes) {
  for (const def of ENCOUNTER_CHANCES) {
    const chance = def.baseChance + def.perMinuteIncrease * minutes;
    if (Math.random() < chance) return spawnFromDef(def);
  }
  return null;
}

export function generateSeekEnemy() {
  return spawnFromDef(ENCOUNTER_CHANCES[ENCOUNTER_CHANCES.length - 1]);
}
