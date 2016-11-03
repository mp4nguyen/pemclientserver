/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Packages')
    .controller('PackagesMainCtrl',['$uibModal','$scope','CompanyFactory','Packages','$log','mySharedService', function ($uibModal,$scope,CompanyFactory,Packages,$log,sharedService) {
        $log = $log.getInstance("ocsApp.Packages.PackagesMainCtrl");
        $log.debug("I am package list controller.");
        var that = this;
        this.packages = [];

        var getPackageData = function(){
            CompanyFactory.getCompany(function(data){
                $log.debug("Get company info");
                that.packages = data.packages;
            });
        }

        getPackageData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh packages") >= 0 ){
              getPackageData();
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
                $log.debug('Modal delete package dismissed at: ' + new Date());
            });
        }

        this.newOrEditPackage = function(value){
            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Packages/views/packages.NewPackage.html',
                controller: 'NewPackageCtrl',
                controllerAs: 'NewPackageCtrl',
                size: 'lg',
                resolve:{
                    package : function(){
                        return value;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;
                getPackageData();
            }, function () {
                $log.debug('Modal New or edit package dismissed at: ' + new Date());
            });
        };

    }]);
