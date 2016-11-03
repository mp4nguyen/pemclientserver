/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.MakeBooking',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.makeBooking",{
                abstract:false,
                url:"/makeBooking",
                templateUrl: "modules/MakeBooking/views/makeBooking.main.html",
                controller: "MakeBookingMainCtrl",
                controllerAs: "MakeBookingMainCtrl"
            });

    }]);
