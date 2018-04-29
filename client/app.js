angular.module('myApp', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'templates/home.html'
      })
      .state('home.login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl',
        params: { obj: null }
      })
      .state('home.register', {
        url: '/register',
        templateUrl: 'templates/register.html',
        controller: 'registerCtrl',
        params: { obj: null }
      })
      .state('profile', {
        url: '/profile',
        templateUrl: 'templates/profile.html',
        controller: 'profileCtrl'
      });
    $urlRouterProvider.otherwise('/home/login');
  })
  .run(function ($rootScope, $state, AuthService) {
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
      if (!AuthService.isAuthenticated()) {
        if (next.name !== 'home.login' && next.name !== 'home.register') {
          event.preventDefault();
          let alertMsg = {
            title: 'Alert',
            template:'not authenticated ...'
          };
          $state.go('home.login', { obj: alertMsg })
        }
      }
    })
  })