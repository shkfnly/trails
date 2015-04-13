angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $rootScope, $location, Trails) {
  $scope.trails = Trails.all();
  $scope.go = function ( path ) {
    $location.path( path );
  };
})
.controller('TrailListCtrl', function($scope, $rootScope, $stateParams, Trails) {
  if($stateParams.trailFilter){
    $scope.trails = Trails.filtered($stateParams.trailFilter)
  } else {
    $scope.trails = Trails.all();
  }
})
.controller('TrailCtrl', function($scope, $stateParams, Trails){
  $scope.trailId = $stateParams.trailID
  $scope.trail = Trails.get($stateParams.trailID);
  Trails.setCurrent($stateParams.trailID);
  var L = window.L;
  L.mapbox.accessToken = 'pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg';
})

.controller('MapCtrl', function($scope, $rootScope, $stateParams, $http, Trails, geolocation, leafletData) {
  angular.extend($scope, {
    defaults: {
      tileLayer: 'https://api.tiles.mapbox.com/v4/urbinsight.l906cd2j/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg',
      maxZoom: 18,
      scrollWheelZoom: true,
      panControl: true
    },
    center: {
      lat: 37.7833,
      lng: -122.4167,
      zoom: 15
    }
  });
  
  var mapID = 'map' + $stateParams.trailID;

  $scope.drawPolylineRoute = function(data, map){
    var polylinePoints = []
    angular.forEach(data.routes[0].geometry.coordinates, function(lonLat){
      polylinePoints.push([lonLat[1], lonLat[0]])
    });
    var polyline = L.polyline(polylinePoints, {color: 'teal', opacity: 1, weight: 10});
    polyline.addTo(map);
    map.panInsideBounds(polyline.getBounds());
    map.dragging.enable();
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

    // Retrieve waypoints from angular services.
      var markerHolder = {};
      angular.forEach($scope.trail.points, function(point){
        markerHolder[point.name] = {
          lat: point.lat,
          lng: point.lon,
          message: [
           '<h2 style="width: 100%; text-align: center;">' + point.name + '</h2>',
            '<img style="width: 250px; display: block; margin: 0 auto;" src="' + point.img + '">',
            '<p>' + point.desc + '</p>'
          ].join(""),
          focus: false,
          draggable: false
        }
      });
      angular.extend($scope, {
        markers: markerHolder
      });

    // Retrieves the directions from the Mapbox API and then draws the route.
    ($scope.drawRoute = function(map) {
      Trails.metaDirections(L.mapbox.accessToken, map, $scope.drawPolylineRoute);
    })(map);
  });
})

.controller('RouteCtrl', function($scope, $stateParams, Trails) {
  Trails.metaDirections(L.mapbox.accessToken, {}, function(data){
    var holder = data.routes[0].steps;
    angular.forEach(holder, function(step){
      step.maneuver.type = step.maneuver.type.replace(/\s+/g, '-').toLowerCase()
    });
    $scope.steps = holder
  });
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
