/**
 * Created by phuongnguyen on 25/11/15.
 */
angular.module('ocsApp.MakePEMPhoneBooking',['toastr'])
    .config(['$stateProvider',function($stateProvider){
        //'$stickyStateProvider'
        $stateProvider
            .state("navigator.makePEMPhoneBooking",{
                abstract:false,
                url:"/makePEMPhoneBooking",
                templateUrl: "modules/MakePEMPhoneBooking/views/makePEMPhoneBooking.main.html",
                controller: "MakePEMPhoneBookingMainCtrl",
                controllerAs: "MakePEMPhoneBookingMainCtrl"
            })
            .state("authentication.bookingForm",{
                url: "/bookingForm/:token",
                views:{
                    "main-content":{
                        templateUrl: "modules/MakePEMPhoneBooking/views/makePEMPhoneBooking.bookingForm.html",
                        controller: "BookingFormCtrl",
                        controllerAs: "BookingFormCtrl"
                    }
                }
            });

    }]);
