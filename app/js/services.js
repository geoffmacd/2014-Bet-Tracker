'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var betService = angular.module('bettyServices', ['ngResource']);

betService.factory('Bet', ['$resource',
  function($resource){
    return $resource('data/bet:tickerId.json', {}, {});
  }]);

betService.factory('Quote', ['$resource',
  function($resource){
    return $resource('data/quote:tickerId.json', {}, {});
  }]);

betService.factory('Player', ['$resource',
  function($resource){
    return $resource('data/player:playerId.json', {}, {});
  }]);

