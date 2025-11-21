// memories.js — memory generation + legendary chance support
const TEMPLATES = {
  consumable:[
    { key:'heal', name:'Minor Healing Vial', effect:{hp:25}, type:'consumable' },
    { key:'essence', name:'Minor Essence Phial', effect:{essence:40}, type:'consumable' }
  ],
  sword: { name:'Blade Fragment', effect:{baseDamage:1, critChance:0.005}, scaling:{baseDamage:1.5, critChance:0.003} },
  armor: { name:'Plating Shard', effect:{maxHealth:25}, scaling:{maxHealth:15} },
  charm: { name:'Warding Sigil', effect:{baseDamage:0.5, maxHealth:10}, scaling:{baseDamage:0.8, maxHealth:10} },
  bow: { name:'Hunter\'s Bow', effect:{ranged:true, baseDamage:0}, scaling:{} },
  legendary: { name:'Memory of the Ancients', effect:{baseDamage:8, critChance:0.05, maxHealth:120}, scaling:{} }
};

const DROP_TYPES = [
  { type:'consumable', weight:25 },
  { type:'sword', weight:25 },
  { type:'armor', weight:25 },
  { type:'charm', weight:25 }
];

export function generateMemory(enemyTier, enemyRarity='common') {
  // miniboss/legendary chance
  if (enemyRarity === 'miniboss' && Math.random() < 0.12) {
    // 12% chance of legendary memory from miniboss
    const final = {
      key: `legendary_${Math.random().toString(36).slice(2,8)}`,
      name: `Legendary ${TEMPLATES.legendary.name}`,
      type: 'legendary',
      rarity: 'legendary',
      effect: TEMPLATES.legendary.effect,
      desc: 'An ancient memory: powerful and unique.'
    };
    return final;
  }

  // normal drop
  let total = DROP_TYPES.reduce((s,i)=>s+i.weight,0);
  let r = Math.random()*total;
  let chosen = 'consumable';
  for (const d of DROP_TYPES) {
    r -= d.weight;
    if (r <= 0) { chosen = d.type; break; }
  }
  if (chosen === 'consumable') {
    const t = TEMPLATES.consumable[Math.floor(Math.random()*TEMPLATES.consumable.length)];
    return { key: t.key + '_' + Math.random().toString(36).slice(2,6), name: t.name, type: 'consumable', effect: t.effect, desc: t.name, rarity: 'common' };
  } else {
    const tpl = TEMPLATES[chosen];
    const quality = Math.max(1, enemyTier);
    const effect = {};
    if (tpl.effect.baseDamage !== undefined) {
      effect.baseDamage = Math.round(((tpl.effect.baseDamage || 0) + ((tpl.scaling?.baseDamage || 0) * quality)) * 10)/10;
    }
    if (tpl.effect.critChance !== undefined) {
      effect.critChance = ((tpl.effect.critChance || 0) + ((tpl.scaling?.critChance || 0) * quality));
    }
    if (tpl.effect.maxHealth !== undefined) {
      effect.maxHealth = Math.round(((tpl.effect.maxHealth || 0) + ((tpl.scaling?.maxHealth || 0) * quality)));
    }
    const qName = quality > 4 ? 'Legendary' : quality > 2 ? 'Great' : 'Minor';
    const final = {
      key: `${chosen}_${Math.random().toString(36).slice(2,7)}`,
      name: `${qName} ${tpl.name}`,
      type: chosen,
      effect,
      desc: `PERMANENT: ${Object.keys(effect).map(k=>k+':'+effect[k]).join(',')}.`,
      rarity: 'common'
    };
    return final;
  }
}

export function applyConsumable(playerObj, key) {
  const idx = playerObj.inventory.findIndex(i=>i.key === key);
  if (idx === -1) return false;
  const mem = playerObj.inventory[idx];
  if (mem.type !== 'consumable') return false;
  if (mem.effect.hp) playerObj.health = Math.min(playerObj.maxHealth, playerObj.health + mem.effect.hp);
  if (mem.effect.essence) playerObj.essence = Math.min(playerObj.maxEssence, playerObj.essence + mem.effect.essence);
  playerObj.inventory.splice(idx,1);
  return true;
}
