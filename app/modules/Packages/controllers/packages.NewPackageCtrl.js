/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Positions')
    .controller('NewPackageCtrl',['Packages','$uibModalInstance','package','CompanyFactory','$log','toastr', function (Packages,$uibModalInstance,package,CompanyFactory,$log,toastr) {
        $log = $log.getInstance("ocsApp.Positions.Packages");
        $log.debug("I am  new or edit position controller.",package);

        var that = this;
        this.form = {};
        this.assessments = [];
        this.companyObject = {};
        this.companyId = CompanyFactory.getCompanyId();

        if(package){
            this.packageName = package.packageName;
            for(var i in package.AssessmentHeaders){
                var assessmentHeader = package.AssessmentHeaders[i];
                for(var j in assessmentHeader.Assessments){
                    this.assessments.push(assessmentHeader.Assessments[j].assId)
                }
            }
        }
        $log.debug("Assessments = ",this.assessments);
        CompanyFactory.getCompany(function(data){
            that.companyObject = data;
        });
        this.ok = function () {
            that.isSubmitted = true;
            if(that.form.$valid){
                //Update Position if position is an object
                //If position = null, it means that it is new object
                var upsertData = {};
                upsertData.package = package;
                upsertData.assessments = that.assessments;
                upsertData.packageName = that.packageName;
                upsertData.companyId = that.companyId;

                $log.debug("will insert/update upsertData = ",upsertData);
                Packages.upsertPackage(upsertData,
                    function(succ){
                        $log.debug("New/update package successfully ",succ);
                        toastr.success('Successfully submitted');
                        CompanyFactory.refreshPackageList(function(data){
                            $log.debug(">>>>>>Refesh packages after insert or edit",data.packages);
                            $uibModalInstance.close({});
                        });
                    },
                    function(err){
                        $log.error("Fail to new/update package",err);
                        toastr.error('Fail to save the package', 'Error');
                    }
                );
            }else{
                $log.error("Data error",that.form.$error)
                toastr.error('Please check the input data', 'Error');
            }

        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);

