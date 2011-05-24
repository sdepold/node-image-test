var express = require('express')
  , io      = require('socket.io')
  , fs      = require('fs')
  , images  = fs.readdirSync(__dirname + "/public/images").filter(function(f) {
                return f.indexOf('img') == 0
              }).map(function(f) {
                return fs.readFileSync(__dirname + "/public/images/" + f).toString('base64')
              })
  

var app = module.exports = express.createServer()

// Configuration
app.configure(function(){
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyParser())
  app.use(express.methodOverride())
  app.use(app.router)
  app.use(express.static(__dirname + '/public'))
})

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })) 
})

app.configure('production', function(){
  app.use(express.errorHandler()) 
})

// Routes
app.get('/', function(req, res) {
  res.render('index.jade')
})
io.listen(app).on('connection', function(client){
  console.log('just received connection')
  // new client is here!
  client.on('message', function(){
    client.send(images[~~(Math.random() * images.length - 1)])
  })
  client.on('disconnect', function(){
  })
})


// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000)
  console.log("Express server listening on port %d", app.address().port)
}
