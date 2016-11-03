'use strict';

/**
 * @ngdoc overview
 * @name ocsApp
 * @description
 * # ocsApp
 *
 * Main module of the application.
 */
angular
    .module('ocsApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngTouch',
        'ui.router',
        'ui.grid',
        'ui.grid.resizeColumns',
        'ui.grid.selection',
        'ui.grid.exporter',
        'ui.bootstrap',
        'ui.bootstrap.datetimepicker',
        'checklist-model',
        'ocsApp.Authentication',
        'agGrid',
        'frapontillo.bootstrap-switch',
        'ui.select',
        'acute.select',
        '$logServices',
        'helper',
        'lbServices',
        '$dynamicState'
    ])
    //Turn on /off $log.debug
    .config(['$logProvider', function($logProvider){
        $logProvider.debugEnabled(true);
        console.log('initial app with href = ',window.location.href,window.location.port);
    }])
    .config(['$stateProvider','$httpProvider',function($stateProvider,$httpProvider){
        // CORS PROXY
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        // END CORS PROXY
        $stateProvider
            .state("init",{
                url: "/",
                resolve: {
                    initHome: function($timeout,$state,$cookieStore){
                        $state.go("authentication.login");//authentication.login  navigator
                    }
                }
            });
    }])
    .run(['$state','$rootScope','$location','SetClassService',function($state,$rootScope,$location,SetClassService){
        console.log($location.url());
        $rootScope.$state = $state;
        if($location.url().indexOf('reset-pass')>=0 || $location.url().indexOf('bookingForm')>=0 ) {
            console.log("$location.url() = ",$location.url());
        }
        else if($location.url().indexOf('bookingreports')>=0 ) {
            SetClassService.setClass(1);
            console.log("$location.url() = ",$location.url());
        }else{
            $state.go("init");
        }
    }])
    // By default, AngularJS will catch errors and log them to
    // the Console. We want to keep that behavior; however, we
    // want to intercept it so that we can also log the errors
    // to the server for later analysis.
    .provider("$exceptionHandler",
    {
        $get: function( errorLogService ) {
            return( errorLogService );
        }
    }
    )
    // The "stacktrace" library that we included in the Scripts
    // is now in the Global scope; but, we don't want to reference
    // global objects inside the AngularJS components - that's
    // not how AngularJS rolls; as such, we want to wrap the
    // stacktrace feature in a proper AngularJS service that
    // formally exposes the print method.
    .factory("stacktraceService",function() {
        // "printStackTrace" is a global object.
        return({
            print: printStackTrace
        });
    })
    .factory("AddDataToClientLogs",function(apiServerUrl){
        return function(data) {
            $.post(apiServerUrl + "/ClientLogs", data);
        }
    })
    //share service is used to communicate between controllers in the app.
    .factory('mySharedService', function($rootScope) {
        var sharedService = {};

        sharedService.message = '';

        sharedService.prepForBroadcast = function(msg) {
            this.message = msg;
            this.broadcastItem();
        };

        sharedService.broadcastItem = function() {
            $rootScope.$broadcast('handleBroadcast');
        };

        return sharedService;
    })
    .factory('SetClassService', function() {
        var classId = 0;

        return{
            setClass:function(i){ classId = i},
            getClass:function(){ return classId}
        };

    })
    // The error log service is our wrapper around the core error
    // handling ability of AngularJS. Notice that we pass off to
    // the native "$log" method and then handle our additional
    // server-side logging.
    .factory("errorLogService",function($log, $window, stacktraceService, browser,fingerPrint,AddDataToClientLogs,LocationOfClientFactory) {
        // I log the given error to the remote server.
        function log( exception, cause ) {
            // Pass off the error to the default error handler
            // on the AngualrJS logger. This will output the
            // error to the console (and let the application
            // keep running normally for the user).
            $log.error.apply( $log, arguments );
            // Now, we need to try and log the error the server.
            // --
            // NOTE: In production, I have some debouncing
            // logic here to prevent the same client from
            // logging the same error over and over again! All
            // that would do is add noise to the log.
            try {
                var errorMessage = exception.toString();
                var stackTrace = stacktraceService.print({ e: exception });
                // Log the JavaScript error to the server.
                // --
                // NOTE: In this demo, the POST URL doesn't
                // exists and will simply return a 404.

//                    userid: 0,

                LocationOfClientFactory.getLocation(function(location){
                    location.errormessage = errorMessage;
                    location.stacktrace = stackTrace;
                    location.cause = ( cause || "");
                    console.log("errorLogService",location);
                    AddDataToClientLogs(location);
                });

            } catch ( loggingError ) {
                // For Developers - log the log-failure.
                $log.warn( "Error logging failed" );
                $log.log( loggingError );
            }
        }
        // Return the logging function.
        return( log );
    }
    )
    .directive('datePicker', function(){
        return {
            restrict : "A",
            require: 'ngModel',
            link : function(scope, element, attrs, ngModel){
                $(function(){
                    $(element).datepicker({
                        dateFormat: 'dd/mm/yy',
                        changeMonth: true,
                        changeYear: true,
                        closeText: 'Clear',
                        showButtonPanel: true,
                        onClose: function () {
                            var event = arguments.callee.caller.caller.arguments[0];
                            // If "Clear" gets clicked, then really clear it
                            if ($(event.delegateTarget).hasClass('ui-datepicker-close')) {
                                $(this).val('');
                                scope.$apply(function() {
                                    ngModel.$setViewValue(null);
                                });
                            }
                        },
                        onSelect: function(date){
                            scope.$apply(function() {
                                ngModel.$setViewValue(date);
                            });
                        }
                    });
                })
            }
        }
    })
    .factory('mySocket', ['serverUrl',function(serverUrl){
      //Creating connection with server
      console.log('will open socket io with url',serverUrl);
      var socket = io.connect(serverUrl);

      //This part is only for login users for authenticated socket connection between client and server.
      //If you are not using login page in you website then you should remove rest piece of code..

      socket.on('connect', function(s){
          console.log('Socket opened with object = ',s);
      });

      socket.on('welcome', function(data){
          console.log('welcome = ',data);
      });

      socket.emit('msg',{user: 'I am angular'});

      return socket;

    }]);
