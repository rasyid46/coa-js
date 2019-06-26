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

function getUserByEmailPass(email,password){
  return knex('users').where({
    email: email,
    password : password 
  })
}

module.exports = {
  getAllUser,getUserByEmail,getUserByEmailPass
};