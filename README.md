# snabbdom-compose-transforms

This is a function for [Snabbdom](https://github.com/snabbdom/snabbdom) that allows you to create declarative "transformations" that each modify and extend a VNode, with the ability to compose many transformations together.

Example use case: say you have a few UI modules for `textarea` elements, such as validating the value, displaying how many words you have typed, and dynamically resizing the box as you type. How do you keep each of these modules separate but allow people to apply all three modules to a single textarea node, without any changes overriding any others? This module allows you to do that.

A *transform object* for a vnode can do the following:

* append or prepend children
* add surrounding VNode parents and/or siblings
* compose hook and event functions
* merge props, attrs, style, and class data

*Transform objects* can have these properties:

* `wrapper`: function that takes the vnode and allows you to add parent and sibling elements
* `class`, `style`, `attrs`, and `dataset`: these will merge with existing VNode data
* `on` and `hook`: these functions will be composed with existing on/hook functions without overriding any of them
* `appendChildren` and `prependChildren`: child nodes to append and prepend

All of these properties are composable with other transforms. The `wrapper` function can be composed with other wrapper functions, in which case the `vnode` parameter to the function will be the result of the previous wrapper function.

## Example

_Setup_

```js
// You can wrap the transform object in a function to 'configure' it

const wordCount = (limit, total$) => ({
  // This allows you to wrap the vnode in surrounding parent elements and siblings
  // If another snabbdom-transformer has already applied a wrapper function,
  // then this wrapper function will get applied to the result of that
  wrapper: vnode => h('div', [
    vnode
  , h('p', limit - total$() + ' words')
  ])
  // If the vnode already has other event listeners functions,
  // then the transformer will compose them together so none are overwritten
, on: {
    keyup: ev => { total$(ev.currentTarget.value.split(' ').length }
  }
  // Any classes added here will merge with any other classes already on the vnode
, class: {
    invalid: total$() > limit
  }
, appendChildren: [x, y, z] // These elements will append to any existing children nodes
, prependChildren: [x, y, z] // These elements will prepend to existing children nodes
})
```

_Usage_

```js
const compose = require('snabbdom-compose-transforms')
  
// Pass in an array of transforms to compose()
// Then apply the resulting composition to a node
function view(state) {
 const textarea = h('textarea', {props: {name: 'something'}})
 const composition = compose([wordCount, validator, autoExpander])
 const superTextarea = composition(textarea)

 return h('div', [
   superTextarea
 ])
}
```
