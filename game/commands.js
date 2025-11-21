import { addToOutput, registerCommandHandler } from './ui.js';
import { attack } from './combat.js';
import { move, seek, rest, meditate } from './movement.js';
import { player, updateUI } from './core.js';
import { getAspect as getAspectFromKey } from './aspects.js';
import * as memories from './memories.js';

function handleCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      addToOutput('Commands: go <dir>, seek, attack, hide, rest <minutes>, meditate <minutes>, choose <aspect>, aspect, runes, inventory, use <key>');
      break;
    case 'attack':
      attack(); updateUI(); break;
    case 'go':
      if (!args[0]) { addToOutput('Go where?'); break; }
      move(args[0]); updateUI(); break;
    case 'seek':
      seek(); updateUI(); break;
    case 'rest':
      if (!args[0]) { addToOutput('Specify minutes 30-120.'); break; }
      rest(args[0]); break;
    case 'meditate':
      if (!args[0]) { addToOutput('Specify minutes 5-30.'); break; }
      meditate(args[0]); break;
    case 'choose':
      if (!args[0]) { addToOutput('Choose which aspect? shadow or sun'); break; }
      const asp = getAspectFromKey(args[0]);
      if (!asp) addToOutput('Unknown aspect'); else { player.aspect = asp.name; addToOutput(`You choose ${asp.name}`); updateUI(); }
      break;
    case 'runes':
      updateUI(); break;
    case 'inventory':
      if (player.inventory.length === 0) addToOutput('Inventory empty'); else player.inventory.forEach(i => addToOutput(`- ${i.name} (${i.key})`));
      break;
    case 'use':
      if (!args[0]) { addToOutput('Use what?'); break; }
      if (memories.applyConsumable(player, args[0])) addToOutput('Item used.'); else addToOutput('Cannot use that.');
      updateUI();
      break;
    default:
      addToOutput('Unknown command: ' + cmd);
  }
}

registerCommandHandler(handleCommand);
