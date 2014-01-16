'use strict';

/* Controllers */

angular.module('betty.controllers', []).
  controller('OverviewCtrl', [function() {
	$http({method: 'GET', url: '/overview'}).
		success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		});
  }])
  .controller('PlayerCtrl', [function() {
  	
	$http({method: 'GET', url: '/portfolio'}).
		success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		});
  }])
  .controller('BetCtrl', [function() {
	$http({method: 'GET', url: '/portfolio'}).
		success(function(data, status, headers, config) {
		// this callback will be called asynchronously
		// when the response is available
		}).
		error(function(data, status, headers, config) {
		// called asynchronously if an error occurs
		// or server returns response with an error status.
		});
  }])
  .controller('QuoteCtrl', [function() {

  }]);
