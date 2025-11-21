// abilities.js
import { player, logAction, updateStatsUI } from './core.js';
import { currentEnemy } from './combat.js';

export const ASPECT_ABILITIES = {
    Sun: [
        { name:"Soul Flame", essenceCost:15, type:"active", effect:(choice)=>{
            if(choice==="heal") {
                const heal = 40;
                player.hp = Math.min(player.maxHp, player.hp+heal);
                logAction(`${player.name} heals ${heal} HP with Soul Flame!`);
            } else {
                player._damageMultiplier = 2;
                player._damageBuffTurns = 2;
                logAction(`${player.name} doubles damage for 2 turns with Soul Flame!`);
            }
            player.essence -= 15;
        }},
        { name:"Flame Manipulation", essenceCost:10, type:"active", effect:()=>{
            const dmg = Math.floor(Math.random()*6)+15;
            currentEnemy.health -= dmg;
            player.essence -= 10;
            logAction(`${player.name} hits ${currentEnemy.name} with Flame Manipulation for ${dmg} damage.`);
        }},
        { name:"Longing", essenceCost:18, type:"active", effect:()=>{
            player._damageReduction = 0.3;
            player._buffTurns = 2;
            player.essence -= 18;
            logAction(`${player.name} reduces incoming damage by 30% for 2 turns with Longing.`);
        }},
        { name:"Partial Transformation", essenceCost:30, type:"active", effect:()=>{
            const heal = 60;
            player.hp = Math.min(player.maxHp, player.hp+heal);
            player._damageMultiplier = 2;
            player._damageBuffTurns = 2;
            player.essence -= 30;
            logAction(`${player.name} heals 60 HP and doubles damage for 2 turns!`);
        }},
        { name:"Domain", essenceCost:40, type:"domain", effect:()=>{
            player._damageMultiplier = 2;
            player._damageReduction = 0.35;
            player._buffTurns = 3;
            player.essence -= 40;
            logAction(`${player.name} activates Sun Domain: 2x damage & 35% damage reduction for 3 turns.`);
        }},
    ],

    Shadow: [
        { name:"Shadow Slave", essenceCost:13, type:"active", effect:()=>{
            player._damageMultiplier = 2;
            player._damageBuffTurns = 2;
            player.essence -= 13;
            logAction(`${player.name} uses Shadow Slave: 2x damage for 2 turns.`);
        }},
        { name:"Shadow Step", essenceCost:0, type:"passive", effect:()=>{
            player._dodgeChance = 0.15;
            player._cooldown = 2;
            logAction(`${player.name} activates Shadow Step: 15% dodge chance for 2 turns.`);
        }},
        { name:"Shadow Manifestation", essenceCost:17, type:"active", effect:()=>{
            player._damageBuff = 3;
            player._critBuff = 0.03;
            player.essence -= 17;
            logAction(`${player.name} summons a shadow blade: +3 damage, +3% crit.`);
        }},
        { name:"Shadow Avatars", essenceCost:25, type:"active", effect:()=>{
            player._extraAttacks = 2;
            player.essence -= 25;
            logAction(`${player.name} summons Shadow Avatars: attack twice next turn.`);
        }},
        { name:"Domain", essenceCost:40, type:"domain", effect:()=>{
            player._damageMultiplier = 2;
            player._damageReduction = 0.35;
            player._buffTurns = 3;
            player.essence -= 40;
            logAction(`${player.name} activates Shadow Domain: 2x damage & 35% damage reduction for 3 turns.`);
        }},
    ],

    Mirror: [
        { name:"Split Personality", essenceCost:13, type:"active", effect:()=>{
            player._extraAttacks = 2;
            player.essence -= 13;
            logAction(`${player.name} splits into two: attack twice this turn.`);
        }},
        { name:"Mirror Beast", essenceCost:17, type:"active", effect:()=>{
            const dmg = Math.floor(Math.random()*10)+16;
            currentEnemy.health -= dmg;
            player.essence -= 17;
            logAction(`${player.name} summons Mirror Beast for ${dmg} damage.`);
        }},
        { name:"Reflection", essenceCost:16, type:"active", effect:()=>{
            player._reflectNext = true;
            player.essence -= 16;
            logAction(`${player.name} activates Reflection: reflect next attack.`);
        }},
        { name:"Take Over", essenceCost:25, type:"active", effect:()=>{
            currentEnemy._damageReduction = 0.25;
            player.essence -= 25;
            logAction(`${player.name} uses Take Over: enemy damage reduced by 25% for 2 turns.`);
        }},
        { name:"Domain", essenceCost:40, type:"domain", effect:()=>{
            player._damageMultiplier = 2;
            player._damageReduction = 0.35;
            player._buffTurns = 3;
            player.essence -= 40;
            logAction(`${player.name} activates Mirror Domain: 2x damage & 35% DR for 3 turns.`);
        }},
    ],

    // Similarly define Superhuman, Perfection, Seer...
};
