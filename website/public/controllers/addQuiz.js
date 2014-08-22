angular.module('MyApp')
  .controller('AddQuizCtrl', ['$scope', '$rootScope', '$alert', 'Quiz', function($scope, $rootScope, $alert, Quiz) {
    $scope.addQuiz = function() {
      Quiz.save({
        quizName: $scope.quizName,
        quizDescription: $scope.quizDescription,
        quizAuthor: $rootScope.currentUser._id
        },
        function() {
          $scope.quizName = '';
          $scope.quizDescription = '';
          $scope.addForm.$setPristine();
          $alert({
            content: 'Quiz has been added.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $scope.quizName = '';
          $scope.addForm.$setPristine();
          $alert({
            content: response.data.message,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
    };
    $scope.getAuthor = function() {
      return $rootScope.currentUser._id;
    }
  }]);
