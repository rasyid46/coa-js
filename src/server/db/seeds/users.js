const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        {id: 1, email: 'admin@askrindo.com',password : bcrypt.hashSync('admin1234!', saltRounds),name :'admin',verified : true},
        {id: 2, email: 'bluedot@askrindo.com',password : bcrypt.hashSync('admin1234!', saltRounds),name :'admin BL',verified : true}
      ]);
    });
};
