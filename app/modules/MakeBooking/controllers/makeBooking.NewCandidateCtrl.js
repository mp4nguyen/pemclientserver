/**
 * Created by phuongnguyen on 16/12/15.
 */
angular.module('ocsApp.MakeBooking').controller('NewCandidateCtrl',[
            '$uibModalInstance',
            'CompanyFactory',
            'RedimedSiteFactory',
            'MakeBookingFactory',
            'mysqlDate',
            '$log',
            'candidate',
            'indexOfCandidate',
            'maxPeriod',
            '$scope',
            'mySocket',
            'toastr',
            function ( $uibModalInstance, CompanyFactory,RedimedSiteFactory,MakeBookingFactory,mysqlDate,$log,candidate,indexOfCandidate,maxPeriod,$scope,mySocket,toastr) {
    $log = $log.getInstance("ocsApp.MakeBooking.NewCandidateCtrl");
    //$log.debug("I am NewCandidateCtrl");
    var that = this
    this.status = {};
    this.BookingCandidate = {};
    this.dateStatus = {};
    this.dateStatus.dobOpened = false;
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;
    this.format = "dd/MM/yyyy";
    this.BookingCandidate.dob = null;
    this.genderList = ['Male','Female'];
    var today = new Date();
    var tomorrow = new Date();
    var currentHolingId = 0;
    tomorrow.setDate(today.getDate()+7);

    this.BookingCandidate.preferredFromDate = today;
    this.BookingCandidate.preferredToDate = tomorrow;
    this.BookingCandidate.holdingId = 0;
    this.BookingCandidate.period = maxPeriod;

    this.companyObject = null;
    this.sites = null;
    this.states = null;
    this.suburbs = null;
    this.calendars = [{id:1},{id:2}];
    this.isSubmitted = false;
    this.newCandidateForm = {};
    this.occupiedSlotByAnother = null;
    if(candidate){
        this.BookingCandidate = candidate;
        //$log.debug("candidateTempId = ",this.BookingCandidate.candidateTempId);
        getCalendar();
    }else{
        this.BookingCandidate.candidateTempId = MakeBookingFactory.getCandidateTempId();
        //$log.debug("candidateTempId = ",this.BookingCandidate.candidateTempId);
    }

    CompanyFactory.getCompany(function(data){
        that.companyObject = data;
    });

    RedimedSiteFactory.getSite(function(data){
        that.sites = data;
        $log.debug("sites");
    });
    //server will send message to client to notify that the appt has occupied by another user, so the client can re-load the calendars
    mySocket.on('UpdateCalendar',function(occupiedSlot){
        $log.debug('-->refresh calendars by server occupiedSlot = ',occupiedSlot);
        //if(that.BookingCandidate.site && that.BookingCandidate.site.id){
              //getCalendar();
        //}
        if(occupiedSlot){
            that.occupiedSlotByAnother = occupiedSlot;
            if(that.BookingCandidate.slot && that.BookingCandidate.slot.calId == occupiedSlot.calId){

                toastr.error('Sorry !, Slot ' + that.BookingCandidate.slot.calendarTime  + ' is not available now. Please select another slot ' , 'Error');
                that.BookingCandidate.slot = null;

            }

            that.calendars.forEach(function(cal){
                if(cal.date == occupiedSlot.calendarDate){
                    cal.slots.forEach(function(slot,index){
                        if(slot.calId == occupiedSlot.calId){
                            cal.slots.splice(index,1);
                        }
                    });
                }
            });
        }
    });


    this.selectedSlot = function(slot){
        $log.debug('selected slot = ',slot);
        if(that.occupiedSlotByAnother && that.occupiedSlotByAnother.calId == slot.calId){
            //check again the selected slot with occupied slot as the Angular delays to update the UI so maybe the user can select the occupied slot
            toastr.error('Sorry !, Slot ' + slot.calendarTime  + ' is not available now. Please select another slot ' , 'Error');
        }else{
            that.BookingCandidate.slot = slot;
        }

    };

    $scope.$on('$destroy', function () {
        $log.debug('remove socket.io listener.....................');
        mySocket.removeListener('UpdateCalendar');
    });

    function getCalendar(){
        //Plus toDate one date before query calendar because of time
        var newDate = new Date(that.BookingCandidate.preferredToDate);
        if(isNaN(newDate)){
          newDate = new Date(that.BookingCandidate.preferredFromDate);
        }
        newDate.setDate(newDate.getDate() + 2);
        //$log.debug('will getCalendar for site =',that.BookingCandidate.site);
        //$log.debug('will getCalendar with current calendar =',that.BookingCandidate.calendar);
        $log.debug('will getCalendar with maxperiod =',maxPeriod);
        if(that.BookingCandidate.site.id){
          RedimedSiteFactory.getCalendar(that.BookingCandidate.site.id,that.BookingCandidate.preferredFromDate,newDate,maxPeriod,function(data){
              that.calendars = data;
              //$log.debug('>>>>>>>>>>>>received data from server getCalendar with current slot =',that.BookingCandidate.slot);
              if(that.BookingCandidate.slot){
                  //search the date of returned calendars to add the current slot into the slots array and remove the slot of the doctor that belong to the current slot
                  that.calendars.forEach(function(cal){
                        if(cal.date == that.BookingCandidate.slot.calendarDate){
                            console.log('found the date in calendars = ',cal);
                            cal.slots.push(that.BookingCandidate.slot);
                            console.log('new cal = ',cal);
                            cal.slots = _.sortBy(cal.slots, 'fromTimeInInt');
                        }
                  });
                  console.log('>>>>>>>>Calendars after adding the current slot = ',that.calendars);
              }
          });
        }
    };

    $scope.$watch("NewCandidateCtrl.BookingCandidate.slot",function( newValue, oldValue ) {
           // Ignore initial setup.
           if ( newValue === oldValue ) {
               return;
           }

           console.log( "$watch: that.BookingCandidate.slot changed.",newValue, oldValue);
           //mySocket.emit('OccupyAppt',newValue,oldValue);
           mySocket.emit('OccupyAppt',newValue,oldValue,that.BookingCandidate.candidateTempId);
    });


    this.calendarChanged = function(){
    }

    this.fromOrToDateChanged = function(){
        getCalendar();
    };

    this.selectedSite = function(){
        $log.debug('selectedSite is running');
        that.states = that.BookingCandidate.site.States;
        that.BookingCandidate.suburb = null;
        that.BookingCandidate.state = null;
        that.suburbs = null;
        that.BookingCandidate.calendar = null;
        that.BookingCandidate.slot = null;
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
        //when close dialog => remove the holding boooking
        mySocket.emit('OccupyAppt',null,that.BookingCandidate.slot);
        $uibModalInstance.dismiss(that.BookingCandidate.slot);
    };
}]);
