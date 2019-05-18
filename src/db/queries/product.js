const knex = require('../connection');

function getAllProduct() {
  return knex('product')
  .select('*');
}

module.exports = {
  getAllProduct
};