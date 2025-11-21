// enemies.js — fixed for movement.js imports

export const ENEMIES_BY_TIER = { 
  // ... your existing ENEMIES_BY_TIER object ...
};

// Creates a random enemy instance for seeking
export function generateSeekEnemy(tier = 0) {
  const pool = ENEMIES_BY_TIER[tier] || ENEMIES_BY_TIER[0];
  const template = pool[Math.floor(Math.random() * pool.length)];

  return {
    name: template.name,
    tier: template.tier,
    minDamage: template.minDamage,
    maxDamage: template.maxDamage,
    health: template.health,
    maxHealth: template.health,
    stamina: template.stamina,
    maxStamina: template.stamina,
    essence: template.essence,
    maxEssence: template.essence,
    xp: template.xp,
    abilities: [...template.abilities],
    _reinforceTurns: 0
  };
}

/**
 * Builds an enemy instance based on its rank/tier.
 * rank = 0..5, returns a deep clone from the tier list
 */
export function buildEnemyFromRank(rank = 0) {
  const tierPool = ENEMIES_BY_TIER[rank] || ENEMIES_BY_TIER[0];
  const template = tierPool[Math.floor(Math.random() * tierPool.length)];

  return {
    name: template.name,
    tier: template.tier,
    minDamage: template.minDamage,
    maxDamage: template.maxDamage,
    health: template.health,
    maxHealth: template.health,
    stamina: template.stamina,
    maxStamina: template.stamina,
    essence: template.essence,
    maxEssence: template.essence,
    xp: template.xp,
    abilities: [...template.abilities],
    _reinforceTurns: 0
  };
}
