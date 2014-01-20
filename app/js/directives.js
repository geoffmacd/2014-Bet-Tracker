var betDirectives = angular.module('bettyDirectives',[]);

betDirectives.directive('stockChart', function ($parse) {
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

            console.log(scope.data);

            nv.addGraph(function() {  
              var chart = nv.models.lineChart();

              chart.xAxis
              .axisLabel('Date')
              .tickFormat(d3.format(',r'));

              chart.yAxis
              .axisLabel('Performance (%)')
              .tickFormat(d3.format('.0f'));

              d3.select('#chart svg')
              .datum(scope.data)
              .transition().duration(500)
              .call(chart);

              nv.utils.windowResize(function() { d3.select('#chart svg').call(chart) });

              //change graph as new data arrives
              scope.$watch('data', function(newData) {

                console.log('reloading' + newData);

                if(newData){
                  var result =   d3.select('#chart svg')
                  .datum(newData)
                  .transition().duration(500)
                  .call(chart);
                console.log(result);  
                } else {
                  //remove and replace with text
                  d3.select('#chart svg g').remove();
                  d3.select('#chart svg')
                    .datum([])
                    .transition().duration(500)
                    .call(chart);
                  }
              });

              return chart;
            });
         } 
      };


      return directiveDefinitionObject;
}).
directive('activeLink', ['$location', function(location) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs, controller) {
            var clazz = attrs.activeLink;
            var path = attrs.href;
            path = path.split('/'); //always includes first slash
            scope.location = location;
            console.log(path[1]);
            scope.$watch('location.path()', function(newPath) {
                newPath = newPath.split('/'); //always includes first slash
                console.log(path[1]);
                console.log(newPath[1]);
                if (path[1] === newPath[1]) {
                    element.parent().addClass(clazz);
                } else {
                    element.parent().removeClass(clazz);
                }
            });
        }

    };
}]);