var express = require('express'),
    bodyParser = require('body-parser'),
    urlHelper = require('url'),
    httpRequest = require('request'),
    mongoose = require('mongoose'), 
    cors = require('cors'), 
    request = require("request");


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

var recipeSchema;
_this.recipeSchema = function(val){
  if(val !== undefined) recipeSchema = val;
  return recipeSchema;
};

var recipeModel;
_this.recipeModel = function(val){
  if(val !== undefined) recipeModel = val;
  return recipeModel;
};

var url = 'mongodb://localhost:27017/polygen';
mongoose.connect(url);

var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  
  var profileSchema = mongoose.Schema({
    email : String,
    name : String,
    password : String,
    recipes : Array
  });
  _this.profileSchema(profileSchema);
  
  var Profile = mongoose.model('Profile', profileSchema);
  _this.profileModel(Profile);
  
  var recipeSchema = mongoose.Schema({
    name : String,
    description : String,
    ingredients : Array,
    materials: Array,
    videoUrl : String
  });
  _this.recipeSchema(recipeSchema);
  
  var Recipe = mongoose.model('Recipe', recipeSchema);
  _this.recipeModel(Recipe);
  
});
  
var app = express();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    
    next();  
};

app.use(allowCrossDomain);

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

app.post('/login', function (req, res) { 
  var query = getQueryObj(req.url);
  if(req.body){
    var queryDb = _this.profileModel().findOne({ 'email': req.body.email});
    queryDb.exec(function (err, obj) {
      if (err) return console.error(err);
      if(obj){
        if(obj.password === req.body.password){
          res.send(obj);
        }else{
          res.send({
            error : 'password'
          });
        } 
      }else{
        res.send({
          error : 'email'
        });
      }  
    });
  }
});

app.post('/register', function (req, res) {
  var query = getQueryObj(req.url);
  if(req.body){
    var queryDb = _this.profileModel().findOne({ 'email': req.body.email});
    queryDb.exec(function (err, obj) {
      if (err) return console.error(err);
      if(obj){
        res.send({
          error : 'email'
        });
      }else{
        var query = getQueryObj(req.url);
        var newProfile = new _this.profileModel()({  "email" : req.body.email,
                                                     "name" : req.body.name,
                                                     "password" : req.body.password });
        newProfile.save(function (err, obj) {
          if (err) return console.error(err);
          res.send(obj);
        });
      }   
    });
  }
});

app.get('/recipesAll', function (req, res) {
  var query = getQueryObj(req.url);
  var queryDb = _this.profileModel().findOne({ '_id': query.id});
  queryDb.exec(function (err, obj) {
    if (err) return console.error(err);
    var projectsArrId = obj.projects;
    var queryDb = _this.recipeModel().find();
    queryDb.exec(function (err, obj) {
              var result = [];
              if (err) return console.error(err);
                for(var i in obj){
                  for(var j = 0 ; j < projectsArrId.length ; j++){  
                    if(JSON.stringify(obj[i]._id) == JSON.stringify(projectsArrId[j])){ 
                      result.push(obj[i]);
                    }
                  } 
                } 
                res.send(result);
              });  
  });
});

app.route('/api/:usrId/:projectId')
  .get(function(req, res, next) {  
    var queryDb = _this.profileModel().findOne({ '_id': req.params.usrId});
    queryDb.exec(function (err, obj) {
      if (err) return res.send({error : 'wrong user id'});          
      if(obj._id){  
        var query = req.url.split('?')[1];
        var googleUrl = 'https://script.google.com/macros/s/AKfycbwAbq_lVUIWsdE6zZpE3f2_1zVhPsfYURQ2Y9r8CuYz_ZSwfbc/exec?';  
        googleUrl += query + "&url=" + req.params.projectId; 
        
        request(googleUrl, function(error, response, body) {
          res.send(body);
        }); 
      }  
    });
  })
  .post(function(req, res, next) {
    var queryDb = _this.profileModel().findOne({ '_id': req.params.usrId});
    queryDb.exec(function (err, obj) {
      if (err) return res.send({error : 'wrong user id'});          
      var data = req.body.data;  
    
      var googleUrl = 'https://script.google.com/macros/s/AKfycbwAbq_lVUIWsdE6zZpE3f2_1zVhPsfYURQ2Y9r8CuYz_ZSwfbc/exec?url=' + req.params.projectId; 
      
      request.post({url:googleUrl, followAllRedirects : true, form: {data : data, methodType: "post"}}, function(error, response, body) {
        res.send(body);  
      });   
    }); 
      
  })
  .put(function(req, res, next) {
    var queryDb = _this.profileModel().findOne({ '_id': req.params.usrId});
    queryDb.exec(function (err, obj) {
      if (err) return res.send({error : 'wrong user id'});          
      if(obj._id){  
        var query = req.url.split('?')[1];  
        var data = req.body.data; 
        
        var googleUrl = 'https://script.google.com/macros/s/AKfycbwAbq_lVUIWsdE6zZpE3f2_1zVhPsfYURQ2Y9r8CuYz_ZSwfbc/exec?';   
        googleUrl += query + "&url=" + req.params.projectId; 
        request.post({url:googleUrl, followAllRedirects : true, form: {data : data, methodType: "put"}}, function(error, response, body) {
          res.send(body);  
        });  
      }  
    });
  })
  .delete(function(req, res, next) {
    var queryDb = _this.profileModel().findOne({ '_id': req.params.usrId});
    queryDb.exec(function (err, obj) {
      if (err) return res.send({error : 'wrong user id'});          
      var query = req.url.split('?')[1];   
    
      var googleUrl = 'https://script.google.com/macros/s/AKfycbwAbq_lVUIWsdE6zZpE3f2_1zVhPsfYURQ2Y9r8CuYz_ZSwfbc/exec?';   
      googleUrl += query + "&url=" + req.params.projectId;  
      request.post({url:googleUrl, followAllRedirects : true, form: {methodType: "delete"}}, function(error, response, body) {  
        res.send(body);    
      });  
    });  
  });

