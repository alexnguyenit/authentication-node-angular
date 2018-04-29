angular.module('myApp')
  .controller('loginCtrl', function ($scope, AuthService, $state, $stateParams) {
    $scope.user = { email: '', password: '' };
    if ($stateParams.obj !== null) {
      $scope.message = $stateParams.obj;
    }
    $scope.login = () => {
      AuthService.login($scope.user).then(msg => {
        $state.go('profile')
      }, errMsg => {
        $scope.user = { email: '', password: '' };
        var alertMsg = {
          title: 'Login Failed',
          template: errMsg
        };
        $state.go('home.login', { obj: alertMsg });
      })
    }
  })
  .controller('registerCtrl', function ($scope, AuthService, $state, $stateParams) {
    $scope.user = { email: '', password: '' };
    if ($stateParams.obj !== null) {
      $scope.message = $stateParams.obj;
    }
    $scope.register = () => {
      AuthService.register($scope.user).then(msg => {
        let alertMsg = {
          title: 'Register success',
          template: msg
        };
        $state.go('home.login', { obj: alertMsg })
      }, errMsg => {
        $scope.user = { email: '', password: '' };
        let alertMsg = {
          title: 'Register Failed',
          template: errMsg
        };
        $state.go('home.register', { obj: alertMsg });
      })
    }
  })
  .controller('profileCtrl', function ($scope, AuthService, $state, $http, $stateParams) {
    $scope.getInfo = () => {
      $http.get('http://localhost:3000/profile').then(response => {
        $scope.user = response.data.user;
      })
    }

    $scope.logout = () => {
      AuthService.logout();
      $state.go('home.login');
    }

    $scope.killSession = () => {
      AuthService.logout();
    }
  })
  .controller('AppCtrl', function ($scope, $state, AuthService) {
    $scope.$on('auth-not-authenticated', event => {
      AuthService.logout();
      let alertMsg = {
        title: 'Session is lost',
        template: 'Sorry, you need to login again.'
      };
      $state.go('home.login', {obj: alertMsg});
    })
  })