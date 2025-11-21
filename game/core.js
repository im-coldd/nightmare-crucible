// core.js — game state, ranks, levelup, UI sync, persistence
import { updatePlayerStatus, showEnemyStatus } from './ui.js';

export const SAVE_KEY = 'nightmare-crucible-v1';

export const RANKS = [
  { name: 'Dormant', hp: 100, essence: 100, stamina: 100, xpToNext: 200 },
  { name: 'Awakened', hp: 150, essence: 150, stamina: 150, xpToNext: 400 },
  { name: 'Ascended', hp: 200, essence: 200, stamina: 200, xpToNext: 800 },
  { name: 'Transcendant', hp: 250, essence: 250, stamina: 250, xpToNext: 1200 },
  { name: 'Supreme', hp: 300, essence: 300, stamina: 300, xpToNext: 1500 },
  { name: 'Sacred', hp: 350, essence: 350, stamina: 350, xpToNext: 2000 },
  { name: 'Divine', hp: 400, essence: 400, stamina: 400, xpToNext: Infinity }
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
  aspect: null,
  trueName: null,
  inventory: [],
  x: 0,
  y: 0,
  travelDistance: 0,
  trueNameAccumulatedChance: 0.0,
  // runtime flags
  damageBoost: 1,
  dodgeReady: false,
  domainReady: false,
  avatarReady: false,
  doubleAttackReady: false,
  damageReduction: 0,
  nextAttackBuffed: false,
  _despairTurns: 0,
  _reinforceTurns: 0
};

export let currentEnemy = null;

export function xpToNextTier(tier) {
  const r = RANKS[tier];
  return r ? r.xpToNext : Infinity;
}

export function updatePlayerStatsForTier(tier) {
  const r = RANKS[tier];
  if (!r) return;
  player.maxHealth = r.hp;
  player.health = Math.min(player.health, player.maxHealth);
  player.maxEssence = r.essence;
  player.essence = Math.min(player.essence, player.maxEssence);
  player.maxStamina = r.stamina;
  player.stamina = Math.min(player.stamina, player.maxStamina);
}

export function updateUI() {
  const tierName = RANKS[player.tier] ? RANKS[player.tier].name : `T:${player.tier}`;
  const aspectDisplay = player.aspect ? ` | Aspect: ${player.aspect}` : '';
  const trueNameDisplay = (player.trueName && player.trueName !== 'Veiled Name') ? ` | True Name: ${player.trueName}` : '';
  const status = `Runes: [${tierName} | T:${player.tier} | XP:${player.xp}] HP: ${player.health}/${player.maxHealth} | Essence: ${player.essence}/${player.maxEssence} | Stamina: ${player.stamina}/${player.maxStamina}${aspectDisplay}${trueNameDisplay}`;
  updatePlayerStatus(status);
  if (currentEnemy) {
    showEnemyStatus(`[${currentEnemy.name} T:${currentEnemy.tier}] HP: ${currentEnemy.health}/${currentEnemy.maxHealth} | Stamina: ${currentEnemy.stamina}/${currentEnemy.maxStamina} | Essence: ${currentEnemy.essence}/${currentEnemy.maxEssence}`);
  } else {
    showEnemyStatus(null);
  }
  // save often so progress isn't lost
  saveGame();
}

export function gainXP(amount) {
  player.xp += amount;
  saveGame();
}

export function checkLevelUp() {
  let leveled = false;
  // support multiple level-ups at once
  while (player.tier < RANKS.length - 1 && player.xp >= xpToNextTier(player.tier)) {
    const needed = xpToNextTier(player.tier);
    player.xp -= needed;
    player.tier += 1;
    player.baseDamageBonus += 10;
    updatePlayerStatsForTier(player.tier);
    leveled = true;

    // TRUE NAME mechanic (Option 3): check on each rank up
    // chance composition:
    // base 1% + tier * 5% + accumulated per-battle (converted from percent stored as 0.25 increments)
    const base = 0.01;
    const tierBonus = player.tier * 0.05;
    const acc = (player.trueNameAccumulatedChance || 0) / 100.0;
    const trueChance = base + tierBonus + acc;
    if (!player.trueName && Math.random() < trueChance) {
      // reveal a True Name
      player.trueName = player.aspect ? `${player.aspect} True` : 'Revealed Name';
      // ensure UI shows it immediately
      // UI update below will save
    }
  }

  if (leveled) {
    // restore on rank up
    player.health = player.maxHealth;
    player.essence = player.maxEssence;
    player.stamina = player.maxStamina;
    updateUI();
  } else {
    // still ensure save
    saveGame();
  }
}

// --------------------- persistence ---------------------
export function saveGame() {
  try {
    const out = {
      v: '1',
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
        aspect: player.aspect,
        trueName: player.trueName,
        inventory: player.inventory,
        x: player.x,
        y: player.y,
        travelDistance: player.travelDistance,
        trueNameAccumulatedChance: player.trueNameAccumulatedChance
      },
      ts: Date.now()
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(out));
  } catch (err) {
    // ignore save errors for now
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
    player.aspect = p.aspect ?? player.aspect;
    player.trueName = p.trueName ?? player.trueName;
    player.inventory = p.inventory ?? player.inventory;
    player.x = p.x ?? player.x;
    player.y = p.y ?? player.y;
    player.travelDistance = p.travelDistance ?? player.travelDistance;
    player.trueNameAccumulatedChance = p.trueNameAccumulatedChance ?? player.trueNameAccumulatedChance;
    updatePlayerStatsForTier(player.tier);
    return true;
  } catch (err) {
    return false;
  }
}

// Auto-load on module eval
loadGame();
