import * as Core from './core.js';
import { updateUI, checkLevelUp, gainXP } from './core.js';

export function attack() {
  if (!Core.currentEnemy) {
    return "There is no enemy to attack.";
  }

  const player = Core.player;
  const enemy = Core.currentEnemy;

  let dmg = 10 + player.baseDamageBonus;

  enemy.health -= dmg;

  if (enemy.health <= 0) {
    const reward = enemy.xp || 50;
    gainXP(reward);

    Core.currentEnemy = null;
    checkLevelUp();
    updateUI();

    return `You dealt ${dmg} damage and defeated the enemy! +${reward} XP.`;
  }

  // Enemy counterattack
  const enemyDmg = enemy.minDamage +
      Math.floor(Math.random() * (enemy.maxDamage - enemy.minDamage + 1));

  player.health -= enemyDmg;

  if (player.health <= 0) {
    player.health = player.maxHealth;
    Core.currentEnemy = null;
    updateUI();
    return "You fall… and awaken somewhere safe.";
  }

  updateUI();
  return `You dealt ${dmg} damage. The enemy hits back for ${enemyDmg}.`;
}
