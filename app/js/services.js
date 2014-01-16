'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
var betService = angular.module('betty.services', [['ngResource']);

betService.factory('Bet', ['$resource',
  function($resource){
    return $resource('bet/:betId.json', {}, {
      query: {method:'GET', params:{betId:'phones'}, isArray:true}
    });
  }]);

betService.factory('Quote', ['$resource',
  function($resource){
    return $resource('quote/:ticker.json', {}, {
      query: {method:'GET', params:{ticker:'phones'}, isArray:true}
    });
  }]);

betService.factory('Quote', ['$resource',
  function($resource){
    return $resource('quote/:ticker.json', {}, {
      query: {method:'GET', params:{ticker:'phones'}, isArray:true}
    });
  }]);

