var express = require('express'),
    bodyParser = require('body-parser'),
    urlHelper = require('url'),
    httpRequest = require('request'),
    mongoose = require('mongoose');

var _this = this;

var profileSchema;
_this.profileSchema = function(val){
  if(val !== undefined) profileSchema = val;
  return profileSchema;
};

var profileModel;
_this.profileModel = function(val){
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
  _this.profileSchema(profileSchema);
  
  var Profile = mongoose.model('Profile', profileSchema);
  _this.profileModel(Profile);
  
});

var app = express();

//app.use('/bower_components',  express.static(__dirname + '/bower_components'));
//app.use('/assets', express.static(__dirname + '/assets'));


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
    var query = getQueryObj(req.url);
    console.dir("GET received query " + JSON.stringify(query.email));
    var queryDb = _this.profileModel().findOne({ 'email': query.email});
    queryDb.exec(function (err, obj) {
      if (err) return console.error(err);
      console.log("POST profile : " + obj);
      res.send(obj); 
    });
  })
  .post(function(req, res) {
    var query = getQueryObj(req.url);
    if(query.isRegister === 'true'){
      console.log("received query " + req.body);
      var newProfile = new _this.profileModel()({  "email" : req.body.email,
                                                       "name" : req.body.name,
                                                       "password" : req.body.password });
      newProfile.save(function (err, obj) {
        if (err) return console.error(err);
        console.log("GET after existing user profile : " + obj);
        res.send(obj);
      });
    }else{
      console.log(req.body);
      var queryDb = _this.profileModel().findOne({ 'email': req.body.email,
                                                       'password' : req.body.password});
      queryDb.exec(function (err, obj) {
        if (err) return console.error(err);
        console.log("POST profile : " + obj);
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
  
var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('joinOn app listening at http://%s:%s', host, port);

});

