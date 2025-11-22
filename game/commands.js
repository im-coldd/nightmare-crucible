// commands.js — parse input, call logic modules; returns string or frames array

import * as Core from './core.js';
import * as Combat from './combat.js';
import * as Movement from './movement.js';
import * as Aspects from './aspects.js';
import * as Memories from './memories.js';

// IMPORTANT: updateUI is NOT imported here — UI updates are handled in ui.js ONLY.

export default function handleCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd = (parts[0] || '').toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {

    case 'help':
      return "Commands: help, go <dir>, seek, attack, ranged, hide, rest <min>, meditate <min>, choose <aspect>, abilities, status, inventory, use <item_key>, ability <ability_key>, restart, keep";

    // Movement
    case 'go':
      return Movement.move(args[0] || '');

    case 'seek':
      return Movement.seek();

    // Combat
    case 'attack':
      return Combat.attack();

    case 'ranged':
      return Combat.performRangedAttack();

    case 'hide':
      return Movement.hide();

    // Recovery
    case 'rest':
      return Movement.rest(args[0]);

    case 'meditate':
      return Movement.meditate(args[0]);

    // Aspect selection
    case 'choose':
      if (!args[0])
        return "Choose an Aspect (shadow, sun, mirror, superhuman, perfection, seer).";
      return Aspects.chooseAspect(args[0].toLowerCase());

    // Status
    case 'runes':
    case 'status':
      return Core.getStatusString();

    case 'abilities':
      return Aspects.listAspectAbilities();

    // Inventory
    case 'inventory':
      return Core.player.inventory.length
        ? Core.player.inventory.map(i => `- ${i.name} (${i.key})`).join('\n')
        : 'Inventory empty.';

    case 'use':
      if (!args[0]) return 'Use what?';
      return Memories.applyConsumable(Core.player, args[0])
        ? 'Item used.'
        : 'Cannot use that item.';

    // Aspect abilities
    case 'ability':
    case 'useaspect':
      if (!args[0]) return "Which ability key?";

      const found = Aspects.findAbilityByKey(args[0]);

      if (!found) return "Unknown ability key.";
      if (!Core.player.aspect) return "Choose an Aspect first.";
      if (Core.player.aspect !== found.aspectKey)
        return "That ability is not from your Aspect.";

      if (Core.player.cooldowns[found.ability.key] &&
          Core.player.cooldowns[found.ability.key] > 0)
        return `Ability on cooldown (${Core.player.cooldowns[found.ability.key]} turns).`;

      if ((found.ability.cost || 0) > Core.player.essence)
        return "Not enough Essence.";

      Core.player.essence = Math.max(0, Core.player.essence - (found.ability.cost || 0));
      if (found.ability.cooldown && found.ability.cooldown > 0)
        Core.player.cooldowns[found.ability.key] = found.ability.cooldown;

      Core.saveGame();
      return Combat.useAspectAbility(found.aspectKey, found.ability);

    // Restart system
    case 'restart':
      Core.clearSave();
      return 'Save cleared. Type "choose <aspect>" to start a new game, or "keep" to continue.';

    case 'keep':
      return 'Continuing with current save.';

    // Unknown command
    default:
      return `Unknown command: ${cmd}. Type 'help'.`;
  }
}
