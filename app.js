var express = require('express'),
app = express(),
logger = require('morgan'),
mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Init
app.set('view engine', 'jade');
app.set('views', __dirname + '/public')
mongoose.connect('mongodb://localhost/urlshort')

var UrlShort = mongoose.model('UrlShort', {
  urlID: String, realUrl: String, clicks: Number
});

// Middleware and routes
app.use(logger('dev'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req,res) {
  // var url = new UrlShort({urlID: '123', realUrl: req.params.name});
  // url.save(function(err) {
  //   if (err) throw err;
  //   console.log("Saved: ", url);
  // });

  res.render('index', {uuid: makeShortStr(3)})
});



app.listen(3000)
console.log("Express app started on port 3000");



// Return alphanumeric string [a-zA-Z0-9]
function makeShortStr(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i=0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
}
