import * as movement from './movement.js';
import { attackEnemy } from './combat.js';
import { logAction } from './core.js';

const input = document.getElementById("command-input");

input.addEventListener("keydown", (e)=>{
    if(e.key!=="Enter") return;
    const cmd = e.target.value.trim().toLowerCase();
    e.target.value="";
    
    if(cmd.startsWith("move ")) movement.move(cmd.split(" ")[1]);
    else if(cmd.startsWith("seek")) {
        const rank = parseInt(cmd.split(" ")[1])||1;
        movement.seek(rank);
    }
    else if(cmd==="rest") movement.rest();
    else if(cmd==="meditate") movement.meditate();
    else if(cmd==="attack") attackEnemy();
    else logAction(`Unknown command: ${cmd}`);
});
else if(cmd.startsWith("use ")) {
    const abilityName = cmd.slice(4);
    useAbility(abilityName);
}
