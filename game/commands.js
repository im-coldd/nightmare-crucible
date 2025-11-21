import * as movement from './movement.js';

// Example usage
function handleCommand(cmd) {
    switch(cmd.toLowerCase()) {
        case "attack":
            movement.attackEnemy();
            break;
        case "rest":
            movement.rest();
            break;
        case "meditate":
            movement.meditate();
            break;
        case "seek":
            movement.seek(0); // default rank 0 or parse from command
            break;
        case "move north":
            movement.move("north");
            break;
        default:
            logAction(`Unknown command: ${cmd}`);
    }
}
