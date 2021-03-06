/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
BlocksApp.directive('ngSpinnerBar', ['$rootScope', '$transitions',
  function ($rootScope, $transitions) {
    return {
      link: function (scope, element, attrs) {
        const main = document.getElementById('main');
        // by defult hide the spinner bar
        element.addClass('invisible opacity-0');

        // display the spinner bar whenever the route changes(the content part started loading)
        $transitions.onStart({}, function (trans) {
          element.removeClass('invisible opacity-0');
          Layout.closeMainMenu();
        });

        // hide the spinner bar on rounte change success(after the content loaded)
        $transitions.onSuccess({}, function (trans) {
          setTimeout(() => {
            element.addClass('invisible opacity-0');
          }, 800);
          $('body').removeClass('page-on-load'); // remove page loading indicator
          Layout.setMainMenuActiveLink('match'); // activate selected link in the sidebar menu

          // auto scorll to page top
          setTimeout(function () {
            App.scrollTop(); // scroll to the top on content load
          }, $rootScope.settings.layout.pageAutoScrollOnLoad);
        });

        // handle errors
        $transitions.onError({}, function () {
          setTimeout(() => {
            element.addClass('invisible opacity-0');
          }, 800);
        });
      }
    };
  }
])

// Handle global LINK click
BlocksApp.directive('a', function () {
  return {
    restrict: 'E',
    link: function (scope, elem, attrs) {
      if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
        elem.on('click', function (e) {
          e.preventDefault(); // prevent link click for above criteria
        });
      }
    }
  };
});

// Handle Dropdown Hover Plugin Integration
BlocksApp.directive('dropdownMenuHover', function () {
  return {
    link: function (scope, elem) {
      elem.dropdownHover();
    }
  };
});