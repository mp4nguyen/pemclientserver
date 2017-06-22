/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.Bookings')
    .controller('BookingsMainCtrl',['uiGridConstants','$scope','$window','CompanyFactory','BookingFactory','$uibModal','$cookieStore','$log','mysqlDate','mySharedService','Packages','$q', function (uiGridConstants,$scope,$window,CompanyFactory,BookingFactory,$uibModal,$cookieStore,$log, mysqlDate,sharedService,Packages,$q) {
        $log = $log.getInstance("ocsApp.Bookings.BookingsMainCtrl");

        var that = this;
        this.window = $window;
        var packages = [];
        this.loading = false;
        this.user = CompanyFactory.getCurrentUser();

        var docDefinition = {
          content: [

                    ],
          styles: {
            header: {
              bold: true,
              color: '#000',
              fontSize: 11
            },
            demoTable: {
              color: '#666',
              fontSize: 10
            }
          }
        };

        this.openPdf = function(entity,isDownload) {
          //console.log(" entity.packageId = ",entity.packageId);

          var promise = BookingFactory.getPackage(packages,entity.packageId);


          promise.then(function(package) {
              printForm(entity,package);
          }, function(reason) {
              printForm(entity,'');
              $log.error('Failed: ' + reason);
          });

      var printForm = function(entity,package){
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

          $log.debug(" pdf printBookingForm has package view  ");

          var siteName = entity.siteName;
          if(entity.stateName){
              siteName = siteName + ' - ' + entity.stateName;
          }
          if(entity.suburbName){
              siteName = siteName + ' - ' + entity.suburbName;
          }

          docDefinition = {
            content: [
              {
               text: 'Booking Form',
               style: 'header',
               alignment: 'center'
             },
              {
                 style: 'tableExample',
                 color: '#444',
                 table: {
                     widths: [ 200, 300],
                     headerRows: 5,
                     // keepWithHeaderRows: 1,
                     body: [
                         [{ text: 'Company Details', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          ['Company', entity.fatherCompanyName],
                          ['Subsidiary', entity.companyName],
                          ['PO Number', entity.poNumber],
                          ['Project Identification', entity.projectIdentofication],
                          ['Booking Person', entity.bookingPerson],
                          ['Booking Person Contact Number', entity.contactNumber],
                          ['Results to', entity.resultEmail],
                          ['Invoices to', entity.invoiceEmail],
                          ['Comments', entity.comments],
                          [{ text: 'Worker Details', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          ['Candidate Name', entity.candidatesName],
                          ['Date Of Birth', dateformat(entity.dob,"DD/MM/YYYY")],
                          ['Phone', entity.phone],
                          ['Email', entity.email],
                          ['Position Applied For', entity.position],
                          [{ text: 'Paperwork', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          [{ colSpan: 2, text:  entity.paperwork}, '' ],
                          [{ text: 'Assessment Details', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          [ { colSpan: 2,
                              stack: pdfPackageView
                            },
                            ''
                          ],
                          [{ text: 'Appointment Details', style: 'tableHeader', colSpan: 2, alignment: 'center' }, {}],
                          ['Appointment location', siteName],
                          ['Appointment time', dateformat(entity.appointmentTime,"DD/MM/YYYY HH:mm")],
                          ['Appointment Notes', entity.appointmentNotes],
                          ['Appointment status', entity.appointmentStatus],

                     ]
                 }
             }
            ],
            styles: {
              header: {
               fontSize: 18,
               bold: true,
               margin: [0, 0, 0, 10]
             },
             subheader: {
               fontSize: 16,
               bold: true,
               margin: [0, 10, 0, 5]
             },
             tableExample: {
               margin: [0, 5, 0, 15],
                fontSize: 9,
             },
             tableHeader: {
               bold: true,
               fontSize: 11,
               color: 'black'
             }
            }
          };

          if(isDownload){
            pdfMake.createPdf(docDefinition).download();
          }else{
            pdfMake.createPdf(docDefinition).open();
          }

       };
      }

       this.downloadPdf = function() {
         pdfMake.createPdf(docDefinition).download();
       };

       //<button ng-click="grid.appScope.openPdf(row.entity)" class="blue">Pdf Form</button>

        var columnDefs = [
            {
                field: 'viewCandidate',
                displayName: 'Action',
                width: "300",
                enableFiltering: false,
                enableCellEdit: false,
                cellTemplate:'<button ng-click="grid.appScope.adminEditBooking(row.entity)" class="blue">View Details</button><button ng-click="grid.appScope.openPdf(row.entity,1)" class="blue">Download Form</button>'
            },
            { field: 'fatherCompanyName', displayName: "Company Name", width: "150"},
            { field: 'companyName', displayName: "Subsidiary", width: "150"},
            //{ field: 'subCompanyName', displayName: "Company Name", width: "150"},
            {
                field: 'candidatesName',
                displayName: 'Candidate Name',
                width: "200",
                enableCellEdit: false,
                cellTemplate:'<a ng-click="grid.appScope.printBookingForm(row.entity)" class="blue">{{row.entity.candidatesName}}</a>'
            },
            { field: 'appointmentTime', displayName: "Appointment Time", width: "250",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm\'' ,
                filters:[
                    {condition:checkStart},
                    {condition:checkEnd}],
                filterHeaderTemplate: '<div class="ui-grid-filter-container">from: <input style="display:inline; width:35%"  class="ui-grid-filter-input" date-picker type="text" ng-model="col.filters[0].term"/> - <input style="display:inline; width:35%" class="ui-grid-filter-input" date-picker type="text" ng-model="col.filters[1].term"/></div>'
            },
            { field: 'siteName', displayName: "Site", width: "100"},
            { field: 'stateName', displayName: "State", width: "100"},
            { field: 'suburbName', displayName: "Suburb", width: "100"},
            { field: 'bookingPerson', displayName: "Booking Person", width: "150"},
            { field: 'comments', displayName: "Booking Comments", width: "200"},
            { field: 'appointmentNotes', displayName: "Notes", width: "200"},

            { field: 'appointmentStatus', displayName: "Status", width: "100"},
            { field: 'projectIdentofication', displayName: "Project Indentification", width: "120"},
            { field: 'poNumber', displayName: "PO Number", width: "120"},
            { field: 'packageName', displayName: "Package Name", width: "200"},
            { field: 'paperwork', displayName: "Paperwork", width: "100"},
            { field: 'email', displayName: "Email", width: "150"},
            { field: 'dob', displayName: "DOB", width: "100",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy\''},
            { field: 'creationDate', displayName: "Creation Date",  width: "200",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm\''},
            { field: 'createdBy', displayName: "By",  width: "50"},
            { field: 'headerCandidateId', displayName: "Link ID",  width: "50"},
            { field: 'issendemail', displayName: "Send Email",  width: "50"}
        ];



        this.isAdmin = function(){
            return that.user.userType.indexOf("RediMed") >= 0;
        };

        function dateformat(date,format){

            //console.log(mysqlDate(date));
            var dateAfterFormat = moment(mysqlDate(date)).format(format);
            if(dateAfterFormat =="Invalid date")
                return "";
            else
                return dateAfterFormat;
        };

        this.adminEditBooking = function(entity){

            var modalInstance = $uibModal.open({
                animation: false,
                backdrop: 'static',
                windowTopClass : 'modal1',
                templateUrl: 'modules/Bookings/views/bookings.adminEditBooking.html',
                controller: 'AdminEditBookingCtrl',
                controllerAs: 'AdminEditBookingCtrl',
                size: 'lg',
                resolve : {
                    candidate:function(){return entity;}
                }
            });

            modalInstance.result.then(function (rs) {
                //console.log(rs);

            }, function (rs) {
                //console.log(rs);

            });
        }


        this.printBookingForm = function(entity){
            BookingFactory.viewBookingDetail(packages,entity);
        };



        function checkStart(term, value, row, column) {

            term = term.replace(/\\/g,"")
            var now = moment(value);
            if(term) {
                var startDate = moment(term, "DD/MM/YYYY");
                var isAfter = startDate.isAfter(now, 'day');
                if(isAfter) return false;
            }
            return true;
        }

        function checkEnd(term, value, row, column) {
            term = term.replace(/\\/g,"")
            var now = moment(value);
            if(term) {
                var endDate = moment(term, "DD/MM/YYYY");
                var isBefore = endDate.isBefore(now, 'day');
                if(isBefore) return false;
            }
            return true;
        }


        var rowtpl = '<div ng-class="{ red: row.entity.issendemail == null || row.entity.headerCandidateId == null }"><div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }" ui-grid-cell></div></div>';

        this.gridOptions = {
            enableSorting: true,
            rowTemplate:rowtpl,
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
                    that.gridOptions.data = data.allBookings;
                });
            }
        });

        this.refreshBooking = function(){
            $log.debug("will refresh booking ; get data from DB......");
            that.loading = true;
            CompanyFactory.refreshBookingList(function(data){
                    $log.debug("refreshed booking ; get data from DB......");
                    that.gridOptions.data = data.allBookings;
                    that.loading = false;
            });
        }

        CompanyFactory.getCompany(function(data){

            $log.debug("Make booking, get company info");
           // console.log(data);
            that.gridOptions.data = data.allBookings;
            that.loading = false;
            packages = data.packages;// ==null? data.packages:data.allPackages;

        });

    }]);
