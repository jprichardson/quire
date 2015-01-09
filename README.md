quire
=====

Mock or stub your CommonJS (Node.js) `require()` statements.

Why?
----

This is just a proof of concept so that I can attempt to get rid of [Jest](https://github.com/facebook/jest)... Jest is super sloooooooow.


Usage
-----

Consider the following module:

**mymodule.js**:

```js
var sr = require('secure-random')

module.exports = {
  doSomething: function(name) {
    return {
      name: name,
      secretNumber: sr.randomBuffer(4) 
    }
  }
}
```

Let's say that you want to test it now, but since `sr.randomBuffer()` returns random data, it complicates things. Your test may have looked like:

```js
it('should not do something', function() {
  var mod = require('./mymodule.js')
  var res = mod.doSomething('JP')
  assert.equal(res.name, 'JP')
  assert(Buffer.isBuffer(res.secretNumber))
  assert.equal(res.secretNumber.toString('hex').length, 8)
})
``` 

now you can simply just change your `require()` to `quire()`:

```js
it('should not do something', function() {
  var stub = {
    'secure-random': {
      randomBuffer: function() {
        return new Buffer([1,2,3,4])
      }
    }
  }

  //var mod = require('./mymodule.js')
  var mod = quire('./mymodule.js', stub)

  var res = mod.doSomething('JP')
  assert.equal(res.name, 'JP')
  assert(Buffer.isBuffer(res.secretNumber))
  assert.equal(res.secretNumber.toString('hex').length, 8)
  assert.equal(res.secretNumber.toString('hex'), (new Buffer([1,2,3,4])).toString('hex'))
})
```

Alternatives
------------
- https://www.npmjs.com/package/proxyquire
- https://www.npmjs.com/package/rewire

The alternatives modify `require()` whereas `quire` does not modify `require()`, rather, it just rewrites your sourcecode with the stub. The alternatives way overcomplicate things IMHO.


Browserify
----------

Browserify version hopefully coming soon.



