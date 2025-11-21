// commands.js
import { move, seek, meditate, rest, hide } from './movement.js';
import { attackEnemy, ASPECT_ABILITIES, currentEnemy } from './combat.js';
import { player, logAction } from './core.js';
import { updateStatsUI } from './core.js';

export function handleCommand(input){
    const [cmd, ...args]=input.toLowerCase().split(" ");
    switch(cmd){
        case "help":
            logAction("Commands: move <dir>, seek, meditate, rest, hide, attack, ability <name>");
            break;
        case "move": move(args[0]||"forward"); break;
        case "seek": seek(); break;
        case "meditate": meditate(); break;
        case "rest": rest(); break;
        case "hide": hide(); break;
        case "attack": attackEnemy(); break;
        case "ability":
            if(!player.aspect)return logAction("Choose an aspect first!");
            const abilityName=args.join(" ");
            const ability=ASPECT_ABILITIES[player.aspect].find(a=>a.name.toLowerCase()===abilityName);
            if(!ability) return logAction("Ability not found!");
            ability.effect();
            updateStatsUI(currentEnemy);
            break;
        default: logAction("Unknown command. Type 'help'.");
    }
}
