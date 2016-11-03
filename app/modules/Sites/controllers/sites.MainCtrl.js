/**
 * Created by phuongnguyen on 27/11/15.
 */


angular.module('ocsApp.Sites')
    .controller('SitesMainCtrl',['$uibModal','$log','DetailModal','DeleteModal','$state','SiteModuleFactory','$scope', function ($uibModal,$log,DetailModal,DeleteModal,$state,SiteModuleFactory,$scope) {

        TableBaseCtrl.call(this,$scope,$log,SiteModuleFactory,DeleteModal,"SitesMainCtrl");

        var that = this;

        this.isSubmitted = false;
        this.form = {};
        this.company = {};

        this.setDeleteTemplateUrl('<my-dynamic-form formdefine = "{{ConfirmToDeleteCompanyCtrl.formDefines}}" ></my-dynamic-form>');
        this.setDeleteController('ConfirmToDeleteCompanyCtrl');
        this.setDeleteWindowSize('md');

        this.setCloseDeleteModal(function(row){
            CompanyModuleFactory.deleteCompany(row);
        });


        this.detail = function(rowData){
            console.log(" prepare to go to detail with rowData",rowData);
            if(rowData){
                $state.go('navigator.sites.detail',{row:rowData.id});
            }else{
                $state.go('navigator.sites.detail',{row:null});
            }

        };

    }]);



