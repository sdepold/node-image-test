var express = require('express')
  , io      = require('socket.io')
  , fs      = require('fs')

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
    fs.readFile(__dirname + "/public/images/img" + (~~(Math.random() * 5) + 1) + ".jpg", function(err, data) {
      if(err) console.log(err)
      else client.send(data.toString('base64'))
    })
  })
  client.on('disconnect', function(){
  })
})


// Only listen on $ node app.js
if (!module.parent) {
  app.listen(3000)
  console.log("Express server listening on port %d", app.address().port)
}
