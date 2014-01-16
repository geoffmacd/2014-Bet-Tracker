'use strict';


// Declare app level module which depends on filters, and services
angular.module('betty', [
  'ngRoute',
  'bettyFilters',
  'bettyServices',
  'bettyControllers'
  'bettyAnimations'
]).
config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/overview', {
        templateUrl: 'partials/overview.html',
        controller: 'OverviewCtrl'
      }).
      when('/portfolio/:playerId', {
        templateUrl: 'partials/portfolio.html',
        controller: 'PlayerCtrl'
      }).
      when('/modify/:betId', {
        templateUrl: 'partials/bet.html',
        controller: 'BetCtrl'
      }).
      when('/quote/:tickerId', {
        templateUrl: 'partials/quote.html',
        controller: 'QuoteCtrl'
      }).
      when('/quote', {
        templateUrl: 'partials/quote.html',
        controller: 'QuoteCtrl'
      }).
      otherwise({
        redirectTo: '/overview'
      });
  }]);
