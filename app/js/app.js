'use strict';


// Declare app level module which depends on filters, and services
angular.module('betty', [
  'ngRoute',
  'bettyFilters',
  'bettyServices',
  'bettyControllers',
  'bettyDirectives'
]).
config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/home', {
        templateUrl: 'partials/home.html',
        controller: 'OverviewCtrl'
      }).
      when('/portfolio/:playerId', {
        templateUrl: 'partials/portfolio.html',
        controller: 'PlayerCtrl'
      }).
      when('/bet/:tickerId', {
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
        redirectTo: '/home'
      });
  }
]);
