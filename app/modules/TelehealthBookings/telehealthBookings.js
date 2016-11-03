/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.TelehealthBookings',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.telehealthBookings",{
                abstract:false,
                url:"/telehealthBookings",
                templateUrl: "modules/TelehealthBookings/views/telehealthBookings.main.html",
                controller: "TelehealthBookingsMainCtrl",
                controllerAs: "TelehealthBookingsMainCtrl"
            });

    }]);
