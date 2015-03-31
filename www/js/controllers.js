angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, Trails) {
  $scope.trails = Trails.all();
})

.controller('TrailCtrl', function($scope, $stateParams, Trails) {
  $scope.trail = Trails.get($stateParams.trailId);
  $scope.addMap = function(){
    var L = window.L;
    L.mapbox.accessToken = 'pk.eyJ1IjoidXJiaW5zaWdodCIsImEiOiJIbG1xUDBBIn0.o2RgJkl1-wCO7yyG7Khlzg'
    $scope.map = L.mapbox.map('map', 'urbinsight.l906cd2j').setView([37.7833, -122.4167], 15);	
  };
  $scope.addMap();
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
