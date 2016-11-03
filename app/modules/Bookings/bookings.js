/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Bookings',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.bookings",{
                abstract:false,
                url:"/bookings",
                templateUrl: "modules/Bookings/views/bookings.main.html",
                controller: "BookingsMainCtrl",
                controllerAs: "BookingsMainCtrl"
            });

    }]);
