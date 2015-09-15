pikelife.controller('ProfileController', function($timeout, ProfileService, ProjectService, PikelifeService) {

  var profileCtrl = this; 
  profileCtrl.ProfileService = ProfileService;
  
  var authProfile = {};
  
  profileCtrl.authProfile = function(val){
    if(val !== undefined) authProfile = val;
    return authProfile;
  };
  
  profileCtrl.login = function(){ 
    PikelifeService.post('login', null, profileCtrl.authProfile(), profileCtrl.getSuccess);
  };
  
  profileCtrl.logout = function(){
    $timeout(function(){
      ProfileService.profile(null);
      ProfileService.isLogged(false); 
      ProjectService.projects([]);
      ProjectService.selectedProject(null);
      sessionStorage.removeItem('usrId');
    });
  };
  
  profileCtrl.register = function(){ 
    PikelifeService.post('register', null, profileCtrl.authProfile(), profileCtrl.getSuccess);
  };
  
  var authType = "login";
  
  profileCtrl.authType = function(val){
    if(val !== undefined) authType = val;
    return authType;
  };
  
  profileCtrl.getSuccess = function(data){
    if(data){
      $timeout(function(){
        ProfileService.profile(data); 
        ProjectService.getAllProjects(data._id);
        sessionStorage.setItem('usrId', data._id);
        ProfileService.isLogged(true);
      });
    }
  };
  
  profileCtrl.postSuccess = function(data){
    if(data){
      $timeout(function(){
        ProfileService.profile(data);
        ProfileService.isLogged(true);
      });
    }
  };
  
  profileCtrl.putSuccess = function(data){
    $timeout(function(){ 
      PikelifeService.get('profile', 'id='+sessionStorage.getItem('usrId'), null, profileCtrl.getSuccess); 
    });
  };
  
  var updateProfileData;
  profileCtrl.updateProfileData = function(val){
    if(val !== undefined) updateProfileData = val;
    return updateProfileData;
  };
  
  profileCtrl.openUpdateProfileDialog = function(){   
    $timeout(function(){
      profileCtrl.updateProfileData($.extend(true, {}, ProfileService.profile()));
    }, 500); 
  };
  
  profileCtrl.updateProfile = function(){
    PikelifeService.put('profile', 'id=' + sessionStorage.getItem('usrId'), profileCtrl.updateProfileData(), profileCtrl.putSuccess); 
  };
  
  PikelifeService.get('profile', 'id='+sessionStorage.getItem('usrId'), null, profileCtrl.getSuccess);
});