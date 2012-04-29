
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
var app = module.exports = express.createServer();
var RedisStore = require('connect-redis')(express);
// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({ secret: "keyboard cat"}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

function requiresLogin(req,res,next){
  if(req.session.user){
    next();
    console.log("Estas logueado!!!");
  }
  else{
    console.log("No se logueo todavia");
  }
}
app.dynamicHelpers({
  session: function(req, res){
    return req.session;
  }
});
// Routes
app.get('/', routes.index);
app.get('/home', requiresLogin,routes.home);
app.get('/getview/:viewname',routes.getview);
app.post('/getmodels/:modelname',routes.getmodels);
app.post('/login/',routes.login);
app.post('/logout/',routes.logout);
app.post('/cliente/new',routes.clientenew);
app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
