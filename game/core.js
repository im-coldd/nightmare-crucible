// core.js
export const player = {
    name: "Veiled",
    aspect: null,
    rank: 1,
    xp: 0,
    trueName: null,
    
    hp: 100,
    maxHp: 100,
    stamina: 100,
    maxStamina: 100,
    essence: 100,
    maxEssence: 100,

    abilities: [],
    runes: [],
    memories: [],
};

export function logAction(message) {
    const log = document.getElementById("game-output");
    const p = document.createElement("p");
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

export function updateStatsUI(currentEnemy = null) {
    // Player Stats
    document.getElementById("playerHP").textContent = player.hp;
    document.getElementById("playerMaxHP").textContent = player.maxHp;
    document.getElementById("playerEssence").textContent = player.essence;
    document.getElementById("playerMaxEssence").textContent = player.maxEssence;
    document.getElementById("playerRunes").textContent = player.runes.length;

    document.getElementById("playerHPBar").style.width = `${(player.hp/player.maxHp)*100}%`;
    document.getElementById("playerEssenceBar").style.width = `${(player.essence/player.maxEssence)*100}%`;

    // Enemy Stats
    if (currentEnemy) {
        document.getElementById("enemy-status").classList.remove("hidden");
        document.getElementById("enemyName").textContent = currentEnemy.name;
        document.getElementById("enemyTier").textContent = currentEnemy.tier;
        document.getElementById("enemyHP").textContent = currentEnemy.health;
        document.getElementById("enemyMaxHP").textContent = currentEnemy.maxHealth;
        document.getElementById("enemyEssence").textContent = currentEnemy.essence;
        document.getElementById("enemyMaxEssence").textContent = currentEnemy.maxEssence;
        document.getElementById("enemyDMG").textContent = `${currentEnemy.minDamage}-${currentEnemy.maxDamage}`;
        document.getElementById("enemyHPBar").style.width = `${(currentEnemy.health/currentEnemy.maxHealth)*100}%`;
        document.getElementById("enemyEssenceBar").style.width = `${(currentEnemy.essence/currentEnemy.maxEssence)*100}%`;
    } else {
        document.getElementById("enemy-status").classList.add("hidden");
    }
}

export function rankUp() {
    const ranks = [
        {name:"Dormant", hp:100, essence:100, stamina:100, xp:200},
        {name:"Awakened", hp:150, essence:150, stamina:150, xp:400},
        {name:"Ascended", hp:200, essence:200, stamina:200, xp:800},
        {name:"Transcendant", hp:250, essence:250, stamina:250, xp:1200},
        {name:"Supreme", hp:300, essence:300, stamina:300, xp:1500},
        {name:"Sacred", hp:350, essence:350, stamina:350, xp:2000},
        {name:"Divine", hp:400, essence:400, stamina:400, xp:0}
    ];

    if(player.rank < ranks.length) {
        player.rank++;
        const r = ranks[player.rank-1];
        player.maxHp = r.hp;
        player.hp = r.hp;
        player.maxEssence = r.essence;
        player.essence = r.essence;
        player.maxStamina = r.stamina;
        player.stamina = r.stamina;
        logAction(`You have ranked up to ${r.name}!`);
    }
}
