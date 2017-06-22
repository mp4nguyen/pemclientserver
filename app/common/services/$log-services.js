/**
 * Created by phuongnguyen on 7/12/15.
 */
var module = angular.module("$logServices", ['helper']);

module.config(['$provide',function ($provide) {

    var buildTimeString = function (date, format)
    {
        format = format || "%Y/%M/%d %h:%m:%s.%z";

        function pad(value, isMilliSeconds)
        {
            if(typeof (isMilliSeconds) === "undefined")
            {
                isMilliSeconds = false;
            }
            if(isMilliSeconds)
            {
                if(value < 10)
                {
                    value = "00" + value;
                }
                else if(value < 100)
                {
                    value = "0" + value;
                }
            }
            return(value.toString().length < 2) ? "0" + value : value;
        }

        return format.replace(/%([a-zA-Z])/g, function (_, fmtCode)
        {
            switch(fmtCode)
            {
                case "Y":
                    return date.getFullYear();
                case "M":
                    return pad(date.getMonth() + 1);
                case "d":
                    return pad(date.getDate());
                case "h":
                    return pad(date.getHours());
                case "m":
                    return pad(date.getMinutes());
                case "s":
                    return pad(date.getSeconds());
                case "z":
                    return pad(date.getMilliseconds(), true);
                default:
                    throw new Error("Unsupported format code: " + fmtCode);
            }
        });
    };


    var supplant =  function( template, values, pattern ) {
        pattern = pattern || /\{([^\{\}]*)\}/g;

        return template.replace(pattern, function(a, b) {
            var p = b.split('.'),
                r = values;

            try {
                for (var s in p) { r = r[p[s]];  }
            } catch(e){
                r = a;
            }

            return (typeof r === 'string' || typeof r === 'number') ? r : a;
        });
    };




    //enhance $log so, it can log everything to the server
    /* Information about AngularJS decorator can be found at:
     * https://docs.angularjs.org/api/auto/service/$provide
     */

    $provide.decorator('$log', ['$delegate','$window','LocationOfClientFactory','apiServerUrl',function ($delegate,$window,LocationOfClientFactory,apiServerUrl){
        // delegate is the original instance of $log
        var logBuffer = [];
        var levels = ['debug', 'info', 'warn', 'error'];
        var contentType = 'application/json; charset=UTF-8';
        var user = {};
        var accessToken = "";
        var locationData = {};
        LocationOfClientFactory.getLocation(function(data){
            locationData = data;
            //console.log(">>$provide.decorator",locationData);
        });


        _.each(levels, function (level) {
            //console.log("$log-services.level = ",level);

            // storing the original function
            var original = $delegate[level];

            // creating a wrapped version of each $log level function
            // _.wrap is from the underscore.js library
            $delegate[level] = _.wrap(original, function (original) {

                // logger data to be sent/logged to console
                var data = Array.prototype.slice.call(arguments, 1);
                // call to the original function which will write to the console
                original.apply($delegate, data);

                /* The angular $http service cannot be used in the $log
                 * decorator because it will cause a circular dependecy.
                 * To overcome this  a direct ajax call should be made.
                 */
                //console.log(">>>log = ",data);
                var logRecord = {
                    userid: user.id,
                    logtime:  buildTimeString(new Date()),
                    content1: data[0],
                    browser: locationData.browser,
                    country: locationData.country,
                    fingerprint: locationData.fingerprint,
                    ip: locationData.ip,
                    loc: locationData.loc,
                    region: locationData.region
                };

                if(data.length > 1){
                    logRecord.content2 = CircularJSON.stringify(data[1]);///JSON.stringify(data[1]) + ".";
                    //console.log("logRecord.content2="+logRecord.content2);
                }

                logBuffer.push(logRecord);

                //console.log(" >>>>>>>>> $log:",logBuffer.length,logBuffer);
                //saving logs
                if(logBuffer.length > 8){
                    /*
                    $.ajax({
                        url: "http://localhost:3000/api/AngularLogs/insertLogs",
                        crossDomain: true
                        method: 'POST',
                        data:{logs:logBuffer},
                        success: function(data){
                            //console.log('succes: '+data);
                            logBuffer = [];
                        }
                    });
                    */
                    save();
                }
            });
        });

        var save = function(){
            //console.log(" >>>>>>>>> $log: saving.....",logBuffer);
            var tempLogBuffer = logBuffer;
            logBuffer = [];
            if(user && user.id != 3){
                $.post(apiServerUrl + "/AngularLogs/insertLogs?access_token="+accessToken, {logs:tempLogBuffer}).then(function(succ){

                },
                function(err){
                    //console.log("Insert into logs fail ",err);
                });
            }
        };

        var getBrowser = function() {

            var userAgent = $window.navigator.userAgent;

            var browsers = {chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie: /internet explorer/i};

            for(var key in browsers) {
                if (browsers[key].test(userAgent)) {
                    return key;
                }
            };

            return 'unknown';
        };

        colorify = function (message, colorCSS)
        {
            var isChrome = (getBrowser() == "chrome") || (getBrowser() == "phantomjs") ,
                canColorize = isChrome && (colorCSS !== undefined);

            return canColorize ? ["%c" + message, colorCSS] : [message];
        };

        var prepareLogFn = function (logFn,logName, className, colorCSS)
        {
            /**
             * Invoke the specified `logFn` with the supplant functionality...
             */
            var enhancedLogFn = function ()
            {
                try
                {
                    var args = Array.prototype.slice.call(arguments),
                        now = buildTimeString(new Date());

                    // prepend a timestamp and optional classname to the original output message
                    //console.log(" >>>>>>>>>>>>prepareLogFn.args = ", args);
                    args[0] = supplant("{0} - {1}{2}", [now, className, args[0]]);
                    //console.log("args[0] = ",args[0]);
                    //console.log("args = ",args);
                    //args = colorify( args[0], colorCSS);
                    //console.log("args = ",args);
                    //console.log(" >>>>>>>>>>>>prepareLogFn.args = ", args);
                    logFn.apply(null, args);
                    if(logName.indexOf('error') >= 0){
                        save();
                    }

                }
                catch(error)
                {
                    console.log("LogEnhancer ERROR: " + error);
                }

            };

            // Only needed to support angular-mocks expectations
            enhancedLogFn.logs = [];

            return enhancedLogFn;
        };

        var getInstance = function (className, colorCSS, customSeparator)
        {
            //console.log("$log.getInstance ok");

            var separator = "::";

            className = (className !== undefined) ? className + (customSeparator || separator) : "";

            //Add setUser meothod to $log
            $delegate.setUser = function(userObj){
                user = userObj;
                //console.log("$log.setUser = ",userObj);
            };

            $delegate.setAccessToken = function(tk){
                accessToken = tk;
                //console.log("$log.setAccessToken = ",accessToken);
            };

            $delegate.save = save;

            var instance = {
                log: prepareLogFn($delegate.log,'log', className, colorCSS),
                info: prepareLogFn($delegate.info,'info', className, colorCSS),
                warn: prepareLogFn($delegate.warn,'warn', className, colorCSS),
                debug: prepareLogFn($delegate.debug,'debug', className, colorCSS),
                error: prepareLogFn($delegate.error,'error', className), // NO styling of ERROR messages
                setAccessToken : $delegate.setAccessToken,
                setUser : $delegate.setUser,
                save: $delegate.save
            };

            return instance;
        };

        // Add special method to AngularJS $log
        $delegate.getInstance = getInstance;

        //Add setUser meothod to $log
        $delegate.setUser = function(userObj){
            user = userObj;
            //console.log("$log.setUser = ",userObj);
        };

        $delegate.save = save;

        // returning to $log object with the new wrapped log-level functions
        return $delegate;
    }
    ]);
}
]);
