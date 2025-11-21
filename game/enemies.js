// enemies.js
export const ENEMIES_BY_TIER = {
    0: [{name:"Lurking Shade", tier:0, minDamage:5, maxDamage:10, health:55, stamina:60, essence:40, xp:40, abilities:["despair"]},
        {name:"Dream Wisp", tier:0, minDamage:4, maxDamage:9, health:50, stamina:50, essence:35, xp:35, abilities:[]}],
    1: [{name:"Twisted Sleeper", tier:1, minDamage:10, maxDamage:16, health:90, stamina:90, essence:60, xp:80, abilities:["lunge"]},
        {name:"Starved Hunter", tier:1, minDamage:9, maxDamage:15, health:85, stamina:85, essence:55, xp:75, abilities:["despair"]}],
    2: [{name:"Feral Howler", tier:2, minDamage:16, maxDamage:26, health:140, stamina:120, essence:80, xp:130, abilities:["lunge","reinforce"]},
        {name:"Nightmare Wolf", tier:2, minDamage:17, maxDamage:27, health:145, stamina:120, essence:85, xp:135, abilities:["lunge"]}],
    3: [{name:"Void Stalker", tier:3, minDamage:24, maxDamage:36, health:200, stamina:150, essence:100, xp:200, abilities:["despair","reinforce"]},
        {name:"Hollow Beast", tier:3, minDamage:25, maxDamage:38, health:210, stamina:160, essence:110, xp:210, abilities:["lunge"]}],
    4: [{name:"Abyssal Horror", tier:4, minDamage:33, maxDamage:48, health:280, stamina:180, essence:140, xp:300, abilities:["despair","lunge","reinforce"]},
        {name:"Starless Devourer", tier:4, minDamage:35, maxDamage:50, health:300, stamina:180, essence:145, xp:310, abilities:["reinforce"]}],
    5: [{name:"Warden of the Deep Dream", tier:5, minDamage:40, maxDamage:60, health:350, stamina:200, essence:180, xp:380, abilities:["despair","lunge","reinforce"]},
        {name:"Crowned Terror", tier:5, minDamage:42, maxDamage:62, health:360, stamina:220, essence:190, xp:400, abilities:["lunge","reinforce"]}]
};

export function generateEnemy(tier=0){
    const pool = ENEMIES_BY_TIER[tier] || ENEMIES_BY_TIER[0];
    const template = pool[Math.floor(Math.random()*pool.length)];
    return {
        name: template.name, tier: template.tier,
        minDamage: template.minDamage, maxDamage: template.maxDamage,
        health: template.health, maxHealth: template.health,
        stamina: template.stamina, maxStamina: template.stamina,
        essence: template.essence, maxEssence: template.essence,
        xp: template.xp,
        abilities: [...template.abilities],
        _reinforceTurns: 0,
        _accuracyDebuff: 0
    };
}
