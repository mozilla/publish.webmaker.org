var Bookshelf = require('./database').Bookshelf;

var instanceProps = {
  column: function(columnName, alias, escapeString) {
    var prefix = escapeString ? '"' : '';
    var column = prefix + this.tableName + prefix + '.' + prefix + columnName + prefix;
    return alias ? column + ' AS ' + prefix + alias + prefix : column;
  }
};
var classProps = {
  transaction: Bookshelf.transaction.bind(Bookshelf)
};

module.exports = Bookshelf.Model.extend(instanceProps, classProps);
