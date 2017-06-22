/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.MakeBooking')
    .controller('MakeBookingMainCtrl',['CompanyFactory','$scope','$cookieStore','$uibModal','$log','toastr','mysqlDate','MakeBookingFactory','mySharedService', function (CompanyFactory,$scope,$cookieStore,$uibModal,$log,toastr,mysqlDate,MakeBookingFactory,sharedService) {
        $log = $log.getInstance("ocsApp.MakeBooking.MakeBookingMainCtrl");
        $log.debug("I am make booking controller.");
        var user = CompanyFactory.getCurrentUser();
        this.user = CompanyFactory.getCurrentUser();
        this.companyObject = null;
        this.newBooking = {};
        this.newBooking.poNumber = "";
        this.newBooking.newCandidates = [];
        this.subsidiary = {};
        this.subsidiary2 = {};
        this.viewPackage = "";
        this.form = {};
        this.isSubmitted = false;
        this.isSubmitingToTheServer = false;
        this.isSubsidiary2 = false;
        this.isNoCandidate = false;//to display err if no candidate when submit the form
        this.paperworkList = ["Redimed","Gorgon","BP","Company Specific","CPPC","Rail","Wheatstone","MACA Mining","Aerison paperwork","Newmont","Shell","Woodside Offshore","Boral Paperwork"];
        this.newBooking.paperwork = "Redimed";
        this.maxPeriod = 15;
        var that = this;

        var initData = function(){
          CompanyFactory.getCompany(function(data){
              that.companyObject = data;
              updateUI(that.companyObject,that.companyObject);
              $log.debug("Make booking, get company info");
          });
        }

        initData();

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from ChangeCompanyCtrl = " + msg);
            if( msg.indexOf("Refresh make booking") >= 0 ){
              initData();
            }
        });

        this.getAllSubsidiaries = function (callback) {
            $log.debug("getAllSubsidiaries.Loading subsidiaries......");
            callback(that.companyObject.subsidiaries);
        };

        this.isAdminLogin = function(){
            return user.userType.indexOf("RediMed")>=0 ? true:false;
        };

        this.newCompany = function(){
            $log.debug("newCompany is running....... ");
            // add new sub company for Redimed when admin make a booking on behalf
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/MakeBooking/views/makeBooking.NewCompany.html',
                controller: 'NewCompanyAtMakingBookingCtrl',
                controllerAs: 'NewCompanyAtMakingBookingCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (newCompany) {
                //$scope.selected = selectedItem;
                $log.debug("newCompany = ",newCompany);
                MakeBookingFactory.newSubsidiaryForRedimed(newCompany).then(function(succ){
                    $log.debug("created new company sucessfully = ",succ);
                    that.newBooking.subsidiary = succ;
                    that.subsidiary = succ;
                    that.companyObject.subsidiaries.push(succ);
                });
            }, function () {
                $log.debug('Modal New company dismissed at: ' + new Date());
            });
        };

        this.submitForm = function(){

            that.isSubmitted = true;

            if(!that.newBooking.subsidiary && that.isAdminLogin()){
                that.form.company.$invalid = true;
            }

            if(that.newBooking.newCandidates.length > 0){
                that.isNoCandidate = false;
            }else{
                that.isNoCandidate = true;
                toastr.error('Please enter candidate information', 'Error');
                $log.error('Please enter candidate information');
                that.newCandidate();
            }

            if(that.form.$invalid || that.form.company.$invalid ){
                toastr.error('Please enter all required fields of booking information', 'Error');
                $log.error('Please enter all required fields of booking information',that.form.$error);
            }else{
                that.isSubmitingToTheServer = true;
                MakeBookingFactory.submitBooking(that.newBooking,that.companyObject,user).then(
                    function(succ){
                        that.isSubmitingToTheServer = false;
                        $log.debug("Submit booking successfully",succ);
                        toastr.success('Successfully submitted');
                        toastr.success('The booking list will be updated shortly. Please wait !');
                        //clear all data
                        that.newBooking = {};
                        that.newBooking.newCandidates = [];
                        that.isSubmitted = false;

                    },
                    function(err){
                        that.isSubmitingToTheServer = false;
                        $log.error("Fail to submit booking",err);

                    });
            }
        }

        this.selectedSubsidiary = function(value){
            $log.debug("selectedSubsidiary = ",value);
            that.newBooking.subsidiary = value;
            that.subsidiary2 = {};
            if(that.newBooking.subsidiary.subsidiaries){
                this.isSubsidiary2 = that.newBooking.subsidiary.subsidiaries.length > 0 ? true:false;
            }else{
                this.isSubsidiary2 = false;
            }
            updateUI(that.companyObject,that.newBooking.subsidiary);
        };

        this.isShowSubsidiary2 = function(){
            return this.isSubsidiary2;
        }

        this.isEditPackage = function(){
            return this.newBooking.newCandidates.length > 0 ? false : true;
        }

        this.selectedPackage = function(){
            that.maxPeriod = 15;
            $log.debug(" selected Package ");

            if(that.newBooking.package.packageName.indexOf("Custom") >= 0 ){
                that.viewPackage = "";
                //open modal to select assessments
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: 'modules/MakeBooking/views/makeBooking.CustomPackage.html',
                    controller: 'CustomPackageCtrl',
                    controllerAs: 'CustomPackageCtrl',
                    size: 'lg'
                });

                modalInstance.result.then(function (selectedItem) {
                    //$scope.selected = selectedItem;
                    $log.debug('customPackage = ',selectedItem);
                    var assIDs = [];
                    selectedItem.forEach(function(ass){
                      assIDs.push(ass.id);
                      var p = ass.period;
                      if(p > that.maxPeriod){
                        that.maxPeriod = p;
                      }
                    });
                    that.newBooking.customPackage = assIDs;
                    that.newCandidate();
                }, function () {
                    $log.debug('Modal Package dismissed at: ' + new Date());
                });
            }else{
                that.viewPackage = "";
                for(var i in that.newBooking.package.AssessmentHeaders){
                    that.viewPackage = that.viewPackage +"<br><b>"+  that.newBooking.package.AssessmentHeaders[i].headerName + "</b>";
                    for(var j in that.newBooking.package.AssessmentHeaders[i].Assessments){
                        var p = that.newBooking.package.AssessmentHeaders[i].Assessments[j].period;
                        if(p > that.maxPeriod){
                          that.maxPeriod = p;
                        }
                        that.viewPackage = that.viewPackage +"<br> - "+  that.newBooking.package.AssessmentHeaders[i].Assessments[j].assName + "";
                    }
                }
                $log.debug("View package:",that.viewPackage);
                that.newCandidate();
            }

        };

        this.isPO = function(){
            return that.companyObject.ispo == 1 ? true:false;
        };

        this.isProjectIdentification = function(){
            return that.companyObject.isproject == 1 ? true:false;
        };

        this.isNotEditInvoiceAndResultEmails = function(){
            return that.user.isnoteditemailsheader == 1 ? true:false;
        };

        this.deleteCandidate = function(index,candidate){
            $log.debug("Remove candidate at " + index,candidate);
            that.newBooking.newCandidates.splice(index, 1);
        }

        this.newCandidate = function(index,candidate){
            if(that.newBooking.package||that.newBooking.customPackagepackage){
              //if edit the new candidate, we must have the index of the candidate in the array, so we can replace the old value with the new one
              $log.debug("New/replace candidate ",candidate," index = ",index);
              //open modal to enter new candidate
              var modalInstance = $uibModal.open({
                  animation: true,
                  backdrop: 'static',
                  templateUrl: 'modules/MakeBooking/views/makeBooking.NewCandidate.html',
                  controller: 'NewCandidateCtrl',
                  controllerAs: 'NewCandidateCtrl',
                  size: 'lg',
                  resolve: {
                      candidate: function () {
                          return candidate;
                      },
                      indexOfCandidate: function(){
                          return index;
                      },
                      maxPeriod: function(){
                          return that.maxPeriod;
                      }
                  }
              });

              modalInstance.result.then(function (obj) {
                  //$scope.selected = selectedItem;
                  //if edit the new candidate, we must have the index of the candidate in the array, so we can replace the old value with the new one
                  var index = obj.index;
                  var candidate = obj.candidate;
                  if(index >= 0){
                      $log.debug("repleace the candidate in the array with index = "+index,candidate);
                      that.newBooking.newCandidates[index] = candidate;
                  }else{
                      $log.debug("add candidate into array",candidate);
                      that.newBooking.newCandidates.push(candidate);
                  }
              }, function (data) {
                  $log.debug('Modal Candidate dismissed at: ' + new Date(),data);
              });
            }else{
                toastr.error('Please select a package', 'Error');
            }
        };

        function updateUI(conditionOnCompany,companyOrSubsidiary){

            $log.debug("Update PO,Emails,...");

            if(companyOrSubsidiary.defaultNote){
                that.newBooking.comments = companyOrSubsidiary.defaultNote;
            }


            if(companyOrSubsidiary.poNumber){
                that.newBooking.poNumber = companyOrSubsidiary.poNumber;
            }

            if(companyOrSubsidiary.projectIdentification){
                that.newBooking.projectIdentification = companyOrSubsidiary.projectIdentification;
            }

            if(companyOrSubsidiary.invoiceEmail){
                if(conditionOnCompany.isinvoiceemailtouser == 1){
                    that.newBooking.invoiceEmail = companyOrSubsidiary.invoiceEmail;+"; "+that.user.contactEmail;
                }else{
                    that.newBooking.invoiceEmail = companyOrSubsidiary.invoiceEmail;
                }
            }else{
                if(conditionOnCompany.isinvoiceemailtouser == 1){
                    that.newBooking.invoiceEmail = that.user.contactEmail;
                }
            }

            if(companyOrSubsidiary.resultEmail){
                if(conditionOnCompany.isaddcontactemailtoresult == 1){
                    that.newBooking.resultEmail = companyOrSubsidiary.resultEmail+"; "+that.user.contactEmail;
                }else{
                    that.newBooking.resultEmail = companyOrSubsidiary.resultEmail;
                }
            }else{
                if(conditionOnCompany.isaddcontactemailtoresult == 1){
                    that.newBooking.resultEmail = that.user.contactEmail;
                }
            }

        };
    }]);
