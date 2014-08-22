/*
var ioSocketClientServer = io.connect('http://beagleserver:3001'); // change to beagleserver

*/



angular.module('MyApp')
  .controller('ManageQuizCtrl', ['$scope', '$rootScope', '$routeParams', 'Quiz', '$alert', 'ioSocketClientServer', '$interval',
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

        $scope.isAdmin = function() {
          var isAdminArr = ($scope.quiz.author._id == $rootScope.currentUser._id);
          return isAdminArr;
        };

        /*

        DEFUNCT

        $scope.isPlayed = function() {
          return $scope.quiz.status == 'Playing';
        };

        $scope.play = function() {
          QuizPlayer.play(quiz).success(function(){
            $scope.quiz.status = 'Playing'
          });
        };

        //'Not Played', 'Playing', 'Paused' , 'Ended'

        $scope.stopPlaying = function() {
          QuizPlayer.stopPlaying(quiz).success(function(){
            $scope.quiz.status = 'Ended'
          });
        };

        $scope.pausePlaying = function() {
          QuizPlayer.pausePlaying(quiz).success(function(){
            $scope.quiz.status = 'Paused'
          });
        };

        $scope.localQuizState = {
          quizId: $scope.quiz._id,
          questionId: $scope.quiz.currentQn,
          time : undefined,
          timer : "paused",
          timeStarted : undefined,
          countdownTimer : 0
        }

        */

        $scope.currentQn = findQuestionWithId($scope.quiz.currentQn);

        $scope.localQuizState.quizId = $scope.quiz._id;
        $scope.localQuizState.questionId = $scope.quiz.currentQn;
        $scope.localQuizState.time = $scope.currentQn.timeAllowed;
        $scope.localQuizState.timer = "paused";
        $scope.localQuizState.timeStarted = undefined;
        $scope.localQuizState.countdownTimer = $scope.currentQn.timeAllowed;
        $scope.localQuizState.countdownTimerInterval = undefined;

        initAnswersRead();


      });

      $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        $scope.stopCountdown();
      });

      var initAnswersRead = function(){
        $scope.localQuizState.answersRead = [];
        for(team in $scope.quiz.teams){
          team = $scope.quiz.teams[team];
          $scope.localQuizState.answersRead.push({
            _id : team._id,
            memberNames : team.memberNames,
            teamNumber : team.teamNumber,
            answered : false,
            answerNumber: undefined
          })
        }
      }

      var initTeam = function(){
        //Team init
        $scope.team = {
          _id: undefined,
          memberNames: [undefined],
          teamNumber: undefined
        }
      };

      initTeam();

      $scope.addTeammate = function(){
        $scope.team.memberNames.push("");
      };
      $scope.addUpdateTeam = function(){
        if ($scope.quiz.teams == undefined || typeof($scope.quiz.teams) != 'object'){
          //team init
          $scope.quiz.teams = [];
        }
        var filteredTeams = $scope.quiz.teams.filter(function(team){
            return $scope.team._id != team._id && $scope.team.teamNumber != team.teamNumber;
        });
        filteredTeams.push($scope.team);
        $scope.quiz.teams = filteredTeams;
        initTeam();
      };
      $scope.editTeam = function(teamId){
        $scope.team = $scope.quiz.teams.filter(function(team){
            return teamId == team._id;
        })[0];
      };
      $scope.deleteTeam = function(teamId) {
        $scope.quiz.teams = $scope.quiz.teams.filter(function(team){
            return teamId != team._id;
        });
      };
      $scope.clearTeamForm = function() {
        initTeam();
      }

      var initQuestion = function(){
        //Question init
        $scope.question = {
          _id: undefined,
          imageUrl: undefined,
          content: undefined,
          possibleAnswers: [undefined],
          correctAnswer: undefined,
          score: undefined,
          timeAllowed: undefined
        }
      };

      initQuestion();

      $scope.addAnswer = function(){
        $scope.question.possibleAnswers.push("");
      };
      $scope.addUpdateQuestion = function(){
        if ($scope.quiz.questions == undefined || typeof($scope.quiz.questions) != 'object'){
          //team init
          $scope.quiz.questions = [];
        }
        var filteredQuestions = $scope.quiz.questions.filter(function(question){
            return $scope.question._id != question._id;
        });
        filteredQuestions.push($scope.question);
        $scope.quiz.questions = filteredQuestions;
        initQuestion();
      };
      $scope.editQuestion = function(questionId) {
        $scope.question = $scope.quiz.questions.filter(function(question){
            return questionId == question._id;
        })[0];
      };
      $scope.deleteQuestion = function(questionId) {
        $scope.quiz.questions = $scope.quiz.questions.filter(function(question){
            return questionId != question._id;
        });
      };
      $scope.clearQuestionForm = function() {
        initQuestion();
      }

      $scope.testAlert = function(){
        $alert({
          content: 'HELLO. ' + $scope.team.teamNumber,
          placement: 'top-right',
          type: 'success',
          duration: 3
        });
      };

      /*

      Old code

      $scope.updateQuiz = function() {
        Quiz.save({quiz: $scope.quiz},
        function() {
          $alert({
            content: 'Quiz has been saved.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        },
        function(response) {
          $alert({
            content: response.data.message,
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
        });
      };

      */



      ioSocketClientServer.on('updateQuiz', function(quizUpdate){
        $scope.quiz = quizUpdate;
        //Code below needs to change due to way nextquestion and prevQn are handled.
        $scope.localQuizState.questionId = $scope.quiz.currentQn;
        $scope.restartTimer();
      });

      $scope.updateQuiz = function() {
        ioSocketClientServer.emit('updateQuiz', $scope.quiz);
      };



      var writeCardUrl = function (url){
        var xmlHttp = new XMLHttpRequest();
        //xmlHttp.responseType = "json";
        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        $alert({
          content: xmlHttp.responseText,
          placement: 'top-right',
          type: 'success',
          duration: 3
        });
        return xmlHttp.response;
      };

      $scope.writeCard = function(node, teamNumber, answerNumber) {
        var playerName = $scope.quiz.teams.filter(function(team){
          return teamNumber == team.teamNumber;
        })[0].memberNames[answerNumber];
        if (node == 1){
          writeCardUrl("http://beaglenode1:3000/writeCard/"+playerName+"/"+teamNumber+"/"+(answerNumber + 1));
        }else if (node == 2){
          writeCardUrl("http://beaglenode2:3000/writeCard/"+playerName+"/"+teamNumber+"/"+(answerNumber + 1));
        };
      };

      var readCardUrl = function (url){
        var xmlHttp = new XMLHttpRequest();
        //xmlHttp.responseType = "json";
        xmlHttp.open("GET", url, false);
        xmlHttp.send();
        if (xmlHttp.responseText == ""){
          $alert({
            content: "There is no card!",
            placement: 'top-right',
            type: 'danger',
            duration: 3
          });
          return
        };
        var resJSON = JSON.parse(xmlHttp.responseText)
        $alert({
          content: "<p> Card read successful!</p><p>Name: " + resJSON.name + " | Team Number: " + resJSON.teamNumber + " | Answer Number: " + resJSON.answerNumber + "</p>", //"<p>" + xmlHttp.responseText + "</p><p>Name: " + resJSON.name + " | Team Number: " + resJSON.teamNumber + " | Answer Number: " + resJSON.answerNumber + "</p>",
          placement: 'top-right',
          type: 'success',
          duration: 3
        });
        return xmlHttp.response;
      };

      $scope.readCard = function(node) {
        if (node == 1){
          readCardUrl("http://beaglenode1:3000/readCard/");
        }else if (node == 2){
          readCardUrl("http://beaglenode2:3000/readCard/");
        };
      };

      $scope.playQuiz = function(){
        $scope.quiz.status = 'Playing';
        $scope.updateQuiz();
      };
      $scope.pauseQuiz = function(){
        $scope.quiz.status = 'Paused';
        $scope.updateQuiz();
      };
      $scope.restartQuiz = function(){
        $scope.quiz.status = 'Not Played';
        $scope.quiz.currentQn = 0;
        $scope.quiz.teamScores = [];
        $scope.quiz.teamAnswers = [];
        $scope.updateQuiz();
      };
      $scope.endQuiz = function(){
        $scope.quiz.status = 'Ended';
        $scope.updateQuiz();
      };
      $scope.nextQuestion = function(){
        if ($scope.localQuizState.questionId > $scope.quiz.questions.length - 1) {return;};
        $scope.localQuizState.questionId += 1;
        $scope.quiz.currentQn = $scope.localQuizState.questionId;
        $scope.restartTimer();
        $scope.updateQuiz();
      };
      $scope.previousQuestion = function(){
        if ($scope.localQuizState.questionId <= 1) {return;};
        $scope.localQuizState.questionId -= 1;
        $scope.quiz.currentQn = $scope.localQuizState.questionId;
        $scope.restartTimer();
        $scope.updateQuiz();
      };
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

      var findQuestionWithId = function(questionId){
        var questionArray = $scope.quiz.questions.filter(function(question){
          return question._id == questionId;
        });
        if (questionArray.length == 0){return undefined;};
        return questionArray[0];
      };

      var findTeamWithId = function(teamId){
        var teamArray = $scope.quiz.teams.filter(function(team){
          return team._id == teamId;
        });
        if (teamArray.length == 0){return undefined;};
        return teamArray[0];
      };




      $scope.startTimer = function(){
        if (!checkPlayable() || $scope.localQuizState.timer == 'started' || $scope.localQuizState.time <= 0){return;};
        startCountdown();
        ioSocketClientServer.emit('startTimer', {
          quizId: $scope.localQuizState.quizId,
          questionId : $scope.localQuizState.questionId,
          time : $scope.localQuizState.time,
          authorId : $rootScope.currentUser._id
        });
      };

      ioSocketClientServer.on('timerStarted', function(quizState){

        $scope.localQuizState.quizId = quizState.quizId;
        $scope.localQuizState.questionId = quizState.questionId;
        $scope.localQuizState.time = quizState.time;
        $scope.localQuizState.timer = 'started';
        if (!checkPlayable() || $scope.localQuizState.time <= 0){return;};
        startCountdown();
      });

      $scope.pauseTimer = function(){
        if (!checkPlayable() || $scope.localQuizState.timer == 'paused'){return;};
        stopCountdown();
        ioSocketClientServer.emit('pauseTimer', {
          quizId: $scope.localQuizState.quizId,
          questionId : $scope.localQuizState.questionId,
          time : $scope.localQuizState.time,
          authorId : $rootScope.currentUser._id
        });
      };

      ioSocketClientServer.on('timerPaused', function(quizState){
        $scope.localQuizState.quizId = quizState.quizId;
        $scope.localQuizState.questionId = quizState.questionId;
        $scope.localQuizState.time = quizState.time;
        $scope.localQuizState.timer = 'paused';
        if (!checkPlayable()){return;};
        $interval.cancel($scope.localQuizState.countdownTimerInterval);
      });

      $scope.restartTimer = function(){
        if (!checkPlayable()){return;};
        $scope.currentQn = findQuestionWithId($scope.localQuizState.questionId);
        if ($scope.currentQn == undefined){
          $alert({
            content: 'Unable to find question.',
            placement: 'top-right',
            type: 'success',
            duration: 3
          });
        }else{
          $scope.localQuizState.timeStarted = undefined;
          $scope.localQuizState.time = $scope.currentQn.timeAllowed;
          $scope.localQuizState.countdownTimer = $scope.localQuizState.time;
          $interval.cancel($scope.localQuizState.countdownTimerInterval);
          $scope.localQuizState.timer = "paused";
          initAnswersRead();
          ioSocketClientServer.emit('initTimer', {
            quizId: $scope.localQuizState.quizId,
            questionId : $scope.localQuizState.questionId,
            time : $scope.localQuizState.time,
            authorId : $rootScope.currentUser._id
          });
        };
      };

      ioSocketClientServer.on('timerInit', function(quizState){
        $interval.cancel($scope.localQuizState.countdownTimerInterval);
        $scope.localQuizState.quizId = quizState.quizId;
        $scope.localQuizState.questionId = quizState.questionId;
        $scope.localQuizState.time = quizState.time;
        $scope.localQuizState.timer = 'paused';
        $scope.localQuizState.countdownTimer = $scope.localQuizState.time;
        $scope.localQuizState.timeStarted = undefined;
        initAnswersRead();
      });

      //To be done later



      ioSocketClientServer.on('answerRead', function(cardData){
        if (localQuizState.quizId != cardData.quizId || localQuizState.questionId != cardData.questionId){return;};
        for(team in $scope.localQuizState.answersRead){
          team = $scope.localQuizState.answersRead[team];
          if(team.teamNumber == cardData.teamNumber) {team.answered = true}
        }
      });

      ioSocketClientServer.on('dataFromDB', function(answerMatrix){
        for (answer in answerMatrix){
          answer = answerMatrix[answer];
          for (team in $scope.localQuizState.answersRead){
            team = $scope.localQuizState.answersRead[team];
            if (localQuizState.quizId != answer.quizId || localQuizState.questionId != answer.questionId){return;};
            if(team.teamNumber == answer.teamNumber) {
              team.answered = true;
              team.answerNUmber = answer.answerNumber;
            };
          };
        };
      });

    }]);
