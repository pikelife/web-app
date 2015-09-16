pikelife.controller('ProjectController', function($timeout, ProfileService, ProjectService, PikelifeService) {

  var projectCtrl = this; 
  projectCtrl.ProjectService = ProjectService;
  
  projectCtrl.getSuccess = function(data){
    if(data){
      projectCtrl.ProjectService.selectedProject(data);
      projectCtrl.ProjectService.getAllProjects(sessionStorage.getItem('usrId'));
    }
  };
  
  projectCtrl.postSuccess = function(data){
    if(data){
      $timeout(function(){
        projectCtrl.ProjectService.selectedProject(data);
        projectCtrl.ProjectService.getAllProjects(sessionStorage.getItem('usrId')); 
        var test;
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
    projectCtrl.ProjectService.getAllProjects(sessionStorage.getItem('usrId'));
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
  
  projectCtrl.isProjectSelected = function(){
    if(jQuery.isEmptyObject(projectCtrl.ProjectService.selectedProject())) return false;
    return true;
  };
  
  var isProjectNameEdit = false;
  projectCtrl.isProjectNameEdit = function(val){
    if(val !== undefined) isProjectNameEdit = val;
    return isProjectNameEdit;
  };  
  
  projectCtrl.updateProject = function(){
    PikelifeService.put('project', 'id='+projectCtrl.ProjectService.selectedProject()._id, projectCtrl.ProjectService.selectedProject(), projectCtrl.putSuccess);
  };
  
  projectCtrl.addProject = function(){
    PikelifeService.post('project', 'id='+sessionStorage.getItem('usrId'), null, projectCtrl.postSuccess);
  };
  
  projectCtrl.deleteProject = function(){
    PikelifeService.delete('project', 'id='+projectCtrl.ProjectService.selectedProject()._id+"&usrId=" + sessionStorage.getItem('usrId'), null, projectCtrl.deleteSuccess);
  };
  

});