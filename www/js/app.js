// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngTouch','angular-carousel', 'geolocation', 'leaflet-directive'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/nav/tabs.html"
  })
  .state('trails', {
    url: "/trails/:trailID",
    templateUrl: "templates/trails-nav/trail-tabs.html",
    controller: 'TrailCtrl'
  })
  .state('trails.landmarks', {
    url: '/landmarks',
    views: {
      'trails-landmark': {
        templateUrl: 'templates/trails-nav/landmarks.html',
        controller: 'LandmarkCtrl'
      }
    }
  })
  .state('trails.route', {
    url: '/route',
    views: {
      'trails-route': {
        templateUrl: 'templates/trails-nav/route.html',
        controller: 'RouteCtrl'
      }
    }
  })
  .state('trails.map', {
    url: '/map',
    views: {
      'trails-map': {
        templateUrl: 'templates/trails-nav/map.html',
        controller: 'MapCtrl'
      }
    }
  })
  // .state('trail.waypoint', {
  //   url: '/trail/:trailId/:pointId',
  //   templateUrl: 'templates/waypoint.html',
  //   controller: 'WaypointCtrl'
  // })

  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/nav/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');
});
