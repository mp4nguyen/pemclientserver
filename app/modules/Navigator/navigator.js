/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Navigator',
    [
        'toastr',
        'ocsApp.MakeBooking',
        'ocsApp.MakePEMPhoneBooking',
        'ocsApp.MakeTelehealthBooking',
        'ocsApp.TelehealthBookings',
        'ocsApp.Bookings',
        'ocsApp.Positions',
        'ocsApp.Packages',
        'ocsApp.Settings',
        'ocsApp.BookingReports',
        'ocsApp.Companies',
        'ocsApp.Sites',
        'ocsApp.Scheduler',
        'ngIdle',
        'ui.bootstrap',
    ])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator",{
                abstract:false,
                url:"/navigator",
                views:{
                    "root":{
                        templateUrl: "modules/Navigator/views/navigator.main.html",
                        controller: "NavigatorMainCtrl",
                        controllerAs: "NavigatorMainCtrl"
                    }
                }
            });

    }])
    .config(['IdleProvider', 'KeepaliveProvider',function(IdleProvider, KeepaliveProvider) {
        //configue idle to logout the system after a period time
        IdleProvider.idle(60*15);
        IdleProvider.timeout(10);
        KeepaliveProvider.interval(10);
    }])
    .run(['Idle',function(Idle){
        Idle.watch();//start idle to manage the session of the user
    }]);
