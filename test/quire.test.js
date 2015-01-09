var assert = require('assert')
var quire = require('../')

describe('quire', function() {
  describe('> when no stubbing', function() {
    it('should not do anything', function() {
      var mod = require('./fixtures/mod')
      var res = mod.doSomething('JP')
      assert.equal(res.name, 'JP')
      assert(Buffer.isBuffer(res.secretNumber))
      assert.equal(res.secretNumber.toString('hex').length, 8)
    })
  })

  describe('> when stub with an object', function() {
    it('should inject the stub', function() {
      var mod = quire('./fixtures/mod', {
        'secure-random': {
          randomBuffer: function() {
            return new Buffer([1,2,3,4])
          }
        }
      })

      var res = mod.doSomething('JP')
      assert.equal(res.name, 'JP')
      assert(Buffer.isBuffer(res.secretNumber))
      assert.equal(res.secretNumber.toString('hex').length, 8)
      assert.equal(res.secretNumber.toString('hex'), (new Buffer([1,2,3,4])).toString('hex'))
    })
  })

  describe('> when stub with a function', function() {
    it('should inject the stub', function() {
      var mod = quire('./fixtures/mod', {
        'secure-random': function() { 
          return {
            randomBuffer: function() {
              return new Buffer([5,6,7,8])
            }
          }
        }
      })

      var res = mod.doSomething('JP')
      assert.equal(res.name, 'JP')
      assert(Buffer.isBuffer(res.secretNumber))
      assert.equal(res.secretNumber.toString('hex').length, 8)
      assert.equal(res.secretNumber.toString('hex'), (new Buffer([5,6,7,8])).toString('hex'))
    })
  })
})


