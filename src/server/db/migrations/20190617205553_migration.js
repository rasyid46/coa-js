
exports.up = function(knex, Promise) {
    return knex.schema
    .createTable('users', function (table) {
       table.increments('id');
       table.string('email', 255).nullable();
       table.string('name', 255).nullable();
       table.string('password', 255).nullable();
       table.boolean('verified').nullable();
    })
    .createTable('product', function (table) {
       table.increments('id');
       table.decimal('price').nullable();
       table.string('title', 255).nullable();
    })
    .createTable('roles', function (table) {
        table.increments('id');
        table.string('slug', 255).nullable();
        table.string('name', 255).nullable();
     })
     .createTable('role_users', function (table) { 
        table.integer('user_id').nullable();
        table.integer('role_id').nullable();
     });
};

exports.down = function(knex, Promise) {
    return knex.schema
    .dropTable("product")
    .dropTable("users")
    .dropTable("roles")
    .dropTable("role_users");
};
