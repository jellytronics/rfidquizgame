angular.module('MyApp').factory('ioSocketClientServer', function ($rootScope) {
  //http://www.html5rocks.com/en/tutorials/frameworks/angular-websockets/
  var ioSocketClientServer = io.connect("localhost:3001");
  return {
    on: function (eventName, callback) {
      ioSocketClientServer.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(ioSocketClientServer, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      ioSocketClientServer.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(ioSocketClientServer, args);
          }
        });
      })
    }
  };
});
