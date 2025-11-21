// core.js — game state, ranks, levelup, UI sync
import { updatePlayerStatus, showEnemyStatus } from './ui.js';

export const RANKS = [
  { name: 'Dormant', hp:100, essence:100, stamina:100, xpToNext:200 },
  { name: 'Awakened', hp:150, essence:150, stamina:150, xpToNext:400 },
  { name: 'Ascended', hp:200, essence:200, stamina:200, xpToNext:800 },
  { name: 'Transcendant', hp:250, essence:250, stamina:250, xpToNext:1200 },
  { name: 'Supreme', hp:300, essence:300, stamina:300, xpToNext:1500 },
  { name: 'Sacred', hp:350, essence:350, stamina:350, xpToNext:2000 },
  { name: 'Divine', hp:400, essence:400, stamina:400, xpToNext: Infinity }
];

// initial player set to Dormant
export const player = {
  name: 'Sleeper',
  tier: 0,         // index in RANKS
  xp: 0,
  health: RANKS[0].hp,
  maxHealth: RANKS[0].hp,
  essence: RANKS[0].essence,
  maxEssence: RANKS[0].essence,
  stamina: RANKS[0].stamina,
  maxStamina: RANKS[0].stamina,
  baseDamageBonus: 0,   // additional flat bonus (e.g., from memories)
  critChanceFlat: 0.01, // base 1%
  aspect: null,
  trueName: null,
  inventory: [],
  x: 0, y: 0,
  travelDistance: 0,
  trueNameAccumulatedChance: 0.0 // increases by .25% per battle as doc
};

export let currentEnemy = null;

// XP thresholds per RANKS array
export function xpToNextTier(tier) {
  const r = RANKS[tier];
  return r ? r.xpToNext : Infinity;
}

export function updatePlayerStatsForTier(tier) {
  const r = RANKS[tier];
  player.maxHealth = r.hp;
  player.health = Math.min(player.health, player.maxHealth);
  player.maxEssence = r.essence;
  player.essence = Math.min(player.essence, player.maxEssence);
  player.maxStamina = r.stamina;
  player.stamina = Math.min(player.stamina, player.maxStamina);
}

export function updateUI() {
  const tierName = RANKS[player.tier].name;
  const aspectDisplay = player.aspect ? ` | Aspect: ${player.aspect}` : '';
  const trueNameDisplay = player.trueName && player.trueName !== 'Veiled Name' ? ` | True Name: ${player.trueName}` : '';
  const status = `Runes: [${tierName} | T:${player.tier} | XP:${player.xp}] HP: ${player.health}/${player.maxHealth} | Essence: ${player.essence}/${player.maxEssence} | Stamina: ${player.stamina}/${player.maxStamina}${aspectDisplay}${trueNameDisplay}`;
  updatePlayerStatus(status);
  if (currentEnemy) {
    showEnemyStatus(`[${currentEnemy.name} T:${currentEnemy.tier}] HP: ${currentEnemy.health}/${currentEnemy.maxHealth} | Stamina: ${currentEnemy.stamina}/${currentEnemy.maxStamina} | Essence: ${currentEnemy.essence}/${currentEnemy.maxEssence}`);
  } else {
    showEnemyStatus(null);
  }
}

export function gainXP(amount) {
  player.xp += amount;
}

export function checkLevelUp() {
  // while loop supports multi-level gains
  while (player.tier < RANKS.length - 1 && player.xp >= xpToNextTier(player.tier)) {
    const needed = xpToNextTier(player.tier);
    player.xp -= needed;
    player.tier += 1;
    // on rank up: increase base damage by +10 per rank (per doc)
    player.baseDamageBonus += 10;
    // set stats to new max
    updatePlayerStatsForTier(player.tier);
  }
}
