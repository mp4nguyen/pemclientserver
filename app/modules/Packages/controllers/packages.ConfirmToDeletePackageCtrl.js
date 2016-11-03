/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('ConfirmToDeletePackageCtrl',['$uibModalInstance', function ($uibModalInstance) {

        this.ok = function () {
            $uibModalInstance.close({});
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

