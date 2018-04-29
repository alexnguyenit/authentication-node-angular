angular.module('myApp')
.service('AuthService', function($q, $http){
    var LOCAL_TOKEN = 'token';
    var isAuthenticated = false;
    var authToken;
    function loadToken(){
        let token = window.localStorage.getItem(LOCAL_TOKEN);
        if(token){
            useToken(token);
        }
    };
    function storeToken(token){
        window.localStorage.setItem(LOCAL_TOKEN, token);
        useToken(token);
    };
    function useToken(token){
        isAuthenticated = true;
        authToken = token;
        $http.defaults.headers.common.Authorization = 'Bearer '+authToken;
    };
    function destroyToken(){
        authToken = undefined;
        isAuthenticated = false;
        $http.defaults.headers.common.Authorization = undefined;
        window.localStorage.removeItem(LOCAL_TOKEN);
    };
    let register = (user) => {
        return $q(function(resolve, reject){
            $http.post('http://localhost:3000/signup', user).then((response) => {
                if(response.data.success){
                    resolve(response.data.message);
                }else{
                    reject(response.data.message);
                }
            })
        })
    };

    let login = (user) => {
        return $q(function(resolve, reject){
            $http.post('http://localhost:3000/login', user).then((response) => {
                if(response.data.success){
                    storeToken(response.data.token);
                    resolve(response.data.message);
                }else{
                    reject(response.data.message);
                }
            })
        })
    };

    let logout = () => {
        destroyToken();
    };
    loadToken();
    return {
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: () => { return isAuthenticated; }
    }
})
.factory('AuthIntercepter', ($rootScope, $q) => {
    return {
        responseError : response => {
            $rootScope.$broadcast({
                401: 'user is not authenticated'
            }[response.status], response);
            return $q.reject(response);
        }
    }
})
.config($httpProvider => {
    $httpProvider.interceptors.push('AuthIntercepter');
})