/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Bookings')
    .controller('SelectApptSlotCtrl',['BookingFactory','$log','$uibModalInstance','$scope','mySocket','calendars','siteId','period','toastr', 
                                        function (BookingFactory,$log,$uibModalInstance,$scope,mySocket,calendars,siteId,period,toastr) {

        $log = $log.getInstance("ocsApp.Bookings.SelectApptSlotCtrl");
        //$log.debug("I am SelectApptSlotCtrl");

        this.calendars = calendars;
        this.slot = null;
        var that = this;
        this.occupiedSlotByAnother = null;

            //server will send message to client to notify that the appt has occupied by another user, so the client can re-load the calendars
        mySocket.on('UpdateCalendar',function(occupiedSlot){
            $log.debug('-->refresh calendars by server occupiedSlot = ',occupiedSlot);
            //if(that.BookingCandidate.site && that.BookingCandidate.site.id){
                  //getCalendar();
            //}
            if(occupiedSlot){
                that.occupiedSlotByAnother = occupiedSlot;

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


        $scope.$on('$destroy', function () {
            $log.debug('remove socket.io listener.....................');
            mySocket.removeListener('UpdateCalendar');
        });

        $scope.$watch("SelectApptSlotCtrl.slot",function( newValue, oldValue ) {
             if ( newValue === oldValue ) {
                 return;
             }
             console.log( "$watch: that.BookingCandidate.slot changed.",newValue, oldValue);
             mySocket.emit('OccupyAppt',newValue,oldValue);
        });

        this.selectedSlot = function(slot){
            $log.debug('selected slot = ',slot);
            if(that.occupiedSlotByAnother && that.occupiedSlotByAnother.calId == slot.calId){
                //check again the selected slot with occupied slot as the Angular delays to update the UI so maybe the user can select the occupied slot 
                toastr.error('Sorry !, Slot ' + slot.calendarTime  + ' is not available now. Please select another slot ' , 'Error');
            }else{
                that.slot = slot;
                $uibModalInstance.close(that.slot);  
            }            
            
        };

        this.ok = function () {
            $uibModalInstance.close(that.slot);
        };

        this.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
