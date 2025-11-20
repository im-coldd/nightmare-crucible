import { player } from "./core.js";

export const ENEMY_TABLE = [
    { name: "Dormant Beast", tier: 0, hp: 70 },
];

export function spawnEnemy() {
    const base = ENEMY_TABLE[0];
    return {
        name: base.name,
        tier: base.tier,
        health: base.hp + player.tier * 20,
    };
}
