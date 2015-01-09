var fs = require('fs')
var path = require('path')
var pretty = require('js-object-pretty-print').pretty
var recast = require('recast')
var resolve = require('resolve')
var builders = recast.types.builders

// http://stackoverflow.com/a/19788257/10333
// consider substituting with https://github.com/sindresorhus/caller-path
function _getCallerFile() {
  try {
    var err = new Error()
    var callerfile
    var currentfile

    Error.prepareStackTrace = function (err, stack) { return stack }

    currentfile = err.stack.shift().getFileName()

    while (err.stack.length) {
      callerfile = err.stack.shift().getFileName()
      if(currentfile !== callerfile) return callerfile
    }
  } catch (err) {}
  return undefined
}


function transform(code, stubs) {
  var ast = recast.parse(code)

  recast.visit(ast, {
    visitCallExpression: function(path) {
      var node = path.value
      if (node.type === 'CallExpression'
        && node.callee.type === 'Identifier'
        && node.callee.name === 'require') {

        var moduleName = node.arguments[0].value
        if (!stubs[moduleName]) return false

        if (typeof stubs[moduleName] === 'function')
          return recast.parse('(' + stubs[moduleName].toString() + ')()')
        else {
          var os = pretty(stubs[moduleName], 2, 'PRINT', true)
          return recast.parse('(function() { return ' + os + '\n })()')
        }
      }
      
      return false
    }
  })

  return recast.print(ast).code
}

function quire(module, stubs) {
  var file = resolve.sync(module, {
    basedir: path.dirname(_getCallerFile()) 
  })
  
  var code = fs.readFileSync(file, 'utf8')  
  code = transform(code, stubs)
  
  // this is incredibly unsafe and dangerous
  // the problem is, I couldn't get the vm.run alternatives to work
  return eval(code)
}

module.exports = quire