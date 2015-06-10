var config = require('../../knexfile').development;

var Knex = require('knex')(config);
var Bookshelf = require('bookshelf')(Knex);

module.exports = Bookshelf;
