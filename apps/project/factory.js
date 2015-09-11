pikelife.service('ProjectService', function() {

  var projectService = this;
  
  /*var projects = {
    id1 : {
      name : "project 1",
      spreedsheetKey : "key 1"
    },
    id2 : {
      name : "project 2",
      spreedsheetKey : "key 2"
    }
  };*/
  var projects;
  projectService.projects = function(val){
    if(val !== undefined) projects = val;
    return projects;
  };

});