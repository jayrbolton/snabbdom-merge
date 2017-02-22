var curryN = require('ramda/src/curryN')
var map = require('ramda/src/map')

// Append or prepend child nodes
function concatChildren(trans, vnode) {
  if(trans.appendChildren && trans.appendChildren.length) {
    vnode.children = (vnode.children || []).concat(trans.appendChildren)
  }
  if(trans.prependChildren && trans.prependChildren.length) {
    vnode.children = trans.prependChildren.concat(vnode.children || [])
  }
}

// Compose multiple event handlers or hook functions together 
var composeFuncs = curryN(3, function(trans, data, key) {
  if(!trans[key] || !(typeof trans[key] === 'object')) return
  if(!data[key]) data[key] = {}
  for(var subkey in trans[key]) {
    var func = trans[key][subkey]
    var prevFunc = data[key][subkey]
    if(typeof func === 'function') {
      if(typeof prevFunc === 'function') {
        data[key][subkey] = function() {
          func.apply(null, arguments)
          prevFunc.apply(null, arguments)
        }
      } else {
        data[key][subkey] = func
      }
    }
  }
})

// Merge class, attrs, props etc
var mergeData = curryN(3, function(trans, data, key) {
  if(!trans[key] || !(typeof trans[key] === 'object')) return
  data[key] = mergeObj(trans[key], data[key])
})

// Shallow merge fromObj into toObj
function mergeObj(fromObj, toObj) {
  fromObj = fromObj || {}
  toObj = toObj || {}
  for(var key in fromObj) toObj[key] = fromObj[key]
  return toObj
}

// Given an array of transform objects, return a function that will apply the composition of all the transforms to a vnode
var apply = curryN(2, function(transform, vnode) {
  var data = vnode.data

  var toMerge = ['props', 'class', 'style', 'attrs', 'dataset']
  map(mergeData(transform, data), toMerge)
  var toCompose = ['on', 'hook']
  map(composeFuncs(transform, data), toCompose)
  concatChildren(transform, vnode)

  return vnode
})

module.exports = apply
