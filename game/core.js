// core.js — authoritative game state & persistence (no UI imports)
export const SAVE_KEY = 'nightmare-crucible-v2';

export const RANKS = [
  { name: 'Dormant', hp:100, essence:100, stamina:100, xpToNext:200 },
  { name: 'Awakened', hp:150, essence:150, stamina:150, xpToNext:400 },
  { name: 'Ascended', hp:200, essence:200, stamina:200, xpToNext:800 },
  { name: 'Transcendant', hp:250, essence:250, stamina:250, xpToNext:1200 },
  { name: 'Supreme', hp:300, essence:300, stamina:300, xpToNext:1500 },
  { name: 'Sacred', hp:350, essence:350, stamina:350, xpToNext:2000 },
  { name: 'Divine', hp:400, essence:400, stamina:400, xpToNext: Infinity }
];

export const player = {
  name: 'Sleeper',
  tier: 0,
  xp: 0,
  health: RANKS[0].hp,
  maxHealth: RANKS[0].hp,
  essence: RANKS[0].essence,
  maxEssence: RANKS[0].essence,
  stamina: RANKS[0].stamina,
  maxStamina: RANKS[0].stamina,
  baseDamageBonus: 0,
  critChanceFlat: 0.01,
  critMultiplier: 1.75,
  evasionFlat: 0.02,
  aspect: null, // string key of aspect, e.g. "shadow"
  trueName: null,
  inventory: [],
  x: 0, y: 0,
  travelDistance: 0,
  trueNameAccumulatedChance: 0.0,
  cooldowns: {},
  zone: 'Wastes',
  // runtime flags
  damageBoost: 1,
  dodgeReady: false,
  doubleAttackReady: false,
  damageReduction: 0,
  nextAttackBuffed: false,
  _despairTurns: 0
};

export let currentEnemy = null;

// simple helpers
export function xpToNextTier(tier) {
  const r = RANKS[tier];
  return r ? r.xpToNext : Infinity;
}
export function updatePlayerStatsForTier(tier) {
  const r = RANKS[tier];
  if (!r) return;
  player.maxHealth = r.hp;
  player.maxEssence = r.essence;
  player.maxStamina = r.stamina;
  player.health = Math.min(player.health, player.maxHealth);
  player.essence = Math.min(player.essence, player.maxEssence);
  player.stamina = Math.min(player.stamina, player.maxStamina);
}

// cooldown ticking (called by game loop)
export function tickCooldowns() {
  for (const k of Object.keys(player.cooldowns)) {
    player.cooldowns[k] = Math.max(0, player.cooldowns[k] - 1);
    if (player.cooldowns[k] === 0) delete player.cooldowns[k];
  }
}

// leveling logic (fixed)
export function gainXP(amount) {
  player.xp += amount;
  saveGame();
}

export function checkLevelUp() {
  let leveled = false;
  // allow multi-leveling
  while (player.tier < RANKS.length - 1 && player.xp >= xpToNextTier(player.tier)) {
    const needed = xpToNextTier(player.tier);
    player.xp -= needed;
    player.tier += 1;
    player.baseDamageBonus += 10;
    updatePlayerStatsForTier(player.tier);
    leveled = true;

    // True name mechanic on rank-up (Option 3)
    const base = 0.01;
    const tierBonus = player.tier * 0.05;
    const acc = (player.trueNameAccumulatedChance || 0) / 100.0;
    const trueChance = base + tierBonus + acc;
    if (!player.trueName && Math.random() < trueChance) {
      player.trueName = player.aspect ? `${player.aspect} True` : 'Revealed Name';
    }
  }

  if (leveled) {
    // restore some resources on rank up
    player.health = player.maxHealth;
    player.essence = player.maxEssence;
    player.stamina = player.maxStamina;
  }
  saveGame();
  return leveled;
}

// persistence
export function saveGame() {
  try {
    const out = {
      v: '2',
      player: {
        name: player.name,
        tier: player.tier,
        xp: player.xp,
        health: player.health,
        maxHealth: player.maxHealth,
        essence: player.essence,
        maxEssence: player.maxEssence,
        stamina: player.stamina,
        maxStamina: player.maxStamina,
        baseDamageBonus: player.baseDamageBonus,
        critChanceFlat: player.critChanceFlat,
        critMultiplier: player.critMultiplier,
        evasionFlat: player.evasionFlat,
        aspect: player.aspect,
        trueName: player.trueName,
        inventory: player.inventory,
        x: player.x,
        y: player.y,
        travelDistance: player.travelDistance,
        trueNameAccumulatedChance: player.trueNameAccumulatedChance,
        cooldowns: player.cooldowns,
        zone: player.zone
      },
      ts: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(out));
  } catch (err) {
    // ignore
  }
}

export function loadGame() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return false;
    const data = JSON.parse(raw);
    if (!data || !data.player) return false;
    const p = data.player;
    player.name = p.name ?? player.name;
    player.tier = p.tier ?? player.tier;
    player.xp = p.xp ?? player.xp;
    player.health = p.health ?? player.health;
    player.maxHealth = p.maxHealth ?? player.maxHealth;
    player.essence = p.essence ?? player.essence;
    player.maxEssence = p.maxEssence ?? player.maxEssence;
    player.stamina = p.stamina ?? player.stamina;
    player.maxStamina = p.maxStamina ?? player.maxStamina;
    player.baseDamageBonus = p.baseDamageBonus ?? player.baseDamageBonus;
    player.critChanceFlat = p.critChanceFlat ?? player.critChanceFlat;
    player.critMultiplier = p.critMultiplier ?? player.critMultiplier;
    player.evasionFlat = p.evasionFlat ?? player.evasionFlat;
    player.aspect = p.aspect ?? player.aspect;
    player.trueName = p.trueName ?? player.trueName;
    player.inventory = p.inventory ?? player.inventory;
    player.x = p.x ?? player.x;
    player.y = p.y ?? player.y;
    player.travelDistance = p.travelDistance ?? player.travelDistance;
    player.trueNameAccumulatedChance = p.trueNameAccumulatedChance ?? player.trueNameAccumulatedChance;
    player.cooldowns = p.cooldowns ?? player.cooldowns;
    player.zone = p.zone ?? player.zone;
    updatePlayerStatsForTier(player.tier);
    return true;
  } catch (err) {
    return false;
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch (e) {}
  // reset in-memory to defaults (simple reset)
  player.tier = 0; player.xp = 0;
  player.health = RANKS[0].hp; player.maxHealth = RANKS[0].hp;
  player.essence = RANKS[0].essence; player.maxEssence = RANKS[0].essence;
  player.stamina = RANKS[0].stamina; player.maxStamina = RANKS[0].stamina;
  player.aspect = null;
  player.trueName = null;
  player.inventory = [];
  player.x = 0; player.y = 0; player.travelDistance = 0;
  player.trueNameAccumulatedChance = 0;
  player.cooldowns = {};
  player.zone = 'Wastes';
}
