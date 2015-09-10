pikelife.controller('ProfileController', function($timeout, ProfileService, PikelifeService) {

  var profileCtrl = this; 
  profileCtrl.ProfileService = ProfileService;
  
  var authProfile = {};
  
  profileCtrl.authProfile = function(val){
    if(val !== undefined) authProfile = val;
    return authProfile;
  };
  
  profileCtrl.login = function(){
    PikelifeService.get('profile', 'email='+profileCtrl.authProfile().email);
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
      if(data.password === profileCtrl.authProfile().password){
        ProfileService.profile(data);
        ProfileService.isLogged(true);
        var test;
      }
    }
  };
  
  profileCtrl.postSuccess = function(data){
    if(data){
      ProfileService.profile(data);
      ProfileService.isLogged(true);
    }
  };
  
  PikelifeService.getSuccess = profileCtrl.getSuccess;
  PikelifeService.postSuccess = profileCtrl.postSuccess;

});