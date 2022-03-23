const knex = require('../db');
const tableName = 'posts';

/*
 Yes, I realize this code is most like
 /models/user.js and I am violating the DRY rule.
 Maybe you can help me come up with a better way to
 refactor this?
*/

const del = (id) => db(tableName).where({ id }).del();

/*
 Hold up! Our findAll is different. We want to do
 a SQL state where we JOIN with the users table!
 */
const findAll = () =>
  knex('posts as p')
    .join('users as u', 'p.user_id', 'u.id')
    .select(
      'p.id as post_id',
      'p.title',
      'p.content',
      'p.updated_at',
      'u.id as user_id',
      'u.avatar_url',
      'u.username'
    )
    .orderBy('p.id', 'desc');

const find = (filters) => knex(tableName).where(filters);

const findOne = (filters) => knex(tableName).where(filters).first();

const create = (obj) => {
  delete obj.id; // not allowed to set `id`
  return knex(tableName)
    .insert(obj)
    .then((postId) => findOne(postId));
};

const update = (id, newObj) => {
  delete newObj.id; // not allowed to set `id`
  return knex(tableName).where({ id }).update(newObj);
};

module.exports = { del, findAll, find, findOne, create, update };
