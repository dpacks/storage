var ddrive = require('@ddrive/core')
var storage = require('./')

var vault = ddrive(storage('sandbox/my-dataset'), {latest: true})

vault.writeFile('/foo', 'this is foo')
vault.writeFile('/bar', 'this is bar')
vault.writeFile('/bar', 'this is bar updated')
vault.writeFile('/baz', 'this is baz', function () {
  vault.readFile('/foo', 'utf-8', function (err, buf) {
    if (err) throw err
    console.log(buf)
  })

  var fork = ddrive(storage('sandbox/my-dataset-fork'), vault.key, {thin: true})
  var stream = vault.replicate()

  stream.pipe(fork.replicate()).pipe(stream)

  fork.metadata.update(function () {
    fork.readFile('/foo', console.log)
  })
})
