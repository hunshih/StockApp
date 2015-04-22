var stockApp = angular.module('stockApp', ['ngRoute', 'ngAnimate', 'chart.js']);
// Get the context of the canvas element we want to select
var lastTradePrice = 0;
var yearHigh = 0;
var yearLow = 0;
var peRatio = 0;
var operationMargin = 0;
var roa;
var averagePE = 0;
var dividendYield = 0;
var priceBook = 0;
var earningYield = 0;
var marketCap = 0;
var netIncome = 0;
var dividendPaid = 0;
var companySymbol = 0;
var industryPE = 0;
var industryNetMargin = 0;
var industryRoe = 0;
var industryLink;
var industryPriceBook = 0;
var industryEY = 0;
var marketCap = 0;
var roic = 0;
var longTermDebt = 0;
var totalEquity = 0;
var totalCapital = 0;
var payoutRatio = 0;
var currentAssets = 0;
var currentInventories = 0;
var currentLiabilities = 0;
var quickRatio = 0;
//main controller
stockApp.controller('mainCtrl', function ($scope, $http) {
});

stockApp.controller('ratioCtrl', function($scope, $http){

  $scope.corners =["PE Ratio", "Earning Yield", "Price/Book", "ROIC%", "Market Cap", "Payout Ratio", "Quick Ratio"];
  $scope.ChartData = [
  [peRatio, earningYield, priceBook, roic, marketCap, payoutRatio, quickRatio]
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
            industryEY = (1/industryPE).toPrecision(3);
            industryNetMargin = response.results[0].netprofitmargin;
            industryRoe = response.results[0].roe;
            industryPriceBook = response.results[0].pbook;
            $scope.averagePE = industryPE;
            $scope.averageMargin = industryNetMargin;
            $scope.averageRoe = industryRoe;
            $scope.averagePbook = industryPriceBook;
            //$scope.getROIC();
            $scope.getMarketCap();
          }).
        error(function() {
          
        });
    };
    $scope.getMarketCap = function(){
        $http.get("https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20yahoo.finance.quotes%20where%20symbol%20in%20(%22" + $scope.inputText + "%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=")
            .success(function(response) {
            //alert(response.results[0].industry);
            //$scope.marketCap = "haha";
            marketCap = response.query.results.quote.MarketCapitalization;
            marketCap = convertMarketCap(marketCap);
            $scope.marketCap = marketCap;
            $scope.getCapital();
          }).
        error(function() {
          
        });
    };
    $scope.getCapital = function(){
        $http.get("https://api.import.io/store/data/8fb81fdf-edd5-47db-b30c-26a520ad9af7/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fbs%3Fs%3D" + $scope.inputText + "&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
            .success(function(response) {
            
            longTermDebt = parseFloat(response.results[23].value_3);
            totalEquity = parseFloat(response.results[38].value_3);
            totalCapital = longTermDebt + totalEquity;
            
            currentAssets = parseFloat(response.results[8].value_3);
            currentInventories = parseFloat(response.results[6].value_3);
            currentLiabilities = parseFloat(response.results[22].value_3);
            quickRatio = (currentAssets - currentInventories)/currentLiabilities;
            $scope.quickRatio = quickRatio.toPrecision(4);
            $scope.capital = totalCapital;
            $scope.getROIC();
          }).
        error(function() {
          
        });
    };
    $scope.getROIC = function(){
        $http.get("https://api.import.io/store/data/c7ce718a-6756-4c73-b885-0d688e996635/_query?input/webpage/url=http%3A%2F%2Ffinance.yahoo.com%2Fq%2Fcf%3Fs%3D" + $scope.inputText +"%26annual&_user=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7&_apikey=bebd3907-23ed-45f5-86f5-69e5b8a4c9e7%3A8DLVNS8YsLcDmGnMp3Ne9XK4oWk30YKsoZRG8KWRUyXzPFCqYPlKBGHSE5rm1%2Bd121AIN8eZU6TQZIXwrkqenA%3D%3D")
            .success(function(response) {
            //alert(response.results[0].industry);
            netIncome = parseFloat(response.results[1].sep272014_value);
            dividendPaid = convertDividend(response.results[16].sep272014_value);
            roic = ((netIncome - dividendPaid)*100/totalCapital).toPrecision(4);
            $scope.roic = roic;
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
          earningYield = (1/peRatio).toPrecision(3);
          operationMargin = response.results[0].operationmargin;
          roa = response.results[0].roa;
          priceBook = response.results[0].pbook;
          payoutRatio = response.results[0].payout;
          $scope.peRatio = peRatio;
          $scope.margin = operationMargin;
          $scope.roa = roa;
          $scope.pbook = priceBook;
          $scope.payout = payoutRatio;
          $scope.earningYield = earningYield;
          var presentPE = peScaling(peRatio, industryPE).toPrecision(3);
          dividendYield = 0;
          $scope.ChartData = [
            [presentPE, earningYield, priceBook, roic, 5, payoutRatio, quickRatio]
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

//======Helper=============
var convertMarketCap = function(value){
    if(value == null) return 0;
    var decimalValue = parseFloat(value.substring(0, value.length - 1));
    if(value.slice(-1) == 'M'){
        return (decimalValue*1.0e+6);
    }
    else return (decimalValue*(1.0e+9));
};
var convertDividend = function(value){
    if(value.length <= 1) return 0;
    else return parseFloat(value.substring(1, value.length - 1));
};

var getPeBase = function(value){
        if(value <= 15){
            return 5
        }
        else{
            return (75/value);
        }
};

var getPeBonus = function(value, average){
        if(value < (0.5*average)){
           return 5;
        }
        else if(value <= average ){
            var slope = (-2/(0.5*average));
            return (slope * value + 7);
        }
        else{
            return (3 * average)/value;   
        }
};

var peScaling = function(value, average){
    var result = 0;
    var base = getPeBase(value);
    var bonus = getPeBonus(value, average);
    //alert(bonus);
    result = base + bonus;
    return result;
};