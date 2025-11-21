import { updatePlayerStatus, showEnemyStatus } from './ui.js';

export const player = {
  name: 'Sleeper',
  tier: 0,
  xp: 0,
  health: 100,
  maxHealth: 100,
  essence: 100,
  maxEssence: 100,
  baseDamage: 15,
  critChance: 0.006,
  aspect: null,
  trueName: null,
  inventory: [],
  x: 0,
  y: 0,
  travelDistance: 0,
  damageBoost: 1,
  dodgeReady: false,
  damageReduction: 0,
  nextAttackBuffed: false,
};

export let currentEnemy = null;

export function updateUI() {
  const tierName = player.tier === 0 ? 'Sleeper' : player.tier === 1 ? 'Awakened' : 'Ascended';
  const aspectDisplay = player.aspect ? ` | Aspect: ${player.aspect}` : '';
  const trueName = player.trueName && player.trueName !== 'Veiled Name' ? ` | True Name: ${player.trueName}` : '';
  const status = `[${tierName} | T:${player.tier} | XP:${player.xp}] HP: ${player.health}/${player.maxHealth} | Essence: ${player.essence}/${player.maxEssence}${aspectDisplay}${trueName}`;
  updatePlayerStatus(status);
  if (currentEnemy) {
    showEnemyStatus(`[${currentEnemy.name} T:${currentEnemy.tier}] HP: ${currentEnemy.health}/${currentEnemy.maxHealth} | Essence: ${currentEnemy.essence}/${currentEnemy.maxEssence}`);
  } else {
    showEnemyStatus(null);
  }
}

export function gainXP(amount) {
  player.xp += amount;
}

export const NEXT_TIER_XP = [100, 250, 500, 1000, 2000];

export function checkLevelUp() {
  const cur = player.tier;
  if (cur >= NEXT_TIER_XP.length) return;
  while (player.xp >= NEXT_TIER_XP[cur]) {
    player.xp -= NEXT_TIER_XP[cur];
    player.tier++;
    player.baseDamage += 10;
    player.maxHealth += 100;
    player.maxEssence += 100;
    player.health = player.maxHealth;
    player.essence = player.maxEssence;
  }
}
