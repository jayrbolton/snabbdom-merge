var h = require('snabbdom/h').default
var curryN = require('ramda/src/curryN')
var map = require('ramda/src/map')
var mergeObj = require('ramda/src/merge')
var assoc = require('ramda/src/assoc')
var reduce = require('ramda/src/reduce')
var compose = require('ramda/src/compose')
var concat = require('ramda/src/concat')
var mergeWith = require('ramda/src/mergeWith')

// Chain multiple event handlers or hook functions together 
var chainFuncs = curryN(4, function(data1, data2, result, key) {
  if(!data1[key] && !data2[key]) return result
  var chainHandlers = function(fn1, fn2) {
    return function() {
      fn1.apply(null, arguments)
      fn2.apply(null, arguments)
    }
  }
  var chained = mergeWith(chainHandlers, data1[key], data2[key])
  return assoc(key, chained, result)
})

// Merge the nested objects referenced by 'key' into 'result'
var mergeKey = curryN(4, function(data1, data2, result, key) {
  var merged = mergeObj(data1[key], data2[key])
  return assoc(key, merged, result)
})

// Merge some data properties, favoring vnode2
// Chain all hook and eventlistener functions together
// Concat selectors together
var merge = curryN(2, function(vnode1, vnode2) {
  var toMerge = ['props', 'class', 'style', 'attrs', 'dataset']
  var merged = reduce(mergeKey(vnode1.data, vnode2.data), {}, toMerge)
  var toChain = ['on', 'hook']
  var chained = reduce(chainFuncs(vnode1.data, vnode2.data), merged, toChain)

  var data = compose(mergeObj(vnode1.data), mergeObj(vnode2.data))(chained)

  var children = concat(vnode1.children || [], vnode2.children || [])
  var sel = concat(vnode1.sel, vnode2.sel.replace(/^[a-zA-z]+(.|#)/, '$1'))

  return h(sel, data, children)
})

module.exports = merge
