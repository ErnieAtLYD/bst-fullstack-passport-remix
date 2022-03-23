const knex = require('../db');
const tableName = 'users';

// I'm creating a bunch of helper functions that will let us CRUD stuff from our DB!

const del = (id) => db(tableName).where({ id }).del();

const findAll = () => knex(tableName);

const find = (filters) => knex(tableName).where(filters);

const findOne = (filters) => knex(tableName).where(filters).first();

const create = (obj) => {
  delete obj.id; // not allowed to set `id`
  return knex(tableName).insert(obj);
};

const update = (id, newObj) => {
  delete newObj.id; // not allowed to set `id`
  return knex(tableName).where({ id }).update(newObj);
};

module.exports = { del, findAll, find, findOne, create, update };
