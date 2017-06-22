/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Scheduler')
    .controller('EditRosterCtrl',['$uibModalInstance','fromTime','toTime','isRemove', function ($uibModalInstance,fromTime,toTime,isRemove) {

        var that = this;
        this.dateStatus = {};
        this.dateStatus.fromTimeOpened = false;
        this.dateStatus.toTimeOpened = false;
        this.format = "dd/MM/yyyy HH:mm:ss";
        this.fromTime = new Date(fromTime.format('YYYY-MM-DD HH:mm:ss'));
        this.toTime = new Date(toTime.format('YYYY-MM-DD HH:mm:ss'));
        this.title = "Do you want to remove slots ?";
        this.header = "Remove Slots";
        if(!isRemove){
          this.title = "Do you want to unremove slots ?";
          this.header = "Unremove Slots";
        }

        this.openFromTime = function($event) {
            that.dateStatus.fromTimeOpened = true;
        };

        this.openFromTime = function($event) {
            that.dateStatus.toTimeOpened = true;
        };

        this.ok = function () {
            $uibModalInstance.close({fromTime:that.fromTime,toTime:that.toTime});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
