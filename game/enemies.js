// enemies.js — extended enemy templates + minibosses
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
    { name: "Feral Howler", tier: 2, minDamage: 16, maxDamage: 26, health: 140, stamina: 120, essence: 80, xp: 130, abilities: ["lunge", "reinforce"] }
  ],
  3: [
    { name: "Void Stalker", tier: 3, minDamage: 24, maxDamage: 36, health: 200, stamina: 150, essence: 100, xp: 200, abilities: ["despair", "reinforce"] }
  ],
  4: [
    { name: "Abyssal Horror", tier: 4, minDamage: 33, maxDamage: 48, health: 280, stamina: 180, essence: 140, xp: 300, abilities: ["despair", "lunge", "reinforce"] }
  ],
  5: [
    { name: "Warden of the Deep Dream", tier: 5, minDamage: 40, maxDamage: 60, health: 350, stamina: 200, essence: 180, xp: 380, abilities: ["despair", "lunge", "reinforce"] }
  ]
};

const MINIBOSSES_BY_ZONE = {
  Abyss: [
    { name: 'Abyssal Warden', tier: 4, minDamage: 36, maxDamage: 56, health: 520, stamina: 220, essence: 200, xp: 900, abilities: ['despair','lunge','reinforce'] },
    { name: 'Nightmare Colossus', tier: 5, minDamage: 48, maxDamage: 72, health: 900, stamina: 300, essence: 300, xp: 1600, abilities: ['lunge','reinforce'] }
  ],
  Wastes: [
    { name: 'Tyrant of Sand', tier: 4, minDamage: 34, maxDamage: 52, health: 420, stamina: 200, essence: 160, xp: 850, abilities: ['lunge','reinforce'] }
  ],
  Forest: [
    { name: 'Elder Dreamer', tier: 4, minDamage: 32, maxDamage: 48, health: 450, stamina: 220, essence: 180, xp: 880, abilities: ['despair','reinforce'] }
  ]
};

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
    _reinforceTurns: 0,
    rarity: tpl.rarity || 'common'
  };
}

export function generateSeekEnemy(tier = 0) {
  const pool = ENEMIES_BY_TIER[Math.max(0, Math.min(5, Math.floor(tier)))] || ENEMIES_BY_TIER[0];
  const tpl = pool[Math.floor(Math.random() * pool.length)];
  return cloneTemplate(tpl);
}

export function generateMinibossForZone(zone = 'Wastes') {
  const pool = MINIBOSSES_BY_ZONE[zone] || [];
  if (!pool.length) return generateSeekEnemy(Math.min(5, Math.max(0, Math.floor(Math.random()*3 + 1))));
  const tpl = pool[Math.floor(Math.random() * pool.length)];
  tpl.rarity = 'miniboss';
  return cloneTemplate(tpl);
}
