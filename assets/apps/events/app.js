app.controller('EventsController', function ($scope, $timeout) {
  
  var EventsController = this;
  
  $scope.controller = this;
  $scope.timeout = $timeout;
  
  var displayData = {
    eventList : [{
      name: "Party in the block",
      city: "Ifrane",
      placeDescription:"auditorium 7",
      hour:23,
      minutes:30,
      day:13,
      month:"July",
      year:2015,
      
      eventID:1
    },{
      name: "Party in the block",
      city: "Ifrane",
      placeDescription:"auditorium 7",
      hour:23,
      minutes:30,
      day:13,
      month:"July",
      year:2015,
      
      eventID:1
    },{
      name: "Party in the block",
      city: "Ifrane",
      placeDescription:"auditorium 7",
      hour:23,
      minutes:30,
      day:13,
      month:"July",
      year:2015,
      
      eventID:1
    }]
  };
  EventsController._displayData = function(val){
    if(val !== undefined) displayData = val;
    return displayData;
  };
  
  
});