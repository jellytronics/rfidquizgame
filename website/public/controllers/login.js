angular.module('MyApp')
  .controller('LoginCtrl', ['$scope', 'Auth', '$http', '$location', '$window', function($scope, Auth, $http, $location, $window) {
    $scope.login = function() {
      Auth.login({
        email: $scope.email,
        password: $scope.password
      });
    };

    $scope.facebookLogin = function(){
      var noob = $window.open('/api/auth/facebook', '_blank', 'location=yes');
      noob.bind("beforeunload", function() {
        return inFormOrLink ? "Do you really want to close?" : null; 
      });
      console.log(noob);
      /*
      $location.path('/api/auth/facebook');
      $http.get('/api/auth/facebook').success(function(data) {
        /*
        $scope.messages.unsecured = data.message || data.error;
        $location.path('/');
        //*
        console.log("done");
      });
      */
    };
  }]);
