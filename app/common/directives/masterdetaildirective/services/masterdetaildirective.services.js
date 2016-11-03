/**
 * Created by phuongnguyen on 23/02/16.
 */
angular.module('MasterDetailDirective')
    .factory('DetailModal', ['$uibModal','$log', function ($uibModal,$log) {
        $log = $log.getInstance("MasterDetailDirective.DetailModal");
        var pTemplateUrl = '';
        var pControllerName = '';
        var pSize = '';
        var pResolve = {};
        var closeModal = function(rs){
            $log.debug("this is 'closeModal' function, please override by setCloseModalFunc() ",rs);
        };
        var dismissModal = function(rs){
            $log.info('Modal dismissed at: ' + new Date());
            $log.debug("this is 'dismissModal' function, please override by setDismissModalFunc() ",rs);
        };


        return{
            setTemplateUrl : function(templateUrl){
                pTemplateUrl = templateUrl;
            },
            setControllerName : function(controllerName){
                pControllerName = controllerName;
            },
            setSize : function(size){
                pSize = size;
            },
            setCloseModalFunc : function(func){
                closeModal = func;
            },
            setDismissModalFunc : function(func){
                dismissModal = func;
            },
            setResolve : function(resolveName,func){
                pResolve[resolveName] = func;
                console.log("pResolve=",pResolve);
            },
            newOrEditRow: function(value){
                console.log('DetailModal',pTemplateUrl);
                //open modal to enter new candidate
                pResolve.row = function(){
                    return value;
                };
                console.log("pResolve=",pResolve);

                var modalInstance = $uibModal.open({
                    animation: true,
                    template: pTemplateUrl,
                    controller: pControllerName,
                    controllerAs: pControllerName,
                    size: pSize,
                    resolve: pResolve
                });

                modalInstance.result.then(function (rs) {
                    closeModal(rs);
                }, function (rs) {
                    dismissModal(rs);
                });
            }
        };
    }])
    .factory('DetailModal2', ['$uibModal','$log', function ($uibModal,$log) {
        $log = $log.getInstance("MasterDetailDirective.DetailModal");
        var pTemplateUrl = '';
        var pControllerName = '';
        var pSize = '';
        var pResolve = {};
        var closeModal = function(rs){
            $log.debug("this is 'closeModal' function, please override by setCloseModalFunc() ",rs);
        };
        var dismissModal = function(rs){
            $log.info('Modal dismissed at: ' + new Date());
            $log.debug("this is 'dismissModal' function, please override by setDismissModalFunc() ",rs);
        };


        return{
            setTemplateUrl : function(templateUrl){
                pTemplateUrl = templateUrl;
            },
            setControllerName : function(controllerName){
                pControllerName = controllerName;
            },
            setSize : function(size){
                pSize = size;
            },
            setCloseModalFunc : function(func){
                closeModal = func;
            },
            setDismissModalFunc : function(func){
                dismissModal = func;
            },
            setResolve : function(resolveName,func){
                pResolve[resolveName] = func;
                console.log("pResolve=",pResolve);
            },
            newOrEditRow: function(value){
                console.log('DetailModal',pTemplateUrl);
                //open modal to enter new candidate
                pResolve.row = function(){
                    return value;
                };
                console.log("pResolve=",pResolve);

                var modalInstance = $uibModal.open({
                    animation: true,
                    template: pTemplateUrl,
                    controller: pControllerName,
                    controllerAs: pControllerName,
                    size: pSize,
                    resolve: pResolve
                });

                modalInstance.result.then(function (rs) {
                    closeModal(rs);
                }, function (rs) {
                    dismissModal(rs);
                });
            }
        };
    }])
    .factory('DeleteModal', ['$uibModal','$log', function ($uibModal,$log) {
        $log = $log.getInstance("MasterDetailDirective.DeleteModal");
        var pTemplateUrl = '';
        var pControllerName = '';
        var pSize = '';
        var pResolve = {};
        var closeModal = function(rs){
            $log.debug("this is 'closeModal' function, please override by setCloseModalFunc() ",rs);
        };
        var dismissModal = function(rs){
            $log.info('Modal dismissed at: ' + new Date());
            $log.debug("this is 'dismissModal' function, please override by setDismissModalFunc() ",rs);
        };


        return{
            setTemplateUrl : function(templateUrl){
                pTemplateUrl = templateUrl;
            },
            setControllerName : function(controllerName){
                pControllerName = controllerName;
            },
            setSize : function(size){
                pSize = size;
            },
            setCloseModalFunc : function(func){
                closeModal = func;
            },
            setDismissModalFunc : function(func){
                dismissModal = func;
            },
            setResolve : function(resolveName,func){
                pResolve[resolveName] = func;
                console.log("pResolve=",pResolve);
            },
            deleteRow: function(value){
                console.log('DetailModal',pTemplateUrl);
                //open modal to enter new candidate
                pResolve.row = function(){
                    return value;
                };
                console.log("pResolve=",pResolve);

                var modalInstance = $uibModal.open({
                    animation: true,
                    template: pTemplateUrl,
                    controller: pControllerName,
                    controllerAs: pControllerName,
                    size: pSize,
                    resolve: pResolve
                });

                modalInstance.result.then(function (rs) {
                    closeModal(rs);
                }, function (rs) {
                    dismissModal(rs);
                });
            }
        };
    }]);

