var stockApp = angular.module('stockApp', ['ngRoute', 'ngAnimate', 'chart.js']);
// Get the context of the canvas element we want to select
var lastTradePrice = 0;
var yearHigh = 0;
var yearLow = 0;
var peRatio = 0;
var averagePE = 0;
var dividendYield = 0;
var companySymbol = 0;
//main controller
stockApp.controller('mainCtrl', function ($scope, $http) {
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
        $http.get("https://api.import.io/store/data/e4d56e36-707f-4dd0-a1f8-8e116b1d2630/_query?input/webpage/url=http%3A%2F%2Fbiz.yahoo.com%2Fp%2F314conameu.html%23" + $scope.inputText + "&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
        .success(function(response) {
          if(response.query.results.quote.Name != null){
          $scope.quoteVisibility = true;
          $scope.stock = response.query.results.quote;
          companySymbol = $scope.inputText;
          lastTradePrice = 4;
          yearHigh = 3;
          yearLow = 2;
          peRatio = 1;
          dividendYield = 0;
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
      when('/cashflow', {
        templateUrl: 'pages/cashflow.html'
      }).
      when('/ownership', {
        templateUrl: 'pages/ownership.html'
      }).
      when('/reportcard', {
        templateUrl: 'pages/reportcard.html'
      })
  }]);

