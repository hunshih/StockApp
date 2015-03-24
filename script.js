var stockApp = angular.module('stockApp', ['ngRoute', 'ngAnimate', 'chart.js']);
// Get the context of the canvas element we want to select
var lastTradePrice = 0;
var yearHigh = 0;
var yearLow = 0;
var peRatio = 0;
var dividendYield = 0;
var companySymbol = 0;
//main controller
stockApp.controller('mainCtrl', function($scope, $http){
});

stockApp.controller('ratioCtrl', function($scope, $http){

  $scope.corners =["Price", "Year High", "Year Low", "PE Ratio", "Dividend Yield", "Test3", "Test4"];
  $scope.ChartData = [
  [lastTradePrice, yearHigh, yearLow, peRatio, dividendYield, 0, 0]
  ];

  $scope.search = function(keyEvent) {
  if (keyEvent.which === 13)
    $scope.showStock();
  };
  $scope.quoteVisibility = false;
    $scope.showStock = function(){
        $http.get("https://query.yahooapis.com/v1/public/yql?q=select * from yahoo.finance.quotes where symbol in (%22" + $scope.inputText + "%22)&format=json&diagnostics=true&env=store://datatables.org/alltableswithkeys&callback=")
        .success(function(response) {
          if(response.query.results.quote.Name != null){
          $scope.quoteVisibility = true;
          $scope.stock = response.query.results.quote;
          $scope.result = response;
          companySymbol = $scope.inputText;
          lastTradePrice = response.query.results.quote.LastTradePriceOnly;
          yearHigh = response.query.results.quote.YearHigh;
          yearLow = response.query.results.quote.YearLow;
          peRatio = response.query.results.quote.PERatio;
          dividendYield = response.query.results.quote.DividendYield;
          $scope.ChartData = [
            [lastTradePrice, yearHigh, yearLow, peRatio, dividendYield, 0, 0]
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
});

stockApp.controller('cashCtrl', function($scope, $http){
  $http.get("https://api.import.io/store/data/4924b7de-9b92-4bde-aff7-6e19475e01f1/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fcf%3Fs%3D"+ companySymbol +"%26quarterly&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
          .success(function(response) {
            $scope.netIncome = response.results[1].sep302014_value;
            $scope.operatingActivities = response.results[9].sep302014_value;
            $scope.investingActivities = response.results[14].sep302014_value;
            $scope.financeActivities = response.results[20].sep302014_value;

            })
});

stockApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/', {
        templateUrl: 'pages/ratio.html'
      }).
      when('/cash', {
        templateUrl: 'pages/ice.html'
      }).
      when('/stewardship', {
        templateUrl: 'pages/mountain.html'
      })
  }]);