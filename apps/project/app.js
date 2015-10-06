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
  
  getUrlList = [{key : "", value : ""}];
  projectCtrl.getUrlList = function(val){
    if(val !== undefined) getUrlList = val;
    return getUrlList;
  };
  
  projectCtrl.addGetUrl = function(){  
    projectCtrl.getUrlList().push({key : "", value : ""});
  };
  
  postBodyList = [{key : "", value : ""}];
  projectCtrl.postBodyList = function(val){
    if(val !== undefined) postBodyList = val;
    return postBodyList;
  };  
  
  projectCtrl.addPostBody = function(){  
    projectCtrl.postBodyList().push({key : "", value : ""});
  };
  
  requestResult = [];
  projectCtrl.requestResult = function(val){
    if(val !== undefined) requestResult = val;
    return requestResult;
  };
  
  projectCtrl.apiSuccess = function(data){
    projectCtrl.requestResult(data);  
  };
  
  projectCtrl.sendRequest = function(type){
    var urlQuery = "";  
    for(var i in projectCtrl.getUrlList()){
      urlQuery += projectCtrl.getUrlList()[i].key;  
      urlQuery += "="; 
      urlQuery += projectCtrl.getUrlList()[i].value;
      if(i + 1 < projectCtrl.getUrlList().length) urlQuery += "&";
    }
    
    var bodyRequest = {};
    for(var j in projectCtrl.postBodyList()){    
      bodyRequest[projectCtrl.postBodyList()[j].key] = projectCtrl.postBodyList()[j].value;   
    }   
    if(type === "get"){  
      PikelifeService.get('api/' + sessionStorage.getItem('usrId') + '/' + projectCtrl.ProjectService.selectedProject().spreedKey, urlQuery, null, projectCtrl.apiSuccess);
    }else{
     switch(type){
      case "post":
        PikelifeService.post('api/' + sessionStorage.getItem('usrId') + '/' + projectCtrl.ProjectService.selectedProject().spreedKey, null, bodyRequest, projectCtrl.apiSuccess); 
        break;
      case "put":
        PikelifeService.put('api/' + sessionStorage.getItem('usrId') + '/' + projectCtrl.ProjectService.selectedProject().spreedKey, urlQuery, bodyRequest, projectCtrl.apiSuccess);
        break;    
      case "delete":
        PikelifeService.delete('api/' + sessionStorage.getItem('usrId') + '/' + projectCtrl.ProjectService.selectedProject().spreedKey, urlQuery, null, projectCtrl.apiSuccess);
        break;
     }
    }
  };

});