app.route('/profile')
  .get(function(req, res) {
    var query = getQueryObj(req.url);
    var queryDb = _this.profileModel().findOne({ '_id': query.id});
    queryDb.exec(function (err, obj) {
      if (err) return console.error(err);
      res.send(obj); 
    });
  })
  .post(function(req, res) {
    var query = getQueryObj(req.url);
      var newProfile = new _this.profileModel()({  "email" : req.body.email,
                                                   "name" : req.body.name,
                                                   "password" : req.body.password });
      newProfile.save(function (err, obj) {
        if (err) return console.error(err);
        res.send(obj);
      });
  })
  .put(function(req, res) {
    	var email = req.body.email;
    	var name = req.body.name;
    	var password = req.body.password;
    	var query = getQueryObj(req.url);
    	console.dir("GET received query " + JSON.stringify(query.id));
    	var queryDb = _this.profileModel().findOne({ '_id': query.id});
    	queryDb.update({
    		email: email,
    		name: name,
    		password: password
		  }, function(err, obj){
			if(err){
				res.send(" Problem updating the information to the database:"+ err);

			}
			else{
				 res.send(obj);

			}
		});
  })
  .delete(function(req, res) {
      _this.profileModel().remove({ '_id': req.id }, function (err, profile) {
          if (err) {
              return console.error(err);
          } else {
              //Returning success messages saying it was deleted
               res.send({message : 'deleted',
                         item : profile
                        });
          }
      });
  });
  
app.route('/recipes')
  .get(function(req, res) {
    var query = getQueryObj(req.url);
    var queryDb = _this.recipeModel().findOne({ '_id': query.id});
    queryDb.exec(function (err, obj) {
      if (err) return console.error(err);
      res.send(obj); 
    });
  })
  .post(function(req, res) {
    var query = getQueryObj(req.url);
      var newProject = new _this.recipeModel()({  "name" : "new project" });
      newProject.save(function (err, obj) {
        if (err) return console.error(err);
        var projectId = obj._id;
        var queryDb = _this.profileModel().findOne({ '_id': query.id});
        var profile;
        queryDb.exec(function (err, obj) {
          if (err) return console.error(err);
          profile = obj; 
          var projects = profile.projects;
          projects.push(projectId);
        	queryDb.update({
         		projects: projects
    		  }, function(err, obj){
      			if(err){
      				res.send(" Problem updating the information to the database:"+ err);
      	  	}
  		    });
        });
        
  		  res.send(obj);
      });
  })
  .put(function(req, res) {
    	var name = req.body.name;
    	var spreedKey = req.body.spreedKey;
    	var query = getQueryObj(req.url);
    	console.dir("GET received query " + JSON.stringify(query.id));
    	var queryDb = _this.recipeModel().findOne({ '_id': query.id});
    	queryDb.update({
    		name: name,
    		spreedKey: spreedKey
		}, function(err, obj){
			if(err){
				res.send(" Problem updating the information to the database:"+ err);
			}
			else{
				 res.send(obj);
			}
		});
  })
  .delete(function(req, res) { 
      var query = getQueryObj(req.url);
      _this.recipeModel().remove({ '_id': query.id }, function (err, project) {
          if (err) {
              return console.error(err);
          } else {
              //Returning success messages saying it was deleted 
              var queryDb = _this.profileModel().findOne({ '_id': query.usrId});
              var profile;
              queryDb.exec(function (err, obj) {
                if (err) return console.error(err);
                profile = obj; 
                if(profile){
                  var projects = profile.projects;
                  for(var i in projects){
                    if(projects[i] == query.id){
                      projects.splice(i, 1);
                    }
                  }
                	queryDb.update({
                 		projects: projects
            		  }, function(err, obj){
              			if(err){
              				res.send(" Problem updating the information to the database:"+ err);
              	  	}
          		    });
                }
              }); 
               res.send({message : 'deleted',
                         item : project
                        });
          }
      });
  });
  
var server = app.listen(8080, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('pikelife app listening at http://%s:%s', host, port);

});







