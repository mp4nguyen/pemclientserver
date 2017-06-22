/**
 * Created by phuongnguyen on 8/01/16.
 */

angular.module('ocsApp.Bookings')
.factory('BookingFactory', ['Packages','BookingHeaders','toastr','BookingCandidates','$q','CompanyFactory','mysqlDate','Companies','$log','$window','RedimedSiteFactory',
                          function (Packages,BookingHeaders,toastr,BookingCandidates,$q,CompanyFactory,mysqlDate,Companies,$log,$window,RedimedSiteFactory) {

    $log = $log.getInstance("ocsApp.Bookings.BookingFactory");

    function dateformat(date,format){

        //console.log(mysqlDate(date));
        var dateAfterFormat = moment(mysqlDate(date)).format(format);
        if(dateAfterFormat =="Invalid date")
            return "";
        else
            return dateAfterFormat;
    };

    function sendConfirmationEmail(candidate){
            $log.debug("> Will send email to ",candidate);
            if(candidate.appointmentStatus.indexOf('Pending')>=0 )
            {
                BookingCandidates.sendConfirmationEmail({id:candidate.candidateId,type:"pending"},function(rs){
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
                BookingCandidates.sendConfirmationEmail({id:candidate.candidateId,type:"new"},function(rs){
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

    function getPackage(packages,packId) {
      // perform some asynchronous operation, resolve or reject the promise when appropriate.
      return $q(function(resolve, reject) {

        var package = _.where(packages, {id:packId})[0];

        $log.debug("> package found in the catch for view booking form = ",package);

        if(package){
            //printForm($window,entity,package);

            resolve(package);
        }else{
            Companies.getPackages({id:packId},function(res){
                $log.debug("> package found in the server for view booking form = ",res);
                if(res.packages.length > 0){
                  resolve(res.packages[0]);
                }else{
                  resolve({});
                }
            },function(err){
                reject(err);
            });
        }
      });
    };

    function printForm(w,entity,package){
      var packageView = "";
      var pdfPackageView = [];
      $log.debug(" printBookingForm has package ");
      for(var i in package.AssessmentHeaders){
          var header = package.AssessmentHeaders[i];
          packageView = packageView + "<b>" + header.headerName + "</b><br>";
          pdfPackageView.push({text:header.headerName,bold:true});
          var pdfAss = [];
          for(var j in header.Assessments){
              var ass = header.Assessments[j];
              packageView = packageView + " - " + ass.assName + "<br>";
              pdfAss.push(" - " +ass.assName);
          }
          pdfPackageView.push(pdfAss);
      }

      $log.debug(" printBookingForm has package view ");

      var siteName = entity.siteName;
      if(entity.stateName){
          siteName = siteName + ' - ' + entity.stateName;
      }
      if(entity.suburbName){
          siteName = siteName + ' - ' + entity.suburbName;
      }

      var templateHTML =
          '<table cellspacing="0" cellpadding="4" align="center" style="border-collapse: collapse"> \n' +
          '<tbody><tr><td colspan="4" bgcolor="Silver"><b>Booking Details</b></td></tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Company</td> \n' + '<td style="border:1px solid gray" colspan="3">'+entity.fatherCompanyName+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Subsidiary</td> \n' + '<td style="border:1px solid gray" colspan="3">'+entity.companyName+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">PO Number</td> \n' + '<td style="border:1px solid gray" colspan="3">'+entity.poNumber+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Project Identification</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.projectIdentofication+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Booking Person</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.bookingPerson+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Booking Person Contact Number</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.contactNumber+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Results to</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.resultEmail+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Invoices to</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.invoiceEmail+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Comments</td> \n' +'<td style="border:1px solid gray" colspan="3">'+entity.comments+'</td> \n' +
          '</tr> \n' +

          '<tr><td colspan="4" bgcolor="Silver"><b>Worker Details</b></td></tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Name</td> \n' +
          '<td style="border:1px solid gray">'+entity.candidatesName+'</td> \n' +
          '<td style="border:1px solid gray">DOB</td> \n' +
          '<td style="border:1px solid gray">'+ dateformat(entity.dob,"DD/MM/YYYY")+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Phone</td> \n' +
          '<td style="border:1px solid gray">'+entity.phone+'</td> \n' +
          '<td style="border:1px solid gray">Email</td> \n' +
          '<td style="border:1px solid gray">'+entity.email+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Position applied for</td> \n' +
          '<td style="border:1px solid gray" colspan="3">'+entity.position+'</td> \n' +
          '</tr> \n' +
          '<tr><td colspan="4" bgcolor="Silver"><b>Paperwork</b></td></tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray" colspan="4"> \n' +
          ''+ entity.paperwork +'</td></tr> \n' +

          '<tr><td colspan="4" bgcolor="Silver"><b>Assessment Details</b></td></tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray" colspan="4"> \n' +
          ''+ packageView +'</td></tr> \n' +


          '<tr><td colspan="4" bgcolor="Silver"><b>Appointment Details</b></td></tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Appointment location</td> \n' +
          '<td style="border:1px solid gray" colspan="3">' + siteName + '</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Appointment time</td> \n' +
          '<td style="border:1px solid gray" colspan="3">'+ dateformat(entity.appointmentTime,"DD/MM/YYYY HH:mm")+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Appointment Notes</td> \n' +
          '<td style="border:1px solid gray" colspan="3">'+entity.appointmentNotes+'</td> \n' +
          '</tr> \n' +
          '<tr> \n' +
          '<td style="border:1px solid gray">Appointment status</td> \n' +
          '<td style="border:1px solid gray" colspan="3">'+entity.appointmentStatus+'</td> \n' +
          '</tr> \n' +
          '</tbody></table>';

      $log.debug("Print candidate form");
      var OpenWindow = w.open('modules/Bookings/views/bookingform.html', '','');
      OpenWindow.dataFromParent = templateHTML;

  };


    return {
        getCalendar:function(siteId,period,user){
            var deferred = $q.defer();
            //Plus toDate one date before query calendar because of time
            var fromDate = new Date();
            var toDate = new Date();
            toDate.setDate(toDate.getDate() + 60);
            RedimedSiteFactory.getCalendar(siteId,fromDate,toDate,period,function(data){
                $log.debug("finished getCalendar....");
                console.log(" BookingFactory.getCalendar = ",data)
                deferred.resolve(data)
            });
            return deferred.promise;
        },
        cancelAppointment:function(candidate){
            var deferred = $q.defer();
            var updateValue = {};
            updateValue.appointmentNotes = candidate.appointmentNotes;
            updateValue.candidateId = candidate.candidateId;
            $log.debug("will cancel the booking ",updateValue);

            BookingHeaders.cancelBooking(updateValue,function(res,header){
                $log.debug('updated successfully');
                toastr.success('Successfully updated. The booking list will refresh shortly !');
                //$uibModalInstance.close(that.BookingCandidate);
                sendConfirmationEmail(candidate);
                CompanyFactory.refreshBookingList(function(data){
                    toastr.success('The booking list has been refresh');
                    deferred.resolve('cancel successfully');
                });
            },
            function(err){
                $log.error('updated failed',err);
                toastr.error("Fail to update err = "+ err.data.error.message, 'Error');
                deferred.reject(err.data.error.message);
            });
            return deferred.promise;
        },
        attended:function(candidate){
              var updateValue = {};
              var deferred = $q.defer();
              updateValue.appointmentStatus = 'Attended';
              BookingCandidates.update({where:{candidateId:candidate.candidateId}},updateValue,function(res,header){
                  deferred.resolve('Attended successfully');
              },
              function(err){
                  $log.error('updated failed',err);
                  toastr.error("Fail to update", 'Error');
              });
              return deferred.promise;
        },
        sendConfirmationEmail: function(candidate){
            sendConfirmationEmail(candidate);
        },
        getPackage:function(packages,packId){
            return getPackage(packages,packId);
        },
        viewBookingDetail: function(packages,entity){

          var promise = getPackage(packages,entity.packageId);

          promise.then(function(greeting) {
              printForm($window,entity,greeting);
          }, function(reason) {
              printForm($window,entity,'');
              $log.error('Failed: ' + reason);
          });
        }
    }
}]);
