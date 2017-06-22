/**
 * Created by phuongnguyen on 27/11/15.
 */
angular.module('ocsApp.BookingReports')
    .controller('BookingReportsMainCtrl',['Companies','BookingCandidateByApptDateV','BookingCandidateByBookingDateV','mysqlDate','mySocket','$scope', function (Companies,BookingCandidateByApptDateV,BookingCandidateByBookingDateV,mysqlDate,mySocket,$scope) {

        console.log("I am booking report controller.");
        var that = this;
        this.positions = [];
        this.myJson = {};
        this.myJson2 = {};
        this.dateStatus = {};
        this.dateStatus.fromDateOpened = false;
        this.dateStatus.toDateOpened = false;
        this.format = "dd/MM/yyyy";
        this.apptSumary = [];
        this.totalApptToday = 0;
        this.bookingTodaySumary = [];
        this.totalBookingToday = 0;
        this.todayDate = moment(new Date()).format('DD MMM');
        this.fromDate = new Date();
        this.toDate = new Date();
        this.fromDate.setDate(this.fromDate.getDate() - 7);
        this.toDate.setDate(this.toDate.getDate() + 7);
        ////Online Users Begin////

        var columnDefs = [
            { field: 'onlineAt', displayName: "loginAt", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm:ss\''},
            { field: 'loginAt', displayName: "loginAt", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm:ss\''},
            { field: 'logoutAt', displayName: "logoutAt", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm:ss\''},
            { field: 'offlineAt', displayName: "offlineAt", width: "150",type: 'date', cellFilter: 'dateFilter|date:\'dd/MM/yyyy HH:mm:ss\''},
            { field: 'userName', displayName: "userName", width: "100"},
            { field: 'socketId', displayName: "socketId", width: "100"},
            { field: 'ip', displayName: "ip", width: "170"},
            { field: 'companyName', displayName: "companyName", width: "100"},
            { field: 'pid', displayName: "pid", width: "100"},
            { field: 'worker', displayName: "worker", width: "100"}
        ];

        this.gridOptions = {
            enableSorting: true,
            enableColumnResizing: true,
            enableFiltering: true,
            appScopeProvider: this,
            columnDefs: columnDefs,
            enableGridMenu: true,
            enableRowSelection: false,
            enableSelectAll: false,
            exporterMenuPdf: false,
            exporterCsvFilename: 'myFile.csv',
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location"))
        };

        mySocket.on('OnlineUsersData',function(data){
            console.log('Receive OnlineUsers = ');
            that.gridOptions.data = data;
        });
        mySocket.emit('GetOnlineUsers');
        //////Online Users End/////

        $scope.$on('$destroy', function () {
            $log.debug('remove socket.io listener.....................');
            mySocket.removeListener('OnlineUsersData');
        });

        getDataForReports();

        this.openFromDate = function($event) {
          console.log('emitting data');
            that.dateStatus.fromDateOpened = true;
        };

        this.openToDate = function($event) {
            that.dateStatus.toDateOpened = true;
        };

        this.fromOrToDateChanged = function(){
            getDataForReports();
        };

        this.synSites = function(){
            Companies.synSites();
        }

        this.synRosters = function(){
            Companies.synCalendars();
        }

        function dateformat(date,format){
            var dateAfterFormat = moment(mysqlDate(date)).format(format);
            if(dateAfterFormat =="Invalid date")
                return "";
            else
                return dateAfterFormat;
        };

        function getDataForReports(){

            that.apptSumary = [];
            that.totalApptToday = 0;
            that.bookingTodaySumary = [];
            that.totalBookingToday = 0;

            BookingCandidateByApptDateV.find({filter:{where:{apptDate:{between:[that.fromDate,that.toDate]}},order:"apptDate"}},function(data){
                //console.log("fromDate = ",fromDate,"toDate = ",toDate,data);
                var dateArray = [];
                var siteArray = [];
                var currentDate = "";
                var currentSite = ""
                var index = -1;
                var xArray = [];
                var dataArray = [];
                var seriesArray = [];
                var colorArray = ['#1c8d62','#2c9ff2','#3cadd2','#4dba62','#5cc162','#61d5b2','#74e4b2','#81fd67','#f91264'];
                var labelsArray = [];

                for(var i in data){
                    var tempSiteIndex =  _.indexOf(siteArray, data[i].siteName);
                    if(tempSiteIndex == -1 && data[i].siteName != undefined){
                        siteArray.push(data[i].siteName);
                        dataArray.push([]);
                    }
                }

                siteArray = siteArray.sort();

                for(var i in data){
                    if(currentDate != data[i].apptDate + ""){
                        var element = {};
                        for(var j in siteArray){
                            element[siteArray[j]] = 0;
                        }
                        index++;
                        currentDate = data[i].apptDate + "";

                        element.apptDate = (data[i].apptDate+"").substr(0,10);
                        element[data[i].siteName] = data[i].quantity;
                        dateArray.push(element);
                    }else{
                        dateArray[index][data[i].siteName] = data[i].quantity;
                    }
                }

                ///total array
                dataArray.push([]);

                for(var i in dateArray){
                    dateFortmat = dateformat(dateArray[i].apptDate,'DD MMM');
                    xArray.push(dateFortmat);
                    if(dateFortmat+"" == that.todayDate+""){
                        //get today infor to display on the summary
                        var total = 0;
                        for(var j in siteArray){
                            var q =  dateArray[i][siteArray[j]];
                            dataArray[j].push(q);
                            total = total + q;
                            that.apptSumary.push({site:siteArray[j],quantity:q});
                        }
                        //calculate total of all sites
                        dataArray[siteArray.length].push(total);
                        that.totalApptToday = total;
                    }else{
                        var total = 0;
                        for(var j in siteArray){
                            dataArray[j].push(dateArray[i][siteArray[j]]);
                            total = total + dateArray[i][siteArray[j]];
                        }
                        //calculate total of all sites
                        dataArray[siteArray.length].push(total);
                    }
                }

                siteArray.push("Total");
                //console.log(xArray,dataArray,that.apptSumary);

                for(var j in siteArray){
                    var e =
                    {
                        "values":dataArray[j],
                        "line-color": colorArray[j],
                        "aspect": "spline",
                        "background-color": "#fc8d62",
                        "alpha-area": ".3",
                        "font-family": "Roboto",
                        "font-size": "14px",
                        "text": siteArray[j]
                    }
                    seriesArray.push(e);

                    var l =
                    {
                        "text": siteArray[j] + ": %plot-" + j + "-value",
                        "default-value": "",
                        "color": colorArray[j],
                        "x": (5 + j*15) + "%",
                        "y": 50,
                        "width": 120,
                        "text-align": "left",
                        "bold": 0,
                        "font-size": "12px",
                        "font-weight": "bold"
                    };

                    labelsArray.push(l);
                }

                ////////////////////
                that.myJson =  {
                    "globals":{
                        "font-family": "Roboto"
                    },
                    "graphset": [
                        {
                            "type": "area",
                            "background-color": "#fff",
                            "utc": true,
                            "title": {
                                "y": "15px",
                                "text": "Patient Attending Today",
                                "background-color": "none",
                                "font-color": "#05636c",
                                "font-size": "24px",
                                "height": "25px",
                                "adjust-layout":true
                            },
                            "plotarea": {
                                "margin-top":"10%",
                                "margin-right":"dynamic",
                                "margin-bottom":"dynamic",
                                "margin-left":"dynamic",
                                "adjust-layout":true
                            },
                            "labels": labelsArray,
                            "scale-x": {
                                "label": {
                                    "text":"Date Range",
                                    "font-size": "14px",
                                    "font-weight": "normal",
                                    "offset-x": "10%",
                                    "font-angle": 360
                                },
                                "item": {
                                    "text-align": "center",
                                    "font-color": "#05636c"
                                },
                                "zooming": 1,

                                "labels": xArray,

                                "items-overlap": true,
                                "guide": {
                                    "line-width": "0px"
                                },
                                "tick": {
                                    "line-width": "2px"
                                },
                            },
                            "crosshair-x": {
                                "line-color":"#fff",
                                "line-width":1,
                                "plot-label": {
                                    "visible": false
                                }
                            },
                            "scale-y": {
                                "item": {
                                    "font-color": "#05636c",
                                    "font-weight": "normal"
                                },
                                "label":{
                                    "text":"Metrics",
                                    "font-size":"14px"
                                },
                                "guide": {
                                    "line-width": "0px",
                                    "alpha": 0.2,
                                    "line-style": "dashed"
                                }
                            },
                            "plot": {
                                "line-width": 2,
                                "marker": {
                                    "size": 1,
                                    "visible": false
                                },
                                "tooltip": {
                                    "font-family": "Roboto",
                                    "font-size": "14px",
                                    "text": "There were %v %t on %data-days",
                                    "text-align": "left"
                                }
                            },
                            "series": seriesArray
                        }
                    ]
                };
                ////////////////////
            });


            BookingCandidateByBookingDateV.find({filter:{where:{bookingDate:{between:[(new Date(that.fromDate)),(new Date(that.toDate))]}},order:"bookingDate"}},function(data){

                var dateArray = [];
                var siteArray = [];
                var currentDate = "";
                var currentSite = ""
                var index = -1;
                var xArray = [];
                var dataArray = [];
                var seriesArray = [];
                var colorArray = ['#1c8d62','#2c9ff2','#3cadd2','#4dba62','#5cc162','#61d5b2','#74e4b2','#81fd67','#f91264'];
                var labelsArray = [];

                for(var i in data){
                    var tempSiteIndex =  _.indexOf(siteArray, data[i].siteName);
                    if(tempSiteIndex == -1 && data[i].siteName != undefined){
                        siteArray.push(data[i].siteName);
                        dataArray.push([]);
                    }
                }

                siteArray = siteArray.sort();

                for(var i in data){
                    if(currentDate != data[i].bookingDate + ""){
                        var element = {};
                        for(var j in siteArray){
                            element[siteArray[j]] = 0;
                        }
                        index++;
                        currentDate = data[i].bookingDate + "";

                        element.bookingDate = (data[i].bookingDate+"").substr(0,10);
                        element[data[i].siteName] = data[i].quantity;
                        dateArray.push(element);
                    }else{
                        dateArray[index][data[i].siteName] = data[i].quantity;
                    }
                }

                ///total array
                dataArray.push([]);

                for(var i in dateArray){
                    /*
                    xArray.push(dateformat(dateArray[i].bookingDate,'DD MMM'));
                    var total = 0;
                    for(var j in siteArray){
                        dataArray[j].push(dateArray[i][siteArray[j]]);
                        total = total + dateArray[i][siteArray[j]];
                    }
                    //calculate total of all sites
                    dataArray[siteArray.length].push(total);
                    */
                    ///////////////
                    dateFortmat = dateformat(dateArray[i].bookingDate,'DD MMM');
                    xArray.push(dateFortmat);

                    if(dateFortmat+"" == that.todayDate+""){
                        //get today infor to display on the summary
                        var total = 0;
                        for(var j in siteArray){
                            var q =  dateArray[i][siteArray[j]];
                            dataArray[j].push(q);
                            total = total + q;
                            that.bookingTodaySumary.push({site:siteArray[j],quantity:q});
                        }
                        //calculate total of all sites
                        dataArray[siteArray.length].push(total);
                        that.totalBookingToday = total;
                    }else{
                        var total = 0;
                        for(var j in siteArray){
                            dataArray[j].push(dateArray[i][siteArray[j]]);
                            total = total + dateArray[i][siteArray[j]];
                        }
                        //calculate total of all sites
                        dataArray[siteArray.length].push(total);
                    }
                }

                siteArray.push("Total");
                //console.log(xArray,dataArray);


                for(var j in siteArray){
                    var e =
                    {
                        "values":dataArray[j],
                        "line-color": colorArray[j],
                        "aspect": "spline",
                        "background-color": "#fc8d62",
                        "alpha-area": ".3",
                        "font-family": "Roboto",
                        "font-size": "14px",
                        "text": siteArray[j]
                    }
                    seriesArray.push(e);

                    var l =
                    {
                        "text": siteArray[j] + ": %plot-" + j + "-value",
                        "default-value": "",
                        "color": colorArray[j],
                        "x": (5 + j*15) + "%",
                        "y": 50,
                        "width": 120,
                        "text-align": "left",
                        "bold": 0,
                        "font-size": "12px",
                        "font-weight": "bold"
                    };

                    labelsArray.push(l);
                }

                ////////////////////
                that.myJson2 =  {
                    "globals":{
                        "font-family": "Roboto"
                    },
                    "graphset": [
                        {
                            "type": "area",
                            "background-color": "#fff",
                            "utc": true,
                            "title": {
                                "y": "15px",
                                "text": "New Booking Today",
                                "background-color": "none",
                                "font-color": "#05636c",
                                "font-size": "24px",
                                "height": "25px",
                                "adjust-layout":true
                            },
                            "plotarea": {
                                "margin-top":"10%",
                                "margin-right":"dynamic",
                                "margin-bottom":"dynamic",
                                "margin-left":"dynamic",
                                "adjust-layout":true
                            },
                            "labels": labelsArray,
                            "scale-x": {
                                "label": {
                                    "text":"Date Range",
                                    "font-size": "14px",
                                    "font-weight": "normal",
                                    "offset-x": "10%",
                                    "font-angle": 360
                                },
                                "item": {
                                    "text-align": "center",
                                    "font-color": "#05636c"
                                },
                                "zooming": 1,

                                "labels": xArray,

                                "items-overlap": true,
                                "guide": {
                                    "line-width": "0px"
                                },
                                "tick": {
                                    "line-width": "2px"
                                },
                            },
                            "crosshair-x": {
                                "line-color":"#fff",
                                "line-width":1,
                                "plot-label": {
                                    "visible": false
                                }
                            },
                            "scale-y": {
                                "item": {
                                    "font-color": "#05636c",
                                    "font-weight": "normal"
                                },
                                "label":{
                                    "text":"Metrics",
                                    "font-size":"14px"
                                },
                                "guide": {
                                    "line-width": "0px",
                                    "alpha": 0.2,
                                    "line-style": "dashed"
                                }
                            },
                            "plot": {
                                "line-width": 2,
                                "marker": {
                                    "size": 1,
                                    "visible": false
                                },
                                "tooltip": {
                                    "font-family": "Roboto",
                                    "font-size": "14px",
                                    "text": "There were %v %t on %data-days",
                                    "text-align": "left"
                                }
                            },
                            "series": seriesArray
                        }
                    ]
                };
                ////////////////////
            });
        };


    }]);
