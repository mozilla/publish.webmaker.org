var config = require('../../knexfile').development;

var Knex = require('knex')(config);
var Bookshelf = require('bookshelf')(Knex);

exports.Bookshelf = Bookshelf;

// For test access to our single knex instance
exports.Knex = Knex;
