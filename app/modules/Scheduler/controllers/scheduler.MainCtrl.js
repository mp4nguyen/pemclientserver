/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Scheduler')
    .controller('SchedulerMainCtrl',['$uibModal','$scope','RedimedSiteFactory','CompanyFactory','BookingFactory','$log', function ($uibModal,$scope,RedimedSiteFactory,CompanyFactory,BookingFactory,$log) {
        $log = $log.getInstance("ocsApp.Packages.SchedulerMainCtrl");
        $log.debug("I am Scheduler controller.");

        var that = this;
        var packages = [];
        var fromDate = new Date();
        var toDate = new Date();
        var editRosterFunc = function(event,isRemove){
          //open dialog to diable slot if new
          var modalInstance = $uibModal.open({
              animation: false,
              backdrop: 'static',
              windowTopClass : 'modal1',
              templateUrl: 'modules/Scheduler/views/scheduler.editRoster.html',
              controller: 'EditRosterCtrl',
              controllerAs: 'EditRosterCtrl',
              size: 'lg',
              resolve : {
                  fromTime:function(){return event.start;},
                  toTime:function(){return event.end;},
                  isRemove:function(){return isRemove}
              }
          });

          modalInstance.result.then(function (rs) {
              $log.debug('modal return value = ',rs);
              $log.debug('isRemove = ',isRemove);

              var refreshEventsFunc = function(){
                  $('#calendar').fullCalendar( 'refetchEvents' );
              };

              if(isRemove){
                RedimedSiteFactory.removeSlots(event.resourceId,rs.fromTime,rs.toTime,refreshEventsFunc);
              }else{
                RedimedSiteFactory.unRemoveSlots(event.resourceId,rs.fromTime,rs.toTime,refreshEventsFunc);
              }

              //$log.debug('Modal closed at: ' + new Date());
          }, function (rs) {
              //console.log(rs);
              //$log.debug('Modal dismissed at: ' + new Date());
          });
        }

        fromDate.setDate(fromDate.getDate() - 1);
        toDate.setDate(toDate.getDate() + 7);

        CompanyFactory.getCompany(function(data){
            $log.debug("Make booking, get company info");
            packages = data.packages;// ==null? data.packages:data.allPackages;
        });

        RedimedSiteFactory.getResources(1,fromDate,toDate,function(roster){

          $('#calendar').fullCalendar({
      			defaultView: 'agendaDay',
      			defaultDate: moment(),
      			editable: false,
      			selectable: false,
            slotDuration: '00:15:00',
            minTime: '07:00:00',
            maxTime: '18:00:00',
      			eventLimit: true, // allow "more" link when too many events
      			header: {
      				left: 'prev,next today',
      				center: 'title'
      			},
      			views: {
      				agendaTwoDay: {
      					type: 'agenda',
      					duration: { days: 2 },
      					// views that are more than a day will NOT do this behavior by default
      					// so, we need to explicitly enable it
      					groupByResource: true
      					//// uncomment this line to group by day FIRST with resources underneath
      					//groupByDateAndResource: true
      				}
      			},
      			//// uncomment this line to hide the all-day slot
      			//allDaySlot: false,
      			resources: roster.resources,
      			events: function(start,end,timezone,callback){
                console.log('start = ',start,' - end =',end);
                RedimedSiteFactory.getEvents(1,moment(start.format('DD/MM/YYYY'),'DD/MM/YYYY'),moment(end.format('DD/MM/YYYY'),'DD/MM/YYYY'),function(roster){
                    console.log('RedimedSiteFactory.getEvents = ',roster.events);
                    callback(roster.events);
                });
            },

            eventClick: function( event, jsEvent, view ) {
                console.log('You clicked on an event:',event);
                if(event.Candidate){
                    BookingFactory.viewBookingDetail(packages,event.Candidate);
                }else{
                  if(event.title == 'NoUse'){
                      editRosterFunc(event,false);
                  }else{
                      editRosterFunc(event,true);
                  }

                }
            },

      			select: function(start, end, jsEvent, view, resource) {
      				console.log(
      					'select',
      					start.format(),
      					end.format(),
      					resource ? resource.id : '(no resource)'
      				);
      			},
      			dayClick: function(date, jsEvent, view, resource) {
      				console.log(
      					'dayClick',
      					date.format(),
      					resource ? resource.id : '(no resource)'
      				);
      			}
      		});
        });

    }]);
