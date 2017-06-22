/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Authentication',
    [
        'toastr',
        'lbServices',
        'ocsApp.Navigator'
    ])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("authentication",{
                abstract:true,
                views:{
                    "root":{
                        templateUrl: "modules/Authentication/views/authen.main.html",
                        controller: "AuthenMainCtrl",
                        controllerAs: "AuthenMainCtrl"
                    }
                }
            })
            //main page of login
            .state("authentication.login",{
                url: "/",
                views:{
                    "main-content":{
                        templateUrl: "modules/Authentication/views/authen.login.html",
                        controller: "LoginCtrl",
                        controllerAs: "loginCtrl"
                    }
                }
            })
            //forgot password page
            .state("authentication.forgotpass",{
                url: "/forgotpass",
                views:{
                    "main-content":{
                        templateUrl: "modules/Authentication/views/authen.forgotpass.html",
                        controller: "ForgotPasswordCtrl",
                        controllerAs: "forgotPasswordCtrl"
                    }
                }
            })
            //reset password page
            .state("authentication.resetpass",{
                url: "/reset-pass/:token",
                views:{
                    "main-content":{
                        templateUrl: "modules/Authentication/views/authen.resetpass.html",
                        controller: "ResetPasswordCtrl",
                        controllerAs: "resetPasswordCtrl"
                    }
                }
            })
            .state("authentication.bookingreportsdirectly",{
                url: "/bookingreports",
                views:{
                    "main-content":{
                        templateUrl: "modules/BookingReports/views/bookingreports.main.html",
                        controller: "BookingReportsMainCtrl",
                        controllerAs: "BookingReportsMainCtrl"

                    }
                }
            })
            //Registration page
            .state("authentication.registration",{
                url: "/registration",
                views:{
                    "main-content":{
                        templateUrl: "modules/Authentication/views/authen.registration.html"
                    }
                }
            })
    }]);
