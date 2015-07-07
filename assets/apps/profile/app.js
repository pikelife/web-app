app.controller('ProfileController', function ($scope, $timeout, JoinOnService) {
  
  ProfileController = this;
  
  $scope.controller = this;
  $scope.timeout = $timeout;
  
  $scope.islogged = false;
  
  profileData = {
    email : "",
    name : "",
    password : ""
  };
  ProfileController._profileData = function(val){
    if(val !== undefined) profileData = val;
    return profileData;
  };
  
  ProfileController.postSuccess = function(data){
    for(var i in data){
      ProfileController._profileData()[i] = data[i];
    }
    $scope.islogged = true;
  };
  
  ProfileController.login = function(){
    JoinOnService.post("profile", ProfileController._profileData(), "isRegister=false");
  };
  
  ProfileController.register = function(){
    ProfileController.JoinOnService.post("profile", ProfileController._profileData(), "isRegister=true");
  };
  
  JoinOnService.postSuccessFuns()['profile'] = ProfileController.postSuccess;
});