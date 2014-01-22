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


            var isPrice = (attrs['type'] == 'price') ? true : false;

            console.log(attrs['type']);
            console.log(scope.data);

            nv.addGraph(function() {  

              var chart = nv.models.lineChart();

              if(isPrice){

                chart.xAxis
                .axisLabel('Date')
                .tickFormat(function(d) {
                  return d3.time.format('%x')(new Date(d));
                });
                
                chart.yAxis
                .axisLabel('Price ($)')
                .tickFormat(d3.format('.2f'));
              } else {

                chart.xAxis
                .axisLabel('Date')
                .tickFormat(function(d) {
                  return d3.time.format('%x')(new Date(d));
                });

                chart.yAxis
                .axisLabel('Performance (%)')
                .tickFormat(d3.format('.2f'));
              }

              d3.select('#chart svg')
              .datum(scope.data)
              .transition().duration(500)
              .call(chart);

              nv.utils.windowResize(function() { d3.select('#chart svg').call(chart) });

              //change graph as new data arrives
              scope.$watch('data', function(newData) {

                console.log('reloading', newData);

                if(newData){

                  formatData = formatChartData(newData);

                  //format new Data replacing day of year with date
                  console.log('formated',formatData)

                  var result =  d3.select('#chart svg')
                    .datum(formatData)
                    .transition().duration(500)
                    .call(chart);
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
}]).
directive('autoFocus', function($timeout) {
  return {
      restrict: 'AC',
      link: function(_scope, _element) {
          $timeout(function(){
              _element[0].focus();
          }, 0);
      }
  }
});

function formatChartData(data){

  //weekdays at 2014 jan 01
  var firstDays = weekday(new Date(2014, 0, 16, 0, 0, 0, 0));
  console.log(firstDays);

  //for each date as weekday of year, convert to date
  for (var i = data.length - 1; i >= 0; i--) {
    for (var k = data[i].values.length - 1; k >= 0; k--) {
      console.log(data[i].values[k].x);
      data[i].values[k].x = weekday.invert(data[i].values[k].x + firstDays);
      console.log(data[i].values[k]);
    };
  };

  return data;
}

weekday = (function() {
 
// Returns the weekday number for the given date relative to January 1, 1970.
function weekday(date) {
  var weekdays = weekdayOfYear(date),
      year = date.getFullYear();
  while (--year >= 1970) weekdays += weekdaysInYear(year);
  return weekdays;
}
 
// Returns the date for the specified weekday number relative to January 1, 1970.
weekday.invert = function(weekdays) {
  var year = 1970,
      yearWeekdays;
 
  // Compute the year.
  while ((yearWeekdays = weekdaysInYear(year)) <= weekdays) {
    ++year;
    weekdays -= yearWeekdays;
  }
 
  // Compute the date from the remaining weekdays.
  var days = weekdays % 5,
      day0 = ((new Date(year, 0, 1)).getDay() + 6) % 7;
  if (day0 + days > 4) days += 2;
  return new Date(year, 0, (weekdays / 5 | 0) * 7 + days + 1);
};
 
// Returns the number of weekdays in the specified year.
function weekdaysInYear(year) {
  return weekdayOfYear(new Date(year, 11, 31)) + 1;
}
 
// Returns the weekday number for the given date relative to the start of the year.
function weekdayOfYear(date) {
  var days = d3.time.dayOfYear(date),
      weeks = days / 7 | 0,
      day0 = (d3.time.year(date).getDay() + 6) % 7,
      day1 = day0 + days - weeks * 7;
  return Math.max(0, days - weeks * 2
      - (day0 <= 5 && day1 >= 5 || day0 <= 12 && day1 >= 12) // extra saturday
      - (day0 <= 6 && day1 >= 6 || day0 <= 13 && day1 >= 13)); // extra sunday
}
 
return weekday;
 
})();