'use strict';

/* Controllers */

var bettyControllers  = angular.module('bettyControllers', []);

//show n by 3 rows of all bets with current prices
bettyControllers.controller('OverviewCtrl', ['$scope', 'Bet', 'Player', 'Quote'
	function($scope, Bet, Player, Quote) {
		//gets array with list of 3
		$scope.bets = Bet.query();
  	}]);

//portfolio - list all bets with prices for player
bettyControllers.controller('PlayerCtrl',  ['$scope', '$routeParams', 'Bet', 'Player', 'Quote'
	function($scope,$routeParams, Bet, Player, Quote) {
		$scope.bets = Bet.query();
  	}]);

//betting page with chart and modifications
bettyControllers.controller('BetCtrl',  ['$scope', '$routeParams', 'Bet', 'Player', 'Quote'
	function($scope,$routeParams, Bet, Player, Quote) {
		$scope.bets = Bet.query();
  	}]);

//quote page with search and chart
bettyControllers.controller('QuoteCtrl', ['$scope', '$routeParams', 'Quote', 
	function($scope,$routeParams, Quote) {

		//show stock if id provided 
		if($routeParams.tickerId){

			$scope.stock = Quote.get({tickerId:$routeParams.tickerId});

		}

		$scope.getStock = function(tickerId) {
			//ticker Id should always be equal to $scope.query
	      $scope.stock = Quote.get({tickerId:tickerId});
	    }
  	}]);
