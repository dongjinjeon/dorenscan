angular.module('BlocksApp').controller('HomeController', function ($rootScope, $scope, $http, $timeout) {
  $scope.$on('$viewContentLoaded', function () {
    // initialize core components
    App.initAjax();
  });

  var URL = '/data';

  $rootScope.isHome = true;

  $scope.reloadCGData = function () {
    $scope.cgDataLoading = true;

    $http.get('https://api.coingecko.com/api/v3/coins/doren').then(resp => {
      $scope.cgData = resp.data;
      if (Math.sign(resp.data.market_data.price_change_percentage_24h) === -1) {
        $scope.isBull = false;
      } else {
        $scope.isBull = true;
      }
      $scope.cgDataLoading = false;
    }).catch((err) => {
      // console.log('API call error:', err.message);
      $scope.cgDataLoading = false;
    });
  }
  $scope.reloadBlocks = function () {
    $scope.blockLoading = true;

    $http({
      method: 'POST',
      url: URL,
      data: { "action": "latest_blocks" }
    }).then(function (resp) {
      if ($scope.latest_blocks) {
        $scope.last_block = $scope.latest_blocks[0].number;
      }
      $scope.latest_blocks = resp.data.blocks;
      $scope.blockLoading = false;
    });
  }
  $scope.reloadTransactions = function () {
    $scope.txLoading = true;

    $http({
      method: 'POST',
      url: URL,
      data: { "action": "latest_txs" }
    }).then(function (resp) {
      $scope.latest_txs = resp.data.txs;
      $scope.txLoading = false;
    });
  }
  $scope.reloadStats = function () {
    $scope.statsLoading = true;

    $http({
      method: 'POST',
      url: '/web3relay',
      data: { "action": "hashrate" }
    }).then(function (resp) {
      $scope.stats = resp.data;
      $scope.statsLoading = false;
    });
  }

  $scope.reloadBlocks();
  $scope.reloadTransactions();
  $scope.reloadCGData();
  $scope.reloadStats();

  setInterval(() => {
    $scope.reloadBlocks();
    $scope.reloadTransactions();
    $scope.reloadCGData();
    $scope.reloadStats();
  }, 60000);
  $scope.settings = $rootScope.setup;
})
  .directive('simpleSummaryStats', function ($http) {
    return {
      restrict: 'E',
      templateUrl: '/views/simple-summary-stats.html',
      scope: true,
      // link: function (scope, elem, attrs) {
      //   scope.stats = {};
      //   var statsURL = "/web3relay";
      //   $http
      //     .post(statsURL, { "action": "hashrate" })
      //     .then(function (res) {
      //       console.log(res.data)
      //       scope.stats.hashrate = res.data.hashrate;
      //       scope.stats.difficulty = res.data.difficulty;
      //       scope.stats.blockHeight = res.data.blockHeight;
      //       scope.stats.blockTime = res.data.blockTime;
      //     });
      // }
    }
  })
  .directive('siteNotes', function () {
    return {
      restrict: 'E',
      templateUrl: '/views/site-notes.html'
    }
  })
  //OLD CODE DONT USE
  .directive('summaryStats', function ($http) {
    return {
      restrict: 'E',
      templateUrl: '/views/summary-stats.html',
      scope: true,
      link: function (scope, elem, attrs) {
        scope.stats = {};

        var etcEthURL = "/stats";
        var etcPriceURL = "https://api.coinmarketcap.com/v1/ticker/ethereum-classic/";
        var ethPriceURL = "https://api.coinmarketcap.com/v1/ticker/ethereum/"
        scope.stats.ethDiff = 1;
        scope.stats.ethHashrate = 1;
        scope.stats.usdEth = 1;
        $http.post(etcEthURL, { "action": "etceth" })
          .then(function (res) {
            scope.stats.etcHashrate = res.data.etcHashrate;
            scope.stats.ethHashrate = res.data.ethHashrate;
            scope.stats.etcEthHash = res.data.etcEthHash;
            scope.stats.ethDiff = res.data.ethDiff;
            scope.stats.etcDiff = res.data.etcDiff;
            scope.stats.etcEthDiff = res.data.etcEthDiff;
          });
        $http.get(etcPriceURL)
          .then(function (res) {
            scope.stats.usdEtc = parseFloat(res.data[0]["price_usd"]);
            scope.stats.usdEtcEth = parseInt(100 * scope.stats.usdEtc / scope.stats.usdEth);
          });
        $http.get(ethPriceURL)
          .then(function (res) {
            scope.stats.usdEth = parseFloat(res.data[0]["price_usd"]);
            scope.stats.usdEtcEth = parseInt(100 * scope.stats.usdEtc / scope.stats.usdEth);
            scope.stats.ethChange = parseFloat(res.data.change);
          });

      }
    }
  });
