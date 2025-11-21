// enemies.js — complete tiered enemy lists + generation helpers

export const ENEMIES_BY_TIER = {
  0: [
    { name: "Lurking Shade", tier: 0, minDamage: 5, maxDamage: 10, health: 55, stamina: 60, essence: 40, xp: 40, abilities: ["despair"] },
    { name: "Dream Wisp", tier: 0, minDamage: 4, maxDamage: 9, health: 50, stamina: 50, essence: 35, xp: 35, abilities: [] }
  ],
  1: [
    { name: "Twisted Sleeper", tier: 1, minDamage: 10, maxDamage: 16, health: 90, stamina: 90, essence: 60, xp: 80, abilities: ["lunge"] },
    { name: "Starved Hunter", tier: 1, minDamage: 9, maxDamage: 15, health: 85, stamina: 85, essence: 55, xp: 75, abilities: ["despair"] }
  ],
  2: [
    { name: "Feral Howler", tier: 2, minDamage: 16, maxDamage: 26, health: 140, stamina: 120, essence: 80, xp: 130, abilities: ["lunge", "reinforce"] },
    { name: "Nightmare Wolf", tier: 2, minDamage: 17, maxDamage: 27, health: 145, stamina: 120, essence: 85, xp: 135, abilities: ["lunge"] }
  ],
  3: [
    { name: "Void Stalker", tier: 3, minDamage: 24, maxDamage: 36, health: 200, stamina: 150, essence: 100, xp: 200, abilities: ["despair", "reinforce"] },
    { name: "Hollow Beast", tier: 3, minDamage: 25, maxDamage: 38, health: 210, stamina: 160, essence: 110, xp: 210, abilities: ["lunge"] }
  ],
  4: [
    { name: "Abyssal Horror", tier: 4, minDamage: 33, maxDamage: 48, health: 280, stamina: 180, essence: 140, xp: 300, abilities: ["despair", "lunge", "reinforce"] },
    { name: "Starless Devourer", tier: 4, minDamage: 35, maxDamage: 50, health: 300, stamina: 180, essence: 145, xp: 310, abilities: ["reinforce"] }
  ],
  5: [
    { name: "Warden of the Deep Dream", tier: 5, minDamage: 40, maxDamage: 60, health: 350, stamina: 200, essence: 180, xp: 380, abilities: ["despair", "lunge", "reinforce"] },
    { name: "Crowned Terror", tier: 5, minDamage: 42, maxDamage: 62, health: 360, stamina: 220, essence: 190, xp: 400, abilities: ["lunge", "reinforce"] }
  ]
};

// pick a weighted monster tier (bias to lower tiers)
function pickTierWeighted() {
  // simple distribution: weights by tier rarity
  const weights = [0.35, 0.25, 0.18, 0.12, 0.07, 0.03]; // sums to 1.0
  let r = Math.random();
  let acc = 0;
  for (let i = 0; i < weights.length; i++) {
    acc += weights[i];
    if (r <= acc) return i;
  }
  return 0;
}

// return a fresh clone of template
function cloneTemplate(tpl) {
  return {
    name: tpl.name,
    tier: tpl.tier,
    minDamage: tpl.minDamage,
    maxDamage: tpl.maxDamage,
    health: tpl.health,
    maxHealth: tpl.health,
    stamina: tpl.stamina,
    maxStamina: tpl.stamina,
    essence: tpl.essence,
    maxEssence: tpl.essence,
    xp: tpl.xp,
    abilities: [...(tpl.abilities || [])],
    _reinforceTurns: 0
  };
}

// generate a seek enemy of optional tier
export function generateSeekEnemy(tier = null) {
  const t = (tier === null) ? pickTierWeighted() : Math.max(0, Math.min(5, Math.floor(tier)));
  const pool = ENEMIES_BY_TIER[t] || ENEMIES_BY_TIER[0];
  const tpl = pool[Math.floor(Math.random() * pool.length)];
  return cloneTemplate(tpl);
}

// pick a monster by weights for travel/meditate (alias for generateSeekEnemy)
export function pickMonsterByWeights() {
  return generateSeekEnemy();
}
