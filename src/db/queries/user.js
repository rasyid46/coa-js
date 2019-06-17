const knex = require('../connection');

function getAllUser() {
  return knex('users')
  .select('*');
}

module.exports = {
  getAllUser
};