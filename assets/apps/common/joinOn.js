var app = angular.module('joinon', []);

app.service('JoinOnService', function ($http) {
  
  var JoinOnService = this;
  
  var postSuccessFuns = {};
  JoinOnService.postSuccessFuns = function(val){
    if(val !== undefined) postSuccessFuns = val;
    return postSuccessFuns;
  };
  
  JoinOnService.post = function(appName, postData, query){
    $http.post('/' + appName + "?" + query, postData).
    success(function(data, status, headers, config) {
      JoinOnService.postSuccessFuns()[appName](data);
    }).
    error(function(data, status, headers, config) {
      
    });
  };
  
});

app.service('CookieService', function () {
  
  var CookieService = this;
  
  CookieService.setCookie = function(key, value){
    return sessionStorage.setItem(key, value);
  };
  
  CookieService.getCookie = function(key){
    return sessionStorage.getItem(key);
  };
  
  CookieService.destroyCookie = function(key){
    return sessionStorage.removeItem(key);
  };
});