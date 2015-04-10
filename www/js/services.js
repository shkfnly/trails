angular.module('starter.services', [])
.factory('Trails', function($http) {
  var currentTrail = 0;
  var trails = [{
    id: 0,
    image: 'https://file.ac/prLxFbb06Fo/national_forest.png',
    name: 'Tenderloin National Forest Trailhead',
    desc: 'A trail of different green infrastructure projects and art installations.',
    type: 'environment',
    points: [{
      id: 5,
      name: 'The Luggage Store Gallery',
      lat: 37.782008,
      lon: -122.4103,
      desc: 'Art Galley and Exhibition Space',
      img: 'https://file.ac/QTBQAjWVTyc/the_luggage_store.jpg'
    }, {
      id: 1,
      name: 'Glide Graze the Roof',
      lat: 37.785193,
      lon: -122.411565,
      desc: 'This edible roof-top garden uses light-weight garden beds, a worm composting system, beehives, and an educational mural to produce food and act as a community resource. Volunteers maintain the garden and host monthly workshops and tours',
      img: 'https://file.ac/H0TThYy333s/graze_the_roof.jpg'
    }, {
      id: 0, 
      name: 'Tenderloin National Forest',
      lat: 37.784430,
      lon: -122.414966,
      desc: 'Since 1989, lead artists Darryl Smith and Laurie Lazer, of the Luggage Store Gallery, have worked to transform Cohen Alley into a vibrant community commons where people of all ages gather for art performances, classes and activities.',
      img: 'https://file.ac/rNct7AI-brQ/tnf.jpg'
    }, {
      id: 4,
      name: 'True Compassion',
      lat: 37.782047,
      lon: -122.415467,
      desc:  'True Compassion is a living mural & video project facilitated by Evan Bissell with Larkin Street Youth Services. During a 12 week period, a rotating group of 40 youth created sculptures, stencils, drawings and paintings. They interviewed each other and walked the Tenderloin, examining different meanings of compassion, portraiture & symbolism.',
      img: 'https://file.ac/S0qfpo-aTA0/true_compassion.jpg'
    }, {
      id: 3,
      name: 'Tutubi Plaza',
      lat: 37.779583,
      lon: -122.409136,
      desc: 'Tutubi Plaza offers a break from the stimulus filled nearby Market and Mission Streets. It features a street mural and seating.',
      img: 'https://file.ac/nVUkMxZR1XA/tutubi_plaza.jpg'
    },   {
      id: 6,
      name: 'The 5Ws @ 5M',
      lat: 37.782075,
      lon: -122.407119,
      desc: 'Named after Who, What, Where, When, and Why, the “5Ws” at “5M” (5th & Mission) is a collection of chalkboards mounted on the Chronicle Building that invite neighbors and visitors to share reactions on the places & paths we frequent their meaning to us',
      img: 'https://file.ac/GzcecsQU2TI/5ws_5m.jpg'
    }, {
      id: 7,
      name: 'Intersection for the Arts',
      lat: 37.782619,
      lon: -122.406589,
      desc: 'Arts Nonprofit',
      img: 'https://file.ac/JCKx6bERPtw/intersection_logo_white.jpg'
    }]
  }, {
    id: 1,
    image: 'https://file.ac/1Z2QiUhZerM/ZIOMural-SanFranciscoCA.png',
    name: 'Murals',
    desc: 'Urban art featured during the Urban Prototyping Festival',
    type: 'art',
    points: [{
      id: 3,
      name: 'Endless Canvas',
      lat: 37.778129,
      lon: -122.412356,
      desc: 'Artist: Zio Ziegler',
      img: 'https://file.ac/1Z2QiUhZerM/ZIOMural-SanFranciscoCA.png',
      year: '2013'
    }, {
      id: 4,
      name: 'Rotten Apples',
      lat: 37.783148,
      lon: -122.418996,
      desc: 'Artist: Aryz',
      img: 'https://file.ac/y20uzRyY7Go/IMG_5818.png',
      year: '2013'
    }, { 
      id: 5,
      name: 'Queer Trans Spaces',
      lat: 37.784690,
      lon: -122.412754,
      desc: 'Artist: Xara Thustra',
      img: 'https://file.ac/oDGdVYiG7-U/IMG_0066.png',
      year: '2015'
    }, {
      id: 6,
      name: 'Untitled',
      lat: 37.782009,
      lon: -122.410454,
      desc: 'Artist: Mike Maka aka Makatron',
      img: 'https://file.ac/NN6VrndhAu0/IMG_0236.png',
      year: '2015'
    }]
  }];

  return {
    all: function() {
      return trails;
    },
    filtered: function(type){
      var result = [];
      angular.forEach(trails, function(trail){
        if(trail.type === type){
          result.push(trail);
        }
      });
      return result;
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
    setDirections: function(obj){
      this.get(this.getCurrent()).directions = obj;
    },

    getLandmarks: function(){
      var landmarks = [];

      angular.forEach(this.get(this.getCurrent()).points, function(point){
        landmarks.push([point.lon, point.lat])
      });
      return landmarks;
    },

    fetchDirections: function(accessToken, map, callback){
      var that = this;
      var requestString = 'https://api.tiles.mapbox.com/v4/directions/mapbox.walking/' + this.getLandmarks().join(';') + '.json?access_token=' + accessToken
      var request = $http.get(requestString);
      request.success(function(data, status){
        that.setDirections(data);
        if(callback){
          callback(data, map)
        }
        return data;
      })
    },
    metaDirections: function(accessToken, map, callback){
      if( typeof(this.get(this.getCurrent()).directions) == 'undefined' ){
        if(callback){
          this.fetchDirections(accessToken, map, callback);
        }
        
      } else {
        return callback(this.get(this.getCurrent()).directions, map);
      }
    }
  };
})