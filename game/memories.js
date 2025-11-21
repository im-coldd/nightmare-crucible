const MEMORY_TEMPLATES = {
  consumable: [
    { key: 'heal', name: 'Minor Healing Vial', effect: { hp: 25 }, desc: 'Restores 25 Health instantly.' },
    { key: 'essence', name: 'Minor Essence Phial', effect: { essence: 40 }, desc: 'Restores 40 Essence instantly.' }
  ],
  sword: { name: 'Blade Fragment', effect: { baseDamage: 1, critChance: 0.005 }, scaling: { baseDamage: 1.5, critChance: 0.003 } },
  armor: { name: 'Plating Shard', effect: { maxHealth: 25 }, scaling: { maxHealth: 15 } },
  charm: { name: 'Warding Sigil', effect: { baseDamage: 0.5, maxHealth: 10 }, scaling: { baseDamage: 0.8, maxHealth: 10 } }
};

const DROP_DISTRIBUTION = [
  { type: 'consumable', weight: 25 },
  { type: 'sword', weight: 25 },
  { type: 'armor', weight: 25 },
  { type: 'charm', weight: 25 }
];

export function generateMemory(enemyTier) {
  let total = DROP_DISTRIBUTION.reduce((s, i) => s + i.weight, 0);
  let r = Math.random() * total;
  let chosen = null;
  for (const item of DROP_DISTRIBUTION) {
    r -= item.weight;
    if (r <= 0) { chosen = item.type; break; }
  }
  if (chosen === 'consumable') {
    const t = MEMORY_TEMPLATES.consumable[Math.floor(Math.random() * MEMORY_TEMPLATES.consumable.length)];
    return { key: t.key, name: t.name, type: 'consumable', effect: t.effect, desc: t.desc };
  } else {
    const template = MEMORY_TEMPLATES[chosen];
    const qualityLevel = Math.max(1, enemyTier);
    const qualityName = qualityLevel > 4 ? 'Legendary' : qualityLevel > 2 ? 'Great' : 'Minor';
    const effect = {};
    const nameParts = [];
    if (template.effect.baseDamage !== undefined) {
      const scaledDmg = (template.effect.baseDamage || 0) + ((template.scaling.baseDamage || 0) * qualityLevel);
      effect.baseDamage = Math.round(scaledDmg * 10) / 10;
      nameParts.push(`Dmg ${effect.baseDamage.toFixed(1)}`);
    }
    if (template.effect.critChance !== undefined) {
      const scaledCrit = (template.effect.critChance || 0) + ((template.scaling.critChance || 0) * qualityLevel);
      effect.critChance = Math.round(scaledCrit * 1000) / 1000;
      nameParts.push(`Crit +${Math.round(effect.critChance * 100)}%`);
    }
    if (template.effect.maxHealth !== undefined) {
      const scaledHP = (template.effect.maxHealth || 0) + ((template.scaling.maxHealth || 0) * qualityLevel);
      effect.maxHealth = Math.round(scaledHP);
      nameParts.push(`HP ${effect.maxHealth}`);
    }
    const finalName = `${qualityName} ${template.name} of ${nameParts.join('/')}`;
    const finalKey = `${chosen}_${Math.random().toString(36).substring(2,6)}`;
    const finalDesc = `PERMANENT: ${nameParts.join(' and ')}.`;
    return { key: finalKey, name: finalName, type: chosen, effect, desc: finalDesc };
  }
}

export function applyConsumable(player, key) {
  const idx = player.inventory.findIndex(i => i.key === key);
  if (idx === -1) return false;
  const item = player.inventory[idx];
  if (item.type !== 'consumable') return false;
  if (item.effect.hp) player.health = Math.min(player.maxHealth, player.health + item.effect.hp);
  if (item.effect.essence) player.essence = Math.min(player.maxEssence, player.essence + item.effect.essence);
  player.inventory.splice(idx,1);
  return true;
}
