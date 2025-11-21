// commands.js — command parser and wiring (updated)
import * as Core from './core.js';
import * as Combat from './combat.js';
import * as Movement from './movement.js';
import { getAspect, findAbilityByKey } from './aspects.js';
import { applyConsumable } from './memories.js';
import { addToOutput } from './ui.js';

function showHelp() {
  addToOutput("Commands: help, go <dir>, seek, attack, ranged, hide, rest <minutes>, meditate <minutes>, choose <aspect>, runes, inventory, use <item_key>, ability <ability_key> or useaspect <ability_key>");
}

function attemptUseAbilityByKey(key) {
  const info = findAbilityByKey(key);
  if (!info) { addToOutput('Unknown ability key.'); return; }
  if (!Core.player.aspect) { addToOutput('Choose an Aspect first.'); return; }
  const playerAspectKey = Core.player.aspect.toLowerCase();
  if (playerAspectKey !== info.aspect) {
    addToOutput('That ability does not belong to your chosen Aspect.');
    return;
  }
  // cooldown check
  if (Core.player.cooldowns[key] && Core.player.cooldowns[key] > 0) {
    addToOutput(`Ability is on cooldown (${Core.player.cooldowns[key]} turns).`);
    return;
  }
  // essence cost
  if (Core.player.essence < info.ability.cost) {
    addToOutput('Not enough Essence.');
    return;
  }
  // consume essence and set cooldown if specified
  Core.player.essence = Math.max(0, Core.player.essence - (info.ability.cost || 0));
  if (info.ability.cooldown && info.ability.cooldown > 0) {
    Core.player.cooldowns[key] = info.ability.cooldown;
  }

  // call ability execution handler in Combat to apply effects (centralized)
  Combat.useAspectAbility(info.aspect, info.ability);
  Core.updateUI();
}

export function handleCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd = parts[0];
  const args = parts.slice(1);

  switch (cmd) {
    case 'help':
      showHelp();
      break;
    case 'go':
      Movement.move(args[0] || '');
      break;
    case 'seek':
      Movement.seek();
      break;
    case 'attack':
      Combat.performMeleeAttack();
      break;
    case 'ranged':
      Combat.performRangedAttack();
      break;
    case 'hide':
      Movement.hide();
      break;
    case 'rest':
      Movement.rest(args[0]);
      break;
    case 'meditate':
      Movement.meditate(args[0]);
      break;
    case 'choose':
      if (!args[0]) { addToOutput('Choose which aspect? (shadow, sun, mirror, superhuman, perfection, seer)'); break; }
      const asp = getAspect(args[0]);
      if (!asp) { addToOutput('Unknown aspect.'); break; }
      Core.player.aspect = args[0];
      if (Math.random() < 0.01) {
        Core.player.trueName = asp.trueName || 'True Name';
        addToOutput(`*** TRUE NAME REVEALED! *** ${Core.player.trueName}`);
      } else {
        Core.player.trueName = 'Veiled Name';
      }
      addToOutput(`You chose the Aspect: ${Core.player.aspect}`);
      Core.updateUI();
      break;
    case 'runes':
      Core.updateUI();
      break;
    case 'inventory':
      if (Core.player.inventory.length === 0) addToOutput('Your inventory is empty.');
      else Core.player.inventory.forEach(i => addToOutput(`- ${i.name} (${i.key})`));
      break;
    case 'use':
      if (!args[0]) { addToOutput('Use what?'); break; }
      if (applyConsumable(Core.player, args[0])) addToOutput('Item used.');
      else addToOutput('Cannot use that item.');
      Core.updateUI();
      break;
    case 'ability':
    case 'useaspect':
    case 'useability':
      if (!args[0]) { addToOutput('Which ability key? e.g. soul_flame, shadow_slave'); break; }
      attemptUseAbilityByKey(args[0]);
      break;
    default:
      addToOutput('Unknown command: ' + cmd);
  }
}

// register with UI (ui.js will import and register)
export default handleCommand;
