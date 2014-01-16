'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var betService = angular.module('bettyServices', ['ngResource']);

betService.factory('Bet', ['$resource',
  function($resource){
    return $resource('bet/:betId.json', {}, {
      query: {method:'GET'}
    });
  }]);

betService.factory('Quote', ['$resource',
  function($resource){
    return $resource('quote/:tickerId.json', {}, {
      query: {method:'GET'}
    });
  }]);

betService.factory('Player', ['$resource',
  function($resource){
    return $resource('player/:playerId.json', {}, {
      query: {method:'GET'}
    });
  }]);

