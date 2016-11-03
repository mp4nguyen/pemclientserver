/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('NewPositionCtrl',['Positions','$uibModalInstance','position','CompanyFactory','$log','toastr', function (Positions,$uibModalInstance,position,CompanyFactory,$log,toastr) {
        $log = $log.getInstance("ocsApp.Positions.NewPositionCtrl");
        $log.debug("I am  new or edit position controller.",position);

        var that = this;
        this.form = {};
        this.companyId = CompanyFactory.getCompanyId();
        if(position){
            this.positionName = position.positionName;
        }

        this.ok = function () {
            that.isSubmitted = true;

            if(that.form.$valid){
                //Update Position if position is an object
                //If position = null, it means that it is new object
                if(position){
                    $log.debug("will update position",position);
                    Positions.update({where:{"id":position.id}},{"positionName":that.positionName},function(res){
                        $log.debug("updated position",res);
                        toastr.success('Position was updated successfully', '');
                        $uibModalInstance.close({});
                    },function(err){
                        $log.error("Fail to update position",err);
                        toastr.error('Fail to update Position', 'Error');
                        $uibModalInstance.close({});
                    });
                }else{
                    var newPositionObj = {};
                    newPositionObj.positionName = that.positionName;
                    newPositionObj.companyId = that.companyId;
                    newPositionObj.id = 0;
                    console.log(newPositionObj);

                    Positions.create(newPositionObj,function(rs){
                        $log.debug("created position",rs);
                        toastr.success('Position was created successfully', '');
                        $uibModalInstance.close({});
                    },function(err){
                        toastr.error('Fail to create Position', 'Error');
                        $log.error("failt to create position",err);
                    })
                }               
            }else{
                 $log.error("Save postion err ",that.form.$error);
            }

        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

