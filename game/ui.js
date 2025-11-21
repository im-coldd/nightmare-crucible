// ui.js
import { handleCommand } from './commands.js';
const input=document.getElementById("command-input");
input.addEventListener("keypress", e=>{
    if(e.key==="Enter"){
        const val=input.value.trim();
        if(val!==""){
            handleCommand(val);
            input.value="";
        }
    }
});
