/**
 * Created by phuongnguyen on 8/01/16.
 */
angular.module('ocsApp.MakePEMPhoneBooking')
.factory('MakePEMPhoneBookingFactory', ['BookingHeaders','BookingCandidates','Companies','toastr','$log','$q', function (BookingHeaders,BookingCandidates,Companies,toastr,$log,$q) {
    $log = $log.getInstance("ocsApp.MakePEMPhoneBooking.MakePEMPhoneBookingFactory");
    return {
        emailBookingForm:function(bookingInfo){
            $log.debug("will send the booking form");
            var deferred = $q.defer();
            BookingHeaders.emailBookingForm(bookingInfo,function(data,d2){
                $log.debug("Submitted and data return",data);
                deferred.resolve("Created Booking");
            },
            function(err){
                $log.error("Fail to Submit the booking",err);
                toastr.error("Fail to submit the booking, please contact Redimed to assit", 'Error');
                deferred.reject("Created Booking");
            });

            return deferred.promise;
        },

        getAssessments:function(){
            $log.debug("will get assessments for the booking form");
            var deferred = $q.defer();

            Companies.getPhoneBookingHeader(function(data,d2){
                $log.debug("getPhoneBookingHeader",data);
            },
            function(err){
                $log.error("Fail to get assessments",err);
            });

            Companies.getAssessments(function(data,d2){
                $log.debug("get assessments from server",data);
                deferred.resolve(data);
            },
            function(err){
              if(err.data.error.message == "Authorization Required" || err.data.error.message == "Invalid Access Token"){
                $log.error("Fail to get assessments",err);
                toastr.error("Session is expired. Please contact Redimed to receive the new booking form", 'Error');
                deferred.reject("Fail to get assessments");
              }else{
                $log.error("Fail to get assessments",err);
                toastr.error("Fail to get assessments, please contact Redimed to assit (" + err + ")" , 'Error');
                deferred.reject("Fail to get assessments");
              }

            });

            return deferred.promise;
        },

        getPhoneBookingHeader:function(){
            $log.debug("will get getPhoneBookingHeader for the booking form");
            var deferred = $q.defer();

            Companies.getPhoneBookingHeader(function(data,d2){
                $log.debug("getPhoneBookingHeader",data);
                deferred.resolve(data.phoneBookingHeader);
            },
            function(err){
                $log.error("Fail to get getPhoneBookingHeader",err);
                deferred.reject("Fail to get getPhoneBookingHeader",err);
            });

            return deferred.promise;
        },

        newSubsidiaryForRedimed : function(newSubsidiaryRedimed){
            $log.debug(">>newSubsidiaryForRedimed");
            var deferred = $q.defer();
            newSubsidiaryRedimed.id = 0;
            newSubsidiaryRedimed.fatherId = 112;
            $log.debug("Will add new company = ",newSubsidiaryRedimed);
            Companies.create(newSubsidiaryRedimed,function(data){
                $log.debug("new company created",data);
                deferred.resolve(data);
            },
            function(err){
                $log.error(" fail to create the new company Error = ",err)
            });

            return deferred.promise;
        },

        submitBooking:function(bookingCandidate,assessments){
            var deferred = $q.defer();
            var data = {
                        bookingId: bookingCandidate.bookingId,
                        poNumber: bookingCandidate.po,
                        resultEmail: bookingCandidate.resultEmail,
                        invoiceEmail: bookingCandidate.bookingPersonEmail,
                        packageId: 0,
                        siteId: null,
                        companyId: bookingCandidate.companyId,
                        subCompanyId: bookingCandidate.subCompanyId,
                        period: null,
                        paperwork: 'Redimed',
                        bookingPerson: bookingCandidate.bookingPerson,
                        customPackage: assessments,
                        contactEmail: bookingCandidate.bookingPersonEmail,
                        comments: bookingCandidate.comment,
                        candidates:
                         [ { bookingId: bookingCandidate.bookingId,
                             candidateId: 0,
                             candidatesName: bookingCandidate.candidateName,
                             dob: moment(bookingCandidate.dob).format("YYYY-MM-DD"),
                             phone: bookingCandidate.number,
                             email: bookingCandidate.email,
                             position: bookingCandidate.position,
                             appointmentStatus: 'Pending',
                             fromDate: moment(bookingCandidate.preferredFromDate).format("YYYY-MM-DD"),
                             toDate: moment(bookingCandidate.preferredToDate).format("YYYY-MM-DD"),
                             siteId: bookingCandidate.site.id,
                             siteName: bookingCandidate.site.siteName,
                             preferredTime: bookingCandidate.preferredTime,
                             isRedimedCallCandidate: bookingCandidate.isRedimedCallCandidate
                           }
                         ]
                      };

            if (bookingCandidate.preferredState){
                data.candidates[0].stateId = bookingCandidate.preferredState.id;
                data.candidates[0].stateName = bookingCandidate.preferredState.siteName;
            }

            if(bookingCandidate.preferredSuburb) {
              data.candidates[0].suburbId = bookingCandidate.preferredSuburb.id;
              data.candidates[0].suburbName = bookingCandidate.preferredSuburb.siteName;
            }

            $log.debug('will submit phone booking = ',data);
            BookingHeaders.submitPhoneBooking(data,function(data){
                $log.debug(' after submitPhoneBooking = ',data);
                deferred.resolve(data);

            },
            function(err){
                deferred.reject(err);
                $log.error(" fail to submitPhoneBooking = ",err)
                toastr.error("Fail to submit the booking (err = " + err + ")", 'Error');
            });

            return deferred.promise;
        }
    }
}]);
