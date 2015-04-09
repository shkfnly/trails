angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, Trails) {
  $scope.trails = Trails.all();
})

.controller('TrailCtrl', function($scope, $stateParams, Trails){
  $scope.trailId = $stateParams.trailID
  $scope.trail = Trails.get($stateParams.trailID);
  Trails.setCurrent($stateParams.trailID);
})

.controller('MapCtrl', function($scope, $rootScope, $stateParams, $http, Trails, geolocation, leafletData) {
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
  
  var mapID = 'map' + $stateParams.trailID;
  var L = window.L;
  L.mapbox.accessToken = 'pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg';

  $scope.drawPolylineRoute = function(data, map){
    var polylinePoints = []
    angular.forEach(data.routes[0].geometry.coordinates, function(lonLat){
      polylinePoints.push([lonLat[1], lonLat[0]])
    });
    var polyline = L.polyline(polylinePoints, {color: 'teal', opacity: 1, weight: 10});
    polyline.addTo(map);
    map.fitBounds(polyline.getBounds());
  }

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
        var popupContent =  function(){
          return [
           '<h2>' + point.name + '</h2>',
            '<img ng-src="' + point.image + '">',
            '<p>Landmark Description</p>'
          ].join("");
        };

        var marker = L.marker([point.lat, point.lon], {
          icon: L.mapbox.marker.icon({
            'marker-size': 'large',
            'marker-color': '#fa0'
          })
        });
        marker.addTo(map);
        marker.bindPopup(popupContent(), {
          closeButton: true,
          minWidth: 320
        }).addTo(map);
      }); 

    // Retrieves the directions from the Mapbox API and then draws the route.
    ($scope.drawRoute = function() {
     var requestString = 'http://api.tiles.mapbox.com/v4/directions/mapbox.walking/' + $scope.waypoints.join(';') + '.json?access_token=' + L.mapbox.accessToken
     console.log(typeof($scope.trail.directions))
     if( typeof($scope.trail.directions) == 'undefined' ){
      var request = $http.get(requestString);
      request.success(function(data, status){
        Trails.setDirections(data);
        $scope.drawPolylineRoute(data, map);
      })
     } 
     else {
        $scope.drawPolylineRoute($scope.trail.directions, map);
     }
    })();
  });
})

.controller('RouteCtrl', function($scope, $stateParams, Trails) {
  console.log($scope.steps = $scope.trail.directions.routes[0].steps)

})

.controller('LandmarkCtrl', function($scope, $stateParams, $rootScope, Trails) {
  $scope.landmarks = Trails.get(Trails.getCurrent()).points;
  $scope.cardOpen = false;
  $scope.cardId = false;
  $scope.showCard = function(id) {
    $scope.cardOpen = true;
    $scope.cardId = id;
  };
  $scope.closeCard = function() {
    $scope.cardOpen = false;
    $scope.cardId = false;
  }
})

.controller('CompassCtrl', function($scope, $stateParams, $http, Trails, geolocation) {
  $scope.currentStep = 0
  $scope.waypoints = Trails.get($stateParams.trailId)

  geolocation.watchPosition(function(position) {
    $scope.position = position.coords;
  })

  // TODO: How do we actually get Cordova's compass object in here??
  compass.watchHeading(function(heading) {
    $scope.heading = heading.magneticHeading;
  })

  $scope.currentWaypoint = function() {
    return $scope.waypoints[$scope.currentStep]
  }

  $scope.absoluteAngle = function() {
    var dLon = $scope.currentWaypoint.longitude - $scope.position.longitude
    var y = Math.sin(dLon) * Math.cos($scope.currentWaypoint.latitude);
    var x = Math.cos($scope.position.latitude) * Math.sin($scope.currentWaypoint.latitude)
            - Math.sin($scope.position.latitude) * Math.cos($scope.currentWaypoint.latitude) * Math.cos(dLon);
    var brng = Math.atan2(y, x);
    brng = brng * 180 / Math.PI;
    brng = (brng + 360) % 360;
    brng = 360 - brng;
    return brng
  }

  $scope.angle = function() {
    // TODO: actually try what equation is needed here. I'm not sure :/
    return $scope.absoluteAngle - $scope.heading
  }

  $scope.compassFaceStyle = function() {
    return "transform: rotate(" + $scope.angle + "deg)";
  }
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
