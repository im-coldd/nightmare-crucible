// combat.js
import { player, logAction, updateStatsUI, rankUp } from './core.js';
import { generateEnemy } from './enemies.js';
import { generateMemory } from './memories.js';

export let currentEnemy = null;

export const ASPECT_ABILITIES = {
    Sun:[
        {name:"Soul Flame", essenceCost:15, type:"active", effect:(choice)=>{
            if(choice==="heal"){player.hp=Math.min(player.maxHp,player.hp+40);logAction("Healed 40 HP!");}
            else {player._damageMultiplier=2;player._damageBuffTurns=2;logAction("Damage doubled 2 turns!");}
            player.essence-=15;
        }},
        {name:"Flame Manipulation", essenceCost:10, type:"active", effect:()=>{
            const dmg=Math.floor(Math.random()*6)+15;currentEnemy.health-=dmg;player.essence-=10;
            logAction(`Flame Manipulation hits ${currentEnemy.name} for ${dmg}.`);
        }},
        {name:"Longing", essenceCost:18, type:"active", effect:()=>{
            player._damageReduction=0.3;player._buffTurns=2;player.essence-=18;logAction("Damage reduced by 30% 2 turns");
        }},
        {name:"Partial Transformation", essenceCost:30, type:"active", effect:()=>{
            player.hp=Math.min(player.maxHp,player.hp+60);player._damageMultiplier=2;player._damageBuffTurns=2;player.essence-=30;
            logAction("Partial Transformation: 60 HP healed, 2x damage 2 turns");
        }},
        {name:"Domain", essenceCost:40, type:"domain", effect:()=>{
            player._damageMultiplier=2;player._damageReduction=0.35;player._buffTurns=3;player.essence-=40;
            logAction("Sun Domain active: 2x damage & 35% DR 3 turns");
        }}
    ],
    Shadow:[
        {name:"Shadow Slave", essenceCost:13, type:"active", effect:()=>{player._damageMultiplier=2;player._damageBuffTurns=2;player.essence-=13;logAction("Shadow Slave: 2x damage 2 turns");}},
        {name:"Shadow Step", essenceCost:0, type:"passive", effect:()=>{player._dodgeChance=0.15;player._buffTurns=2;logAction("Shadow Step: 15% dodge 2 turns");}},
        {name:"Shadow Manifestation", essenceCost:17, type:"active", effect:()=>{player._damageBuff=3;player._critBuff=0.03;player.essence-=17;logAction("Shadow blade summoned +3 dmg, +3% crit");}},
        {name:"Shadow Avatars", essenceCost:25, type:"active", effect:()=>{player._extraAttacks=2;player.essence-=25;logAction("Shadow Avatars: attack twice next turn");}},
        {name:"Domain", essenceCost:40, type:"domain", effect:()=>{player._damageMultiplier=2;player._damageReduction=0.35;player._buffTurns=3;player.essence-=40;logAction("Shadow Domain active: 2x damage & 35% DR 3 turns");}}
    ],
    Mirror:[
        {name:"Split Personality", essenceCost:13, type:"active", effect:()=>{player._extraAttacks=2;player.essence-=13;logAction("Split Personality: attack twice next turn");}},
        {name:"Mirror Beast", essenceCost:17, type:"active", effect:()=>{const dmg=Math.floor(Math.random()*10)+16;currentEnemy.health-=dmg;player.essence-=17;logAction(`Mirror Beast hits ${currentEnemy.name} ${dmg}`);}},
        {name:"Reflection", essenceCost:16, type:"active", effect:()=>{player._reflectNext=true;player.essence-=16;logAction("Reflection: next attack reflected");}},
        {name:"Take Over", essenceCost:25, type:"active", effect:()=>{currentEnemy._damageReduction=0.25;player.essence-=25;logAction("Take Over: enemy dmg reduced 25% 2 turns");}},
        {name:"Domain", essenceCost:40, type:"domain", effect:()=>{player._damageMultiplier=2;player._damageReduction=0.35;player._buffTurns=3;player.essence-=40;logAction("Mirror Domain active 2x dmg & 35% DR");}}
    ],
    Superhuman:[
        {name:"Overpower", essenceCost:13, type:"active", effect:()=>{player._damageMultiplier=1.25;player._damageBuffTurns=2;player.essence-=13;logAction("Overpower: 1.25x dmg 2 turns");}},
        {name:"Defense", essenceCost:16, type:"active", effect:()=>{player._damageReduction=0.23;player._buffTurns=2;player.essence-=16;logAction("Defense: 23% DR 2 turns");}},
        {name:"Inspiration", essenceCost:29, type:"active", effect:()=>{player._damageMultiplier=1.5;player._damageReduction=0.3;player._buffTurns=1;player.essence-=29;logAction("Inspiration: 1.5x dmg next & 30% DR");}},
        {name:"Gigantification", essenceCost:()=>Math.max(0,player._lastDamage*2-2), type:"active", effect:()=>{
            const dmg=Math.floor(Math.random()*16)+20; const essenceDrain=dmg-2;
            if(player.essence<essenceDrain)return logAction("Not enough essence for Gigantification!");
            currentEnemy.health-=dmg;player.essence-=essenceDrain;logAction(`Gigantification hits ${dmg} dmg, drains ${essenceDrain} essence`);
        }},
        {name:"Domain", essenceCost:40, type:"domain", effect:()=>{player._damageMultiplier=2;player._damageReduction=0.35;player._buffTurns=3;player.essence-=40;logAction("Superhuman Domain: 2x dmg & 35% DR 3 turns");}}
    ],
    Perfection:[
        {name:"Flight", essenceCost:15, type:"active", effect:()=>{const dmg=Math.floor(Math.random()*8)+13;currentEnemy.health-=dmg;player.essence-=15;logAction(`Flight deals ${dmg} dmg`);}},
        {name:"Obedience", essenceCost:15, type:"active", effect:()=>{currentEnemy._damageReduction=0.15;player.essence-=15;logAction("Obedience: enemy dmg reduced 15% 2 turns");}},
        {name:"Self Inspiration", essenceCost:17, type:"active", effect:()=>{player._damageMultiplier=1.2;player._damageBuffTurns=1;player.essence-=17;logAction("Self Inspiration: 20% dmg buff");}},
        {name:"Fire Breathing", essenceCost:18, type:"active", effect:()=>{const dmg=Math.floor(Math.random()*8)+18;currentEnemy.health-=dmg;player.essence-=18;logAction(`Fire Breathing deals ${dmg} dmg`);}},
        {name:"Domain", essenceCost:40, type:"domain", effect:()=>{player._damageMultiplier=2;player._damageReduction=0.35;player._buffTurns=3;player.essence-=40;logAction("Perfection Domain active: 2x dmg & 35% DR 3 turns");}}
    ],
    Seer:[
        {name:"Future Vision", essenceCost:15, type:"active", effect:()=>{player._dodgeChance=0.35;player._buffTurns=2;player.essence-=15;logAction("Future Vision: 35% dodge 2 turns");}},
        {name:"Future Sight", essenceCost:15, type:"active", effect:()=>{const dmg=Math.floor(Math.random()*8)+13;currentEnemy.health-=dmg;player.essence-=15;logAction(`Future Sight deals ${dmg} dmg`);}},
        {name:"Perception Swap", essenceCost:16, type:"active", effect:()=>{currentEnemy._accuracyDebuff=0.17;player.essence-=16;logAction("Perception Swap: enemy misses +17% 2 turns");}},
        {name:"Memory Implantation", essenceCost:20, type:"active", effect:()=>{currentEnemy._accuracyDebuff=0.26;player.essence-=20;logAction("Memory Implantation: enemy misses 26% next attack");}},
        {name:"Domain", essenceCost:40, type:"domain", effect:()=>{player._damageMultiplier=2;player._damageReduction=0.35;player._buffTurns=3;player.essence-=40;logAction("Seer Domain active: 2x dmg & 35% DR 3 turns");}}
    ]
};

