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

		$scope.myData = [];
	    $scope.$watch('quote.price', function() {

		   if($scope.quote.price > 0){
		   		//alert('found');
				$scope.myData = compileSeries();
		   } else {
		   		console.log('none');
				$scope.myData = [];
		   }
		});

		function compileSeries(){
			//add all bets + stock chart
			var series = [];
              var sin = [],
                  cos = [];
           
           	//add all players current bets
			for (var i = 0; i < $scope.bet.bets.length; i++) {

				series.push({
					key: $scope.bet.bets[i].name, 
					values: $scope.bet.bets[i].price,
				    color: '#ff7f0e'
				});
			}

			for (var i = 0; i < 100; i++) {
				sin.push({x: i, y: Math.sin(i/10)});
				cos.push({x: i, y: .5 * Math.cos(i/10)});
			}
              
			return sinAndCos;
		}

		function sinAndCos() {
			var sin = [],
			  cos = [];

			for (var i = 0; i < 100; i++) {
				sin.push({x: i, y: Math.sin(i/10)});
				cos.push({x: i, y: .5 * Math.cos(i/10)});
			}

			return [
			  {
			     values: sin,
			     key: 'Sine Wave',
			     color: '#ff7f0e'
			  },
			  {
			     values: cos,
			     key: 'Cosine Wave',
			    color: '#2ca02c'
			  }
			];
         }
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

		$scope.myData = [];
	    $scope.$watch('quote.price', function() {

		   if($scope.quote.price){
				$scope.myData = sinAndCos;
		   } else {
		   		console.log('none');
				$scope.myData = null;
		   }
		});

		function sinAndCos() {
              var sin = [],
                  cos = [];
           
              for (var i = 0; i < 100; i++) {
                sin.push({x: i, y: Math.sin(i/10)});
                cos.push({x: i, y: .5 * Math.cos(i/10)});
              }
           
              return [
	              {
	                 values: sin,
	                 key: 'Sine Wave',
	                 color: '#ff7f0e'
	              },
	              {
	                 values: cos,
	                 key: 'Cosine Wave',
	                color: '#2ca02c'
	              }
              ];
         }

  	}]);
