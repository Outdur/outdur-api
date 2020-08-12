const Chance = require('chance');
const chance = new Chance();

export const generateCode = function (){
  return chance.string({ length: 8, casing: 'upper', alpha: true, numeric: true });
}