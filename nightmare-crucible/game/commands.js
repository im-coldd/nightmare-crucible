import { addToOutput } from "./ui.js";
import { attack } from "./combat.js";
import { move } from "./movement.js";

export function handleCommand(cmd) {
    const parts = cmd.split(" ");
    const keyword = parts[0];

    switch (keyword) {
        case "attack":
            attack();
            break;

        case "go":
            move(parts[1]);
            break;

        case "help":
            addToOutput("Available commands: attack, go <dir>");
            break;

        default:
            addToOutput("Unknown command.");
    }
}
