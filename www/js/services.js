angular.module('starter.services', [])
.factory('Trails', function() {
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
    points: [{
      name: 'Ashoka',
      lat: 37.784430,
      lon: -122.414966
    }, {
      name: 'Nick',
      lat: 37.785193,
      lon: -122.411565
    }, { 
      name: 'Nickosha',
      lat: 37.784438,
      lon: -122.409913
    }
]
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
    }
  };
})