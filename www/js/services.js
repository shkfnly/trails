angular.module('starter.services', [])
.factory('Trails', function() {
  var initial = true;
  var currentTrail = 0;
  var trails = [{
    id: 0,
    image: 'https://hikinginthesmokies.files.wordpress.com/2012/09/indian-creek-trail-august-07-2012.jpg',
    name: 'Trail #1',
    desc: 'This is the first trail',
    points: [{
      name: 'Tenderloin National Forest',
      lat: 37.784430,
      lon: -122.414966
    }, {
      name: 'Glide Graze the Roof',
      lat: 37.785193,
      lon: -122.411565
    }, { 
      name: 'Tenderloin Neighborhood Development Corporation',
      lat: 37.784438,
      lon: -122.409913
    }
]
  }, {
    id: 1,
    image: 'https://az-flagstaff3.civicplus.com/images/pages/N1521/Flagstaff_Urban_Trails_and_Bikeways_Map-Sample2-2011.jpg',
    name: 'Trail #2',
    desc: 'This is the second trail',
    points: []
  }, {
    id: 2,
    image: 'http://www.travelandleisure.com/sites/default/files/styles/image_300x300/public/images/amexpub/0041/6531/201212-ss-urban-running-trails-central-park.jpg?itok=OML0PhBn',
    name: 'Trail #3',
    desc: 'This is the third trail',
    points: []
  }];

  return {
    all: function() {
      return trails;
    },
    remove: function(trails) {
      trails.splice(trails.indexOf(trail), 1);
    },
    get: function(trailId) {
      for (var i = 0; i < trails.length; i++) {
        if (trails[i].id === parseInt(trailId)) {
          return trails[i];
        }
      }
      return null;
    },
    setCurrent: function(trailId) {
      currentTrail = trailId;
    },

    getCurrent: function() {
      return currentTrail;
    },

    firstTime: function() {
      return initial;
    },

    initialized: function() {
      initial = false;
    }
  };

})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
  }, {
    id: 2,
    name: 'Andrew Jostlin',
    lastText: 'Did you get the ice cream?',
    face: 'https://pbs.twimg.com/profile_images/491274378181488640/Tti0fFVJ.jpeg'
  }, {
    id: 3,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
  }, {
    id: 4,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'https://pbs.twimg.com/profile_images/491995398135767040/ie2Z_V6e.jpeg'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
