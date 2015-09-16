pikelife.controller('ProfileController', function($timeout, ProfileService, ProjectService, PikelifeService) {

  var profileCtrl = this; 
  profileCtrl.ProfileService = ProfileService;
  
  var authProfile = {};
  
  profileCtrl.authProfile = function(val){
    if(val !== undefined) authProfile = val;
    return authProfile;
  };
  
  profileCtrl.login = function(){ 
    $("#auth-error").hide();
    if(profileCtrl.authProfile() && profileCtrl.authProfile().password && profileCtrl.authProfile().email) 
      PikelifeService.post('login', null, profileCtrl.authProfile(), profileCtrl.getSuccess);
  };
  
  profileCtrl.logout = function(){
    $timeout(function(){
      ProfileService.profile(null);
      ProfileService.isLogged(false); 
      ProjectService.projects([]);
      ProjectService.selectedProject(null);
      sessionStorage.removeItem('usrId');
      profileCtrl.authType('login'); 
    });
  };
  
  profileCtrl.register = function(){ 
    $("#auth-error").hide();
    if(profileCtrl.authProfile() && profileCtrl.authProfile().name && profileCtrl.authProfile().password && profileCtrl.authProfile().email)
      PikelifeService.post('register', null, profileCtrl.authProfile(), profileCtrl.getSuccess);
  };
  
  var authType = "login";
  
  profileCtrl.authType = function(val){
    if(val !== undefined) authType = val;
    return authType;
  };
  
  var authError = "";
  profileCtrl.authError = function(val){
    if(val !== undefined) authError = val;
    return authError;
  };
  
  profileCtrl.getSuccess = function(data){
    if(data){
      if(data.error){
        if(data.error === "email" && profileCtrl.authType() === "login"){
          profileCtrl.authError('wrong email');
        }else if(data.error === "email" && profileCtrl.authType() === "register"){
          profileCtrl.authError('Email already existing');
        }else if(data.error === "password"){ 
          profileCtrl.authError('wrong password'); 
        }
        $("#auth-error").show();
      }else{
        $timeout(function(){
          ProfileService.profile(data); 
          ProjectService.getAllProjects(data._id);
          sessionStorage.setItem('usrId', data._id);
          ProfileService.isLogged(true);
          profileCtrl.authType('auth-success');
        });
        $("#auth-error").hide();
      }
    }
  };
  
  profileCtrl.postSuccess = function(data){
    if(data){
      $timeout(function(){
        ProfileService.profile(data);
        profileCtrl.authType('auth-success');
        ProfileService.isLogged(true);
      });
    }
  };
  
  profileCtrl.putSuccess = function(){
    $timeout(function(){ 
      $("#profile-saved").show();
      PikelifeService.get('profile', 'id='+sessionStorage.getItem('usrId'), null, profileCtrl.getSuccess); 
    });
    $timeout(function(){
      $("#profile-saved").hide();
    }, 5000);
  };
  
  var updateProfileData = {};
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