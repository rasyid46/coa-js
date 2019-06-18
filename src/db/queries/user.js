const knex = require('../connection');

function getAllUser() {
  return knex('users')
  .select('*');
}

function getUserByEmail(email){
  return knex('users').where({
    email: email 
  })

}

module.exports = {
  getAllUser,getUserByEmail
};