export const ENEMIES_BY_TIER = {
    1: { name:"Dormant Beast", hp:70, stamina:100, essence:100, abilities:["despair"], xp:35, spawnChance:0.175, minDamage:7, maxDamage:12 },
    2: { name:"Awakened Monster", hp:100, stamina:130, essence:130, abilities:["despair","lunge"], xp:50, spawnChance:0.15, minDamage:10, maxDamage:18 },
    3: { name:"Fallen Demon", hp:130, stamina:150, essence:150, abilities:["despair","lunge"], xp:100, spawnChance:0.10, minDamage:15, maxDamage:22 },
    4: { name:"Corrupted Devil", hp:150, stamina:175, essence:175, abilities:["despair","lunge"], xp:125, spawnChance:0.075, minDamage:18, maxDamage:28 },
    5: { name:"Great Tyrant", hp:200, stamina:250, essence:250, abilities:["despair","lunge"], xp:175, spawnChance:0.05, minDamage:24, maxDamage:36 },
    6: { name:"Cursed Terror", hp:325, stamina:350, essence:350, abilities:["despair","lunge","reinforce"], xp:275, spawnChance:0.01, minDamage:32, maxDamage:50 },
    7: { name:"Unholy Titan", hp:400, stamina:400, essence:400, abilities:["despair","lunge","reinforce"], xp:500, spawnChance:0.001, minDamage:40, maxDamage:60 }
};

export function buildEnemyFromRank(tier=1) {
    const template = ENEMIES_BY_TIER[tier] || ENEMIES_BY_TIER[1];
    return {
        ...template,
        health: template.hp,
        maxHealth: template.hp,
        stamina: template.stamina,
        maxStamina: template.stamina,
        essence: template.essence,
        maxEssence: template.essence
    };
}
