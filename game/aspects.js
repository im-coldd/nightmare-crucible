// aspects.js — aspects definitions and abilities
export const ASPECTS = {
  shadow: {
    name:'Shadow', trueName:'Lost from Light',
    desc:'Shadow Slave: 2x damage for limited turns, high essence cost.',
    abilities: {
      1: { key:'shadow_slave', name:'Shadow Slave', desc:'2x damage for 2 turns. Essence cost 13.', cost:13 },
      2: { key:'shadow_step', name:'Shadow Step', desc:'15% dodge passive (2-turn CD).', cost:0 },
      3: { key:'shadow_manifest', name:'Shadow Manifestation', desc:'+3 base damage and +3% crit (permanent).', cost:17 },
      4: { key:'shadow_avatar', name:'Shadow Avatar', desc:'Attack twice next turn.', cost:25 },
      5: { key:'domain', name:'Domain', desc:'Supreme Domain: 2x damage and -35% incoming for 3 turns. Cost 40.', cost:40 }
    }
  },
  sun: {
    name:'Sun', trueName:'Changing Star',
    desc:'Sunlight Infusion: heals or massive fire damage.',
    abilities: {
      1: { key:'soul_flame', name:'Soul Flame', desc:'Heal 40 HP or double damage 2 turns. Cost 15.', cost:15 },
      2: { key:'flame_manip', name:'Flame Manipulation', desc:'Throw fireball 15-20 damage. Cost 15.', cost:15 },
      3: { key:'longing', name:'Longing', desc:'Reduce incoming damage 30% for 2 turns. Cost 18.', cost:18 },
      4: { key:'partial_trans', name:'Partial Transformation', desc:'Heal 60 HP and double damage 2 turns. Cost 30.', cost:30 },
      5: { key:'domain', name:'Domain', desc:'Supreme Domain: 2x damage and -35% incoming for 3 turns. Cost 40.', cost:40 }
    }
  },
  mirror: { /* similar structure — include required abilities per doc */ },
  superhuman: { /* as doc */ },
  perfection: { /* as doc */ },
  seer: { /* as doc */ }
};

export function getAspect(key) { return ASPECTS[key] || null; }
