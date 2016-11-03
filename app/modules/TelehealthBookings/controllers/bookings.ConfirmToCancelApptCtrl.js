/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Bookings')
    .controller('ConfirmToCancelApptCtrl',['$uibModalInstance', function ($uibModalInstance) {

        this.ok = function () {
            $uibModalInstance.close({});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

