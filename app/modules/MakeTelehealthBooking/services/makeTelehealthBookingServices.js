/**
 * Created by phuongnguyen on 8/01/16.
 */
angular.module('ocsApp.MakeBooking')
.factory('MakeTelehealthBookingFactory', ['TelehealthBookings','toastr','$q','CompanyFactory','mysqlDate','Companies','$log','mySharedService', function (TelehealthBookings,toastr,$q,CompanyFactory,mysqlDate,Companies,$log,sharedService) {
    $log = $log.getInstance("ocsApp.MakeBooking.MakeBookingFactory");
    return {
        submitBooking:function(newBookingObj,companyObject,user){

            ///submit the online booking is here !
            var deferred = $q.defer();

            var booking = {
                "bookingId": 0,
                "companyId":  newBookingObj.companyId,
                "patientName": newBookingObj.patientName,
                "dob": moment(newBookingObj.dob).format("YYYY-MM-DD"),
                "address": newBookingObj.address,
                "postcode": newBookingObj.postcode,
                "state": newBookingObj.state,
                "suburb": newBookingObj.suburb,
                "facetime": newBookingObj.facetime,
                "skype": newBookingObj.skype,
                "contactNumber": newBookingObj.contactNumber,
                "occupation": newBookingObj.occupation,
                "employer": newBookingObj.employer.companyName,
                "employerId": newBookingObj.employer.id,
                "supervisor": newBookingObj.supervisor,
                "medicalState": newBookingObj.medicalState,
                "emailForDoc": newBookingObj.email,
                "injuryCrush": (newBookingObj.injuryCrush?1:0),
                "injuryFall": (newBookingObj.injuryFall?1:0),
                "injuryLaceration": (newBookingObj.injuryLaceration?1:0),
                "injuryOther": (newBookingObj.injuryOther?1:0),
                "injurySprain": (newBookingObj.injurySprain?1:0),
                "descriptionOfInjury": newBookingObj.descriptionOfInjury,
                "bodyPart": newBookingObj.bodyPart,
                "injuryDate": moment(newBookingObj.injuryDate).format("YYYY-MM-DD"),
                "medicalHistory": newBookingObj.medicalHistory,
                "allergies": newBookingObj.allergies,
                "serviceRequired": newBookingObj.serviceRequired,
                "apptDate": moment(newBookingObj.apptDate).format("YYYY-MM-DD") + ' ' + moment(newBookingObj.preferredTime).format("HH:mm"),
                "preferredTime": moment(newBookingObj.preferredTime).format("HH:mm"),
                "consent": (newBookingObj.consent?1:0),
                "bookingPerson": newBookingObj.bookingPerson,
                "apptStatus": "Confirmed"
            };

            $log.debug("will submit the telehealth booking",booking);

            TelehealthBookings.create(booking,function(data){
                $log.debug("Submitted and data return",data);
                //after submit the booking, refresh the booking list

                deferred.resolve("Created Booking");
            },
            function(err){
                $log.error("Fail to Submit the booking",err);
                toastr.error("Fail to submit the booking, please contact Redimed to assit", 'Error');
                deferred.reject("Created Booking");
            });

            return deferred.promise;
        },
        newSubsidiaryForRedimed : function(fatherCompany,newSubsidiaryRedimed){
            $log.debug(">>newSubsidiaryForRedimed");
            var deferred = $q.defer();
            newSubsidiaryRedimed.id = 0;
            newSubsidiaryRedimed.fatherId = fatherCompany;
            $log.debug("Will add new company = ",newSubsidiaryRedimed);
            Companies.create(newSubsidiaryRedimed,function(data){
                $log.debug("new company created",data);
                deferred.resolve(data);
            },
            function(err){
                $log.error(" fail to create the new company Error = ",err)
            });

            return deferred.promise;
        }
    }
}]);
