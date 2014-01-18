'use strict';

/* Controllers */

var bettyControllers  = angular.module('bettyControllers', []);

//show n by 3 rows of all bets with current prices
bettyControllers.controller('OverviewCtrl', ['$scope', 'Bet',
	function($scope, Bet) {

		//gets array of all bets
		$scope.bets = Bet.query();
  	}]);

//portfolio - list all bets with prices for player
bettyControllers.controller('PlayerCtrl',  ['$scope', '$routeParams',  'Player',
	function($scope,$routeParams, Player) {

		//get all the player specific bets 
		$scope.player = Player.get({playerId:$routeParams.playerId});
  	}]);

//betting page with chart and modifications
bettyControllers.controller('BetCtrl',  ['$scope', '$routeParams', 'Bet', 'Quote',
	function($scope,$routeParams, Bet, Quote) {

		//get specific bet history 
		$scope.bet = Bet.get({tickerId:$routeParams.tickerId});
		//get quote for chart
		$scope.quote = Quote.get({tickerId:$routeParams.tickerId});

		$scope.myData = [10,20,30,40,60];
  	}]);

//quote page with search and chart
bettyControllers.controller('QuoteCtrl', ['$scope', '$routeParams', 'Quote', 
	function($scope,$routeParams, Quote) {

		//show stock if id provided 
		if($routeParams.tickerId){
			//get stock data immediately
			$scope.quote = Quote.get({tickerId:$routeParams.tickerId});
			//put ticker inside search field
			$scope.query = $routeParams.tickerId;
		}

		//called on input submission
		$scope.getStock = function(tickerId) {
			//ticker Id should always be equal to $scope.query
	      	$scope.quote = Quote.get({tickerId:tickerId});
	    }
  	}]);
