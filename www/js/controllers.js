angular.module('starter.controllers', [])
// .directive('mapbox', [
//   function () {
//     return {
//       restrict: 'EA',
//       replace: true,
//       scope: {
//         callback: "="
//       },
//       template: '<div></div>',
//       link: function (scope, element, attributes) {
//         L.mapbox.accessToken = 'pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg'
//         var map = L.mapbox.map(element[0], 'urbinsight.l906cd2j');
//         scope.callback(map);
//       }
//     };
//   }
//   ])
.controller('DashCtrl', function($scope, $rootScope, Trails) {
  $scope.trails = Trails.all();
})
.controller('TrailsCtrl', function($scope, $rootScope, $stateParams) {
  
})


.controller('TrailCtrl', function($scope, $rootScope, $stateParams, $http, Trails, geolocation, leafletData) {
  $scope.trailId = $stateParams.trailID
  $scope.trail = Trails.get($stateParams.trailID);
  Trails.setCurrent($stateParams.trailID);
  angular.extend($scope, {
    defaults: {
      tileLayer: 'http://api.tiles.mapbox.com/v4/urbinsight.l906cd2j/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg',
      maxZoom: 18,
      scrollWheelZoom: false
    },
    center: {
      lat: 37.7833,
      lng: -122.4167,
      zoom: 15
    }
  });
  
  var mapID = 'map' + $stateParams.trailID

  var L = window.L
  
  L.mapbox.accessToken = 'pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg'


  //Location pinging for device
  leafletData.getMap(mapID).then(function(map) {
    geolocation.getLocation().then(function(data){
      L.marker([data.coords.latitude, data.coords.longitude], {
        icon: L.mapbox.marker.icon({
          'marker-size': 'large',
          'marker-color': '#fff'
        })
      }).addTo(map)
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
        });
        marker.addTo(map);
        marker.bindPopup(popupContent, {
          closeButton: true, 
          minWidth: 320
        });
      }); 


    // Retrieves the directions from the Mapbox API and then draws the route.
    ($scope.drawRoute = function() {
     var requestString = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/' + $scope.waypoints.join(';') + '.json?access_token=' + L.mapbox.accessToken
     var request = $http.get(requestString);
     request.success(function(data, status){
       var polylinePoints = []
       angular.forEach(data.routes[0].geometry.coordinates, function(lonLat){
         polylinePoints.push([lonLat[1], lonLat[0]])
       });
       var polyline = L.polyline(polylinePoints, {color: 'teal', opacity: 1, weight: 10});
       polyline.addTo(map);
       map.fitBounds(polyline.getBounds());
     })
    })();
  });
})

.controller('LandmarkCtrl', function($scope, $stateParams, $rootScope, Trails) {
  console.log('Im the current Trail in the LandmarkCtrl');
  console.log(Trails.getCurrent());
  $scope.landmarks = Trails.get(Trails.getCurrent()).points;
})

.controller('RouteCtrl', function($scope, $stateParams, Trails) {
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
