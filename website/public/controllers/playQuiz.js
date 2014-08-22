
/*

var socket = io.connect('http://beagleserver:3001');
socket.on('news', function (data) {
  console.log(data);
  socket.emit('my other event', { my: 'data' });
});
socket.on('connected', function (data) {
  console.log(data);
});


*/


angular.module('MyApp')
  .controller('PlayQuizCtrl', ['$scope', '$rootScope', '$routeParams', 'Quiz', '$alert', 'ioSocketClientServer', '$interval',
    function($scope, $rootScope, $routeParams, Quiz, $alert, ioSocketClientServer, $interval) {
      $scope.localQuizState = {}
      ioSocketClientServer.on('connected', function(data){
        console.log('Connected to ' + data.hostname);
        ioSocketClientServer.emit('helloRecieved', {hostname : undefined });
      });
      $scope.managedquizzes = Quiz.query({ author: $rootScope.currentUser._id });
      $scope.quizzes = Quiz.query();
      Quiz.get({ _id: $routeParams.id }, function(quiz) {
        $scope.quiz = quiz;
        $scope.currentQn = findQuestionWithId($scope.quiz.currentQn);
        $scope.localQuizState.quizId = $scope.quiz._id;
        $scope.localQuizState.questionId = $scope.quiz.currentQn;
        $scope.localQuizState.time = $scope.currentQn.timeAllowed;
        $scope.localQuizState.timer = "paused";
        $scope.localQuizState.timeStarted = undefined;
        $scope.localQuizState.countdownTimer = $scope.currentQn.timeAllowed;
        $scope.localQuizState.countdownTimerInterval = undefined;


      });

      $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopCountdown();
      });


      $scope.testAlert = function(){
        $alert({
          content: 'HELLO. ' + $scope.team.teamNumber,
          placement: 'top-right',
          type: 'success',
          duration: 3
        });
      };



      ioSocketClientServer.on('updateQuiz', function(quizUpdate){
        $scope.quiz = quizUpdate;
        //Code below needs to change due to way nextquestion and prevQn are handled.
        $scope.localQuizState.questionId = $scope.quiz.currentQn;
        $scope.restartTimer();
      });

      var checkPlayable = function(){
        if ($scope.quiz.status != 'Playing'){
          $alert({
            content: 'Quiz is not in a playable state.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
          return false;
        };
        return true;
      };

      var startCountdown = function(time){
        $scope.localQuizState.timer = "started";
        $scope.localQuizState.timeStarted = moment();
        var interval = 1000;
        $scope.localQuizState.countdownTimerInterval = $interval(function(){
          var timeElapsed = moment().diff($scope.localQuizState.timeStarted)/1000;
          timeElapsed = timeElapsed - timeElapsed % 1
          $scope.localQuizState.countdownTimer = $scope.localQuizState.time - timeElapsed;
          if ($scope.localQuizState.countdownTimer == 0) { stopCountdown();};
        }, interval);
      };

      var stopCountdown = function() {
        $scope.localQuizState.timer = "paused";
        var timeElapsed = moment().diff($scope.localQuizState.timeStarted)/1000;
        timeElapsed = timeElapsed - timeElapsed % 1
        $scope.localQuizState.countdownTimer = $scope.localQuizState.time - timeElapsed;
        $scope.localQuizState.time = $scope.localQuizState.countdownTimer;

        $interval.cancel($scope.localQuizState.countdownTimerInterval);
      }

      var findQuestionWithId = function(currentQn){
        var questionArray = $scope.quiz.questions.filter(function(question){
          return question._id == currentQn;
        });
        if (questionArray.length == 0){return undefined;};
        return questionArray[0];
      };


      ioSocketClientServer.on('timerStarted', function(quizState){

        $scope.localQuizState.quizId = quizState.quizId;
        $scope.localQuizState.questionId = quizState.questionId;
        $scope.localQuizState.time = quizState.time;
        $scope.localQuizState.timer = 'started';
        if (!checkPlayable() || $scope.localQuizState.time <= 0){return;};
        startCountdown();
      });

      ioSocketClientServer.on('timerPaused', function(quizState){
        $scope.localQuizState.quizId = quizState.quizId;
        $scope.localQuizState.questionId = quizState.questionId;
        $scope.localQuizState.time = quizState.time;
        $scope.localQuizState.timer = 'paused';
        if (!checkPlayable()){return;};
        $interval.cancel($scope.localQuizState.countdownTimerInterval);
      });


      ioSocketClientServer.on('timerInit', function(quizState){
        $interval.cancel($scope.localQuizState.countdownTimerInterval);
        $scope.localQuizState.quizId = quizState.quizId;
        $scope.localQuizState.questionId = quizState.questionId;
        $scope.localQuizState.time = quizState.time;
        $scope.localQuizState.timer = 'paused';
        $scope.localQuizState.countdownTimer = $scope.localQuizState.time;
        $scope.localQuizState.timeStarted = undefined;
      });

      //To be done later




    }]);
