'use strict';

/* Controllers */

var bettyControllers  = angular.module('bettyControllers', []);

//scores - shows top 3 in divs and graph of each players performance
bettyControllers.controller('StandingsCtrl', ['$scope', 'Player',
	function($scope, Player) {

		//chart
		$scope.myData = [];

		//gets array of all players
		$scope.players = Player.query();

		$scope.players.$promise.then(function(result){
			$scope.players = result;
			if(result){
				console.log(result);

				//get chart and names
				var d = [],
					n = [];

				//color scale
				var colorScale = d3.scale.linear()
				    .domain([-50,50])
				    .range(["red", "green"]);

				for (var i = 0; i < result.length; i++) {
					d.push(result[i].chart);
					n.push(result[i].name);

					for(var k = 0; k < result[i].tickers.length; k++){
						result[i].tickers[k].color = colorScale(result[i].tickers[k].performance);
					}
				};

				//show chart
				$scope.myData = seriesArray(d,n);
			} else {
				$scope.myData = null;
			}
		});


  	}]);

//no portfolio, select to see
bettyControllers.controller('NoPortfolioCtrl', ['$scope', 'Player',
	function($scope, Player) {


		//gets array of all players
		$scope.players = Player.query();

		$scope.players.$promise.then(function(result){
			$scope.players = result;

			if(result){
				console.log(result);

				//color scale
				var colorScale = d3.scale.linear()
				    .domain([-50,50])
				    .range(["red", "green"]);

				for (var i = 0; i < result.length; i++) {
					//colorize tickers
					for(var k = 0; k < result[i].tickers.length; k++){
						result[i].tickers[k].color = colorScale(result[i].tickers[k].performance);
					}
				}
			}
		});
  	}]);

//portfolio - list all bets with prices for player and performance with possible parameter
bettyControllers.controller('PortfolioCtrl',  ['$scope', '$routeParams',  'Player', 'Quote', 
	function($scope,$routeParams, Player, Quote) {

		//chart
		$scope.myData = [];

		//get the player 
		$scope.player = Player.get({playerId:$routeParams.playerId});

		//show the chart when player comes in
		$scope.player.$promise.then(function(result){
			$scope.player = result;

			if(result){
				console.log(result);

				//color scale
				var colorScale = d3.scale.linear()
				    .domain([-50,50])
				    .range(["red", "green"]);

				//get chart and names
				var d = [],
					n = [];

				for (var i = 0; i < result.tickers.length; i++) {
					d.push(result.tickers[i].chart);
					n.push(result.tickers[i].ticker);
					//colorize tickers

					result.tickers[i].color = colorScale(result.tickers[i].performance);
				};

				result.color = colorScale(result.performance);

				//show chart
				$scope.myData = seriesArray(d,n);
			} else {
				$scope.myData = null;
			}
		});

  	}]);

//quote page with search and chart with possible parameter
bettyControllers.controller('QuoteCtrl', ['$scope', '$routeParams', 'Quote', 
	function($scope,$routeParams, Quote) {

		//chart
		$scope.myData = [];

		//show stock if id provided 
		if($routeParams.tickerId){
			//get stock data immediately
			$scope.quote = Quote.get({tickerId:$routeParams.tickerId}).$promise.then(showChart);
			//put ticker inside search field
			$scope.query = $routeParams.tickerId;
		}

		//called on input submission
		$scope.getStock = function(tickerId) {
			//reset chart
			$scope.myData = null;
			$scope.quote = null;
			//ticker Id should always be equal to $scope.query, only try if it exists
			if(tickerId.length)
	      		$scope.quote = Quote.get({tickerId:tickerId}).$promise.then(showChart);
	    }

	    function showChart(result){
				$scope.quote = result;

				if(result){
					console.log(result);
					$scope.myData = seriesArray([result.chart],[result.ticker]);
				} 
			}

  	}]);


function seriesArray(d,names){

	var a = [],
		c = [];
    var p = d3.scale.category10().domain(d3.range(10));

	for (var i = 0; i < d.length; i++) {
		a.push([]);
	};
   
    for (var i = 0; i < d.length; i++) {

    	for (var k = 0; k < d[i].length; k++) {
        	a[i].push({x: k, y: d[i][k]});
    	}

    	//assign color
		if(d.length > 1){
			c.push(p(i));
		} else {
			c.push('#ff7f0e');
		}
    }
   
    var k = [];



	for (var i = 0; i < d.length; i++) {
		k.push({
	     values: a[i],
	     key: names[i],
	     color: c[i]
	  });
	};

	console.log(k);

	return k;
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