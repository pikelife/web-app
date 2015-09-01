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

app.use('/apps',  express.static(__dirname + '/apps'));
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

app.get('/profile', function (req, res) {
  res.sendFile(__dirname + '/page-profile.html');
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
  
var server = app.listen(8082, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('joinOn app listening at http://%s:%s', host, port);

});
/* get users */

/* post user */
/*app.post('/user', function (req, res) {
  db.cypher({
    query: 'CREATE (user1: User{
      firstName: "Idriss",
  lastName: "Alaoui",
  age:23,
  email:"idriss.said.alaoui@pikelife.com",
  gender: "male",
  userID:1
})
',
   
}, function (err, results) {
    if (err) 
      throw err;
    
    var result = results[0];
    if (!result) {
        console.log('No user found.');
    } else {
        var user = result['u'];
         
        console.log(results); 
        var arr = [];
    var obj;
    for(var i in results){
      obj = {};
      obj.firstName = results[i]['u'].properties.firstName;
      obj.lastName = results[i]['u'].properties.lastName;
      obj.age = results[i]['u'].properties.age;
      obj.email = results[i]['u'].properties.email;
      obj.gender = results[i]['u'].properties.gender;
      obj.userID = results[i]['u'].properties.userID;
      arr.push(obj)
    }
   
    res.send(arr)
   
    }
}); 
});


*/







