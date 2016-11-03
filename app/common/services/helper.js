/**
 * Created by phuongnguyen on 18/01/16.
 */

var getPort = function(){
    console.log("Current length port is : " +(window.location.port.length   + ""));
    if(window.location.port.length ==0)
    {
        console.log('api port = 443');
        return 443;
    }else{
        console.log('api port = 2000');
        return 8181;
    }
};

angular
    .module('helper', [
    ])
    .factory("apiServerUrl",function() {
        // "printStackTrace" is a global object.
        return "https://medicalbookings.redimed.com.au:"+getPort()+"/api";
    })
    .factory("serverUrl",function() {
        // "printStackTrace" is a global object.
        return "https://medicalbookings.redimed.com.au:"+getPort();
    })
    //  Fingerprint library is the global scope, but we want use as service in angular
    // this is used to indentify the computer of the user
    .service("fingerPrint",function() {
        // "Fingerprint" is a global object.
        return function(){
            var fingerPrint = new Fingerprint().get();
            return fingerPrint;
        };
    })
    /// This service is used to provide the browser name of the client
    .service('browser', ['$window', function($window) {

        var userAgent = $window.navigator.userAgent;
        var browser = 'unknow';
        console.log("userAgent = ",userAgent);
        var browsers = {edge:/Edge/i,chrome: /chrome/i, safari: /safari/i, firefox: /firefox/i, ie11: /Trident/i, ie10: /MSIE 10/i, ie9: /MSIE 9/i, ie8: /MSIE 8/i, ie7: /MSIE 7/i, ie6: /MSIE 6/i};

        for(var key in browsers) {
            if (browsers[key].test(userAgent)) {
                browser = key;
                break;
            }
        };

        return function() {
            console.log("browser = ",browser);
            return browser;
        }

    }])
    .factory('LocationOfClientFactory',['browser','fingerPrint','$window',function(browser,fingerPrint,$window){

        var location;
        return{
            getLocation: function(cb){
                //console.log("LocationOfClientFactory 1",location);
                if(location){
                    location.errortime =  moment().format('YYYY/MM/DD h:mm:ss a');
                    //console.log("LocationOfClientFactory 5",location);
                    cb(location);
                }else{
                    // by default, use the service from http://ipinfo.io/json , however, this service just allow to call 1000 api per day
                    // so, if excess the limit, will call http://api.ipify.org/?format=json to get the IP

                    /*
                    $.get("http://ipinfo.io/json")
                        .success(function(ipData){
                            //console.log("LocationOfClientFactory 2",ipData);
                            location = {};
                            location.ip = ipData.ip;
                            location.hostname = ipData.hostname;
                            location.region = ipData.region;
                            location.country = ipData.country;
                            location.loc = ipData.loc;
                            location.org = ipData.org;
                            location.postal = ipData.postal;
                            location.browser =browser();
                            location.fingerprint = fingerPrint();
                            location.errorurl = $window.location.href;
                            location.errortime =  moment().format('YYYY/MM/DD h:mm:ss a');
                            console.log(">>LocationOfClientFactory",location);
                            cb(location);
                        })
                        .error(function(e){
                            //console.log("LocationOfClientFactory 4",e);
                            $.get("https://api.ipify.org/?format=json").success(function(ipData){
                                    //console.log("LocationOfClientFactory 3",ipData);
                                    location = {};
                                    location.ip = ipData.ip;
                                    location.browser =browser();
                                    location.fingerprint = fingerPrint();
                                    location.errorurl = $window.location.href;
                                    location.errortime =  moment().format('YYYY/MM/DD h:mm:ss a');

                                    console.log(">>LocationOfClientFactory",location);
                                    cb(location);
                                });
                        });
                    */
                    $.get("https://api.ipify.org/?format=json").success(function(ipData){
                            //console.log("LocationOfClientFactory 3",ipData);
                            location = {};
                            location.ip = ipData.ip;
                            location.browser =browser();
                            location.fingerprint = fingerPrint();
                            location.errorurl = $window.location.href;
                            location.errortime =  moment().format('YYYY/MM/DD h:mm:ss a');

                            //console.log(">>LocationOfClientFactory",location);
                            cb(location);
                        });
                }
            }
        }

    }])
    // Converts MySQL datetime into readable format
    /*
     Converts 2013-10-18T18:47:15.00 into 1382122035000 so angular can format date
     */
    .filter('dateFilter', function() {
        return function(dateSTR) {
            if(dateSTR){
                var t = dateSTR.split(/[- : T .]/);
                // Apply each element to the Date function
                var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                //console.log(t,"   ",d);
                return d; // No TZ subtraction on this sample
            }
            return "";
        }
    })
    .factory('mysqlDate',function(){
        return function(dateSTR) {
            if(dateSTR){
                //console.log(dateSTR);
                var t = dateSTR.split(/[- : T .]/);
                // Apply each element to the Date function
                if(t.length >=6){
                    var d = new Date(t[0], t[1]-1, t[2], t[3], t[4], t[5]);
                    //console.log(t,"   ",d);
                    return d; // No TZ subtraction on this sample
                }else{
                    var d = new Date(t[0], t[1]-1, t[2]);
                    //console.log(t,"   ",d);
                    return d; // No TZ subtraction on this sample
                }

            }
            return "";
        }
    })
    .factory('storeToken',function(){
        var accessToken = "";

        return {
            setAccessToken: function(tk){
                accessToken = tk;
            },
            getAccessToken: function(){
                return accessToken;
            }
        };
    });
