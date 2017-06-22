/**
 * Created by phuongnguyen on 3/01/16.
 */


angular.module('ocsApp.Bookings').controller('AdminEditBookingCtrl',[
                                    'candidate',
                                    'BookingFactory',
                                    'RedimedSiteFactory',
                                    'BookingStatusFactory',
                                    'BookingHeaders',
                                    'BookingCandidates',
                                    'toastr',
                                    '$uibModalInstance',
                                    'mysqlDate',
                                    '$log',
                                    'CompanyFactory',
                                    'mySharedService',
                                    'mysqlDate',
                                    '$cookieStore',
                                    '$uibModal',
                                    '$scope',
                                    'mySocket',
                                    function (candidate,BookingFactory,RedimedSiteFactory,BookingStatusFactory,BookingHeaders,
                                      BookingCandidates,toastr,$uibModalInstance,mysqlDate,
                                      $log,CompanyFactory,sharedService,
                                      mysqlDate,
                                      $cookieStore,
                                      $uibModal,
                                      $scope,
                                      mySocket
                                    ) {
    $log = $log.getInstance("ocsApp.Bookings.AdminEditBookingCtrl");
    //$log.debug("I am admin edit booking ctrl!!!");
    //$log.debug("Candidate = ",candidate);

    var that = this;
    var prevStatus = candidate.appointmentStatus;
    var currentHolingId = 0;
    this.candidate = candidate;
    this.user = CompanyFactory.getCurrentUser();
    this.sites = [];
    this.states = [];
    this.suburbs = [];
    this.site = {};
    this.state = {};
    this.suburb = {};
    this.calendars = [];
    this.slot = null;
    this.statuses = [];
    this.isSubmitted = false;
    this.form = {};
    this.dateStatus = {};
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;
    this.dateStatus.timeOpened = false;
    this.isCalendarList = false;
    this.isAppointmentTime = false;
    this.apptTimeAfterConvert = null;
    this.format = "dd/MM/yyyy HH:mm";
    this.period = 15;
    this.isSelectedSlot = false;

    this.apptDateAfterConvert = mysqlDate(this.candidate.appointmentTime);

    if(this.candidate.appointmentTime){
      this.apptTimeAfterConvert = mysqlDate(this.candidate.appointmentTime);
    }

    this.isAppointmentTimeChange = false;

    if(this.apptTimeAfterConvert == ""){
      this.apptTimeAfterConvert = "00:00";
    }
    //console.log("apptTimeAfterConvert=",this.apptTimeAfterConvert);

    BookingStatusFactory.getStatus(function(data){
        that.statuses = data;
        $log.debug(" status = ",that.statuses);
    });

    RedimedSiteFactory.getSite(function(data){
        $log.debug("get sites...");
        that.sites = data;
        that.site =  that.sites[_.findIndex(that.sites, 'id', that.candidate.siteId)];

        if(that.site.States.length > 0){
            that.states = that.site.States;
            that.state =  that.states[_.findIndex(that.states, 'stateName', that.candidate.stateName)];
            if(that.state.SubStates.length > 0){
                that.suburbs = that.state.SubStates;
                that.suburb =  that.suburbs[_.findIndex(that.suburbs, 'suburbName', that.candidate.suburbName)];
            }
        }

        if(that.site){
            CompanyFactory.getPeriod(candidate.packageId,function(period){
                that.period = period;
                $log.debug('that.period = ',that.period);
                getCalendar();
            });
        }
    });

    this.appointmentTimeChanged = function(){
        that.isAppointmentTimeChange = true;
        console.log(this.apptTimeAfterConvert);
    }

    this.openTime = function() {
        that.dateStatus.timeOpened = true;
    };

    this.openFromDate = function($event) {
        that.dateStatus.fromDateOpened = true;
    };

    this.isChangeBookingTime = function(){
        if(that.calendars.length > 0){
            return true;
        }
        else{
            return false;
        }
    }

    this.selectedSite = function(){
        $log.debug("Get calendar from the factory");
        that.calendars = [];
        that.states = that.site.States;
        that.suburb = null;
        that.state = null;
        that.suburbs = null;
        that.slot = null;
        that.candidate.appointmentTime =  null;
        that.isSelectedSlot = true;

        getCalendar();
    };

    this.selectedState = function(){
        if(that.state){
            that.suburb = null;
            that.suburbs = that.state.SubStates;
        }
    };

    this.isStates = function(){
        return that.states == null ? false : that.states.length <= 0 ? false:true;
    };

    this.isSuburbs = function(){
        return (that.suburbs == null? false : that.suburbs.length <= 0 ? false:true);
    };

    this.isSendEmailDisabled = function(){
        if(this.candidate.appointmentStatus =='Confirmed'||this.candidate.appointmentStatus =='Pending'){
            return !that.isNotSave();
        }else{
            return false;
        }
    };

    this.isNotSave = function(){
        //$log.debug(" that.form.$pristine = ", that.form.$pristine,"  !that.isSelectedSlot = ",!that.isSelectedSlot);
        return !(!that.form.$pristine||that.isSelectedSlot);
    };

    this.isAttended = function(){

        if((that.candidate.appointmentStatus == 'Reschedule' || that.candidate.appointmentStatus == 'Confirmed') ){
            return true;
        }else{
            return false;
        }

    };

    this.isShowAttendedButton = function(){
        if(that.user.userType.indexOf("RediMed") == -1 ){
            // this is a Redimed user, will go booking first
            return false;
        }else{
            return true;
        }
    };

    this.isEform = function(){
        if(that.user.userType.indexOf("RediMed") == -1 ){
            // this is a Redimed user, will go booking first
            return false;
        }else{
            return true;
        }
    };

    this.eform = function(){
      BookingHeaders.transferEform({bookingId:  that.candidate.bookingId})
    }

    this.attended = function(){
          BookingFactory.attended(that.candidate).then(function(){
              $log.debug('updated successfully');
              toastr.success('Successfully updated. The booking list will refresh shortly !');
              that.form.$setPristine();
              CompanyFactory.refreshBookingList(function(data){
                  toastr.success('The booking list has been refresh');
                  sharedService.prepForBroadcast("Refresh booking list successfully");
              });
          });
    };

    this.sendConfirmationEmail = function(){
        BookingFactory.sendConfirmationEmail(that.candidate);
    };

    this.save = function (isSendEmail) {

        that.isSubmitted = true;
        var isSendConfirmationEmail = false;
        if((!that.candidate.appointmentTime && that.calendars.length > 0 && ( that.slot == undefined || that.slot == null)) && isSendEmail) {
            toastr.error("Please select the calendar", 'Error');
        }else{
            if(that.form.$valid){
                var updateValue = {};

                if(prevStatus.indexOf('Pending')>=0 && (that.slot || that.apptTimeAfterConvert)){
                    updateValue.appointmentStatus = 'Confirmed';
                    that.candidate.appointmentStatus = 'Confirmed';
                    isSendConfirmationEmail = true;
                }

                if(that.slot){
                    if( (prevStatus.indexOf('Confirmed')>=0 || prevStatus.indexOf('Reschedule') >= 0) && (that.slot.calId != candidate.calendarId)){
                        updateValue.appointmentStatus = 'Reschedule';
                        that.candidate.appointmentStatus = 'Reschedule';
                        isSendConfirmationEmail = true;
                    }
                }else{
                    if( (prevStatus.indexOf('Confirmed')>=0 || prevStatus.indexOf('Reschedule') >= 0) && that.apptTimeAfterConvert && that.isAppointmentTimeChange){
                        updateValue.appointmentStatus = 'Reschedule';
                        that.candidate.appointmentStatus = 'Reschedule';
                        isSendConfirmationEmail = true;
                    }
                }

                updateValue.candidateId = that.candidate.candidateId;
                updateValue.appointmentNotes = that.candidate.appointmentNotes;
                updateValue.siteId = that.site.id;
                updateValue.siteName = that.site.siteName;
                //If WA and Eastern stated => do not send email automatically
                if(updateValue.siteName.indexOf('Eastern States') >= 0 || updateValue.siteName.indexOf('WA') >= 0 || !isSendEmail){
                    isSendConfirmationEmail = false;
                }

                if(that.state){
                    updateValue.stateName = that.state.stateName;
                    updateValue.stateId = that.state.id;
                }else{
                    updateValue.stateName = null;
                    updateValue.stateId = null;
                }

                if(that.suburb){
                    updateValue.suburbName = that.suburb.suburbName;
                    updateValue.suburbId = that.suburb.id;
                }else{
                    updateValue.suburbName = null;
                    updateValue.suburbId = null;
                }

                console.log("that.slot = ",that.slot);

                if(that.slot){
                    updateValue.appointmentTime =  moment(mysqlDate(that.slot.fromTime)).format("YYYY-MM-DD HH:mm ");
                    updateValue.calendarId = that.slot.calId;
                    updateValue.practitionerId = that.slot.doctorId;
                    updateValue.redimedNote = that.slot.doctorName;
                    updateValue.slots = [];
                    if (that.slot.followingSlots){
                      that.slot.followingSlots.forEach(function(slot,index){
                            updateValue.slots.push(slot.calId);
                            var calIndex = index + 2;
                            if(calIndex <= 5){
                                updateValue["calendarId"+calIndex] = slot.calId;
                            }
                      });
                    }
                }else{

                    if(that.apptTimeAfterConvert){
                        //in case there is no calendar list i.e: in VIC,.....
                        //admin enter the appt time directly
                        updateValue.appointmentTime =  moment(that.apptDateAfterConvert).format("YYYY-MM-DD") + " " + moment(that.apptTimeAfterConvert).format("hh:mm");
                    }

                }

                $log.debug("will update",updateValue);
                BookingHeaders.updateBooking(updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        that.form.$setPristine();
                        //$uibModalInstance.close(that.BookingCandidate);
                        if(isSendConfirmationEmail){
                            BookingFactory.sendConfirmationEmail(that.candidate);
                        }


                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        if(err.data.error.code == "SLOT_NOT_AVAILABLE"){
                            toastr.error(err.data.error.message, 'Error');
                        }else{
                            toastr.error('Fail to update the booking [' + err.data.error.message + ']', 'Error');
                        }
                    });
            }
        }
    };


    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    this.SelectApptSlot = function () {
        var modalInstance = $uibModal.open({
            templateUrl: 'modules/Bookings/views/booking.SelectApptSlotCtrl.html',
            animation: false,
            windowTopClass : 'modal2',
            size: 'lg',
            controller: 'SelectApptSlotCtrl',
            controllerAs: 'SelectApptSlotCtrl',
            resolve : {
                calendars:function(){return that.calendars;},
                //siteId:function(){return that.site.refId;},
                siteId:function(){return that.site.id;},
                period:function(){return that.period;}
            }
        });

        modalInstance.result.then(function (slot) {
            $log.debug("select slot = ",slot);
            if(slot){
                that.slot = slot;
                that.candidate.appointmentTime =  that.slot.fromTime;
                that.isSelectedSlot = true;
            }
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    this.canCancelAppt = function(){
        if( that.candidate.appointmentStatus.indexOf('Confirmed') >= 0 ||  that.candidate.appointmentStatus.indexOf('Reschedule') >= 0){
            return true;
        }else{
            return false;
        }
    }

    this.cancelAppt = function () {
            //open modal to enter new candidate
            $uibModalInstance.dismiss('cancel');
            var modalInstance = $uibModal.open({
                templateUrl: 'modules/Bookings/views/booking.ConfirmToCancelAppt.html',
                controller: 'ConfirmToCancelApptCtrl',
                controllerAs: 'ConfirmToCancelApptCtrl'
            });

            modalInstance.result.then(function (position) {
                BookingFactory.cancelAppointment(that.candidate).then(function(data){
                    sharedService.prepForBroadcast("Refresh booking list successfully");
                });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

    function getCalendar(){
        $log.debug("will getCalendar....",that.user);
        //Plus toDate one date before query calendar because of time
        //BookingFactory.getCalendar(that.site.refId,that.period).then(function(data){
        BookingFactory.getCalendar(that.site.id,that.period).then(function(data){
            $log.debug("finished getCalendar....", that.user);
            that.calendars = data;

            if(that.calendars.length > 0){
                that.isCalendarList = true;
                that.isAppointmentTime = false;
            }else{
                that.isCalendarList = false;
                that.isAppointmentTime = true;
            }
            //if user is not an admin, not allow to select time and date ; only select in calendar list
            if(that.user.userType.indexOf("RediMed") == -1 ){
                // this is a Redimed user, will go booking first
                that.isAppointmentTime = false;
            }
        });
    };

    this.isAdmin = function(){
        return that.user.userType.indexOf("RediMed") >= 0 ? true :false;
    };

}]);
