/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.MakeTelehealthBooking')
    .controller('MakeTelehealthBookingMainCtrl',['CompanyFactory','$cookieStore','$uibModal','$log','toastr','mysqlDate','MakeTelehealthBookingFactory','mySharedService', function (CompanyFactory,$cookieStore,$uibModal,$log,toastr,mysqlDate,MakeTelehealthBookingFactory,sharedService) {
        var that = this;
        $log = $log.getInstance("ocsApp.MakeTelehealthBooking.MakeTelehealthBookingMainCtrl");
        $log.debug("I am make telehealth booking controller.");
        this.user = CompanyFactory.getCurrentUser();
        console.log(this.user);
        this.companyObject = null;
        this.newBooking = {
          "companyId" : that.user.companyId,
          "employerId": null,
          "patientName": null,
          "dob": null,
          "address": null,
          "postcode": null,
          "state": null,
          "suburb": null,
          "facetime": null,
          "skype": null,
          "contactNumber": null,
          "occupation": null,
          "employer": null,
          "supervisor": null,
          "medicalState": null,
          "emailForDoc": null,
          "injuryCrush": false,
          "injuryFall": false,
          "injuryLaceration": false,
          "injuryOther": false,
          "injurySprain": false,
          "descriptionOfInjury": null,
          "bodyPart": null,
          "injuryDate": null,
          "medicalHistory": null,
          "allergies": null,
          "serviceRequired": null,
          "apptDate": null,
          "preferredTime": null,
          "consent": false,
          "bookingPerson": that.user.bookingPerson
        };

        this.subsidiary = {};
        this.subsidiary2 = {};
        this.viewPackage = "";
        this.form = {};
        this.isSubmitted = false;
        this.isSubmitingToTheServer = false;
        this.isSubsidiary2 = false;
        this.isNoCandidate = false;//to display err if no candidate when submit the form
        this.stateList = ["WA","NSW","VIC","SA","TAS","NT","QLD"];
        this.bodyPartList = ["Foot-L","Foot-R","Lower Leg-L","Lower Leg-R","Upper Leg-L","Upper Leg-R","Shoulder-L","Shoulder-R","Arm-L","Arm-R","Wrist-L","Wrist-R","Hand-L","Hand-R","Lower Back","Upper Back","Chest","Abdomen","Head"];
        this.serviceList = ["1st Medical certificate","Progress Medical Certificate","Fitness for Duty","Referral"];

        this.dateStatus = {};
        this.dateStatus.dobOpened = false;
        this.dateStatus.apptDateOpened = false;
        this.dateStatus.timeOpened = false;
        this.dateStatus.injuryDateOpened = false;
        this.format = "dd/MM/yyyy";
        this.openDOB = function($event) {
            that.dateStatus.dobOpened = true;
        };
        this.timechanged = function() {
             console.log('Time changed to: ' , that.newBooking.preferredTime);
        };

        this.openApptDate = function($event) {
            that.dateStatus.apptDateOpened = true;
        };
        this.openInjuryDate = function($event) {
            that.dateStatus.injuryDateOpened = true;
        };


        this.isShowOtherInjyryDesc = false;
        that.descriptionOfInjuryInvalid = true;
        this.injuryDescChange = function(){

            if(that.newBooking.injuryOther || that.newBooking.injuryLaceration || that.newBooking.injuryCrush || that.newBooking.injurySprain || that.newBooking.injuryFall ){
                that.descriptionOfInjuryInvalid = false;
            }else{
              that.descriptionOfInjuryInvalid = true;
            }

            if(that.newBooking.injuryOther){
              that.isShowOtherInjyryDesc = true;
            }else{
              that.isShowOtherInjyryDesc = false;
            }
        }


        var user = $cookieStore.get('user');

        CompanyFactory.getCompany(function(data){
            that.companyObject = data;
            $log.debug("Make booking, get company info");
        });

        this.getAllSubsidiaries = function (callback) {
            $log.debug("getAllSubsidiaries.Loading subsidiaries......",that.companyObject.subsidiaries);
            callback(that.companyObject.subsidiaries);
        };

        this.isAdminLogin = function(){
            return user.userType.indexOf("RediMed")>=0 ? true:false;
        };

        this.newCompany = function(){
            // add new sub company for Redimed when admin make a booking on behalf
            var modalInstance = $uibModal.open({
                animation: true,
                templateUrl: 'modules/MakeTelehealthBooking/views/makeTelehealthBooking.NewCompany.html',
                controller: 'NewTelehealthCompanyCtrl',
                controllerAs: 'NewTelehealthCompanyCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (newCompany) {
                //$scope.selected = selectedItem;
                $log.debug("newCompany = ",newCompany);
                MakeTelehealthBookingFactory.newSubsidiaryForRedimed(that.user.companyId,newCompany).then(function(succ){
                    $log.debug("created new company sucessfully = ",succ);
                    that.newBooking.employer = succ;
                    that.newBooking.email = succ.resultEmail;
                    that.companyObject.subsidiaries.push(succ);
                });
            }, function () {
                $log.debug('Modal New company dismissed at: ' + new Date());
            });
        };

        this.submitForm = function(){

            that.isSubmitted = true;
            console.log(this.newBooking);

            if(that.form.$invalid){
                toastr.error('Please enter all required fields of booking information', 'Error');
                $log.error('Please enter all required fields of booking information',that.form.$error);
            }else{
                that.isSubmitingToTheServer = true;

                MakeTelehealthBookingFactory.submitBooking(that.newBooking,that.companyObject,user).then(
                    function(succ){
                        that.isSubmitingToTheServer = false;
                        $log.debug("Submit booking successfully",succ);
                        toastr.success('Successfully submitted');
                        toastr.success('The booking list will be updated shortly. Please wait !');
                        //clear all data
                        that.newBooking = {
                          "companyId" : that.user.companyId,
                          "employerId": null,
                          "patientName": null,
                          "dob": null,
                          "address": null,
                          "postcode": null,
                          "state": null,
                          "suburb": null,
                          "facetime": null,
                          "skype": null,
                          "contactNumber": null,
                          "occupation": null,
                          "employer": null,
                          "supervisor": null,
                          "medicalState": null,
                          "emailForDoc": null,
                          "injuryCrush": false,
                          "injuryFall": false,
                          "injuryLaceration": false,
                          "injuryOther": false,
                          "injurySprain": false,
                          "descriptionOfInjury": null,
                          "bodyPart": null,
                          "injuryDate": null,
                          "medicalHistory": null,
                          "allergies": null,
                          "serviceRequired": null,
                          "apptDate": null,
                          "preferredTime": null,
                          "consent": false,
                          "bookingPerson": that.user.bookingPerson
                        };

                        that.isSubmitted = false;
                    },
                    function(err){
                        $log.err("Fail to submit booking",err);
                    });

            }

        }

        this.selectedSubsidiary = function(value){
            $log.debug("selectedSubsidiary = ",value);
            that.newBooking.email = value.resultEmail;
        };

        this.isShowSubsidiary2 = function(){
            return this.isSubsidiary2;
        }



    }]);
