angular.module('BlocksApp').controller('TxsController', function ($stateParams, $rootScope, $scope, $http, $location) {
  $scope.$on('$viewContentLoaded', function () {
    // initialize core components
    App.initAjax();
  });

  $rootScope.isHome = false;
  // $rootScope.$state.current.data["pageSubTitle"] = 'Transactions List';
  $scope.loading = true;
  $scope.hash = $stateParams.hash;
  $scope.settings = $rootScope.setup;

  $http({
    method: 'POST',
    url: '/data',
    data: { "action": "all_txs" }
  }).then(function (resp) {
    $scope.txns = resp.data;

    setTimeout(() => {
      initializeTable();
    }, 800);
  });

  const initializeTable = () => {
    $('#datatable').DataTable({
      dom: 'frt<"flex justify-between items-center text-warm-grey-two"lpi>',
      pagingType: 'full_numbers',
      pageLength: 20,
      lengthMenu: [5, 10, 20, 50, 100],
      language: {
        paginate: {
          first: '<<',
          previous: '<',
          next: '>',
          last: '>>',
        }
      },
      order: [
        [6, 'desc']
      ],
      columnDefs: [
        {
          orderable: false,
          targets: [0, 2, 3]
        },
        {
          targets: 6,
          render: function (data, type) {
            if (type === 'display' || type === 'filter') {
              return getDuration(data).toString();
            }

            return data;
          },
        },
      ],
    });

    callBacks();
  }

  const callBacks = () => {
    // Replace label and placeholder
    $('#datatable_filter').find('input').attr('placeholder', 'Search');
    $('#datatable_filter')
      .find('label')
      .contents()
      .filter((_, el) => el.nodeType === 3)
      .remove();

    $scope.loading = false;
    $scope.$digest();
  };
})
