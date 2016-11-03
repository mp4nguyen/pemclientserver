/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakeBooking').controller('NewCandidateCtrl',[
            '$uibModalInstance',
            'CompanyFactory',
            'RedimedSiteFactory',
            'mysqlDate',
            '$log','candidate',
            'indexOfCandidate',
            '$scope',
            'mySocket',
            function ( $uibModalInstance, CompanyFactory,RedimedSiteFactory,mysqlDate,$log,candidate,indexOfCandidate,$scope,mySocket) {
    $log = $log.getInstance("ocsApp.MakeBooking.NewCandidateCtrl");
    $log.debug("I am NewCandidateCtrl");
    var that = this
    this.status = {};
    this.BookingCandidate = {};
    this.dateStatus = {};
    this.dateStatus.dobOpened = false;
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;
    this.format = "dd/MM/yyyy";
    this.BookingCandidate.dob = new Date(1990,0,1);

    var today = new Date();
    var tomorrow = new Date();
    var currentHolingId = 0;
    tomorrow.setDate(today.getDate()+7);

    this.BookingCandidate.preferredFromDate = today;
    this.BookingCandidate.preferredToDate = tomorrow;
    this.BookingCandidate.holdingId = 0;
    this.companyObject = null;
    this.sites = null;
    this.states = null;
    this.suburbs = null;
    this.calendars = [{id:1},{id:2}];
    this.isSubmitted = false;
    this.newCandidateForm = {};

    if(candidate){
        this.BookingCandidate = candidate;
        getCalendar();
    }

    CompanyFactory.getCompany(function(data){
        that.companyObject = data;
    });

    RedimedSiteFactory.getSite(function(data){
        that.sites = data;
        $log.debug("sites",that.sites);
    });
    //server will send message to client to notify that the appt has occupied by another user, so the client can re-load the calendars
    mySocket.on('UpdateCalendar',function(data){
        $log.debug('refresh calendars by server',data);
        if(that.BookingCandidate.site.id){
          //if(!that.BookingCandidate.calendar){
              getCalendar();
          //}
        }
    });

    function getCalendar(){
        //Plus toDate one date before query calendar because of time
        var newDate = new Date(that.BookingCandidate.preferredToDate);
        console.log('newDate = ',newDate);
        if(isNaN(newDate)){
          newDate = new Date(that.BookingCandidate.preferredFromDate);
        }
        newDate.setDate(newDate.getDate() + 2);
        console.log('newDate = ',newDate);
        $log.debug('will getCalendar with current calendar =',that.BookingCandidate.calendar);
        if(that.BookingCandidate.site.id){
          RedimedSiteFactory.getCalendar(that.BookingCandidate.site.id,that.BookingCandidate.preferredFromDate,newDate,function(data){
              that.calendars = data;
              $log.debug('received data from server getCalendar with current calendar =',that.BookingCandidate.calendar);
              if(that.BookingCandidate.calendar){
                that.calendars.unshift(that.BookingCandidate.calendar);
              }
          });
        }
    };

     $scope.$watch(
        "NewCandidateCtrl.BookingCandidate.calendar",
        function( newValue, oldValue ) {
            // Ignore initial setup.
            if ( newValue === oldValue ) {
                return;
            }

            if(oldValue){
                RedimedSiteFactory.removeHolding(currentHolingId,oldValue.calId,function(holdingData){
                    console.log(' holdingData = ',holdingData);
                });
            }

            if(newValue){
                RedimedSiteFactory.setHolding(newValue.calId,function(holdingData){
                    console.log(' holdingData = ',holdingData);
                    currentHolingId = holdingData.holdingId;
                    that.BookingCandidate.holdingId = holdingData.holdingId;
                    //notify the server the appt that the client has occupied, so the server can let other users know
                    mySocket.emit('OccupyAppt',newValue);
                });
            }

            console.log( "$watch: that.BookingCandidate.calendar changed.",newValue, oldValue);
        }
    );


    this.calendarChanged = function(){
    }

    this.fromOrToDateChanged = function(){
        getCalendar();
    };

    this.selectedSite = function(){
        that.states = that.BookingCandidate.site.States;
        that.BookingCandidate.suburb = null;
        that.BookingCandidate.state = null;
        that.suburbs = null;
        that.BookingCandidate.calendar = null;
        getCalendar();
    };

    this.selectedState = function(){
        if(that.BookingCandidate.state){
            that.suburbs = that.BookingCandidate.state.SubStates;
        }
    };

    this.isStates = function(){
        return that.states == null ? false : that.states.length <= 0 ? false:true;
    };

    this.isSuburbs = function(){
        return (that.suburbs == null? false : that.suburbs.length <= 0 ? false:true);
    };

    this.openDOB = function($event) {
        that.dateStatus.dobOpened = true;
    };

    this.openFromDate = function($event) {
        that.dateStatus.fromDateOpened = true;
    };

    this.openToDate = function($event) {
        that.dateStatus.toDateOpened = true;
    };

    this.ok = function () {
        that.isSubmitted = true;
        if(that.newCandidateForm.$valid){
            $log.debug("Exit candidate valid",that.BookingCandidate);
            var returnO = {};
            returnO.index =  indexOfCandidate;
            returnO.candidate = that.BookingCandidate;
            $uibModalInstance.close(returnO);
        }else{
            $log.error("Exit candidate error",that.newCandidateForm.$error);
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}]);
