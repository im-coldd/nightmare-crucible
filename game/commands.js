// commands.js — parse input, call logic modules; returns string or frames array
import * as Core from './core.js';
import * as Combat from './combat.js';
import * as Movement from './movement.js';
import { getAspect, findAbilityByKey } from './aspects.js';
import * as Memories from './memories.js';
import * as Enemies from './enemies.js';

function showHelp() {
  return "Commands: help, go <dir>, seek, attack, ranged, hide, rest <min>, meditate <min>, choose <aspect>, runes, inventory, use <item_key>, ability <ability_key>, restart, keep, status";
}

function chooseAspectFlow(arg) {
  if (!arg) return "Choose which aspect? (shadow, sun, mirror, superhuman, perfection, seer)";
  if (Core.player.aspect) return "Aspect already chosen. To change you must restart the game (type 'restart').";
  const asp = getAspect(arg);
  if (!asp) return "Unknown aspect.";
  Core.player.aspect = arg;
  Core.player.trueName = Math.random() < 0.01 ? (asp.trueName || 'True Name') : 'Veiled Name';
  Core.saveGame();
  return `You chose the Aspect: ${Core.player.aspect}.\n${Core.player.trueName === 'Veiled Name' ? 'Your True Name remains hidden for now.' : '*** TRUE NAME REVEALED! *** ' + Core.player.trueName}`;
}

function attemptUseAbility(key) {
  const found = findAbilityByKey(key);
  if (!found) return "Unknown ability key.";
  const { aspectKey, ability } = found;
  if (!Core.player.aspect) return "Choose an Aspect first.";
  if (Core.player.aspect !== aspectKey) return "That ability is not from your Aspect.";
  if (Core.player.cooldowns[ability.key] && Core.player.cooldowns[ability.key] > 0) return `Ability on cooldown (${Core.player.cooldowns[ability.key]} turns).`;
  if ((ability.cost || 0) > Core.player.essence) return "Not enough Essence.";

  // consume & set cooldown
  Core.player.essence = Math.max(0, Core.player.essence - (ability.cost || 0));
  if (ability.cooldown && ability.cooldown > 0) Core.player.cooldowns[ability.key] = ability.cooldown;

  // call combat to apply
  const res = Combat.useAspectAbility(aspectKey, ability);
  Core.tickCooldowns();
  Core.saveGame();
  return res;
}

export default function handleCommand(raw) {
  const parts = raw.trim().split(/\s+/);
  const cmd = (parts[0] || '').toLowerCase();
  const args = parts.slice(1);

  switch (cmd) {
    case 'help': return showHelp();
    case 'go': return Movement.move(args[0]||'');
    case 'seek': return Movement.seek();
    case 'attack': return Combat.performMeleeAttack();
    case 'ranged': return Combat.performRangedAttack();
    case 'hide': return Movement.hide();
    case 'rest': return Movement.rest(args[0]);
    case 'meditate': return Movement.meditate(args[0]);
    case 'choose': return chooseAspectFlow(args[0] && args[0].toLowerCase());
    case 'runes': return `Runes: T:${Core.player.tier} XP:${Core.player.xp} HP:${Core.player.health}/${Core.player.maxHealth} Ess:${Core.player.essence}/${Core.player.maxEssence}`;
    case 'inventory': return Core.player.inventory.length ? Core.player.inventory.map(i=>`- ${i.name} (${i.key})`).join('\n') : 'Inventory empty.';
    case 'use': if (!args[0]) return 'Use what?'; return Memories.applyConsumable(Core.player, args[0]) ? 'Item used.' : 'Cannot use that item.';
    case 'ability':
    case 'useaspect':
    case 'useability':
      if (!args[0]) return "Which ability key?";
      return attemptUseAbility(args[0]);
    case 'restart':
      Core.clearSave();
      return 'Save cleared. Type "keep" to continue with new game or "choose <aspect>" to select an Aspect.';
    case 'keep':
      return 'Continuing with existing save...';
    case 'status':
      return `HP:${Core.player.health}/${Core.player.maxHealth} Ess:${Core.player.essence}/${Core.player.maxEssence} Stamina:${Core.player.stamina}/${Core.player.maxStamina} Zone:${Core.player.zone}`;
    default: return `Unknown command: ${cmd}. Type 'help'.`;
  }
}
