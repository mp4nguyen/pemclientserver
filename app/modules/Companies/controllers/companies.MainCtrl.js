/**
 * Created by phuongnguyen on 27/11/15.
 */


angular.module('ocsApp.Companies')
    .controller('CompaniesMainCtrl',['$uibModal','Companies','$log','DetailModal','DeleteModal','$state','CompanyModuleFactory','$scope', function ($uibModal,Companies,$log,DetailModal,DeleteModal,$state,CompanyModuleFactory,$scope) {

        TableBaseCtrl.call(this,$scope,$log,CompanyModuleFactory,DeleteModal,"CompaniesMainCtrl");

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
            console.log("rowData",rowData);
            if(rowData){
                $state.go('navigator.companies.detail',{row:rowData.id});
            }else{
                $state.go('navigator.companies.detail',{row:null});
            }

        };

    }]);



