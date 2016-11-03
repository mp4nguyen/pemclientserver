/**
 * Created by phuongnguyen on 23/02/16.
 */
function DetailWithTableBaseCtrl(Services,row,$log,toastr,DetailModal,DeleteModal,controllerName) {
    $log = $log.getInstance(controllerName);
    $log.debug("I am  new or edit position controller.",row);

    var that = this;
    this.form = {};
    this.row = {};
    this.windowTitle = "This is 'this.windowTitle' variable, Please set for the widow title";
    if(row){
        this.row = row;
    }
    this.isSubmitted = false;
    this.formDefines = {};
    this.tableDefines = {};

    this.closeModalAfterSave = function(){
        //$uibModalInstance.close({});
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

    //////////////

    this.setDetailTemplateUrl = function(detailTemplateUrl){
        DetailModal.setTemplateUrl(detailTemplateUrl);
    };

    this.setDetailController = function(detailController){
        DetailModal.setControllerName(detailController);
    };

    this.setDetailWindowSize = function(detailWindowSize){
        DetailModal.setSize(detailWindowSize);
    };

    this.setCloseDetailModal = function(closeFun){
        DetailModal.setCloseModalFunc(closeFun);
    };

    this.setDismissDetailModal = function(dismissFun){
        DetailModal.setDismissModalFunc(dismissFun);
    };

    this.setDetailWindowTitle = function(resolveName,detailWindowTitle){
        DetailModal.setResolve(resolveName,detailWindowTitle);
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


    this.newOrEditRow = DetailModal.newOrEditRow;

    this.deleteRow = DeleteModal.deleteRow;

    this.saveRow = function(){
        $log.debug("This is  'this.saveRow()' function, Please override ! Remember to close modal by 'this.closeModalAfterSave()'");
        Services.saveMaster(that.row);
        that.closeModalAfterSave();
    };

    this.ok = function () {
        that.isSubmitted = true;

        if(that.form.$valid){
            that.saveRow();
        }else{
            toastr.error("Please re-check all their fields again !","error");
            $log.error("Save postion err ",that.form.$error);
        }
    };

    this.cancel = function () {
        //$uibModalInstance.dismiss('cancel');
    };

};
