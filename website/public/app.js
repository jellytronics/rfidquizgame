angular.module('MyApp', ['ngCookies', 'ngResource', 'ngMessages', 'ngRoute', 'mgcrea.ngStrap'])
  .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'MainCtrl'
      })
      .when('/quizzes/:id', {
        templateUrl: 'views/playQuiz.html',
        controller: 'PlayQuizCtrl'
      })
      .when('/quizzes/:id/manage', {
        templateUrl: 'views/manageQuiz.html',
        controller: 'ManageQuizCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/manageAccount', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl'
      })
      /*.when('/manageCard', {
        templateUrl: 'views/card.html',
        controller: 'CardCtrl'
      })*/
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/addQuiz', {
        templateUrl: 'views/addQuiz.html',
        controller: 'AddQuizCtrl'
      })
      .when('/playQuiz', {
        templateUrl: 'views/playQuizSelect.html',
        controller: 'PlayQuizCtrl'
      })
      .when('/manageQuiz', {
        templateUrl: 'views/manageQuizSelect.html',
        controller: 'ManageQuizCtrl'
      })
      .when('/api/auth/facebook', {
        resolve: '/api/auth/facebook'
      })
      .when('/api/auth/google', {
        //redirectTo: '/api/auth/google'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
