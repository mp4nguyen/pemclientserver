/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('PositionsMainCtrl',['$uibModal','$scope','CompanyFactory','Positions','$log','mySharedService', function ($uibModal,$scope,CompanyFactory,Positions,$log,sharedService) {
        $log = $log.getInstance("ocsApp.Packages.PackagesMainCtrl");
        $log.debug("I am position list controller.");

        var that = this;
        this.positions = [];
        this.show = false;

        var initData = function(){
            CompanyFactory.getCompany(function(data){
                console.log("Make booking, get company info = ",data);
                that.positions = data.positions;
            });
        }

        initData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh positions") >= 0 ){
              initData();
            }
        });

        this.deletePosition = function(positionId){

            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Positions/views/positions.ConfirmToDeletePosition.html',
                controller: 'ConfirmToDeletePositionCtrl',
                controllerAs: 'ConfirmToDeletePositionCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (position) {
                Positions.deleteById({id:positionId},function(result){
                    console.log(result);
                    CompanyFactory.refreshPositionList(function(data){
                        console.log("Make booking, get company info = ",data);
                        that.positions = data.positions;
                    });
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        }

        this.newOrEditPosition = function(value){
            //open modal to enter new candidate
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Positions/views/positions.NewPosition.html',
                controller: 'NewPositionCtrl',
                controllerAs: 'NewPositionCtrl',
                size: 'md',
                resolve:{
                    position : function(){
                        return value;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;
                CompanyFactory.refreshPositionList(function(data){
                    console.log("Make booking, get company info = ",data);
                    that.positions = data.positions;
                });

            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };

    }]);
