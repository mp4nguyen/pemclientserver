/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Settings',['lbServices','toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.settings",{
                abstract:false,
                url:"/settings",
                templateUrl: "modules/Settings/views/settings.main.html",
                controller: "SettingsMainCtrl",
                controllerAs: "SettingsMainCtrl"
            });
    }]);
