var pikelife = angular.module('pikelife', []);

pikelife.service('PikelifeService', function($http) {

  var pikelifeService = this;
  
  pikelifeService.get = function(appName, query) {
    $http.get("/" + appName + "?" + query)
    .success(function(data, status, headers, config) {
      pikelifeService.getSuccess(data);
    }).error(function(data, status, headers, config) {
      
    });
  };
  
  pikelifeService.post = function(appName, body) {
    $http.post("/" + appName, body).
    then(function(response) {
      if(response)
        pikelifeService.postSuccess(response.data);
    }, function(response) {
      
    });
  };
  
  pikelifeService.put = function(appName, query, body) {
  
  };
  
  pikelifeService.delete = function(appName, query, body) {
  
  };
  
  pikelifeService.getSuccess = function(){};
  pikelifeService.postSuccess = function(){};

});