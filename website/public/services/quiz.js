angular.module('MyApp')
  .factory('Quiz', ['$resource', function($resource) {
    return $resource('/api/quizzes/:_id');
  },]);

angular.module('MyApp')
  .factory('QuizPlayer', ['$http', function($http) {
    return {
      play: function(quiz) {
        return $http.post('/api/play', { quizName: quiz._id });
      },
      stopPlaying: function(quiz) {
        return $http.post('/api/stopPlaying', { quizName: quiz._id });
      },
      pausePlaying: function(quiz) {
        return $http.post('/api/pausePlaying', { quizName: quiz._id });
      }
    };
  }]);
