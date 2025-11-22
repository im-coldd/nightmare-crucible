// aspects.js — definitions + findAbilityByKey helper
export const ASPECTS = {
  shadow: {
    name: 'Shadow',
    trueName: 'Lost from Light',
    tierAbilities: {
      1: { key: 'shadow_slave', name:'Shadow Slave', desc:'2x damage next 2 attacks', cost:13, cooldown:6, type:'buff' },
      2: { key: 'shadow_step', name:'Shadow Step', desc:'Evade next attack (15%)', cost:0, cooldown:5, type:'utility' },
      3: { key: 'shadow_manifest', name:'Shadow Manifestation', desc:'+3 base damage +3% crit (permanent)', cost:17, cooldown:0, type:'passive' },
      4: { key: 'shadow_avatar', name:'Shadow Avatar', desc:'Attack twice next turn', cost:25, cooldown:7, type:'offense' },
      5: { key: 'shadow_domain', name:'Domain', desc:'2x damage & -35% incoming (3 turns)', cost:40, cooldown:12, type:'domain' }
    }
  },
  sun: {
    name:'Sun', trueName:'Changing Star',
    tierAbilities: {
      1: { key:'soul_flame', name:'Soul Flame', desc:'Buff next attack or heal 40 HP', cost:15, cooldown:6, type:'choice' },
      2: { key:'flame_manipulation', name:'Flame Manipulation', desc:'15-25 dmg fireball', cost:11, cooldown:4, type:'offense' },
      3: { key:'longing', name:'Longing', desc:'-30% incoming for 2 turns', cost:18, cooldown:6, type:'defense' },
      4: { key:'partial_trans', name:'Partial Transformation', desc:'Heal 60 and 2x damage for 2 turns', cost:30, cooldown:10, type:'buff' },
      5: { key:'sun_domain', name:'Domain', desc:'2x damage & -35% incoming (3 turns)', cost:40, cooldown:12, type:'domain' }
    }
  },
  // other aspects shortened for brevity; keep same shape
  mirror: {
    name:'Mirror', trueName:'Prince of Nothing',
    tierAbilities: {
      1:{key:'split_personality',name:'Split Personality',desc:'Attack twice',cost:13,cooldown:6,type:'offense'},
      2:{key:'mirror_beast',name:'Mirror Beast',desc:'Summon mirror beast',cost:15,cooldown:7,type:'summon'},
      3:{key:'reflection',name:'Reflection',desc:'Reflect next incoming attack',cost:16,cooldown:8,type:'utility'},
      4:{key:'take_over',name:'Take Over',desc:'Reduce enemy damage',cost:25,cooldown:8,type:'defense'},
      5:{key:'mirror_domain',name:'Domain',desc:'Domain',cost:40,cooldown:12,type:'domain'}
    }
  },
  superhuman: {
    name:'Superhuman', trueName:'Raised by Wolves',
    tierAbilities: {
      1:{key:'overpower',name:'Overpower',desc:'1.25x damage 2 turns',cost:13,cooldown:5,type:'buff'},
      2:{key:'defense',name:'Defense',desc:'-23% incoming for 2 turns',cost:16,cooldown:6,type:'defense'},
      3:{key:'inspiration',name:'Inspiration',desc:'30% incoming reduction + next-turn damage',cost:29,cooldown:9,type:'buff'},
      4:{key:'gigantification',name:'Gigantification',desc:'Stomp for big damage',cost:18,cooldown:6,type:'offense'},
      5:{key:'super_domain',name:'Domain',desc:'Domain',cost:40,cooldown:12,type:'domain'}
    }
  },
  perfection: {
    name:'Perfection', trueName:'Nightingale',
    tierAbilities: {
      1:{key:'flight',name:'Flight',desc:'13-20 damage',cost:12,cooldown:5,type:'offense'},
      2:{key:'obedience',name:'Obedience',desc:'-15% enemy attack',cost:15,cooldown:6,type:'defense'},
      3:{key:'self_inspiration',name:'Self Inspiration',desc:'20% damage buff',cost:17,cooldown:6,type:'buff'},
      4:{key:'fire_breath',name:'Fire Breathing',desc:'18-25 damage',cost:20,cooldown:7,type:'offense'},
      5:{key:'perfect_domain',name:'Domain',desc:'Domain',cost:40,cooldown:12,type:'domain'}
    }
  },
  seer: {
    name:'Seer', trueName:'Song of the Fallen',
    tierAbilities: {
      1:{key:'future_vision',name:'Future Vision',desc:'35% dodge for 2 turns',cost:15,cooldown:6,type:'defense'},
      2:{key:'future_sight',name:'Future Sight',desc:'Dodge next + strike',cost:15,cooldown:6,type:'offense'},
      3:{key:'perception_swap',name:'Perception Swap',desc:'Confuse enemy',cost:16,cooldown:7,type:'utility'},
      4:{key:'memory_implant',name:'Memory Implantation',desc:'Chance enemy misses',cost:20,cooldown:8,type:'utility'},
      5:{key:'seer_domain',name:'Domain',desc:'Domain',cost:40,cooldown:12,type:'domain'}
    }
  }
};

export function getAspect(key) {
  return ASPECTS[key] || null;
}

export function findAbilityByKey(abilityKey) {
  for (const akey of Object.keys(ASPECTS)) {
    const asp = ASPECTS[akey];
    for (const tier of Object.keys(asp.tierAbilities)) {
      const ab = asp.tierAbilities[tier];
      if (ab.key === abilityKey) return { aspectKey: akey, ability: ab, tier:Number(tier) };
    }
  }
  return null;
}
