angular.module('BlocksApp').controller('AddressController', function ($stateParams, $rootScope, $scope, $http, $location) {
  var activeTab = $location.url().split('#');
  if (activeTab.length > 1)
    $scope.activeTab = activeTab[1];

  $rootScope.isHome = false;
  $rootScope.$state.current.data["pageSubTitle"] = $stateParams.hash;
  $scope.addrHash = $stateParams.hash;
  $scope.addr = { "balance": 0, "count": 0, "mined": 0 };
  $scope.settings = $rootScope.setup;

  //fetch web3 stuff
  $http({
    method: 'POST',
    url: '/web3relay',
    data: { "addr": $scope.addrHash, "options": ["balance", "count", "bytecode"] }
  }).then(function (resp) {
    $scope.addr = $.extend($scope.addr, resp.data);
    fetchTxs();
    if (resp.data.isContract) {
      $rootScope.$state.current.data["pageTitle"] = "Contract Address";
      fetchInternalTxs();
    }
  });

  // fetch ethf balance 
  if ($scope.settings.useEthFiat)
    $http({
      method: 'POST',
      url: '/fiat',
      data: { "addr": $scope.addrHash }
    }).then(function (resp) {
      $scope.addr.ethfiat = resp.data.balance;
    });

  //fetch transactions
  var fetchTxs = function () {
    $('#datatable').DataTable({
      ajax: function (data, callback, settings) {
        data.addr = $scope.addrHash;
        data.count = $scope.addr.count;
        $http.post('/addr', data).then(function (resp) {
          // check $scope.records* if available.
          // resp.data.recordsTotal = $scope.recordsTotal ? $scope.recordsTotal : resp.data.recordsTotal;
          // resp.data.recordsFiltered = $scope.recordsFiltered ? $scope.recordsFiltered : resp.data.recordsFiltered;

          // remove nitro
          // resp.data.data = resp.data.data.filter(x => delete x[5]);
          // console.log(resp.data)

          callback(resp.data);
          callBacks();

          // save data
          $scope.addr.count = resp.data.data.length;
          $scope.addr.mined = parseInt(resp.data.mined);
        });

        // get mined, recordsTotal counter only once.
        // if (data.draw) return;

        // $http.post('/addr_count', data).then(function (resp) {
        //   $scope.addr.count = resp.data.recordsTotal;
        //   $scope.addr.mined = parseInt(resp.data.mined);

        // data.count = resp.data.recordsTotal;

        // set $scope.records*
        // $scope.recordsTotal = resp.data.recordsTotal;
        // $scope.recordsFiltered = resp.data.recordsFiltered;
        // draw table if $scope.data available.
        // if ($scope.data) {
        //   $scope.data.recordsTotal = resp.data.recordsTotal;
        //   $scope.data.recordsFiltered = resp.data.recordsFiltered;
        // }
        // });
      },

      "dom": 'frt<"flex justify-between items-center text-warm-grey-two"lpi>',
      "pagingType": "full_numbers",
      "lengthMenu": [5, 10, 20, 50, 100],
      "language": {
        "paginate": {
          "first": "<<",
          "previous": "<",
          "next": ">",
          "last": ">>",
        }
      },
      "order": [
        [6, "asc"]
      ],
      "pageLength": 20,
      "columnDefs": [
        {
          "targets": 5,
          "visible": false,
        },
        {
          "targets": [0, 2, 3, 4],
          "orderable": false,
        },
        {
          "render": data => td('tx', data),
          "targets": 0,
        },
        {
          "render": data => td('block', data),
          "targets": 1,
        },
        {
          "render": (data) => {
            return (data != $scope.addrHash)
              ? td('addr', data)
              : data
          }, "targets": [2, 3]
        },
        {
          "render": data => getDuration(data).toString(),
          "targets": 6,
        },
      ],
      "autoWidth": false,
    });
    // var table = $("#table_txs").DataTable({
    //   processing: true,
    //   serverSide: true,
    //   paging: true,
    //   ajax: function (data, callback, settings) {
    //     data.addr = $scope.addrHash;
    //     data.count = $scope.addr.count;
    //     $http.post('/addr', data).then(function (resp) {
    //       // save data
    //       $scope.data = resp.data;
    //       // check $scope.records* if available.
    //       resp.data.recordsTotal = $scope.recordsTotal ? $scope.recordsTotal : resp.data.recordsTotal;
    //       resp.data.recordsFiltered = $scope.recordsFiltered ? $scope.recordsFiltered : resp.data.recordsFiltered;
    //       callback(resp.data);
    //     });

    //     // get mined, recordsTotal counter only once.
    //     if (data.draw > 1)
    //       return;

    //     $http.post('/addr_count', data).then(function (resp) {
    //       $scope.addr.count = resp.data.recordsTotal;
    //       $scope.addr.mined = parseInt(resp.data.mined);

    //       data.count = resp.data.recordsTotal;

    //       // set $scope.records*
    //       $scope.recordsTotal = resp.data.recordsTotal;
    //       $scope.recordsFiltered = resp.data.recordsFiltered;
    //       // draw table if $scope.data available.
    //       if ($scope.data) {
    //         $scope.data.recordsTotal = resp.data.recordsTotal;
    //         $scope.data.recordsFiltered = resp.data.recordsFiltered;
    //         callback($scope.data);
    //       }
    //     });
    //   },
    //   "lengthMenu": [
    //     [5, 10, 20, 50, 100],
    //     [5, 10, 20, 50, 100] // change per page values here
    //   ],
    //   "pageLength": 20,
    //   "order": [
    //     [6, "desc"]
    //   ],
    //   "language": {
    //     "lengthMenu": "_MENU_ transactions",
    //     "zeroRecords": "No transactions found",
    //     "infoEmpty": ":(",
    //     "infoFiltered": "(filtered from _MAX_ total txs)"
    //   },
    //   "columnDefs": [
    //     {
    //       "targets": 5,
    //       "visible": false,
    //     },
    //     { "targets": 6, "type": "date" },
    //     { "orderable": false, "targets": [0, 2, 3, 4] },
    //     {
    //       "render": function (data, type, row) {
    //         if (data != $scope.addrHash)
    //           return `<a class="a" href="/addr/${data}">${data}</a>`
    //         else
    //           return data
    //       }, "targets": [2, 3]
    //     },
    //     {
    //       "render": function (data, type, row) {
    //         return `<a class="a" href="/block/${data}">${data}</a>`
    //       }, "targets": [1]
    //     },
    //     {
    //       "render": function (data, type, row) {
    //         return `<a class="a" href="/tx/${data}">${data}</a>`
    //       }, "targets": [0]
    //     },
    //     {
    //       "render": function (data, type, row) {
    //         return getDuration(data).toString();
    //       }, "targets": [6]
    //     },
    //   ]
    // });
  }

  var fetchInternalTxs = function () {
    $http({
      method: 'POST',
      url: '/web3relay',
      data: { "addr_trace": $scope.addrHash }
    }).then(function (resp) {
      $scope.internal_transactions = resp.data;
    });
  }

  var td = (thing, data) =>
    `<td>
      <a class="a" href="/${thing}/${data}">
        ${data}
      </a>
    </td>`;

  let callBacks = () => {
    // Add placeholder
    $('#datatable_filter').find('input').attr('placeholder', 'Search');

    // Remove label
    $('#datatable_filter')
      .find('label')
      .contents()
      .filter((_, el) => el.nodeType === 3)
      .remove();
  };
})
  .directive('contractSource', function ($http) {
    return {
      restrict: 'E',
      templateUrl: '/views/contract-source.html',
      scope: false,
      link: function (scope, elem, attrs) {
        //fetch contract stuff
        $http({
          method: 'POST',
          url: '/compile',
          data: { "addr": scope.addrHash, "action": "find" }
        }).then(function (resp) {
          scope.contract = resp.data;
        });
      }
    }
  })