// Attack Enemy Function
export function attackEnemy(){
    if(!currentEnemy) return logAction("No enemy to attack.");
    let dmg=Math.floor(Math.random()*12)+7;
    if(player._damageMultiplier) dmg*=player._damageMultiplier;
    if(player._damageBuff) dmg+=player._damageBuff;
    if(currentEnemy._damageReduction) dmg*=(1-currentEnemy._damageReduction);
    const staminaDrain=dmg-2;
    player.stamina-=staminaDrain;
    currentEnemy.health-=dmg;
    player._lastDamage=dmg;
    logAction(`${player.name} hits ${currentEnemy.name} for ${dmg.toFixed(0)} (-${staminaDrain} stamina).`);
    if(player._damageBuffTurns){player._damageBuffTurns--; if(player._damageBuffTurns<=0) player._damageMultiplier=1;}
    if(player._buffTurns){player._buffTurns--; if(player._buffTurns<=0) player._damageReduction=0;}
    if(currentEnemy.health>0) enemyAction();
    else {logAction(`${currentEnemy.name} is defeated!`);player.xp+=currentEnemy.xp;updateStatsUI();currentEnemy=null;rankUp();}
    updateStatsUI(currentEnemy);
}

// Enemy Action
function enemyAction(){
    if(!currentEnemy) return;
    const dmg=Math.floor(Math.random()*(currentEnemy.maxDamage-currentEnemy.minDamage+1))+currentEnemy.minDamage;
    let finalDmg=dmg*(1-player._damageReduction||1);
    player.hp-=finalDmg;
    logAction(`${currentEnemy.name} hits ${player.name} for ${finalDmg.toFixed(0)} damage.`);
}
