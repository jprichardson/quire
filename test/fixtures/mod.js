var sr = require('secure-random')

module.exports = {
  doSomething: function(name) {
    return {
      name: name,
      secretNumber: sr.randomBuffer(4) 
    }
  }
}
