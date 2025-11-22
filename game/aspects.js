// aspects.js — definitions + chooseAspect + findAbilityByKey + ability list
import * as Core from './core.js';

export const ASPECTS = {
  shadow: {
    name: 'Shadow',
    trueName: 'Lost from Light',
    desc: 'Shadow Slave: high damage at essence cost; stealth/double-attack toolkit.',
    tierAbilities: {
      1: { key: 'shadow_slave', name: 'Shadow Slave', desc: '2x damage for 2 turns. Drains 13 Essence.', cost: 13, cooldown: 6, type: 'buff' },
      2: { key: 'shadow_step', name: 'Shadow Step', desc: '15% dodge for next attack. No cost.', cost: 0, cooldown: 5, type: 'utility' },
      3: { key: 'shadow_manifest', name: 'Shadow Manifestation', desc: '+3 dmg & +3% crit. Drains 17 Essence.', cost: 17, cooldown: 0, type: 'passive' },
      4: { key: 'shadow_avatar', name: 'Shadow Avatar', desc: 'Double attack next turn. Drains 25 Essence.', cost: 25, cooldown: 7, type: 'offense' },
      5: { key: 'shadow_domain', name: 'Domain', desc: 'Supreme: 2x dmg & -35% incoming for 3 turns.', cost: 40, cooldown: 12, type: 'domain' }
    },
    passiveAbilities: {}
  },

  sun: {
    name: 'Sun',
    trueName: 'Changing Star',
    desc: 'Sunlight Infusion: healing and fire-based offense.',
    tierAbilities: {
      1: { key: 'soul_flame', name: 'Soul Flame', desc: 'Double next attack OR heal 40 HP. Cost 15.', cost: 15, cooldown: 6, type: 'choice' },
      2: { key: 'flame_manipulation', name: 'Flame Manipulation', desc: 'Fireball 15–25 dmg. Cost 11.', cost: 11, cooldown: 4, type: 'offense' },
      3: { key: 'longing', name: 'Longing', desc: 'Reduce dmg by 30% for 2 turns. Cost 18.', cost: 18, cooldown: 6, type: 'defense' },
      4: { key: 'partial_trans', name: 'Partial Transformation', desc: 'Heal 60 + 2x dmg buff. Cost 30.', cost: 30, cooldown: 10, type: 'buff' },
      5: { key: 'sun_domain', name: 'Domain', desc: 'Supreme domain: 2x dmg & -35% incoming.', cost: 40, cooldown: 12, type: 'domain' }
    },
    passiveAbilities: {}
  },

  mirror: {
    name: 'Mirror',
    trueName: 'Prince of Nothing',
    desc: 'Illusions, duplications, and reflections.',
    tierAbilities: {
      1: { key: 'split_personality', name: 'Split Personality', desc: 'Strike twice. Cost 13.', cost: 13, cooldown: 6, type: 'offense' },
      2: { key: 'mirror_beast', name: 'Mirror Beast', desc: 'Summon beast 16–25 dmg. Cost 15.', cost: 15, cooldown: 7, type: 'summon' },
      3: { key: 'reflection', name: 'Reflection', desc: 'Reflect next incoming dmg. Cost 16.', cost: 16, cooldown: 8, type: 'utility' },
      4: { key: 'take_over', name: 'Take Over', desc: 'Enemy -25% dmg for 2 turns. Cost 25.', cost: 25, cooldown: 8, type: 'defense' },
      5: { key: 'mirror_domain', name: 'Domain', desc: 'Supreme domain ability.', cost: 40, cooldown: 12, type: 'domain' }
    },
    passiveAbilities: {}
  },

  superhuman: {
    name: 'Superhuman',
    trueName: 'Raised by Wolves',
    desc: 'Raw physical augmentation and brute power.',
    tierAbilities: {
      1: { key: 'overpower', name: 'Overpower', desc: '1.25x dmg for 2 turns. Cost 13.', cost: 13, cooldown: 5, type: 'buff' },
      2: { key: 'defense', name: 'Defense', desc: '23% dmg reduction for 2 turns. Cost 16.', cost: 16, cooldown: 6, type: 'defense' },
      3: { key: 'inspiration', name: 'Inspiration', desc: '30% dmg reduction & 1.5x next dmg. Cost 29.', cost: 29, cooldown: 9, type: 'buff' },
      4: { key: 'gigantification', name: 'Gigantification', desc: 'Stomp 20–35 dmg. Cost 18.', cost: 18, cooldown: 6, type: 'offense' },
      5: { key: 'super_domain', name: 'Domain', desc: 'Supreme domain ability.', cost: 40, cooldown: 12, type: 'domain' }
    },
    passiveAbilities: {}
  },

  perfection: {
    name: 'Perfection',
    trueName: 'Nightingale',
    desc: 'Precision and soul-harmonized strikes.',
    tierAbilities: {
      1: { key: 'flight', name: 'Flight', desc: 'Air strike 13–20 dmg. Cost 12.', cost: 12, cooldown: 5, type: 'offense' },
      2: { key: 'obedience', name: 'Obedience', desc: 'Enemy -15% dmg 2 turns. Cost 15.', cost: 15, cooldown: 6, type: 'defense' },
      3: { key: 'self_inspiration', name: 'Self Inspiration', desc: '20% dmg buff. Cost 17.', cost: 17, cooldown: 6, type: 'buff' },
      4: { key: 'fire_breath', name: 'Fire Breathing', desc: 'Transform, 18–25 dmg. Cost 20.', cost: 20, cooldown: 7, type: 'offense' },
      5: { key: 'perfect_domain', name: 'Domain', desc: 'Supreme domain.', cost: 40, cooldown: 12, type: 'domain' }
    },
    passiveAbilities: {}
  },

  seer: {
    name: 'Seer',
    trueName: 'Song of the Fallen',
    desc: 'Preemption, dodge, and confusion manipulation.',
    tierAbilities: {
      1: { key: 'future_vision', name: 'Future Vision', desc: '35% dodge 2 turns. Cost 15.', cost: 15, cooldown: 6, type: 'defense' },
      2: { key: 'future_sight', name: 'Future Sight', desc: 'Dodge next + strike 13–20 dmg. Cost 15.', cost: 15, cooldown: 6, type: 'offense' },
      3: { key: 'perception_swap', name: 'Perception Swap', desc: 'Confuse enemy -17% hit. Cost 16.', cost: 16, cooldown: 7, type: 'utility' },
      4: { key: 'memory_implant', name: 'Memory Implantation', desc: '26% chance next attack misses. Cost 20.', cost: 20, cooldown: 8, type: 'utility' },
      5: { key: 'seer_domain', name: 'Domain', desc: 'Supreme domain.', cost: 40, cooldown: 12, type: 'domain' }
    },
    passiveAbilities: {}
  }
};


