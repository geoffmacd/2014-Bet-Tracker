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
      when('/standings', {
        templateUrl: 'static/partials/standings.html',
        controller: 'StandingsCtrl'
      }).
      when('/portfolio/:playerId', {
        templateUrl: 'static/partials/aportfolio.html',
        controller: 'PortfolioCtrl'
      }).
      when('/portfolio', {
        templateUrl: 'static/partials/portfolio.html',
        controller: 'NoPortfolioCtrl'
      }).
      when('/quote/:tickerId', {
        templateUrl: 'static/partials/quote.html',
        controller: 'QuoteCtrl'
      }).
      when('/quote', {
        templateUrl: 'static/partials/quote.html',
        controller: 'QuoteCtrl'
      }).
      otherwise({
        redirectTo: '/standings'
      });
  }
]);
