var express = require('express'),
    app = express(),
    logger = require('morgan'),
    mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Init
mongoose.connect('mongodb://localhost/urlshort')

var urlSchema = new Schema({
  urlID: String,
  realUrl: String,
  clicks: Number
});

var UrlShort = mongoose.model('UrlShort', urlSchema);

// Middleware and routes
app.use(logger('dev'));


app.get('/', function(req,res) {

});


app.use(express.static(__dirname + '/public'));

app.listen(3000)
console.log("Express app started on port 3000");
