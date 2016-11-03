/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Companies')
    .controller('ConfirmToDeleteCompanyCtrl',['$uibModalInstance','row', function ($uibModalInstance,row) {

        this.formDefines = {
            div1: {type:"div", fieldClass: "modal-header", fields: {h3:{type:"h3", fieldClass: "modal-title", label: "Delete Company", controllerAs:"ConfirmToDeleteCompanyCtrl"}}},
            div2: {type:"div", fieldClass: "modal-body", fields: {h3:{type:"h3", fieldClass: "modal-title", label: "Do you want to delete company ?"}}},
            div3: {type:"div", fieldClass: "modal-footer", fields: {
                    btn1: {type:"button", fieldClass: "btn btn-primary", ngClick: "ok()",label: "Save"},
                    btn2: {type:"button", fieldClass: "btn btn-warning", ngClick: "cancel()",label: "Cancel"}
                }
            }
        };


        this.ok = function () {
            $uibModalInstance.close(row);
        };

        this.cancel = function () {
            $uibModalInstance.dismiss(row);
        };
    }]);

