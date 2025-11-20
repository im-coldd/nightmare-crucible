export const player = {
    name: "Sleeper",
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
};

export let currentEnemy = null;

export function updateUI() {
    const status = `[T:${player.tier} | XP:${player.xp}] HP:${player.health}/${player.maxHealth} | Essence:${player.essence}/${player.maxEssence}`;
    document.getElementById("player-status").textContent = status;
}
