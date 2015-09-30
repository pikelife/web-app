var pikelife = angular.module('pikelife', []);

pikelife.service('PikelifeService', function($http) {

  var pikelifeService = this;
  
  pikelifeService.get = function(appName, query, body, callBack) {
    $http.get("/" + appName + "?" + query)
    .success(function(data, status, headers, config) {
      callBack(data);
    }).error(function(data, status, headers, config) {
      
    });
  };
  
  pikelifeService.post = function(appName, query,  body, callBack) {
    $http.post("/" + appName + "?" + query, body).
    then(function(response) {
      if(response)
        callBack(response.data);
    }, function(response) {  
      
    });
  };
  
  pikelifeService.put = function(appName, query, body, callBack) {
    $http.put("/" + appName + "?" + query, body).
      then(function(response) {
        if(response)  
          callBack(response.data);
      }, function(response) {   
        
    });
  };
  
  pikelifeService.delete = function(appName, query, body, callBack) {
    $http.delete("/" + appName + "?" + query, body).
      then(function(response) {
        if(response)
          callBack(response.data);  
      }, function(response) {  
        
    });
  };

});