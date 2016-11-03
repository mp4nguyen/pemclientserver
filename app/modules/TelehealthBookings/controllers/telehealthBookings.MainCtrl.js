/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.TelehealthBookings')
    .controller('TelehealthBookingsMainCtrl',['uiGridConstants','$scope','$window','CompanyFactory','$uibModal','$cookieStore','$log','mysqlDate','mySharedService','Packages','$q', function (uiGridConstants,$scope,$window,CompanyFactory,$uibModal,$cookieStore,$log, mysqlDate,sharedService,Packages,$q) {
        $log = $log.getInstance("ocsApp.TelehealthBookings.TelehealthBookingsMainCtrl");
        $log.debug("I am telehealth booking list controller.");

        var that = this;
        this.window = $window;
        var packages = [];
        this.loading = false;
        this.user = CompanyFactory.getCurrentUser();
        var columnDefs = [
            { field: 'employer', displayName: "Employer Name", width: "150"},
            //{ field: 'subCompanyName', displayName: "Company Name", width: "150"},
            {
                field: 'patientName',
                displayName: 'Patient Name',
                width: "200"
            },
            { field: 'dob', displayName: "DOB", width: "100",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy\''},
            { field: 'apptDate', displayName: "Appointment Date", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy\''},
            { field: 'preferredTime', displayName: "Preferred Time", width: "100"},
            { field: 'address', displayName: "Address", width: "100"},
            { field: 'suburb', displayName: "Suburb", width: "100"},
            { field: 'state', displayName: "State", width: "100"},
            { field: 'facetime', displayName: "Facetime", width: "100"},
            { field: 'skype', displayName: "Skype", width: "100"},
            { field: 'contactNumber', displayName: "Contact Number", width: "100"},
            { field: 'bookingPerson', displayName: "Booking Person", width: "150"},
            { field: 'creationDate', displayName: "Creation Date",  width: "200",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm\''},
            { field: 'createdBy', displayName: "By",  width: "50"},
            { field: 'linkId', displayName: "Link ID",  width: "50"}
        ];



        this.isAdmin = function(){
            return this.user.userType.indexOf("RediMed") >= 0;
        };

        function dateformat(date,format){

            //console.log(mysqlDate(date));
            var dateAfterFormat = moment(mysqlDate(date)).format(format);
            if(dateAfterFormat =="Invalid date")
                return "";
            else
                return dateAfterFormat;
        };

        this.gridOptions = {
            enableSorting: true,
            enableColumnResizing: true,
            enableFiltering: true,
            appScopeProvider: this,
            columnDefs: columnDefs,
            onRegisterApi: function( gridApi ) {
                $scope.gridApi = gridApi;
                $scope.gridApi.core.on.sortChanged($scope, function (grid, sortColumns) {

                    //console.log(sortColumns);
                });
            },
            enableGridMenu: true,
            enableRowSelection: false,
            enableSelectAll: false,
            exporterMenuPdf: false,
            exporterCsvFilename: 'myFile.csv',
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
        };

        $scope.$on('handleBroadcast', function() {
            var msg = sharedService.message;
            $log.debug("Received a message from AdminEditBookingCtrl = " + msg);
            if( msg.indexOf("Refresh booking list successfully") >= 0 ){
                CompanyFactory.getCompany(function(data){
                    $log.debug("Refresh bookings, get company info");
                    toastr.success('The booking list has been refreshed !');
                    that.gridOptions.data = data.telehealthBookings;
                });
            }
        });

        this.refreshBooking = function(){
            $log.debug("will refresh booking ; get data from DB......");
            that.loading = true;
            CompanyFactory.refreshTelehealthBookingList(function(data){
                    $log.debug("refreshed booking ; get data from DB......");
                    that.gridOptions.data = data.telehealthBookings;
                    that.loading = false;
            });
        }

        CompanyFactory.getCompany(function(data){

            $log.debug("Make booking, get company info");
           // console.log(data);
            that.gridOptions.data = data.telehealthBookings;
            that.loading = false;
            packages = data.packages;// ==null? data.packages:data.allPackages;

        });

    }]);
