/**
 * Created by phuongnguyen on 3/01/16.
 */
angular.module('ocsApp.Bookings').controller('AdminEditBookingCtrl',['candidate','RedimedSiteFactory','BookingStatusFactory','BookingCandidates','toastr','$uibModalInstance','mysqlDate','$log','CompanyFactory','mySharedService','mysqlDate','$cookieStore','$uibModal', function (candidate,RedimedSiteFactory,BookingStatusFactory,BookingCandidates,toastr,$uibModalInstance,mysqlDate,$log,CompanyFactory,sharedService,mysqlDate,$cookieStore,$uibModal) {
    $log = $log.getInstance("ocsApp.Bookings.AdminEditBookingCtrl");
    $log.debug("I am admin edit booking ctrl");
    $log.debug("Candidate = ",candidate);
    var that = this;
    var prevStatus = candidate.appointmentStatus;
    this.candidate = candidate;
    this.user = CompanyFactory.getCurrentUser();
    this.sites = [];
    this.states = [];
    this.suburbs = [];
    this.site = {};
    this.state = {};
    this.suburb = {};
    this.calendars = [];
    this.calendar = {};
    this.statuses = [];
    this.isSubmitted = false;
    this.form = {};
    this.dateStatus = {};
    this.dateStatus.fromDateOpened = false;
    this.dateStatus.toDateOpened = false;
    this.dateStatus.timeOpened = false;
    this.isCalendarList = false;
    this.isAppointmentTime = false;

    this.format = "dd/MM/yyyy HH:mm";

    this.apptDateAfterConvert = mysqlDate(this.candidate.appointmentTime);
    this.apptTimeAfterConvert = mysqlDate(this.candidate.appointmentTime);
    this.isAppointmentTimeChange = false;

    //console.log("apptTimeAfterConvert=",this.apptTimeAfterConvert);

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
            getCalendar();
        }
    });

    this.selectedSite = function(){
        $log.debug("Get calendar from the factory");
        that.states = that.site.States;
        that.suburb = null;
        that.state = null;
        that.suburbs = null;
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
        return that.form.$pristine
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

    this.attended = function(){

                var updateValue = {};
                updateValue.appointmentStatus = 'Attended';

                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        that.form.$setPristine();

                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
    };

    this.sendConfirmationEmail = function(){
        $log.debug("> Will send email to ",that.candidate);
        if(that.candidate.appointmentStatus.indexOf('Pending')>=0 )
        {

            BookingCandidates.sendConfirmationEmail({id:that.candidate.candidateId,type:"pending"},function(rs){
                $log.debug(">>sendConfirmationEmail",rs);
                if(rs.sentEmailStatus.indexOf('Error')>=0){
                    toastr.error(rs.sentEmailStatus, 'Error');
                    $log.error("> Fail to send email to ",candidate);
                }else{
                    toastr.success(rs.sentEmailStatus, '');
                    $log.debug("> Send email successfullt ",rs.sentEmailStatus);
                }

            });

        }else{
            BookingCandidates.sendConfirmationEmail({id:that.candidate.candidateId,type:"new"},function(rs){
                $log.debug(">>sendConfirmationEmail",rs);
                if(rs.sentEmailStatus.indexOf('Error')>=0){
                    toastr.error(rs.sentEmailStatus, 'Error');
                    $log.error("> Fail to send email to ",candidate);
                }else{
                    toastr.success(rs.sentEmailStatus, '');
                    $log.debug("> Send email successfullt ",rs.sentEmailStatus);
                }

            });
        }

    };

    this.save = function (isSendEmail) {
        that.isSubmitted = true;
        var isSendConfirmationEmail = false;
        if((!that.candidate.appointmentTime && that.calendars.length > 0 && ( that.calendar == undefined || that.calendar == null)) && isSendEmail) {
            toastr.error("Please select the calendar", 'Error');
        }else{
            if(that.form.$valid){
                var updateValue = {};

                if(prevStatus.indexOf('Pending')>=0 && (that.calendar || that.apptTimeAfterConvert)){
                    updateValue.appointmentStatus = 'Confirmed';
                    that.candidate.appointmentStatus = 'Confirmed';
                    isSendConfirmationEmail = true;
                }

                if(that.calendar){
                    if( (prevStatus.indexOf('Confirmed')>=0 || prevStatus.indexOf('Reschedule') >= 0) && (that.calendar.calId != candidate.calendarId)){
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

                console.log("that.calendar = ",that.calendar);
                if(that.calendar){
                    updateValue.appointmentTime =  moment(mysqlDate(that.calendar.fromTime)).format("YYYY-MM-DD hh:mm");
                    updateValue.calendarId = that.calendar.calId;
                }else{

                    if(that.apptTimeAfterConvert){
                        //in case there is no calendar list i.e: in VIC,.....
                        //admin enter the appt time directly
                        updateValue.appointmentTime =  moment(that.apptDateAfterConvert).format("YYYY-MM-DD") + " " + moment(that.apptTimeAfterConvert).format("hh:mm");
                    }

                }

                $log.debug("will update",updateValue);
                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        that.form.$setPristine();
                        //$uibModalInstance.close(that.BookingCandidate);
                        if(isSendConfirmationEmail){
                            that.sendConfirmationEmail();
                        }


                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
            }
        }
    };

    this.cancel = function () {
        $uibModalInstance.dismiss('cancel');
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
                var updateValue = {};

                updateValue.appointmentNotes = that.candidate.appointmentNotes;
                updateValue.appointmentStatus = 'Cancel';

                updateValue.calendarId = -1;

                $log.debug("will cancel the booking ",updateValue);

                BookingCandidates.update({where:{candidateId:that.candidate.candidateId}},updateValue,function(res,header){
                        $log.debug('updated successfully');
                        toastr.success('Successfully updated. The booking list will refresh shortly !');
                        //$uibModalInstance.close(that.BookingCandidate);
                        that.sendConfirmationEmail();
                        CompanyFactory.refreshBookingList(function(data){
                            toastr.success('The booking list has been refresh');
                            sharedService.prepForBroadcast("Refresh booking list successfully");
                        });
                    },
                    function(err){
                        $log.error('updated failed',err);
                        toastr.error("Fail to update", 'Error');
                    });
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
    };

    function getCalendar(){
        $log.debug("will getCalendar....",that.user);
        //Plus toDate one date before query calendar because of time
        var fromDate = new Date();
        var toDate = new Date();
        toDate.setDate(toDate.getDate() + 60);
        RedimedSiteFactory.getCalendar(that.site.id,fromDate,toDate,function(data){
            $log.debug("finished getCalendar....", that.user);
            console.log(" RedimedSiteFactory.getCalendar = ",data)
            that.calendars = data;
            that.calendar =  that.calendars[_.findIndex(that.calendars, 'calId', that.candidate.calendarId)];

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

            console.log("that.calendars = ",that.calendars,"that.calendar = ", that.calendar);
        });
    };

    this.isAdmin = function(){
        return that.user.userType.indexOf("RediMed") >= 0 ? true :false;
    };

}]);
