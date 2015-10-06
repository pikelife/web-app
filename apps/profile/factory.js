pikelife.service('ProfileService', function() {

  var profileService = this;
  
  
  var profile = {};
  
  profileService.isLogged = function(val){
    if(val !== undefined) profile = val;
    return profile;
  }; 
  
  var isLogged = false;

  profileService.isLogged = function(val){
    if(val !== undefined) isLogged = val;
    return isLogged;
  };

});