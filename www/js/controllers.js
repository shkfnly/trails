angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Trails) {
  $scope.trails = Trails.all();
})
.controller('TrailsCtrl', function($scope, Trails) {
  $scope.trailId = Trails.getCurrent();
})


.controller('TrailCtrl', function($scope, $stateParams, $http, Trails, geolocation) {
  $scope.trail = Trails.get($stateParams.trailId);
  $scope.trailId = $stateParams.trailId;
  Trails.setCurrent($scope.trailId);
// Add basemap to view.
  ($scope.addMap = function(){
    if($scope.map != undefined){
      $scope.map.remove();
    }
    var L = window.L;
    L.mapbox.accessToken = 'pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg'
    $scope.map = L.mapbox.map('map', 'urbinsight.l906cd2j').setView([37.7833, -122.4167], 15);	
  })();

  

  //Location pinging for device
  geolocation.getLocation().then(function(data){
    L.marker([data.coords.latitude, data.coords.longitude], {
      icon: L.mapbox.marker.icon({
        'marker-size': 'large',
        'marker-color': '#fff'
      })
    }).addTo($scope.map)
  })


  $scope.waypoints = [];


// Retrieve waypoints from angular services.
  angular.forEach($scope.trail.points, function(point){
    $scope.waypoints.push([point.lon, point.lat])
    var popupContent = "<div>I'm custom popup content</div>";

    var marker = L.marker([point.lat, point.lon], {
      icon: L.mapbox.marker.icon({
        'marker-size': 'large',
        'marker-color': '#fa0'
      })
    })
    marker.addTo($scope.map);
    marker.bindPopup(popupContent, {
      closeButton: true, 
      minWidth: 320
    })
  });

 // Retrieves the directions from the Mapbox API and then draws the route.
 ($scope.drawRoute = function() {
  var requestString = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/' + $scope.waypoints.join(';') + '.json?access_token=' + L.mapbox.accessToken
  var request = $http.get(requestString);
  request.success(function(data, status){
    var polylinePoints = []
    angular.forEach(data.routes[0].geometry.coordinates, function(lonLat){
      polylinePoints.push([lonLat[1], lonLat[0]])
    })
    var polyline = L.polyline(polylinePoints, {color: 'teal', opacity: 1, weight: 10});
    polyline.addTo($scope.map);
    $scope.map.fitBounds(polyline.getBounds());
  })
 })();
})

.controller('LandmarkCtrl', function($scope, $stateParams, $rootScope, Trails) {
  console.log($stateParams.trailId)
  console.log($rootScope.trailID)
  $scope.landmarks = Trails.get($stateParams.trailId).points;

})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {

})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
