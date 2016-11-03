/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakeBooking').controller('CustomPackageCtrl',['$uibModalInstance','CompanyFactory','$log',function ( $uibModalInstance, CompanyFactory,$log) {
    $log = $log.getInstance("ocsApp.MakeBooking.CustomPackageCtrl");
    $log.debug("I am CustomPackageCtrl");
    var that = this
    this.companyObject = null;
    this.assessments = [];

    CompanyFactory.getCompany(function(data){
        that.companyObject = data;
    });

    this.selectedAss = function(){
        $log.debug("assessments = ",that.assessments);
    };

    this.ok = function () {
        $uibModalInstance.close(that.assessments);
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
