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
    _damageMultiplier: 1,
    _damageBuff: 0,
    _damageBuffTurns: 0,
    _damageReduction: 0,
    _buffTurns: 0,
    _dodgeChance: 0,
    _critBuff: 0,
    _extraAttacks: 0,
    _reflectNext: false,
    _lastDamage: 0
};

const RANKS = [
    {name:"Dormant", hp:100, essence:100, stamina:100, xp:200},
    {name:"Awakened", hp:150, essence:150, stamina:150, xp:400},
    {name:"Ascended", hp:200, essence:200, stamina:200, xp:800},
    {name:"Transcendant", hp:250, essence:250, stamina:250, xp:1200},
    {name:"Supreme", hp:300, essence:300, stamina:300, xp:1500},
    {name:"Sacred", hp:350, essence:350, stamina:350, xp:2000},
    {name:"Divine", hp:400, essence:400, stamina:400, xp:0}
];

export function logAction(message){
    const log = document.getElementById("game-output");
    const p = document.createElement("p");
    p.textContent = message;
    log.appendChild(p);
    log.scrollTop = log.scrollHeight;
}

export function updateStatsUI(currentEnemy = null){
    if(!document.getElementById("playerHP")) return;
    document.getElementById("playerHP").textContent = player.hp;
    document.getElementById("playerMaxHP").textContent = player.maxHp;
    document.getElementById("playerStamina").textContent = player.stamina;
    document.getElementById("playerMaxStamina").textContent = player.maxStamina;
    document.getElementById("playerEssence").textContent = player.essence;
    document.getElementById("playerMaxEssence").textContent = player.maxEssence;
    document.getElementById("playerRunes").textContent = player.runes.length;

    if(currentEnemy){
        document.getElementById("enemy-status").classList.remove("hidden");
        document.getElementById("enemyName").textContent = currentEnemy.name;
        document.getElementById("enemyTier").textContent = currentEnemy.tier;
        document.getElementById("enemyHP").textContent = currentEnemy.health;
        document.getElementById("enemyMaxHP").textContent = currentEnemy.maxHealth;
        document.getElementById("enemyEssence").textContent = currentEnemy.essence;
        document.getElementById("enemyMaxEssence").textContent = currentEnemy.maxEssence;
        document.getElementById("enemyDMG").textContent = `${currentEnemy.minDamage}-${currentEnemy.maxDamage}`;
    } else {
        document.getElementById("enemy-status").classList.add("hidden");
    }
}

export function rankUp(){
    while(player.rank<RANKS.length && player.xp >= RANKS[player.rank-1].xp){
        player.rank++;
        const r = RANKS[player.rank-1];
        player.maxHp = r.hp; player.hp=r.hp;
        player.maxEssence=r.essence; player.essence=r.essence;
        player.maxStamina=r.stamina; player.stamina=r.stamina;
        logAction(`You have ranked up to ${r.name}!`);
    }
}

export function attemptTrueName(){
    const chance = 0.01 + 0.0025*(player.rank-1);
    if(Math.random()<chance){
        player.trueName = "True Name Unlocked";
        logAction(`Congratulations! You discovered your True Name: ${player.trueName}`);
    }
}
