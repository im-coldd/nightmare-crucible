// aspects.js — full aspect definitions with ability keys and cooldowns
export const ASPECTS = {
  shadow: {
    name: 'Shadow',
    trueName: 'Lost from Light',
    desc: 'Shadow Slave: high damage at essence cost; stealth/double-attack toolkit.',
    tierAbilities: {
      1: { key: 'shadow_slave', name: 'Shadow Slave', desc: '2x damage for 2 turns. Drains 13 Essence.', cost: 13, cooldown: 6, type: 'buff' },
      2: { key: 'shadow_step', name: 'Shadow Step', desc: '15% dodge for next enemy attack. No cost (toggle).', cost: 0, cooldown: 5, type: 'utility' },
      3: { key: 'shadow_manifest', name: 'Shadow Manifestation', desc: '+3 base damage and +3% crit (permanent buff).', cost: 17, cooldown: 0, type: 'passive' },
      4: { key: 'shadow_avatar', name: 'Shadow Avatar', desc: 'Attack twice next turn (double attack). Drains 25 Essence.', cost: 25, cooldown: 7, type: 'offense' },
      5: { key: 'shadow_domain', name: 'Domain', desc: 'Supreme: 2x damage and -35% incoming for 3 turns. Drains 40 Essence.', cost: 40, cooldown: 12, type: 'domain' }
    }
  },

  sun: {
    name: 'Sun',
    trueName: 'Changing Star',
    desc: 'Sunlight Infusion: heals or powerful fire attacks.',
    tierAbilities: {
      1: { key: 'soul_flame', name: 'Soul Flame', desc: 'Choice: buff next attack (2x) or heal 40 HP. Drains 15 Essence.', cost: 15, cooldown: 6, type: 'choice' },
      2: { key: 'flame_manipulation', name: 'Flame Manipulation', desc: 'Fireball 15-25 dmg. Drains 11 Essence.', cost: 11, cooldown: 4, type: 'offense' },
      3: { key: 'longing', name: 'Longing', desc: 'Reduce incoming damage by 30% for 2 turns. Drains 18 Essence.', cost: 18, cooldown: 6, type: 'defense' },
      4: { key: 'partial_trans', name: 'Partial Transformation', desc: 'Heal 60 HP and double damage for 2 turns. Drains 30 Essence.', cost: 30, cooldown: 10, type: 'buff' },
      5: { key: 'sun_domain', name: 'Domain', desc: 'Supreme: 2x damage and -35% incoming for 3 turns. Drains 40 Essence.', cost: 40, cooldown: 12, type: 'domain' }
    }
  },

  mirror: {
    name: 'Mirror',
    trueName: 'Prince of Nothing',
    desc: 'Mirror Aspect: clones and reflections.',
    tierAbilities: {
      1: { key: 'split_personality', name: 'Split Personality', desc: 'Attack twice this turn. Drains 13 Essence.', cost: 13, cooldown: 6, type: 'offense' },
      2: { key: 'mirror_beast', name: 'Mirror Beast', desc: 'Summon mirror beast: deals 16-25 damage. Drains 15 Essence.', cost: 15, cooldown: 7, type: 'summon' },
      3: { key: 'reflection', name: 'Reflection', desc: 'Reflect next incoming attack back. Drains 16 Essence.', cost: 16, cooldown: 8, type: 'utility' },
      4: { key: 'take_over', name: 'Take Over', desc: 'Reduce enemy damage by 25% for 2 turns. Drains 25 Essence.', cost: 25, cooldown: 8, type: 'defense' },
      5: { key: 'mirror_domain', name: 'Domain', desc: 'Supreme domain (2x damage & -35% incoming for 3 turns).', cost: 40, cooldown: 12, type: 'domain' }
    }
  },

  superhuman: {
    name: 'Superhuman',
    trueName: 'Raised by Wolves',
    desc: 'Superhuman: raw physical buffs and defensive options.',
    tierAbilities: {
      1: { key: 'overpower', name: 'Overpower', desc: '1.25x damage for 2 turns. Drains 13 Essence.', cost: 13, cooldown: 5, type: 'buff' },
      2: { key: 'defense', name: 'Defense', desc: 'Reduce incoming damage by 23% for 2 turns. Drains 16 Essence.', cost: 16, cooldown: 6, type: 'defense' },
      3: { key: 'inspiration', name: 'Inspiration', desc: '30% incoming reduction + 1.5x next-turn damage. Drains 29 Essence.', cost: 29, cooldown: 9, type: 'buff' },
      4: { key: 'gigantification', name: 'Gigantification', desc: 'Stomp for 20-35 damage. Drains 18 Essence.', cost: 18, cooldown: 6, type: 'offense' },
      5: { key: 'super_domain', name: 'Domain', desc: 'Supreme domain (2x damage & -35% incoming for 3 turns).', cost: 40, cooldown: 12, type: 'domain' }
    }
  },

  perfection: {
    name: 'Perfection',
    trueName: 'Nightingale',
    desc: 'Perfection: precise strikes and control.',
    tierAbilities: {
      1: { key: 'flight', name: 'Flight', desc: 'Strike from air for 13-20 damage. Drains 12 Essence.', cost: 12, cooldown: 5, type: 'offense' },
      2: { key: 'obedience', name: 'Obedience', desc: 'Reduce enemy attack by 15% for 2 turns. Drains 15 Essence.', cost: 15, cooldown: 6, type: 'defense' },
      3: { key: 'self_inspiration', name: 'Self Inspiration', desc: '20% damage buff. Drains 17 Essence.', cost: 17, cooldown: 6, type: 'buff' },
      4: { key: 'fire_breath', name: 'Fire Breathing', desc: 'Transform and breathe for 18-25 damage.', cost: 20, cooldown: 7, type: 'offense' },
      5: { key: 'perfect_domain', name: 'Domain', desc: 'Supreme domain (2x damage & -35% incoming for 3 turns).', cost: 40, cooldown: 12, type: 'domain' }
    }
  },

  seer: {
    name: 'Seer',
    trueName: 'Song of the Fallen',
    desc: 'Seer: dodge, preemption, and enemy confusion.',
    tierAbilities: {
      1: { key: 'future_vision', name: 'Future Vision', desc: '35% dodge chance for 2 turns. Drains 15 Essence.', cost: 15, cooldown: 6, type: 'defense' },
      2: { key: 'future_sight', name: 'Future Sight', desc: 'Dodge next and strike 13-20 damage. Drains 15 Essence.', cost: 15, cooldown: 6, type: 'offense' },
      3: { key: 'perception_swap', name: 'Perception Swap', desc: 'Confuse enemy: -17% hit chance for 2 turns. Drains 16 Essence.', cost: 16, cooldown: 7, type: 'utility' },
      4: { key: 'memory_implant', name: 'Memory Implantation', desc: '26% chance next enemy attack misses. Drains 20 Essence.', cost: 20, cooldown: 8, type: 'utility' },
      5: { key: 'seer_domain', name: 'Domain', desc: 'Supreme domain (2x damage & -35% incoming for 3 turns).', cost: 40, cooldown: 12, type: 'domain' }
    }
  }
};

export function getAspect(key) {
  return ASPECTS[key] || null;
}

// helper to find ability by key
export function findAbilityByKey(abilityKey) {
  for (const k of Object.keys(ASPECTS)) {
    const asp = ASPECTS[k];
    for (const tier of Object.keys(asp.tierAbilities)) {
      const ab = asp.tierAbilities[tier];
      if (ab.key === abilityKey) return { aspect: k, ability: ab, tier: Number(tier) };
    }
  }
  return null;
}
