/**
 * Created by phuongnguyen on 8/01/16.
 */
angular.module('ocsApp.MakeBooking')
.factory('MakeBookingFactory', ['BookingHeaders','toastr','BookingCandidates','$q','CompanyFactory','mysqlDate','Companies','$log','mySharedService', function (BookingHeaders,toastr,BookingCandidates,$q,CompanyFactory,mysqlDate,Companies,$log,sharedService) {
    var candidateTempId = 0;
    $log = $log.getInstance("ocsApp.MakeBooking.MakeBookingFactory");
    $log.save();
    return {
        getCandidateTempId: function(){
            candidateTempId++;
            return candidateTempId;
        },
        submitBooking:function(newBookingObj,companyObject,user){
             $log.debug("will submit the booking");
            ///submit the online booking is here !
            var deferred = $q.defer();
            var bookingHeader = {};
            bookingHeader.bookingId = 0;
            bookingHeader.poNumber = newBookingObj.poNumber;
            bookingHeader.resultEmail = newBookingObj.resultEmail;
            bookingHeader.invoiceEmail = newBookingObj.invoiceEmail;
            bookingHeader.projectIdentofication = newBookingObj.projectIdentification;
            bookingHeader.comments = newBookingObj.comments;
            bookingHeader.packageId = newBookingObj.package.id;
            bookingHeader.siteId = null;
            bookingHeader.companyId = companyObject.id;
            bookingHeader.period = null;
            bookingHeader.isbookingatredimed = companyObject.id;
            bookingHeader.paperwork = newBookingObj.paperwork;

            if(newBookingObj.bookingPerson){
                bookingHeader.bookingPerson = newBookingObj.bookingPerson;
                bookingHeader.contactNumber = newBookingObj.contactNumber;
            }else{
                bookingHeader.bookingPerson = user.bookingPerson;
                bookingHeader.contactNumber = user.contactNumber;
            }

            if(newBookingObj.customPackage){
                bookingHeader.customPackage = newBookingObj.customPackage;
            }

            if(newBookingObj.subsidiary){
                if(newBookingObj.subsidiary.fatherId==null){
                    //if admin books for the stand alone company on behalf
                    bookingHeader.companyId = newBookingObj.subsidiary.id;
                }else{
                    bookingHeader.subCompanyId = newBookingObj.subsidiary.id;
                }

            }

            if(newBookingObj.subsidiary2){
                //if admin books for the stand alone company on behalf
                bookingHeader.subCompanyId = newBookingObj.subsidiary2.id;
            }

            bookingHeader.contactEmail = user.contactEmail;
            bookingHeader.createdBy = null;
            bookingHeader.creationDate = null;
            bookingHeader.lastUpdatedBy = null;
            bookingHeader.lastUpdateDate = null;



            var candidates = [];
            for(var i in newBookingObj.newCandidates){
                candidates[i] = {};
                candidates[i].bookingId = 0;
                candidates[i].candidateId = 0;
                candidates[i].candidatesName  = newBookingObj.newCandidates[i].candidateName;
                candidates[i].gender  = newBookingObj.newCandidates[i].gender;
                candidates[i].dob = moment(newBookingObj.newCandidates[i].dob).format("YYYY-MM-DD");
                if(candidates[i].dob=="Invalid date"){
                  candidates[i].dob=null
                }
                candidates[i].phone = newBookingObj.newCandidates[i].phone;
                candidates[i].email = newBookingObj.newCandidates[i].email;
                candidates[i].position = newBookingObj.newCandidates[i].position;
                candidates[i].period  = newBookingObj.newCandidates[i].period;
                //If have Appointment time + date => appt status = 'confirmed' otherwise: 'pending': so send diffirent email template and receiver
                candidates[i].appointmentStatus = "Pending";//companyObject.defaultStatus;
                candidates[i].fromDate = moment(newBookingObj.newCandidates[i].preferredFromDate).format("YYYY-MM-DD");
                candidates[i].toDate = moment(newBookingObj.newCandidates[i].preferredToDate).format("YYYY-MM-DD");
                ///candidate.fromDate = newBookingObj.newCandidates[i].preferredFromDate;
                ///candidate.toDate = newBookingObj.newCandidates[i].preferredToDate;

                candidates[i].siteId = newBookingObj.newCandidates[i].site.id;
                candidates[i].siteName = newBookingObj.newCandidates[i].site.siteName;

                candidates[i].slots = [];
                if(newBookingObj.newCandidates[i].slot){
                    newBookingObj.newCandidates[i].slot.followingSlots.forEach(function(slot,index){
                        candidates[i].slots.push(slot.calId);
                        var calIndex = index + 2;
                        if(calIndex <= 5){
                            candidates[i]["calendarId"+calIndex] = slot.calId;
                        }
                    });

                    var apptSlot = newBookingObj.newCandidates[i].slot;
                    candidates[i].calendarId = apptSlot.calId;
                    candidates[i].practitionerId = apptSlot.doctorId;
                    candidates[i].redimedNote = apptSlot.doctorName;
                    candidates[i].appointmentTime = moment(mysqlDate(apptSlot.fromTime)).format("YYYY-MM-DD HH:mm ");
                    candidates[i].appointmentFromTime = moment(mysqlDate(apptSlot.fromTime)).format("YYYY-MM-DD HH:mm ");
                    candidates[i].appointmentToTime = moment(mysqlDate(apptSlot.toTime)).format("YYYY-MM-DD HH:mm ");
                    candidates[i].appointmentStatus = "Confirmed";
                    candidates[i].holdingId = newBookingObj.newCandidates[i].holdingId;

                }else{
                    candidates[i].appointmentStatus = "Pending";
                }

                if (newBookingObj.newCandidates[i].state){
                    candidates[i].stateId = newBookingObj.newCandidates[i].state.id;
                    candidates[i].stateName = newBookingObj.newCandidates[i].state.stateName;
                }
                if(newBookingObj.newCandidates[i].suburb) {
                    candidates[i].suburbId = newBookingObj.newCandidates[i].suburb.suburbId;
                    candidates[i].suburbName = newBookingObj.newCandidates[i].suburb.suburbName;
                }
            }

            bookingHeader.candidates = candidates;
            $log.debug("Will add this booking into the DB",bookingHeader);

            BookingHeaders.submitBooking(bookingHeader,function(data,d2){
                $log.debug("Submitted and data return",data);
                //after submit the booking, refresh the booking list
                CompanyFactory.refreshBookingList(function(data){
                    $log.debug("refresh bookinglist successfully");

                    sharedService.prepForBroadcast("Refresh booking list successfully");
                });

                for(var i in data.booking.bookingCandidates){
                    var candidate = data.booking.bookingCandidates[i];
                    if(candidate.candidateId){
                        $log.debug("> Will send email to ",candidate);
                        BookingCandidates.sendConfirmationEmail({id:candidate.candidateId,type:"new"},function(rs){
                            $log.debug(">>sendConfirmationEmail",rs);
                            if(rs.sentEmailStatus.indexOf('Error')>=0){
                                toastr.error(rs.sentEmailStatus, 'Error');
                            }else{
                                toastr.success(rs.sentEmailStatus, '');
                                $log.save();
                            }

                        });
                    }
                }

                deferred.resolve("Created Booking");
            },
            function(err){
                $log.error("Fail to Submit the booking",err);
                if(err.data.error.code == "SLOT_NOT_AVAILABLE"){
                    toastr.error(err.data.error.message, 'Error');
                }else{
                    toastr.error('Fail to submit the booking [' + err.data.error.message + ']', 'Error');
                }
                deferred.reject("Created Booking");
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
        }
    }
}]);
