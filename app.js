var express = require('express'),
    bodyParser = require('body-parser'),
    urlHelper = require('url'),
    httpRequest = require('request'),
    mongoose = require('mongoose');

var joinOnApp = this;
/* first small comment by sara */ 
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

/*var url = 'mongodb://localhost:27017/polygen';
mongoose.connect(url);

var db = mongoose.connection;
*/
/*
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
*/
var app = express();

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase('http://neo4j:bartra56390@localhost:7474');

app.use('/bower_components',  express.static(__dirname + '/bower_components'));
app.use('/assets', express.static(__dirname + '/assets'));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

/*
function getQueryObj(url){
  var url_parts = urlHelper.parse(url, true);
  return url_parts.query;
}
*/
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.route('/profile')
  .get(function(req, res) {
    
      db.cypher({
      query: 'MATCH (u:User) RETURN u',
   
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
  })
  .post(function(req, res) {
    var userObject = {
    "firstName": $("#user-firstName").val(),
    "lastName": $("#user-lastName").val(),
    "age": $("#user-age").val(),
    "email": $("#user-email").val(),
    "gender": $("#user-gender").val(),
    "userID": $("#user-userID").val(),

    };
    var restServerURL = "http://localhost:7474/db/data";
    $.ajax({
      type: "POST",
      url: restServerURL + "/profile",
      data: JSON.stringify(userObject),
      dataType: "json",
      contentType: "application/json",
      success: function( data, xhr, textStatus ) {
          console.log(data);
      },
      error: function( xhr ) {
          window.console && console.log( xhr );
      },
      complete: function() {
          alert("Address of new node: " + data.self);
      }
  });


    
  })

  .put(function(req, res) {
    





  })
  .delete(function(req, res) {
    var userObject = {
    "firstName": $("#user-firstName").val(),
    "lastName": $("#user-lastName").val(),
    "age": $("#user-age").val(),
    "email": $("#user-email").val(),
    "gender": $("#user-gender").val(),
    "userID": $("#user-userID").val(),

    };
    var restServerURL = "http://localhost:7474/db/data";
    $.ajax({
      type: "DELETE",
      url: restServerURL + "/profile",
      data: JSON.stringify(userObject),
      dataType: "json",
      contentType: "application/json",
      success: function( data, xhr, textStatus ) {
          console.log(data);
      },
      error: function( xhr ) {
          window.console && console.log( xhr );
      },
      complete: function() {
          alert("Address of new node: " + data.self);
      }
  });    
  })

  

app.route('/events')
  .get(function(req, res) {
          db.cypher({
          query: 'MATCH (e:Event) RETURN e',
   
      }, function (err, results) {
           if (err) 
              throw err;
    
      var result = results[0];
      if (!result) {
        console.log('No event found.');
      } else {
        var user = result['e'];
         
        console.log(results); 
        var arr = [];
        var obj;
        for(var i in results){
          obj = {};
          obj.name = results[i]['e'].properties.name;
          obj.city = results[i]['e'].properties.city;
          obj.placeDescription = results[i]['e'].properties.placeDescription;
          obj.hour = results[i]['e'].properties.hour;
          obj.minutes = results[i]['e'].properties.minutes;
          obj.day = results[i]['e'].properties.day;
          obj.month = results[i]['e'].properties.month;
          obj.year = results[i]['e'].properties.year;
          obj.eventID = results[i]['e'].properties.eventID;
          arr.push(obj)
    }
   
    res.send(arr)
   
    }
 }); 
  })
  .post(function(req, res) {
    
  })
  .put(function(req, res) {
    // to be done
  })
  .delete(function(req, res) {
    // to be done
  });


var server = app.listen(8080, function () {

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







