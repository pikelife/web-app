pikelife.controller('ProjectController', function($timeout, ProfileService, ProjectService, PikelifeService) {

  var projectCtrl = this; 
  projectCtrl.ProjectService = ProjectService;
  var usrId= "55f24a34b418e4a2308e4024";
  
  projectCtrl.getSuccess = function(data){
    if(data){
      projectCtrl.ProjectService.selectedProject(data);
      projectCtrl.ProjectService.getAllProjects('55f24a34b418e4a2308e4024');
    }
  };
  
  projectCtrl.postSuccess = function(data){
    if(data){
      $timeout(function(){
        projectCtrl.ProjectService.selectedProject(data);
      });
    }
  };
  
  projectCtrl.putSuccess = function(){
    $timeout(function(){ 
      PikelifeService.get('project', 'id='+projectCtrl.ProjectService.selectedProject()._id, null, projectCtrl.getSuccess);
    });
  };
  
  projectCtrl.deleteSuccess = function(){
    projectCtrl.ProjectService.selectedProject(null);
    projectCtrl.ProjectService.getAllProjects('55f24a34b418e4a2308e4024');
  };
  
  projectCtrl.showProject = function(id){
    if(id){
      for(var i in projectCtrl.ProjectService.projects()){
        if(projectCtrl.ProjectService.projects()[i]._id == id){
          projectCtrl.ProjectService.selectedProject(projectCtrl.ProjectService.projects()[i]);
        }
      }
    }
  };
  
  projectCtrl.updateProject = function(){
    PikelifeService.put('project', 'id='+projectCtrl.ProjectService.selectedProject()._id, projectCtrl.ProjectService.selectedProject(), projectCtrl.putSuccess);
  };
  
  projectCtrl.addProject = function(){
    PikelifeService.post('project', 'id='+usrId, null, projectCtrl.postSuccess);
  };
  
  projectCtrl.deleteProject = function(){
    PikelifeService.delete('project', 'id='+projectCtrl.ProjectService.selectedProject()._id+"&usrId=55f24a34b418e4a2308e4024", null, projectCtrl.deleteSuccess);
  };
  

});