'use strict';


// Declare app level module which depends on filters, and services
angular.module('betty', [
  'ngRoute',
  'bettyFilters',
  'bettyServices',
  'bettyControllers'
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
        redirectTo: '/overview'
      });
  }
]).
directive('barsChart', function ($parse) {
     //explicitly creating a directive definition variable
     //this may look verbose but is good for clarification purposes
     //in real life you'd want to simply return the object {...}
     var directiveDefinitionObject = {
         //We restrict its use to an element
         //as usually  <bars-chart> is semantically
         //more understandable
         restrict: 'E',
         //this is important,
         //we don't want to overwrite our directive declaration
         //in the HTML mark-up
         replace: false,
         //our data source would be an array
         //passed thru chart-data attribute
         scope: {data: '=chartData'},
         link: function (scope, element, attrs) {
           //in D3, any selection[0] contains the group
           //selection[0][0] is the DOM node
           //but we won't need that this time
           // var chart = d3.select(element[0]);
           // //to our original directive markup bars-chart
           // //we add a div with out chart stling and bind each
           // //data entry to the chart
           //  chart.append("div").attr("class", "chart")
           //   .selectAll('div')
           //   .data(scope.data).enter().append("div")
           //   .transition().ease("elastic")
           //   .style("width", function(d) { return d + "%"; })
           //   .text(function(d) { return d + "%"; });
           // //a little of magic: setting it's width based
           // //on the data value (d) 
           // //and text all with a smooth transition

           console.log(scope.data);


        nv.addGraph(function() {  
          var chart = nv.models.lineChart();

          chart.xAxis
          .axisLabel('Time (ms)')
          .tickFormat(d3.format(',r'));

          chart.yAxis
          .axisLabel('Voltage (v)')
          .tickFormat(d3.format('.02f'));

          d3.select('#chart svg')
          .datum(sinAndCos)
          .transition().duration(500)
          .call(chart);

          nv.utils.windowResize(function() { d3.select('#chart svg').call(chart) });

          return chart;
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



         } 
      };
      return directiveDefinitionObject;
});
