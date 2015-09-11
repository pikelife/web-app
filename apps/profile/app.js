pikelife.controller('ProfileController', function($timeout, ProfileService, ProjectService, PikelifeService) {

  var profileCtrl = this; 
  profileCtrl.ProfileService = ProfileService;
  
  var usrId= "55f24a34b418e4a2308e4024";
  
  var authProfile = {};
  
  profileCtrl.authProfile = function(val){
    if(val !== undefined) authProfile = val;
    return authProfile;
  };
  
  profileCtrl.login = function(){
    PikelifeService.get('profile', 'email='+profileCtrl.authProfile().email, null, profileCtrl.getSuccess);
  };
  
  profileCtrl.logout = function(){
    ProfileService.profile(null);
    ProfileService.isLogged(false);
  };
  
  profileCtrl.register = function(){
     PikelifeService.post('profile', profileCtrl.authProfile());
  };
  
  var authType = "login";
  
  profileCtrl.authType = function(val){
    if(val !== undefined) authType = val;
    return authType;
  };
  
  profileCtrl.getSuccess = function(data){
    if(data){
      ProfileService.profile(data); 
      ProjectService.getAllProjects(data._id);
      ProfileService.isLogged(true);
    }
  };
  
  profileCtrl.postSuccess = function(data){
    if(data){
      ProfileService.profile(data);
      ProfileService.isLogged(true);
    }
  };
  
  PikelifeService.get('profile', 'id='+usrId, null, profileCtrl.getSuccess);
});