var stockApp = angular.module('stockApp', ['ngRoute', 'ngAnimate', 'chart.js']);
// Get the context of the canvas element we want to select
var lastTradePrice = 0;
var yearHigh = 0;
var yearLow = 0;
var peRatio = 0;
var averagePE = 0;
var dividendYield = 0;
var companySymbol = 0;
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
        //industryLink = getIndustryLinks();
        $scope.getLinks();
          alert("reach here");
        $scope.showStock();
      }
  };
  $scope.quoteVisibility = false;
    $scope.getLinks = function(){
        $http.get("https://api.import.io/store/data/02134541-f2f4-4526-82ca-df3fa62307f6/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fin%3Fs%3D" + $scope.inputText + "%2BIndustry&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
            .success(function(response) {
            //alert(response.results[0].industry);
            $scope.industry = response.results[0].industry;

          //$scope.industry = industryLink;
          }).
        error(function() {
          
        });
    };
    $scope.showStock = function(){
        $http.get("https://api.import.io/store/data/d53a442a-94ef-45b8-acd7-d2bcac37b007/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fks%3Fs%3D" + $scope.inputText + "%2BKey%2BStatistics&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
        .success(function(response) {
            alert("hi")
          $scope.quoteVisibility = true;
          //$scope.stock = response.query.results.quote;
          $scope.symbol = $scope.inputText;
          //$scope.stats = response;
          companySymbol = $scope.inputText;
          lastTradePrice = 4;
          yearHigh = 3;
          yearLow = 2;
          peRatio = 1;
          dividendYield = 0;
          $scope.ChartData = [
            [lastTradePrice, yearHigh, yearLow, peRatio, dividendYield, 0, 0]
                              ];
          }).
        error(function() {
          
        });
    };
});
///////////////////////FUNCTION FOR DIFFERENT LINKS///////////////////
function getIndustryLinks(){
    var linkurl = "https://api.import.io/store/data/02134541-f2f4-4526-82ca-df3fa62307f6/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fin%3Fs%3D" + companySymbol + "%2BIndustry&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D";    
    $.ajax({
        url : 'example.com',
        type: 'GET',
        success : extractData
    })
}
function extractData(input){
                alert(result.results[0].industry);
        industryLink = result.results[0].industry;
}

///////////////////////////////////////////////////
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

