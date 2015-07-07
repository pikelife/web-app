var express = require('express'),
    bodyParser = require('body-parser'),
    urlHelper = require('url'),
    httpRequest = require('request'),
    mongoose = require('mongoose');

var joinOnApp = this;

var profileSchema;
joinOnApp.profileSchema = function(val){
  if(val !== undefined) profileSchema = val;
  return profileSchema;
};

var profileModel;
joinOnApp.profileModel = function(val){
  if(val !== undefined) profileModel = val;
  return profileModel;
};

var url = 'mongodb://localhost:27017/polygen';
mongoose.connect(url);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  
  var profileSchema = mongoose.Schema({
    email : String,
    name : String,
    password : String
  });
  joinOnApp.profileSchema(profileSchema);
  
  var Profile = mongoose.model('Profile', profileSchema);
  joinOnApp.profileModel(Profile);
  
});

var app = express();

app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/assets', express.static(__dirname + '/assets'));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

function getQueryObj(url){
  var url_parts = urlHelper.parse(url, true);
  return url_parts.query;
}

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.route('/profile')
  .get(function(req, res) {
    // to be done
  })
  .post(function(req, res) {
    var query = getQueryObj(req.url);
    if(query.isRegister === 'true'){
      var newProfile = new joinOnApp.profileModel()({  "email" : req.body.email,
                                                       "name" : req.body.name,
                                                       "password" : req.body.password });
      newProfile.save(function (err, obj) {
        if (err) return console.error(err);
        res.send(obj);
      });
    }else{
      console.log(req.body);
      var queryDb = joinOnApp.profileModel().findOne({ 'email': req.body.email,
                                                       'password' : req.body.password});
      queryDb.exec(function (err, obj) {
        if (err) return console.error(err);
        console.log(obj);
        res.send(obj);
      });
    }
  })
  .put(function(req, res) {
    // to be done
  })
  .delete(function(req, res) {
    // to be done
  });
  
var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('joinOn app listening at http://%s:%s', host, port);

});

