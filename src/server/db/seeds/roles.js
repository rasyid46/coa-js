
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('roles').del()
    .then(function () {
      // Inserts seed entries
      return knex('roles').insert([
        {id: 1, slug: 'administrator',name : 'Administrator'},
        {id: 2, slug: 'user-bisnis	',name : 'Administrator'}
      ]);
    });
};
