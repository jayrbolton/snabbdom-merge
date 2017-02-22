var h = require('snabbdom/h').default
var apply = require('../')
var test = require('tape')

test('it merges props', function(t) {
  var setName = function(n) {
    return { props: {name: n} }
  }
  var data = {
    props: {name: 'name', type: 'text'}
  }
  var result = apply(setName('name3'), apply(setName('name2'), h('input', data)))
  t.strictEqual(result.data.props.name, 'name3')
  t.strictEqual(result.data.props.type, 'text')
  t.end()
})

test('it composes eventlisteners', function(t) {
  var count = 1
  var incr = function() { ++count }
  var setClick = { on: {click: incr } }
  var data = {
    on: {click: incr}
  }
  var trans = apply(setClick)
  var result = trans(trans(h('input', data)))
  result.data.on.click()
  t.strictEqual(count, 4)
  t.end()
})

test('it composes hooks', function(t) {
  var count = 1
  var incr = function(vnode) { vnode.data.attrs['data-count'] += 1}
  var setHook = { hook: {insert: incr } }
  var data = {
    attrs: {'data-count': 1}
  , hook: {insert: incr}
  }
  var trans = apply(setHook)
  var result = trans(trans(h('input', data)))
  result.data.hook.insert(result)
  t.strictEqual(result.data.attrs['data-count'], 4)
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
  var trans = (x, n) => apply(transform(x), n)
  var result = trans(2, trans(1, input))
  t.strictEqual(result.sel, 'input')
  t.strictEqual(result.children.length, 4)
  t.deepEqual(result.children.map(function(vnode) { return vnode.text }), [ 'prepend2', 'prepend1', 'append1', 'append2' ])
  t.end()
})
