# snabbdom-merge

This is a function to merge two snabbdom vnodes, `vnode1` and `vnode2`, with the following behavior:
* Do a standard object merge on the 'props', 'class', 'style', 'attrs', and 'dataset', with the data in vnode2 getting precedence
* Chain event listener and hook functions together, with the function from vnode1 getting called first, then the function in vnode 2
  * Eg if vnode1 is h('a', {on: {click: fn1}}) and vnode2 is h('a', {on: {click: fn2}}), then the merged vnode will call fn1, then fn2
* Concat together selector strings, preserving classnames.
  * Eg if vnode1 is h('div.x') and vnode2 is h('div.y.z') then the merged vnode will be h('div.x.y.z')
* Concatenate the children of vnode1 with the children of vnode2

## merge(vnode1, vnode2)

This function returns a brand new, merged vnode with the above behavior. vnode1 and vnode2 should have the same tag names.

_Example_

```js
var h = require('snabbdom/h').default
var merge = require('snabbdom-merge')

var sayhi = function(ev) { console.log('hi', ev) }
var saybye = function(ev) { console.log('bye', ev) }

var vnode1 = h('button.x', {
  attrs: { 'data-x': 'x' },
  on: { click: sayhi }
}, h('span', 'x'))

var vnode2 = h('button.y', {
  attrs: { 'data-y': 'y' },
  on: { click: saybye }
}, h('span', 'y'))


var merged = merge(vnode1, vnode2)

// Result:
// 
// h('button.y', {
//   attrs: {'data-x': 'x', 'data-y': 'y'}
// , on: {click: function(ev) { sayhi(ev); saybye(ev) }}
// }, [h('span', 'x'), h('span', 'y')])
```
