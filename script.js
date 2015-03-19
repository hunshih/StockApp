var stockApp = angular.module('stockApp', ['ngRoute', 'ngAnimate', 'chart.js']);
// Get the context of the canvas element we want to select

//main controller
stockApp.controller('mainCtrl', function($scope, $http){

});

stockApp.controller('ratioCtrl', function($scope, $http){
  $scope.search = function(keyEvent) {
  if (keyEvent.which === 13)
    $scope.showStock();
  };
  $scope.quoteVisibility = false;
    $scope.showStock = function(){
        $scope.queryStock = "https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in (%22" + $scope.inputText + "%22)&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=";
        $http.get("https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in (%22" + $scope.inputText + "%22)&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=")
        .success(function(response) {
          if(response.query.results.quote.Name != null){
          $scope.quoteVisibility = true;
          $scope.stock = response.query.results.quote;
          $scope.result = response;
          $scope.ChartData = [
            [response.query.results.quote.LastTradePriceOnly, response.query.results.quote.YearHigh, response.query.results.quote.YearLow, response.query.results.quote.PERatio, response.query.results.quote.DividendYield, 0, 0]
                              ];
            }
          else{
            $scope.quoteVisibility = false;
            alert("Ticker not found!");
          }
          })
        error(function() {
          
        });
    };
    $scope.corners =["Price", "Year High", "Year Low", "PE Ratio", "Dividend Yield", "Test3", "Test4"];
    $scope.ChartData = [
    [0, 0, 0, 0, 0, 0, 0]
  ];
});

stockApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'pages/ratio.html'
      }).
      when('/ice', {
        templateUrl: 'pages/ice.html'
      }).
      when('/mountain', {
        templateUrl: 'pages/mountain.html'
      })
  }]);