export function getAspect(key) {
  return ASPECTS[key] || null;
}

/* ---------------------------------------------
   CHOOSE ASPECT — (Fixes your commands.js error)
---------------------------------------------- */
export function chooseAspect(key) {
  if (Core.player.aspect) {
    return `You have already chosen the ${Core.player.aspect} aspect.`;
  }

  const asp = ASPECTS[key];
  if (!asp) return "Unknown aspect. Options: shadow, sun, mirror, superhuman, perfection, seer.";

  Core.player.aspect = key;
  Core.player.trueName = Math.random() < 0.01 ? asp.trueName : null;

  Core.saveGame();
  Core.updateUI();

  let msg = `You have chosen the ${asp.name} Aspect.\n${asp.desc}`;
  if (Core.player.trueName) msg += `\n*** TRUE NAME AWAKENED: ${asp.trueName}! ***`;

  return msg;
}

/* ---------------------------------------------
   FIND ABILITY BY KEY
---------------------------------------------- */
export function findAbilityByKey(abilityKey) {
  for (const akey of Object.keys(ASPECTS)) {
    const asp = ASPECTS[akey];
    for (const tier of Object.keys(asp.tierAbilities)) {
      const ab = asp.tierAbilities[tier];
      if (ab.key === abilityKey) {
        return { aspectKey: akey, ability: ab, tier: Number(tier) };
      }
    }
  }
  return null;
}

/* ---------------------------------------------
   SIMPLE ABILITY LIST (Option A)
---------------------------------------------- */
export function listAspectAbilities() {
  const aspKey = Core.player.aspect;
  if (!aspKey) return "You have not chosen an Aspect yet.";

  const asp = ASPECTS[aspKey];
  let msg = `Abilities for ${asp.name}:\n`;

  for (const t of Object.keys(asp.tierAbilities)) {
    const ab = asp.tierAbilities[t];
    msg += `- ${ab.key} (Tier ${t})\n`;
  }

  return msg.trim();
}
