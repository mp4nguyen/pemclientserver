/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Settings')
    .controller('SettingsMainCtrl',['$uibModal','$scope','CompanyFactory','Packages','$log','mySharedService', function ($uibModal,$scope,CompanyFactory,Packages,$log,sharedService) {
        $log = $log.getInstance('ocsApp.Settings.SettingsMainCtrl');
        $log.debug("I am package list controller.");
        var that = this;
        this.accounts = [];
        this.companies = [];


        var initData = function(){
            CompanyFactory.getCompany(function(data){
                that.accounts = data.accounts;
                that.companies = data.subsidiaries;
                for(var i in that.accounts){
                    if(that.accounts[i].company){
                        that.accounts[i].companyName = that.accounts[i].company.companyName;
                    }
                }
            });
        }

        initData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh settings") >= 0 ){
              initData();
            }
        });

        this.deletePackage = function(packageId){

            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Packages/views/packages.ConfirmToDeletePackage.html',
                controller: 'ConfirmToDeletePackageCtrl',
                controllerAs: 'ConfirmToDeletePackageCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (position) {
                Packages.deleteById({id:packageId},function(result){
                    console.log(result);
                    CompanyFactory.refreshPackageList(function(data){
                        console.log("Make booking, get company info = ",data);
                        that.packages = data.packages;
                    });
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.newOrEditPackage = function(value){
            var acc = value;

            //open modal to enter new account
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Settings/views/settings.NewAccount.html',
                controller: 'NewAccountCtrl',
                controllerAs: 'NewAccountCtrl',
                size: 'lg',
                resolve:{
                    account : function(){
                        return value;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;
                CompanyFactory.refreshAccountList(function(data){
                    console.log(">>>>>>Refesh packages after insert or edit= ",data);
                    that.accounts = data.accounts;
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }]);
