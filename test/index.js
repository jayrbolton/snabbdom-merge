var h = require('snabbdom/h').default
var merge = require('../')
var test = require('tape')

test('it merges props', function(t) {
  var vnode1 = h('input', {props: {name: 'x', type: 'number'}})
  var vnode2 = h('input', {props: {name: 'y', type: 'text'}})
  var merged = merge(vnode1, vnode2)
  t.strictEqual(merged.data.props.name, 'y')
  t.strictEqual(merged.data.props.type, 'text')
  t.end()
})

test('it merges selectors', function(t) {
  var vnode1 = h('span.x.y')
  var vnode2 = h('span.z')
  var merged = merge(vnode1, vnode2)
  t.strictEqual(merged.sel, 'span.x.y.z')
  var vnode3 = h('span')
  var vnode4 = h('span.x')
  var merged2 = merge(vnode3, vnode4)
  t.strictEqual(merged2.sel, 'span.x')
  t.end()
})

test('it composes eventlisteners', function(t) {
  var count = 1
  var incr = function() { ++count }
  var vnode1 = h('button', {on: {click: incr}})
  var vnode2 = h('button', {on: {click: incr}})
  var merged = merge(vnode1, vnode2)
  merged.data.on.click()
  t.strictEqual(count, 3)
  t.end()
})

test('it composes hooks', function(t) {
  var count = 1
  var incr = function(vnode) { vnode.data.attrs['data-count'] += 1}
  var vnode1 = h('button', {hook: {insert: incr, update: incr}, attrs: {'data-count': 1}})
  var vnode2 = h('button', {hook: {insert: incr}})
  var merged = merge(vnode1, vnode2)
  merged.data.hook.insert(merged)
  t.strictEqual(merged.data.attrs['data-count'], 3)
  t.end()
})


test('it appends and prepends children', function(t) {
  var input = h('input', { props: {name: 'name', type: 'text'} })
  var transform = n => {
    return {
      appendChildren: [h('span', 'append' + n)]
    , prependChildren: [h('span', 'prepend' + n)]
    }
  }
  var children = [h('span', 'x'), h('span', 'y'), h('span', 'z')]
  var vnode1 = h('p', [children[0]])
  var vnode2 = h('p', [children[1], children[2]])
  var merged = merge(vnode1, vnode2)
  t.deepEqual(merged.children, children)
  t.end()
})
