# snabbdom-transform

This is a system for transforming [Snabbdom](https://github.com/snabbdom/snabbdom) VNodes. You can create declarative "transformations" that each modify and extend a VNode, with the ability to compose many transformations together and apply them to the same VNode, without any of them conflicting with any others.

Example use case: say you have a few UI modules for `textarea` elements, such as validating the value, displaying how many words you have typed, and dynamically resizing the box as you type. How do you keep each of these modules separate but allow people to apply all three modules to a single textarea node, without any changes overriding any others? This module allows you to do that.

A *transform object* for a vnode can do the following:

* append or prepend children
* compose hook and event functions
* merge props, attrs, style, and class data

*Transform objects* can have these properties:

* `class`, `style`, `attrs`, and `dataset`: these will merge with existing VNode data; properties from the transform will override existing properties with the same name
* `on` and `hook`: these functions will be composed with existing on/hook functions without overriding any of existing functions
* `appendChildren` and `prependChildren`: child nodes to append and prepend

## Example

_Setup_

```js
// You can wrap the transform object in a function to 'configure' it

const wordCount = (limit, total$) => ({
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
const applyTransform = require('snabbdom-transform')
const R = require('ramda')
  
function view(state) {
 const textarea = h('textarea', {props: {name: 'something'}})
 const superTextarea = wordCount(validate(autoExpand(textarea)))

 return h('div', [ superTextarea ])
}
```
