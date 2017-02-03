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
function composeFuncs(key, trans, data) {
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
}

// Merge class, attrs, props etc
function mergeData(key, trans, data) {
  if(!trans[key] || !(typeof trans[key] === 'object')) return
  data[key] = mergeObj(trans[key], data[key])
}

// Shallow merge fromObj into toObj
function mergeObj(fromObj, toObj) {
  for(var key in fromObj) toObj[key] = fromObj[key]
  return toObj
}

// Given an array of transform objects
function compose(transforms) {
  return function(vnode) {
    var data = vnode.data
    var wrapper = vnode
    if(!transforms || !transforms.length) return vnode

    for(var i = 0; i < transforms.length; ++i) {
      var trans = transforms[i]
      mergeData('props',  trans, data)
      mergeData('class', trans, data)
      mergeData('style', trans, data)
      mergeData('attrs',  trans, data)
      mergeData('dataset',  trans, data)
      composeFuncs('on', trans, data)
      composeFuncs('hook', trans, data)
      concatChildren(trans, vnode)
      if(trans.wrapper) wrapper = trans.wrapper(wrapper)
    }

    return wrapper
  }
}

module.exports = compose
