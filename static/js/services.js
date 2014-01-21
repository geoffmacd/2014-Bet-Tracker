'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var betService = angular.module('bettyServices', ['ngResource']);

betService.factory('Quote', ['$resource',
  function($resource){
    return $resource('data/quotes/:tickerId', {}, {
      get: {method:'GET', timeout:8000}
    });
  }]);

betService.factory('Player', ['$resource',
  function($resource){
    return $resource('data/players/:playerId', {}, {});
  }]);

