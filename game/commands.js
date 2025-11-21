// commands.js — command parser and wiring
import { addToOutput, registerCommandHandler } from './ui.js';
import * as combat from './combat.js';
import * as movement from './movement.js';
import { player, updateUI } from './core.js';
import { getAspect } from './aspects.js';
import * as memories from './memories.js';

// command dispatcher
function handleCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      addToOutput("Commands: go <dir>, seek, attack, ranged, hide, rest <minutes>, meditate <minutes>, choose <aspect>, runes, inventory, use <key>");
      break;
    case 'go':
      movement.move(args[0] || '');
      break;
    case 'seek':
      movement.seek();
      break;
    case 'attack':
      combat.performMeleeAttack();
      break;
    case 'ranged':
      combat.performRangedAttack();
      break;
    case 'hide':
      movement.hide();
      break;
    case 'rest':
      movement.rest(args[0]);
      break;
    case 'meditate':
      movement.meditate(args[0]);
      break;
    case 'choose':
      if (!args[0]) { addToOutput('Choose which aspect? (shadow, sun, mirror, superhuman, perfection, seer)'); break; }
      const asp = getAspect(args[0]);
      if (!asp) { addToOutput('Unknown aspect.'); break; }
      player.aspect = asp.name;
      // roll for true name: 1% base
      if (Math.random() < 0.01) {
        player.trueName = asp.trueName || 'True Name';
        addToOutput(`*** TRUE NAME REVEALED! *** ${player.trueName}`);
      } else {
        player.trueName = 'Veiled Name';
      }
      addToOutput(`You chose the Aspect: ${player.aspect}`);
      updateUI();
      break;
    case 'runes':
      updateUI();
      break;
    case 'inventory':
      if (player.inventory.length === 0) addToOutput('Your inventory is empty.');
      else player.inventory.forEach(i => addToOutput(`- ${i.name} (${i.key})`));
      break;
    case 'use':
      if (!args[0]) { addToOutput('Use what?'); break; }
      if (memories.applyConsumable(player, args[0])) addToOutput('Item used.');
      else addToOutput('Cannot use that item.');
      updateUI();
      break;
    default:
      addToOutput('Unknown command: ' + cmd);
  }
}

// register
registerCommandHandler(handleCommand);
