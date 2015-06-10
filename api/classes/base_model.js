var Bookshelf = require('./database').Bookshelf;

var instanceProps = {};
var classProps = {
  transaction: Bookshelf.transaction.bind(Bookshelf)
};

module.exports = Bookshelf.Model.extend(instanceProps, classProps);
