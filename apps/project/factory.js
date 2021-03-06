pikelife.service('ProjectService', function(PikelifeService, $timeout) {

  var projectService = this; 
  
  var projects = [];
  projectService.projects = function(val){
    if(val !== undefined) projects = val;
    return projects;
  };
  
  var selectedProject= {};
  projectService.selectedProject = function(val){
    if(val !== undefined) selectedProject = val;
    return selectedProject;
  };
  
  projectService.getSuccess = function(data){
    $timeout(function(){
      projectService.projects(data);
    });
  };
  
  projectService.getAllProjects = function(id){ 
    if(id)
      PikelifeService.get('projectsAll', 'id='+id, null, projectService.getSuccess);
  };

});