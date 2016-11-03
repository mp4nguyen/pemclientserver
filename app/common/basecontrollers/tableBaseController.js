
/**
 * Created by phuongnguyen on 23/02/16.
 */
function TableBaseCtrl($scope,$log,Services,DeleteModal,controllerName){

    $log = $log.getInstance(controllerName);
    $log.debug("controller is running....");
    var that = this;
    this.selectedRow = {};
    this.detailResolve = {};
    this.currentColumnName = '';
    this.currentSortReverse = false;
    this.rows = [];

    this.getDataFromService = function(){
        Services.getMasterRows(function(data){
            that.rows = data;
        });
    }

    this.getDataFromService();

    $scope.$on('MasterDetailBroadcast', function() {
        var msg = Services.getMessage();
        $log.debug("Received a message from detail = " + msg);
        if(msg.indexOf("Insert Master Successfully")>= 0 || msg.indexOf("Update Master Successfully")>= 0|| msg.indexOf("Delete Master Successfully")>= 0){
            that.getDataFromService();
        }
    });

    this.detailResolve.row = function(){
        $log.debug("Please override 'detailResolve.row' object to process the resolve data for the detail modal");
        return that.selectedRow;
    };

    this.setHeader = function(columnName){
        that.currentColumnName = columnName;
        that.currentSortReverse = !that.currentSortReverse;
    };

    this.isUp = function(columnName){
        return that.currentColumnName == columnName && that.currentSortReverse;
    };

    this.isDown = function(columnName){
        return that.currentColumnName == columnName && !that.currentSortReverse;
    };

    ////////////////////
    this.setDeleteTemplateUrl = function(detailTemplateUrl){
        DeleteModal.setTemplateUrl(detailTemplateUrl);
    };

    this.setDeleteController = function(detailController){
        DeleteModal.setControllerName(detailController);
    };

    this.setDeleteWindowSize = function(detailWindowSize){
        DeleteModal.setSize(detailWindowSize);
    };

    this.setCloseDeleteModal = function(closeFun){
        DeleteModal.setCloseModalFunc(closeFun);
    };

    this.setDismissDeleteModal = function(dismissFun){
        DeleteModal.setDismissModalFunc(dismissFun);
    };

    this.deleteRow = DeleteModal.deleteRow;

}


angular.module('TableBaseController',[]).controller('tableBaseController',['$uibModal','$log',TableBaseCtrl]);
