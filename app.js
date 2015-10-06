var express = require('express'),
    bodyParser = require('body-parser'),
    urlHelper = require('url'),
    httpRequest = require('request'),
    mongoose = require('mongoose'),  
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

var projectSchema;
_this.projectSchema = function(val){
  if(val !== undefined) projectSchema = val;
  return projectSchema;
};

var projectModel;
_this.projectModel = function(val){
  if(val !== undefined) projectModel = val;
  return projectModel;
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
    projects : Array
  });
  _this.profileSchema(profileSchema);
  
  var Profile = mongoose.model('Profile', profileSchema);
  _this.profileModel(Profile);
  
  var projectSchema = mongoose.Schema({
    name : String,
    spreedKey : String
  });
  _this.projectSchema(projectSchema);
  
  var Project = mongoose.model('Project', projectSchema);
  _this.projectModel(Project);
  
});
  
var app = express();

app.use('/apps',  express.static(__dirname + '/apps'));
app.use('/assets', express.static(__dirname + '/assets'));


app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(function(req, res, next) {  
  // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Pass to next layer of middleware
    next();
}); 


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

app.get('/projectsAll', function (req, res) {
  var query = getQueryObj(req.url);
  var queryDb = _this.profileModel().findOne({ '_id': query.id});
  queryDb.exec(function (err, obj) {
    if (err) return console.error(err);
    var projectsArrId = obj.projects;
    var queryDb = _this.projectModel().find();
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


  
getCallback = 
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
  
app.route('/project')
  .get(function(req, res) {
    var query = getQueryObj(req.url);
    var queryDb = _this.projectModel().findOne({ '_id': query.id});
    queryDb.exec(function (err, obj) {
      if (err) return console.error(err);
      res.send(obj); 
    });
  })
  .post(function(req, res) {
    var query = getQueryObj(req.url);
      var newProject = new _this.projectModel()({  "name" : "new project" });
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
    	var queryDb = _this.projectModel().findOne({ '_id': query.id});
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
      _this.projectModel().remove({ '_id': query.id }, function (err, project) {
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

  console.log('joinOn app listening at http://%s:%s', host, port);

});







