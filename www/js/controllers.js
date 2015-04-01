angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Trails) {
  $scope.trails = Trails.all();
})

.controller('TrailCtrl', function($scope, $stateParams, $http, Trails, geolocation) {
  $scope.trail = Trails.get($stateParams.trailId);
  $scope.addMap = function(){
    var L = window.L;
    L.mapbox.accessToken = 'pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg'
    $scope.map = L.mapbox.map('map', 'urbinsight.l906cd2j').setView([37.7833, -122.4167], 15);	
  };
  $scope.addMap();
  
  geolocation.getLocation().then(function(data){
    L.marker([data.coords.latitude, data.coords.longitude], {
      icon: L.mapbox.marker.icon({
        'marker-size': 'large',
        'marker-color': '#fff'
      })
    }).addTo($scope.map)
  })
  $scope.waypoints = [];

  angular.forEach($scope.trail.points, function(point){
    $scope.waypoints.push([point.lon, point.lat])
    L.marker([point.lat, point.lon], {
      icon: L.mapbox.marker.icon({
        'marker-size': 'large',
        'marker-color': '#fa0'
      })
    }).addTo($scope.map);
  });
 $scope.drawRoute = function() {
  var requestString = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/' + $scope.waypoints.join(';') + '.json?access_token=' + L.mapbox.accessToken
  var request = $http.get(requestString);
  request.success(function(data, status){
    console.log(data);
    var polylinePoints = []
    angular.forEach(data.routes[0].geometry.coordinates, function(lonLat){
      polylinePoints.push([lonLat[1], lonLat[0]])
    })
    L.polyline(polylinePoints, {color: 'teal', opacity: 1, weight: 10}).addTo($scope.map);
  })
 };
 $scope.drawRoute();
})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
