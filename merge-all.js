var merge = require('.')


module.exports = function() {

  return Array.prototype.slice.call(arguments, 1).reduce(merge, arguments[0])
}
