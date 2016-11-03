/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakeTelehealthBooking').controller('NewTelehealthCompanyCtrl',['$uibModalInstance','$log',function ( $uibModalInstance,$log) {
    $log = $log.getInstance("ocsApp.MakeTelehealthBooking.NewTelehealthCompanyCtrl");
    $log.debug("NewCompanyCtrl is running...");
    var that = this;
    this.company = {};
    this.companyObject = null;
    this.isSubmitted = false;
    this.form = {};

    this.ok = function () {
        that.isSubmitted = true;
        $log.debug("OK to exit modal valid=",that.form.$valid);
        $log.debug("OK to exit modal invalid=",that.form.$invalid);
        $log.debug("OK to exit modal error=",that.form.$error);
        if(that.form.$valid){
            $uibModalInstance.close(that.company);
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
