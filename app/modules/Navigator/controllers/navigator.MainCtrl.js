/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Navigator')
    .controller('NavigatorMainCtrl',['CompanyFactory','Accounts','$state','$cookieStore','$uibModal','Idle', 'Keepalive','$scope','$uibModalStack','mySharedService','$log','mySocket', function (CompanyFactory,Accounts,$state,$cookieStore,$uibModal,Idle, Keepalive,$scope,$uibModalStack,sharedService,$log,mySocket) {
        $log = $log.getInstance("ocsApp.Navigator.NavigatorMainCtrl");
        $log.debug("I am navigator controller.");
        //start Idle
        Idle.watch();
        //get User information
        var that = this;
        this.user = CompanyFactory.getCurrentUser();
        this.currentCompany = null;
        $log.debug("user = ",this.user);

        var initData = function(){
          that.currentCompany = CompanyFactory.getCurrentCompany();
        }

        initData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh navigator") >= 0 ){
                initData();
            }
        });

        if(this.user.userType.indexOf("RediMed") >= 0 ){
            // this is a Redimed user, will go booking first
            $log.debug("I am admin");
            $state.go("navigator.bookings");
        }else{
            /// this is a normal user (company user), will go make booking first
            $log.debug("I am company");
            if(that.user.istelehealthBooking == 1){
                $state.go("navigator.makeTelehealthBooking");
            }else{
                $state.go("navigator.makeBooking");
            }
        }

        $scope.$on('IdleStart', function() {
            $log.debug("IdleStart");
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Navigator/views/navigator.idleAlert.html',
                controller: 'IdleAlertCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;

            }, function () {
                $log.debug('Modal Idle dismissed at: ' + new Date());
            });
        });

        $scope.$on('IdleEnd', function() {
            $log.debug("IdleEnd");
            $uibModalStack.dismissAll();
        });

        $scope.$on('IdleTimeout', function() {
            $log.debug("IdleTimeout");
            $uibModalStack.dismissAll();
            that.logout();
        });

        this.isPackage = function(){
            return that.user.isall ==1 ? true : (that.user.ispackage == 1 ? true : false);
        };

        this.isPosition = function(){
            return that.user.isall ==1 ? true : ( that.user.isposition == 1 ? true : false);
        };

        this.isSetting = function(){
            return that.user.isall ==1 ? true : (that.user.issetting == 1 ? true : false);
        };

        this.isBookingList = function(){
            return that.user.isall ==1 ? true : (that.user.isbooking == 1 ? true : false);
        };

        this.isMakeBooking = function(){
            return that.user.isall ==1 ? true : (that.user.ismakebooking == 1 ? true : false);
        };

        this.isTelehealthBooking = function(){
            return that.user.isall ==1 ? true : (that.user.istelehealthBooking == 1 ? true : false);
        };

        this.isReports = function(){
            return this.user.userType.indexOf("RediMed") >= 0  ? true : false;
        };


        this.logout = function(){
            $log.debug("NavigatorMainCtrl.logout runs......");
            //let IndexMainCtrl know I logout so it can change its className for the index.html page
            Accounts.logout(function(value,header){
                mySocket.emit('logout');
                sharedService.prepForBroadcast("Logout successfully");
                $log.debug("Logout : ",value);
                $log.debug("Logout : ",header);
                $state.go('init');
            },
            function(err){
                $log.error("Logout failed: ",err);
            });
        }

        this.myProfile = function(){
            //borrow new or edit account from settings module to use at here
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Settings/views/settings.NewAccount.html',
                controller: 'NewAccountCtrl',
                controllerAs: 'NewAccountCtrl',
                size: 'lg',
                resolve:{
                    account : function(){
                        return that.user;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;

            }, function () {
                $log.debug('Modal profile dismissed at: ' + new Date());
            });
        };

        this.changeCompany = function(){
            //borrow new or edit account from settings module to use at here
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/Settings/views/settings.ChangeCompany.html',
                controller: 'ChangeCompanyCtrl',
                controllerAs: 'ChangeCompanyCtrl',
                size: 'md',
                resolve:{
                    account : function(){
                        return that.user;
                    }
                }
            });

            modalInstance.result.then(function (position) {
                //$scope.selected = selectedItem;

            }, function () {
                $log.debug('Modal profile dismissed at: ' + new Date());
            });
        };

    }]);
