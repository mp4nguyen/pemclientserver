/**
 * Created by phuongnguyen on 13/01/16.
 */
angular.module('ocsApp.Authentication')
    .factory('CompanyFactory', ['Companies','$log','CalendarHoldings', function (Companies,$log,CalendarHoldings) {
        ///this factory use to get all information include dependency like Subsidiary/position/packages... of company and store in local, and then can be used later without connect to the server
        var companyData;
        var currentCompany = null;
        var currentUser = null;

        $log = $log.getInstance("ocsApp.Authentication.CompanyFactory");
        function init(callback) {
            Companies.initData(function(data,responseHeaders){
                console.log('>initData',data);
                companyData = data.initData;
                //console.log('>companyData',companyData);
                $log.debug("init company data get data from server");
                callback(companyData);

            },
            function(err){
                $log.error("init company failed",err);
            });
        };

        return {
            init: function (callback) {
                init(callback);
            },
            setCurrentCompany: function(company){
                currentCompany = company;
            },
            getCurrentCompany: function(){
                return currentCompany;
            },
            setCurrentUser: function(user){
                currentUser = user;
            },
            getCurrentUser: function(){
                return currentUser;
            },
            refreshSubsidiaryList: function(callback){
                //refresh the subsidiary list for Redimed Admin
                //get bookings
                Companies.getRediSubsidiaries(function(data){
                    $log.debug("refreshSubsidiaryList from server");
                    companyData.subsidiaries = data.subsidiaries;
                    callback(companyData);
                },
                function(err){
                    $log.error("init company failed",err);
                });
            },
            refreshBookingList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                Companies.listBookings(function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshBookingList from server");
                    companyData.allBookings = data.bookings;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshBookingList failed",err);
                });
            },
            refreshTelehealthBookingList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                Companies.listTelehealthBookings(function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshBookingList from server");
                    companyData.telehealthBookings = data.bookings;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshBookingList failed",err);
                });
            },
            refreshPositionList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                init(callback);
                /*
                Companies.positions({id:0},function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshPositionList from server");
                    companyData.positions = data;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshPositionList failed",err);
                });*/
            },
            refreshPackageList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                init(callback);
                /*
                Companies.packages({id:0},function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshPackageList from server");
                    console.log("refreshPackageList = ",data);
                    companyData.packages = data;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshPackageList failed",err);
                });
                */
            },
            refreshAllPackageList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                Companies.getPackages(function(data){
                        //,filter:{where:{candidatesName:'test'}}
                        $log.debug("refreshAllPackageList from server");
                        //console.log("refreshAllPackageList = ",data);
                        companyData.allViewPackages = data.packages;
                        callback(companyData);
                    },
                    function(err){
                        $log.error("refreshPackageList failed",err);
                    });
            },
            refreshAccountList : function(callback){
                //refresh the booking list after make an appointment
                //get bookings
                Companies.accounts({id:0},function(data){
                    //,filter:{where:{candidatesName:'test'}}
                    $log.debug("refreshAccountList from server");
                    companyData.accounts = data;
                    callback(companyData);
                },
                function(err){
                    $log.error("refreshAccountList failed",err);
                });
            },
            getCompanyId: function(){
                //console.log("getCompanyId=",companyData);
                return companyData == null ? null :companyData.id;
            },
            getCompany: function (callback) {
                if(companyData) {
                    $log.debug("getCompany from memory");
                    callback(companyData);
                } else {
                    init(callback);
                }
            }
        };
    }])
    .factory('RedimedSiteFactory', ['Companies','$log','CalendarHoldings', function (Companies,$log,CalendarHoldings) {
        //this factory use to get all information of RedimedSites for Pre-employment booking
        //Also get the states and subsurb for each site if having
        var siteData;
        $log = $log.getInstance("RedimedSiteFactory");
        return {
            getSite: function (callback) {
                if(siteData) {
                    $log.debug("getSite from memory");
                    callback(siteData);
                } else {
                    //Get Sites
                    Companies.getSites(function(data){
                        $log.debug("getSite from server");
                        //console.log(data);
                        siteData = data.sites;
                        callback(siteData);
                    },
                    function(err){
                        $log.error("getSite from server failed",err);
                    });
                }
            },
            getCalendar: function(siteID,fromDate,toDate,callback){
                Companies.getCalendars({id:siteID,from:fromDate,to:toDate},function(data){
                    $log.debug("getCalendar from server");
                    callback(data.calendars);
                },
                function(err){
                    $log.error("getCalendar from server failed",err);
                });
            },
            setHolding: function(pCalendarID,callback){
                $log.debug("Will set holding calID = " + pCalendarID );
                CalendarHoldings.create({holdingId:0,calendarId:pCalendarID},function(data){
                    $log.debug("Hold the calendar =",data);
                    callback(data);
                },
                function(err){
                    $log.error("Holding from server failed",err);
                });
            },
            removeHolding: function(pHoldingId,pCalendarID,callback){
                $log.debug("Will remove holding calID = " + pCalendarID );
                CalendarHoldings.deleteById({id:pHoldingId},function(data){
                    $log.debug("Remove the calendar =",data);
                    callback(data);
                },
                function(err){
                    $log.error("Holding from server failed",err);
                });
            }
        };
    }])
    .factory('BookingStatusFactory', ['Companies','$log', function (Companies,$log) {
        //this factory use to get all information of RedimedSites for Pre-employment booking
        //Also get the states and subsurb for each site if having
        var statusData;
        $log = $log.getInstance("BookingStatusFactory");
        return {
            getStatus: function (callback) {
                if(statusData) {
                    $log.debug("getStatus from memory");
                    callback(statusData);
                } else {
                    //Get Sites
                    Companies.getStatus(function(data){
                        $log.debug("getStatus from server",data);
                        statusData = data.status;
                        callback(statusData);
                    },
                    function(err){
                        $log.error("getStatus from server failed",err);
                    });
                }
            }
        };
    }]);
