/**
 * Created by phuongnguyen on 24/02/16.
 *//**
 * Created by phuongnguyen on 27/11/15.
 */

angular.module('ocsApp.Companies')
    .controller('NewCompanyCtrl',['$state','$stateParams','Companies','$log','toastr','BookingStatusFactory','DetailModal2','DeleteModal','CompanyModuleFactory',function ($state,$stateParams,Companies,$log,toastr,BookingStatusFactory,DetailModal2,DeleteModal,CompanyModuleFactory) {

        var id = parseInt($stateParams.row);
        var row = CompanyModuleFactory.getMasterRow(id);
        var that = this;

        DetailWithTableBaseCtrl.call(this,CompanyModuleFactory,row,$log,toastr,DetailModal2,DeleteModal,'NewCompanyCtrl');

        this.row.defaultStatusObject = {};
        this.bookingStatus = [];

        this.setDetailTemplateUrl('<my-dynamic-form formdefine = "{{NewSubCompanyCtrl.formDefines}}" ></my-dynamic-form>');
        this.setDetailController('NewSubCompanyCtrl');
        this.setDetailWindowSize('lg');

        this.cancel = function () {
            //$uibModalInstance.dismiss('cancel');
            $state.go("navigator.companies.list");
        };

        if(row){
            this.windowTitle = "Update Company";
        }else{
            this.windowTitle = "New Company";
        }


        $log.debug("modalTitle = ",this.windowTitle);

        BookingStatusFactory.getStatus(function(data){
            that.bookingStatus = data;
            that.row.defaultStatusObject =  that.bookingStatus[_.findIndex(that.bookingStatus, 'bookingStatus', that.row.defaultStatus)];
            console.log(" get status = ",data,that.row.defaultStatusObject);
        });

    }]);
