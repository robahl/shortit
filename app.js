var express = require('express'),
app = express(),
logger = require('morgan'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Init
app.set('view engine', 'jade');
app.set('views', __dirname + '/public')
mongoose.connect('mongodb://localhost/urlshort')

var UrlShort = mongoose.model('UrlShort', {
  urlID: String, realURL: String, clicks: Number
});

// Middleware and routes
app.use(logger('dev'));
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

// GET '/'
app.get('/', function(req,res) {
  res.render('index')
});

// POST '/'
app.post('/', function(req,res) {
  if (!req.body.protocol.match(/https?:\/\//)) {
    res.render('index', {error: "Invalid URL!!!"});

    return;
  }
  var fullURL = req.body.protocol + req.body.url;
  console.log("FULL URL = ", fullURL);
  var url = new UrlShort({
    urlID: makeShortStr(3),
    realURL: fullURL,
    clicks: 0});

  url.save(function(err) {if (err) throw err})

  res.redirect('/');
});

// GET '/list'
app.get('/list', function(req,res) {
  UrlShort.find(function(err,docs) {
    res.render('list', {urls: docs});
  });
});

// GET '/:urlID'
app.get('/:urlID', function(req,res) {
  // do lite check if its an url id.
  if (req.params.urlID.length == 3) {
    UrlShort.findOne({urlID: req.params.urlID}, function(err,doc) {
      if (err) throw err;
      res.redirect(doc.realURL);
      doc.clicks++;
      doc.save(function(err) {if (err) throw err})
    });
  } else {
    res.render('not_found');
  }
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
