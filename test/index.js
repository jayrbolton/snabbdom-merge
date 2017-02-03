var h = require('snabbdom/h').default
var compose = require('../')
var test = require('tape')

test('it merges props', function(t) {
  var setName = function(n) {
    return { props: {name: n} }
  }
  var data = {
    props: {name: 'name', type: 'text'}
  }
  var composition = compose([setName('name2'), setName('name3')])
  var result = composition(h('input', data))
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
  var composition = compose([setClick, setClick])
  var result = composition(h('input', data))
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
  var composition = compose([setHook, setHook])
  var result = composition(h('input', data))
  result.data.hook.insert(result)
  t.strictEqual(result.data.attrs['data-count'], 4)
  t.end()
})

test('it wraps multiple parents/siblings', function(t) {
  var input = h('input', { props: {name: 'name', type: 'text'} })
  var wrap = {
    wrapper: function(vnode) {
      return h('div.wrapper', [vnode, h('span', 'hi')])
    }
  }
  var composition = compose([wrap, wrap])
  var result = composition(input)
  t.strictEqual(result.sel, 'div.wrapper')
  t.strictEqual(result.children.length, 2)
  t.strictEqual(result.children[0].sel, 'div.wrapper')
  t.strictEqual(result.children[1].text, 'hi')
  t.strictEqual(result.children[0].children.length, 2)
  t.strictEqual(result.children[0].children[1].text, 'hi')
  t.strictEqual(result.children[0].children[0].sel, 'input')
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
  var composition = compose([transform(1), transform(2)])
  var result = composition(input)
  t.strictEqual(result.sel, 'input')
  t.strictEqual(result.children.length, 4)
  t.deepEqual(result.children.map(function(vnode) { return vnode.text }), [ 'prepend2', 'prepend1', 'append1', 'append2' ])
  t.end()
})
