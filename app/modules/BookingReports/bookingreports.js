/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.BookingReports',['toastr','zingchart-angularjs'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.bookingreports",{
                abstract:false,
                url:"/bookingreports",
                templateUrl: "modules/BookingReports/views/bookingreports.main.html",
                controller: "BookingReportsMainCtrl",
                controllerAs: "BookingReportsMainCtrl"
            });

    }]);
