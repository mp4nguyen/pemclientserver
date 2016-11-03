/**
 * Created by phuongnguyen on 30/11/15.
 */
angular.module('ocsApp.MakePEMPhoneBooking').controller('BookingFormCtrl',['$state','RedimedSiteFactory','MakePEMPhoneBookingFactory','toastr','$log','$stateParams','LoopBackAuth',function ($state,RedimedSiteFactory,MakePEMPhoneBookingFactory,toastr,$log,$stateParams,LoopBackAuth) {

    $log = $log.getInstance("ocsApp.MakePEMPhoneBooking.BookingFormCtrl");
    $log.debug("Hello, I am BookingFormCtrl",$stateParams.token);

    var that = this;
    this.token = $stateParams.token;
    this.loading1 = false;
    this.loading2 = false;
    this.token = $stateParams.token;
    this.showClickedValidation = false;
    this.allAssessments = [];
    this.allSites = [];
    this.states = null;
    this.suburbs = null;
    this.assessments = [];
    this.isAuth = false;
    this.isShowNotice = false;
    this.isSubmitted = false;
    this.isGettingAssessments = true;
    this.isSubmitBookingSuccess = false;

    this.format = "dd/MM/yyyy";
    this.dateStatus = {};
    this.dateStatus.dobOpened = false;
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;

    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate()+1);
    today.setDate(today.getDate()+1);
    this.paperworkList = ["Redimed","Gorgon","BP","Company Specific","CPPC","Rail","Wheatstone","MACA Mining","Aerison paperwork","Newmont","Shell"];
    this.timeList = ["AM","PM"];

    this.BookingCandidate = {};
    this.BookingCandidate.preferredFromDate = today;
    this.BookingCandidate.preferredToDate = tomorrow;
    this.BookingCandidate.dob = new Date(1990,0,1);
    this.BookingCandidate.bookingDate = new Date();
    this.BookingCandidate.paperwork = "Redimed";
    this.BookingCandidate.preferredTime = "AM";

    $log.debug(" accessToken = ",this.token);

    LoopBackAuth.setUser(this.token, 1, 'phoneBooking');
    LoopBackAuth.save();

    this.openDOB = function($event) {
        that.dateStatus.dobOpened = true;
    };

    this.openFromDate = function($event) {
        that.dateStatus.fromDateOpened = true;
    };

    this.openToDate = function($event) {
        that.dateStatus.toDateOpened = true;
    };

    this.selectedSite = function(){
        that.states = that.BookingCandidate.site.States;
        that.BookingCandidate.preferredSuburb = null;
        that.BookingCandidate.preferredState = null;
        that.suburbs = null;
    };

    this.selectedState = function(){
        if(that.BookingCandidate.preferredState){
            that.suburbs = that.BookingCandidate.preferredState.SubStates;
        }
    };

    this.isStates = function(){
        return that.states == null ? false : that.states.length <= 0 ? false:true;
    };

    this.isSuburbs = function(){
        return (that.suburbs == null? false : that.suburbs.length <= 0 ? false:true);
    };

    MakePEMPhoneBookingFactory.getAssessments().then(function(succ){
        that.allAssessments = succ.assessments;
        $log.debug("assessments = ",that.allAssessments);
        that.isAuth = true;
        that.isGettingAssessments = false;

        MakePEMPhoneBookingFactory.getPhoneBookingHeader().then(function(bookingHeader){
          $log.debug("bookingHeader = ",bookingHeader);
          that.BookingCandidate.bookingId = bookingHeader.bookingId;
          that.BookingCandidate.companyId = bookingHeader.companyId;
          that.BookingCandidate.companyName = bookingHeader.companyName;
          that.BookingCandidate.subCompanyId = bookingHeader.subCompanyId;
          that.BookingCandidate.bookingPerson = bookingHeader.bookingPerson;
          that.BookingCandidate.bookingPersonNumber = bookingHeader.contactNumber;
          that.BookingCandidate.bookingPersonEmail = bookingHeader.contactEmail;
        });

        RedimedSiteFactory.getSite(function(sites){
          $log.debug("getSites = ",sites);
          that.allSites = sites;
        });
    },function(err){
        console.log('MakePEMPhoneBookingFactory.getAssessment = ',err);
        that.isAuth = false;
        that.isShowNotice = true;
        that.isGettingAssessments = false;
    });


    this.submit = function() {

        that.isSubmitted = true;
        console.log(' that.BookingCandidate = ',that.BookingCandidate,that.assessments);

        if(that.assessments.length == 0){
          toastr.error('Please select the assessments', 'Error');
        }
        else if(that.form.$valid){

            MakePEMPhoneBookingFactory.submitBooking(that.BookingCandidate,that.assessments).then(function(data){
              that.isSubmitBookingSuccess = true;
            });

        }else{
            $log.error("ForgotPasswordCtrl invalid",that.form.$error);
        }

    };

}]);
