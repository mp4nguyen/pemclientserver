
angular.module('ocsApp.MakePEMPhoneBooking')
    .controller('MakePEMPhoneBookingMainCtrl',['CompanyFactory','$cookieStore','$uibModal','$log','toastr','mysqlDate','MakePEMPhoneBookingFactory','mySharedService', function (CompanyFactory,$cookieStore,$uibModal,$log,toastr,mysqlDate,MakePEMPhoneBookingFactory,sharedService) {
        $log = $log.getInstance("ocsApp.MakePEMPhoneBooking.MakePEMPhoneBookingMainCtrl");
        $log.debug("I am make MakePEMPhoneBookingMainCtrl controller.");
        this.user = CompanyFactory.getCurrentUser();
        this.companyObject = null;
        this.newBooking = {};
        this.subsidiary = {};
        this.subsidiary2 = {};

        this.form = {};
        this.isSubmitted = false;
        this.isSubmitingToTheServer = false;
        this.isSubsidiary2 = false;
        this.isNoCandidate = false;//to display err if no candidate when submit the form

        var that = this;
        var user = $cookieStore.get('user');

        CompanyFactory.getCompany(function(data){
            that.companyObject = data;
            console.log("getCompany = ",data);
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
                templateUrl: 'modules/MakePEMPhoneBooking/views/makePEMPhoneBooking.NewCompany.html',
                controller: 'NewPEMPhoneCompanyCtrl',
                controllerAs: 'NewPEMPhoneCompanyCtrl',
                size: 'md'
            });

            modalInstance.result.then(function (newCompany) {
                //$scope.selected = selectedItem;
                $log.debug("newCompany = ",newCompany);
                MakePEMPhoneBookingFactory.newSubsidiaryForRedimed(newCompany).then(function(succ){
                    $log.debug("created new company sucessfully = ",succ);
                    that.newBooking.subsidiary = succ;
                    that.subsidiary = succ;
                    that.companyObject.subsidiaries.push(succ);
                });
            }, function () {
                $log.debug('Modal New company dismissed at: ' + new Date());
            });
        };

        this.emailBookingForm = function(){

            that.isSubmitted = true;

            if(!that.newBooking.subsidiary && that.isAdminLogin()){
                that.form.company.$invalid = true;
            }

            if(that.form.$invalid || that.form.company.$invalid ){
                toastr.error('Please enter all required fields of booking information', 'Error');
                $log.error('Please enter all required fields of booking information',that.form.$error);
            }else{
                that.isSubmitingToTheServer = true;
                $log.debug('will send email the booking form',that.newBooking);
                MakePEMPhoneBookingFactory.emailBookingForm(that.newBooking).then(
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
                        $log.err("Fail to submit booking",err);
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
        };

        this.isShowSubsidiary2 = function(){
            return this.isSubsidiary2;
        }

    }]);
