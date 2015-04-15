var stockApp = angular.module('stockApp', ['ngRoute', 'ngAnimate', 'chart.js']);
// Get the context of the canvas element we want to select
var lastTradePrice = 0;
var yearHigh = 0;
var yearLow = 0;
var peRatio = 0;
var operationMargin = 0;
var averagePE = 0;
var dividendYield = 0;
var companySymbol = 0;
var industryPE = 0;
var industryNetMargin = 0;
var industryLink;

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
      {
        $scope.getLinks();
        //$scope.getIndustryNumbers();
        //$scope.showStock();
      }
  };
  $scope.quoteVisibility = false;
    $scope.getLinks = function(){
        $http.get("https://api.import.io/store/data/02134541-f2f4-4526-82ca-df3fa62307f6/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fin%3Fs%3D" + $scope.inputText + "%2BIndustry&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
            .success(function(response) {
            //alert(response.results[0].industry);
            industryLink = response.results[0].industry;
            $scope.industry = industryLink;
            $scope.getIndustryNumbers();
          }).
        error(function() {
          
        });
    };
    $scope.getIndustryNumbers = function(){
        $http.get("https://api.import.io/store/data/3fd67b00-2b9b-4a23-9b0f-eafa74f90d0f/_query?input/webpage/url=" + industryLink + "&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
            .success(function(response) {
            //alert(response);
            $scope.stats = response;
            industryPE = response.results[0].pe;
            industryNetMargin = response.results[0].netprofitmargin;
            $scope.averagePE = industryPE;
            $scope.averageMargin = industryNetMargin;
            $scope.showStock();
          }).
        error(function() {
          
        });
    };
    $scope.showStock = function(){
        $http.get("https://api.import.io/store/data/d53a442a-94ef-45b8-acd7-d2bcac37b007/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fks%3Fs%3D" + $scope.inputText + "%2BKey%2BStatistics&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
        .success(function(response) {
        //alert("hi")
          $scope.quoteVisibility = true;
          companySymbol = $scope.inputText;
          $scope.symbol = companySymbol;
          
          lastTradePrice = 4;
          yearHigh = 3;
          yearLow = 2;
          peRatio = response.results[0].pe;
          $scope.peRatio = peRatio;
          operationMargin = response.results[0].operationmargin;
          $scope.margin = operationMargin;
          var presentPE = (industryPE / peRatio).toPrecision(3);
          dividendYield = 0;
          $scope.ChartData = [
            [lastTradePrice, yearHigh, yearLow, presentPE, dividendYield, 0, 0]
                              ];
          }).
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

