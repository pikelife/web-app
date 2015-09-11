pikelife.controller('ProjectController', function($timeout, ProjectService, PikelifeService) {

  var projectCtrl = this; 
  projectCtrl.ProjectService = ProjectService;
  
  projectCtrl.getSuccess = function(data){
    
  };
  
  projectCtrl.postSuccess = function(data){
    
  };
  
  PikelifeService.getSuccess = projectCtrl.getSuccess;
  PikelifeService.postSuccess = projectCtrl.postSuccess;

});