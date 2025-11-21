// commands.js
import * as Core from './core.js';
import { attack } from './combat.js';
import { move, seek, meditate } from './movement.js';
import { chooseAspect } from './aspects.js';
import { updateUI } from './core.js';

export function handleCommand(input) {
  const [cmd, ...args] = input.trim().toLowerCase().split(" ");

  switch (cmd) {
    case 'help':
      return "Commands: help, go <dir>, attack, seek, meditate, choose <aspect>";

    case 'go':
      return move(args[0]);

    case 'attack':
      return attack();

    case 'seek':
      return seek();

    case 'meditate':
      return meditate();

    case 'choose':
      return chooseAspect(args[0]);

    default:
      return "Unknown command.";
  }
}
      addToOutput('Unknown command: ' + cmd);
  }
}

registerCommandHandler(handleCommand);
