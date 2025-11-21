// aspects.js — full aspect definitions (clean, validated)
export const ASPECTS = {
  shadow: {
    name: 'Shadow',
    trueName: 'Lost from Light',
    desc: 'Shadow Slave: high damage at essence cost; stealth/double-attack toolkit.',
    tierAbilities: {
      1: { key: 'shadow_slave', name: 'Shadow Slave', desc: '2x damage for 2 turns. Drains 13 Essence.', cost: 13 },
      2: { key: 'shadow_step', name: 'Shadow Step', desc: 'Passive: 15% chance to dodge an incoming attack when activated. 2 turn cooldown.', cost: 0 },
      3: { key: 'shadow_manifest', name: 'Shadow Manifestation', desc: '+3 base damage and +3% crit (activation drains 17 Essence).', cost: 17 },
      4: { key: 'shadow_avatars', name: 'Shadow Avatars', desc: 'Summon an avatar to strike: attack twice next turn. Drains 25 Essence.', cost: 25 },
      5: { key: 'domain', name: 'Domain', desc: 'Supreme Domain: 2x damage and -35% incoming for 3 turns. Drains 40 Essence.', cost: 40 }
    },
    passiveAbilities: {}
  },

  sun: {
    name: 'Sun',
    trueName: 'Changing Star',
    desc: 'Sunlight Infusion: heals or powerful fire attacks.',
    tierAbilities: {
      1: { key: 'soul_flame', name: 'Soul Flame', desc: 'Choice: buff next attack (2x) or heal 40 HP. Drains 15 Essence.', cost: 15 },
      2: { key: 'flame_manipulation', name: 'Flame Manipulation', desc: 'Throw a fireball 15-20 dmg. Drains 11 Essence.', cost: 11 },
      3: { key: 'longing', name: 'Longing', desc: 'Reduce incoming damage by 30% for 2 turns. Drains 18 Essence.', cost: 18 },
      4: { key: 'partial_trans', name: 'Partial Transformation', desc: 'Heal 60 HP and double damage for 2 turns. Drains 30 Essence.', cost: 30 },
      5: { key: 'domain', name: 'Domain', desc: 'Supreme Domain: 2x damage and -35% incoming for 3 turns. Drains 40 Essence.', cost: 40 }
    },
    passiveAbilities: {}
  },

  mirror: {
    name: 'Mirror',
    trueName: 'Prince of Nothing',
    desc: 'Mirror Aspect: clones and reflections.',
    tierAbilities: {
      1: { key: 'split_personality', name: 'Split Personality', desc: 'Split into two: melee attack twice. Drains 13 Essence.', cost: 13 },
      2: { key: 'mirror_beast', name: 'Mirror Beast', desc: 'Summon a mirror beast to do 16-25 damage (auto attack). Drains 15 Essence.', cost: 15 },
      3: { key: 'reflection', name: 'Reflection', desc: 'Reflect an incoming attack back to the enemy. Drains 16 Essence.', cost: 16 },
      4: { key: 'take_over', name: 'Take Over', desc: 'Reduce enemy damage by 25% for 2 turns. Drains 25 Essence.', cost: 25 },
      5: { key: 'domain', name: 'Domain', desc: 'Supreme Domain: 2x damage and -35% incoming for 3 turns. Drains 40 Essence.', cost: 40 }
    },
    passiveAbilities: {}
  },

  superhuman: {
    name: 'Superhuman',
    trueName: 'Raised by Wolves',
    desc: 'Superhuman: raw physical buffs and defensive options.',
    tierAbilities: {
      1: { key: 'overpower', name: 'Overpower', desc: '1.25x damage for 2 turns. Drains 13 Essence.', cost: 13 },
      2: { key: 'defense', name: 'Defense', desc: 'Reduce incoming damage by 23% for 2 turns. Drains 16 Essence.', cost: 16 },
      3: { key: 'inspiration', name: 'Inspiration', desc: '30% incoming reduction + 1.5x next-turn damage. Drains 29 Essence.', cost: 29 },
      4: { key: 'gigantification', name: 'Gigantification', desc: 'Stomp for 20-35 damage. Essence scaled with damage.', cost: 18 },
      5: { key: 'domain', name: 'Domain', desc: 'Supreme Domain: 2x damage and -35% incoming for 3 turns. Drains 40 Essence.', cost: 40 }
    },
    passiveAbilities: {}
  },

  perfection: {
    name: 'Perfection',
    trueName: 'Nightingale',
    desc: 'Perfection: precise strikes and control.',
    tierAbilities: {
      1: { key: 'flight', name: 'Flight', desc: 'Strike from air for 13-20 damage. Drains 12 Essence.', cost: 12 },
      2: { key: 'obedience', name: 'Obedience', desc: 'Reduce enemy attack by 15% for 2 turns. Drains 15 Essence.', cost: 15 },
      3: { key: 'self_inspiration', name: 'Self Inspiration', desc: '20% damage buff. Drains 17 Essence.', cost: 17 },
      4: { key: 'fire_breath', name: 'Fire Breathing', desc: 'Transform and breathe for 18-25 damage. Essence cost per doc.', cost: 20 },
      5: { key: 'domain', name: 'Domain', desc: 'Supreme Domain: 2x damage and -35% incoming for 3 turns. Drains 40 Essence.', cost: 40 }
    },
    passiveAbilities: {}
  },

  seer: {
    name: 'Seer',
    trueName: 'Song of the Fallen',
    desc: 'Seer: dodge, preemption, and enemy confusion.',
    tierAbilities: {
      1: { key: 'future_vision', name: 'Future Vision', desc: '35% dodge chance for 2 turns. Drains 15 Essence.', cost: 15 },
      2: { key: 'future_sight', name: 'Future Sight', desc: 'Dodge next and strike 13-20 damage. Drains 15 Essence.', cost: 15 },
      3: { key: 'perception_swap', name: 'Perception Swap', desc: 'Confuse enemy: -17% hit chance for 2 turns. Drains 16 Essence.', cost: 16 },
      4: { key: 'memory_implant', name: 'Memory Implantation', desc: '26% chance next enemy attack misses. Drains 20 Essence.', cost: 20 },
      5: { key: 'domain', name: 'Domain', desc: 'Supreme Domain: 2x damage and -35% incoming for 3 turns. Drains 40 Essence.', cost: 40 }
    },
    passiveAbilities: {}
  }
};

export function getAspect(key) {
  return ASPECTS[key] || null;
}
