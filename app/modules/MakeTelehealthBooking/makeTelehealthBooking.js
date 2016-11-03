/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.MakeTelehealthBooking',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.makeTelehealthBooking",{
                abstract:false,
                url:"/makeTelehealthBooking",
                templateUrl: "modules/MakeTelehealthBooking/views/makeTelehealthBooking.main.html",
                controller: "MakeTelehealthBookingMainCtrl",
                controllerAs: "MakeTelehealthBookingMainCtrl"
            });

    }]);
