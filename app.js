var express = require('express'),
app = express(),
logger = require('morgan'),
bodyParser = require('body-parser'),
mongoose = require('mongoose'),
Schema = mongoose.Schema;

// Init
app.set('view engine', 'jade');
app.set('views', __dirname + '/public')
mongoose.connect('mongodb://localhost/urlshort', function(err) {
  if (err) console.error("Error: could not connect to database");
});

var UrlShort = mongoose.model('UrlShort', {
  urlID: String, realURL: String, clicks: Number
});

// Middleware and routes
if (process.env.NODE_ENV == 'production')
  app.use(logger('short'));
else
  app.use(logger('dev'));
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));

// GET '/'
app.get('/', function(req,res) {
  res.render('index')
});

// POST '/'
app.post('/', function(req,res) {
  var fullURL = req.body.protocol + req.body.url;
  if (!fullURL.match(/^(https?|ftp):\/\/[^\s\/$.?#].[^\s]*$/i)) {
    res.render('index', {msg: "Type a correct URL!", success: false});

    return;
  }

  console.log("FULL URL = ", fullURL);
  var url = new UrlShort({
    urlID: makeShortStr(3),
    realURL: fullURL,
    clicks: 0});

  url.save(function(err) {if (err) throw err})

  res.render('index', {msg: "Success! Your shortie is /" + url.urlID, success: true});
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
