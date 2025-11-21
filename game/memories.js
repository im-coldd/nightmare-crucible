// memories.js
export const MEMORY_TYPES = ["charm","weapon","armor","bow"];

export function generateMemory(enemyTier){
    const type = MEMORY_TYPES[Math.floor(Math.random()*MEMORY_TYPES.length)];
    const value = Math.floor(Math.random()*10)+enemyTier*2;
    return {type, value, name:`${type.toUpperCase()} +${value}`};
}
