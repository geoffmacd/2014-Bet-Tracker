'use strict';


// Declare app level module which depends on filters, and services
angular.module('betty', [
  'ngRoute',
  'betty.filters',
  'betty.services',
  'betty.directives',
  'betty.controllers'
]).
config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/overview', {
        templateUrl: 'partials/overview.html',
        controller: 'OverviewCtrl'
      }).
      when('/portfolio', {
        templateUrl: 'partials/player.html',
        controller: 'PlayerCtrl'
      }).
      when('/modify/:tickerId', {
        templateUrl: 'partials/bet.html',
        controller: 'BetCtrl'
      }).
      when('/quote', {
        templateUrl: 'partials/quote.html',
        controller: 'QuoteCtrl'
      }).
      otherwise({
        redirectTo: '/overview'
      });
  }]);
