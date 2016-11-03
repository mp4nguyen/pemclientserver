/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Positions',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.positions",{
                abstract:false,
                url:"/positions",
                templateUrl: "modules/Positions/views/positions.main.html",
                controller: "PositionsMainCtrl",
                controllerAs: "PositionsMainCtrl"
            });

    }]);
