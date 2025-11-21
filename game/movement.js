import { buildEnemyFromRank, generateSeekEnemy } from './enemies.js';

// Player object
const player = {
  name: "Veiled",
  aspect: "Shadow",
  hp: 77,
  maxHp: 100,
  essence: 95,
  maxEssence: 100,
  xp: 0,
  runes: 0
};

// Current enemy placeholder
let currentEnemy = null;

// --- UI Update Functions ---

function updateStatsUI() {
  // Player stats
  document.getElementById("playerHP").textContent = player.hp;
  document.getElementById("playerEssence").textContent = player.essence;
  document.getElementById("playerHPBar").style.width = `${(player.hp / player.maxHp) * 100}%`;
  document.getElementById("playerEssenceBar").style.width = `${(player.essence / player.maxEssence) * 100}%`;

  // Enemy stats
  if (currentEnemy) {
    document.getElementById("enemyName").textContent = currentEnemy.name;
    document.getElementById("enemyHP").textContent = currentEnemy.health;
    document.getElementById("enemyEssence").textContent = currentEnemy.essence;
    document.getElementById("enemyDMG").textContent = `${currentEnemy.minDamage}-${currentEnemy.maxDamage}`;
    document.getElementById("enemyHPBar").style.width = `${(currentEnemy.health / currentEnemy.maxHealth) * 100}%`;
    document.getElementById("enemyEssenceBar").style.width = `${(currentEnemy.essence / currentEnemy.maxEssence) * 100}%`;

    // Rank-based color
    if (currentEnemy.tier >= 5) {
      document.getElementById("enemyName").style.color = "#ff3300"; // Boss
    } else if (currentEnemy.tier >= 3) {
      document.getElementById("enemyName").style.color = "#ffcc00"; // Elite
    } else {
      document.getElementById("enemyName").style.color = "#ff4c4c"; // Normal
    }
  }
}

// --- Combat Log Function ---
function logAction(message) {
  const log = document.getElementById("combatLog");
  const p = document.createElement("p");
  p.textContent = message;
  log.appendChild(p);
  log.scrollTop = log.scrollHeight; // auto-scroll
}

// --- Enemy Generation ---
function spawnEnemy(rank = 0) {
  currentEnemy = buildEnemyFromRank(rank);
  logAction(`A ${currentEnemy.name} appears!`);
  updateStatsUI();
}

// --- Player Actions ---
function attackEnemy() {
  if (!currentEnemy) return;

  // Random damage in range
  const dmg = Math.floor(Math.random() * (player.maxHp / 10)) + 5; // Example player dmg
  currentEnemy.health -= dmg;
  if (currentEnemy.health < 0) currentEnemy.health = 0;

  logAction(`${player.name} hits ${currentEnemy.name} for ${dmg} damage!`);

  // Enemy retaliates if alive
  if (currentEnemy.health > 0) {
    const enemyDmg = Math.floor(Math.random() * (currentEnemy.maxDamage - currentEnemy.minDamage + 1)) + currentEnemy.minDamage;
    player.hp -= enemyDmg;
    if (player.hp < 0) player.hp = 0;
    logAction(`${currentEnemy.name} hits ${player.name} for ${enemyDmg} damage!`);
  } else {
    logAction(`${currentEnemy.name} is defeated!`);
    currentEnemy = null;
  }

  updateStatsUI();
}

// --- Example Commands ---
document.addEventListener("keydown", (e) => {
  if (e.key === "a") attackEnemy(); // press "a" to attack
  if (e.key === "s") spawnEnemy(Math.floor(Math.random() * 6)); // press "s" to spawn random rank enemy
});

// Initialize UI
updateStatsUI();
