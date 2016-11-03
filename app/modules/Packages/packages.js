/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Packages',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.packages",{
                abstract:false,
                url:"/packages",
                templateUrl: "modules/Packages/views/packages.main.html",
                controller: "PackagesMainCtrl",
                controllerAs: "PackagesMainCtrl"
            });

    }]);
