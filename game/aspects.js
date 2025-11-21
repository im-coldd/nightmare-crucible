export const ASPECT_DATA = {
  shadow: {
    name: 'Shadow',
    trueName: 'Lost from Light',
    description: 'Shadow Slave: Receives 2x power at the cost of Essence and increased counterattack vulnerability.',
    tierAbilities: {
      1: { name: 'Shadow Step', description: '50% dodge next counterattack.' },
      2: { name: 'Domain', description: 'Call forth two nightmares for high bonus damage.' }
    },
    passiveAbilities: {
      3: { name: 'Shadow Manifestation', description: 'Permanent +4 base attack and +3% crit.' }
    }
  },
  sun: {
    name: 'Sun',
    trueName: 'Changing Star',
    description: 'Sunlight Infusion: Infuses attacks for extra fire damage.',
    tierAbilities: {
      1: { name: 'Soul Flame', description: 'Buff next attack (2x) or Heal (15-20 HP).' },
      2: { name: 'Flame Manipulation', description: 'Throw a fireball dealing scaled damage.' }
    },
    passiveAbilities: {}
  }
};

export function getAspect(key) {
  return ASPECT_DATA[key] || null;
}
