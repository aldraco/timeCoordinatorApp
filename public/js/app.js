angular.module('TimeCoordinator', [
  'ui.router', 
  'ngResource',
  'ngCookies',
  'TimeCoordinator.Users',
  'TimeCoordinator.Meetings',
  'TimeCoordinator.Availability',
  'TimeCoordinator.Auth',
  'TimeCoordinator.directives'
])
.run(['$state', function($state) {
  $state.go('profile');
}])

.config(['$stateProvider', '$locationProvider', '$httpProvider', '$urlRouterProvider', function($stateProvider, $locationProvider, $httpProvider, $urlRouterProvider) {
  
  $httpProvider
  .interceptors.push(function($q, $location){
    return {
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        if (response.status === 401)
          $location.url('/#/login');
        return $q.reject(response);
      }
    };
  });
  var checkLoggedIn = function($q, $timeout, $http, $state, $rootScope) {
  var deferred = $q.defer();
  $http.get('/loggedin').success(function(user){
    if (user !== '0'){
      deferred.resolve();
      console.log(user);
      $rootScope.user = user;
    }else{
      $rootScope.message = "You need to log in";
      deferred.reject();
      $state.go('login');
    }
  });
  return deferred.promise;
};
  $stateProvider
  .state('login', {
  url: '/login',
  templateUrl: 'partials/login.jade',
  controller: 'AuthController'
  })
    
  .state('profile',{
    url: '/profile',
    templateUrl: 'partials/profile.jade',
    controller: 'UserController',
    resolve: {
      loggedin: checkLoggedIn
    }
})
  
  .state('upcomingmeetings', {
    url: '/meetings',
    templateUrl: 'partials/viewmeetings.jade',
    controller: 'MeetingController',
    params: {
      updated: false
    },
    resolve: {
      loggedin: checkLoggedIn
    }
  })
  
  .state('singlemeeting', {
    url: '/meetings/:id',
    templateUrl: 'partials/singlemeeting.jade',
    controller: 'SingleMeetingController',
    resolve: {
      loggedin: checkLoggedIn
    }
})
  
  .state('createmeetings', {
    url: '/meeting/create',
    templateUrl: '/partials/createmeeting.jade',
    controller: 'CreateMeetingController',
    resolve: {
      loggedin: checkLoggedIn
    }
  });
}]);