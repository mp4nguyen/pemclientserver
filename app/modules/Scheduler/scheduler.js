/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.Scheduler',['toastr','ui.calendar'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.scheduler",{
                abstract:false,
                url:"/scheduler",
                templateUrl: "modules/Scheduler/views/scheduler.main.html",
                controller: "SchedulerMainCtrl",
                controllerAs: "SchedulerMainCtrl"
            });

    }]);
